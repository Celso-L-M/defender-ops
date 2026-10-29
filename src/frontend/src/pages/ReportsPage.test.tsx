import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ReportsPage from "../pages/ReportsPage";
import type { GeneratedReport, ReportEmailConfig } from "../types";

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
const useGenerateReportMock = vi.fn();
const useGetReportCsvMock = vi.fn();
const useDeleteReportMock = vi.fn();
const useGetReportEmailConfigMock = vi.fn();
const useSaveReportEmailConfigMock = vi.fn();
const useReportRunsMock = vi.fn();
const useExportReportPdfMock = vi.fn();
const useSaveReportRecipientsMock = vi.fn();

vi.mock("../hooks/use-backend", () => ({
  useGetReports: (...args: unknown[]) => useGetReportsMock(...args),
  useGenerateReport: (...args: unknown[]) => useGenerateReportMock(...args),
  useGetReportCsv: (...args: unknown[]) => useGetReportCsvMock(...args),
  useDeleteReport: (...args: unknown[]) => useDeleteReportMock(...args),
  useGetReportEmailConfig: (...args: unknown[]) =>
    useGetReportEmailConfigMock(...args),
  useSaveReportEmailConfig: (...args: unknown[]) =>
    useSaveReportEmailConfigMock(...args),
  useReportRuns: (...args: unknown[]) => useReportRunsMock(...args),
  useExportReportPdf: (...args: unknown[]) => useExportReportPdfMock(...args),
  useSaveReportRecipients: (...args: unknown[]) =>
    useSaveReportRecipientsMock(...args),
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

const emailConfig: ReportEmailConfig[] = [
  { reportType: "SecurityPosture", recipients: ["soc@example.com"] },
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

describe("ReportsPage (characterize)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useGetReportsMock.mockReturnValue({ data: reports, isLoading: false });
    useGenerateReportMock.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({
        reportId: "report-2",
        csvData: "col1,col2\nv1,v2",
      }),
      isPending: false,
    });
    useGetReportCsvMock.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue("col1,col2\nv1,v2"),
      isPending: false,
    });
    useDeleteReportMock.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    });
    useGetReportEmailConfigMock.mockReturnValue({
      data: emailConfig,
      isLoading: false,
    });
    useSaveReportEmailConfigMock.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    });
    useReportRunsMock.mockReturnValue({ data: [], isLoading: false });
    useExportReportPdfMock.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(new Uint8Array([37, 80, 68, 70])),
      isPending: false,
    });
    useSaveReportRecipientsMock.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(null),
      isPending: false,
    });
  });

  it("renders the reports library with existing report rows", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: "Security Reports" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Security Posture Summary")).toBeInTheDocument();
    expect(screen.getAllByText("AWS").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Azure").length).toBeGreaterThan(0);
  });

  it("shows the empty state when no reports exist", () => {
    useGetReportsMock.mockReturnValue({ data: [], isLoading: false });
    renderPage();
    expect(screen.getByTestId("reports.empty_state")).toBeInTheDocument();
  });

  it("generates a report for a custom date range and downloads the CSV", async () => {
    const generate = vi.fn().mockResolvedValue({
      reportId: "report-2",
      csvData: "col1,col2\nv1,v2",
    });
    useGenerateReportMock.mockReturnValue({
      mutateAsync: generate,
      isPending: false,
    });
    const createObjectURL = vi.fn(() => "blob:mock");
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
    fireEvent.click(screen.getByTestId("reports.generate_button"));
    expect(screen.getByTestId("reports.generate_dialog")).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("reports.start_date_input"), {
      target: { value: "2026-10-01" },
    });
    fireEvent.change(screen.getByTestId("reports.end_date_input"), {
      target: { value: "2026-10-07" },
    });
    fireEvent.click(
      screen.getByTestId("reports.generate_dialog.submit_button"),
    );

    await waitFor(() => {
      expect(generate).toHaveBeenCalledWith({
        reportType: "SecurityPosture",
        dateRangeStart: "2026-10-01",
        dateRangeEnd: "2026-10-07",
        providerScope: ["All"],
        customer: "",
      });
    });
    expect(createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it("downloads an existing report's CSV through the fetch hook", async () => {
    const fetchCsv = vi.fn().mockResolvedValue("col1,col2\nv1,v2");
    useGetReportCsvMock.mockReturnValue({
      mutateAsync: fetchCsv,
      isPending: false,
    });
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:mock"),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    });
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    renderPage();
    fireEvent.click(screen.getByTestId("reports.download_button"));

    await waitFor(() => {
      expect(fetchCsv).toHaveBeenCalledWith({
        reportId: "report-1",
        customer: "default",
      });
    });
    clickSpy.mockRestore();
  });

  it("saves per-report-type email recipients", async () => {
    const saveConfig = vi.fn().mockResolvedValue(null);
    useSaveReportRecipientsMock.mockReturnValue({
      mutateAsync: saveConfig,
      isPending: false,
    });
    renderPage();
    fireEvent.click(screen.getByTestId("reports.email_section.toggle"));
    const input = screen.getByTestId("reports.email_input.securityposture");
    fireEvent.change(input, {
      target: { value: "a@example.com, b@example.com" },
    });
    fireEvent.click(
      screen.getByTestId("reports.email_save_button.securityposture"),
    );
    await waitFor(() => {
      expect(saveConfig).toHaveBeenCalledWith({
        reportType: "SecurityPosture",
        recipients: ["a@example.com", "b@example.com"],
        customer: "",
      });
    });
  });
});
