import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NotificationSettingsPage from "../pages/NotificationSettingsPage";
import type { NotificationRouting } from "../types";

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
  useRouterState: () => ({ location: { pathname: "/notification-settings" } }),
  Link: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const useNotificationRoutingMock = vi.fn();
const useSaveNotificationRoutingMock = vi.fn();
const useNormalizedAlertsMock = vi.fn();

vi.mock("../hooks/use-backend", () => ({
  useNotificationRouting: (...args: unknown[]) =>
    useNotificationRoutingMock(...args),
  useSaveNotificationRouting: (...args: unknown[]) =>
    useSaveNotificationRoutingMock(...args),
  usePipelineHealth: () => ({ data: [] }),
  useGlobalSearch: () => ({ data: { results: [] }, isLoading: false }),
  useNormalizedAlerts: (...args: unknown[]) => useNormalizedAlertsMock(...args),
  useGetMyProviders: () => ({
    data: ["AWS", "Azure", "GCP"],
    isLoading: false,
  }),
}));

const savedRouting: NotificationRouting = {
  customer: "",
  cooldownMinutes: 60n,
  emailRecipients: ["soc@example.com"],
  teamsWebhookUrl: "https://outlook.office.com/webhook/abc",
  escalationMinutes: 30n,
};

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <NotificationSettingsPage />
    </QueryClientProvider>,
  );
}

describe("NotificationSettingsPage routing (cover)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // The page derives the customer key from the alerts the caller can see, so
    // the routing is loaded and saved under that exact key.
    useNormalizedAlertsMock.mockReturnValue({
      data: [{ customer: "default" }],
      isLoading: false,
    });
    useNotificationRoutingMock.mockReturnValue({
      data: savedRouting,
      isLoading: false,
      isError: false,
    });
    useSaveNotificationRoutingMock.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(null),
      isPending: false,
    });
  });

  it("summarizes the saved routing with webhook, recipients, cooldown and escalation", () => {
    renderPage();
    const summary = screen.getByTestId("notification_settings.saved_state");
    expect(summary).toHaveTextContent("https://outlook.office.com/webhook/abc");
    expect(summary).toHaveTextContent("1 recipient");
    expect(summary).toHaveTextContent("60 min cooldown");
    expect(summary).toHaveTextContent("30 min escalation");
  });

  it("derives the customer key from the visible alert and loads routing under it", () => {
    useNormalizedAlertsMock.mockReturnValue({
      data: [{ customer: "123456789012" }],
      isLoading: false,
    });
    renderPage();
    expect(useNotificationRoutingMock).toHaveBeenCalledWith("123456789012");
  });

  it("falls back to the default customer key when no alert is visible", () => {
    useNormalizedAlertsMock.mockReturnValue({ data: [], isLoading: false });
    renderPage();
    expect(useNotificationRoutingMock).toHaveBeenCalledWith("default");
  });

  it("shows the unsaved state when no routing is configured", () => {
    useNotificationRoutingMock.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });
    renderPage();
    expect(
      screen.getByTestId("notification_settings.saved_state"),
    ).toHaveTextContent("No routing saved yet");
  });

  it("saves the per-customer webhook, recipients, cooldown and escalation", async () => {
    const save = vi.fn().mockResolvedValue(null);
    useSaveNotificationRoutingMock.mockReturnValue({
      mutateAsync: save,
      isPending: false,
    });
    renderPage();

    fireEvent.change(
      screen.getByTestId("notification_settings.webhook_input"),
      {
        target: { value: "https://outlook.office.com/webhook/new" },
      },
    );
    fireEvent.change(
      screen.getByTestId("notification_settings.recipient_input"),
      { target: { value: "oncall@example.com" } },
    );
    fireEvent.click(
      screen.getByTestId("notification_settings.add_recipient_button"),
    );
    fireEvent.change(
      screen.getByTestId("notification_settings.cooldown_input"),
      {
        target: { value: "15" },
      },
    );
    fireEvent.change(
      screen.getByTestId("notification_settings.escalation_input"),
      { target: { value: "45" } },
    );
    fireEvent.click(screen.getByTestId("notification_settings.save_button"));

    await waitFor(() => {
      expect(save).toHaveBeenCalledWith({
        customer: "default",
        cooldownMinutes: 15n,
        emailRecipients: ["soc@example.com", "oncall@example.com"],
        teamsWebhookUrl: "https://outlook.office.com/webhook/new",
        escalationMinutes: 45n,
      });
    });
    expect(
      await screen.findByTestId("notification_settings.success_state"),
    ).toBeInTheDocument();
  });

  it("rejects a non-https webhook URL before calling the backend", async () => {
    const save = vi.fn().mockResolvedValue(null);
    useSaveNotificationRoutingMock.mockReturnValue({
      mutateAsync: save,
      isPending: false,
    });
    renderPage();
    fireEvent.change(
      screen.getByTestId("notification_settings.webhook_input"),
      {
        target: { value: "http://insecure.example.com/hook" },
      },
    );
    fireEvent.click(screen.getByTestId("notification_settings.save_button"));
    expect(
      await screen.findByTestId("notification_settings.webhook_error"),
    ).toHaveTextContent("https");
    expect(save).not.toHaveBeenCalled();
  });

  it("rejects an invalid recipient address before adding it", async () => {
    renderPage();
    fireEvent.change(
      screen.getByTestId("notification_settings.recipient_input"),
      { target: { value: "not-an-email" } },
    );
    fireEvent.click(
      screen.getByTestId("notification_settings.add_recipient_button"),
    );
    expect(
      await screen.findByTestId("notification_settings.recipient_error"),
    ).toBeInTheDocument();
    // The invalid address was not added to the list.
    expect(
      screen.queryByTestId("notification_settings.recipient_item.2"),
    ).not.toBeInTheDocument();
  });

  it("surfaces a backend rejection of the webhook URL", async () => {
    const save = vi.fn().mockRejectedValue(new Error("InvalidWebhookUrl"));
    useSaveNotificationRoutingMock.mockReturnValue({
      mutateAsync: save,
      isPending: false,
    });
    renderPage();
    fireEvent.click(screen.getByTestId("notification_settings.save_button"));
    expect(
      await screen.findByTestId("notification_settings.save_error"),
    ).toHaveTextContent("rejected");
  });
});
