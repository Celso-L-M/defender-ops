import { createActor } from "@/backend";
import type {
  ComplianceFramework as BackendComplianceFramework,
  PollingInterval as BackendPollingInterval,
  ProviderType as BackendProviderType,
} from "@/backend.d";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AlertRule,
  AlertStatus,
  Asset,
  AuditLogEntry,
  BlockIpRequest,
  ComplianceControl,
  ComplianceFramework,
  ComplianceTrendEntry,
  CorrelatedIncident,
  CorrelationStats,
  CredentialHealthStatus,
  DisableAzureAdRequest,
  EscalateToIncidentRequest,
  FailedIngestion,
  ForceGcpIamReviewRequest,
  GenerateReportRequest,
  GeneratedReport,
  IngestionStats,
  IsolateResourceRequest,
  NormalizedAlert,
  NotificationLog,
  PipelineHealthStats,
  PlaybookResult,
  PollingInterval,
  ProviderPollingState,
  ProviderType,
  RawFinding,
  ReportEmailConfig,
  RevokeIamRequest,
  SearchResult,
  TimelineEvent,
} from "../types";

const STALE_30S = 30_000;

function toBackendProvider(p: ProviderType): BackendProviderType {
  return p as unknown as BackendProviderType;
}

function toBackendInterval(i: PollingInterval): BackendPollingInterval {
  return i as unknown as BackendPollingInterval;
}

function toBackendFramework(
  f: ComplianceFramework,
): BackendComplianceFramework {
  return f as unknown as BackendComplianceFramework;
}

export function useIngestionStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<IngestionStats>({
    queryKey: ["ingestionStats"],
    queryFn: async () => {
      if (!actor)
        return {
          providerStates: [],
          activeProviders: 0n,
          totalFindingsToday: 0n,
        };
      return actor.getIngestionStats() as Promise<IngestionStats>;
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S,
  });
}

export function useProviderStates() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ProviderPollingState[]>({
    queryKey: ["providerStates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProviderStates() as Promise<ProviderPollingState[]>;
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S,
  });
}

export function useRawFindings(provider: ProviderType, limit: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<{
    hasMore: boolean;
    totalCount: bigint;
    items: RawFinding[];
  }>({
    queryKey: ["rawFindings", provider, limit],
    queryFn: async () => {
      if (!actor) return { hasMore: false, totalCount: 0n, items: [] };
      return actor.getRawFindings(
        toBackendProvider(provider),
        BigInt(limit),
        BigInt(0),
      ) as Promise<{
        hasMore: boolean;
        totalCount: bigint;
        items: RawFinding[];
      }>;
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S,
  });
}

export function useSaveAwsCredentials() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (creds: {
      roleArn: string;
      externalId?: string;
      regions: string[];
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveAwsCredentials(creds);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["providerStates"] });
      qc.invalidateQueries({ queryKey: ["credentialHealth"] });
    },
  });
}

export function useCredentialHealth() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CredentialHealthStatus[]>({
    queryKey: ["credentialHealth"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getCredentialHealth();
      return (
        raw as Array<{
          provider: string;
          health: {
            __kind__: string;
            Error?: string;
            ExpiringSoon?: string;
            Authenticating?: null;
            Valid?: null;
            Expired?: null;
          };
          expiryNs?: bigint;
        }>
      ).map((item) => ({
        provider: item.provider,
        expiryNs: item.expiryNs ?? null,
        health: (() => {
          const h = item.health;
          if (h.__kind__ === "Valid") return { __kind__: "Valid" } as const;
          if (h.__kind__ === "Authenticating")
            return { __kind__: "Authenticating" } as const;
          if (h.__kind__ === "ExpiringSoon")
            return {
              __kind__: "ExpiringSoon",
              _0: h.ExpiringSoon ?? "",
            } as const;
          if (h.__kind__ === "Expired") return { __kind__: "Expired" } as const;
          return { __kind__: "Error", _0: h.Error ?? "Unknown error" } as const;
        })(),
      }));
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S / 2,
    refetchInterval: STALE_30S,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });
}

export function useSaveAzureCredentials() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (creds: {
      clientId: string;
      clientSecret: string;
      tenantId: string;
      subscriptionIds: string[];
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveAzureCredentials(creds);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["providerStates"] });
      qc.invalidateQueries({ queryKey: ["credentialHealth"] });
    },
  });
}

export function useSaveGcpCredentials() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (creds: {
      serviceAccountJson: string;
      projectIds: string[];
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveGcpCredentials(creds);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["providerStates"] });
      qc.invalidateQueries({ queryKey: ["credentialHealth"] });
    },
  });
}

export function useTestConnection(provider: ProviderType) {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      type CR =
        | { __kind__: "Success"; Success: string }
        | { __kind__: "Failure"; Failure: string };
      let result: CR;
      if (provider === "AWS") result = (await actor.testAwsConnection()) as CR;
      else if (provider === "Azure")
        result = (await actor.testAzureConnection()) as CR;
      else result = (await actor.testGcpConnection()) as CR;
      if ("Success" in result && result.__kind__ === "Success") {
        return { success: true, message: result.Success };
      }
      return {
        success: false,
        message: (result as { __kind__: "Failure"; Failure: string }).Failure,
      };
    },
  });
}

export function useTriggerPoll(provider: ProviderType) {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.triggerPoll(toBackendProvider(provider));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["providerStates"] });
      qc.invalidateQueries({ queryKey: ["ingestionStats"] });
    },
  });
}

export function useSetPollingInterval() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      provider,
      interval,
    }: { provider: ProviderType; interval: PollingInterval }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.setPollingInterval(
        toBackendProvider(provider),
        toBackendInterval(interval),
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["providerStates"] });
    },
  });
}

export function useNormalizedAlerts(filter: {
  customer: string;
  limit: number;
  provider?: ProviderType;
  severity?: string;
  status?: AlertStatus;
}) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<NormalizedAlert[]>({
    queryKey: ["normalizedAlerts", filter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNormalizedAlerts({
        customer: filter.customer,
        limit: BigInt(filter.limit),
        ...(filter.provider
          ? { provider: toBackendProvider(filter.provider) }
          : {}),
        ...(filter.severity
          ? { severity: filter.severity as import("@/backend.d").Severity }
          : {}),
        ...(filter.status
          ? { status: filter.status as import("@/backend.d").AlertStatus }
          : {}),
      }) as Promise<NormalizedAlert[]>;
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S,
  });
}

export function useAlertById(id: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<NormalizedAlert | null>({
    queryKey: ["alert", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAlertById(id) as Promise<NormalizedAlert | null>;
    },
    enabled: !!actor && !isFetching && !!id,
    staleTime: STALE_30S,
  });
}

export function useUpdateAlertStatus() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      alertId,
      status,
      owner,
    }: { alertId: string; status: AlertStatus; owner?: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateAlertStatus(
        alertId,
        status as unknown as Parameters<typeof actor.updateAlertStatus>[1],
        owner ?? null,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["normalizedAlerts"] });
      qc.invalidateQueries({ queryKey: ["alert"] });
      qc.invalidateQueries({ queryKey: ["assetFindings"] });
    },
  });
}

export function useUpdateAlertOwner() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      alertId,
      owner,
    }: { alertId: string; owner: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateAlertStatus(
        alertId,
        "Open" as unknown as Parameters<typeof actor.updateAlertStatus>[1],
        owner,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["normalizedAlerts"] });
      qc.invalidateQueries({ queryKey: ["alert"] });
    },
  });
}

export function useAssets(customer: string, limit: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Asset[]>({
    queryKey: ["assets", customer, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAssets({
        customer,
        limit: BigInt(limit),
      }) as Promise<Asset[]>;
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S,
  });
}

export function useAssetById(assetId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Asset | null>({
    queryKey: ["asset", assetId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAssetById(assetId) as Promise<Asset | null>;
    },
    enabled: !!actor && !isFetching && !!assetId,
    staleTime: STALE_30S,
  });
}

export function useAssetFindings(assetId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<NormalizedAlert[]>({
    queryKey: ["assetFindings", assetId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAssetFindings(assetId) as Promise<NormalizedAlert[]>;
    },
    enabled: !!actor && !isFetching && !!assetId,
    staleTime: STALE_30S,
  });
}

export function useComplianceStatus(
  framework: ComplianceFramework,
  provider?: ProviderType,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["complianceStatus", framework, provider],
    queryFn: async () => {
      if (!actor)
        return { total: 0n, passing: 0n, failing: 0n, score: 0n, controls: [] };
      return actor.getComplianceStatus(
        toBackendFramework(framework),
        provider ? toBackendProvider(provider) : null,
      );
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S,
  });
}

export function useComplianceTrend(framework: ComplianceFramework) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ComplianceTrendEntry[]>({
    queryKey: ["complianceTrend", framework],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getComplianceTrend(toBackendFramework(framework)) as Promise<
        ComplianceTrendEntry[]
      >;
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S,
  });
}

export function useComplianceControlGaps(framework: ComplianceFramework) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ComplianceControl[]>({
    queryKey: ["complianceGaps", framework],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getComplianceControlGaps(
        toBackendFramework(framework),
      ) as Promise<ComplianceControl[]>;
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S,
  });
}

export function useExportComplianceCsv() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (framework: ComplianceFramework) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.exportComplianceCsv(
        toBackendFramework(framework),
      ) as Promise<string>;
    },
  });
}

export function useExportCompliancePdf() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (framework: ComplianceFramework) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.exportCompliancePdf(
        toBackendFramework(framework),
      ) as Promise<Uint8Array>;
    },
  });
}

export function useTimeline(customer: string, limit: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TimelineEvent[]>({
    queryKey: ["timeline", customer, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTimeline(customer, BigInt(limit)) as Promise<
        TimelineEvent[]
      >;
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S,
  });
}

export function useAlertRules(customer: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AlertRule[]>({
    queryKey: ["alertRules", customer],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAlertRules(customer) as Promise<AlertRule[]>;
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S,
  });
}

export function useSaveAlertRule() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rule: AlertRule) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveAlertRule(
        rule as Parameters<typeof actor.saveAlertRule>[0],
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alertRules"] });
    },
  });
}

export function useDeleteAlertRule() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteAlertRule(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alertRules"] });
    },
  });
}

export function useNotificationLogs(customer: string, limit: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<NotificationLog[]>({
    queryKey: ["notificationLogs", customer, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotificationLogs({
        customer,
        limit: BigInt(limit),
      }) as Promise<NotificationLog[]>;
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S,
  });
}

export function useAcknowledgeNotification() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (logId: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.acknowledgeNotification(logId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notificationLogs"] });
    },
  });
}

// ── Playbook mutation hooks ──────────────────────────────────────────────────

export function useBlockIp() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<PlaybookResult, Error, BlockIpRequest>({
    mutationFn: async (req: BlockIpRequest) => {
      if (!actor) throw new Error("Actor not ready");
      const raw = (await actor.blockIp({
        ip: req.ip,
        customer: req.customer,
        providers: req.providers as Parameters<
          typeof actor.blockIp
        >[0]["providers"],
        dryRun: req.dryRun,
      })) as {
        success: boolean;
        message: string;
        dryRunPreview?: string;
        rawApiError?: string;
        provider?: string;
      };
      return {
        success: raw.success,
        message: raw.message,
        dryRunPreview: raw.dryRunPreview ?? null,
        rawApiError: raw.rawApiError ?? null,
        provider: raw.provider ?? null,
      };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auditLog"] });
    },
  });
}

export function useIsolateResource() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<PlaybookResult, Error, IsolateResourceRequest>({
    mutationFn: async (req: IsolateResourceRequest) => {
      if (!actor) throw new Error("Actor not ready");
      const raw = (await actor.isolateResource({
        resourceId: req.resourceId,
        provider: toBackendProvider(req.provider),
        customer: req.customer,
        dryRun: req.dryRun,
      })) as {
        success: boolean;
        message: string;
        dryRunPreview?: string;
        rawApiError?: string;
        provider?: string;
      };
      return {
        success: raw.success,
        message: raw.message,
        dryRunPreview: raw.dryRunPreview ?? null,
        rawApiError: raw.rawApiError ?? null,
        provider: raw.provider ?? null,
      };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auditLog"] });
    },
  });
}

export function useRevokeIamCredentials() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<PlaybookResult, Error, RevokeIamRequest>({
    mutationFn: async (req: RevokeIamRequest) => {
      if (!actor) throw new Error("Actor not ready");
      const raw = (await actor.revokeIamCredentials({
        userId: req.userId,
        provider: toBackendProvider(req.provider),
        customer: req.customer,
        dryRun: req.dryRun,
      })) as {
        success: boolean;
        message: string;
        dryRunPreview?: string;
        rawApiError?: string;
        provider?: string;
      };
      return {
        success: raw.success,
        message: raw.message,
        dryRunPreview: raw.dryRunPreview ?? null,
        rawApiError: raw.rawApiError ?? null,
        provider: raw.provider ?? null,
      };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auditLog"] });
    },
  });
}

export function useDisableAzureAdAccount() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<PlaybookResult, Error, DisableAzureAdRequest>({
    mutationFn: async (req: DisableAzureAdRequest) => {
      if (!actor) throw new Error("Actor not ready");
      const raw = (await actor.disableAzureAdAccount({
        userPrincipalName: req.userPrincipalName,
        customer: req.customer,
        dryRun: req.dryRun,
      })) as {
        success: boolean;
        message: string;
        dryRunPreview?: string;
        rawApiError?: string;
        provider?: string;
      };
      return {
        success: raw.success,
        message: raw.message,
        dryRunPreview: raw.dryRunPreview ?? null,
        rawApiError: raw.rawApiError ?? null,
        provider: raw.provider ?? null,
      };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auditLog"] });
    },
  });
}

export function useForceGcpIamReview() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<PlaybookResult, Error, ForceGcpIamReviewRequest>({
    mutationFn: async (req: ForceGcpIamReviewRequest) => {
      if (!actor) throw new Error("Actor not ready");
      const raw = (await actor.forceGcpIamReview({
        projectId: req.projectId,
        customer: req.customer,
        dryRun: req.dryRun,
      })) as {
        success: boolean;
        message: string;
        dryRunPreview?: string;
        rawApiError?: string;
        provider?: string;
      };
      return {
        success: raw.success,
        message: raw.message,
        dryRunPreview: raw.dryRunPreview ?? null,
        rawApiError: raw.rawApiError ?? null,
        provider: raw.provider ?? null,
      };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auditLog"] });
    },
  });
}

export function useEscalateToIncident() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<PlaybookResult, Error, EscalateToIncidentRequest>({
    mutationFn: async (req: EscalateToIncidentRequest) => {
      if (!actor) throw new Error("Actor not ready");
      const raw = (await actor.escalateToIncident({
        alertId: req.alertId,
        severity: req.severity,
        assignedOwner: req.assignedOwner,
        notes: req.notes,
        customer: req.customer,
        dryRun: req.dryRun,
      })) as {
        success: boolean;
        message: string;
        dryRunPreview?: string;
        rawApiError?: string;
        provider?: string;
      };
      return {
        success: raw.success,
        message: raw.message,
        dryRunPreview: raw.dryRunPreview ?? null,
        rawApiError: raw.rawApiError ?? null,
        provider: raw.provider ?? null,
      };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auditLog"] });
      qc.invalidateQueries({ queryKey: ["correlatedIncidents"] });
    },
  });
}

export function useAuditLog(customer: string, limit: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AuditLogEntry[]>({
    queryKey: ["auditLog", customer, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAuditLog(customer, BigInt(limit)) as Promise<
        AuditLogEntry[]
      >;
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S,
  });
}

export function usePipelineHealth() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PipelineHealthStats[]>({
    queryKey: ["pipelineHealth"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPipelineHealth() as Promise<PipelineHealthStats[]>;
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S / 2,
    refetchInterval: STALE_30S,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });
}

export function useFailedIngestions(provider?: string, limit = 100) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<FailedIngestion[]>({
    queryKey: ["failedIngestions", provider, limit],
    queryFn: async () => {
      if (!actor) return [];
      const backendProvider = provider
        ? (provider as import("@/backend.d").ProviderType)
        : null;
      return actor.getFailedIngestions(
        backendProvider,
        BigInt(limit),
      ) as Promise<FailedIngestion[]>;
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S,
  });
}

export function useWebhookStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<{
    webhookEventsToday: bigint;
    webhookNormalizationRate: number;
  }>({
    queryKey: ["webhookStats"],
    queryFn: async () => {
      if (!actor)
        return { webhookEventsToday: 0n, webhookNormalizationRate: 0 };
      return actor.getWebhookStats() as Promise<{
        webhookEventsToday: bigint;
        webhookNormalizationRate: number;
      }>;
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S / 2,
    refetchInterval: STALE_30S,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });
}

export function useCorrelatedIncidents(limit: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<[string, CorrelatedIncident][]>({
    queryKey: ["correlatedIncidents", limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCorrelatedIncidents(BigInt(limit)) as Promise<
        [string, CorrelatedIncident][]
      >;
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S,
  });
}

export function useCorrelationStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CorrelationStats>({
    queryKey: ["correlationStats"],
    queryFn: async () => {
      if (!actor)
        return {
          totalToday: 0n,
          totalThisWeek: 0n,
          totalAllTime: 0n,
          byType: [] as [string, bigint][],
        };
      return actor.getCorrelationStats() as Promise<CorrelationStats>;
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S,
  });
}

export function useCorrelatedIncidentById(id: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CorrelatedIncident | null>({
    queryKey: ["correlatedIncident", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCorrelatedIncidentById(
        id,
      ) as Promise<CorrelatedIncident | null>;
    },
    enabled: !!actor && !isFetching && !!id,
    staleTime: STALE_30S,
  });
}

export function useSeedAndTestCorrelation() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.seedMockAlertsAndRunCorrelation() as Promise<
        CorrelatedIncident[]
      >;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["correlatedIncidents"] });
      qc.invalidateQueries({ queryKey: ["correlationStats"] });
    },
  });
}

export function useUpdateCorrelatedIncidentStatus() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      owner,
      notes,
    }: {
      id: string;
      status: string;
      owner?: string;
      notes?: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateCorrelatedIncidentStatus(
        id,
        status as Parameters<typeof actor.updateCorrelatedIncidentStatus>[1],
        owner ?? null,
        notes ?? null,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["correlatedIncidents"] });
      qc.invalidateQueries({ queryKey: ["correlationStats"] });
      qc.invalidateQueries({ queryKey: ["correlatedIncident"] });
    },
  });
}

export function useAlertsForCorrelation(alertIds: string[]) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<NormalizedAlert[]>({
    queryKey: ["alertsForCorrelation", alertIds],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAlertsForCorrelation(alertIds) as Promise<
        NormalizedAlert[]
      >;
    },
    enabled: !!actor && !isFetching && alertIds.length > 0,
    staleTime: STALE_30S,
  });
}

// ── Enrichment hooks ──────────────────────────────────────────────────────

export function useEnrichAlert() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      alertId,
      customer,
    }: {
      alertId: string;
      customer: string;
    }) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      const result = await actor.enrichAlertPublic(alertId, customer);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["normalizedAlerts"] });
      queryClient.invalidateQueries({ queryKey: ["alert"] });
    },
  });
}

export function useGetEnrichmentKeys() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["enrichmentKeys"],
    queryFn: async () => {
      if (!actor) return { abuseIpdbKeySet: false, virusTotalKeySet: false };
      return actor.getEnrichmentKeys();
    },
    enabled: !!actor && !isFetching,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });
}

export function useSaveEnrichmentKeys() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (keys: {
      abuseIpdbKey?: string | null;
      virusTotalKey?: string | null;
    }) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      const payload: { abuseIpdbKey?: string; virusTotalKey?: string } = {};
      if (keys.abuseIpdbKey) payload.abuseIpdbKey = keys.abuseIpdbKey;
      if (keys.virusTotalKey) payload.virusTotalKey = keys.virusTotalKey;
      return actor.saveEnrichmentKeys(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrichmentKeys"] });
    },
  });
}

// ── Report hooks ──────────────────────────────────────────────────────────

export function useGetReports(customer: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<GeneratedReport[]>({
    queryKey: ["reports", customer],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReports(customer) as Promise<GeneratedReport[]>;
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });
}

export function useGenerateReport() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: {
      reportType: string;
      dateRangeStart: string;
      dateRangeEnd: string;
      providerScope: string[];
      customer: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const raw = (await actor.generateReport(req)) as
        | { __kind__: "ok"; ok: { reportId: string; csvData: string } }
        | { __kind__: "err"; err: string };
      if (raw.__kind__ === "err") throw new Error(raw.err);
      return raw.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}

export function useGetReportCsv() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      reportId,
      customer,
    }: { reportId: string; customer: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getReportCsv(reportId, customer) as Promise<string | null>;
    },
  });
}

export function useDeleteReport() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reportId,
      customer,
    }: {
      reportId: string;
      customer: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteReport(reportId, customer);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}

export function useSaveReportEmailConfig() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (config: {
      reportType: string;
      recipients: string[];
      customer: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveReportEmailConfig(config);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reportEmailConfig"] });
    },
  });
}

export function useGetReportEmailConfig(customer: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ReportEmailConfig[]>({
    queryKey: ["reportEmailConfig", customer],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReportEmailConfig(customer) as Promise<
        ReportEmailConfig[]
      >;
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });
}

export function useGlobalSearch(query: string, customer: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<{ hasMore: boolean; results: SearchResult[] }>({
    queryKey: ["globalSearch", query, customer],
    queryFn: async () => {
      if (!actor || query.length < 2) return { hasMore: false, results: [] };
      const raw = await actor.globalSearch(query, customer, BigInt(100));
      return raw as { hasMore: boolean; results: SearchResult[] };
    },
    enabled: !!actor && !isFetching && query.length >= 2,
    staleTime: 10_000,
  });
}
