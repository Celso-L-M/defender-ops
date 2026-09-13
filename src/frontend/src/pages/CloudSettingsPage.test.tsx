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
const useSaveEnrichmentKeysMock = vi.fn();
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
  useSaveEnrichmentKeys: (...args: unknown[]) =>
    useSaveEnrichmentKeysMock(...args),
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
    useSaveEnrichmentKeysMock.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
  });

  it("renders the page title and the remaining settings sections", async () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: "Cloud Provider Settings" }),
    ).toBeInTheDocument();
    // The per-provider credential sections and status bar were replaced by the
    // centralized vault; the ThreatIntel and WebhookSecret sections remain.
    expect(
      screen.getByTestId("settings.threat_intel.section"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("settings.webhook_secrets.section"),
    ).toBeInTheDocument();
  });

  it("no longer renders per-provider credential forms (replaced by the vault)", async () => {
    renderPage();
    // The centralized vault replaced the per-provider credential forms (AWS
    // Role ARN, Azure Client ID/Secret, GCP Service Account JSON), so the old
    // AWS credential form is gone from the settings page.
    expect(screen.queryByTestId("settings.aws.form")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Role ARN")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("settings.aws.save_button"),
    ).not.toBeInTheDocument();
    // The ThreatIntel and WebhookSecret sections remain intact.
    expect(
      screen.getByTestId("settings.threat_intel.section"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("settings.webhook_secrets.section"),
    ).toBeInTheDocument();
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

  it("saves threat intelligence API keys without revealing stored values", async () => {
    const saveKeys = vi.fn().mockResolvedValue(undefined);
    useSaveEnrichmentKeysMock.mockReturnValue({
      mutateAsync: saveKeys,
      isPending: false,
    });
    const user = userEvent.setup();
    renderPage();
    const abuseInput = screen.getByTestId(
      "settings.threat_intel.abuseipdb_input",
    );
    const vtInput = screen.getByTestId(
      "settings.threat_intel.virustotal_input",
    );
    await user.type(abuseInput, "abuse-key-123");
    await user.type(vtInput, "vt-key-456");
    await user.click(screen.getByTestId("settings.threat_intel.save_button"));
    expect(saveKeys).toHaveBeenCalledWith({
      abuseIpdbKey: "abuse-key-123",
      virusTotalKey: "vt-key-456",
    });
    // The typed key values are never rendered back as plaintext.
    expect(screen.queryByText("abuse-key-123")).not.toBeInTheDocument();
    expect(screen.queryByText("vt-key-456")).not.toBeInTheDocument();
  });
});
