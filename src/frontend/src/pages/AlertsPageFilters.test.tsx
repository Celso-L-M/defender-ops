import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AlertsPage from "../pages/AlertsPage";
import type { NormalizedAlert } from "../types";

// Radix Select relies on pointer APIs that jsdom does not implement.
class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;
  constructor(type: string, props: PointerEventInit = {}) {
    super(type, props);
    this.button = props.button ?? 0;
    this.ctrlKey = props.ctrlKey ?? false;
    this.pointerType = props.pointerType ?? "mouse";
  }
}
window.PointerEvent = MockPointerEvent as unknown as typeof PointerEvent;
Object.defineProperty(Element.prototype, "hasPointerCapture", {
  configurable: true,
  value: () => false,
});
Object.defineProperty(Element.prototype, "setPointerCapture", {
  configurable: true,
  value: () => {},
});
Object.defineProperty(Element.prototype, "releasePointerCapture", {
  configurable: true,
  value: () => {},
});
Object.defineProperty(Element.prototype, "scrollIntoView", {
  configurable: true,
  value: () => {},
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
  useRouterState: () => ({ location: { pathname: "/alerts" } }),
  Link: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const useNormalizedAlertsPageMock = vi.fn();

vi.mock("../hooks/use-backend", () => ({
  useNormalizedAlertsPage: (...args: unknown[]) =>
    useNormalizedAlertsPageMock(...args),
  useNormalizedAlerts: () => ({ data: [] }),
  useUpdateAlertStatus: () => ({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
  }),
  useUpdateAlertOwner: () => ({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
  }),
  useEnrichAlert: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  }),
  usePipelineHealth: () => ({ data: [] }),
  useGlobalSearch: () => ({ data: { results: [] }, isLoading: false }),
  useGetMyProviders: () => ({
    data: ["AWS", "Azure", "GCP"],
    isLoading: false,
  }),
}));

const alerts: NormalizedAlert[] = [
  {
    id: "alert-1",
    findingId: "gd-1",
    provider: "AWS",
    title: "UnauthorizedAccess:IAMUser/MaliciousIPCaller.Custom",
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
    title: "Suspicious authentication activity",
    description: "desc",
    severity: "Medium",
    originalSeverity: "Medium",
    status: "Resolved",
    customer: "default",
    rawFindingId: "raw-2",
    timestamp: BigInt(Date.now()) * BigInt(1_000_000),
  },
];

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AlertsPage />
    </QueryClientProvider>,
  );
}

describe("AlertsPage filters and search (characterize)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNormalizedAlertsPageMock.mockReturnValue({
      data: { items: alerts },
      isLoading: false,
      isFetching: false,
    });
  });

  it("filters the visible rows by the search query", () => {
    renderPage();
    expect(
      screen.getByText("UnauthorizedAccess:IAMUser/MaliciousIPCaller.Custom"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Suspicious authentication activity"),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("alerts.search_input"), {
      target: { value: "Suspicious" },
    });
    expect(
      screen.queryByText("UnauthorizedAccess:IAMUser/MaliciousIPCaller.Custom"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("Suspicious authentication activity"),
    ).toBeInTheDocument();
  });

  it("shows the filtered empty state when no alert matches the search", () => {
    renderPage();
    fireEvent.change(screen.getByTestId("alerts.search_input"), {
      target: { value: "no-such-alert" },
    });
    expect(screen.getByTestId("alerts.empty_state")).toBeInTheDocument();
    expect(
      screen.getByText("No alerts match your filters"),
    ).toBeInTheDocument();
  });

  it("updates the total badge to the filtered count", () => {
    renderPage();
    expect(screen.getByTestId("alerts.total_badge")).toHaveTextContent("2");
    fireEvent.change(screen.getByTestId("alerts.search_input"), {
      target: { value: "Suspicious" },
    });
    expect(screen.getByTestId("alerts.total_badge")).toHaveTextContent("1");
  });

  it("requests the alerts list with the customer and a page limit", () => {
    renderPage();
    expect(useNormalizedAlertsPageMock).toHaveBeenCalledWith(
      expect.objectContaining({ customer: "", limit: 50 }),
    );
  });
});
