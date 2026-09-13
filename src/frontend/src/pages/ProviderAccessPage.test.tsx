import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProviderAccessPage from "../pages/ProviderAccessPage";
import type { UserAssignmentView } from "../types";

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
  useRouterState: () => ({ location: { pathname: "/provider-access" } }),
  Link: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const useListUserAssignmentsMock = vi.fn();
const useAssignProviderAccessMock = vi.fn();
const useRemoveProviderAccessMock = vi.fn();

vi.mock("../hooks/use-backend", () => ({
  useListUserAssignments: (...args: unknown[]) =>
    useListUserAssignmentsMock(...args),
  useAssignProviderAccess: (...args: unknown[]) =>
    useAssignProviderAccessMock(...args),
  useRemoveProviderAccess: (...args: unknown[]) =>
    useRemoveProviderAccessMock(...args),
  useGetMyProviders: () => ({
    data: ["AWS", "Azure", "GCP"],
    isLoading: false,
  }),
  usePipelineHealth: () => ({ data: [] }),
  useGlobalSearch: () => ({ data: { results: [] }, isLoading: false }),
  useNormalizedAlerts: () => ({ data: [] }),
}));

const assignments: UserAssignmentView[] = [
  {
    principal: "2vxsx-fae",
    providers: ["AWS", "Azure", "GCP"],
  },
  {
    principal: "aaaaa-aa",
    providers: ["AWS"],
  },
];

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ProviderAccessPage />
    </QueryClientProvider>,
  );
}

describe("ProviderAccessPage (cover)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useListUserAssignmentsMock.mockReturnValue({
      data: assignments,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    useAssignProviderAccessMock.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    useRemoveProviderAccessMock.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it("renders the provider access page with user assignment rows", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: "Provider Access" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("provider_access.row.0")).toBeInTheDocument();
    expect(screen.getByTestId("provider_access.row.1")).toBeInTheDocument();
  });

  it("shows the empty state when there are no user assignments", () => {
    useListUserAssignmentsMock.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    renderPage();
    expect(
      screen.getByTestId("provider_access.empty_state"),
    ).toBeInTheDocument();
  });

  it("grants provider access when an unassigned provider checkbox is toggled on", () => {
    const assign = vi.fn();
    useAssignProviderAccessMock.mockReturnValue({
      mutate: assign,
      isPending: false,
    });
    renderPage();
    // Row 1 (aaaaa-aa) has only AWS. Toggle on Azure within that row.
    const row = screen.getByTestId("provider_access.row.1");
    const azureToggle = row.querySelector(
      '[data-ocid="provider_access.toggle.azure"]',
    );
    expect(azureToggle).not.toBeNull();
    const checkbox = azureToggle!.querySelector("button");
    expect(checkbox).not.toBeNull();
    fireEvent.click(checkbox!);
    expect(assign).toHaveBeenCalledWith(
      { principal: "aaaaa-aa", providers: ["AWS", "Azure"] },
      expect.any(Object),
    );
  });

  it("revokes provider access when an assigned provider checkbox is toggled off", () => {
    const remove = vi.fn();
    useRemoveProviderAccessMock.mockReturnValue({
      mutate: remove,
      isPending: false,
    });
    renderPage();
    // Row 1 (aaaaa-aa) has AWS assigned. Toggle off AWS within that row.
    const row = screen.getByTestId("provider_access.row.1");
    const awsToggle = row.querySelector(
      '[data-ocid="provider_access.toggle.aws"]',
    );
    expect(awsToggle).not.toBeNull();
    const checkbox = awsToggle!.querySelector("button");
    expect(checkbox).not.toBeNull();
    fireEvent.click(checkbox!);
    expect(remove).toHaveBeenCalledWith(
      { principal: "aaaaa-aa", provider: "AWS" },
      expect.any(Object),
    );
  });
});
