import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProviderOverviewPage from "../pages/ProviderOverviewPage";
import type { ProviderType } from "../types";

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
  useRouterState: () => ({ location: { pathname: "/" } }),
  Link: ({
    children,
    "data-ocid": ocid,
  }: {
    children: React.ReactNode;
    "data-ocid"?: string;
  }) => <span data-ocid={ocid}>{children}</span>,
}));

const useGetMyProvidersMock = vi.fn();
const useProviderStatesMock = vi.fn();
const useNormalizedAlertsMock = vi.fn();

vi.mock("../hooks/use-backend", () => ({
  useGetMyProviders: (...args: unknown[]) => useGetMyProvidersMock(...args),
  useProviderStates: (...args: unknown[]) => useProviderStatesMock(...args),
  useNormalizedAlerts: (...args: unknown[]) => useNormalizedAlertsMock(...args),
  usePipelineHealth: () => ({ data: [] }),
  useGlobalSearch: () => ({ data: { results: [] }, isLoading: false }),
}));

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ProviderOverviewPage />
    </QueryClientProvider>,
  );
}

describe("ProviderOverviewPage (cover)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useGetMyProvidersMock.mockReturnValue({
      data: ["AWS", "Azure", "GCP"] as ProviderType[],
      isLoading: false,
    });
    useProviderStatesMock.mockReturnValue({ data: [] });
    useNormalizedAlertsMock.mockReturnValue({ data: [], isLoading: false });
  });

  it("renders the overview page with a card for each assigned provider", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: "Provider Overview" }),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("overview.provider_aws.card"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("overview.provider_azure.card"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("overview.provider_gcp.card"),
    ).toBeInTheDocument();
  });

  it("shows only the providers the user is assigned to", () => {
    useGetMyProvidersMock.mockReturnValue({
      data: ["AWS"] as ProviderType[],
      isLoading: false,
    });
    renderPage();
    expect(
      screen.getByTestId("overview.provider_aws.card"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("overview.provider_azure.card"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("overview.provider_gcp.card"),
    ).not.toBeInTheDocument();
  });

  it("renders a dashboard link for each assigned provider card", () => {
    renderPage();
    expect(
      screen.getByTestId("overview.provider_aws.dashboard_link"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("overview.provider_azure.dashboard_link"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("overview.provider_gcp.dashboard_link"),
    ).toBeInTheDocument();
  });

  it("shows the empty state when the user has no assigned providers", () => {
    useGetMyProvidersMock.mockReturnValue({
      data: [] as ProviderType[],
      isLoading: false,
    });
    renderPage();
    expect(screen.getByTestId("overview.empty_state")).toBeInTheDocument();
    expect(screen.getByText("No providers assigned")).toBeInTheDocument();
  });

  it("shows the active alert count per provider card", () => {
    useNormalizedAlertsMock.mockImplementation(
      ({ provider }: { provider: ProviderType }) => ({
        data:
          provider === "AWS"
            ? [
                {
                  id: "a1",
                  severity: "High",
                  status: "Open",
                },
                {
                  id: "a2",
                  severity: "Low",
                  status: "Resolved",
                },
              ]
            : [],
        isLoading: false,
      }),
    );
    renderPage();
    // AWS has 1 active (non-Resolved) alert; Azure/GCP have 0.
    const awsCard = screen.getByTestId("overview.provider_aws.card");
    expect(awsCard).toHaveTextContent("1");
    const azureCard = screen.getByTestId("overview.provider_azure.card");
    expect(azureCard).toHaveTextContent("0");
  });
});
