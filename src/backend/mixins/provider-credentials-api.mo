import Principal "mo:core/Principal";
import Result "mo:core/Result";
import Time "mo:core/Time";
import Types "../types/common";
import DomainTypes "../types/provider-credentials";
import VaultTypes "../types/vault";
import ProviderCredentials "../lib/provider-credentials";
import AwsIngestion "../aws/AwsIngestion";
import Azure "../azure/AzureIngestion";
import GcpIngestion "../gcp/GcpIngestion";
import OutCall "mo:caffeineai-http-outcalls/outcall";

/// Public API mixin for vault-backed provider credentials.
///
/// Each provider has a fixed typed credential schema stored as that provider's
/// isolated vault secret. Every method first runs `requireVaultAccess`, which
/// rejects anonymous callers (`Unauthorized`) and then enforces per-provider
/// access control: the owner (canister controller) is granted access to every
/// provider's credential regardless of per-provider assignment; non-owner users
/// are restricted to the providers they are assigned to via
/// `requireProviderAccess` (which traps with `Not authorized for provider`).
/// Every mutating action writes an audit log entry.
///
/// Status responses return only masked structured fields — never plaintext.
mixin (
  vaultState : VaultTypes.VaultState,
  requireAuth : (Principal, Text) -> (),
  requireProviderAccess : (Principal, Types.ProviderType, Text) -> (),
  isOwner : (Principal) -> Bool,
  addAuditEntry : (Text, Text, Text, Text) -> (),
  transform : OutCall.Transform
) {

  func credentialProviderText(p : Types.ProviderType) : Text {
    switch (p) {
      case (#AWS) "AWS";
      case (#Azure) "Azure";
      case (#GCP) "GCP";
    };
  };

  /// Gate a credential operation on the caller. The owner (canister controller)
  /// is granted access to every provider's credential regardless of
  /// per-provider assignment; non-owner users must be assigned to the requested
  /// provider via `requireProviderAccess`.
  func requireCredentialAccess(caller : Principal, provider : Types.ProviderType, fnName : Text) {
    if (isOwner(caller)) {
      requireAuth(caller, fnName);
    } else {
      requireProviderAccess(caller, provider, fnName);
    };
  };

  /// Read a provider's typed credential status (configured/not configured and
  /// masked structured fields only). Never returns plaintext.
  public shared query ({ caller }) func getProviderCredentialStatus(
    provider : Types.ProviderType
  ) : async DomainTypes.ProviderCredentialStatus {
    requireCredentialAccess(caller, provider, "getProviderCredentialStatus");
    ProviderCredentials.getStatus(vaultState, provider);
  };

  /// Store a provider's typed credential as its isolated vault secret. Returns
  /// `#InvalidCredential` when a required field is missing, and
  /// `#VaultError("credential already exists")` when one is already stored.
  public shared ({ caller }) func saveProviderCredential(
    input : DomainTypes.ProviderCredentialInput
  ) : async Result.Result<(), DomainTypes.CredentialError> {
    let provider = ProviderCredentials.providerOf(input);
    requireCredentialAccess(caller, provider, "saveProviderCredential");
    let result = ProviderCredentials.saveCredential(vaultState, input, Time.now());
    switch (result) {
      case (#ok(())) {
        addAuditEntry(caller.toText(), "ProviderCredentialCreated",
          "Provider credential created for " # credentialProviderText(provider), "");
      };
      case (#err(_)) {};
    };
    result;
  };

  /// Overwrite a provider's typed credential in its isolated vault secret.
  /// Returns `#NotFound` when no credential is stored yet.
  public shared ({ caller }) func updateProviderCredential(
    input : DomainTypes.ProviderCredentialInput
  ) : async Result.Result<(), DomainTypes.CredentialError> {
    let provider = ProviderCredentials.providerOf(input);
    requireCredentialAccess(caller, provider, "updateProviderCredential");
    let result = ProviderCredentials.updateCredential(vaultState, input, Time.now());
    switch (result) {
      case (#ok(())) {
        addAuditEntry(caller.toText(), "ProviderCredentialUpdated",
          "Provider credential updated for " # credentialProviderText(provider), "");
      };
      case (#err(_)) {};
    };
    result;
  };

  /// Clear a provider's typed credential from its isolated vault secret.
  /// Returns `#NotFound` when no credential is stored.
  public shared ({ caller }) func clearProviderCredential(
    provider : Types.ProviderType
  ) : async Result.Result<(), DomainTypes.CredentialError> {
    requireCredentialAccess(caller, provider, "clearProviderCredential");
    let result = ProviderCredentials.clearCredential(vaultState, provider);
    switch (result) {
      case (#ok(())) {
        addAuditEntry(caller.toText(), "ProviderCredentialCleared",
          "Provider credential cleared for " # credentialProviderText(provider), "");
      };
      case (#err(_)) {};
    };
    result;
  };

  /// Test a provider's stored credential against the live API. Resolves the
  /// credential from the provider's isolated vault entry; when the provider is
  /// unconfigured it returns a failure without attempting a connection.
  public shared ({ caller }) func testProviderConnection(
    provider : Types.ProviderType
  ) : async Types.ConnectionTestResult {
    requireCredentialAccess(caller, provider, "testProviderConnection");
    switch (provider) {
      case (#AWS) {
        switch (ProviderCredentials.resolveAws(vaultState)) {
          case null { #Failure("No AWS credential configured") };
          case (?c) {
            let creds : Types.AwsCredentials = {
              roleArn = c.roleArn;
              externalId = c.externalId;
              regions = c.regions;
            };
            await AwsIngestion.testConnection(creds, transform);
          };
        };
      };
      case (#Azure) {
        switch (ProviderCredentials.resolveAzure(vaultState)) {
          case null { #Failure("No Azure credential configured") };
          case (?c) {
            let creds : Types.AzureCredentials = {
              clientId = c.clientId;
              clientSecret = c.clientSecret;
              tenantId = c.tenantId;
              subscriptionIds = c.subscriptionIds;
            };
            await Azure.testConnection(creds, transform);
          };
        };
      };
      case (#GCP) {
        switch (ProviderCredentials.resolveGcp(vaultState)) {
          case null { #Failure("No GCP credential configured") };
          case (?c) {
            let creds : Types.GcpCredentials = {
              serviceAccountJson = c.serviceAccountJson;
              projectIds = c.projectIds;
            };
            await GcpIngestion.testConnection(creds, transform);
          };
        };
      };
    };
  };
};
