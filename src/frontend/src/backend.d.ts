import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface IpReputation {
    isp: string;
    country: string;
    lastReported: string;
    totalReports: bigint;
    abuseScore: bigint;
}
export interface SearchResult {
    id: string;
    title: string;
    provider?: ProviderType;
    customer: string;
    description: string;
    timestamp: bigint;
    sourceModule: string;
    severity?: Severity;
}
export type Result_2 = {
    __kind__: "ok";
    ok: {
        csvData: string;
        reportId: string;
    };
} | {
    __kind__: "err";
    err: string;
};
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<HttpHeader>;
}
export interface UserAssignmentView {
    principal: string;
    providers: Array<ProviderType>;
}
export interface HttpRequestResult {
    status: bigint;
    body: Uint8Array;
    headers: Array<HttpHeader>;
}
export type VaultSecretName = string;
export interface Result__1 {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export interface CorrelatedIncident {
    status: IncidentStatus;
    incidentId: string;
    customer: string;
    sourceAlerts: Array<string>;
    detectedAt: bigint;
    assignedOwner?: string;
    sourceIp?: string;
    sourceProviders: Array<ProviderType>;
    timeDeltaMinutes: number;
    notes?: string;
    affectedResources: Array<string>;
    severity: Severity;
    correlationWindowMinutes: bigint;
    incidentType: string;
}
export type Result_1 = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: VaultError;
};
export interface NotificationLog {
    id: string;
    status: NotificationStatus;
    acknowledgedAt?: bigint;
    customer: string;
    ruleId: string;
    recipient: string;
    alertId: string;
    acknowledged: boolean;
    timestamp: bigint;
    channel: NotificationChannel;
}
export interface TimelineEvent {
    id: string;
    title: string;
    provider?: ProviderType;
    customer: string;
    description: string;
    timestamp: bigint;
    severity?: Severity;
    eventType: string;
}
export interface GeneratedReport {
    csvData?: string;
    customer: string;
    providerScope: Array<string>;
    generatedAt: string;
    generatedBy: string;
    dateRangeStart: string;
    dateRangeEnd: string;
    reportType: string;
    reportId: string;
    format: string;
}
export interface MitreDetail {
    techniqueName: string;
    tacticName: string;
    mitigations: string;
    description: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: HttpRequestResult;
}
export type ConnectionTestResult = {
    __kind__: "Success";
    Success: string;
} | {
    __kind__: "Failure";
    Failure: string;
};
export interface ComplianceControl {
    status: ControlStatus;
    title: string;
    provider?: ProviderType;
    framework: ComplianceFramework;
    failingFindings: bigint;
    description: string;
    controlId: string;
    remediationGuidance: string;
    passingFindings: bigint;
}
export interface Cell {
    value: Value;
    name: string;
}
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export interface ProviderPollingState {
    status: PollingStatus;
    provider: ProviderType;
    interval: PollingInterval;
    lastPollAttempt?: bigint;
    lastSuccessfulPoll?: bigint;
    findingsToday: bigint;
    lastError?: string;
    consecutiveFailures: bigint;
}
export interface PlaybookResult {
    rawApiError?: string;
    dryRunPreview?: string;
    provider?: ProviderType;
    message: string;
    success: boolean;
}
export type CredentialHealth = {
    __kind__: "Error";
    Error: string;
} | {
    __kind__: "Authenticating";
    Authenticating: null;
} | {
    __kind__: "Valid";
    Valid: null;
} | {
    __kind__: "ExpiringSoon";
    ExpiringSoon: string;
} | {
    __kind__: "Expired";
    Expired: null;
};
export interface DomainRep {
    suspiciousVotes: bigint;
    maliciousVotes: bigint;
    cleanVotes: bigint;
    lastAnalysisDate: string;
}
export interface ComplianceTrendEntry {
    passingControls: bigint;
    framework: ComplianceFramework;
    totalControls: bigint;
    score: bigint;
    weekTimestamp: bigint;
}
export interface Asset {
    id: string;
    region: string;
    provider: ProviderType;
    accountId: string;
    customer: string;
    name: string;
    tags: Array<[string, string]>;
    assetType: AssetType;
    lastSeen: bigint;
    riskScore: bigint;
    openFindings: bigint;
}
export interface AlertRule {
    id: string;
    region?: string;
    escalationRecipient?: string;
    severityThreshold?: RuleSeverityThreshold;
    provider?: ProviderType;
    customer: string;
    assetId?: string;
    name: string;
    escalationMinutes?: bigint;
    channels: Array<NotificationChannel>;
    cooldownMinutes: bigint;
    enabled: boolean;
    findingType?: string;
}
export interface AuditLogEntry {
    id: string;
    action: string;
    customer: string;
    actorId: string;
    timestamp: bigint;
    details: string;
}
export interface IngestionStats {
    providerStates: Array<ProviderPollingState>;
    activeProviders: bigint;
    totalFindingsToday: bigint;
}
export interface NormalizedAlert {
    id: string;
    region?: string;
    status: AlertStatus;
    mitre?: MitreTag;
    title: string;
    findingId: string;
    provider: ProviderType;
    accountId?: string;
    customer: string;
    assetId?: string;
    owner?: string;
    rawFindingId: string;
    recurrenceCount: bigint;
    description: string;
    ingestionSource?: Variant_Poll_Webhook;
    originalSeverity: string;
    timestamp: bigint;
    assetType?: string;
    severity: Severity;
    enrichment?: AlertEnrichment;
}
export interface RawFinding {
    id: string;
    region?: string;
    title: string;
    findingId: string;
    provider: ProviderType;
    accountId?: string;
    description: string;
    rawMetadata: string;
    timestamp: bigint;
    severity: Severity;
}
export interface MitreTag {
    techniqueId: string;
    technique: string;
    tactic: string;
}
export interface HttpHeader {
    value: string;
    name: string;
}
export interface CorrelationStats {
    totalAllTime: bigint;
    byType: Array<[string, bigint]>;
    totalToday: bigint;
    totalThisWeek: bigint;
}
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: VaultError;
};
export type Result_3 = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export interface AlertEnrichment {
    domainRep?: DomainRep;
    knownMaliciousIp: boolean;
    ipReputation?: IpReputation;
    enrichedAt?: string;
    mitreDetail?: MitreDetail;
}
export interface VaultEntryView {
    provider: ProviderType;
    name: VaultSecretName;
    createdAt: bigint;
    updatedAt: bigint;
    maskedValue: string;
}
export interface CredentialHealthStatus {
    provider: string;
    expiryNs?: bigint;
    health: CredentialHealth;
}
export enum AlertStatus {
    Open = "Open",
    InProgress = "InProgress",
    Resolved = "Resolved"
}
export enum AssetType {
    S3 = "S3",
    AzureVM = "AzureVM",
    EC2 = "EC2",
    RDS = "RDS",
    AzureDatabase = "AzureDatabase",
    GCPStorage = "GCPStorage",
    GCPCloudSQL = "GCPCloudSQL",
    Lambda = "Lambda",
    AzureStorage = "AzureStorage",
    GCPCompute = "GCPCompute",
    Other = "Other"
}
export enum ComplianceFramework {
    CISAws = "CISAws",
    CISGCP = "CISGCP",
    SOC2 = "SOC2",
    ISO27001 = "ISO27001",
    CISAzure = "CISAzure",
    NISTCSF = "NISTCSF"
}
export enum ControlStatus {
    Passing = "Passing",
    NoCoverage = "NoCoverage",
    Failing = "Failing"
}
export enum IncidentStatus {
    Open = "Open",
    Investigating = "Investigating",
    Resolved = "Resolved"
}
export enum NotificationChannel {
    Email = "Email",
    InApp = "InApp",
    TeamsWebhook = "TeamsWebhook"
}
export enum NotificationStatus {
    Failed = "Failed",
    Sent = "Sent",
    Acknowledged = "Acknowledged"
}
export enum PollingInterval {
    OneHour = "OneHour",
    ThirtyMin = "ThirtyMin",
    FifteenMin = "FifteenMin",
    FiveMin = "FiveMin"
}
export enum PollingStatus {
    Error_ = "Error",
    AuthPaused = "AuthPaused",
    Inactive = "Inactive",
    Active = "Active"
}
export enum ProviderType {
    AWS = "AWS",
    GCP = "GCP",
    Azure = "Azure"
}
export enum RuleSeverityThreshold {
    All = "All",
    AnyHigh = "AnyHigh",
    CriticalOrHigh = "CriticalOrHigh",
    AnyCritical = "AnyCritical",
    AnyLow = "AnyLow",
    AnyMedium = "AnyMedium"
}
export enum Severity {
    Low = "Low",
    High = "High",
    Medium = "Medium",
    Critical = "Critical",
    Unknown = "Unknown"
}
export enum Variant_Poll_Webhook {
    Poll = "Poll",
    Webhook = "Webhook"
}
export enum VaultError {
    NotFound = "NotFound",
    NotAuthorized = "NotAuthorized",
    AlreadyExists = "AlreadyExists",
    InvalidName = "InvalidName"
}
export interface backendInterface {
    /**
     * / Acknowledge a notification log entry.
     */
    acknowledgeNotification(logId: string): Promise<boolean>;
    /**
     * / Admin: assign (replace) the full set of providers a principal may access.
     * / Composes with the existing requireAuth guard (rejects anonymous callers).
     * / ProviderType is a closed variant, so every element is a known provider.
     */
    assignProviderAccess(principal: Principal, providers: Array<ProviderType>): Promise<void>;
    /**
     * / Block an IP address across one or more cloud providers.
     * / dryRun=true returns a preview without making any API calls.
     */
    blockIp(req: {
        ip: string;
        customer: string;
        providers: Array<ProviderType>;
        dryRun: boolean;
    }): Promise<PlaybookResult>;
    /**
     * / Delete an alert rule by ID.
     */
    deleteAlertRule(id: string): Promise<boolean>;
    /**
     * / Delete a generated report by ID.
     */
    deleteReport(reportId: string, customer: string): Promise<void>;
    /**
     * / Delete a named secret for a provider. Composes requireAuth and
     * / writes an audit entry.
     */
    deleteVaultSecret(provider: ProviderType, name: VaultSecretName): Promise<Result>;
    /**
     * / Disable an Azure AD user account via Microsoft Graph API.
     */
    disableAzureAdAccount(req: {
        customer: string;
        userPrincipalName: string;
        dryRun: boolean;
    }): Promise<PlaybookResult>;
    /**
     * / Trigger enrichment for a specific alert on demand.
     */
    enrichAlertPublic(alertId: string, customer: string): Promise<Result_3>;
    /**
     * / Escalate an alert to a full correlated incident and create a Halo ticket.
     */
    escalateToIncident(req: {
        customer: string;
        assignedOwner?: string;
        alertId: string;
        notes?: string;
        severity: string;
        dryRun: boolean;
    }): Promise<PlaybookResult>;
    execute(qJson: string): Promise<Result__1>;
    /**
     * / Export compliance report as CSV text.
     */
    exportComplianceCsv(framework: ComplianceFramework): Promise<string>;
    /**
     * / Export compliance report as PDF blob.
     */
    exportCompliancePdf(framework: ComplianceFramework): Promise<Uint8Array>;
    /**
     * / Force a GCP IAM review for a project, flagging over-privileged bindings.
     */
    forceGcpIamReview(req: {
        customer: string;
        projectId: string;
        dryRun: boolean;
    }): Promise<PlaybookResult>;
    /**
     * / Generate a report as CSV and store it.
     */
    generateReport(req: {
        customer: string;
        providerScope: Array<string>;
        dateRangeStart: string;
        dateRangeEnd: string;
        reportType: string;
    }): Promise<Result_2>;
    /**
     * / Find a single alert by its ID.
     * / Requires the caller to be assigned to the alert's provider.
     */
    getAlertById(id: string): Promise<NormalizedAlert | null>;
    /**
     * / Return all alert rules for a given customer.
     */
    getAlertRules(customer: string): Promise<Array<AlertRule>>;
    /**
     * / Return normalized alerts whose id matches any entry in alertIds.
     * / Scoped to the providers the caller is assigned to.
     */
    getAlertsForCorrelation(alertIds: Array<string>): Promise<Array<NormalizedAlert>>;
    getApiDoc(): Promise<string>;
    /**
     * / Find a single asset by its ID.
     * / Requires the caller to be assigned to the asset's provider.
     */
    getAssetById(id: string): Promise<Asset | null>;
    /**
     * / Return all open/in-progress normalized alerts for a given asset.
     * / Scoped to the providers the caller is assigned to.
     */
    getAssetFindings(assetId: string): Promise<Array<NormalizedAlert>>;
    /**
     * / Return assets matching the provided filter criteria.
     * / Scoped to the providers the caller is assigned to.
     */
    getAssets(filter: {
        region?: string;
        minRiskScore?: bigint;
        provider?: ProviderType;
        customer: string;
        limit: bigint;
        assetType?: AssetType;
    }): Promise<Array<Asset>>;
    /**
     * / Return audit log entries for a customer, sorted by timestamp descending.
     */
    getAuditLog(customer: string, limit: bigint): Promise<Array<AuditLogEntry>>;
    /**
     * / Return controls that have status Failing or NoCoverage.
     */
    getComplianceControlGaps(framework: ComplianceFramework): Promise<Array<ComplianceControl>>;
    /**
     * / Return compliance status for a framework, counting passing/failing findings per control.
     * / Scoped to the providers the caller is assigned to.
     */
    getComplianceStatus(framework: ComplianceFramework, provider: ProviderType | null): Promise<{
        total: bigint;
        failing: bigint;
        controls: Array<ComplianceControl>;
        score: bigint;
        passing: bigint;
    }>;
    /**
     * / Return compliance trend entries for a framework sorted by weekTimestamp ascending.
     */
    getComplianceTrend(framework: ComplianceFramework): Promise<Array<ComplianceTrendEntry>>;
    /**
     * / Return a correlated incident by its incidentId, or null if not found.
     * / Requires the caller to be assigned to one of the incident's source providers.
     */
    getCorrelatedIncidentById(id: string): Promise<CorrelatedIncident | null>;
    /**
     * / Return the most recent `limit` correlated incidents sorted by detectedAt descending.
     * / Scoped to incidents touching providers the caller is assigned to.
     */
    getCorrelatedIncidents(limit: bigint): Promise<Array<[string, CorrelatedIncident]>>;
    /**
     * / Return aggregated correlation statistics for the dashboard panel.
     * / Scoped to incidents touching providers the caller is assigned to.
     */
    getCorrelationStats(): Promise<CorrelationStats>;
    /**
     * / Return the health status of each provider's credentials.
     * / Checks in-memory token cache expiry; no network call.
     * / Scoped to the providers the caller is assigned to.
     */
    getCredentialHealth(): Promise<Array<CredentialHealthStatus>>;
    /**
     * / Return which enrichment keys are configured (booleans only — never the key values).
     */
    getEnrichmentKeys(): Promise<{
        abuseIpdbKeySet: boolean;
        virusTotalKeySet: boolean;
    }>;
    /**
     * / Return failed ingestion records, optionally filtered by provider.
     * / provider field is returned as Text to avoid Candid variant decoding issues on the frontend.
     * / Scoped to the providers the caller is assigned to.
     */
    getFailedIngestions(provider: ProviderType | null, limit: bigint): Promise<Array<{
        id: string;
        status: string;
        provider: string;
        errorMessage: string;
        errorType: string;
        timestamp: bigint;
        rawPayload: string;
    }>>;
    /**
     * / Return aggregated ingestion statistics for the dashboard.
     * / Scoped to the providers the caller is assigned to.
     */
    getIngestionStats(): Promise<IngestionStats>;
    /**
     * / Frontend: read the current caller's assigned providers.
     */
    getMyProviders(): Promise<Array<ProviderType>>;
    /**
     * / Return normalized alerts matching the provided filter criteria.
     * / Scoped to the providers the caller is assigned to.
     */
    getNormalizedAlerts(filter: {
        status?: AlertStatus;
        provider?: ProviderType;
        customer: string;
        limit: bigint;
        severity?: Severity;
    }): Promise<Array<NormalizedAlert>>;
    /**
     * / Return notification logs for a customer, sorted by timestamp descending.
     */
    getNotificationLogs(filter: {
        customer: string;
        limit: bigint;
    }): Promise<Array<NotificationLog>>;
    /**
     * / Return per-provider pipeline health stats for the dashboard.
     * / provider field is returned as Text to avoid Candid variant decoding issues on the frontend.
     * / Scoped to the providers the caller is assigned to.
     */
    getPipelineHealth(): Promise<Array<{
        provider: string;
        failedIngestionCount: bigint;
        pollEventsToday: bigint;
        normalizationSuccessRate: number;
        webhookEventsToday: bigint;
        avgLatencyMs: number;
    }>>;
    /**
     * / Return per-provider polling state (status, last poll time, error info).
     * / Scoped to the providers the caller is assigned to.
     */
    getProviderStates(): Promise<Array<ProviderPollingState>>;
    /**
     * / Return paginated raw findings for a given provider.
     * / limit: max items to return (default 100, max 500). offset: starting index.
     * / Requires the caller to be assigned to the requested provider.
     */
    getRawFindings(provider: ProviderType, limit: bigint, offset: bigint): Promise<{
        hasMore: boolean;
        totalCount: bigint;
        items: Array<RawFinding>;
    }>;
    /**
     * / Return the CSV data for a specific report.
     */
    getReportCsv(reportId: string, customer: string): Promise<string | null>;
    /**
     * / Return email configs for a customer.
     */
    getReportEmailConfig(customer: string): Promise<Array<{
        reportType: string;
        recipients: Array<string>;
    }>>;
    /**
     * / Return the list of generated reports for a customer (without CSV data).
     */
    getReports(customer: string): Promise<Array<GeneratedReport>>;
    /**
     * / Return recent timeline events for a customer, sorted by timestamp descending.
     * / Scoped to the providers the caller is assigned to.
     */
    getTimeline(customer: string, limit: bigint): Promise<Array<TimelineEvent>>;
    /**
     * / Return which providers have a webhook secret configured (booleans only —
     * / never the secret values).
     */
    getWebhookSecretStatus(): Promise<{
        azureSet: boolean;
        gcpSet: boolean;
        awsSet: boolean;
    }>;
    /**
     * / Return aggregated webhook statistics for the dashboard.
     * / Scoped to the providers the caller is assigned to.
     */
    getWebhookStats(): Promise<{
        webhookNormalizationRate: number;
        webhookEventsToday: bigint;
    }>;
    /**
     * / Search across alerts, assets, and audit log.
     * / maxResults: cap total results (default 100, max 500). hasMore indicates truncation.
     * / Scoped to the providers the caller is assigned to.
     */
    globalSearch(query: string, customer: string, maxResults: bigint): Promise<{
        hasMore: boolean;
        results: Array<SearchResult>;
    }>;
    /**
     * / Returns true if credentials have been saved for at least one provider.
     */
    hasAdminCredentials(): Promise<boolean>;
    http_request(request: {
        url: string;
        method: string;
        body: Uint8Array;
        headers: Array<[string, string]>;
    }): Promise<{
        body: Uint8Array;
        headers: Array<[string, string]>;
        upgrade?: boolean;
        streaming_strategy?: null;
        status_code: number;
    }>;
    http_request_update(request: {
        url: string;
        method: string;
        body: Uint8Array;
        headers: Array<[string, string]>;
    }): Promise<{
        body: Uint8Array;
        headers: Array<[string, string]>;
        upgrade?: boolean;
        streaming_strategy?: null;
        status_code: number;
    }>;
    /**
     * / Isolate a resource by modifying its network configuration.
     */
    isolateResource(req: {
        provider: ProviderType;
        customer: string;
        resourceId: string;
        dryRun: boolean;
    }): Promise<PlaybookResult>;
    /**
     * / Admin: list all users and their provider assignments.
     */
    listUserAssignments(): Promise<Array<UserAssignmentView>>;
    /**
     * / List all vault entries for a provider as masked views (never plaintext).
     * / Composes requireAuth.
     */
    listVaultSecrets(provider: ProviderType): Promise<Array<VaultEntryView>>;
    /**
     * / Admin: remove a single provider from a principal's access.
     */
    removeProviderAccess(principal: Principal, provider: ProviderType): Promise<void>;
    /**
     * / Reveal/decrypt a single secret value on demand. Composes
     * / requireAuth and writes an audit entry recording the reveal.
     */
    revealVaultSecret(provider: ProviderType, name: VaultSecretName): Promise<Result_1>;
    /**
     * / Revoke IAM credentials for a user/service account across providers.
     */
    revokeIamCredentials(req: {
        provider: ProviderType;
        customer: string;
        userId: string;
        accessKeyId?: string;
        dryRun: boolean;
    }): Promise<PlaybookResult>;
    /**
     * / Insert or update an alert rule.
     */
    saveAlertRule(rule: AlertRule): Promise<boolean>;
    /**
     * / Save enrichment API keys (AbuseIPDB and VirusTotal).
     * / Key values are never returned to the frontend.
     */
    saveEnrichmentKeys(keys: {
        virusTotalKey?: string;
        abuseIpdbKey?: string;
    }): Promise<void>;
    /**
     * / Save (upsert) a report email configuration.
     */
    saveReportEmailConfig(config: {
        customer: string;
        reportType: string;
        recipients: Array<string>;
    }): Promise<void>;
    /**
     * / Store a new named secret for a provider. Encrypted at rest; the value is
     * / never returned. Composes requireAuth and writes an audit entry.
     */
    saveVaultSecret(provider: ProviderType, name: VaultSecretName, value: string): Promise<Result>;
    /**
     * / Save the webhook signature secret for a provider.
     * / The secret value is stored write-only and is never returned to the frontend.
     */
    saveWebhookSecret(provider: ProviderType, secret: string): Promise<void>;
    schema(): Promise<string>;
    /**
     * / Update the polling interval for a specific provider.
     */
    setPollingInterval(provider: ProviderType, interval: PollingInterval): Promise<void>;
    /**
     * / Validate stored AWS credentials against the live API.
     */
    testAwsConnection(): Promise<ConnectionTestResult>;
    /**
     * / Validate stored Azure credentials against the live API.
     */
    testAzureConnection(): Promise<ConnectionTestResult>;
    /**
     * / Validate stored GCP credentials against the live API.
     */
    testGcpConnection(): Promise<ConnectionTestResult>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    /**
     * / Trigger an immediate poll for the specified provider.
     */
    triggerPoll(provider: ProviderType): Promise<void>;
    /**
     * / Update the status and optional owner of an alert.
     */
    updateAlertStatus(id: string, newStatus: AlertStatus, owner: string | null): Promise<boolean>;
    /**
     * / Update status, owner, and/or notes on a correlated incident. Returns true if found.
     */
    updateCorrelatedIncidentStatus(id: string, newStatus: IncidentStatus, owner: string | null, notes: string | null): Promise<boolean>;
    /**
     * / Update an existing named secret for a provider. Composes
     * / requireAuth and writes an audit entry.
     */
    updateVaultSecret(provider: ProviderType, name: VaultSecretName, value: string): Promise<Result>;
}
