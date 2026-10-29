import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ReportsPage from "../pages/ReportsPage";
import type { GeneratedReport, ReportRun } from "../types";

// Radix Checkbox (used by the generate dialog) observes element size, which
// jsdom does not implement.
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(globalThis, "ResizeObserver", {
  configurable: true,
  value: MockResizeObserver,
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
  useRouterState: () => ({ location: { pathname: "/reports" } }),
  Link: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const useGetReportsMock = vi.fn();
const useReportRunsMock = vi.fn();
const useExportReportPdfMock = vi.fn();
const useGetReportEmailConfigMock = vi.fn();
const useSaveReportRecipientsMock = vi.fn();

vi.mock("../hooks/use-backend", () => ({
  useGetReports: (...args: unknown[]) => useGetReportsMock(...args),
  useReportRuns: (...args: unknown[]) => useReportRunsMock(...args),
  useExportReportPdf: (...args: unknown[]) => useExportReportPdfMock(...args),
  useGetReportEmailConfig: (...args: unknown[]) =>
    useGetReportEmailConfigMock(...args),
  useSaveReportRecipients: (...args: unknown[]) =>
    useSaveReportRecipientsMock(...args),
  useGenerateReport: () => ({
    mutateAsync: vi.fn().mockResolvedValue({
      reportId: "report-2",
      csvData: "col1,col2\nv1,v2",
    }),
    isPending: false,
  }),
  useGetReportCsv: () => ({
    mutateAsync: vi.fn().mockResolvedValue("col1,col2\nv1,v2"),
    isPending: false,
  }),
  useDeleteReport: () => ({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
  }),
  useGetMyProviders: () => ({
    data: ["AWS", "Azure", "GCP"],
    isLoading: false,
  }),
  usePipelineHealth: () => ({ data: [] }),
  useGlobalSearch: () => ({ data: { results: [] }, isLoading: false }),
  useNormalizedAlerts: () => ({ data: [] }),
}));

const reports: GeneratedReport[] = [
  {
    reportId: "report-1",
    reportType: "SecurityPosture",
    customer: "default",
    dateRangeStart: "2026-10-01",
    dateRangeEnd: "2026-10-07",
    providerScope: ["AWS", "Azure"],
    format: "CSV",
    generatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    generatedBy: "admin",
  },
];

const runs: ReportRun[] = [
  {
    runId: "run-1",
    reportType: "SecurityPosture",
    trigger: "ScheduledWeekly",
    customer: "default",
    periodStart: BigInt(Date.UTC(2026, 9, 1)) * 1_000_000n,
    periodEnd: BigInt(Date.UTC(2026, 9, 7)) * 1_000_000n,
    generatedAt: BigInt(Date.UTC(2026, 9, 8, 6, 0)) * 1_000_000n,
    providerScope: ["AWS", "Azure", "GCP"],
    recipients: ["soc@example.com"],
    outcome: { __kind__: "Succeeded", Succeeded: null },
    deliveries: [
      { recipient: "soc@example.com", success: true },
      { recipient: "bad@example.com", success: false, error: "SMTP 550" },
    ],
  },
];

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ReportsPage />
    </QueryClientProvider>,
  );
}

describe("ReportsPage scheduled history and PDF export (cover)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useGetReportsMock.mockReturnValue({ data: reports, isLoading: false });
    useReportRunsMock.mockReturnValue({ data: runs, isLoading: false });
    useExportReportPdfMock.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(new Uint8Array([37, 80, 68, 70])),
      isPending: false,
    });
    useGetReportEmailConfigMock.mockReturnValue({
      data: [],
      isLoading: false,
    });
    useSaveReportRecipientsMock.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    });
  });

  it("renders the scheduled run history with trigger, outcome and delivery outcomes", () => {
    renderPage();
    expect(screen.getByTestId("reports.history_section")).toBeInTheDocument();
    expect(screen.getByTestId("reports.history.item.1")).toBeInTheDocument();
    expect(screen.getByText("Weekly")).toBeInTheDocument();
    expect(screen.getByText("Succeeded")).toBeInTheDocument();
    // Both a delivered and a failed recipient are surfaced.
    expect(screen.getByText("soc@example.com")).toBeInTheDocument();
    expect(screen.getByText("bad@example.com")).toBeInTheDocument();
  });

  it("shows the empty history state when no runs are recorded", () => {
    useReportRunsMock.mockReturnValue({ data: [], isLoading: false });
    renderPage();
    expect(
      screen.getByTestId("reports.history_empty_state"),
    ).toBeInTheDocument();
  });

  it("exports a report to PDF through the export hook and downloads the bytes", async () => {
    const exportPdf = vi
      .fn()
      .mockResolvedValue(new Uint8Array([37, 80, 68, 70]));
    useExportReportPdfMock.mockReturnValue({
      mutateAsync: exportPdf,
      isPending: false,
    });
    const createObjectURL = vi.fn(() => "blob:mock-pdf");
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: revokeObjectURL,
    });
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    renderPage();
    fireEvent.click(screen.getByTestId("reports.pdf_button"));

    await waitFor(() => {
      expect(exportPdf).toHaveBeenCalledWith({
        reportType: "SecurityPosture",
        periodStart: BigInt(Date.UTC(2026, 9, 1)) * 1_000_000n,
        periodEnd: BigInt(Date.UTC(2026, 9, 7)) * 1_000_000n,
        customer: "default",
        providerScope: ["AWS", "Azure"],
      });
    });
    expect(createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it("saves per-report-type email recipients through the recipients hook", async () => {
    const saveRecipients = vi.fn().mockResolvedValue(null);
    useSaveReportRecipientsMock.mockReturnValue({
      mutateAsync: saveRecipients,
      isPending: false,
    });
    renderPage();
    fireEvent.click(screen.getByTestId("reports.email_section.toggle"));
    fireEvent.change(
      screen.getByTestId("reports.email_input.securityposture"),
      {
        target: { value: "a@example.com, b@example.com" },
      },
    );
    fireEvent.click(
      screen.getByTestId("reports.email_save_button.securityposture"),
    );
    await waitFor(() => {
      expect(saveRecipients).toHaveBeenCalledWith({
        reportType: "SecurityPosture",
        recipients: ["a@example.com", "b@example.com"],
        customer: "",
      });
    });
  });

  it("rejects an invalid recipient address before calling the backend", async () => {
    const saveRecipients = vi.fn().mockResolvedValue(null);
    useSaveReportRecipientsMock.mockReturnValue({
      mutateAsync: saveRecipients,
      isPending: false,
    });
    renderPage();
    fireEvent.click(screen.getByTestId("reports.email_section.toggle"));
    fireEvent.change(
      screen.getByTestId("reports.email_input.securityposture"),
      {
        target: { value: "not-an-email" },
      },
    );
    fireEvent.click(
      screen.getByTestId("reports.email_save_button.securityposture"),
    );
    expect(
      await screen.findByTestId("reports.email_error.securityposture"),
    ).toBeInTheDocument();
    expect(saveRecipients).not.toHaveBeenCalled();
  });
});
