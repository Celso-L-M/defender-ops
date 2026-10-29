import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AwsDashboardPage from "../pages/AwsDashboardPage";
import AzureDashboardPage from "../pages/AzureDashboardPage";
import GcpDashboardPage from "../pages/GcpDashboardPage";
import VaultPage from "../pages/VaultPage";
import type {
  CredentialResult,
  ProviderCredentialStatus,
  ProviderType,
} from "../types";

// jsdom does not implement the native <dialog> element's imperative API, which
// SecurityEventFeed and CorrelatedIncidentsPanel rely on.
Object.defineProperty(HTMLDialogElement.prototype, "show", {
  configurable: true,
  value: function () {
    this.open = true;
  },
});
Object.defineProperty(HTMLDialogElement.prototype, "close", {
  configurable: true,
  value: function () {
    this.open = false;
  },
});
Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
  configurable: true,
  value: function () {
    this.open = true;
  },
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
  useRouterState: () => ({ location: { pathname: "/vault" } }),
  Link: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const useGetMyProvidersMock = vi.fn();
const useNormalizedAlertsMock = vi.fn();
const useAssetsMock = vi.fn();
const useComplianceStatusMock = vi.fn();
const useCorrelatedIncidentsMock = vi.fn();
const useProviderStatesMock = vi.fn();
const listVaultSecretsMock = vi.fn();
const auditLogMock = vi.fn();
const credentialStatusMock = vi.fn();
const saveCredentialMock = vi.fn();
const updateCredentialMock = vi.fn();
const clearCredentialMock = vi.fn();
const testConnectionMock = vi.fn();

vi.mock("../hooks/use-backend", () => ({
  useGetMyProviders: (...args: unknown[]) => useGetMyProvidersMock(...args),
  useNormalizedAlerts: (...args: unknown[]) => useNormalizedAlertsMock(...args),
  useAssets: (...args: unknown[]) => useAssetsMock(...args),
  useComplianceStatus: (...args: unknown[]) => useComplianceStatusMock(...args),
  useCorrelatedIncidents: (...args: unknown[]) =>
    useCorrelatedIncidentsMock(...args),
  useProviderStates: (...args: unknown[]) => useProviderStatesMock(...args),
  useBlockIp: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useIsolateResource: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDisableAzureAdAccount: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useForceGcpIamReview: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useRevokeIamCredentials: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useListVaultSecrets: (...args: unknown[]) => listVaultSecretsMock(...args),
  useSaveVaultSecret: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateVaultSecret: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDeleteVaultSecret: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useRevealVaultSecret: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useAuditLog: (...args: unknown[]) => auditLogMock(...args),
  usePipelineHealth: () => ({ data: [] }),
  useGlobalSearch: () => ({ data: { results: [] }, isLoading: false }),
  useProviderCredentialStatus: (...args: unknown[]) =>
    credentialStatusMock(...args),
  useSaveProviderCredential: () => ({
    mutateAsync: saveCredentialMock,
    isPending: false,
  }),
  useUpdateProviderCredential: () => ({
    mutateAsync: updateCredentialMock,
    isPending: false,
  }),
  useClearProviderCredential: () => ({
    mutateAsync: clearCredentialMock,
    isPending: false,
  }),
  useTestProviderConnection: (...args: unknown[]) => {
    testConnectionMock(...args);
    return { mutate: testConnectionMock, isPending: false, data: undefined };
  },
}));

const okResult: CredentialResult = { __kind__: "ok", ok: null };

function unconfigured(provider: ProviderType): ProviderCredentialStatus {
  return { provider, configured: false, fields: [] };
}

function configured(
  provider: ProviderType,
  fields: ProviderCredentialStatus["fields"],
): ProviderCredentialStatus {
  return {
    provider,
    configured: true,
    fields,
    updatedAt: BigInt(1_700_000_000_000_000_000),
  };
}

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  useGetMyProvidersMock.mockReturnValue({
    data: ["AWS", "Azure", "GCP"] as ProviderType[],
    isLoading: false,
  });
  useNormalizedAlertsMock.mockReturnValue({ data: [], isLoading: false });
  useAssetsMock.mockReturnValue({ data: [], isLoading: false });
  useComplianceStatusMock.mockReturnValue({
    data: { score: 0n, total: 0n, passing: 0n, failing: 0n, controls: [] },
    isLoading: false,
  });
  useCorrelatedIncidentsMock.mockReturnValue({ data: [], isLoading: false });
  useProviderStatesMock.mockReturnValue({ data: [] });
  listVaultSecretsMock.mockReturnValue({ data: [], isLoading: false });
  auditLogMock.mockReturnValue({ data: [], isLoading: false });
  credentialStatusMock.mockImplementation((provider: ProviderType) => ({
    data: unconfigured(provider),
    isLoading: false,
  }));
  saveCredentialMock.mockResolvedValue(okResult);
  updateCredentialMock.mockResolvedValue(okResult);
  clearCredentialMock.mockResolvedValue(okResult);
});

describe("Cloud Vault provider credentials (cover)", () => {
  it("shows the structured Provider Credentials section with the active provider's typed fields", async () => {
    const user = userEvent.setup();
    renderWithQuery(<VaultPage />);

    // AWS is the default active provider.
    expect(
      screen.getByTestId("provider_credentials.aws.section"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("provider_credentials.aws.unconfigured_badge"),
    ).toBeInTheDocument();

    await user.click(
      screen.getByTestId("provider_credentials.aws.edit_button"),
    );
    const form = screen.getByTestId("provider_credentials.aws.form");
    // AWS typed schema: Role ARN, External ID, Regions.
    expect(within(form).getByLabelText(/Role ARN/)).toBeInTheDocument();
    expect(within(form).getByLabelText(/External ID/)).toBeInTheDocument();
    expect(within(form).getByLabelText(/Regions/)).toBeInTheDocument();
  });

  it("shows the Azure typed schema when the Azure tab is active", async () => {
    const user = userEvent.setup();
    renderWithQuery(<VaultPage />);

    await user.click(screen.getByTestId("vault.provider_tab.azure"));
    expect(
      screen.getByTestId("provider_credentials.azure.section"),
    ).toBeInTheDocument();

    await user.click(
      screen.getByTestId("provider_credentials.azure.edit_button"),
    );
    const form = screen.getByTestId("provider_credentials.azure.form");
    expect(within(form).getByLabelText(/Client ID/)).toBeInTheDocument();
    expect(within(form).getByLabelText(/Client Secret/)).toBeInTheDocument();
    expect(within(form).getByLabelText(/Tenant ID/)).toBeInTheDocument();
    expect(within(form).getByLabelText(/Subscription IDs/)).toBeInTheDocument();
  });

  it("saves a provider credential from the vault page and shows it configured", async () => {
    const user = userEvent.setup();
    renderWithQuery(<VaultPage />);

    await user.click(
      screen.getByTestId("provider_credentials.aws.edit_button"),
    );
    await user.type(
      screen.getByTestId("provider_credentials.aws.roleArn_input"),
      "arn:aws:iam::123456789012:role/SecurityAudit",
    );
    await user.type(
      screen.getByTestId("provider_credentials.aws.regions_input"),
      "us-east-1, eu-west-1",
    );
    await user.click(
      screen.getByTestId("provider_credentials.aws.save_button"),
    );

    expect(saveCredentialMock).toHaveBeenCalledWith({
      __kind__: "AWS",
      AWS: {
        roleArn: "arn:aws:iam::123456789012:role/SecurityAudit",
        regions: ["us-east-1", "eu-west-1"],
      },
    });
    expect(
      await screen.findByTestId("provider_credentials.aws.success_state"),
    ).toHaveTextContent("AWS credential saved");
  });

  it("blocks saving when a required typed field is empty", async () => {
    const user = userEvent.setup();
    renderWithQuery(<VaultPage />);

    await user.click(
      screen.getByTestId("provider_credentials.aws.edit_button"),
    );
    await user.click(
      screen.getByTestId("provider_credentials.aws.save_button"),
    );

    expect(saveCredentialMock).not.toHaveBeenCalled();
    expect(
      screen.getByTestId("provider_credentials.aws.field_error"),
    ).toHaveTextContent("Role ARN is required");
  });

  it("shows only masked values and configured status for a stored credential", () => {
    credentialStatusMock.mockImplementation((provider: ProviderType) => ({
      data: configured(provider, [
        { name: "roleArn", maskedValue: "••••••••••••", isSet: true },
        { name: "regions", maskedValue: "us-east-1", isSet: true },
      ]),
      isLoading: false,
    }));
    renderWithQuery(<VaultPage />);

    expect(
      screen.getByTestId("provider_credentials.aws.configured_badge"),
    ).toBeInTheDocument();
    const roleField = screen.getByTestId(
      "provider_credentials.aws.field.roleArn",
    );
    expect(roleField).toHaveTextContent("••••••••••••");
    // The plaintext secret is never rendered back.
    expect(
      screen.queryByText("arn:aws:iam::123456789012:role/SecurityAudit"),
    ).not.toBeInTheDocument();
  });

  it("reports a connection test success message for the selected provider", async () => {
    const user = userEvent.setup();
    testConnectionMock.mockImplementation(
      (
        _arg: undefined,
        options?: {
          onSuccess?: (r: { success: boolean; message: string }) => void;
        },
      ) => {
        options?.onSuccess?.({
          success: true,
          message: "AWS credentials verified",
        });
      },
    );
    renderWithQuery(<VaultPage />);

    await user.click(
      screen.getByTestId("provider_credentials.aws.test_button"),
    );
    expect(testConnectionMock).toHaveBeenCalled();
  });

  it("hides the credentials section from a user without access to the active provider", () => {
    useGetMyProvidersMock.mockReturnValue({
      data: ["Azure"] as ProviderType[],
      isLoading: false,
    });
    renderWithQuery(<VaultPage />);

    // AWS is active but not assigned, so the credentials form is not rendered.
    expect(
      screen.queryByTestId("provider_credentials.aws.section"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId("vault.credentials.access_denied"),
    ).toBeInTheDocument();
  });
});

describe("provider dashboard credentials sections (cover)", () => {
  it("shows the AWS dashboard credentials section with typed fields and configured status", async () => {
    const user = userEvent.setup();
    credentialStatusMock.mockImplementation((provider: ProviderType) => ({
      data: configured(provider, [
        { name: "roleArn", maskedValue: "••••••••••••", isSet: true },
      ]),
      isLoading: false,
    }));
    renderWithQuery(<AwsDashboardPage />);

    expect(
      screen.getByTestId("aws_dashboard.credentials.section"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("provider_credentials.aws.configured_badge"),
    ).toBeInTheDocument();

    await user.click(
      screen.getByTestId("provider_credentials.aws.edit_button"),
    );
    const form = screen.getByTestId("provider_credentials.aws.form");
    expect(within(form).getByLabelText(/Role ARN/)).toBeInTheDocument();
    expect(within(form).getByLabelText(/Regions/)).toBeInTheDocument();
  });

  it("saves a credential from the AWS dashboard and reflects the configured status", async () => {
    const user = userEvent.setup();
    renderWithQuery(<AwsDashboardPage />);

    await user.click(
      screen.getByTestId("provider_credentials.aws.edit_button"),
    );
    await user.type(
      screen.getByTestId("provider_credentials.aws.roleArn_input"),
      "arn:aws:iam::123456789012:role/SecurityAudit",
    );
    await user.type(
      screen.getByTestId("provider_credentials.aws.regions_input"),
      "us-east-1",
    );
    await user.click(
      screen.getByTestId("provider_credentials.aws.save_button"),
    );

    expect(saveCredentialMock).toHaveBeenCalledWith({
      __kind__: "AWS",
      AWS: {
        roleArn: "arn:aws:iam::123456789012:role/SecurityAudit",
        regions: ["us-east-1"],
      },
    });
    expect(
      await screen.findByTestId("provider_credentials.aws.success_state"),
    ).toHaveTextContent("AWS credential saved");
  });

  it("shows the Azure dashboard credentials section with the Azure typed schema", async () => {
    const user = userEvent.setup();
    renderWithQuery(<AzureDashboardPage />);

    expect(
      screen.getByTestId("azure_dashboard.credentials.section"),
    ).toBeInTheDocument();
    await user.click(
      screen.getByTestId("provider_credentials.azure.edit_button"),
    );
    const form = screen.getByTestId("provider_credentials.azure.form");
    expect(within(form).getByLabelText(/Client ID/)).toBeInTheDocument();
    expect(within(form).getByLabelText(/Tenant ID/)).toBeInTheDocument();
  });

  it("shows the GCP dashboard credentials section with the GCP typed schema", async () => {
    const user = userEvent.setup();
    renderWithQuery(<GcpDashboardPage />);

    expect(screen.getByTestId("gcp.credentials.section")).toBeInTheDocument();
    await user.click(
      screen.getByTestId("provider_credentials.gcp.edit_button"),
    );
    const form = screen.getByTestId("provider_credentials.gcp.form");
    expect(
      within(form).getByLabelText(/Service Account JSON/),
    ).toBeInTheDocument();
    expect(within(form).getByLabelText(/Project IDs/)).toBeInTheDocument();
  });

  it("rejects invalid GCP Service Account JSON before saving", async () => {
    const user = userEvent.setup();
    renderWithQuery(<GcpDashboardPage />);

    await user.click(
      screen.getByTestId("provider_credentials.gcp.edit_button"),
    );
    await user.type(
      screen.getByTestId("provider_credentials.gcp.serviceAccountJson_input"),
      "not-json",
    );
    await user.type(
      screen.getByTestId("provider_credentials.gcp.projectIds_input"),
      "my-project-1",
    );
    await user.click(
      screen.getByTestId("provider_credentials.gcp.save_button"),
    );

    expect(saveCredentialMock).not.toHaveBeenCalled();
    expect(
      screen.getByTestId("provider_credentials.gcp.field_error"),
    ).toHaveTextContent("Service Account JSON is not valid JSON");
  });
});
