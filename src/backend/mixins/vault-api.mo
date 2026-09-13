import IC "mo:ic";
import Principal "mo:core/Principal";
import Result "mo:core/Result";
import Time "mo:core/Time";
import Types "../types/common";
import DomainTypes "../types/vault";
import VaultLib "../lib/vault";

/// Public API mixin for the centralized per-provider secure vault.
///
/// The vault is the owner's secure credential store: it REPLACES the legacy
/// per-provider credential forms (saveAwsCredentials/saveAzureCredentials/
/// saveGcpCredentials). Every method first runs `requireVaultAccess`, which
/// rejects anonymous callers (`Unauthorized`) and then enforces per-provider
/// access control: the owner (SYS_ADMIN / canister controller) is granted
/// access to every provider's vault regardless of per-provider assignment, so
/// the owner can set up and manage secrets for all providers even before any
/// `assignProviderAccess` has been issued; non-owner users are restricted to
/// only the providers they are assigned to via `requireProviderAccess` (which
/// traps with `Not authorized for provider` when the caller is not assigned to
/// the requested provider). Every mutating action (create, update, delete,
/// reveal) also writes an audit log entry via `addAuditEntry` with the actor,
/// provider, secret name, and action.
///
/// Secrets are encrypted at rest with a SHA-256-based authenticated scheme
/// using a key seeded from `raw_rand` at init; list/overview responses return
/// only masked values, and plaintext is revealed only on an explicit
/// `revealVaultSecret` call.
mixin (
  vaultState : DomainTypes.VaultState,
  requireAuth : (Principal, Text) -> (),
  requireProviderAccess : (Principal, Types.ProviderType, Text) -> (),
  isOwner : (Principal) -> Bool,
  addAuditEntry : (Text, Text, Text, Text) -> ()
) {

  /// Seed the vault encryption key from raw_rand once. Idempotent: no-op when
  /// the key is already set. Called before any mutating vault operation.
  func ensureVaultKey() : async () {
    switch (vaultState.key) {
      case (?_) {};
      case null {
        let rand = await IC.ic.raw_rand();
        vaultState.key := ?rand;
      };
    };
  };

  func providerText(p : Types.ProviderType) : Text {
    switch (p) {
      case (#AWS) "AWS";
      case (#Azure) "Azure";
      case (#GCP) "GCP";
    };
  };

  /// Gate a vault operation on the caller. The owner (canister controller) is
  /// granted access to every provider's vault regardless of per-provider
  /// assignment; non-owner users must be assigned to the requested provider via
  /// `requireProviderAccess` (which itself rejects anonymous callers and traps
  /// with `Not authorized for provider` when the caller is not assigned).
  func requireVaultAccess(caller : Principal, provider : Types.ProviderType, fnName : Text) {
    if (isOwner(caller)) {
      requireAuth(caller, fnName);
    } else {
      requireProviderAccess(caller, provider, fnName);
    };
  };

  /// Store a new named secret for a provider. Encrypted at rest; the value is
  /// never returned. Composes requireAuth and writes an audit entry.
  public shared ({ caller }) func saveVaultSecret(
    provider : Types.ProviderType,
    name : DomainTypes.VaultSecretName,
    value : Text
  ) : async Result.Result<(), DomainTypes.VaultError> {
    requireVaultAccess(caller, provider, "saveVaultSecret");
    await ensureVaultKey();
    let result = VaultLib.saveSecret(vaultState, provider, name, value, Time.now());
    switch (result) {
      case (#ok(())) {
        addAuditEntry(caller.toText(), "VaultSecretCreated", "Vault secret created for provider " # providerText(provider) # " name " # name, "");
      };
      case (#err(_)) {};
    };
    result;
  };

  /// Update an existing named secret for a provider. Composes
  /// requireAuth and writes an audit entry.
  public shared ({ caller }) func updateVaultSecret(
    provider : Types.ProviderType,
    name : DomainTypes.VaultSecretName,
    value : Text
  ) : async Result.Result<(), DomainTypes.VaultError> {
    requireVaultAccess(caller, provider, "updateVaultSecret");
    await ensureVaultKey();
    let result = VaultLib.updateSecret(vaultState, provider, name, value, Time.now());
    switch (result) {
      case (#ok(())) {
        addAuditEntry(caller.toText(), "VaultSecretUpdated", "Vault secret updated for provider " # providerText(provider) # " name " # name, "");
      };
      case (#err(_)) {};
    };
    result;
  };

  /// Delete a named secret for a provider. Composes requireAuth and
  /// writes an audit entry.
  public shared ({ caller }) func deleteVaultSecret(
    provider : Types.ProviderType,
    name : DomainTypes.VaultSecretName
  ) : async Result.Result<(), DomainTypes.VaultError> {
    requireVaultAccess(caller, provider, "deleteVaultSecret");
    let result = VaultLib.deleteSecret(vaultState, provider, name);
    switch (result) {
      case (#ok(())) {
        addAuditEntry(caller.toText(), "VaultSecretDeleted", "Vault secret deleted for provider " # providerText(provider) # " name " # name, "");
      };
      case (#err(_)) {};
    };
    result;
  };

  /// List all vault entries for a provider as masked views (never plaintext).
  /// Composes requireAuth.
  public shared query ({ caller }) func listVaultSecrets(
    provider : Types.ProviderType
  ) : async [DomainTypes.VaultEntryView] {
    requireVaultAccess(caller, provider, "listVaultSecrets");
    VaultLib.listSecrets(vaultState, provider);
  };

  /// Reveal/decrypt a single secret value on demand. Composes
  /// requireAuth and writes an audit entry recording the reveal.
  public shared ({ caller }) func revealVaultSecret(
    provider : Types.ProviderType,
    name : DomainTypes.VaultSecretName
  ) : async Result.Result<Text, DomainTypes.VaultError> {
    requireVaultAccess(caller, provider, "revealVaultSecret");
    let result = VaultLib.revealSecret(vaultState, provider, name);
    switch (result) {
      case (#ok(_)) {
        addAuditEntry(caller.toText(), "VaultSecretRevealed", "Vault secret revealed for provider " # providerText(provider) # " name " # name, "");
      };
      case (#err(_)) {};
    };
    result;
  };
};
