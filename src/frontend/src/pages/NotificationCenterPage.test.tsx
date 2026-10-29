import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NotificationCenterPage from "../pages/NotificationCenterPage";
import type { NotificationLog } from "../types";

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
  useRouterState: () => ({ location: { pathname: "/notification-center" } }),
  Link: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const useNotificationLogsMock = vi.fn();
const useAcknowledgeNotificationMock = vi.fn();

vi.mock("../hooks/use-backend", () => ({
  useNotificationLogs: (...args: unknown[]) => useNotificationLogsMock(...args),
  useAcknowledgeNotification: (...args: unknown[]) =>
    useAcknowledgeNotificationMock(...args),
  usePipelineHealth: () => ({ data: [] }),
  useGlobalSearch: () => ({ data: { results: [] }, isLoading: false }),
  useNormalizedAlerts: () => ({ data: [] }),
  useGetMyProviders: () => ({
    data: ["AWS", "Azure", "GCP"],
    isLoading: false,
  }),
}));

const logs: NotificationLog[] = [
  {
    id: "log-1",
    status: "Sent",
    customer: "default",
    ruleId: "rule-1",
    recipient: "soc@example.com",
    alertId: "alert-1",
    acknowledged: false,
    timestamp: BigInt(Date.now() - 5 * 60 * 1000) * 1_000_000n,
    channel: "InApp",
  },
  {
    id: "log-2",
    status: "Acknowledged",
    customer: "default",
    ruleId: "rule-1",
    recipient: "oncall@example.com",
    alertId: "alert-2",
    acknowledged: true,
    timestamp: BigInt(Date.now() - 10 * 60 * 1000) * 1_000_000n,
    channel: "Email",
  },
];

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <NotificationCenterPage />
    </QueryClientProvider>,
  );
}

describe("NotificationCenterPage (cover)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNotificationLogsMock.mockReturnValue({ data: logs, isLoading: false });
    useAcknowledgeNotificationMock.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it("shows the full history with channel, recipient, status and acknowledgement", () => {
    renderPage();
    expect(
      screen.getByTestId("notification_center.history.item.1"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("notification_center.history.item.2"),
    ).toBeInTheDocument();
    expect(screen.getAllByText("soc@example.com").length).toBeGreaterThan(0);
    expect(screen.getAllByText("oncall@example.com").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sent").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Acknowledged").length).toBeGreaterThan(0);
  });

  it("counts pending and acknowledged notifications in the summary cards", () => {
    renderPage();
    expect(
      screen.getByTestId("notification_center.pending_card"),
    ).toHaveTextContent("1");
    expect(
      screen.getByTestId("notification_center.acknowledged_card"),
    ).toHaveTextContent("1");
    expect(
      screen.getByTestId("notification_center.total_card"),
    ).toHaveTextContent("2");
  });

  it("acknowledges an unacknowledged notification through the ack hook", () => {
    const ack = vi.fn();
    useAcknowledgeNotificationMock.mockReturnValue({
      mutate: ack,
      isPending: false,
    });
    renderPage();
    fireEvent.click(
      screen.getByTestId("notification_center.acknowledge_button.1"),
    );
    expect(ack).toHaveBeenCalledWith("log-1", expect.any(Object));
  });

  it("shows the empty history state when there is no notification history", () => {
    useNotificationLogsMock.mockReturnValue({ data: [], isLoading: false });
    renderPage();
    expect(
      screen.getByTestId("notification_center.history_empty_state"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("notification_center.pending_empty_state"),
    ).toBeInTheDocument();
  });
});
