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
const useNormalizedAlertsMock = vi.fn();

vi.mock("../hooks/use-backend", () => ({
  useAlertRules: (...args: unknown[]) => useAlertRulesMock(...args),
  useSaveAlertRule: (...args: unknown[]) => useSaveAlertRuleMock(...args),
  useDeleteAlertRule: (...args: unknown[]) => useDeleteAlertRuleMock(...args),
  useNormalizedAlerts: (...args: unknown[]) => useNormalizedAlertsMock(...args),
  usePipelineHealth: () => ({ data: [] }),
  useGlobalSearch: () => ({ data: { results: [] }, isLoading: false }),
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

describe("AlertRulesPage deduplication and escalation (cover)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNormalizedAlertsMock.mockReturnValue({
      data: [{ customer: "default" }],
      isLoading: false,
    });
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

  it("defaults a new rule's cooldown to 60 minutes", () => {
    renderPage();
    fireEvent.click(screen.getByTestId("alert_rules.create_button"));
    expect(screen.getByTestId("alert_rules.cooldown_input")).toHaveValue(60);
  });

  it("saves a rule with a custom cooldown and an escalation window and recipient", async () => {
    const save = vi.fn();
    useSaveAlertRuleMock.mockReturnValue({ mutate: save, isPending: false });
    renderPage();

    fireEvent.click(screen.getByTestId("alert_rules.create_button"));
    fireEvent.change(screen.getByTestId("alert_rules.name_input"), {
      target: { value: "Escalating rule" },
    });
    fireEvent.change(screen.getByTestId("alert_rules.cooldown_input"), {
      target: { value: "15" },
    });
    fireEvent.change(
      screen.getByTestId("alert_rules.escalation_minutes_input"),
      { target: { value: "30" } },
    );
    fireEvent.change(
      screen.getByTestId("alert_rules.escalation_recipient_input"),
      { target: { value: "oncall@example.com" } },
    );
    fireEvent.click(screen.getByTestId("alert_rules.form.submit_button"));

    await waitFor(() => {
      expect(save).toHaveBeenCalledTimes(1);
    });
    const saved = save.mock.calls[0][0] as AlertRule;
    expect(saved).toMatchObject({
      name: "Escalating rule",
      cooldownMinutes: 15n,
      escalationMinutes: 30n,
      escalationRecipient: "oncall@example.com",
    });
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

  it("renders a rule's cooldown and escalation summary on its card", () => {
    useAlertRulesMock.mockReturnValue({
      data: [
        {
          ...rules[0],
          cooldownMinutes: 45n,
          escalationMinutes: 20n,
          escalationRecipient: "oncall@example.com",
        },
      ],
      isLoading: false,
    });
    renderPage();
    expect(screen.getByText(/45 min cooldown/)).toBeInTheDocument();
    expect(
      screen.getByText(/escalates after 20 min to oncall@example.com/),
    ).toBeInTheDocument();
  });
});
