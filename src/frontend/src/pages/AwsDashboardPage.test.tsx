import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AwsDashboardPage from "../pages/AwsDashboardPage";
import type { Asset, NormalizedAlert, ProviderType } from "../types";

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
  useRouterState: () => ({ location: { pathname: "/providers/aws" } }),
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
const useBlockIpMock = vi.fn();

vi.mock("../hooks/use-backend", () => ({
  useGetMyProviders: (...args: unknown[]) => useGetMyProvidersMock(...args),
  useNormalizedAlerts: (...args: unknown[]) => useNormalizedAlertsMock(...args),
  useAssets: (...args: unknown[]) => useAssetsMock(...args),
  useComplianceStatus: (...args: unknown[]) => useComplianceStatusMock(...args),
  useCorrelatedIncidents: (...args: unknown[]) =>
    useCorrelatedIncidentsMock(...args),
  useProviderStates: (...args: unknown[]) => useProviderStatesMock(...args),
  useBlockIp: (...args: unknown[]) => useBlockIpMock(...args),
  useIsolateResource: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useRevokeIamCredentials: () => ({ mutateAsync: vi.fn(), isPending: false }),
  usePipelineHealth: () => ({ data: [] }),
  useGlobalSearch: () => ({ data: { results: [] }, isLoading: false }),
}));

const awsAlerts: NormalizedAlert[] = [
  {
    id: "aws-alert-1",
    findingId: "gd-finding-a1b2c3d4",
    provider: "AWS",
    title: "UnauthorizedAccess:IAMUser/MaliciousIPCaller.Custom",
    description:
      "API calls were made from an IP address on a custom threat list.",
    severity: "High",
    originalSeverity: "High",
    status: "Open",
    assetId: "i-0abc123def456",
    assetType: "EC2",
    accountId: "123456789012",
    region: "us-east-1",
    customer: "default",
    rawFindingId: "raw-001",
    timestamp: BigInt(Date.now() - 5 * 60 * 1000) * BigInt(1_000_000),
  },
];

const awsAssets: Asset[] = [
  {
    id: "asset-aws-1",
    name: "web-prod-01",
    provider: "AWS",
    assetType: "EC2",
    region: "us-east-1",
    accountId: "123456789012",
    customer: "default",
    tags: [],
    riskScore: BigInt(42),
    openFindings: BigInt(3),
    lastSeen: BigInt(Date.now() - 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: "asset-azure-1",
    name: "vm-prod-01",
    provider: "Azure",
    assetType: "AzureVM",
    region: "eastus",
    accountId: "sub-abc",
    customer: "default",
    tags: [],
    riskScore: BigInt(10),
    openFindings: BigInt(1),
    lastSeen: BigInt(Date.now() - 60 * 1000) * BigInt(1_000_000),
  },
];

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AwsDashboardPage />
    </QueryClientProvider>,
  );
}

describe("AwsDashboardPage (cover)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useGetMyProvidersMock.mockReturnValue({
      data: ["AWS"] as ProviderType[],
      isLoading: false,
    });
    useNormalizedAlertsMock.mockReturnValue({
      data: awsAlerts,
      isLoading: false,
    });
    useAssetsMock.mockReturnValue({ data: awsAssets, isLoading: false });
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
    useProviderStatesMock.mockReturnValue({
      data: [{ provider: "AWS", status: "Active" }],
    });
    useBlockIpMock.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });
  });

  it("renders the AWS dashboard with AWS-scoped data", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: "AWS Dashboard" }),
    ).toBeInTheDocument();
    // AWS alert title is shown
    expect(
      screen.getByText("UnauthorizedAccess:IAMUser/MaliciousIPCaller.Custom"),
    ).toBeInTheDocument();
    // AWS asset is shown
    expect(screen.getByText("web-prod-01")).toBeInTheDocument();
    // Compliance score is shown
    expect(screen.getByText("82%")).toBeInTheDocument();
  });

  it("does not show another provider's assets on the AWS dashboard", () => {
    renderPage();
    // The Azure asset must not appear in the AWS assets table.
    expect(screen.queryByText("vm-prod-01")).not.toBeInTheDocument();
  });

  it("shows the access-denied state when the user is not assigned to AWS", () => {
    useGetMyProvidersMock.mockReturnValue({
      data: ["Azure"] as ProviderType[],
      isLoading: false,
    });
    renderPage();
    expect(screen.getByTestId("aws.access_denied")).toBeInTheDocument();
    expect(screen.getByText("AWS access not assigned")).toBeInTheDocument();
  });

  it("scopes the block-IP quick action to AWS only", () => {
    const blockIp = vi.fn().mockResolvedValue({
      success: true,
      message: "blocked",
      dryRunPreview: null,
      rawApiError: null,
      provider: "AWS",
    });
    useBlockIpMock.mockReturnValue({ mutateAsync: blockIp, isPending: false });
    renderPage();
    fireEvent.click(screen.getByTestId("aws_quick_action.blockIp_button"));
    const ipInput = screen.getByTestId("aws_quick_action.ip_input");
    fireEvent.change(ipInput, { target: { value: "185.234.219.10" } });
    fireEvent.click(screen.getByTestId("aws_quick_action.confirm_button"));
    expect(blockIp).toHaveBeenCalledWith({
      ip: "185.234.219.10",
      providers: ["AWS"],
      dryRun: false,
      customer: "default",
    });
  });
});
