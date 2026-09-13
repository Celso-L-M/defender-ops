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

describe("FailedIngestionPage (characterize)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useFailedIngestionsMock.mockReturnValue({
      data: failedIngestions,
      isLoading: false,
    });
  });

  it("renders the page title and failed ingestion records", async () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: "Failed Ingestions" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("GuardDuty: missing detail.type"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Azure: missing properties.compromisedEntity"),
    ).toBeInTheDocument();
  });

  it("shows provider and error-type badges for each record", async () => {
    renderPage();
    // Provider names also appear in the sidebar nav, so assert at least one
    // occurrence (the record badge) rather than a single unique match.
    expect(screen.getAllByText("AWS").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Azure").length).toBeGreaterThan(0);
    expect(screen.getByText("extraction error")).toBeInTheDocument();
    expect(screen.getByText("validation error")).toBeInTheDocument();
  });

  it("opens the raw payload dialog when the JSON button is clicked", async () => {
    renderPage();
    const viewButtons = screen.getAllByTestId(
      /failed_ingestions\.view_payload_button/,
    );
    expect(viewButtons.length).toBeGreaterThan(0);
    fireEvent.click(viewButtons[0]);
    expect(
      screen.getByTestId("failed_ingestions.payload.dialog"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Recon/)).toBeInTheDocument();
  });

  it("shows the empty state when there are no failed ingestions", async () => {
    useFailedIngestionsMock.mockReturnValue({ data: [], isLoading: false });
    renderPage();
    expect(
      screen.getByTestId("failed_ingestions.empty_state"),
    ).toBeInTheDocument();
  });

  it("surfaces webhook rejection records with provider and rejection reason", async () => {
    useFailedIngestionsMock.mockReturnValue({
      data: [
        {
          id: "fi-webhook-1",
          provider: "AWS",
          errorType: "Unauthorized",
          rawPayload: '{"detail":{"type":"Recon"}}',
          timestamp: BigInt(Date.now() - 2 * 60 * 1000) * BigInt(1_000_000),
          errorMessage: "Invalid signature",
          status: "FailedParse",
        },
      ],
      isLoading: false,
    });
    renderPage();
    // Provider badge (also present in the sidebar nav)
    expect(screen.getAllByText("AWS").length).toBeGreaterThan(0);
    // Rejection reason is surfaced as the error message
    expect(screen.getByText("Invalid signature")).toBeInTheDocument();
    // Error type badge reflects the rejection
    expect(screen.getByText("Unauthorized")).toBeInTheDocument();
  });

  it("renders provider, error type, and timestamp together for each record", async () => {
    const fixedNs = BigInt(1_700_000_000_000_000_000);
    const expected = new Date(Number(fixedNs) / 1_000_000).toLocaleString([], {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    useFailedIngestionsMock.mockReturnValue({
      data: [
        {
          id: "fi-combined",
          provider: "GCP",
          errorType: "normalization_error",
          rawPayload: "{}",
          timestamp: fixedNs,
          errorMessage: "combined record",
          status: "Normalization Failed",
        },
      ],
      isLoading: false,
    });
    renderPage();
    // Provider badge (also present in the sidebar nav)
    expect(screen.getAllByText("GCP").length).toBeGreaterThan(0);
    // Error type badge (underscores rendered as spaces)
    expect(screen.getByText("normalization error")).toBeInTheDocument();
    // Formatted timestamp
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it("narrows records by provider via the provider filter", () => {
    useFailedIngestionsMock.mockImplementation((provider?: string) => ({
      data:
        provider === "AWS"
          ? failedIngestions.filter((f) => f.provider === "AWS")
          : failedIngestions,
      isLoading: false,
    }));
    renderPage();
    // Both providers visible before filtering
    expect(
      screen.getByText("GuardDuty: missing detail.type"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Azure: missing properties.compromisedEntity"),
    ).toBeInTheDocument();

    // Open the provider select and choose AWS. Radix Select in jsdom needs a
    // pointer-down on the trigger to open the content, then a click on the
    // option to commit the selection.
    const providerTrigger = screen.getByTestId(
      "failed_ingestions.provider.select",
    );
    act(() => {
      fireEvent.pointerDown(providerTrigger);
    });
    act(() => {});
    const awsOption = screen.getByRole("option", { name: "AWS" });
    act(() => {
      fireEvent.click(awsOption);
    });

    // Only the AWS record remains
    expect(
      screen.getByText("GuardDuty: missing detail.type"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Azure: missing properties.compromisedEntity"),
    ).not.toBeInTheDocument();
    // Close the select so its portal does not contaminate later tests.
    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
  });

  it("narrows records by error type via the error-type filter", () => {
    renderPage();
    // Both error types visible before filtering
    expect(screen.getByText("extraction error")).toBeInTheDocument();
    expect(screen.getByText("validation error")).toBeInTheDocument();

    // Open the error-type select and choose Validation Error.
    const errorTypeTrigger = screen.getByTestId(
      "failed_ingestions.error_type.select",
    );
    act(() => {
      fireEvent.pointerDown(errorTypeTrigger);
    });
    act(() => {});
    const validationOption = screen.getByRole("option", {
      name: "Validation Error",
    });
    act(() => {
      fireEvent.click(validationOption);
    });

    // Only the validation_error record remains
    expect(screen.getByText("validation error")).toBeInTheDocument();
    expect(screen.queryByText("extraction error")).not.toBeInTheDocument();
    expect(
      screen.queryByText("GuardDuty: missing detail.type"),
    ).not.toBeInTheDocument();
    // Close the select so its portal does not contaminate later tests.
    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
  });

  it("displays the stored raw payload JSON in the payload dialog", async () => {
    renderPage();
    const viewButtons = screen.getAllByTestId(
      /failed_ingestions\.view_payload_button/,
    );
    // First record (fi-1) has rawPayload '{"detail":{"type":"Recon"}}'
    fireEvent.click(viewButtons[0]);
    const dialog = screen.getByTestId("failed_ingestions.payload.dialog");
    expect(dialog).toBeInTheDocument();
    // The formatted JSON keys and values from the stored payload are shown
    expect(screen.getByText(/"detail"/)).toBeInTheDocument();
    expect(screen.getByText(/"type"/)).toBeInTheDocument();
    expect(screen.getByText(/"Recon"/)).toBeInTheDocument();
  });

  it("renders a formatted timestamp for each failed ingestion record", async () => {
    const fixedNs = BigInt(1_700_000_000_000_000_000);
    const expected = new Date(Number(fixedNs) / 1_000_000).toLocaleString([], {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    useFailedIngestionsMock.mockReturnValue({
      data: [
        {
          id: "fi-ts",
          provider: "GCP",
          errorType: "validation_error",
          rawPayload: "{}",
          timestamp: fixedNs,
          errorMessage: "timestamp test",
          status: "failed",
        },
      ],
      isLoading: false,
    });
    renderPage();
    expect(screen.getByText(expected)).toBeInTheDocument();
  });
});
