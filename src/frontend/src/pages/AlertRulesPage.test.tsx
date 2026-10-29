import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AlertRulesPage from "../pages/AlertRulesPage";
import type { AlertRule } from "../types";

// Radix Switch relies on pointer and size APIs jsdom does not implement.
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
  useRouterState: () => ({ location: { pathname: "/alert-rules" } }),
  Link: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const useAlertRulesMock = vi.fn();
const useSaveAlertRuleMock = vi.fn();
const useDeleteAlertRuleMock = vi.fn();

vi.mock("../hooks/use-backend", () => ({
  useAlertRules: (...args: unknown[]) => useAlertRulesMock(...args),
  useSaveAlertRule: (...args: unknown[]) => useSaveAlertRuleMock(...args),
  useDeleteAlertRule: (...args: unknown[]) => useDeleteAlertRuleMock(...args),
  usePipelineHealth: () => ({ data: [] }),
  useGlobalSearch: () => ({ data: { results: [] }, isLoading: false }),
  useNormalizedAlerts: () => ({ data: [] }),
  useGetMyProviders: () => ({
    data: ["AWS", "Azure", "GCP"],
    isLoading: false,
  }),
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
    cooldownMinutes: 60n,
  },
];

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AlertRulesPage />
    </QueryClientProvider>,
  );
}

describe("AlertRulesPage rule builder (cover)", () => {
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
  });

  it("renders existing rules with their criteria and channels", () => {
    renderPage();
    expect(screen.getByText("Critical AWS Alerts")).toBeInTheDocument();
    expect(screen.getByText("Any Critical")).toBeInTheDocument();
    expect(screen.getByText("In-app")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText(/60 min cooldown/)).toBeInTheDocument();
  });

  it("shows the empty state when no rules exist", () => {
    useAlertRulesMock.mockReturnValue({ data: [], isLoading: false });
    renderPage();
    expect(screen.getByTestId("alert_rules.empty_state")).toBeInTheDocument();
  });

  it("creates a rule with severity, finding type, asset, provider, region and channels", async () => {
    const save = vi.fn();
    useSaveAlertRuleMock.mockReturnValue({ mutate: save, isPending: false });
    renderPage();

    fireEvent.click(screen.getByTestId("alert_rules.create_button"));
    expect(screen.getByTestId("alert_rules.form")).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("alert_rules.name_input"), {
      target: { value: "Prod critical" },
    });
    fireEvent.change(screen.getByTestId("alert_rules.severity_select"), {
      target: { value: "AnyCritical" },
    });
    fireEvent.change(screen.getByTestId("alert_rules.provider_select"), {
      target: { value: "AWS" },
    });
    fireEvent.change(screen.getByTestId("alert_rules.finding_type_input"), {
      target: { value: "UnauthorizedAccess" },
    });
    fireEvent.change(screen.getByTestId("alert_rules.asset_input"), {
      target: { value: "i-0abc" },
    });
    fireEvent.change(screen.getByTestId("alert_rules.region_input"), {
      target: { value: "us-east-1" },
    });
    // Add the Email and Teams channels on top of the default In-app channel.
    fireEvent.click(screen.getByTestId("alert_rules.channel_email_toggle"));
    fireEvent.click(
      screen.getByTestId("alert_rules.channel_teamswebhook_toggle"),
    );
    fireEvent.click(screen.getByTestId("alert_rules.form.submit_button"));

    await waitFor(() => {
      expect(save).toHaveBeenCalledTimes(1);
    });
    const saved = save.mock.calls[0][0] as AlertRule;
    expect(saved).toMatchObject({
      name: "Prod critical",
      severityThreshold: "AnyCritical",
      provider: "AWS",
      findingType: "UnauthorizedAccess",
      assetId: "i-0abc",
      region: "us-east-1",
      channels: ["InApp", "Email", "TeamsWebhook"],
      cooldownMinutes: 60n,
    });
  });

  it("requires a name before saving a rule", async () => {
    const save = vi.fn();
    useSaveAlertRuleMock.mockReturnValue({ mutate: save, isPending: false });
    renderPage();
    fireEvent.click(screen.getByTestId("alert_rules.create_button"));
    fireEvent.click(screen.getByTestId("alert_rules.form.submit_button"));
    expect(
      await screen.findByTestId("alert_rules.form.error_state"),
    ).toHaveTextContent("name");
    expect(save).not.toHaveBeenCalled();
  });

  it("requires an escalation recipient when an escalation window is set", async () => {
    const save = vi.fn();
    useSaveAlertRuleMock.mockReturnValue({ mutate: save, isPending: false });
    renderPage();
    fireEvent.click(screen.getByTestId("alert_rules.create_button"));
    fireEvent.change(screen.getByTestId("alert_rules.name_input"), {
      target: { value: "Escalating rule" },
    });
    fireEvent.change(
      screen.getByTestId("alert_rules.escalation_minutes_input"),
      { target: { value: "30" } },
    );
    fireEvent.click(screen.getByTestId("alert_rules.form.submit_button"));
    expect(
      await screen.findByTestId("alert_rules.form.error_state"),
    ).toHaveTextContent("escalation recipient");
    expect(save).not.toHaveBeenCalled();
  });
});
