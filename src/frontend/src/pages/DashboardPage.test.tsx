import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProviderFilterProvider } from "../contexts/provider-filter";
import DashboardPage from "../pages/DashboardPage";
import type { Asset, CorrelatedIncident, NormalizedAlert } from "../types";

// jsdom does not implement the native <dialog> element's imperative API, which
// the security event feed's detail modal relies on.
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
  useRouterState: () => ({ location: { pathname: "/" } }),
  Link: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const useNormalizedAlertsMock = vi.fn();
const useCorrelatedIncidentsMock = vi.fn();
const useAssetsMock = vi.fn();
const useComplianceStatusMock = vi.fn();
const useProviderStatesMock = vi.fn();
const useRateLimitStatesMock = vi.fn();
const useThrottleEventsMock = vi.fn();

vi.mock("../hooks/use-backend", () => ({
  useNormalizedAlerts: (...args: unknown[]) => useNormalizedAlertsMock(...args),
  useCorrelatedIncidents: (...args: unknown[]) =>
    useCorrelatedIncidentsMock(...args),
  useAssets: (...args: unknown[]) => useAssetsMock(...args),
  useComplianceStatus: (...args: unknown[]) => useComplianceStatusMock(...args),
  useProviderStates: (...args: unknown[]) => useProviderStatesMock(...args),
  useRateLimitStates: (...args: unknown[]) => useRateLimitStatesMock(...args),
  useThrottleEvents: (...args: unknown[]) => useThrottleEventsMock(...args),
  useResetProviderBackoff: () => ({ mutate: vi.fn(), isPending: false }),
  useGetMyProviders: () => ({
    data: ["AWS", "Azure", "GCP"],
    isLoading: false,
  }),
  usePipelineHealth: () => ({ data: [] }),
  useGlobalSearch: () => ({ data: { results: [] }, isLoading: false }),
}));

const alerts: NormalizedAlert[] = [
  {
    id: "alert-1",
    findingId: "gd-1",
    provider: "AWS",
    title: "Unauthorized access",
    description: "desc",
    severity: "High",
    originalSeverity: "High",
    status: "Open",
    customer: "default",
    rawFindingId: "raw-1",
    timestamp: BigInt(Date.now()) * BigInt(1_000_000),
  },
  {
    id: "alert-2",
    findingId: "az-1",
    provider: "Azure",
    title: "Suspicious sign-in",
    description: "desc",
    severity: "Medium",
    originalSeverity: "Medium",
    status: "Open",
    customer: "default",
    rawFindingId: "raw-2",
    timestamp: BigInt(Date.now()) * BigInt(1_000_000),
  },
];

const incidents: [string, CorrelatedIncident][] = [
  [
    "inc-1",
    {
      incidentId: "inc-1",
      incidentType: "Cross-Cloud Brute Force",
      severity: "High",
      status: "Open",
      sourceAlerts: ["alert-1"],
      sourceProviders: ["AWS"],
      affectedResources: [],
      timeDeltaMinutes: 5,
      correlationWindowMinutes: BigInt(30),
      detectedAt: BigInt(1_700_000_000_000_000_000),
      customer: "default",
    },
  ],
];

const assets: Asset[] = [
  {
    id: "asset-1",
    region: "us-east-1",
    provider: "AWS",
    accountId: "123",
    customer: "default",
    name: "web-1",
    tags: [],
    assetType: "EC2",
    lastSeen: BigInt(1_700_000_000_000_000_000),
    riskScore: BigInt(7),
    openFindings: BigInt(2),
  },
];

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ProviderFilterProvider>
        <DashboardPage />
      </ProviderFilterProvider>
    </QueryClientProvider>,
  );
}

describe("DashboardPage (characterize)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNormalizedAlertsMock.mockReturnValue({ data: alerts, isLoading: false });
    useCorrelatedIncidentsMock.mockReturnValue({
      data: incidents,
      isLoading: false,
    });
    useAssetsMock.mockReturnValue({ data: assets, isLoading: false });
    useComplianceStatusMock.mockReturnValue({
      data: {
        score: BigInt(85),
        total: BigInt(10),
        passing: BigInt(8),
        failing: BigInt(2),
        controls: [],
      },
      isLoading: false,
    });
    useProviderStatesMock.mockReturnValue({ data: [], isLoading: false });
    useRateLimitStatesMock.mockReturnValue({ data: [], isLoading: false });
    useThrottleEventsMock.mockReturnValue({ data: [], isLoading: false });
  });

  it("renders the summary stat cards with computed values", () => {
    renderPage();
    expect(screen.getByTestId("dashboard.stat.total_alerts")).toHaveTextContent(
      "2",
    );
    expect(
      screen.getByTestId("dashboard.stat.open_incidents"),
    ).toHaveTextContent("1");
    expect(
      screen.getByTestId("dashboard.stat.assets_at_risk"),
    ).toHaveTextContent("1");
    expect(
      screen.getByTestId("dashboard.stat.compliance_score"),
    ).toHaveTextContent("85%");
  });

  it("renders the provider filter bar with all provider options", () => {
    renderPage();
    expect(screen.getByTestId("dashboard.provider_filter")).toBeInTheDocument();
    expect(
      screen.getByTestId("dashboard.provider_filter.all"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("dashboard.provider_filter.AWS"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("dashboard.provider_filter.Azure"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("dashboard.provider_filter.GCP"),
    ).toBeInTheDocument();
  });

  it("marks the chosen provider filter as active", () => {
    renderPage();
    const awsButton = screen.getByTestId("dashboard.provider_filter.AWS");
    fireEvent.click(awsButton);
    expect(awsButton.className).toContain("text-orange-400");
  });

  it("renders the dashboard sections for risk, providers, feed and incidents", () => {
    renderPage();
    expect(
      screen.getByTestId("dashboard.risk_score.section"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("dashboard.provider_cards.section"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("dashboard.event_feed.section"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("dashboard.correlated_incidents.section"),
    ).toBeInTheDocument();
  });
});
