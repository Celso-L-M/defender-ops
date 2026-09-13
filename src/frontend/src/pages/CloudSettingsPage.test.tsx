import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CloudSettingsPage from "../pages/CloudSettingsPage";

// Mock the core-infrastructure hooks used by Layout and the page.
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

// Mock the backend hooks the page and Layout depend on.
vi.mock("@tanstack/react-router", () => ({
  useRouterState: () => ({ location: { pathname: "/settings" } }),
  Link: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const useSaveWebhookSecretMock = vi.fn();
vi.mock("../hooks/use-backend", () => ({
  useProviderStates: () => ({
    data: [
      {
        provider: "AWS",
        status: "Active",
        interval: "FifteenMin",
        lastSuccessfulPoll:
          BigInt(Date.now() - 8 * 60 * 1000) * BigInt(1_000_000),
        findingsToday: BigInt(23),
        consecutiveFailures: BigInt(0),
      },
      {
        provider: "Azure",
        status: "Active",
        interval: "ThirtyMin",
        lastSuccessfulPoll:
          BigInt(Date.now() - 12 * 60 * 1000) * BigInt(1_000_000),
        findingsToday: BigInt(24),
        consecutiveFailures: BigInt(0),
      },
      {
        provider: "GCP",
        status: "Inactive",
        interval: "OneHour",
        findingsToday: BigInt(0),
        consecutiveFailures: BigInt(0),
      },
    ],
    isLoading: false,
  }),
  useCredentialHealth: () => ({
    data: [
      { provider: "AWS", health: { __kind__: "Valid" }, expiryNs: null },
      { provider: "Azure", health: { __kind__: "Valid" }, expiryNs: null },
      { provider: "GCP", health: { __kind__: "Valid" }, expiryNs: null },
    ],
    isLoading: false,
  }),
  useGetEnrichmentKeys: () => ({
    data: { abuseIpdbKeySet: true, virusTotalKeySet: false },
    isLoading: false,
  }),
  useSaveEnrichmentKeys: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useGetWebhookSecretStatus: () => ({
    data: { awsSet: true, azureSet: false, gcpSet: false },
    isLoading: false,
  }),
  useSaveWebhookSecret: (...args: unknown[]) =>
    useSaveWebhookSecretMock(...args),
  useSaveAwsCredentials: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useSaveAzureCredentials: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useSaveGcpCredentials: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useSetPollingInterval: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useTestConnection: () => ({
    mutate: vi.fn(),
    data: undefined,
    isPending: false,
    isError: false,
  }),
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
      <CloudSettingsPage />
    </QueryClientProvider>,
  );
}

describe("CloudSettingsPage (characterize)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSaveWebhookSecretMock.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
  });

  it("renders the page title and all three provider sections", async () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: "Cloud Provider Settings" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("settings.aws.section")).toBeInTheDocument();
    expect(screen.getByTestId("settings.azure.section")).toBeInTheDocument();
    expect(screen.getByTestId("settings.gcp.section")).toBeInTheDocument();
  });

  it("shows the provider status bar with AWS, Azure, and GCP entries", async () => {
    renderPage();
    const statusBar = screen.getByTestId("settings.status_bar");
    expect(statusBar).toBeInTheDocument();
    expect(
      screen.getByTestId("settings.provider_status.aws"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("settings.provider_status.azure"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("settings.provider_status.gcp"),
    ).toBeInTheDocument();
  });

  it("renders the AWS credentials form with role ARN and save button", async () => {
    renderPage();
    expect(screen.getByTestId("settings.aws.form")).toBeInTheDocument();
    expect(screen.getByLabelText("Role ARN")).toBeInTheDocument();
    expect(screen.getByTestId("settings.aws.save_button")).toBeInTheDocument();
  });

  it("renders the threat intelligence section and reflects configured keys without revealing values", async () => {
    renderPage();
    expect(
      screen.getByTestId("settings.threat_intel.section"),
    ).toBeInTheDocument();
    // abuseIpdbKeySet is true -> "Key configured" badge shown
    expect(screen.getByText("Key configured")).toBeInTheDocument();
    // The secret value is never rendered.
    expect(
      screen.queryByText("super-secret-abuse-key"),
    ).not.toBeInTheDocument();
  });

  it("renders the webhook signature secrets section with per-provider inputs", async () => {
    renderPage();
    expect(
      screen.getByTestId("settings.webhook_secrets.section"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Webhook Signature Secrets" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("AWS Webhook Secret")).toBeInTheDocument();
    expect(screen.getByLabelText("Azure Webhook Secret")).toBeInTheDocument();
    expect(screen.getByLabelText("GCP Webhook Secret")).toBeInTheDocument();
  });

  it("shows configured/unconfigured badges per provider without revealing the secret value", async () => {
    renderPage();
    // awsSet is true -> "Secret configured"; azure/gcp are false -> "Not configured"
    expect(screen.getByText("Secret configured")).toBeInTheDocument();
    expect(screen.getAllByText("Not configured")).toHaveLength(2);
    // The secret value is never rendered.
    expect(screen.queryByText("super-secret-aws-key")).not.toBeInTheDocument();
  });

  it("saves a webhook secret for a provider when the save button is clicked", async () => {
    const saveSecret = vi.fn().mockResolvedValue(undefined);
    useSaveWebhookSecretMock.mockReturnValue({
      mutateAsync: saveSecret,
      isPending: false,
    });
    const user = userEvent.setup();
    renderPage();
    const awsInput = screen.getByLabelText("AWS Webhook Secret");
    await user.type(awsInput, "my-aws-secret");
    await user.click(
      screen.getByTestId("settings.webhook_secrets.aws_save_button"),
    );
    expect(saveSecret).toHaveBeenCalledWith({
      provider: "AWS",
      secret: "my-aws-secret",
    });
  });
});
