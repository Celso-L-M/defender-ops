import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, within } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NotificationsPage from "../pages/NotificationsPage";
import type { AlertRule, NotificationLog } from "../types";

// Radix Switch/Select rely on pointer and size APIs jsdom does not implement.
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
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(globalThis, "ResizeObserver", {
  configurable: true,
  value: MockResizeObserver,
});
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
  useRouterState: () => ({ location: { pathname: "/notifications" } }),
  Link: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const useAlertRulesMock = vi.fn();
const useSaveAlertRuleMock = vi.fn();
const useDeleteAlertRuleMock = vi.fn();
const useNotificationLogsMock = vi.fn();
const useAcknowledgeNotificationMock = vi.fn();

vi.mock("../hooks/use-backend", () => ({
  useAlertRules: (...args: unknown[]) => useAlertRulesMock(...args),
  useSaveAlertRule: (...args: unknown[]) => useSaveAlertRuleMock(...args),
  useDeleteAlertRule: (...args: unknown[]) => useDeleteAlertRuleMock(...args),
  useNotificationLogs: (...args: unknown[]) => useNotificationLogsMock(...args),
  useAcknowledgeNotification: (...args: unknown[]) =>
    useAcknowledgeNotificationMock(...args),
  useGetMyProviders: () => ({
    data: ["AWS", "Azure", "GCP"],
    isLoading: false,
  }),
  usePipelineHealth: () => ({ data: [] }),
  useGlobalSearch: () => ({ data: { results: [] }, isLoading: false }),
  useNormalizedAlerts: () => ({ data: [] }),
}));

const rules: AlertRule[] = [
  {
    id: "rule-1",
    name: "Critical AWS Alerts",
    customer: "default",
    enabled: true,
    severityThreshold: "AnyCritical",
    provider: "AWS",
    channels: ["InApp", "Email"],
    cooldownMinutes: BigInt(60),
  },
];

const logs: NotificationLog[] = [
  {
    id: "log-1",
    status: "Sent",
    customer: "default",
    ruleId: "rule-1",
    recipient: "soc@example.com",
    alertId: "alert-1",
    acknowledged: false,
    timestamp: BigInt(Date.now() - 5 * 60 * 1000) * BigInt(1_000_000),
    channel: "InApp",
  },
  {
    id: "log-2",
    status: "Acknowledged",
    customer: "default",
    ruleId: "rule-1",
    recipient: "soc@example.com",
    alertId: "alert-2",
    acknowledged: true,
    timestamp: BigInt(Date.now() - 10 * 60 * 1000) * BigInt(1_000_000),
    channel: "Email",
  },
];

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <NotificationsPage />
    </QueryClientProvider>,
  );
}

describe("NotificationsPage (characterize)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAlertRulesMock.mockReturnValue({ data: rules, isLoading: false });
    useSaveAlertRuleMock.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    useDeleteAlertRuleMock.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    useNotificationLogsMock.mockReturnValue({ data: logs, isLoading: false });
    useAcknowledgeNotificationMock.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it("renders the alert rules tab with existing rules and channels", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: "Alerting & Notifications" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Critical AWS Alerts")).toBeInTheDocument();
    expect(screen.getByText("InApp")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText(/60 min cooldown/)).toBeInTheDocument();
  });

  it("shows the empty rules state when no rules are configured", () => {
    useAlertRulesMock.mockReturnValue({ data: [], isLoading: false });
    renderPage();
    expect(
      screen.getByTestId("notifications.rules_empty_state"),
    ).toBeInTheDocument();
  });

  it("toggles a rule's enabled state through the save hook", () => {
    const save = vi.fn();
    useSaveAlertRuleMock.mockReturnValue({ mutate: save, isPending: false });
    renderPage();
    fireEvent.click(screen.getByTestId("notifications.rule.toggle.1"));
    expect(save).toHaveBeenCalledTimes(1);
    const toggled = save.mock.calls[0][0] as AlertRule;
    expect(toggled.id).toBe("rule-1");
    expect(toggled.enabled).toBe(false);
  });

  it("deletes a rule through the delete hook", () => {
    const remove = vi.fn();
    useDeleteAlertRuleMock.mockReturnValue({
      mutate: remove,
      isPending: false,
    });
    renderPage();
    fireEvent.click(screen.getByTestId("notifications.rule.delete_button.1"));
    expect(remove).toHaveBeenCalledWith("rule-1");
  });

  it("renders the notification log with channel, recipient and status", () => {
    renderPage();
    fireEvent.mouseDown(screen.getByTestId("notifications.log_tab"));
    expect(screen.getByTestId("notifications.log.item.1")).toBeInTheDocument();
    expect(screen.getByTestId("notifications.log.item.2")).toBeInTheDocument();
    expect(screen.getAllByText("soc@example.com").length).toBeGreaterThan(0);
    expect(screen.getByText("Sent")).toBeInTheDocument();
    expect(
      within(screen.getByTestId("notifications.log.item.2")).getAllByText(
        "Acknowledged",
      ).length,
    ).toBeGreaterThan(0);
  });

  it("shows the empty notification log state when there is no history", () => {
    useNotificationLogsMock.mockReturnValue({ data: [], isLoading: false });
    renderPage();
    fireEvent.mouseDown(screen.getByTestId("notifications.log_tab"));
    expect(
      screen.getByTestId("notifications.log_empty_state"),
    ).toBeInTheDocument();
  });

  it("acknowledges an unread in-app notification", async () => {
    const ack = vi.fn();
    useAcknowledgeNotificationMock.mockReturnValue({
      mutate: ack,
      isPending: false,
    });
    renderPage();
    fireEvent.mouseDown(screen.getByTestId("notifications.center_tab"));
    expect(
      screen.getByTestId("notifications.inbox.item.1"),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByTestId("notifications.inbox.mark_read_button.1"),
    );
    expect(ack).toHaveBeenCalledWith("log-1");
  });
});
