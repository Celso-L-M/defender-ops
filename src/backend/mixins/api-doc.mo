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
  The **first signed-in caller to reach a guarded method is recorded as the
  owner (SYS_ADMIN)** and is authorized for every provider regardless of
  per-provider assignment. Ownership is claimed once and never changes; a
  canister controller is also always treated as the owner.
- **Provider-scoped reads** (`getRawFindings`, `getNormalizedAlerts`,
  `getAlertById`, `getAssets`, `getAssetById`, `getComplianceStatus`,
  `getFailedIngestions`) call `requireProviderAccess` and trap with
  `Not authorized for provider` when the caller is not assigned to the requested
  provider. The owner is never rejected.
- **Provider-filtered reads** (`getProviderStates`, `getIngestionStats`,
  `getTimeline`, `getCorrelatedIncidents`, `getCorrelatedIncidentById`,
  `getCorrelationStats`, `getPipelineHealth`, `getWebhookStats`,
  `getAssetFindings`, `getAlertsForCorrelation`) do not trap; they silently
  return only the rows whose provider the caller is assigned to. The owner sees
  every provider's rows. An anonymous or unassigned non-owner caller receives an
  empty (or filtered) result.
- **Public query methods** (`getComplianceTrend`, `getComplianceControlGaps`,
  `exportComplianceCsv`, `exportCompliancePdf`, `getAuditLog`,
  `hasAdminCredentials`) call no guard and are callable by anyone, including
  anonymous callers.
- **Customer-scoped reads** (`getAlertRules`, `getNotificationLogs`) require a
  signed-in caller and a non-empty `customer`; an anonymous caller traps with
  `Unauthorized`, and an empty `customer` is rejected (an audit entry is written
  and an empty list is returned) rather than treated as match-all. `getAlertRules`
  additionally returns only rules whose `provider` is unset or assigned to the
  caller.
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

### Owner (SYS_ADMIN)

The **owner** is authorized for every provider regardless of per-provider
assignment. The owner is either a canister controller or the principal recorded
as owner on the first signed-in call: the first non-anonymous caller to reach a
guarded method is recorded as the owner, and ownership is claimed once and never
changes. The owner therefore sees every provider's data from the
provider-filtered reads and is never rejected by `requireProviderAccess`. Every
other signed-in caller remains scoped to the providers explicitly assigned to
them, so per-customer and per-provider isolation is preserved for non-owners.

### Centralized secure vault

The vault replaces the legacy per-provider credential forms
(`saveAwsCredentials` / `saveAzureCredentials` / `saveGcpCredentials`, which
have been removed). It stores arbitrary named secrets per provider — API keys,
service-account JSON, webhook tokens, and any other credential — encrypted at
rest. The vault methods are:

- `saveVaultSecret(provider, name, value)` — store a new named secret. Returns
  `#AlreadyExists` if a secret with that name already exists for the provider,
  `#InvalidName` if the name is empty or longer than 256 characters.
- `updateVaultSecret(provider, name, value)` — overwrite an existing secret.
  Returns `#NotFound` if it does not exist, `#InvalidName` on an invalid name.
- `deleteVaultSecret(provider, name)` — remove a secret. Returns `#NotFound` if
  it does not exist.
- `listVaultSecrets(provider)` — list all secrets for a provider as masked
  views. **Never returns plaintext.**
- `revealVaultSecret(provider, name)` — decrypt and return a single secret
  value on demand. Returns `#NotFound` if it does not exist.

Every vault method first runs `requireVaultAccess(caller, provider, fnName)`,
which rejects anonymous callers with an `Unauthorized` trap and then enforces
per-provider access control. The owner (SYS_ADMIN — a canister controller or the
principal recorded as owner on the first signed-in call) is granted access to
every provider's vault regardless of per-provider assignment, so the owner can
set up and manage secrets for all providers even before any
`assignProviderAccess` has been issued. Non-owner users are restricted to only
the providers they are assigned to: `requireProviderAccess` traps with
`Not authorized for provider` when a non-owner caller is not assigned to the
requested provider. Every successful create/update/delete/reveal writes an audit
entry (`VaultSecretCreated` / `VaultSecretUpdated` / `VaultSecretDeleted` /
`VaultSecretRevealed`).

**Encryption at rest.** Secrets are encrypted with a SHA-256-based
authenticated scheme (CTR-mode keystream with an Encrypt-then-MAC integrity
tag). The 32-byte key is seeded from `raw_rand` on the first vault write and
held in memory; only the ciphertext and nonce are persisted. The plaintext is
never stored and never appears in list/overview responses — only a fixed
mask (`••••••••`) is shown. Decryption verifies the integrity tag and traps if
it does not match (tampered or corrupted data). Because the key is derived from
`raw_rand` and held in memory, a canister upgrade does not rotate it; the key
persists in stable state across upgrades.

### Vault-backed provider credentials

Each cloud provider has a **fixed typed credential schema**, stored as that
provider's isolated vault secret under the reserved name `provider-credential`.
The vault is the single source of truth: the legacy per-provider credential
stable vars (`awsCredentials` / `azureCredentials` / `gcpCredentials`) and their
save forms have been removed, so no credential is held in two places. The typed
schemas are:

- **AWS** — `roleArn` (required), `externalId` (optional), `regions` (required,
  non-empty).
- **Azure** — `clientId`, `clientSecret`, `tenantId` (all required),
  `subscriptionIds` (required, non-empty).
- **GCP** — `serviceAccountJson` (required), `projectIds` (required, non-empty).

The credential methods are:

- `getProviderCredentialStatus(provider)` — returns `{ provider, configured,
  fields, updatedAt }`. `configured` is `false` when the provider's vault has no
  credential entry. When configured, `fields` carries the **masked** structured
  fields only (a fixed mask plus, for values longer than four characters, the
  last four characters); plaintext is never returned.
- `saveProviderCredential(input)` — stores a provider's typed credential.
  Returns `#InvalidCredential(message)` when a required field is missing, and
  `#VaultError(\"credential already exists\")` when one is already stored.
- `updateProviderCredential(input)` — overwrites an existing credential.
  Returns `#NotFound` when none is stored yet.
- `clearProviderCredential(provider)` — removes the credential. Returns
  `#NotFound` when none is stored.
- `testProviderConnection(provider)` — resolves the credential from the
  provider's vault entry and tests it against the live API. When the provider is
  unconfigured it returns a `#Failure` without attempting a connection.

Every credential method first runs `requireCredentialAccess`, which rejects
anonymous callers with an `Unauthorized` trap and then enforces per-provider
access control: the owner (SYS_ADMIN) is granted access to every provider's
credential regardless of per-provider assignment; non-owner users are restricted
to the providers they are assigned to (`requireProviderAccess` traps with
`Not authorized for provider`). Every successful create/update/clear writes an
audit entry (`ProviderCredentialCreated` / `ProviderCredentialUpdated` /
`ProviderCredentialCleared`).

**Unconfigured providers.** When a provider's vault has no credential entry, its
pipeline reports an unconfigured state and does not attempt to poll or connect:
`getProviderCredentialStatus` returns `configured = false`, `getCredentialHealth`
reports `#Error(\"No credentials configured\")`, `getIngestionStats` does not count
it as active, `triggerPoll` is a no-op for it, and the connection tests
(`testAwsConnection` / `testAzureConnection` / `testGcpConnection` and
`testProviderConnection`) return a `#Failure` without a network call.

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
it. The **first** signed-in caller to reach a guarded method is recorded as the
owner (SYS_ADMIN) and is authorized for every provider without an explicit
assignment; later callers are not owners and remain scoped to their
assignments.

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
- **Reports**: `generateReport` creates a new report each call (IDs are
  time-based); `deleteReport` is idempotent.
- **Report email config**: `saveReportEmailConfig` is an upsert keyed by
  `reportType` + `customer`.
- **Vault secrets**: `saveVaultSecret` returns `#AlreadyExists` when a secret
  with the same name already exists for the provider; `updateVaultSecret`
  overwrites an existing secret in place. `deleteVaultSecret` is idempotent
  (returns `#NotFound` when the secret is absent). Re-saving the same value
  re-encrypts it with a fresh timestamp.
- **Provider credentials**: `saveProviderCredential` returns
  `#VaultError(\"credential already exists\")` when a credential is already stored
  for the provider; `updateProviderCredential` overwrites it in place and returns
  `#NotFound` when none is stored. `clearProviderCredential` is idempotent
  (returns `#NotFound` when absent). Re-saving the same value re-encrypts it with
  a fresh timestamp.
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
  `getNormalizedAlerts` is cursor-paginated (see below).
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
per-provider polling states (`providerPollingState`), per-provider access
assignments (`providerAssignment`, one row per principal/provider pair), vault
entries (`vaultEntry`), provider credential status (`providerCredential`,
one row per provider with a `configured` flag and masked field summary), report
runs (`reportRun`), report recipient configs (`reportRecipientConfig`),
notification routings (`notificationRouting`), rate-limit backoff state
(`rateLimitState`), and throttling events (`throttleEvent`).
**Secret values are never exposed**: webhook secrets, enrichment API keys, cloud
credentials, and the encrypted vault ciphertext/nonce/plaintext are write-only
and absent from the OQL schema. The `vaultEntry` entity exposes ONLY non-sensitive
vault metadata — `provider`, `name`, `createdAt`, `updatedAt`, and a fixed
`maskedValue` mask — never the encrypted blob, nonce, or any plaintext secret.
The `providerCredential` entity likewise exposes only the `configured` flag, a
masked field summary, and `updatedAt` — never a plaintext credential value.
Sensitive payload fields (e.g. failed-ingestion raw payloads, report CSV data,
notification recipients) are also omitted from the queryable surface.

## Cursor-paginated alerts

`getNormalizedAlerts(filter)` returns a page of normalized alerts plus an opaque
next-page cursor:

    { items : [NormalizedAlert]; nextCursor : ?Text }

- `filter.cursor` is `null` for the first page. Pass the returned `nextCursor`
  back verbatim to fetch the next page; `nextCursor` is `null` when the page is
  the last one.
- The cursor encodes the last item's `(timestamp, id)` sort key, so it stays
  stable across inserts and deletes — unlike an array offset, which would skip
  or repeat rows when new alerts arrive between pages.
- Ordering is newest-first by `timestamp`, then by `id` descending as a
  tie-breaker. A malformed cursor is treated as the first page rather than
  trapping.
- `filter.limit` is the page size; `0` means the default page size (100).
- The existing `provider`, `severity`, `status` and `customer` filters are
  preserved, and results remain scoped to the providers the caller is assigned
  to.

## Reporting

Scheduled and on-demand report runs are recorded and emailed to the configured
recipients per report type:

- `getReportRuns(customer, limit)` — report runs for a customer, newest first.
- `getReportRun(runId, customer)` — a single run, scoped to the caller's
  customer.
- `getReportRecipients(reportType, customer)` — the recipient configuration.
- `saveReportRecipients(config)` — upsert the recipient configuration; every
  address is validated and the first invalid address rejects the whole config
  with `#InvalidRecipient(reason)`.
- `runReportOnDemand(reportType, periodStart, periodEnd, customer,
  providerScope)` — run a report for an explicit date range, email it, and
  record the run with per-recipient delivery outcomes. Returns
  `#InvalidPeriod` when the range is invalid.
- `runScheduledReport(reportType, trigger, customer, providerScope)` — record a
  scheduled (weekly or monthly) run. The weekly period is the previous 7 days;
  the monthly period is the previous calendar month.
- `exportReportPdf(reportType, periodStart, periodEnd, customer,
  providerScope)` — a **query** that returns the branded PDF-1.4 bytes
  (`Blob`) for a generated report, including the executive summary, table of
  contents and a chart of per-run delivery counts.

All reporting methods require a signed-in caller and a non-empty `customer`;
unauthorized attempts are recorded in the audit log.

## Notification routing

Alert rules are matched against each new alert and delivered across the
configured channels:

- `getAlertRules(customer)` / `saveAlertRule(rule)` / `deleteAlertRule(id)` —
  manage rules. `saveAlertRule` is an upsert keyed by `rule.id`. `getAlertRules`
  requires a signed-in caller and a non-empty `customer`, and returns only rules
  for that customer whose `provider` is unset or assigned to the caller.
- `getNotificationLogs(customer, limit)` — the immutable log of every delivery
  attempt. Requires a signed-in caller and a non-empty `customer`; an empty
  `customer` is rejected rather than treated as match-all.
- `acknowledgeNotification(id)` — mark a notification acknowledged.
- Routing is per customer: `NotificationRouting` carries the customer's Teams
  webhook URL, email recipients, cooldown and escalation window.

When a new alert is stored, the router plans deliveries for every matching,
enabled rule that is not suppressed by its cooldown (default 1 hour when the
rule sets `cooldownMinutes = 0`). Each planned delivery is performed and
recorded as a `NotificationLog` entry:

- **InApp** — recorded in the log only (surfaced in the UI).
- **Email** — one email per configured recipient via the email extension.
- **TeamsWebhook** — one MessageCard POST to the customer's webhook URL, sent
  as a non-replicated outcall so a single message is sent once.

A failed send never throws; it is recorded as a `#Failed` log entry.

## Rate-limit backoff

When a provider throttles a poll (HTTP 429 / rate-limit / too-many-requests),
the ingestion path records a throttling event and advances the provider's
exponential backoff:

- `getRateLimitStates()` — the backoff state for every tracked provider.
- `getThrottleEvents(provider, limit)` — recent throttling events, newest
  first; an explicit provider filter is access-checked.
- `resetProviderBackoff(provider)` — clear a provider's backoff after a
  successful poll.

A clean poll clears any accumulated backoff automatically. Backoff state is
surfaced on the dashboard.

## Non-obvious Gotchas

- `http_request` is a query and cannot persist; only `http_request_update` can
  store ingested findings.
- `getEnrichmentKeys` and `getWebhookSecretStatus` are declared as `shared`
  (update) methods even though they only read status; they require a signed-in
  caller.
- The `execute` OQL method is named `execute` because `query` is a reserved
  keyword in Motoko.
- Webhook secrets, enrichment keys, and cloud credentials are stored write-only
  and are never returned to the frontend or exposed through OQL. Vault secrets
  are encrypted at rest and returned only as masked views, except on an explicit
  `revealVaultSecret` call.
- `getFailedIngestions` and `getPipelineHealth` return provider as `Text` to
  avoid Candid variant decoding issues on the frontend.
- Provider-scoped reads fall into two behaviors: methods that call
  `requireProviderAccess` trap with `Not authorized for provider` when the
  caller is unassigned, while provider-filtered reads silently return only the
  assigned providers' rows. A signed-in non-owner caller with no assignment
  therefore sees empty results from the filtered reads but traps on the guarded
  reads. The owner (SYS_ADMIN) is exempt from both: it is authorized for every
  provider and sees every provider's rows.
- `assignProviderAccess` replaces the whole assignment list for a principal; to
  add a provider to an existing assignment, pass the union of the current and
  new providers.
"
  };

};
