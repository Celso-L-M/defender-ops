import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AzureDashboardPage from "../pages/AzureDashboardPage";
import GcpDashboardPage from "../pages/GcpDashboardPage";
import VaultPage from "../pages/VaultPage";
import type { Asset, ProviderType } from "../types";

// jsdom does not implement the native <dialog> element's imperative API, which
// SecurityEventFeed and CorrelatedIncidentsPanel rely on.
Object.defineProperty(HTMLDialogElement.prototype, "show", {
  configurable: true,
  value: function () {
    this.open = true;
  },
});
Object.defineProperty(HTMLDialogElement.prototype, "close", {
  configurable: true,
  value: function () {
    this.open = false;
  },
});
Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
  configurable: true,
  value: function () {
    this.open = true;
  },
});

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor: {}, isFetching: false }),
  useInternetIdentity: () => ({
    identity: undefined,
    login: vi.fn(),
    clear: vi.fn(),
    loginStatus: "idle",
    isInitializing: false,
    isLoginIdle: true,
    isLoggingIn: false,
    isLoginSuccess: false,
    isLoginError: false,
    isAuthenticated: false,
  }),
}));

vi.mock("@tanstack/react-router", () => ({
  useRouterState: () => ({ location: { pathname: "/providers/azure" } }),
  Link: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const useGetMyProvidersMock = vi.fn();
const useNormalizedAlertsMock = vi.fn();
const useAssetsMock = vi.fn();
const useComplianceStatusMock = vi.fn();
const useCorrelatedIncidentsMock = vi.fn();
const useProviderStatesMock = vi.fn();
const listVaultSecretsMock = vi.fn();
const auditLogMock = vi.fn();

vi.mock("../hooks/use-backend", () => ({
  useGetMyProviders: (...args: unknown[]) => useGetMyProvidersMock(...args),
  useNormalizedAlerts: (...args: unknown[]) => useNormalizedAlertsMock(...args),
  useAssets: (...args: unknown[]) => useAssetsMock(...args),
  useComplianceStatus: (...args: unknown[]) => useComplianceStatusMock(...args),
  useCorrelatedIncidents: (...args: unknown[]) =>
    useCorrelatedIncidentsMock(...args),
  useProviderStates: (...args: unknown[]) => useProviderStatesMock(...args),
  useBlockIp: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useIsolateResource: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDisableAzureAdAccount: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useForceGcpIamReview: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useListVaultSecrets: (...args: unknown[]) => listVaultSecretsMock(...args),
  useSaveVaultSecret: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateVaultSecret: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDeleteVaultSecret: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useRevealVaultSecret: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useAuditLog: (...args: unknown[]) => auditLogMock(...args),
  useProviderCredentialStatus: (provider: string) => ({
    data: { provider, configured: false, fields: [] },
    isLoading: false,
  }),
  useSaveProviderCredential: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useUpdateProviderCredential: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useClearProviderCredential: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useTestProviderConnection: () => ({
    mutate: vi.fn(),
    isPending: false,
    data: undefined,
  }),
  usePipelineHealth: () => ({ data: [] }),
  useGlobalSearch: () => ({ data: { results: [] }, isLoading: false }),
}));

const mixedAssets: Asset[] = [
  {
    id: "asset-azure-1",
    name: "vm-prod-01",
    provider: "Azure",
    assetType: "AzureVM",
    region: "eastus",
    accountId: "sub-abc",
    customer: "default",
    tags: [],
    riskScore: BigInt(42),
    openFindings: BigInt(3),
    lastSeen: BigInt(Date.now() - 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: "asset-gcp-1",
    name: "gcs-prod-bucket",
    provider: "GCP",
    assetType: "GCPStorage",
    region: "us-central1",
    accountId: "proj-123",
    customer: "default",
    tags: [],
    riskScore: BigInt(70),
    openFindings: BigInt(2),
    lastSeen: BigInt(Date.now() - 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: "asset-aws-1",
    name: "web-prod-01",
    provider: "AWS",
    assetType: "EC2",
    region: "us-east-1",
    accountId: "123456789012",
    customer: "default",
    tags: [],
    riskScore: BigInt(10),
    openFindings: BigInt(1),
    lastSeen: BigInt(Date.now() - 60 * 1000) * BigInt(1_000_000),
  },
];

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("provider dashboards keep their provider-scoped views (characterize)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useGetMyProvidersMock.mockReturnValue({
      data: ["AWS", "Azure", "GCP"] as ProviderType[],
      isLoading: false,
    });
    useNormalizedAlertsMock.mockReturnValue({ data: [], isLoading: false });
    useAssetsMock.mockReturnValue({ data: mixedAssets, isLoading: false });
    useComplianceStatusMock.mockReturnValue({
      data: {
        score: 82n,
        total: 100n,
        passing: 82n,
        failing: 18n,
        controls: [],
      },
      isLoading: false,
    });
    useCorrelatedIncidentsMock.mockReturnValue({ data: [], isLoading: false });
    useProviderStatesMock.mockReturnValue({ data: [] });
  });

  it("renders the Azure dashboard with Azure-scoped assets only", () => {
    renderWithQuery(<AzureDashboardPage />);
    expect(
      screen.getByRole("heading", { name: "Azure Dashboard" }),
    ).toBeInTheDocument();
    // The Azure assets stat counts only the Azure asset (1 of 3 in the fixture).
    expect(screen.getByTestId("azure_dashboard.stat.assets")).toHaveTextContent(
      "1",
    );
    expect(
      screen.getByTestId("azure_dashboard.connection.section"),
    ).toBeInTheDocument();
  });

  it("shows the Azure access-denied state when the user is not assigned to Azure", () => {
    useGetMyProvidersMock.mockReturnValue({
      data: ["AWS"] as ProviderType[],
      isLoading: false,
    });
    renderWithQuery(<AzureDashboardPage />);
    expect(screen.getByTestId("azure.access_denied")).toBeInTheDocument();
    expect(screen.getByText("Azure access not assigned")).toBeInTheDocument();
  });

  it("renders the GCP dashboard with GCP-scoped assets only", () => {
    renderWithQuery(<GcpDashboardPage />);
    expect(
      screen.getByRole("heading", { name: "GCP Dashboard" }),
    ).toBeInTheDocument();
    expect(screen.getByText("gcs-prod-bucket")).toBeInTheDocument();
    // Another provider's asset must not leak into the GCP view.
    expect(screen.queryByText("vm-prod-01")).not.toBeInTheDocument();
    expect(screen.queryByText("web-prod-01")).not.toBeInTheDocument();
  });

  it("shows the GCP access-denied state when the user is not assigned to GCP", () => {
    useGetMyProvidersMock.mockReturnValue({
      data: ["AWS"] as ProviderType[],
      isLoading: false,
    });
    renderWithQuery(<GcpDashboardPage />);
    expect(screen.getByTestId("gcp.access_denied")).toBeInTheDocument();
    expect(screen.getByText("GCP access not assigned")).toBeInTheDocument();
  });
});

describe("vault page keeps per-provider isolation and audit log (characterize)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listVaultSecretsMock.mockReturnValue({ data: [], isLoading: false });
    auditLogMock.mockReturnValue({ data: [], isLoading: false });
  });

  it("scopes the secret list to the selected provider and re-scopes on tab switch", async () => {
    listVaultSecretsMock.mockImplementation((provider: ProviderType) => ({
      data:
        provider === "GCP"
          ? [
              {
                provider: "GCP",
                name: "gcp-service-account",
                maskedValue: "••••••••••••",
                createdAt: BigInt(1_700_000_000_000_000_000),
                updatedAt: BigInt(1_700_000_000_000_000_000),
              },
            ]
          : [],
      isLoading: false,
    }));
    const user = userEvent.setup();
    renderWithQuery(<VaultPage />);

    // AWS is the default active provider and has no secrets.
    expect(listVaultSecretsMock).toHaveBeenCalledWith("AWS");
    expect(screen.getByText("No secrets stored for AWS")).toBeInTheDocument();

    await user.click(screen.getByTestId("vault.provider_tab.gcp"));
    expect(listVaultSecretsMock).toHaveBeenCalledWith("GCP");
    expect(screen.getByText("gcp-service-account")).toBeInTheDocument();
    // The AWS empty state is gone once GCP is active.
    expect(
      screen.queryByText("No secrets stored for AWS"),
    ).not.toBeInTheDocument();
  });

  it("renders the audit log section with recorded vault activity", () => {
    auditLogMock.mockReturnValue({
      data: [
        {
          id: "audit-1",
          actorId: "aaaaa-aa",
          action: "vault.create",
          details: "AWS / prod-stripe-api-key",
          customer: "",
          timestamp: BigInt(1_700_000_000_000_000_000),
        },
      ],
      isLoading: false,
    });
    renderWithQuery(<VaultPage />);
    expect(screen.getByTestId("vault.audit_log")).toBeInTheDocument();
    expect(screen.getByText("vault.create")).toBeInTheDocument();
    expect(screen.getByText("AWS / prod-stripe-api-key")).toBeInTheDocument();
  });
});
