import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AlertsPage from "../pages/AlertsPage";
import type { AlertPage, NormalizedAlert } from "../types";

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
  useNormalizedAlerts: () => ({ data: [] }),
  useGetMyProviders: () => ({
    data: ["AWS", "Azure", "GCP"],
    isLoading: false,
  }),
}));

function makeAlert(id: string, title: string): NormalizedAlert {
  return {
    id,
    findingId: `gd-${id}`,
    provider: "AWS",
    title,
    description: "desc",
    severity: "High",
    originalSeverity: "High",
    status: "Open",
    customer: "default",
    rawFindingId: `raw-${id}`,
    timestamp: BigInt(Date.now()) * BigInt(1_000_000),
  };
}

const firstPage: AlertPage = {
  items: [makeAlert("alert-1", "First page alert one")],
  nextCursor: "cursor-page-2",
};

const secondPage: AlertPage = {
  items: [makeAlert("alert-2", "Second page alert two")],
};

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

describe("AlertsPage cursor pagination (cover)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNormalizedAlertsPageMock.mockImplementation(
      (filter: { cursor?: string }) =>
        filter.cursor
          ? { data: secondPage, isLoading: false, isFetching: false }
          : { data: firstPage, isLoading: false, isFetching: false },
    );
  });

  it("requests the first page without a cursor and shows a load-more control", () => {
    renderPage();
    expect(useNormalizedAlertsPageMock).toHaveBeenCalledWith(
      expect.objectContaining({ customer: "", limit: 50 }),
    );
    expect(useNormalizedAlertsPageMock.mock.calls[0][0]).not.toHaveProperty(
      "cursor",
    );
    expect(screen.getByText("First page alert one")).toBeInTheDocument();
    expect(screen.getByTestId("alerts.load_more_button")).toBeInTheDocument();
  });

  it("loads the next page with the returned cursor and appends without duplicates", async () => {
    renderPage();
    fireEvent.click(screen.getByTestId("alerts.load_more_button"));

    await waitFor(() => {
      expect(useNormalizedAlertsPageMock).toHaveBeenCalledWith(
        expect.objectContaining({ cursor: "cursor-page-2" }),
      );
    });

    // Both pages are visible and the first page's row is not duplicated.
    expect(screen.getByText("First page alert one")).toBeInTheDocument();
    expect(screen.getByText("Second page alert two")).toBeInTheDocument();
    expect(screen.getAllByText("First page alert one")).toHaveLength(1);
    expect(screen.getByTestId("alerts.total_badge")).toHaveTextContent("2");
  });

  it("shows the end-of-list marker once the last page has no next cursor", async () => {
    renderPage();
    fireEvent.click(screen.getByTestId("alerts.load_more_button"));
    await waitFor(() => {
      expect(screen.getByTestId("alerts.end_of_list")).toBeInTheDocument();
    });
    expect(
      screen.queryByTestId("alerts.load_more_button"),
    ).not.toBeInTheDocument();
  });

  it("preserves the active search filter while loading further pages", async () => {
    renderPage();
    fireEvent.change(screen.getByTestId("alerts.search_input"), {
      target: { value: "page" },
    });
    fireEvent.click(screen.getByTestId("alerts.load_more_button"));

    await waitFor(() => {
      expect(useNormalizedAlertsPageMock).toHaveBeenCalledWith(
        expect.objectContaining({ cursor: "cursor-page-2" }),
      );
    });
    // The search term still narrows the accumulated rows after paginating.
    expect(screen.getByText("First page alert one")).toBeInTheDocument();
    expect(screen.getByText("Second page alert two")).toBeInTheDocument();
    expect(screen.getByTestId("alerts.total_badge")).toHaveTextContent("2");
  });
});
