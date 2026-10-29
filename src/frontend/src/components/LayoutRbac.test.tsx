import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Layout } from "../components/Layout";
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
    ...props
  }: { children: React.ReactNode } & Record<string, unknown>) => (
    <span {...props}>{children}</span>
  ),
}));

vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}));

const useGetMyProvidersMock = vi.fn();

vi.mock("../hooks/use-backend", () => ({
  useGetMyProviders: (...args: unknown[]) => useGetMyProvidersMock(...args),
  usePipelineHealth: () => ({ data: [] }),
  useGlobalSearch: () => ({ data: { results: [] }, isLoading: false }),
  useNormalizedAlerts: () => ({ data: [] }),
}));

function renderLayout() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <Layout>
        <div data-ocid="layout.content">content</div>
      </Layout>
    </QueryClientProvider>,
  );
}

describe("Layout RBAC gating (cover)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hides detection and admin navigation for a signed-out visitor", () => {
    useGetMyProvidersMock.mockReturnValue({
      data: [] as ProviderType[],
      isLoading: false,
    });
    renderLayout();
    expect(
      screen.queryByTestId("nav.alert_rules_link"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("nav.notification_settings_link"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("nav.notification_center_link"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("nav.provider_access_link"),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("nav.vault_link")).not.toBeInTheDocument();
  });

  it("hides detection navigation when the user has no assigned providers", () => {
    useGetMyProvidersMock.mockReturnValue({
      data: [] as ProviderType[],
      isLoading: false,
    });
    renderLayout();
    expect(
      screen.queryByTestId("nav.alert_rules_link"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("nav.notification_center_link"),
    ).not.toBeInTheDocument();
  });

  it("limits provider navigation to the assigned providers", () => {
    useGetMyProvidersMock.mockReturnValue({
      data: ["AWS"] as ProviderType[],
      isLoading: false,
    });
    renderLayout();
    expect(screen.getByTestId("nav.provider_aws_link")).toBeInTheDocument();
    expect(
      screen.queryByTestId("nav.provider_azure_link"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("nav.provider_gcp_link"),
    ).not.toBeInTheDocument();
  });
});
