import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Types "types/common";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import GcpIngestion "gcp/GcpIngestion";
import Azure "azure/AzureIngestion";
import AwsIngestion "aws/AwsIngestion";
import Norm "normalization/AlertNormalization";
import Assets "assets/AssetInventory";
import Compliance "compliance/ComplianceEngine";
import Alerting "alerting/AlertingEngine";
import WebhookHandler "webhook/WebhookHandler";
import FailedIngestionStore "webhook/FailedIngestionStore";
import PipelineMetrics "webhook/PipelineMetrics";
import Float "mo:core/Float";
import CorrelationEngine "correlation/CorrelationEngine";
import ThreatIntel "enrichment/ThreatIntelEnrichment";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Option "mo:core/Option";
import Result "mo:core/Result";

actor {

  // ── Stable state (initialised by migration chain) ─────────────────────────

  var awsCredentials : ?Types.AwsCredentials;
  var azureCredentials : ?Types.AzureCredentials;
  var gcpCredentials : ?Types.GcpCredentials;
  var awsPollingState : Types.ProviderPollingState;
  var azurePollingState : Types.ProviderPollingState;
  var gcpPollingState : Types.ProviderPollingState;
  let rawFindings : List.List<Types.RawFinding>;
  var findingsDayBucket : Text;

  // ── Module 2-5 stable state (initialised by migration chain) ─────────────

  var normalizedAlerts : List.List<(Text, Types.NormalizedAlert)>;
  var assets : List.List<(Text, Types.Asset)>;
  let complianceControls : List.List<(Text, Types.ComplianceControl)>;
  let complianceTrend : List.List<Types.ComplianceTrendEntry>;
  var alertRules : List.List<(Text, Types.AlertRule)>;
  var notificationLogs : List.List<(Text, Types.NotificationLog)>;
  let timelineEvents : List.List<Types.TimelineEvent>;
  let auditLog : List.List<Types.AuditLogEntry>;
  var lastComplianceSnapshotWeek : Text;

  // ── Auth error stable state (initialised by migration chain) ─────────────
  // Persists across restarts so the UI can show last-known auth error

  var awsAuthError : ?Text;
  var azureAuthError : ?Text;
  var gcpAuthError : ?Text;

  // ── Phase 2 — Webhook ingestion stable state ──────────────────────────────

  let failedIngestions : List.List<Types.FailedIngestion>;
  let pipelineEvents : List.List<PipelineMetrics.IngestionEvent>;
  // ── Phase 3 — Correlation Engine stable state (initialised by migration chain) ──

  var correlatedIncidents : [(Text, Types.CorrelatedIncident)];
  var correlationIntervalMinutes : Nat;
  var lastCorrelationRunNs : Int;

  // ── Security refactor stable state ────────────────────────────────────────
  // processingOffset: cursor for batched raw-finding processing (max 50 per heartbeat)
  var processingOffset : Nat;
  // dirtyAssets: IDs of assets whose risk score needs recalculation
  var dirtyAssets : [Text];

  // ── Phase 6 — Enrichment API keys (stable, never returned to frontend) ────
  var enrichmentApiKeys : { abuseIpdbKey : ?Text; virusTotalKey : ?Text };

  // ── Phase 6 — Known malicious IP feed (stable, refreshed every 6h) ───────
  var maliciousIpFeed : [Text];
  var lastMaliciousIpFeedPoll : ?Int;

  // ── Phase 7 — Generated reports (stable) ─────────────────────────────────
  var generatedReports : [Types.GeneratedReport];
  var reportEmailConfigs : [Types.ReportEmailConfig];

  // ── In-memory token caches (NOT stable — discarded on restart) ────────────
  // Short-lived tokens are never written to stable memory per least-privilege policy

  transient var awsSessionCache : ?Types.AwsSessionToken = null;
  transient var azureTokenCache : ?{ token : Text; expiryNs : Int } = null;
  transient var gcpTokenCache : ?{ token : Text; expiryNs : Int } = null;

  // ── In-memory refresh-in-progress guards (transient — prevents concurrent outcall storms) ──
  transient var awsRefreshInProgress : Bool = false;
  transient var azureRefreshInProgress : Bool = false;
  transient var gcpRefreshInProgress : Bool = false;

  // ── Correlation engine concurrency guard (transient — prevents stacking) ──
  transient var correlationRunning : Bool = false;

  // ── HTTP outcall transform (required by the http-outcalls extension) ──────

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ── Inbound webhook handler (http_request_update for POST endpoints) ──────
  // http_request is a query and cannot write state; POST webhooks must use
  // http_request_update so the canister can store the ingested findings.

  public func http_request_update(request : {
    url     : Text;
    method  : Text;
    headers : [(Text, Text)];
    body    : Blob;
  }) : async {
    status_code        : Nat16;
    headers            : [(Text, Text)];
    body               : Blob;
    streaming_strategy : ?Null;
    upgrade            : ?Bool;
  } {
    let responseHeaders = [("Content-Type", "text/plain")];

    // Only handle POST
    if (request.method != "POST") {
      return {
        status_code        = 405;
        headers            = responseHeaders;
        body               = "Method Not Allowed".encodeUtf8();
        streaming_strategy = null;
        upgrade            = null;
      };
    };

    let bodyText = switch (request.body.decodeUtf8()) {
      case (?t) t;
      case null {
        return {
          status_code        = 400;
          headers            = responseHeaders;
          body               = "Invalid UTF-8 body".encodeUtf8();
          streaming_strategy = null;
          upgrade            = null;
        };
      };
    };

    let nowNs = Time.now();

    // Helper: validate and truncate text fields from webhook payloads
    func clampField(t : Text, maxLen : Nat) : Text {
      if (t.size() <= maxLen) t
      else Text.fromIter(t.toIter().toArray().sliceToArray(0, maxLen).values())
    };

    // Helper: store a failed ingestion and record a failed metric event.
    func storeFailure(provider : Types.ProviderType, errorType : Text, errMsg : Text) {
      let failId = nowNs.toText() # "-" # errorType;
      FailedIngestionStore.addFailedIngestion(failedIngestions, {
        id           = failId;
        provider;
        errorType;
        rawPayload   = bodyText;
        timestamp    = nowNs;
        errorMessage = errMsg;
        status       = "FailedParse";
      });
      PipelineMetrics.recordIngestionEvent(
        pipelineEvents, provider, #Webhook, false, 0.0, nowNs
      );
    };

    // Helper: store a raw finding only — decoupled from normalization.
    // Normalization is deferred to the heartbeat's processRawFindingsIntoAlerts() batch.
    // A03 — Validates and clamps extracted field lengths before storage.
    func storeRawOnly(provider : Types.ProviderType, extracted : WebhookHandler.ExtractedFinding) {
      let safeExtracted : WebhookHandler.ExtractedFinding = {
        resourceId    = clampField(extracted.resourceId, 512);
        cloudProvider = clampField(extracted.cloudProvider, 64);
        attackVector  = clampField(extracted.attackVector, 512);
        timestamp     = extracted.timestamp;
        severity      = extracted.severity;
        accountId     = clampField(extracted.accountId, 128);
        region        = clampField(extracted.region, 64);
      };
      let rawFinding : Types.RawFinding = {
        id          = nowNs.toText() # "-webhook-" # (switch (provider) { case (#AWS) "AWS"; case (#Azure) "Azure"; case (#GCP) "GCP" });
        provider;
        findingId   = safeExtracted.resourceId # "-" # safeExtracted.attackVector;
        timestamp   = nowNs;
        severity    = safeExtracted.severity;
        title       = safeExtracted.attackVector;
        description = "Webhook ingested finding from " # safeExtracted.cloudProvider;
        region      = ?(safeExtracted.region);
        accountId   = ?(safeExtracted.accountId);
        rawMetadata = bodyText;
      };
      // Store raw finding first — no inline normalization.
      rawFindings.add(rawFinding);
      PipelineMetrics.recordIngestionEvent(
        pipelineEvents, provider, #Webhook, true, 0.0, nowNs
      );
    };

    // Route on URL path
    if (request.url == "/webhook/aws" or request.url.startsWith(#text "/webhook/aws")) {
      switch (WebhookHandler.parseGuardDutyPayload(bodyText)) {
        case (#err(msg)) {
          storeFailure(#AWS, "ParseError", msg);
          return {
            status_code        = 400;
            headers            = responseHeaders;
            body               = ("Bad Request: " # msg).encodeUtf8();
            streaming_strategy = null;
            upgrade            = null;
          };
        };
        case (#ok(extracted)) {
          storeRawOnly(#AWS, extracted);
        };
      };
    } else if (request.url == "/webhook/azure" or request.url.startsWith(#text "/webhook/azure")) {
      switch (WebhookHandler.parseAzureDefenderPayload(bodyText)) {
        case (#err(msg)) {
          storeFailure(#Azure, "ParseError", msg);
          return {
            status_code        = 400;
            headers            = responseHeaders;
            body               = ("Bad Request: " # msg).encodeUtf8();
            streaming_strategy = null;
            upgrade            = null;
          };
        };
        case (#ok(extracted)) {
          storeRawOnly(#Azure, extracted);
        };
      };
    } else if (request.url == "/webhook/gcp" or request.url.startsWith(#text "/webhook/gcp")) {
      switch (WebhookHandler.parseGcpSccPayload(bodyText)) {
        case (#err(msg)) {
          storeFailure(#GCP, "ParseError", msg);
          return {
            status_code        = 400;
            headers            = responseHeaders;
            body               = ("Bad Request: " # msg).encodeUtf8();
            streaming_strategy = null;
            upgrade            = null;
          };
        };
        case (#ok(extracted)) {
          storeRawOnly(#GCP, extracted);
        };
      };
    } else {
      return {
        status_code        = 404;
        headers            = responseHeaders;
        body               = "Not Found".encodeUtf8();
        streaming_strategy = null;
        upgrade            = null;
      };
    };
    // Normalization and correlation run in the next heartbeat; no inline calls here.

    {
      status_code        = 200;
      headers            = responseHeaders;
      body               = "OK".encodeUtf8();
      streaming_strategy = null;
      upgrade            = null;
    };
  };

  /// System heartbeat: run correlation engine, process pending raw findings,
  /// and recalculate dirty asset scores — all bounded to avoid unbounded work.
  system func heartbeat() : async () {
    let nowNs = Time.now();
    let intervalNs : Int = correlationIntervalMinutes.toInt() * 60_000_000_000;
    if (nowNs - lastCorrelationRunNs > intervalNs) {
      runCorrelationEngine();
    };
    // Process next batch of raw findings (max 50 per heartbeat)
    await processRawFindingsIntoAlerts();
    // Recalculate risk scores for dirty assets only
    recalcDirtyAssets();
    // Refresh malicious IP feed every 6 hours
    let sixHoursNs : Int = 21_600_000_000_000;
    let shouldRefreshFeed = switch (lastMaliciousIpFeedPoll) {
      case null true;
      case (?last) { nowNs - last > sixHoursNs };
    };
    if (shouldRefreshFeed) {
      await refreshMaliciousIpFeed();
    };
  };

  // http_request query — upgrade POST webhook paths to http_request_update.
  // All other requests (GET health checks, etc.) return 200.
  public query func http_request(request : {
    url     : Text;
    method  : Text;
    headers : [(Text, Text)];
    body    : Blob;
  }) : async {
    status_code        : Nat16;
    headers            : [(Text, Text)];
    body               : Blob;
    streaming_strategy : ?Null;
    upgrade            : ?Bool;
  } {
    let isWebhookPost =
      request.method == "POST" and (
        request.url == "/webhook/aws"   or request.url.startsWith(#text "/webhook/aws")   or
        request.url == "/webhook/azure" or request.url.startsWith(#text "/webhook/azure") or
        request.url == "/webhook/gcp"   or request.url.startsWith(#text "/webhook/gcp")
      );
    if (isWebhookPost) {
      // Signal the runtime to upgrade this call to http_request_update
      return {
        status_code        = 200;
        headers            = [];
        body               = "".encodeUtf8();
        streaming_strategy = null;
        upgrade            = ?true;
      };
    };
    {
      status_code        = 200;
      headers            = [("Content-Type", "text/plain")];
      body               = "SecOps Platform canister".encodeUtf8();
      streaming_strategy = null;
      upgrade            = null;
    };
  };

  // ── Auth audit logging ────────────────────────────────────────────────────

  /// Log an authentication event to the audit trail.
  /// eventType: 'TokenAcquired' | 'TokenRefreshed' | 'AuthFailure' | 'PermissionError' | 'ProviderPaused' | 'ProviderResumed'
  func logAuthEvent(provider : Text, eventType : Text, message : Text) {
    let entry : Types.AuditLogEntry = {
      id        = Time.now().toText() # "-auth-" # provider;
      timestamp = Time.now();
      actorId   = "system";
      action    = eventType;
      details   = "[" # provider # "] " # message;
      customer  = "";
    };
    auditLog.add(entry);
  };

  // ── Internal helpers ──────────────────────────────────────────────────────

  /// Return today's day-bucket string (seconds-since-epoch / 86400).
  func todayBucket() : Text {
    let secs = Time.now() / 1_000_000_000;
    (secs / 86400).toText();
  };

  /// Apply pause logic after a failed poll: increment failures, pause at threshold.
  func applyPauseLogic(
    provider : Types.ProviderType,
    state : Types.ProviderPollingState,
    errMsg : Text
  ) : Types.ProviderPollingState {
    let newFailures = state.consecutiveFailures + 1;
    let newStatus = if (newFailures >= 3) #AuthPaused else #Error;
    if (newFailures >= 3) {
      let provName = switch (provider) { case (#AWS) "AWS"; case (#Azure) "Azure"; case (#GCP) "GCP" };
      switch (provider) {
        case (#AWS)   { awsAuthError := ?errMsg };
        case (#Azure) { azureAuthError := ?errMsg };
        case (#GCP)   { gcpAuthError := ?errMsg };
      };
      logAuthEvent(provName, "ProviderPaused", "Provider paused after " # newFailures.toText() # " consecutive failures: " # errMsg);
    };
    {
      provider = state.provider;
      status = newStatus;
      lastSuccessfulPoll = state.lastSuccessfulPoll;
      lastPollAttempt = ?Time.now();
      findingsToday = state.findingsToday;
      consecutiveFailures = newFailures;
      lastError = ?errMsg;
      interval = state.interval;
    };
  };

  /// Reset provider state after a successful poll.
  func applySuccessLogic(
    provider : Types.ProviderType,
    state : Types.ProviderPollingState,
    nowNs : Int,
    newCount : Nat
  ) : Types.ProviderPollingState {
    let wasPaused = state.status == #AuthPaused;
    switch (provider) {
      case (#AWS)   { awsAuthError := null };
      case (#Azure) { azureAuthError := null };
      case (#GCP)   { gcpAuthError := null };
    };
    if (wasPaused) {
      let provName = switch (provider) { case (#AWS) "AWS"; case (#Azure) "Azure"; case (#GCP) "GCP" };
      logAuthEvent(provName, "ProviderResumed", "Provider resumed after successful authentication");
    };
    {
      provider = state.provider;
      status = #Active;
      lastSuccessfulPoll = ?nowNs;
      lastPollAttempt = ?nowNs;
      findingsToday = state.findingsToday + newCount;
      consecutiveFailures = 0;
      lastError = null;
      interval = state.interval;
    };
  };

  /// Filter rawFindings for a specific provider (paginated, max 500).
  func findingsForProvider(
    provider : Types.ProviderType,
    limit    : Nat,
    offset   : Nat
  ) : { items : [Types.RawFinding]; totalCount : Nat; hasMore : Bool } {
    let effectiveLimit = if (limit == 0) 100 else if (limit > 500) 500 else limit;
    let all = rawFindings.toArray().filter(func(f) {
      switch (f.provider, provider) {
        case (#AWS,   #AWS)   true;
        case (#Azure, #Azure) true;
        case (#GCP,   #GCP)   true;
        case _                false;
      };
    });
    let totalCount = all.size();
    let start = if (offset >= totalCount) totalCount else offset;
    let end_  = if (start + effectiveLimit < totalCount) start + effectiveLimit else totalCount;
    let items = all.sliceToArray(start, end_);
    { items; totalCount; hasMore = end_ < totalCount };
  };

  // ── Authorization guard ──────────────────────────────────────────────────

  /// Returns true for any caller that has previously saved credentials (provisional
  /// admin check). In a full multi-tenant deployment this would verify against a
  /// dedicated admin principal set. The check is intentionally permissive for the
  /// first authenticated call (saving credentials) but rejects anonymous principal.
  func isAuthorized(caller : Principal) : Bool {
    // Reject the anonymous principal unconditionally.
    not caller.isAnonymous()
  };

  /// Trap with an Unauthorized error and log the attempt.
  func requireAuth(caller : Principal, fnName : Text) {
    if (not isAuthorized(caller)) {
      addAuditEntry(caller.toText(), "Unauthorized", "Rejected call to " # fnName, "");
      Runtime.trap("Unauthorized");
    };
  };

  // ── Credential Management ────────────────────────────────────────────────

  /// Store AWS credentials (role ARN + optional external ID + regions) in the canister.
  public shared ({ caller }) func saveAwsCredentials(creds : Types.AwsCredentials) : async () {
    requireAuth(caller, "saveAwsCredentials");
    awsCredentials := ?creds;
    awsSessionCache := null; // invalidate cached token on credential change
    addAuditEntry(caller.toText(), "CredentialSaved", "AWS credentials updated (roleArn redacted)", "");
  };

  /// Store Azure credentials (client ID/secret/tenant + subscriptions) in the canister.
  public shared ({ caller }) func saveAzureCredentials(creds : Types.AzureCredentials) : async () {
    requireAuth(caller, "saveAzureCredentials");
    azureCredentials := ?creds;
    azureTokenCache := null; // invalidate cached token on credential change
    addAuditEntry(caller.toText(), "CredentialSaved", "Azure credentials updated (clientId=" # creds.clientId # ", secret redacted)", "");
  };

  /// Store GCP credentials (service account JSON + project IDs) in the canister.
  public shared ({ caller }) func saveGcpCredentials(creds : Types.GcpCredentials) : async () {
    requireAuth(caller, "saveGcpCredentials");
    gcpCredentials := ?creds;
    gcpTokenCache := null; // invalidate cached token on credential change
    addAuditEntry(caller.toText(), "CredentialSaved", "GCP credentials updated (serviceAccountJson redacted)", "");
  };

  // ── Polling State & Stats ─────────────────────────────────────────────────

  /// Return per-provider polling state (status, last poll time, error info).
  public query func getProviderStates() : async [Types.ProviderPollingState] {
    [awsPollingState, azurePollingState, gcpPollingState];
  };

  /// Return aggregated ingestion statistics for the dashboard.
  public query func getIngestionStats() : async Types.IngestionStats {
    let activeProviders =
      (switch (awsCredentials)   { case null 0; case _ 1 }) +
      (switch (azureCredentials) { case null 0; case _ 1 }) +
      (switch (gcpCredentials)   { case null 0; case _ 1 });
    {
      totalFindingsToday =
        awsPollingState.findingsToday +
        azurePollingState.findingsToday +
        gcpPollingState.findingsToday;
      activeProviders;
      providerStates = [awsPollingState, azurePollingState, gcpPollingState];
    };
  };

  // ── Raw Findings ──────────────────────────────────────────────────────────

  /// Return paginated raw findings for a given provider.
  /// limit: max items to return (default 100, max 500). offset: starting index.
  public query func getRawFindings(
    provider : Types.ProviderType,
    limit    : Nat,
    offset   : Nat
  ) : async { items : [Types.RawFinding]; totalCount : Nat; hasMore : Bool } {
    findingsForProvider(provider, limit, offset);
  };

  // ── Connection Testing ────────────────────────────────────────────────────

  /// Validate stored AWS credentials against the live API.
  public shared ({ caller }) func testAwsConnection() : async Types.ConnectionTestResult {
    requireAuth(caller, "testAwsConnection");
    switch (awsCredentials) {
      case null { #Failure("No AWS credentials configured") };
      case (?creds) {
        await AwsIngestion.testConnection(creds, transform);
      };
    };
  };

  /// Validate stored Azure credentials against the live API.
  public shared ({ caller }) func testAzureConnection() : async Types.ConnectionTestResult {
    requireAuth(caller, "testAzureConnection");
    switch (azureCredentials) {
      case null     { #Failure("No Azure credentials configured") };
      case (?creds) { await Azure.testConnection(creds, transform) };
    };
  };

  /// Validate stored GCP credentials against the live API.
  public shared ({ caller }) func testGcpConnection() : async Types.ConnectionTestResult {
    requireAuth(caller, "testGcpConnection");
    switch (gcpCredentials) {
      case null { #Failure("No GCP credentials configured") };
      case (?creds) {
        await GcpIngestion.testConnection(creds, transform);
      };
    };
  };

  // ── Credential Health ─────────────────────────────────────────────────────

  /// Return the health status of each provider's credentials.
  /// Checks in-memory token cache expiry; no network call.
  public query func getCredentialHealth() : async [Types.CredentialHealthStatus] {
    let fiveMinNs : Int = 5 * 60 * 1_000_000_000;
    let now = Time.now();

    // AWS health
    let awsHealth : Types.CredentialHealthStatus = switch (awsCredentials) {
      case null { { provider = "AWS"; health = #Error("No credentials configured"); expiryNs = null } };
      case (?_) {
        switch (awsAuthError) {
          case (?err) { { provider = "AWS"; health = #Error(err); expiryNs = null } };
          case null {
            switch (awsSessionCache) {
              case null { { provider = "AWS"; health = #Authenticating; expiryNs = null } };
              case (?cache) {
                let remaining = cache.expiryNs - now;
                if (remaining <= 0) {
                  { provider = "AWS"; health = #Expired; expiryNs = ?cache.expiryNs };
                } else if (remaining <= fiveMinNs) {
                  { provider = "AWS"; health = #ExpiringSoon("Expires in less than 5 minutes"); expiryNs = ?cache.expiryNs };
                } else {
                  { provider = "AWS"; health = #Valid; expiryNs = ?cache.expiryNs };
                };
              };
            };
          };
        };
      };
    };

    // Azure health
    let azureHealth : Types.CredentialHealthStatus = switch (azureCredentials) {
      case null { { provider = "Azure"; health = #Error("No credentials configured"); expiryNs = null } };
      case (?_) {
        switch (azureAuthError) {
          case (?err) { { provider = "Azure"; health = #Error(err); expiryNs = null } };
          case null {
            switch (azureTokenCache) {
              case null { { provider = "Azure"; health = #Authenticating; expiryNs = null } };
              case (?cache) {
                let remaining = cache.expiryNs - now;
                if (remaining <= 0) {
                  { provider = "Azure"; health = #Expired; expiryNs = ?cache.expiryNs };
                } else if (remaining <= fiveMinNs) {
                  { provider = "Azure"; health = #ExpiringSoon("Expires in less than 5 minutes"); expiryNs = ?cache.expiryNs };
                } else {
                  { provider = "Azure"; health = #Valid; expiryNs = ?cache.expiryNs };
                };
              };
            };
          };
        };
      };
    };

    // GCP health
    let gcpHealth : Types.CredentialHealthStatus = switch (gcpCredentials) {
      case null { { provider = "GCP"; health = #Error("No credentials configured"); expiryNs = null } };
      case (?_) {
        switch (gcpAuthError) {
          case (?err) { { provider = "GCP"; health = #Error(err); expiryNs = null } };
          case null {
            switch (gcpTokenCache) {
              case null { { provider = "GCP"; health = #Authenticating; expiryNs = null } };
              case (?cache) {
                let remaining = cache.expiryNs - now;
                if (remaining <= 0) {
                  { provider = "GCP"; health = #Expired; expiryNs = ?cache.expiryNs };
                } else if (remaining <= fiveMinNs) {
                  { provider = "GCP"; health = #ExpiringSoon("Expires in less than 5 minutes"); expiryNs = ?cache.expiryNs };
                } else {
                  { provider = "GCP"; health = #Valid; expiryNs = ?cache.expiryNs };
                };
              };
            };
          };
        };
      };
    };

    [awsHealth, azureHealth, gcpHealth];
  };

  // ── Ingestion Control ─────────────────────────────────────────────────────

  /// Trigger an immediate poll for the specified provider.
  public shared ({ caller }) func triggerPoll(provider : Types.ProviderType) : async () {
    requireAuth(caller, "triggerPoll");
    switch (provider) {
      case (#Azure) {
        switch (azureCredentials) {
          case null {};
          case (?creds) {
            azureRefreshInProgress := true;
            let azurePollResult = try {
              ?(await Azure.pollAzure(
                azurePollingState, creds, transform,
                azureTokenCache, azureRefreshInProgress
              ))
            } catch (_e) { azureRefreshInProgress := false; null };
            azureRefreshInProgress := false;
            switch (azurePollResult) {
              case null {};
              case (?(newState, newFindings)) {
                azureTokenCache := Azure.getUpdatedTokenCache(azureTokenCache, newState);
                if (newState.status == #Error or newState.status == #AuthPaused) {
                  let errMsg = switch (newState.lastError) { case (?e) e; case null "Unknown error" };
                  azurePollingState := applyPauseLogic(#Azure, azurePollingState, errMsg);
                } else {
                  azurePollingState := applySuccessLogic(#Azure, azurePollingState, Time.now(), newFindings.size());
                  for (f in newFindings.vals()) { rawFindings.add(f) };
                  logAuthEvent("Azure", "TokenRefreshed", "Successful poll completed");
                };
              };
            };
          };
        };
      };
      case (#GCP) {
        switch (gcpCredentials) {
          case null {};
          case (?creds) {
            let today = todayBucket();
            let currentState = if (today != findingsDayBucket) {
              GcpIngestion.makeState(
                #GCP,
                gcpPollingState.status,
                gcpPollingState.lastSuccessfulPoll,
                gcpPollingState.lastPollAttempt,
                0,
                gcpPollingState.consecutiveFailures,
                gcpPollingState.lastError,
                gcpPollingState.interval
              );
            } else gcpPollingState;
            gcpRefreshInProgress := true;
            let gcpPollResult = try {
              ?(await GcpIngestion.pollGcp(
                currentState, creds, transform, gcpTokenCache, gcpRefreshInProgress
              ))
            } catch (_e) { gcpRefreshInProgress := false; null };
            gcpRefreshInProgress := false;
            switch (gcpPollResult) {
              case null {};
              case (?(newState, newFindings)) {
                gcpTokenCache := GcpIngestion.getUpdatedTokenCache(gcpTokenCache, newState);
                findingsDayBucket := today;
                if (newState.status == #Error or newState.status == #AuthPaused) {
                  let errMsg = switch (newState.lastError) { case (?e) e; case null "Unknown error" };
                  gcpPollingState := applyPauseLogic(#GCP, gcpPollingState, errMsg);
                } else {
                  gcpPollingState := applySuccessLogic(#GCP, currentState, Time.now(), newFindings.size());
                  for (f in newFindings.vals()) { rawFindings.add(f) };
                  logAuthEvent("GCP", "TokenRefreshed", "Successful poll completed");
                };
              };
            };
          };
        };
      };
      case (#AWS) {
        switch (awsCredentials) {
          case null {};
          case (?creds) {
            let today = todayBucket();
            let currentState = if (today != findingsDayBucket) {
              AwsIngestion.makeState(awsPollingState.interval);
            } else awsPollingState;
            awsRefreshInProgress := true;
            let awsPollResult = try {
              ?(await AwsIngestion.pollAws(
                currentState, creds, transform, awsSessionCache, awsRefreshInProgress
              ))
            } catch (_e) { awsRefreshInProgress := false; null };
            awsRefreshInProgress := false;
            switch (awsPollResult) {
              case null {};
              case (?(newState, newFindings, updatedAwsSession)) {
                awsSessionCache := updatedAwsSession;
                findingsDayBucket := today;
                if (newState.status == #Error or newState.status == #AuthPaused) {
                  let errMsg = switch (newState.lastError) { case (?e) e; case null "Unknown error" };
                  awsPollingState := applyPauseLogic(#AWS, awsPollingState, errMsg);
                } else {
                  awsPollingState := applySuccessLogic(#AWS, currentState, Time.now(), newFindings.size());
                  for (f in newFindings.vals()) { rawFindings.add(f) };
                  logAuthEvent("AWS", "TokenRefreshed", "Successful STS session and poll completed");
                };
              };
            };
          };
        };
      };
    };
  };

  /// Update the polling interval for a specific provider.
  public shared ({ caller }) func setPollingInterval(provider : Types.ProviderType, interval : Types.PollingInterval) : async () {
    requireAuth(caller, "setPollingInterval");
    switch (provider) {
      case (#AWS)   {
        awsPollingState := {
          provider = awsPollingState.provider; status = awsPollingState.status;
          lastSuccessfulPoll = awsPollingState.lastSuccessfulPoll;
          lastPollAttempt = awsPollingState.lastPollAttempt;
          findingsToday = awsPollingState.findingsToday;
          consecutiveFailures = awsPollingState.consecutiveFailures;
          lastError = awsPollingState.lastError; interval;
        };
      };
      case (#Azure) {
        azurePollingState := {
          provider = azurePollingState.provider; status = azurePollingState.status;
          lastSuccessfulPoll = azurePollingState.lastSuccessfulPoll;
          lastPollAttempt = azurePollingState.lastPollAttempt;
          findingsToday = azurePollingState.findingsToday;
          consecutiveFailures = azurePollingState.consecutiveFailures;
          lastError = azurePollingState.lastError; interval;
        };
      };
      case (#GCP) {
        gcpPollingState := GcpIngestion.makeState(
          #GCP,
          gcpPollingState.status,
          gcpPollingState.lastSuccessfulPoll,
          gcpPollingState.lastPollAttempt,
          gcpPollingState.findingsToday,
          gcpPollingState.consecutiveFailures,
          gcpPollingState.lastError,
          interval
        );
      };
    };
  };

  // ── Guard ─────────────────────────────────────────────────────────────────

  /// Returns true if credentials have been saved for at least one provider.
  public query func hasAdminCredentials() : async Bool {
    switch (awsCredentials, azureCredentials, gcpCredentials) {
      case (null, null, null) false;
      case _                  true;
    };
  };

  // ── Private helpers (Modules 2-5) ─────────────────────────────────────────

  /// Prepend a timeline event to the stable list.
  func addTimelineEvent(event : Types.TimelineEvent) {
    timelineEvents.add(event);
  };

  /// Create and prepend an audit log entry.
  func addAuditEntry(actor_ : Text, action : Text, details : Text, customer : Text) {
    let entry : Types.AuditLogEntry = {
      id        = Time.now().toText();
      timestamp = Time.now();
      actorId   = actor_;
      action;
      details;
      customer;
    };
    auditLog.add(entry);
  };
  // ── Phase 3 — Correlation Engine ─────────────────────────────────────────

  /// Run the correlation engine against all current normalised alerts.
  /// Guarded by correlationRunning to prevent concurrent stacking.
  /// Deduplicates new incidents against existing ones and appends only truly new incidents.
  func runCorrelationEngine() {
    // Concurrency guard: skip if already running
    if (correlationRunning) return;
    correlationRunning := true;
    let alertArr : [(Text, Types.NormalizedAlert)] = normalizedAlerts.toArray();
    let newIncidents = CorrelationEngine.runAllPatterns(correlatedIncidents, alertArr);
    var updated = correlatedIncidents;
    for (inc in newIncidents.vals()) {
      // Idempotency: skip if an incident with same incidentId already exists
      let alreadyExists = updated.find(
        func((id, _)) { Text.equal(id, inc.incidentId) }
      );
      switch (alreadyExists) {
        case (null) {
          updated := updated.concat([(inc.incidentId, inc)]);
          addAuditEntry("system", "CorrelationIncidentCreated",
            inc.incidentType # " detected: " # inc.incidentId, inc.customer);
        };
        case (?_) {};
      };
    };
    correlatedIncidents := updated;
    lastCorrelationRunNs := Time.now();
    correlationRunning := false;
  };

  /// Process a batch of raw findings through the normalization engine.
  /// Processes at most 50 raw findings per invocation starting from processingOffset.
  /// Marks affected assets dirty instead of recalculating all scores eagerly.
  func processRawFindingsIntoAlerts() : async () {
    let rfArr  = rawFindings.toArray();
    let total  = rfArr.size();
    if (processingOffset >= total) {
      processingOffset := 0; // reset when fully caught up
      return;
    };

    let batchSize : Nat = 50;
    let batchEnd  = if (processingOffset + batchSize < total) processingOffset + batchSize else total;
    let batch     = rfArr.sliceToArray(processingOffset, batchEnd);

    let alArr  = normalizedAlerts.toArray();
    let asArr  = assets.toArray();

    var updatedAlerts = alArr;
    var updatedAssets = asArr;
    var newDirty : [Text] = dirtyAssets;

    for (rf in batch.vals()) {
      let newAlert = Norm.normalizeRawFinding(rf, ?#Poll);
      let (isNew, alertToStore) = Norm.deduplicateAlert(updatedAlerts, newAlert);
      if (isNew) {
        // Auto-enrich new alert if API keys are configured
        let enrichedAlert : Types.NormalizedAlert = if (
          enrichmentApiKeys.abuseIpdbKey.isSome() or
          enrichmentApiKeys.virusTotalKey.isSome()
        ) {
          let abuseKey = switch (enrichmentApiKeys.abuseIpdbKey) { case (?k) k; case null "" };
          let vtKey    = switch (enrichmentApiKeys.virusTotalKey) { case (?k) k; case null "" };
          let enrichResult = await ThreatIntel.enrichAlert(
            alertToStore, abuseKey, vtKey, maliciousIpFeed, transform
          );
          { alertToStore with enrichment = ?enrichResult };
        } else {
          alertToStore;
        };
        updatedAlerts := [(enrichedAlert.id, enrichedAlert)].concat(updatedAlerts);
        // Extract and deduplicate assets from new finding
        let extractedAssets = Assets.extractAssetsFromFinding(enrichedAlert);
        for (a in extractedAssets.vals()) {
          let (_, assetToStore) = Assets.deduplicateAsset(updatedAssets, a);
          let existsAlready = updatedAssets.find<(Text, Types.Asset)>(func((id, _)) { id == a.id }) != null;
          if (existsAlready) {
            updatedAssets := updatedAssets.map<(Text, Types.Asset), (Text, Types.Asset)>(
              func((id, existing)) {
                if (id == a.id) (id, assetToStore) else (id, existing);
              }
            );
          } else {
            updatedAssets := [(a.id, assetToStore)].concat(updatedAssets);
          };
          // Mark asset dirty for deferred risk recalculation
          if (newDirty.find<Text>(func(aid) { Text.equal(aid, a.id) }) == null) {
            newDirty := newDirty.concat([a.id]);
          };
        };
        // Add timeline event
        addTimelineEvent({
          id          = enrichedAlert.id # "-timeline";
          timestamp   = enrichedAlert.timestamp;
          eventType   = "NewAlert";
          title       = enrichedAlert.title;
          description = enrichedAlert.description;
          provider    = ?enrichedAlert.provider;
          severity    = ?enrichedAlert.severity;
          customer    = enrichedAlert.customer;
        });
        // Audit log entry
        addAuditEntry("system", "AlertIngested", "New alert: " # enrichedAlert.id, enrichedAlert.customer);
      } else {
        // Update existing entry
        updatedAlerts := updatedAlerts.map<(Text, Types.NormalizedAlert), (Text, Types.NormalizedAlert)>(
          func((id, existing)) {
            if (id == alertToStore.id) (id, alertToStore) else (id, existing);
          }
        );
      };
    };

    // Advance or reset cursor
    processingOffset := if (batchEnd >= total) 0 else batchEnd;

    normalizedAlerts := List.fromArray(updatedAlerts);
    assets           := List.fromArray(updatedAssets);
    dirtyAssets      := newDirty;
  };

  /// Recalculate risk scores only for dirty assets.
  func recalcDirtyAssets() {
    if (dirtyAssets.size() == 0) return;
    let alArr = normalizedAlerts.toArray();
    let asArr = assets.toArray();
    let updated = asArr.map(
      func((id, asset)) {
        let isDirty = dirtyAssets.find<Text>(func(aid) { Text.equal(aid, id) }) != null;
        if (isDirty) {
          let recalced = Assets.recalcAllAssetScores([(id, asset)], alArr);
          switch (recalced.find(func((aid, _)) { Text.equal(aid, id) })) {
            case (?(_, updated_)) (id, updated_);
            case null (id, asset);
          };
        } else {
          (id, asset);
        };
      }
    );
    assets      := List.fromArray(updated);
    dirtyAssets := [];
  };

  // ── Module 2 — Normalized Alerts ─────────────────────────────────────────

  /// Return normalized alerts matching the provided filter criteria.
  public query func getNormalizedAlerts(
    filter : { provider : ?Types.ProviderType; severity : ?Types.Severity; status : ?Types.AlertStatus; customer : Text; limit : Nat }
  ) : async [Types.NormalizedAlert] {
    var results = normalizedAlerts.toArray();
    // Filter by provider
    switch (filter.provider) {
      case null {};
      case (?p) {
        results := results.filter<(Text, Types.NormalizedAlert)>(func((_, a)) {
          switch (a.provider, p) {
            case (#AWS, #AWS) true;
            case (#Azure, #Azure) true;
            case (#GCP, #GCP) true;
            case _ false;
          };
        });
      };
    };
    // Filter by severity
    switch (filter.severity) {
      case null {};
      case (?s) {
        results := results.filter<(Text, Types.NormalizedAlert)>(func((_, a)) {
          switch (a.severity, s) {
            case (#Low, #Low) true;
            case (#Medium, #Medium) true;
            case (#High, #High) true;
            case (#Critical, #Critical) true;
            case (#Unknown, #Unknown) true;
            case _ false;
          };
        });
      };
    };
    // Filter by status
    switch (filter.status) {
      case null {};
      case (?st) {
        results := results.filter<(Text, Types.NormalizedAlert)>(func((_, a)) {
          switch (a.status, st) {
            case (#Open, #Open) true;
            case (#InProgress, #InProgress) true;
            case (#Resolved, #Resolved) true;
            case _ false;
          };
        });
      };
    };
    // Filter by customer
    if (filter.customer != "") {
      results := results.filter<(Text, Types.NormalizedAlert)>(func((_, a)) {
        Text.equal(a.customer, filter.customer);
      });
    };
    // results are already newest-first (prepend on insert); apply limit
    let totalLen = results.size();
    let sliceEnd = if (filter.limit < totalLen) filter.limit else totalLen;
    let sliced = results.sliceToArray(0, sliceEnd);
    sliced.map<(Text, Types.NormalizedAlert), Types.NormalizedAlert>(func((_, a)) { a });
  };

  /// Find a single alert by its ID.
  public query func getAlertById(id : Text) : async ?Types.NormalizedAlert {
    let arr = normalizedAlerts.toArray();
    switch (arr.find<(Text, Types.NormalizedAlert)>(func((aid, _)) { Text.equal(aid, id) })) {
      case null null;
      case (?(_, a)) ?a;
    };
  };

  /// Update the status and optional owner of an alert.
  public shared ({ caller }) func updateAlertStatus(id : Text, newStatus : Types.AlertStatus, owner : ?Text) : async Bool {
    requireAuth(caller, "updateAlertStatus");
    // Validate input lengths
    if (id.size() > 512) { Runtime.trap("id exceeds max length") };
    let arr = normalizedAlerts.toArray();
    var found = false;
    let updated = arr.map(
      func((aid, a)) {
        if (Text.equal(aid, id)) {
          found := true;
          let updatedAlert : Types.NormalizedAlert = { a with status = newStatus; owner };
          (aid, updatedAlert);
        } else {
          (aid, a);
        };
      }
    );
    if (found) {
      normalizedAlerts := List.fromArray(updated);
      addAuditEntry(caller.toText(), "AlertStatusUpdated", "Alert " # id # " status updated to " # debug_show(newStatus), "");
    };
    found;
  };

  // ── Module 3 — Asset Inventory ────────────────────────────────────────────

  /// Return assets matching the provided filter criteria.
  public query func getAssets(
    filter : { provider : ?Types.ProviderType; assetType : ?Types.AssetType; region : ?Text; minRiskScore : ?Nat; customer : Text; limit : Nat }
  ) : async [Types.Asset] {
    var results = assets.toArray();
    switch (filter.provider) {
      case null {};
      case (?p) {
        results := results.filter<(Text, Types.Asset)>(func((_, a)) {
          switch (a.provider, p) {
            case (#AWS, #AWS) true;
            case (#Azure, #Azure) true;
            case (#GCP, #GCP) true;
            case _ false;
          };
        });
      };
    };
    switch (filter.assetType) {
      case null {};
      case (?at_) {
        results := results.filter<(Text, Types.Asset)>(func((_, a)) {
          switch (a.assetType, at_) {
            case (#EC2, #EC2) true; case (#S3, #S3) true; case (#RDS, #RDS) true;
            case (#Lambda, #Lambda) true; case (#AzureVM, #AzureVM) true;
            case (#AzureStorage, #AzureStorage) true; case (#AzureDatabase, #AzureDatabase) true;
            case (#GCPCompute, #GCPCompute) true; case (#GCPStorage, #GCPStorage) true;
            case (#GCPCloudSQL, #GCPCloudSQL) true; case (#Other, #Other) true;
            case _ false;
          };
        });
      };
    };
    switch (filter.region) {
      case null {};
      case (?r) {
        results := results.filter<(Text, Types.Asset)>(func((_, a)) {
          Text.equal(a.region, r);
        });
      };
    };
    switch (filter.minRiskScore) {
      case null {};
      case (?minScore) {
        results := results.filter<(Text, Types.Asset)>(func((_, a)) {
          a.riskScore >= minScore;
        });
      };
    };
    if (filter.customer != "") {
      results := results.filter<(Text, Types.Asset)>(func((_, a)) {
        Text.equal(a.customer, filter.customer);
      });
    };
    // Sort by riskScore descending
    let sorted = results.sort(func((_, a), (_, b)) {
      if (a.riskScore > b.riskScore) #less
      else if (a.riskScore < b.riskScore) #greater
      else #equal;
    });
    let totalLen = sorted.size();
    let sliceEnd = if (filter.limit < totalLen) filter.limit else totalLen;
    let sliced = sorted.sliceToArray(0, sliceEnd);
    sliced.map<(Text, Types.Asset), Types.Asset>(func((_, a)) { a });
  };

  /// Find a single asset by its ID.
  public query func getAssetById(id : Text) : async ?Types.Asset {
    let arr = assets.toArray();
    switch (arr.find<(Text, Types.Asset)>(func((aid, _)) { Text.equal(aid, id) })) {
      case null null;
      case (?(_, a)) ?a;
    };
  };

  /// Return all open/in-progress normalized alerts for a given asset.
  public query func getAssetFindings(assetId : Text) : async [Types.NormalizedAlert] {
    let arr = normalizedAlerts.toArray();
    let filtered = arr.filter(func((_, a)) {
      a.assetId == ?assetId and (a.status == #Open or a.status == #InProgress);
    });
    filtered.map<(Text, Types.NormalizedAlert), Types.NormalizedAlert>(func((_, a)) { a });
  };

  // ── Module 4 — Compliance ─────────────────────────────────────────────────

  /// Return compliance status for a framework, counting passing/failing findings per control.
  public query func getComplianceStatus(
    framework : Types.ComplianceFramework,
    provider  : ?Types.ProviderType
  ) : async { controls : [Types.ComplianceControl]; score : Nat; total : Nat; passing : Nat; failing : Nat } {
    let baseCtls = Compliance.getFrameworkControls(framework, provider);
    let alertsArr = normalizedAlerts.toArray();
    // Enrich controls with passing/failing counts from normalized alerts
    let enriched = baseCtls.map(
      func(ctrl) {
        var passing_ = 0;
        var failing_ = 0;
        for ((_, a) in alertsArr.vals()) {
          // Only consider alerts mapped to this control
          let ctlIds = Compliance.mapAlertToControls(a, framework);
          let matches = ctlIds.find<Text>(func(cid) { Text.equal(cid, ctrl.controlId) }) != null;
          if (matches) {
            switch (a.status) {
              case (#Resolved) { passing_ += 1 };
              case (#Open or #InProgress) { failing_ += 1 };
            };
          };
        };
        let status : Types.ControlStatus =
          if (failing_ > 0)       #Failing
          else if (passing_ > 0)  #Passing
          else                    #NoCoverage;
        { ctrl with status; passingFindings = passing_; failingFindings = failing_ };
      }
    );
    let scoreResult = Compliance.calculateComplianceScore(enriched);
    {
      controls = enriched;
      score    = scoreResult.score;
      total    = scoreResult.total;
      passing  = scoreResult.passing;
      failing  = scoreResult.failing;
    };
  };

  /// Return compliance trend entries for a framework sorted by weekTimestamp ascending.
  public query func getComplianceTrend(framework : Types.ComplianceFramework) : async [Types.ComplianceTrendEntry] {
    let arr = complianceTrend.toArray();
    let filtered = arr.filter(func(e) {
      switch (e.framework, framework) {
        case (#NISTCSF, #NISTCSF) true; case (#CISAws, #CISAws) true;
        case (#CISAzure, #CISAzure) true; case (#CISGCP, #CISGCP) true;
        case (#ISO27001, #ISO27001) true; case (#SOC2, #SOC2) true;
        case _ false;
      };
    });
    filtered.sort<Types.ComplianceTrendEntry>(func(a, b) {
      if (a.weekTimestamp < b.weekTimestamp) #less
      else if (a.weekTimestamp > b.weekTimestamp) #greater
      else #equal;
    });
  };

  /// Return controls that have status Failing or NoCoverage.
  public query func getComplianceControlGaps(framework : Types.ComplianceFramework) : async [Types.ComplianceControl] {
    let baseCtls = Compliance.getFrameworkControls(framework, null);
    let alertsArr = normalizedAlerts.toArray();
    let enriched = baseCtls.map(
      func(ctrl) {
        var passing_ = 0;
        var failing_ = 0;
        for ((_, a) in alertsArr.vals()) {
          let ctlIds = Compliance.mapAlertToControls(a, framework);
          let matches = ctlIds.find<Text>(func(cid) { Text.equal(cid, ctrl.controlId) }) != null;
          if (matches) {
            switch (a.status) {
              case (#Resolved) { passing_ += 1 };
              case (#Open or #InProgress) { failing_ += 1 };
            };
          };
        };
        let status : Types.ControlStatus =
          if (failing_ > 0)       #Failing
          else if (passing_ > 0)  #Passing
          else                    #NoCoverage;
        { ctrl with status; passingFindings = passing_; failingFindings = failing_ };
      }
    );
    enriched.filter<Types.ComplianceControl>(func(c) {
      c.status == #Failing or c.status == #NoCoverage;
    });
  };

  /// Export compliance report as CSV text.
  public query func exportComplianceCsv(framework : Types.ComplianceFramework) : async Text {
    let controls = Compliance.getFrameworkControls(framework, null);
    Compliance.generateCsvReport(framework, controls);
  };

  /// Export compliance report as PDF blob.
  public query func exportCompliancePdf(framework : Types.ComplianceFramework) : async Blob {
    let controls = Compliance.getFrameworkControls(framework, null);
    Compliance.generatePdfReport(framework, controls);
  };

  // ── Module 5 — Alert Rules & Notifications ────────────────────────────────

  /// Return all alert rules for a given customer.
  public query func getAlertRules(customer : Text) : async [Types.AlertRule] {
    let arr = alertRules.toArray();
    let filtered = arr.filter(func((_, r)) {
      customer == "" or Text.equal(r.customer, customer);
    });
    filtered.map<(Text, Types.AlertRule), Types.AlertRule>(func((_, r)) { r });
  };

  /// Insert or update an alert rule.
  public shared ({ caller }) func saveAlertRule(rule : Types.AlertRule) : async Bool {
    requireAuth(caller, "saveAlertRule");
    // Validate input lengths
    if (rule.id.size() > 512) { Runtime.trap("rule.id exceeds max length") };
    if (rule.name.size() > 512) { Runtime.trap("rule.name exceeds max length") };
    let arr = alertRules.toArray();
    let exists = arr.find<(Text, Types.AlertRule)>(func((id, _)) { Text.equal(id, rule.id) }) != null;
    if (exists) {
      let updated = arr.map(
        func((id, r)) { if (Text.equal(id, rule.id)) (id, rule) else (id, r) }
      );
      alertRules := List.fromArray(updated);
    } else {
      alertRules.add((rule.id, rule));
    };
    addAuditEntry(caller.toText(), "AlertRuleSaved", "Alert rule " # rule.id # " saved", rule.customer);
    true;
  };

  /// Delete an alert rule by ID.
  public shared ({ caller }) func deleteAlertRule(id : Text) : async Bool {
    requireAuth(caller, "deleteAlertRule");
    if (id.size() > 512) { Runtime.trap("id exceeds max length") };
    let arr = alertRules.toArray();
    let filtered = arr.filter(func((rid, _)) {
      not Text.equal(rid, id);
    });
    let removed = filtered.size() < arr.size();
    if (removed) {
      alertRules := List.fromArray(filtered);
      addAuditEntry(caller.toText(), "AlertRuleDeleted", "Alert rule " # id # " deleted", "");
    };
    removed;
  };

  /// Return notification logs for a customer, sorted by timestamp descending.
  public query func getNotificationLogs(
    filter : { customer : Text; limit : Nat }
  ) : async [Types.NotificationLog] {
    var arr = notificationLogs.toArray();
    if (filter.customer != "") {
      arr := arr.filter<(Text, Types.NotificationLog)>(func((_, l)) {
        Text.equal(l.customer, filter.customer);
      });
    };
    // Already newest-first from List.push prepend
    let totalLen = arr.size();
    let sliceEnd = if (filter.limit < totalLen) filter.limit else totalLen;
    let sliced = arr.sliceToArray(0, sliceEnd);
    sliced.map<(Text, Types.NotificationLog), Types.NotificationLog>(func((_, l)) { l });
  };

  /// Acknowledge a notification log entry.
  public shared ({ caller }) func acknowledgeNotification(logId : Text) : async Bool {
    requireAuth(caller, "acknowledgeNotification");
    if (logId.size() > 512) { Runtime.trap("logId exceeds max length") };
    let arr = notificationLogs.toArray();
    var found = false;
    let nowNs = Time.now();
    let updated = arr.map(
      func((id, l)) {
        if (Text.equal(id, logId)) {
          found := true;
          let updatedLog : Types.NotificationLog = { l with acknowledged = true; acknowledgedAt = ?nowNs };
          (id, updatedLog);
        } else {
          (id, l);
        };
      }
    );
    if (found) {
      notificationLogs := List.fromArray(updated);
      addAuditEntry(caller.toText(), "NotificationAcknowledged", "Notification " # logId # " acknowledged", "");
    };
    found;
  };

  // ── Cross-module queries ───────────────────────────────────────────────────

  /// Return recent timeline events for a customer, sorted by timestamp descending.
  public query func getTimeline(customer : Text, limit : Nat) : async [Types.TimelineEvent] {
    var arr = timelineEvents.toArray();
    if (customer != "") {
      arr := arr.filter<Types.TimelineEvent>(func(e) {
        Text.equal(e.customer, customer);
      });
    };
    // Already newest-first
    let totalLen = arr.size();
    let sliceEnd = if (limit < totalLen) limit else totalLen;
    arr.sliceToArray(0, sliceEnd);
  };

  /// Search across alerts, assets, and audit log.
  /// maxResults: cap total results (default 100, max 500). hasMore indicates truncation.
  public query func globalSearch(
    query_     : Text,
    customer   : Text,
    maxResults : Nat
  ) : async { results : [Types.SearchResult]; hasMore : Bool } {
    // Clamp maxResults between 1 and 500
    let limit : Nat = if (maxResults == 0) 100 else if (maxResults > 500) 500 else maxResults;
    let results = List.empty<Types.SearchResult>();
    var hasMore = false;

    // Search normalized alerts
    label alertSearch for ((_, a) in normalizedAlerts.toArray().vals()) {
      if (results.size() >= limit) { hasMore := true; break alertSearch };
      if (customer == "" or Text.equal(a.customer, customer)) {
        if (
          a.title.contains(#text query_) or
          a.id.contains(#text query_) or
          a.description.contains(#text query_)
        ) {
          results.add({
            id           = a.id;
            sourceModule = "alert";
            title        = a.title;
            description  = a.description;
            provider     = ?a.provider;
            severity     = ?a.severity;
            customer     = a.customer;
            timestamp    = a.timestamp;
          });
        };
      };
    };
    // Search assets
    if (not hasMore) {
      label assetSearch for ((_, a) in assets.toArray().vals()) {
        if (results.size() >= limit) { hasMore := true; break assetSearch };
        if (customer == "" or Text.equal(a.customer, customer)) {
          if (
            a.name.contains(#text query_) or
            a.id.contains(#text query_)
          ) {
            let providerText = switch (a.provider) { case (#AWS) "AWS"; case (#Azure) "Azure"; case (#GCP) "GCP" };
            results.add({
              id           = a.id;
              sourceModule = "asset";
              title        = a.name;
              description  = "Provider: " # providerText;
              provider     = ?a.provider;
              severity     = null;
              customer     = a.customer;
              timestamp    = a.lastSeen;
            });
          };
        };
      };
    };
    // Search audit log
    if (not hasMore) {
      label auditSearch for (entry in auditLog.toArray().vals()) {
        if (results.size() >= limit) { hasMore := true; break auditSearch };
        if (customer == "" or Text.equal(entry.customer, customer)) {
          if (
            entry.action.contains(#text query_) or
            entry.details.contains(#text query_)
          ) {
            results.add({
              id           = entry.id;
              sourceModule = "audit";
              title        = entry.action;
              description  = entry.details;
              provider     = null;
              severity     = null;
              customer     = entry.customer;
              timestamp    = entry.timestamp;
            });
          };
        };
      };
    };
    { results = results.toArray(); hasMore };
  };

  // ── Phase 3 — Correlation Engine query/update functions ─────────────────

  /// Return the most recent `limit` correlated incidents sorted by detectedAt descending.
  public query func getCorrelatedIncidents(limit : Nat) : async [(Text, Types.CorrelatedIncident)] {
    let arr = correlatedIncidents;
    // Sort descending by detectedAt
    let sorted = arr.sort(
      func((_, a), (_, b)) { Int.compare(b.detectedAt, a.detectedAt) }
    );
    let totalLen = sorted.size();
    let sliceEnd = if (limit < totalLen) limit else totalLen;
    sorted.sliceToArray(0, sliceEnd);
  };

  /// Return a correlated incident by its incidentId, or null if not found.
  public query func getCorrelatedIncidentById(id : Text) : async ?Types.CorrelatedIncident {
    switch (correlatedIncidents.find<(Text, Types.CorrelatedIncident)>(func((key, _)) { Text.equal(key, id) })) {
      case (?(_, inc)) ?inc;
      case null null;
    };
  };

  /// Update status, owner, and/or notes on a correlated incident. Returns true if found.
  public shared ({ caller }) func updateCorrelatedIncidentStatus(
    id        : Text,
    newStatus : Types.IncidentStatus,
    owner     : ?Text,
    notes     : ?Text,
  ) : async Bool {
    requireAuth(caller, "updateCorrelatedIncidentStatus");
    if (id.size() > 512) { Runtime.trap("id exceeds max length") };
    var found = false;
    correlatedIncidents := correlatedIncidents.map<(Text, Types.CorrelatedIncident), (Text, Types.CorrelatedIncident)>(
      func((key, inc)) {
        if (Text.equal(key, id)) {
          found := true;
          (key, { inc with status = newStatus; assignedOwner = owner; notes });
        } else {
          (key, inc);
        };
      },
    );
    if (found) {
      addAuditEntry(caller.toText(), "IncidentStatusUpdated", "Incident " # id # " status updated to " # debug_show(newStatus), "");
    };
    found;
  };

  /// Return aggregated correlation statistics for the dashboard panel.
  public query func getCorrelationStats() : async Types.CorrelationStats {
    CorrelationEngine.computeStats(correlatedIncidents, Time.now());
  };

  /// Seed 4 mock normalized alerts (idempotent) and run the correlation engine.
  /// Returns the newly detected correlated incidents. Gated behind auth.
  public shared ({ caller }) func seedMockAlertsAndRunCorrelation() : async [Types.CorrelatedIncident] {
    requireAuth(caller, "seedMockAlertsAndRunCorrelation");
    let nowNs = Time.now();
    let mockAlerts : [(Text, Types.NormalizedAlert)] = [
      (
        "mock-azure-brute-1",
        {
          id               = "mock-azure-brute-1";
          provider         = #Azure;
          findingId        = "mock-azure-brute-1";
          originalSeverity = "High";
          severity         = #High;
          title            = "AzureAD/BruteForce";
          description      = "Brute force attack against Azure AD PasswordSpray credential stuffing";
          assetId          = ?"185.234.219.10";
          assetType        = null;
          accountId        = ?"azure-sub-mock";
          region           = ?"eastus";
          timestamp        = nowNs - 3_600_000_000_000;
          status           = #Open;
          owner            = ?"";
          customer         = "";
          mitre            = ?{ tactic = "Credential Access"; technique = ""; techniqueId = "" };
          rawFindingId     = "mock-azure-brute-1";
          recurrenceCount  = 0;
          ingestionSource  = null;
          enrichment       = null;
        }
      ),
      (
        "mock-aws-assume-2",
        {
          id               = "mock-aws-assume-2";
          provider         = #AWS;
          findingId        = "mock-aws-assume-2";
          originalSeverity = "High";
          severity         = #High;
          title            = "UnauthorizedAccess:IAMUser/AssumeRole";
          description      = "Unauthorized AssumeRole attempt IAM privilege escalation";
          assetId          = ?"185.234.219.10";
          assetType        = null;
          accountId        = ?"aws-acct-mock";
          region           = ?"us-east-1";
          timestamp        = nowNs - 3_600_000_000_000 + 1_080_000_000_000;
          status           = #Open;
          owner            = ?"";
          customer         = "";
          mitre            = ?{ tactic = "Privilege Escalation"; technique = ""; techniqueId = "" };
          rawFindingId     = "mock-aws-assume-2";
          recurrenceCount  = 0;
          ingestionSource  = null;
          enrichment       = null;
        }
      ),
      (
        "mock-aws-s3-3",
        {
          id               = "mock-aws-s3-3";
          provider         = #AWS;
          findingId        = "mock-aws-s3-3";
          originalSeverity = "Critical";
          severity         = #Critical;
          title            = "Exfiltration:S3/ObjectRead.Unusual";
          description      = "S3 GetObject anomaly unusual data Download exfiltration from bucket";
          assetId          = ?"s3://prod-data-bucket";
          assetType        = null;
          accountId        = ?"aws-acct-mock";
          region           = ?"us-east-1";
          timestamp        = nowNs - 7_200_000_000_000;
          status           = #Open;
          owner            = ?"";
          customer         = "";
          mitre            = ?{ tactic = "Exfiltration"; technique = ""; techniqueId = "" };
          rawFindingId     = "mock-aws-s3-3";
          recurrenceCount  = 0;
          ingestionSource  = null;
          enrichment       = null;
        }
      ),
      (
        "mock-azure-blob-4",
        {
          id               = "mock-azure-blob-4";
          provider         = #Azure;
          findingId        = "mock-azure-blob-4";
          originalSeverity = "High";
          severity         = #High;
          title            = "StorageAccount.BlobAnomaly.Download";
          description      = "BlobStorage StorageAccount Download anomaly suspicious data access";
          assetId          = ?"prodstorageaccount/exports";
          assetType        = null;
          accountId        = ?"azure-sub-mock";
          region           = ?"westeurope";
          timestamp        = nowNs - 7_200_000_000_000 + 480_000_000_000;
          status           = #Open;
          owner            = ?"";
          customer         = "";
          mitre            = ?{ tactic = "Exfiltration"; technique = ""; techniqueId = "" };
          rawFindingId     = "mock-azure-blob-4";
          recurrenceCount  = 0;
          ingestionSource  = null;
          enrichment       = null;
        }
      ),
    ];

    // Add only mock alerts not already present (check by id)
    for ((mockId, mockAlert) in mockAlerts.vals()) {
      let existing = normalizedAlerts.toArray().find(
        func((id, _)) { Text.equal(id, mockId) }
      );
      switch (existing) {
        case (null) { normalizedAlerts.add((mockId, mockAlert)) };
        case (?_)   {};
      };
    };

    // Snapshot existing incidents count before running engine
    let beforeCount = correlatedIncidents.size();
    runCorrelationEngine();

    // Return only the newly created incidents
    let allAfter = correlatedIncidents;
    let newOnes = allAfter.filter(
      func((_, inc)) { inc.detectedAt >= nowNs }
    );
    ignore beforeCount;
    newOnes.map<(Text, Types.CorrelatedIncident), Types.CorrelatedIncident>(func((_, inc)) { inc });
  };

  /// Return normalized alerts whose id matches any entry in alertIds.
  public query func getAlertsForCorrelation(alertIds : [Text]) : async [Types.NormalizedAlert] {
    let allAlerts = normalizedAlerts.toArray();
    let results = allAlerts.filter(
      func((id, _)) {
        alertIds.find<Text>(func(target) { Text.equal(id, target) }) != null;
      }
    );
    results.map<(Text, Types.NormalizedAlert), Types.NormalizedAlert>(func((_, a)) { a });
  };

  // ── Phase 2 — Webhook / Pipeline query functions ─────────────────────────

  /// Convert a ProviderType variant to its Text representation.
  func providerToText(p : Types.ProviderType) : Text {
    switch p { case (#AWS) "AWS"; case (#Azure) "Azure"; case (#GCP) "GCP" };
  };

  /// Return failed ingestion records, optionally filtered by provider.
  /// provider field is returned as Text to avoid Candid variant decoding issues on the frontend.
  public query func getFailedIngestions(provider : ?Types.ProviderType, limit : Nat) : async [{ id : Text; provider : Text; errorType : Text; rawPayload : Text; timestamp : Int; errorMessage : Text; status : Text }] {
    let raw = FailedIngestionStore.getFailedIngestions(failedIngestions, provider, limit);
    raw.map<Types.FailedIngestion, { id : Text; provider : Text; errorType : Text; rawPayload : Text; timestamp : Int; errorMessage : Text; status : Text }>(
      func(r) {{
        id           = r.id;
        provider     = providerToText(r.provider);
        errorType    = r.errorType;
        rawPayload   = r.rawPayload;
        timestamp    = r.timestamp;
        errorMessage = r.errorMessage;
        status       = r.status;
      }}
    );
  };

  /// Return per-provider pipeline health stats for the dashboard.
  /// provider field is returned as Text to avoid Candid variant decoding issues on the frontend.
  public query func getPipelineHealth() : async [{ provider : Text; webhookEventsToday : Nat; pollEventsToday : Nat; normalizationSuccessRate : Float; failedIngestionCount : Nat; avgLatencyMs : Float }] {
    let raw = PipelineMetrics.getPipelineHealth(pipelineEvents, failedIngestions, Time.now());
    raw.map<Types.PipelineHealthStats, { provider : Text; webhookEventsToday : Nat; pollEventsToday : Nat; normalizationSuccessRate : Float; failedIngestionCount : Nat; avgLatencyMs : Float }>(
      func(s) {{
        provider                 = providerToText(s.provider);
        webhookEventsToday       = s.webhookEventsToday;
        pollEventsToday          = s.pollEventsToday;
        normalizationSuccessRate = s.normalizationSuccessRate;
        failedIngestionCount     = s.failedIngestionCount;
        avgLatencyMs             = s.avgLatencyMs;
      }}
    );
  };

  /// Return aggregated webhook statistics for the dashboard.
  public query func getWebhookStats() : async { webhookEventsToday : Nat; webhookNormalizationRate : Float } {
    let stats = PipelineMetrics.getPipelineHealth(pipelineEvents, failedIngestions, Time.now());
    var totalWebhook = 0;
    var totalNormOk  = 0.0;
    var totalNorm    = 0.0;
    for (s in stats.vals()) {
      totalWebhook += s.webhookEventsToday;
      let events = s.webhookEventsToday + s.pollEventsToday;
      if (events > 0) {
        totalNormOk += s.normalizationSuccessRate * events.toFloat();
        totalNorm   += events.toFloat();
      };
    };
    let webhookNormalizationRate : Float =
      if (totalNorm == 0.0) 1.0 else totalNormOk / totalNorm;
    { webhookEventsToday = totalWebhook; webhookNormalizationRate };
  };

  /// Return audit log entries for a customer, sorted by timestamp descending.
  public query func getAuditLog(customer : Text, limit : Nat) : async [Types.AuditLogEntry] {
    var arr = auditLog.toArray();
    if (customer != "") {
      arr := arr.filter<Types.AuditLogEntry>(func(e) {
        Text.equal(e.customer, customer);
      });
    };
    let totalLen = arr.size();
    let sliceEnd = if (limit < totalLen) limit else totalLen;
    arr.sliceToArray(0, sliceEnd);
  };

  // ── Phase 6 — Malicious IP Feed (internal) ────────────────────────────────

  /// Refresh the known-malicious IP feed from Emerging Threats.
  /// Called from heartbeat every 6 hours.
  func refreshMaliciousIpFeed() : async () {
    let result = try {
      ?(await ThreatIntel.fetchMaliciousIpFeed(transform))
    } catch (_e) {
      null
    };
    switch (result) {
      case null {};
      case (?feed) {
        maliciousIpFeed := feed;
        lastMaliciousIpFeedPoll := ?Time.now();
      };
    };
  };

  // ── Phase 5 — Remediation Playbooks ──────────────────────────────────────

  /// Helper: map severity to Halo priority integer.
  func severityToHaloPriority(severity : Text) : Text {
    let s = severity.toLower();
    if (s == "critical") "1"
    else if (s == "high") "2"
    else if (s == "medium") "3"
    else "4";
  };

  /// Block an IP address across one or more cloud providers.
  /// dryRun=true returns a preview without making any API calls.
  public shared ({ caller }) func blockIp(
    req : { ip : Text; providers : [Types.ProviderType]; dryRun : Bool; customer : Text }
  ) : async Types.PlaybookResult {
    requireAuth(caller, "blockIp");
    if (req.ip.size() > 64 or req.ip.size() == 0) {
      return { success = false; message = "Invalid IP address"; dryRunPreview = null; rawApiError = null; provider = null };
    };
    var previewParts : [Text] = [];
    var errors : [Text] = [];
    let nowNs = Time.now();
    for (prov in req.providers.vals()) {
      switch (prov) {
        case (#AWS) {
          if (req.dryRun) {
            previewParts := previewParts.concat(["AWS: Would add deny rule for " # req.ip # " to VPC Network ACL via EC2 API"]);
          } else {
            let region = switch (awsCredentials) {
              case (?creds) { if (creds.regions.size() > 0) creds.regions[0] else "us-east-1" };
              case null "us-east-1";
            };
            let host = "ec2." # region # ".amazonaws.com";
            let url = "https://" # host # "/";
            let body = "Action=CreateNetworkAclEntry&NetworkAclId=default&RuleNumber=100&Protocol=-1&RuleAction=deny&Egress=false&CidrBlock=" # req.ip # "%2F32&Version=2016-11-15";
            let sessionResult = switch (awsSessionCache) {
              case (?s) #ok(s);
              case null #err("No AWS session available");
            };
            switch (sessionResult) {
              case (#err(e)) { errors := errors.concat(["AWS: " # e]) };
              case (#ok(session)) {
                try {
                  let _resp = await OutCall.httpPostRequest(url,
                    [{ name = "Content-Type"; value = "application/x-www-form-urlencoded" },
                     { name = "X-Amz-Security-Token"; value = session.sessionToken }],
                    body, transform);
                  addAuditEntry(caller.toText(), "PlaybookBlockIp",
                    "Block IP " # req.ip # " on AWS", req.customer);
                } catch (e) {
                  errors := errors.concat(["AWS: " # e.message()]);
                };
              };
            };
          };
        };
        case (#Azure) {
          if (req.dryRun) {
            previewParts := previewParts.concat(["Azure: Would add deny rule for " # req.ip # " to Network Security Group via Azure Network API"]);
          } else {
            let subId = switch (azureCredentials) {
              case (?creds) { if (creds.subscriptionIds.size() > 0) creds.subscriptionIds[0] else "" };
              case null "";
            };
            let token = switch (azureTokenCache) {
              case (?t) t.token;
              case null "";
            };
            if (token == "") {
              errors := errors.concat(["Azure: No bearer token available"]);
            } else {
              let url = "https://management.azure.com/subscriptions/" # subId #
                "/resourceGroups/default/providers/Microsoft.Network/networkSecurityGroups/default" #
                "/securityRules/DenyIP-" # nowNs.toText() # "?api-version=2023-05-01";
              let body = "{\"properties\":{\"protocol\":\"*\",\"sourceAddressPrefix\":\"" # req.ip #
                "\",\"sourcePortRange\":\"*\",\"destinationAddressPrefix\":\"*\",\"destinationPortRange\":\"*\",\"access\":\"Deny\",\"priority\":100,\"direction\":\"Inbound\"}}";
              try {
                let _resp = await OutCall.httpPostRequest(url,
                  [{ name = "Authorization"; value = "Bearer " # token },
                   { name = "Content-Type"; value = "application/json" }],
                  body, transform);
                addAuditEntry(caller.toText(), "PlaybookBlockIp",
                  "Block IP " # req.ip # " on Azure", req.customer);
              } catch (e) {
                errors := errors.concat(["Azure: " # e.message()]);
              };
            };
          };
        };
        case (#GCP) {
          if (req.dryRun) {
            previewParts := previewParts.concat(["GCP: Would add deny firewall rule for " # req.ip # " via GCP Compute API"]);
          } else {
            let projectId = switch (gcpCredentials) {
              case (?creds) { if (creds.projectIds.size() > 0) creds.projectIds[0] else "" };
              case null "";
            };
            let token = switch (gcpTokenCache) {
              case (?t) t.token;
              case null "";
            };
            if (token == "") {
              errors := errors.concat(["GCP: No access token available"]);
            } else {
              let url = "https://compute.googleapis.com/compute/v1/projects/" # projectId # "/global/firewalls";
              let body = "{\"name\":\"deny-ip-" # nowNs.toText() # "\",\"direction\":\"INGRESS\",\"denied\":[{\"IPProtocol\":\"all\"}],\"sourceRanges\":[\"" # req.ip # "/32\"]}";
              try {
                let _resp = await OutCall.httpPostRequest(url,
                  [{ name = "Authorization"; value = "Bearer " # token },
                   { name = "Content-Type"; value = "application/json" }],
                  body, transform);
                addAuditEntry(caller.toText(), "PlaybookBlockIp",
                  "Block IP " # req.ip # " on GCP", req.customer);
              } catch (e) {
                errors := errors.concat(["GCP: " # e.message()]);
              };
            };
          };
        };
      };
    };
    let rawErr : ?Text = if (errors.size() > 0) ?(errors.vals().join("; ")) else null;
    let preview : ?Text = if (previewParts.size() > 0) ?(previewParts.vals().join("\n")) else null;
    let success = errors.size() == 0;
    let msg = if (req.dryRun) "Dry-run preview generated"
              else if (success) "IP blocked on all requested providers"
              else "IP block failed on some providers: " # rawErr.get("");
    addAuditEntry(caller.toText(), "PlaybookBlockIp",
      "blockIp ip=" # req.ip # " dryRun=" # debug_show(req.dryRun) # " result=" # debug_show(success), req.customer);
    { success; message = msg; dryRunPreview = preview; rawApiError = rawErr; provider = null };
  };

  /// Isolate a resource by modifying its network configuration.
  public shared ({ caller }) func isolateResource(
    req : { resourceId : Text; provider : Types.ProviderType; dryRun : Bool; customer : Text }
  ) : async Types.PlaybookResult {
    requireAuth(caller, "isolateResource");
    if (req.resourceId.size() > 512 or req.resourceId.size() == 0) {
      return { success = false; message = "Invalid resourceId"; dryRunPreview = null; rawApiError = null; provider = ?req.provider };
    };
    let nowNs = Time.now();
    var rawErr : ?Text = null;
    if (req.dryRun) {
      let preview = switch (req.provider) {
        case (#AWS) "AWS: Would modify EC2 instance security group to deny-all for " # req.resourceId;
        case (#Azure) "Azure: Would detach NIC from subnet for resource " # req.resourceId;
        case (#GCP) "GCP: Would add deny-all firewall rule for compute instance " # req.resourceId;
      };
      return { success = true; message = "Dry-run preview generated"; dryRunPreview = ?preview; rawApiError = null; provider = ?req.provider };
    };
    var success = false;
    switch (req.provider) {
      case (#AWS) {
        let region = switch (awsCredentials) {
          case (?creds) { if (creds.regions.size() > 0) creds.regions[0] else "us-east-1" };
          case null "us-east-1";
        };
        let host = "ec2." # region # ".amazonaws.com";
        let url = "https://" # host # "/";
        let body = "Action=ModifyInstanceAttribute&InstanceId=" # req.resourceId # "&Groups.1=sg-deny-all&Version=2016-11-15";
        let session = switch (awsSessionCache) { case (?s) ?s; case null null };
        switch (session) {
          case null { rawErr := ?"No AWS session available" };
          case (?sess) {
            try {
              let _resp = await OutCall.httpPostRequest(url,
                [{ name = "Content-Type"; value = "application/x-www-form-urlencoded" },
                 { name = "X-Amz-Security-Token"; value = sess.sessionToken }],
                body, transform);
              success := true;
              addAuditEntry(caller.toText(), "PlaybookIsolateResource",
                "Isolate resource " # req.resourceId # " on AWS at " # nowNs.toText(), req.customer);
            } catch (e) { rawErr := ?e.message() };
          };
        };
      };
      case (#Azure) {
        let token = switch (azureTokenCache) { case (?t) ?t.token; case null null };
        switch (token) {
          case null { rawErr := ?"No Azure token available" };
          case (?tok) {
            let subId = switch (azureCredentials) {
              case (?creds) { if (creds.subscriptionIds.size() > 0) creds.subscriptionIds[0] else "" };
              case null "";
            };
            let url = "https://management.azure.com/subscriptions/" # subId #
              "/resourceGroups/default/providers/Microsoft.Network/networkInterfaces/" # req.resourceId # "?api-version=2023-05-01";
            let body = "{\"properties\":{\"ipConfigurations\":[{\"properties\":{\"subnet\":null}}]}}";
            try {
              let _resp = await OutCall.httpPostRequest(url,
                [{ name = "Authorization"; value = "Bearer " # tok },
                 { name = "Content-Type"; value = "application/json" }],
                body, transform);
              success := true;
              addAuditEntry(caller.toText(), "PlaybookIsolateResource",
                "Isolate resource " # req.resourceId # " on Azure", req.customer);
            } catch (e) { rawErr := ?e.message() };
          };
        };
      };
      case (#GCP) {
        let token = switch (gcpTokenCache) { case (?t) ?t.token; case null null };
        switch (token) {
          case null { rawErr := ?"No GCP token available" };
          case (?tok) {
            let projectId = switch (gcpCredentials) {
              case (?creds) { if (creds.projectIds.size() > 0) creds.projectIds[0] else "" };
              case null "";
            };
            let url = "https://compute.googleapis.com/compute/v1/projects/" # projectId # "/global/firewalls";
            let body = "{\"name\":\"isolate-" # nowNs.toText() # "\",\"direction\":\"INGRESS\",\"denied\":[{\"IPProtocol\":\"all\"}],\"targetTags\":[\"" # req.resourceId # "\"]}";
            try {
              let _resp = await OutCall.httpPostRequest(url,
                [{ name = "Authorization"; value = "Bearer " # tok },
                 { name = "Content-Type"; value = "application/json" }],
                body, transform);
              success := true;
              addAuditEntry(caller.toText(), "PlaybookIsolateResource",
                "Isolate resource " # req.resourceId # " on GCP", req.customer);
            } catch (e) { rawErr := ?e.message() };
          };
        };
      };
    };
    let msg = if (success) "Resource isolated successfully" else "Resource isolation failed: " # rawErr.get("unknown error");
    { success; message = msg; dryRunPreview = null; rawApiError = rawErr; provider = ?req.provider };
  };

  /// Revoke IAM credentials for a user/service account across providers.
  public shared ({ caller }) func revokeIamCredentials(
    req : { userId : Text; provider : Types.ProviderType; accessKeyId : ?Text; dryRun : Bool; customer : Text }
  ) : async Types.PlaybookResult {
    requireAuth(caller, "revokeIamCredentials");
    if (req.userId.size() > 512 or req.userId.size() == 0) {
      return { success = false; message = "Invalid userId"; dryRunPreview = null; rawApiError = null; provider = ?req.provider };
    };
    var rawErr : ?Text = null;
    if (req.dryRun) {
      let preview = switch (req.provider) {
        case (#AWS) "AWS: Would call IAM DeleteAccessKey and attach deny-all policy for user " # req.userId;
        case (#Azure) "Azure: Would disable service principal " # req.userId # " via Microsoft Graph API";
        case (#GCP) "GCP: Would remove all IAM role bindings from service account " # req.userId;
      };
      return { success = true; message = "Dry-run preview generated"; dryRunPreview = ?preview; rawApiError = null; provider = ?req.provider };
    };
    var success = false;
    switch (req.provider) {
      case (#AWS) {
        let keyId = req.accessKeyId.get("");
        if (keyId == "") {
          return { success = false; message = "accessKeyId required for AWS credential revocation"; dryRunPreview = null; rawApiError = null; provider = ?req.provider };
        };
        let session = switch (awsSessionCache) { case (?s) ?s; case null null };
        switch (session) {
          case null { rawErr := ?"No AWS session available" };
          case (?sess) {
            let url = "https://iam.amazonaws.com/";
            let body = "Action=DeleteAccessKey&UserName=" # req.userId # "&AccessKeyId=" # keyId # "&Version=2010-05-08";
            try {
              let _resp = await OutCall.httpPostRequest(url,
                [{ name = "Content-Type"; value = "application/x-www-form-urlencoded" },
                 { name = "X-Amz-Security-Token"; value = sess.sessionToken }],
                body, transform);
              // Attach deny-all policy
              let policyBody = "Action=AttachUserPolicy&UserName=" # req.userId #
                "&PolicyArn=arn%3Aaws%3Aiam%3A%3Aaws%3Apolicy%2FNoAccess&Version=2010-05-08";
              let _resp2 = await OutCall.httpPostRequest(url,
                [{ name = "Content-Type"; value = "application/x-www-form-urlencoded" },
                 { name = "X-Amz-Security-Token"; value = sess.sessionToken }],
                policyBody, transform);
              success := true;
              addAuditEntry(caller.toText(), "PlaybookRevokeIam",
                "Revoked IAM credentials for " # req.userId # " on AWS", req.customer);
            } catch (e) { rawErr := ?e.message() };
          };
        };
      };
      case (#Azure) {
        let token = switch (azureTokenCache) { case (?t) ?t.token; case null null };
        switch (token) {
          case null { rawErr := ?"No Azure token available" };
          case (?tok) {
            let url = "https://graph.microsoft.com/v1.0/servicePrincipals/" # req.userId;
            let body = "{\"accountEnabled\":false}";
            try {
              let _resp = await OutCall.httpPostRequest(url,
                [{ name = "Authorization"; value = "Bearer " # tok },
                 { name = "Content-Type"; value = "application/json" }],
                body, transform);
              success := true;
              addAuditEntry(caller.toText(), "PlaybookRevokeIam",
                "Disabled service principal " # req.userId # " on Azure", req.customer);
            } catch (e) { rawErr := ?e.message() };
          };
        };
      };
      case (#GCP) {
        let token = switch (gcpTokenCache) { case (?t) ?t.token; case null null };
        switch (token) {
          case null { rawErr := ?"No GCP token available" };
          case (?tok) {
            let projectId = switch (gcpCredentials) {
              case (?creds) { if (creds.projectIds.size() > 0) creds.projectIds[0] else "" };
              case null "";
            };
            let url = "https://iam.googleapis.com/v1/projects/" # projectId #
              "/serviceAccounts/" # req.userId # ":setIamPolicy";
            let body = "{\"policy\":{\"bindings\":[]}}";
            try {
              let _resp = await OutCall.httpPostRequest(url,
                [{ name = "Authorization"; value = "Bearer " # tok },
                 { name = "Content-Type"; value = "application/json" }],
                body, transform);
              success := true;
              addAuditEntry(caller.toText(), "PlaybookRevokeIam",
                "Removed all IAM bindings for " # req.userId # " on GCP", req.customer);
            } catch (e) { rawErr := ?e.message() };
          };
        };
      };
    };
    let msg = if (success) "IAM credentials revoked successfully" else "IAM revocation failed: " # rawErr.get("unknown error");
    { success; message = msg; dryRunPreview = null; rawApiError = rawErr; provider = ?req.provider };
  };

  /// Disable an Azure AD user account via Microsoft Graph API.
  public shared ({ caller }) func disableAzureAdAccount(
    req : { userPrincipalName : Text; dryRun : Bool; customer : Text }
  ) : async Types.PlaybookResult {
    requireAuth(caller, "disableAzureAdAccount");
    if (req.userPrincipalName.size() > 512 or req.userPrincipalName.size() == 0) {
      return { success = false; message = "Invalid userPrincipalName"; dryRunPreview = null; rawApiError = null; provider = ?#Azure };
    };
    if (req.dryRun) {
      let preview = "Azure: Would PATCH https://graph.microsoft.com/v1.0/users/" # req.userPrincipalName #
        " with {accountEnabled: false}";
      return { success = true; message = "Dry-run preview generated"; dryRunPreview = ?preview; rawApiError = null; provider = ?#Azure };
    };
    let token = switch (azureTokenCache) { case (?t) ?t.token; case null null };
    switch (token) {
      case null {
        { success = false; message = "No Azure token available"; dryRunPreview = null; rawApiError = ?"No Azure bearer token"; provider = ?#Azure };
      };
      case (?tok) {
        let url = "https://graph.microsoft.com/v1.0/users/" # req.userPrincipalName;
        let body = "{\"accountEnabled\":false}";
        try {
          let _resp = await OutCall.httpPostRequest(url,
            [{ name = "Authorization"; value = "Bearer " # tok },
             { name = "Content-Type"; value = "application/json" }],
            body, transform);
          addAuditEntry(caller.toText(), "PlaybookDisableAzureAd",
            "Disabled Azure AD account " # req.userPrincipalName, req.customer);
          { success = true; message = "Azure AD account disabled successfully"; dryRunPreview = null; rawApiError = null; provider = ?#Azure };
        } catch (e) {
          addAuditEntry(caller.toText(), "PlaybookDisableAzureAdFailed",
            "Failed to disable Azure AD account " # req.userPrincipalName # ": " # e.message(), req.customer);
          { success = false; message = "Failed to disable account: " # e.message(); dryRunPreview = null; rawApiError = ?e.message(); provider = ?#Azure };
        };
      };
    };
  };

  /// Force a GCP IAM review for a project, flagging over-privileged bindings.
  public shared ({ caller }) func forceGcpIamReview(
    req : { projectId : Text; dryRun : Bool; customer : Text }
  ) : async Types.PlaybookResult {
    requireAuth(caller, "forceGcpIamReview");
    if (req.projectId.size() > 512 or req.projectId.size() == 0) {
      return { success = false; message = "Invalid projectId"; dryRunPreview = null; rawApiError = null; provider = ?#GCP };
    };
    if (req.dryRun) {
      let preview = "GCP: Would GET https://cloudresourcemanager.googleapis.com/v1/projects/" # req.projectId #
        ":getIamPolicy and flag Owner/Editor/Admin bindings not reviewed in 30 days";
      return { success = true; message = "Dry-run preview generated"; dryRunPreview = ?preview; rawApiError = null; provider = ?#GCP };
    };
    let token = switch (gcpTokenCache) { case (?t) ?t.token; case null null };
    switch (token) {
      case null {
        { success = false; message = "No GCP token available"; dryRunPreview = null; rawApiError = ?"No GCP access token"; provider = ?#GCP };
      };
      case (?tok) {
        let url = "https://cloudresourcemanager.googleapis.com/v1/projects/" # req.projectId # ":getIamPolicy";
        try {
          let resp = await OutCall.httpPostRequest(url,
            [{ name = "Authorization"; value = "Bearer " # tok },
             { name = "Content-Type"; value = "application/json" }],
            "{}", transform);
          // Build a simple report from the response
          var reportLines : [Text] = ["GCP IAM Review Report for project " # req.projectId, "Generated: " # Time.now().toText(), ""];
          let containsOwner = resp.contains(#text "roles/owner");
          let containsEditor = resp.contains(#text "roles/editor");
          if (containsOwner) { reportLines := reportLines.concat(["FLAGGED: Owner role binding found — review required"]) };
          if (containsEditor) { reportLines := reportLines.concat(["FLAGGED: Editor role binding found — review required"]) };
          if (not containsOwner and not containsEditor) { reportLines := reportLines.concat(["No high-privilege bindings detected"]) };
          let report = reportLines.vals().join("\n");
          // Post report to most recent open correlated incident for customer
          let nowNs = Time.now();
          let openIncident = correlatedIncidents.find(
            func((_, inc)) { inc.customer == req.customer and inc.status == #Open }
          );
          switch (openIncident) {
            case (?(incId, inc)) {
              correlatedIncidents := correlatedIncidents.map<(Text, Types.CorrelatedIncident), (Text, Types.CorrelatedIncident)>(
                func((id, i)) {
                  if (Text.equal(id, incId)) {
                    let existingNotes = i.notes.get("");
                    (id, { i with notes = ?(existingNotes # "\n--- IAM Review ---\n" # report) })
                  } else (id, i)
                }
              );
            };
            case null {};
          };
          addAuditEntry(caller.toText(), "PlaybookGcpIamReview",
            "GCP IAM review completed for project " # req.projectId, req.customer);
          { success = true; message = "IAM review complete"; dryRunPreview = ?report; rawApiError = null; provider = ?#GCP };
        } catch (e) {
          addAuditEntry(caller.toText(), "PlaybookGcpIamReviewFailed",
            "GCP IAM review failed for project " # req.projectId # ": " # e.message(), req.customer);
          { success = false; message = "IAM review failed: " # e.message(); dryRunPreview = null; rawApiError = ?e.message(); provider = ?#GCP };
        };
      };
    };
  };

  /// Escalate an alert to a full correlated incident and create a Halo ticket.
  public shared ({ caller }) func escalateToIncident(
    req : { alertId : Text; severity : Text; assignedOwner : ?Text; notes : ?Text; customer : Text; dryRun : Bool }
  ) : async Types.PlaybookResult {
    requireAuth(caller, "escalateToIncident");
    if (req.alertId.size() > 512 or req.alertId.size() == 0) {
      return { success = false; message = "Invalid alertId"; dryRunPreview = null; rawApiError = null; provider = null };
    };
    // Dry-run: return preview without executing
    if (req.dryRun) {
      let preview = "Would create incident for alert: " # req.alertId # ", severity: " # req.severity # ", and create Halo ticket";
      addAuditEntry(caller.toText(), "PlaybookEscalateToIncidentDryRun",
        "Dry-run: escalate alert " # req.alertId # " to incident", req.customer);
      return { success = true; message = "Dry-run preview generated"; dryRunPreview = ?preview; rawApiError = null; provider = null };
    };
    // Find the alert
    let alertArr = normalizedAlerts.toArray();
    let maybeAlert = alertArr.find(func((id, _)) { Text.equal(id, req.alertId) });
    switch (maybeAlert) {
      case null {
        { success = false; message = "Alert not found: " # req.alertId; dryRunPreview = null; rawApiError = null; provider = null };
      };
      case (?(_, alert)) {
        let nowNs = Time.now();
        let incidentId = "escalated-" # req.alertId # "-" # nowNs.toText();
        let severityVariant : Types.Severity = switch (req.severity.toLower()) {
          case "critical" #Critical;
          case "high"     #High;
          case "medium"   #Medium;
          case "low"      #Low;
          case _          #High;
        };
        let newIncident : Types.CorrelatedIncident = {
          incidentId;
          incidentType       = "Escalated Alert";
          severity           = severityVariant;
          status             = #Investigating;
          sourceAlerts       = [req.alertId];
          sourceProviders    = [alert.provider];
          sourceIp           = null;
          affectedResources  = switch (alert.assetId) { case (?aid) [aid]; case null [] };
          timeDeltaMinutes   = 0.0;
          correlationWindowMinutes = 0;
          detectedAt         = nowNs;
          assignedOwner      = req.assignedOwner;
          notes              = req.notes;
          customer           = req.customer;
        };
        correlatedIncidents := correlatedIncidents.concat([(incidentId, newIncident)]);
        // Call Halo Ticketing API
        let haloUrl = "https://halospsaapi.haloservicesolutions.com/api/Tickets";
        let priority = severityToHaloPriority(req.severity);
        let haloBody = "{\"summary\":\"" # alert.title # "\",\"details\":\"" # alert.description #
          "\",\"priority\":" # priority # ",\"clientId\":\"" # req.customer # "\"}";
        var rawErr : ?Text = null;
        try {
          let _resp = await OutCall.httpPostRequest(haloUrl,
            [{ name = "Content-Type"; value = "application/json" }],
            haloBody, transform);
          addAuditEntry(caller.toText(), "PlaybookEscalateToIncident",
            "Escalated alert " # req.alertId # " to incident " # incidentId, req.customer);
        } catch (e) {
          rawErr := ?e.message();
          addAuditEntry(caller.toText(), "PlaybookEscalateToIncidentHaloFailed",
            "Halo ticket creation failed for incident " # incidentId # ": " # e.message(), req.customer);
        };
        let success = true; // incident record created regardless of Halo API result
        let msg = switch (rawErr) {
          case null "Alert escalated to incident and Halo ticket created";
          case (?e) "Alert escalated to incident but Halo ticket creation failed: " # e;
        };
        { success; message = msg; dryRunPreview = null; rawApiError = rawErr; provider = null };
      };
    };
  };

  // ── Phase 6 — Enrichment public functions ─────────────────────────────────

  /// Trigger enrichment for a specific alert on demand.
  public shared ({ caller }) func enrichAlertPublic(
    alertId  : Text,
    customer : Text
  ) : async Result.Result<Text, Text> {
    requireAuth(caller, "enrichAlertPublic");
    if (alertId.size() > 512) { return #err("alertId too long") };
    let arr = normalizedAlerts.toArray();
    switch (arr.find<(Text, Types.NormalizedAlert)>(func((id, _)) { Text.equal(id, alertId) })) {
      case null { #err("Alert not found: " # alertId) };
      case (?(_, alert)) {
        if (alert.customer != customer and customer != "") {
          return #err("Alert does not belong to customer");
        };
        let abuseKey = enrichmentApiKeys.abuseIpdbKey.get("");
        let vtKey    = enrichmentApiKeys.virusTotalKey.get("");
        let enriched = await ThreatIntel.enrichAlert(alert, abuseKey, vtKey, maliciousIpFeed, transform);
        let updatedAlert : Types.NormalizedAlert = { alert with enrichment = ?enriched };
        let updated = normalizedAlerts.toArray().map(
          func((id, a)) {
            if (Text.equal(id, alertId)) (id, updatedAlert) else (id, a);
          }
        );
        normalizedAlerts := List.fromArray(updated);
        addAuditEntry(caller.toText(), "AlertEnriched", "Enrichment triggered for alert " # alertId, customer);
        #ok("Enrichment complete");
      };
    };
  };

  /// Save enrichment API keys (AbuseIPDB and VirusTotal).
  /// Key values are never returned to the frontend.
  public shared ({ caller }) func saveEnrichmentKeys(
    keys : { abuseIpdbKey : ?Text; virusTotalKey : ?Text }
  ) : async () {
    requireAuth(caller, "saveEnrichmentKeys");
    enrichmentApiKeys := keys;
    addAuditEntry(caller.toText(), "EnrichmentKeysUpdated", "Enrichment API keys updated", "");
  };

  /// Return which enrichment keys are configured (booleans only — never the key values).
  public shared ({ caller }) func getEnrichmentKeys() : async { abuseIpdbKeySet : Bool; virusTotalKeySet : Bool } {
    requireAuth(caller, "getEnrichmentKeys");
    {
      abuseIpdbKeySet  = enrichmentApiKeys.abuseIpdbKey.isSome();
      virusTotalKeySet = enrichmentApiKeys.virusTotalKey.isSome();
    };
  };

  // ── Phase 7 — Report Functions ────────────────────────────────────────────

  /// Generate a report as CSV and store it.
  public shared ({ caller }) func generateReport(
    req : { reportType : Text; dateRangeStart : Text; dateRangeEnd : Text; providerScope : [Text]; customer : Text }
  ) : async Result.Result<{ reportId : Text; csvData : Text }, Text> {
    requireAuth(caller, "generateReport");
    let nowNs = Time.now();
    let reportId = "report-" # nowNs.toText();
    var csvData = "";
    switch (req.reportType) {
      case "SecurityPosture" {
        let alerts = normalizedAlerts.toArray();
        var rows : [Text] = ["alertId,severity,provider,title,resource,region,timestamp,status,owner,mitreTag"];
        for ((_, a) in alerts.vals()) {
          if ((req.customer == "" or Text.equal(a.customer, req.customer)) and
              (req.providerScope.size() == 0 or req.providerScope.find<Text>(func(p) {
                let pText = switch (a.provider) { case (#AWS) "AWS"; case (#Azure) "Azure"; case (#GCP) "GCP" };
                Text.equal(p, pText) or Text.equal(p, "All");
              }) != null)) {
            let sevText = switch (a.severity) { case (#Critical) "Critical"; case (#High) "High"; case (#Medium) "Medium"; case (#Low) "Low"; case (#Unknown) "Unknown" };
            let provText = switch (a.provider) { case (#AWS) "AWS"; case (#Azure) "Azure"; case (#GCP) "GCP" };
            let resourceText = a.assetId.get("");
            let regionText   = a.region.get("");
            let ownerText    = a.owner.get("");
            let mitreText    = switch (a.mitre) { case (?m) m.tactic # ":" # m.technique; case null "" };
            let statusText   = switch (a.status) { case (#Open) "Open"; case (#InProgress) "InProgress"; case (#Resolved) "Resolved" };
            rows := rows.concat([a.id # "," # sevText # "," # provText # "," # a.title # "," # resourceText # "," # regionText # "," # a.timestamp.toText() # "," # statusText # "," # ownerText # "," # mitreText]);
          };
        };
        csvData := rows.vals().join("\n");
      };
      case "ComplianceStatus" {
        var rows : [Text] = ["framework,controlId,controlTitle,status,remediation"];
        let frameworks : [Types.ComplianceFramework] = [#NISTCSF, #CISAws, #CISAzure, #CISGCP, #ISO27001, #SOC2];
        for (fw in frameworks.vals()) {
          let controls = Compliance.getFrameworkControls(fw, null);
          for (c in controls.vals()) {
            let fwText  = switch (fw) { case (#NISTCSF) "NISTCSF"; case (#CISAws) "CISAws"; case (#CISAzure) "CISAzure"; case (#CISGCP) "CISGCP"; case (#ISO27001) "ISO27001"; case (#SOC2) "SOC2" };
            let stText  = switch (c.status) { case (#Passing) "Passing"; case (#Failing) "Failing"; case (#NoCoverage) "NoCoverage" };
            rows := rows.concat([fwText # "," # c.controlId # "," # c.title # "," # stText # "," # c.remediationGuidance]);
          };
        };
        csvData := rows.vals().join("\n");
      };
      case "IncidentSummary" {
        var rows : [Text] = ["incidentId,type,severity,status,detectedAt,resolvedAt,providers,timeDeltaMinutes,assignedOwner"];
        for ((_, inc) in correlatedIncidents.vals()) {
          if (req.customer == "" or Text.equal(inc.customer, req.customer)) {
            let sevText    = switch (inc.severity) { case (#Critical) "Critical"; case (#High) "High"; case (#Medium) "Medium"; case (#Low) "Low"; case (#Unknown) "Unknown" };
            let statusText = switch (inc.status) { case (#Open) "Open"; case (#Investigating) "Investigating"; case (#Resolved) "Resolved" };
            let provText   = inc.sourceProviders.map(func(p) { switch p { case (#AWS) "AWS"; case (#Azure) "Azure"; case (#GCP) "GCP" } }).vals().join("+");
            let ownerText  = inc.assignedOwner.get("");
            rows := rows.concat([inc.incidentId # "," # inc.incidentType # "," # sevText # "," # statusText # "," # inc.detectedAt.toText() # ",," # provText # "," # inc.timeDeltaMinutes.toText() # "," # ownerText]);
          };
        };
        csvData := rows.vals().join("\n");
      };
      case "ThreatIntelSummary" {
        var rows : [Text] = ["alertId,title,sourceIp,abuseScore,country,mitreTag,knownMalicious"];
        for ((_, a) in normalizedAlerts.toArray().vals()) {
          if ((req.customer == "" or Text.equal(a.customer, req.customer)) and a.enrichment.isSome()) {
            let enc = a.enrichment.get({ mitreDetail = null; ipReputation = null; domainRep = null; knownMaliciousIp = false; enrichedAt = null });
            let sourceIp   = ThreatIntel.extractIpFromAlert(a).get("");
            let abuseScore = switch (enc.ipReputation) { case (?r) r.abuseScore.toText(); case null "" };
            let country    = switch (enc.ipReputation) { case (?r) r.country;              case null "" };
            let mitreText  = switch (a.mitre) { case (?m) m.tactic # ":" # m.technique;   case null "" };
            let known      = if (enc.knownMaliciousIp) "true" else "false";
            rows := rows.concat([a.id # "," # a.title # "," # sourceIp # "," # abuseScore # "," # country # "," # mitreText # "," # known]);
          };
        };
        csvData := rows.vals().join("\n");
      };
      case _ {
        return #err("Unknown reportType: " # req.reportType);
      };
    };
    let genAt = nowNs.toText();
    let report : Types.GeneratedReport = {
      reportId;
      reportType     = req.reportType;
      dateRangeStart = req.dateRangeStart;
      dateRangeEnd   = req.dateRangeEnd;
      providerScope  = req.providerScope;
      format         = "CSV";
      generatedAt    = genAt;
      generatedBy    = caller.toText();
      customer       = req.customer;
      csvData        = ?csvData;
    };
    generatedReports := generatedReports.concat([report]);
    addAuditEntry(caller.toText(), "ReportGenerated",
      req.reportType # " report generated: " # reportId, req.customer);
    #ok({ reportId; csvData });
  };

  /// Return the list of generated reports for a customer (without CSV data).
  public shared ({ caller }) func getReports(customer : Text) : async [Types.GeneratedReport] {
    requireAuth(caller, "getReports");
    let filtered = generatedReports.filter(func(r) {
      customer == "" or Text.equal(r.customer, customer);
    });
    // Strip csvData from listing
    filtered.map<Types.GeneratedReport, Types.GeneratedReport>(func(r) { { r with csvData = null } });
  };

  /// Return the CSV data for a specific report.
  public shared ({ caller }) func getReportCsv(reportId : Text, customer : Text) : async ?Text {
    requireAuth(caller, "getReportCsv");
    let maybeReport = generatedReports.find(func(r) {
      Text.equal(r.reportId, reportId) and (customer == "" or Text.equal(r.customer, customer));
    });
    switch (maybeReport) {
      case null null;
      case (?r) r.csvData;
    };
  };

  /// Delete a generated report by ID.
  public shared ({ caller }) func deleteReport(reportId : Text, customer : Text) : async () {
    requireAuth(caller, "deleteReport");
    if (reportId.size() > 512) { Runtime.trap("reportId too long") };
    generatedReports := generatedReports.filter<Types.GeneratedReport>(func(r) {
      not Text.equal(r.reportId, reportId);
    });
    addAuditEntry(caller.toText(), "ReportDeleted", "Report " # reportId # " deleted", customer);
  };

  /// Save (upsert) a report email configuration.
  public shared ({ caller }) func saveReportEmailConfig(
    config : { reportType : Text; recipients : [Text]; customer : Text }
  ) : async () {
    requireAuth(caller, "saveReportEmailConfig");
    let existing = reportEmailConfigs.find(func(c) {
      Text.equal(c.reportType, config.reportType) and Text.equal(c.customer, config.customer);
    });
    let newEntry : Types.ReportEmailConfig = {
      reportType = config.reportType;
      recipients = config.recipients;
      customer   = config.customer;
    };
    switch (existing) {
      case null {
        reportEmailConfigs := reportEmailConfigs.concat([newEntry]);
      };
      case (?_) {
        reportEmailConfigs := reportEmailConfigs.map<Types.ReportEmailConfig, Types.ReportEmailConfig>(func(c) {
          if (Text.equal(c.reportType, config.reportType) and Text.equal(c.customer, config.customer)) newEntry else c;
        });
      };
    };
    addAuditEntry(caller.toText(), "ReportEmailConfigSaved",
      "Email config for " # config.reportType # " saved", config.customer);
  };

  /// Return email configs for a customer.
  public shared ({ caller }) func getReportEmailConfig(
    customer : Text
  ) : async [{ reportType : Text; recipients : [Text] }] {
    requireAuth(caller, "getReportEmailConfig");
    let filtered = reportEmailConfigs.filter(func(c) {
      customer == "" or Text.equal(c.customer, customer);
    });
    filtered.map<Types.ReportEmailConfig, { reportType : Text; recipients : [Text] }>(func(c) {
      { reportType = c.reportType; recipients = c.recipients };
    });
  };

};

