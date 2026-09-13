import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AlertsPage from "../pages/AlertsPage";
import type { NormalizedAlert } from "../types";

// Radix Select relies on pointer APIs that jsdom does not implement. Without
// these stubs the provider/severity/status dropdowns never open under test.
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

const alerts: NormalizedAlert[] = [
  {
    id: "alert-1",
    findingId: "gd-finding-a1b2c3d4",
    provider: "AWS",
    title: "UnauthorizedAccess:IAMUser/MaliciousIPCaller.Custom",
    description:
      "API calls were made from an IP address on a custom threat list.",
    severity: "High",
    originalSeverity: "High",
    status: "Open",
    assetId: "i-0abc123def456",
    assetType: "EC2",
    accountId: "123456789012",
    region: "us-east-1",
    customer: "default",
    rawFindingId: "raw-001",
    timestamp: BigInt(Date.now() - 5 * 60 * 1000) * BigInt(1_000_000),
    mitre: {
      tactic: "Initial Access",
      technique: "Valid Accounts",
      techniqueId: "T1078",
    },
  },
  {
    id: "alert-2",
    findingId: "az-alert-d4e5f6a7",
    provider: "Azure",
    title: "Suspicious authentication activity",
    description:
      "Multiple failed sign-in attempts detected for a single user account.",
    severity: "Medium",
    originalSeverity: "Medium",
    status: "Resolved",
    customer: "default",
    rawFindingId: "raw-004",
    timestamp: BigInt(Date.now() - 10 * 60 * 1000) * BigInt(1_000_000),
  },
];

const useNormalizedAlertsMock = vi.fn();
const useUpdateAlertStatusMock = vi.fn();
const useUpdateAlertOwnerMock = vi.fn();
const useEnrichAlertMock = vi.fn();

vi.mock("../hooks/use-backend", () => ({
  useNormalizedAlerts: (...args: unknown[]) => useNormalizedAlertsMock(...args),
  useUpdateAlertStatus: (...args: unknown[]) =>
    useUpdateAlertStatusMock(...args),
  useUpdateAlertOwner: (...args: unknown[]) => useUpdateAlertOwnerMock(...args),
  useEnrichAlert: (...args: unknown[]) => useEnrichAlertMock(...args),
  usePipelineHealth: () => ({ data: [] }),
  useGlobalSearch: () => ({ data: { results: [] }, isLoading: false }),
  useGetMyProviders: () => ({
    data: ["AWS", "Azure", "GCP"],
    isLoading: false,
  }),
}));

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

describe("AlertsPage (characterize)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNormalizedAlertsMock.mockReturnValue({ data: alerts, isLoading: false });
    useUpdateAlertStatusMock.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    });
    useUpdateAlertOwnerMock.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    });
    useEnrichAlertMock.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isError: false,
      error: null,
    });
  });

  it("renders the alert table with provider, severity, title, and status", async () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: "Alert Center" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("UnauthorizedAccess:IAMUser/MaliciousIPCaller.Custom"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Suspicious authentication activity"),
    ).toBeInTheDocument();
    // Provider labels render in the table rows
    expect(screen.getAllByText("AWS").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Azure").length).toBeGreaterThan(0);
    // Severity badges
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    // Status badges
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByText("Resolved")).toBeInTheDocument();
  });

  it("opens the detail panel showing enrichment, status changer, and owner field", async () => {
    renderPage();
    fireEvent.click(screen.getByTestId("alerts.item.1"));
    expect(screen.getByTestId("alert.detail.sheet")).toBeInTheDocument();
    // Enrichment section
    expect(screen.getByTestId("alert.enrichment.section")).toBeInTheDocument();
    expect(screen.getByTestId("alert.enrich_now_button")).toBeInTheDocument();
    // Status changer
    expect(screen.getByTestId("alert.status.select")).toBeInTheDocument();
    expect(screen.getByTestId("alert.status.save_button")).toBeInTheDocument();
    // Owner field
    expect(screen.getByTestId("alert.owner.input")).toBeInTheDocument();
    expect(screen.getByTestId("alert.owner.save_button")).toBeInTheDocument();
  });

  it("saves a status change through the update hook", async () => {
    const saveStatus = vi.fn().mockResolvedValue(undefined);
    useUpdateAlertStatusMock.mockReturnValue({
      mutateAsync: saveStatus,
      isPending: false,
    });
    renderPage();
    fireEvent.click(screen.getByTestId("alerts.item.1"));
    act(() => {
      fireEvent.click(screen.getByTestId("alert.status.save_button"));
    });
    expect(saveStatus).toHaveBeenCalledWith({
      alertId: "alert-1",
      status: "Open",
    });
  });

  it("shows the empty state when no alerts match", async () => {
    useNormalizedAlertsMock.mockReturnValue({ data: [], isLoading: false });
    renderPage();
    expect(screen.getByTestId("alerts.empty_state")).toBeInTheDocument();
  });
});
