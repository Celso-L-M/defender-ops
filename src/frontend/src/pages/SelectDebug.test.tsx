import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FailedIngestionPage from "../pages/FailedIngestionPage";

// Radix Select relies on pointer APIs that jsdom does not implement. Without
// these stubs the provider/error-type dropdowns never open under test.
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
  useSearch: () => ({}),
  useRouterState: () => ({ location: { pathname: "/failed-ingestions" } }),
  Link: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const failedIngestions = [
  {
    id: "fi-1",
    provider: "AWS",
    errorType: "extraction_error",
    rawPayload: '{"detail":{"type":"Recon"}}',
    timestamp: BigInt(Date.now() - 5 * 60 * 1000) * BigInt(1_000_000),
    errorMessage: "GuardDuty: missing detail.type",
    status: "FailedParse",
  },
  {
    id: "fi-2",
    provider: "Azure",
    errorType: "validation_error",
    rawPayload: '{"properties":{}}',
    timestamp: BigInt(Date.now() - 10 * 60 * 1000) * BigInt(1_000_000),
    errorMessage: "Azure: missing properties.compromisedEntity",
    status: "failed",
  },
];

const useFailedIngestionsMock = vi.fn();
vi.mock("../hooks/use-backend", () => ({
  useFailedIngestions: (...args: unknown[]) => useFailedIngestionsMock(...args),
  usePipelineHealth: () => ({ data: [] }),
  useGlobalSearch: () => ({ data: { results: [] }, isLoading: false }),
  useNormalizedAlerts: () => ({ data: [] }),
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
      <FailedIngestionPage />
    </QueryClientProvider>,
  );
}

function selectOption(testId: string, optionName: string) {
  const trigger = screen.getByTestId(testId);
  act(() => {
    fireEvent.pointerDown(trigger);
  });
  act(() => {});
  const option = screen.getByRole("option", { name: optionName });
  act(() => {
    fireEvent.click(option);
  });
  // Close the select so its portal does not contaminate later tests.
  act(() => {
    fireEvent.keyDown(document, { key: "Escape" });
  });
}

describe("FailedIngestionPage filter reset", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useFailedIngestionsMock.mockImplementation((provider?: string) => ({
      data:
        provider === "AWS"
          ? failedIngestions.filter((f) => f.provider === "AWS")
          : failedIngestions,
      isLoading: false,
    }));
  });

  it("restores all records when the provider filter is reset to All", () => {
    renderPage();
    // Narrow to AWS first.
    selectOption("failed_ingestions.provider.select", "AWS");
    expect(
      screen.queryByText("Azure: missing properties.compromisedEntity"),
    ).not.toBeInTheDocument();

    // Reset to All Providers restores both records.
    selectOption("failed_ingestions.provider.select", "All Providers");
    expect(
      screen.getByText("GuardDuty: missing detail.type"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Azure: missing properties.compromisedEntity"),
    ).toBeInTheDocument();
  });
});
