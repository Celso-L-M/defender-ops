import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import VaultPage from "../pages/VaultPage";
import type { VaultEntryView } from "../types";

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

vi.mock("@tanstack/react-router", () => ({
  useRouterState: () => ({ location: { pathname: "/vault" } }),
  Link: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}));

const listVaultSecretsMock = vi.fn();
const saveVaultSecretMock = vi.fn();
const updateVaultSecretMock = vi.fn();
const deleteVaultSecretMock = vi.fn();
const revealVaultSecretMock = vi.fn();
const auditLogMock = vi.fn();

vi.mock("../hooks/use-backend", () => ({
  useListVaultSecrets: (...args: unknown[]) => listVaultSecretsMock(...args),
  useSaveVaultSecret: () => ({
    mutateAsync: saveVaultSecretMock,
    isPending: false,
  }),
  useUpdateVaultSecret: () => ({
    mutateAsync: updateVaultSecretMock,
    isPending: false,
  }),
  useDeleteVaultSecret: () => ({
    mutateAsync: deleteVaultSecretMock,
    isPending: false,
  }),
  useRevealVaultSecret: () => ({
    mutateAsync: revealVaultSecretMock,
    isPending: false,
  }),
  useAuditLog: (...args: unknown[]) => auditLogMock(...args),
  useGetMyProviders: () => ({
    data: ["AWS", "Azure", "GCP"],
    isLoading: false,
  }),
  usePipelineHealth: () => ({ data: [] }),
  useGlobalSearch: () => ({ data: { results: [] }, isLoading: false }),
  useNormalizedAlerts: () => ({ data: [] }),
}));

const awsEntry: VaultEntryView = {
  provider: "AWS",
  name: "prod-stripe-api-key",
  maskedValue: "••••••••••••",
  createdAt: BigInt(1_700_000_000_000_000_000),
  updatedAt: BigInt(1_700_000_000_000_000_000),
};

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <VaultPage />
    </QueryClientProvider>,
  );
}

describe("VaultPage (cover)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listVaultSecretsMock.mockReturnValue({ data: [], isLoading: false });
    auditLogMock.mockReturnValue({ data: [], isLoading: false });
    saveVaultSecretMock.mockResolvedValue({ __kind__: "ok", ok: null });
    updateVaultSecretMock.mockResolvedValue({ __kind__: "ok", ok: null });
    deleteVaultSecretMock.mockResolvedValue({ __kind__: "ok", ok: null });
    revealVaultSecretMock.mockResolvedValue("plaintext-secret-value");
  });

  it("renders the vault page with provider tabs and the active provider panel", async () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: "Cloud Vault" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("vault.provider_tab.aws")).toBeInTheDocument();
    expect(screen.getByTestId("vault.provider_tab.azure")).toBeInTheDocument();
    expect(screen.getByTestId("vault.provider_tab.gcp")).toBeInTheDocument();
    // AWS is the default active provider panel.
    expect(screen.getByTestId("vault.panel.aws")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "AWS Vault" }),
    ).toBeInTheDocument();
  });

  it("switches to the Azure provider panel and lists its secrets", async () => {
    listVaultSecretsMock.mockReturnValue({
      data: [
        {
          provider: "Azure",
          name: "azure-client-secret",
          maskedValue: "••••••••••••",
          createdAt: BigInt(1_700_000_000_000_000_000),
          updatedAt: BigInt(1_700_000_000_000_000_000),
        },
      ],
      isLoading: false,
    });
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByTestId("vault.provider_tab.azure"));
    expect(screen.getByTestId("vault.panel.azure")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Azure Vault" }),
    ).toBeInTheDocument();
    expect(screen.getByText("azure-client-secret")).toBeInTheDocument();
    // The list is scoped to the selected provider.
    expect(listVaultSecretsMock).toHaveBeenCalledWith("Azure");
  });

  it("shows an empty state when no secrets are stored", async () => {
    renderPage();
    expect(screen.getByTestId("vault.empty_state")).toBeInTheDocument();
    expect(screen.getByText("No secrets stored for AWS")).toBeInTheDocument();
  });

  it("lists a stored secret with a masked value that never renders plaintext", async () => {
    listVaultSecretsMock.mockReturnValue({
      data: [awsEntry],
      isLoading: false,
    });
    renderPage();
    expect(screen.getByText("prod-stripe-api-key")).toBeInTheDocument();
    expect(screen.getByTestId("vault.secret_masked")).toBeInTheDocument();
    // The plaintext value is never rendered in the list view.
    expect(
      screen.queryByText("plaintext-secret-value"),
    ).not.toBeInTheDocument();
  });

  it("reveals a secret on demand and shows its plaintext", async () => {
    listVaultSecretsMock.mockReturnValue({
      data: [awsEntry],
      isLoading: false,
    });
    const user = userEvent.setup();
    renderPage();
    await user.click(
      screen.getByRole("button", { name: "Reveal secret prod-stripe-api-key" }),
    );
    expect(revealVaultSecretMock).toHaveBeenCalledWith({
      provider: "AWS",
      name: "prod-stripe-api-key",
    });
    expect(
      await screen.findByText("plaintext-secret-value"),
    ).toBeInTheDocument();
  });

  it("adds a named secret for the active provider and calls saveVaultSecret", async () => {
    listVaultSecretsMock.mockReturnValue({ data: [], isLoading: false });
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByTestId("vault.add_button"));
    await user.type(
      await screen.findByTestId("vault.name_input"),
      "my-api-key",
    );
    await user.type(
      screen.getByTestId("vault.value_input"),
      "super-secret-value",
    );
    await user.click(screen.getByTestId("vault.save_button"));
    expect(saveVaultSecretMock).toHaveBeenCalledWith({
      provider: "AWS",
      name: "my-api-key",
      value: "super-secret-value",
    });
  });

  it("renders audit log entries for vault actions", async () => {
    auditLogMock.mockReturnValue({
      data: [
        {
          id: "audit-1",
          actorId: "aaaaa-aa",
          action: "vault.create",
          details: "AWS / prod-stripe-api-key",
          customer: "",
          timestamp: BigInt(1_700_000_000_000_000_000),
        },
      ],
      isLoading: false,
    });
    renderPage();
    expect(screen.getByText("vault.create")).toBeInTheDocument();
    expect(screen.getByText("AWS / prod-stripe-api-key")).toBeInTheDocument();
  });
});
