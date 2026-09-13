mixin () {

  public query func getApiDoc() : async Text {
    "# SecOps Platform — Backend API Documentation

This document describes the public API of the SecOps Platform backend canister.
It is authored from the current backend source and is accurate to the deployed
code. All timestamps are **nanoseconds since the Unix epoch** (`Int`) unless a
method explicitly states otherwise.

## Purpose

The canister ingests cloud security findings from AWS GuardDuty, Azure
Defender, and GCP Security Command Center — either by polling the providers or
by receiving inbound webhooks — normalizes them into a common alert schema,
correlates them into cross-cloud incidents, tracks an asset inventory, computes
compliance posture, and exposes remediation playbooks. It also generates CSV
reports and records an immutable audit trail.

## Authentication & Authorization

Authorization is enforced on the backend for every guarded method. There are two
layers:

1. **Identity check** — `isAuthorized(caller)` returns `true` for any
   **signed-in (non-anonymous) caller** and `false` for the anonymous principal.
   Guarded methods call `requireAuth(caller, fnName)`, which traps with the
   message `Unauthorized` (and writes an audit entry) when the caller is
   anonymous.
2. **Per-provider access control** — a signed-in caller may only view and act on
   the cloud providers they are assigned to. `requireProviderAccess(caller,
   provider, fnName)` first runs `requireAuth`, then traps with the message
   `Not authorized for provider` when the caller is not assigned to `provider`.
   Provider-scoped reads and all remediation actions enforce this.

- **Anonymous callers** are rejected on every guarded update method with a
  `Unauthorized` trap. On provider-scoped reads that call
  `requireProviderAccess`, an anonymous caller also traps with `Unauthorized`.
- **Signed-in callers** (any non-anonymous principal) pass the identity check.
  There is no separate admin/owner role distinction in the current build; the
  first signed-in caller to save credentials effectively becomes the operator.
- **Provider-scoped reads** (`getRawFindings`, `getNormalizedAlerts`,
  `getAlertById`, `getAssets`, `getAssetById`, `getComplianceStatus`,
  `getFailedIngestions`) call `requireProviderAccess` and trap with
  `Not authorized for provider` when the caller is not assigned to the requested
  provider.
- **Provider-filtered reads** (`getProviderStates`, `getIngestionStats`,
  `getTimeline`, `getCorrelatedIncidents`, `getCorrelatedIncidentById`,
  `getCorrelationStats`, `getPipelineHealth`, `getWebhookStats`,
  `getAssetFindings`, `getAlertsForCorrelation`) do not trap; they silently
  return only the rows whose provider the caller is assigned to. An anonymous or
  unassigned caller receives an empty (or filtered) result.
- **Public query methods** (`getComplianceTrend`, `getComplianceControlGaps`,
  `exportComplianceCsv`, `exportCompliancePdf`, `getAlertRules`,
  `getNotificationLogs`, `getAuditLog`, `hasAdminCredentials`) call no guard and
  are callable by anyone, including anonymous callers.
- Several \"read\" methods that expose configuration status (`getEnrichmentKeys`,
  `getWebhookSecretStatus`, `getReports`, `getReportCsv`, `getReportEmailConfig`)
  are declared as `shared` (update) methods and DO call `requireAuth`, so they
  reject anonymous callers.

### Per-provider access control

Provider assignments are managed by an operator (any signed-in caller) through
four methods:

- `assignProviderAccess(principal, providers)` — replaces the full set of
  providers a principal may access. Requires a signed-in caller.
- `removeProviderAccess(principal, provider)` — removes a single provider from a
  principal's assignment; when the last provider is removed the assignment is
  dropped. Requires a signed-in caller.
- `listUserAssignments()` — returns every principal and its assigned providers.
  Requires a signed-in caller.
- `getMyProviders()` — returns the current caller's assigned providers. Callable
  by any signed-in caller; an anonymous caller receives an empty list.

Assignments are stored per principal as a list of `ProviderType` values. A user
with no assignment can sign in but sees no provider data and cannot run any
remediation. Provider-scoped reads and remediation actions (`blockIp`,
`isolateResource`, `revokeIamCredentials`, `disableAzureAdAccount`,
`forceGcpIamReview`, `escalateToIncident`) all enforce assignment via
`requireProviderAccess`.

### Identity derivation

The app's frontend pins an Internet Identity derivation origin, published at
`/.well-known/ii-derivation-origin` when available. An agent already holding the
user's Internet Identity authorization derives the correct per-app principal
against that origin, for example:

    icp identity link web <name> --app <host>

Such a delegation acts with the user's full authority in this app until it
expires. A signed-in caller derived against a different origin is a different
principal than the one the frontend registered, so it may be treated as
unregistered even though it belongs to the same human.

### Registration

There is no separate registration endpoint in this build. A caller becomes
\"known\" only by signing in through the app's own frontend. A principal that
never did so is unregistered even when it belongs to the app's operator. Because
the identity check only requires a non-anonymous caller, an unregistered but
signed-in principal still passes `requireAuth`; however, it is not assigned to
any provider, so provider-scoped reads and remediation trap with
`Not authorized for provider` until an operator calls `assignProviderAccess` for
it.

## Units & Encodings

- **Timestamps**: `Int` nanoseconds since the Unix epoch. `Time.now()` is used
  throughout. Day buckets are computed as `secondsSinceEpoch / 86400`.
- **Provider identifiers**: the `ProviderType` variant `#AWS`, `#Azure`, `#GCP`.
  Several query methods return provider as `Text` (`\"AWS\"`, `\"Azure\"`,
  `\"GCP\"`) to avoid Candid variant decoding issues on the frontend.
- **Severity**: the `Severity` variant `#Low`, `#Medium`, `#High`, `#Critical`,
  `#Unknown`.
- **Alert status**: `#Open`, `#InProgress`, `#Resolved`.
- **Incident status**: `#Open`, `#Investigating`, `#Resolved`.
- **Optional fields** (`?Text`, `?Int`, etc.) are returned as Candid options;
  `null` means absent.
- **Identifiers** are `Text` strings (finding IDs, alert IDs, asset IDs,
  incident IDs, report IDs).
- **Polling intervals**: the `PollingInterval` variant `#FiveMin`,
  `#FifteenMin`, `#ThirtyMin`, `#OneHour`.

## Webhook Ingestion (HTTP endpoints)

The canister exposes three inbound webhook paths, handled by `http_request`
(query) and `http_request_update` (update):

- `POST /webhook/aws` — AWS GuardDuty
- `POST /webhook/azure` — Azure Defender
- `POST /webhook/gcp` — GCP Security Command Center

`http_request` returns `upgrade = ?true` for these POST paths so the runtime
re-invokes them as `http_request_update`, which can persist state. All other
requests return HTTP 200 with a plain-text banner.

### Webhook signature verification

Inbound webhooks are authenticated by signature, not by caller identity:

- **AWS**: HMAC-SHA256 of the request body using the configured AWS webhook
  secret, hex-encoded, compared against the `X-Amz-Signature` header.
- **Azure**: the `Aeg-Sas-Key` header is compared (constant-time) against the
  configured Azure shared secret.
- **GCP**: the `Authorization` header's bearer token is compared (constant-time)
  against the configured GCP shared secret.

All comparisons are constant-time. If the secret is unconfigured, the header is
missing, or the signature does not match, the request is rejected with HTTP 401
and a failed-ingestion record is logged (`errorType = \"Unauthorized\"`). A
malformed payload is rejected with HTTP 400 (`errorType = \"ParseError\"`).
Unknown paths return HTTP 404. Successful webhooks store a raw finding and
record a pipeline metric; normalization and correlation run on the next
heartbeat, not inline.

### Webhook secret management (write-only)

- `saveWebhookSecret(provider, secret)` stores the per-provider shared secret.
  The value is **write-only**: it is never returned to the frontend or any
  queryable surface.
- `getWebhookSecretStatus()` returns only booleans (`awsSet`, `azureSet`,
  `gcpSet`) indicating whether each provider's secret is configured — never the
  secret values.

## Lifecycle & Polling

- **Heartbeat** (`system func heartbeat`) runs periodically and: runs the
  correlation engine when the configured interval has elapsed; processes the
  next batch of up to 50 raw findings into normalized alerts; recalculates risk
  scores for dirty assets; and refreshes the known-malicious IP feed every 6
  hours.
- **Polling**: `triggerPoll(provider)` forces an immediate poll. Polling state
  per provider is tracked in `ProviderPollingState` with a `PollingStatus`
  (`#Active`, `#Inactive`, `#Error`, `#AuthPaused`). After 3 consecutive
  failures a provider is paused (`#AuthPaused`). `setPollingInterval` changes
  the cadence.
- **Correlation**: `runCorrelationEngine` is guarded by a concurrency flag to
  prevent stacking. Incidents are deduplicated by `incidentId`.
- **Safe polling**: because `http_request` is a query and cannot write state,
  POST webhooks must go through `http_request_update`. Do not poll the webhook
  endpoints faster than the provider's delivery cadence; each accepted webhook
  appends a raw finding and a pipeline event.

## Mutation Retry Safety & Idempotency

- **Alert rules**: `saveAlertRule` is an upsert keyed by `rule.id`; re-saving the
  same ID updates in place. `deleteAlertRule` is idempotent (returns `false` if
  the ID was not present).
- **Correlated incidents**: `runCorrelationEngine` skips incidents whose
  `incidentId` already exists, so re-running is safe.
- **Mock seeding**: `seedMockAlertsAndRunCorrelation` only adds mock alerts whose
  IDs are not already present.
- **Reports**: `generateReport` creates a new report each call (IDs are
  time-based); `deleteReport` is idempotent.
- **Report email config**: `saveReportEmailConfig` is an upsert keyed by
  `reportType` + `customer`.
- **Credentials**: saving credentials replaces the stored value and invalidates
  any cached session/token.
- **Webhook secrets**: `saveWebhookSecret` overwrites the per-provider secret.
  There is no versioned-key rotation in this build; rotating means calling
  `saveWebhookSecret` again with a new value.

## Errors, Traps & Limits

- **Unauthorized**: guarded methods trap with `Unauthorized` for anonymous
  callers.
- **Not authorized for provider**: provider-scoped reads and remediation actions
  trap with `Not authorized for provider` when the caller is not assigned to the
  requested provider.
- **Length validation**: several methods trap with messages such as
  `\"id exceeds max length\"` when an identifier exceeds 512 characters.
- **Pagination**: `getRawFindings` clamps `limit` to a maximum of 500 (default
  100). `globalSearch` clamps `maxResults` to a maximum of 500 (default 100).
- **Playbook results**: remediation methods return a `PlaybookResult` with a
  `success` flag and a human-readable `message`; they do not trap on provider
  API failures but record the error in `rawApiError` and the audit log.
- **OQL**: `execute` traps with `OQL: invalid query — <reason>` on a malformed
  query.

## OQL (Object Query Layer)

The canister exposes persisted, non-secret data through the OQL query surface:

- `schema() : async Text` — returns the JSON schema of all queryable entities.
- `execute(qJson : Text) : async Result` — runs a JSON query against the
  entities.

All OQL entities are `controllerOnly`: only the platform controller (the Data
Intelligence agent) can read them; end users cannot. Exposed entities include
raw findings, normalized alerts, assets, compliance controls, compliance trend,
alert rules, notification logs, timeline events, audit log, failed ingestions,
pipeline events, correlated incidents, generated reports, report email configs,
per-provider polling states (`providerPollingState`), and per-provider access
assignments (`providerAssignment`, one row per principal/provider pair).
**Secret values are never exposed**: webhook secrets, enrichment API keys, and
cloud credentials are write-only and absent from the OQL schema. Sensitive
payload fields (e.g. failed-ingestion raw payloads, report CSV data,
notification recipients) are also omitted from the queryable surface.

## Non-obvious Gotchas

- `http_request` is a query and cannot persist; only `http_request_update` can
  store ingested findings.
- `getEnrichmentKeys` and `getWebhookSecretStatus` are declared as `shared`
  (update) methods even though they only read status; they require a signed-in
  caller.
- The `execute` OQL method is named `execute` because `query` is a reserved
  keyword in Motoko.
- Webhook secrets, enrichment keys, and cloud credentials are stored write-only
  and are never returned to the frontend or exposed through OQL.
- `getFailedIngestions` and `getPipelineHealth` return provider as `Text` to
  avoid Candid variant decoding issues on the frontend.
- Provider-scoped reads fall into two behaviors: methods that call
  `requireProviderAccess` trap with `Not authorized for provider` when the
  caller is unassigned, while provider-filtered reads silently return only the
  assigned providers' rows. A signed-in caller with no assignment therefore sees
  empty results from the filtered reads but traps on the guarded reads.
- `assignProviderAccess` replaces the whole assignment list for a principal; to
  add a provider to an existing assignment, pass the union of the current and
  new providers.
"
  };

};
