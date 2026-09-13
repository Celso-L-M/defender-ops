import type { backendInterface } from "../backend";
import {
  PollingInterval,
  PollingStatus,
  ProviderType,
  Severity,
} from "../backend";

export const mockBackend: backendInterface = {
  getIngestionStats: async () => ({
    activeProviders: BigInt(2),
    totalFindingsToday: BigInt(47),
    providerStates: [
      {
        provider: ProviderType.AWS,
        status: PollingStatus.Active,
        interval: PollingInterval.FifteenMin,
        lastSuccessfulPoll: BigInt(Date.now() - 8 * 60 * 1000) * BigInt(1_000_000),
        lastPollAttempt: BigInt(Date.now() - 8 * 60 * 1000) * BigInt(1_000_000),
        findingsToday: BigInt(23),
        consecutiveFailures: BigInt(0),
        lastError: undefined,
      },
      {
        provider: ProviderType.Azure,
        status: PollingStatus.Active,
        interval: PollingInterval.ThirtyMin,
        lastSuccessfulPoll: BigInt(Date.now() - 12 * 60 * 1000) * BigInt(1_000_000),
        lastPollAttempt: BigInt(Date.now() - 12 * 60 * 1000) * BigInt(1_000_000),
        findingsToday: BigInt(24),
        consecutiveFailures: BigInt(0),
        lastError: undefined,
      },
      {
        provider: ProviderType.GCP,
        status: PollingStatus.Inactive,
        interval: PollingInterval.OneHour,
        lastSuccessfulPoll: undefined,
        lastPollAttempt: undefined,
        findingsToday: BigInt(0),
        consecutiveFailures: BigInt(0),
        lastError: undefined,
      },
    ],
  }),

  getProviderStates: async () => [
    {
      provider: ProviderType.AWS,
      status: PollingStatus.Active,
      interval: PollingInterval.FifteenMin,
      lastSuccessfulPoll: BigInt(Date.now() - 8 * 60 * 1000) * BigInt(1_000_000),
      lastPollAttempt: BigInt(Date.now() - 8 * 60 * 1000) * BigInt(1_000_000),
      findingsToday: BigInt(23),
      consecutiveFailures: BigInt(0),
      lastError: undefined,
    },
    {
      provider: ProviderType.Azure,
      status: PollingStatus.Active,
      interval: PollingInterval.ThirtyMin,
      lastSuccessfulPoll: BigInt(Date.now() - 12 * 60 * 1000) * BigInt(1_000_000),
      lastPollAttempt: BigInt(Date.now() - 12 * 60 * 1000) * BigInt(1_000_000),
      findingsToday: BigInt(24),
      consecutiveFailures: BigInt(0),
      lastError: undefined,
    },
    {
      provider: ProviderType.GCP,
      status: PollingStatus.Inactive,
      interval: PollingInterval.OneHour,
      lastSuccessfulPoll: undefined,
      lastPollAttempt: undefined,
      findingsToday: BigInt(0),
      consecutiveFailures: BigInt(0),
      lastError: undefined,
    },
  ],

  getMyProviders: async () => [
    ProviderType.AWS,
    ProviderType.Azure,
    ProviderType.GCP,
  ],

  listUserAssignments: async () => [
    {
      principal: "2vxsx-fae",
      providers: [ProviderType.AWS, ProviderType.Azure, ProviderType.GCP],
    },
    {
      principal: "aaaaa-aa",
      providers: [ProviderType.AWS],
    },
  ],

  assignProviderAccess: async () => undefined,

  removeProviderAccess: async () => undefined,

  getRawFindings: async (_provider: ProviderType, _limit: bigint, _offset: bigint) => ({ hasMore: false, totalCount: BigInt(6), items: [
    {
      id: "raw-001",
      findingId: "gd-finding-a1b2c3d4",
      provider: ProviderType.AWS,
      title: "UnauthorizedAccess:IAMUser/MaliciousIPCaller.Custom",
      description: "API calls were made from an IP address on a custom threat list.",
      severity: Severity.High,
      timestamp: BigInt(Date.now() - 5 * 60 * 1000) * BigInt(1_000_000),
      region: "us-east-1",
      accountId: "123456789012",
      rawMetadata: '{"type":"UnauthorizedAccess","count":3,"ipAddress":"198.51.100.1"}',
    },
    {
      id: "raw-002",
      findingId: "gd-finding-b2c3d4e5",
      provider: ProviderType.AWS,
      title: "Recon:IAMUser/TorIPCaller",
      description: "API calls were made from a Tor exit node IP address.",
      severity: Severity.Medium,
      timestamp: BigInt(Date.now() - 15 * 60 * 1000) * BigInt(1_000_000),
      region: "eu-west-1",
      accountId: "123456789012",
      rawMetadata: '{"type":"Recon","torNode":true,"ipAddress":"192.0.2.55"}',
    },
    {
      id: "raw-003",
      findingId: "gd-finding-c3d4e5f6",
      provider: ProviderType.AWS,
      title: "CryptoCurrency:EC2/BitcoinTool.B!DNS",
      description: "EC2 instance is querying a domain name associated with Bitcoin mining.",
      severity: Severity.Critical,
      timestamp: BigInt(Date.now() - 25 * 60 * 1000) * BigInt(1_000_000),
      region: "us-west-2",
      accountId: "123456789012",
      rawMetadata: '{"type":"CryptoCurrency","instanceId":"i-0abc123def456"}',
    },
    {
      id: "raw-004",
      findingId: "az-alert-d4e5f6a7",
      provider: ProviderType.Azure,
      title: "Suspicious authentication activity",
      description: "Multiple failed sign-in attempts detected for a single user account.",
      severity: Severity.High,
      timestamp: BigInt(Date.now() - 10 * 60 * 1000) * BigInt(1_000_000),
      region: "eastus",
      accountId: "sub-abc-def-123",
      rawMetadata: '{"alertType":"MultipleFailedLogins","failedAttempts":12}',
    },
    {
      id: "raw-005",
      findingId: "az-alert-e5f6a7b8",
      provider: ProviderType.Azure,
      title: "Network scan detected",
      description: "Port scan activity detected originating from an internal VM.",
      severity: Severity.Medium,
      timestamp: BigInt(Date.now() - 20 * 60 * 1000) * BigInt(1_000_000),
      region: "westeurope",
      accountId: "sub-abc-def-123",
      rawMetadata: '{"alertType":"PortScan","sourceVm":"vm-prod-01","ports":42}',
    },
    {
      id: "raw-006",
      findingId: "az-alert-f6a7b8c9",
      provider: ProviderType.Azure,
      title: "Possible outgoing spam activity",
      description: "Unusual outbound SMTP traffic detected from a virtual machine.",
      severity: Severity.Low,
      timestamp: BigInt(Date.now() - 35 * 60 * 1000) * BigInt(1_000_000),
      region: "southeastasia",
      accountId: "sub-xyz-ghi-456",
      rawMetadata: '{"alertType":"OutboundSpam","smtpConnections":312}',
    },
  ]}),


  getCredentialHealth: async () => [
    { provider: "AWS", health: { __kind__: "Valid", Valid: null }, expiryNs: BigInt(Date.now() + 3600 * 1000) * BigInt(1_000_000) },
    { provider: "Azure", health: { __kind__: "Valid", Valid: null }, expiryNs: BigInt(Date.now() + 3600 * 1000) * BigInt(1_000_000) },
    { provider: "GCP", health: { __kind__: "Valid", Valid: null }, expiryNs: BigInt(Date.now() + 3600 * 1000) * BigInt(1_000_000) },
  ],

  hasAdminCredentials: async () => true,

  saveAwsCredentials: async () => undefined,
  saveAzureCredentials: async () => undefined,
  saveGcpCredentials: async () => undefined,

  setPollingInterval: async () => undefined,

  testAwsConnection: async () => ({ __kind__: "Success", Success: "Connected to AWS GuardDuty and Security Hub" }),
  testAzureConnection: async () => ({ __kind__: "Success", Success: "Connected to Azure Security Center" }),
  testGcpConnection: async () => ({ __kind__: "Failure", Failure: "No GCP credentials configured" }),

  triggerPoll: async () => undefined,

  getNormalizedAlerts: async (_filter: Parameters<typeof mockBackend.getNormalizedAlerts>[0]) => [],
  getAlertById: async () => null,
  updateAlertStatus: async () => true,
  getAssets: async () => [],
  getAssetById: async () => null,
  getAssetFindings: async () => [],
  getComplianceStatus: async () => ({ controls: [], score: 0n, total: 0n, passing: 0n, failing: 0n }),
  getComplianceTrend: async () => [],
  getComplianceControlGaps: async () => [],
  exportComplianceCsv: async () => "",
  exportCompliancePdf: async () => new Uint8Array(),
  getAlertRules: async () => [],
  saveAlertRule: async () => true,
  deleteAlertRule: async () => true,
  getNotificationLogs: async () => [],
  acknowledgeNotification: async () => true,
  getTimeline: async () => [],
  getAuditLog: async () => [],
  globalSearch: async (_query: string, _customer: string, _maxResults: bigint) => ({ hasMore: false, results: [] }),

  transform: async (input) => ({
    status: BigInt(200),
    body: input.response.body,
    headers: input.response.headers,
  }),

  getPipelineHealth: async () => [],

  getFailedIngestions: async () => [],

  getWebhookStats: async () => ({
    webhookEventsToday: 0n,
    webhookNormalizationRate: 0,
  }),

  getCorrelatedIncidents: async () => [],
  getCorrelationStats: async () => ({
    totalToday: 0n,
    totalThisWeek: 0n,
    totalAllTime: 0n,
    byType: [] as [string, bigint][],
  }),
  getCorrelatedIncidentById: async () => null,
  seedMockAlertsAndRunCorrelation: async () => [],
  updateCorrelatedIncidentStatus: async () => true,
  getAlertsForCorrelation: async () => [],

  getReports: async (_customer: string) => [
    {
      reportId: "rpt-001",
      reportType: "SecurityPosture",
      dateRangeStart: "2026-05-01",
      dateRangeEnd: "2026-05-27",
      providerScope: ["All"],
      format: "CSV",
      generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      generatedBy: "admin@acme.com",
      customer: "acme",
      csvData: undefined,
    },
    {
      reportId: "rpt-002",
      reportType: "ComplianceStatus",
      dateRangeStart: "2026-04-01",
      dateRangeEnd: "2026-04-30",
      providerScope: ["AWS", "Azure"],
      format: "CSV",
      generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      generatedBy: "admin@acme.com",
      customer: "acme",
      csvData: undefined,
    },
    {
      reportId: "rpt-003",
      reportType: "IncidentSummary",
      dateRangeStart: "2026-05-01",
      dateRangeEnd: "2026-05-27",
      providerScope: ["AWS"],
      format: "CSV",
      generatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      generatedBy: "soc@acme.com",
      customer: "acme",
      csvData: undefined,
    },
  ],

  generateReport: async (_req: Parameters<typeof mockBackend.generateReport>[0]) => ({
    __kind__: "ok" as const,
    ok: {
      reportId: `rpt-${Date.now()}`,
      csvData: "reportId,reportType,dateRangeStart,dateRangeEnd,providerScope,generatedAt\n" +
        `rpt-new,SecurityPosture,2026-05-01,2026-05-27,All,${new Date().toISOString()}\n`,
    },
  }),

  deleteReport: async (_reportId: string, _customer: string) => undefined,

  getReportCsv: async (_reportId: string, _customer: string) =>
    "reportId,reportType,dateRangeStart,dateRangeEnd,severity,count\n" +
    "rpt-001,SecurityPosture,2026-05-01,2026-05-27,Critical,5\n" +
    "rpt-001,SecurityPosture,2026-05-01,2026-05-27,High,18\n" +
    "rpt-001,SecurityPosture,2026-05-01,2026-05-27,Medium,42\n" +
    "rpt-001,SecurityPosture,2026-05-01,2026-05-27,Low,127\n",

  saveReportEmailConfig: async (_config: Parameters<typeof mockBackend.saveReportEmailConfig>[0]) => undefined,

  http_request: async () => ({
    status_code: 200,
    body: new Uint8Array(),
    headers: [],
    upgrade: false,
    streaming_strategy: null,
  }),

  http_request_update: async () => ({
    status_code: 200,
    body: new Uint8Array(),
    headers: [],
    upgrade: false,
    streaming_strategy: null,
  }),

  blockIp: async (req) => ({
    success: true,
    message: req.dryRun
      ? `Dry run: would block IP ${req.ip} on ${req.providers.join(", ")}`
      : `IP ${req.ip} blocked successfully on ${req.providers.join(", ")}`,
    dryRunPreview: req.dryRun
      ? `Would add deny rule for ${req.ip} to VPC Network ACL (${req.providers.join(", ")}). No changes made.`
      : undefined,
    rawApiError: undefined,
    provider: req.providers[0] ?? undefined,
  }),

  isolateResource: async (req) => ({
    success: true,
    message: req.dryRun
      ? `Dry run: would isolate resource ${req.resourceId} on ${req.provider}`
      : `Resource ${req.resourceId} isolated successfully on ${req.provider}`,
    dryRunPreview: req.dryRun
      ? `Would modify security group for ${req.resourceId} to deny all inbound/outbound traffic. No changes made.`
      : undefined,
    rawApiError: undefined,
    provider: req.provider,
  }),

  revokeIamCredentials: async (req) => ({
    success: true,
    message: req.dryRun
      ? `Dry run: would revoke credentials for ${req.userId} on ${req.provider}`
      : `Credentials for ${req.userId} revoked successfully on ${req.provider}`,
    dryRunPreview: req.dryRun
      ? `Would call IAM DeleteAccessKey and attach DenyAll policy to user ${req.userId}. No changes made.`
      : undefined,
    rawApiError: undefined,
    provider: req.provider,
  }),

  disableAzureAdAccount: async (req) => ({
    success: true,
    message: req.dryRun
      ? `Dry run: would disable Azure AD account ${req.userPrincipalName}`
      : `Azure AD account ${req.userPrincipalName} disabled successfully`,
    dryRunPreview: req.dryRun
      ? `Would call Microsoft Graph API to set accountEnabled=false for ${req.userPrincipalName}. No changes made.`
      : undefined,
    rawApiError: undefined,
    provider: undefined,
  }),

  forceGcpIamReview: async (req) => ({
    success: true,
    message: req.dryRun
      ? `Dry run: would generate IAM review report for project ${req.projectId}`
      : `IAM review report generated for project ${req.projectId}`,
    dryRunPreview: req.dryRun
      ? `Would enumerate all IAM bindings in project ${req.projectId} and flag bindings not reviewed in 30 days. No changes made.`
      : undefined,
    rawApiError: undefined,
    provider: undefined,
  }),

  escalateToIncident: async (req) => ({
    success: true,
    message: `Alert ${req.alertId} escalated to incident response case (severity: ${req.severity})`,
    dryRunPreview: undefined,
    rawApiError: undefined,
    provider: undefined,
  }),

  enrichAlertPublic: async (_alertId: string, _customer: string) => ({ __kind__: "ok" as const, ok: "Enrichment complete" }),

  saveEnrichmentKeys: async (_keys: { virusTotalKey?: string; abuseIpdbKey?: string }) => undefined,

  getEnrichmentKeys: async () => ({ abuseIpdbKeySet: false, virusTotalKeySet: false }),

  saveWebhookSecret: async (_provider: ProviderType, _secret: string) => undefined,

  getWebhookSecretStatus: async () => ({ awsSet: false, azureSet: false, gcpSet: false }),

  getReportEmailConfig: async (_customer: string) => [
    { reportType: "SecurityPosture", recipients: ["ciso@acme.com"] },
    { reportType: "ComplianceStatus", recipients: ["compliance@acme.com", "audit@acme.com"] },
  ],

  execute: async () => ({ hasMore: false, rows: [] }),

  getApiDoc: async () => "",

  schema: async () => "",
};
