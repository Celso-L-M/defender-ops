# Project Guidance

## User Preferences

- Separate vault per cloud provider with isolation and separate credentials for each provider
- Fixed typed credential schema per provider entered through structured fields
- Structured Provider Credentials section on the Cloud Vault page and a credentials section on each provider dashboard
- Per-customer isolation so each signed-in user only sees their own customer's records and assigned providers.
- Per-customer notification routing with email recipients and a Microsoft Teams webhook.
- Reports screen with scheduled report history, on-demand custom date range generation, PDF export and per-report-type email recipients.

## Accepted Requirements

- Scheduled report auto-generation: weekly Monday 06:00 UTC over the previous 7 days, monthly on the 1st 06:00 UTC over the previous calendar month, plus on-demand custom date range
- PDF export for reports with SecOps Platform branding, charts as images, table of contents and executive summary
- Email delivery of reports to configured recipients per report type
- Rate-limit backoff counters surfaced on the dashboard
- Verify and harden per-customer RBAC so multi-tenant isolation gates data in the UI
- Cursor pagination on getNormalizedAlerts for large volumes
- Alert rule builder plus notification routing with in-app, email and Microsoft Teams webhook channels, per-customer routing, deduplication with configurable cooldown default 1 hour, escalation, and a notification log

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- Backend commands run from src/backend/: `mops install`, `mops check --fix`, `mops build`; bindings are generated from the repo root with `pnpm bindgen`.
- This project uses Enhanced Migration: mops.toml has a [canisters.<name>.migrations] section and the migration chain lives in src/backend/migrations. An already-applied migration file is read-only; a new stored-field change needs a new migration file.
- Provider credentials are stored as one vault entry per provider under the reserved name 'provider-credential', encoded as key/value pairs joined by control characters; the vault is the single source of truth for the ingestion pipeline.
- The vault-backed credential API is getProviderCredentialStatus, saveProviderCredential, updateProviderCredential, clearProviderCredential and testProviderConnection; requireCredentialAccess grants the canister controller every provider and gates non-owners through requireProviderAccess.
- Frontend src/frontend/src/types.ts must not declare a local type whose name and shape copy a generated binding type; rename the declaration and re-export it via `export type { X as Y }` so string-literal call sites keep working.
- Generated string enums are nominal, so frontend string-literal unions must stay local and be aliased rather than imported from the generated bindings.
- Motoko text literals need every inner double quote escaped as \" or the string terminates early (M0097/M0057); two mixins included in one actor cannot both declare a top-level helper of the same name (M0051).
- The shared typed credential form is src/frontend/src/components/ProviderCredentialsForm.tsx, taking a single `provider: ProviderType` prop; the vault page and all three provider dashboards reuse it.
- Alert rules and notification routing must be keyed by the alert's customer (the provider accountId, or the literal "default" when absent); both AlertRulesPage and NotificationSettingsPage derive that key from the first visible normalized alert so the router's exact-customer match fires.
- getAlertRules and getNotificationLogs must requireAuth and reject an empty customer filter rather than treating it as match-all, or they leak every customer's records.
- Principal.isController() is false for end-user Internet Identity principals; the owner must be recorded from the first signed-in caller (ownerPrincipal) and treated as assigned to every provider, while non-owner callers still go through PerProviderAccessControl.isAssignedToProvider.
- Report run rows must coerce bigint/number/string timestamps through a guarded helper before calling date-fns formatDistanceToNow; a raw bigint throws RangeError: Invalid time value and the error boundary replaces the whole page.
- Radix Select.Item must never receive an empty-string value; use a sentinel value for the "all/any" option or the whole app crashes to the error boundary when the dialog opens.
- Motoko text literals need every inner double quote escaped as \" or the string terminates early and produces M0097/M0057 type errors.
- The alerts list uses useNormalizedAlertsPage (cursor + items + nextCursor) from hooks/use-backend.ts; tests that render AlertsPage must mock both useNormalizedAlertsPage and useNormalizedAlerts (the latter for Layout's NotificationBell).
- src/frontend/src/types.ts must alias generated binding types (export type { X as Y }) rather than redeclaring a local type with the same name and shape; generated string enums are nominal so frontend string-literal unions stay local and aliased.
