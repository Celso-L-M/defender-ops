import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, within } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CorrelationPage from "../pages/CorrelationPage";
import type { CorrelatedIncident, CorrelationStats } from "../types";

// jsdom does not implement the native <dialog> element's imperative API, which
// the incident detail modal relies on.
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
  useRouterState: () => ({ location: { pathname: "/correlation" } }),
  Link: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const useCorrelatedIncidentsMock = vi.fn();
const useCorrelationStatsMock = vi.fn();
const useUpdateCorrelatedIncidentStatusMock = vi.fn();
const useAlertsForCorrelationMock = vi.fn();

vi.mock("../hooks/use-backend", () => ({
  useCorrelatedIncidents: (...args: unknown[]) =>
    useCorrelatedIncidentsMock(...args),
  useCorrelationStats: (...args: unknown[]) => useCorrelationStatsMock(...args),
  useUpdateCorrelatedIncidentStatus: (...args: unknown[]) =>
    useUpdateCorrelatedIncidentStatusMock(...args),
  useAlertsForCorrelation: (...args: unknown[]) =>
    useAlertsForCorrelationMock(...args),
  useGetMyProviders: () => ({
    data: ["AWS", "Azure", "GCP"],
    isLoading: false,
  }),
  usePipelineHealth: () => ({ data: [] }),
  useGlobalSearch: () => ({ data: { results: [] }, isLoading: false }),
  useNormalizedAlerts: () => ({ data: [] }),
}));

const incident: CorrelatedIncident = {
  incidentId: "inc-001",
  incidentType: "Cross-Cloud Brute Force",
  severity: "High",
  status: "Open",
  sourceAlerts: ["alert-1", "alert-2"],
  sourceProviders: ["AWS", "Azure"],
  sourceIp: "185.234.219.10",
  affectedResources: ["i-0abc123def456"],
  timeDeltaMinutes: 12,
  correlationWindowMinutes: BigInt(30),
  detectedAt: BigInt(1_700_000_000_000_000_000),
  customer: "default",
};

const stats: CorrelationStats = {
  totalToday: BigInt(3),
  totalThisWeek: BigInt(7),
  totalAllTime: BigInt(12),
  byType: [["Cross-Cloud Brute Force", BigInt(2)]],
};

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <CorrelationPage />
    </QueryClientProvider>,
  );
}

describe("CorrelationPage (characterize)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCorrelatedIncidentsMock.mockReturnValue({
      data: [["inc-001", incident]],
      isLoading: false,
    });
    useCorrelationStatsMock.mockReturnValue({ data: stats, isLoading: false });
    useUpdateCorrelatedIncidentStatusMock.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(true),
      isPending: false,
    });
    useAlertsForCorrelationMock.mockReturnValue({
      data: [],
      isLoading: false,
    });
  });

  it("renders the correlation engine page title", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: "Correlation Engine" }),
    ).toBeInTheDocument();
  });

  it("renders the incident feed with correlated incident rows", () => {
    renderPage();
    const feed = screen.getByTestId("correlation.feed.section");
    expect(feed).toBeInTheDocument();
    expect(
      within(feed).getByText("Cross-Cloud Brute Force"),
    ).toBeInTheDocument();
    expect(within(feed).getByText("185.234.219.10")).toBeInTheDocument();
    expect(within(feed).getByText("12 min")).toBeInTheDocument();
  });

  it("renders the correlation stats cards with counts", () => {
    renderPage();
    expect(
      screen.getByTestId("correlation.stats.today_card"),
    ).toHaveTextContent("3");
    expect(screen.getByTestId("correlation.stats.week_card")).toHaveTextContent(
      "7",
    );
    expect(
      screen.getByTestId("correlation.stats.alltime_card"),
    ).toHaveTextContent("12");
  });

  it("renders the incident type breakdown from stats", () => {
    renderPage();
    const breakdown = screen.getByTestId("correlation.breakdown.section");
    expect(breakdown).toBeInTheDocument();
    expect(
      within(breakdown).getByText("Cross-Cloud Brute Force"),
    ).toBeInTheDocument();
  });

  it("opens the incident detail modal and saves a status update", () => {
    const updateStatus = vi.fn().mockResolvedValue(true);
    useUpdateCorrelatedIncidentStatusMock.mockReturnValue({
      mutateAsync: updateStatus,
      isPending: false,
    });
    renderPage();
    fireEvent.click(screen.getByTestId("correlation.feed.item.1"));
    expect(screen.getByTestId("correlation.detail.dialog")).toBeInTheDocument();
    // Status select defaults to the incident's current status.
    expect(screen.getByTestId("correlation.detail.status_select")).toHaveValue(
      "Open",
    );
    fireEvent.change(screen.getByTestId("correlation.detail.status_select"), {
      target: { value: "Investigating" },
    });
    fireEvent.click(screen.getByTestId("correlation.detail.save_button"));
    expect(updateStatus).toHaveBeenCalledWith({
      id: "inc-001",
      status: "Investigating",
      owner: undefined,
      notes: undefined,
    });
  });

  it("shows the empty feed state when there are no correlated incidents", () => {
    useCorrelatedIncidentsMock.mockReturnValue({
      data: [],
      isLoading: false,
    });
    renderPage();
    expect(
      screen.getByTestId("correlation.feed.empty_state"),
    ).toBeInTheDocument();
  });

  it("shows the empty breakdown state when there are no incidents by type", () => {
    useCorrelationStatsMock.mockReturnValue({
      data: {
        totalToday: 0n,
        totalThisWeek: 0n,
        totalAllTime: 0n,
        byType: [],
      },
      isLoading: false,
    });
    renderPage();
    expect(
      screen.getByTestId("correlation.breakdown.empty_state"),
    ).toBeInTheDocument();
  });
});
