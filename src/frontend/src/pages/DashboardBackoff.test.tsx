import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProviderFilterProvider } from "../contexts/provider-filter";
import DashboardPage from "../pages/DashboardPage";
import type { RateLimitBackoffState, ThrottleEvent } from "../types";

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

const useRateLimitStatesMock = vi.fn();
const useThrottleEventsMock = vi.fn();
const useResetProviderBackoffMock = vi.fn();
const useGetMyProvidersMock = vi.fn();

vi.mock("../hooks/use-backend", () => ({
  useNormalizedAlerts: () => ({ data: [], isLoading: false }),
  useCorrelatedIncidents: () => ({ data: [], isLoading: false }),
  useAssets: () => ({ data: [], isLoading: false }),
  useComplianceStatus: () => ({
    data: { score: 0n, total: 0n, passing: 0n, failing: 0n, controls: [] },
    isLoading: false,
  }),
  useProviderStates: () => ({ data: [], isLoading: false }),
  useRateLimitStates: (...args: unknown[]) => useRateLimitStatesMock(...args),
  useThrottleEvents: (...args: unknown[]) => useThrottleEventsMock(...args),
  useResetProviderBackoff: (...args: unknown[]) =>
    useResetProviderBackoffMock(...args),
  useGetMyProviders: (...args: unknown[]) => useGetMyProvidersMock(...args),
  usePipelineHealth: () => ({ data: [] }),
  useGlobalSearch: () => ({ data: { results: [] }, isLoading: false }),
}));

const states: RateLimitBackoffState[] = [
  {
    provider: "AWS",
    backoffSeconds: 120n,
    consecutiveThrottles: 3n,
    nextAttemptAt: BigInt(Date.now() + 120_000) * 1_000_000n,
    lastThrottledAt: BigInt(Date.now() - 60_000) * 1_000_000n,
  },
  {
    provider: "Azure",
    backoffSeconds: 0n,
    consecutiveThrottles: 0n,
  },
];

const events: ThrottleEvent[] = [
  {
    id: "evt-1",
    provider: "AWS",
    message: "Rate limit exceeded",
    timestamp: BigInt(Date.now() - 30_000) * 1_000_000n,
    statusCode: 429n,
    retryAfterSec: 60n,
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

describe("DashboardPage rate-limit backoff counters (cover)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useGetMyProvidersMock.mockReturnValue({
      data: ["AWS", "Azure", "GCP"],
      isLoading: false,
    });
    useRateLimitStatesMock.mockReturnValue({ data: states, isLoading: false });
    useThrottleEventsMock.mockReturnValue({ data: events, isLoading: false });
    useResetProviderBackoffMock.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it("renders a backoff card per assigned provider with counters", () => {
    renderPage();
    expect(
      screen.getByTestId("dashboard.rate_limit.section"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("dashboard.backoff.card.aws"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("dashboard.backoff.card.azure"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("dashboard.backoff.seconds.aws"),
    ).toHaveTextContent("120s");
    expect(
      screen.getByTestId("dashboard.backoff.throttles.aws"),
    ).toHaveTextContent("3");
  });

  it("marks an active backoff as backing off and a cleared one as healthy", () => {
    renderPage();
    expect(
      screen.getByTestId("dashboard.backoff.status.aws"),
    ).toHaveTextContent("Backing off");
    expect(
      screen.getByTestId("dashboard.backoff.status.azure"),
    ).toHaveTextContent("Healthy");
  });

  it("hides counters for providers the user is not assigned to", () => {
    useGetMyProvidersMock.mockReturnValue({
      data: ["AWS"],
      isLoading: false,
    });
    renderPage();
    expect(
      screen.getByTestId("dashboard.backoff.card.aws"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("dashboard.backoff.card.azure"),
    ).not.toBeInTheDocument();
  });

  it("shows the empty state when no assigned provider has backoff activity", () => {
    useRateLimitStatesMock.mockReturnValue({ data: [], isLoading: false });
    renderPage();
    expect(
      screen.getByTestId("dashboard.backoff.empty_state"),
    ).toBeInTheDocument();
  });

  it("resets a provider's backoff through the reset hook", () => {
    const reset = vi.fn();
    useResetProviderBackoffMock.mockReturnValue({
      mutate: reset,
      isPending: false,
    });
    renderPage();
    fireEvent.click(screen.getByTestId("dashboard.backoff.reset_button.aws"));
    expect(reset).toHaveBeenCalledWith("AWS");
  });

  it("renders recent throttling events with status code and retry hint", () => {
    renderPage();
    expect(
      screen.getByTestId("dashboard.throttle_events.item.1"),
    ).toBeInTheDocument();
    expect(screen.getByText("Rate limit exceeded")).toBeInTheDocument();
    expect(screen.getByText(/HTTP 429/)).toBeInTheDocument();
    expect(screen.getByText(/retry after 60s/)).toBeInTheDocument();
  });
});
