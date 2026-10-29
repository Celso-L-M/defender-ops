import Types "../types/common";

/// Vault-backed provider credential domain types.
///
/// Each cloud provider has a FIXED typed credential schema. The typed fields
/// are stored as that provider's isolated vault secrets (one named vault entry
/// per provider, keyed by the provider's credential entry name), so the vault
/// remains the single source of truth for every credential. The legacy
/// per-provider credential stable vars (awsCredentials / azureCredentials /
/// gcpCredentials) are removed by the migration that accompanies this domain.
module {

  /// The vault secret name under which a provider's typed credential is stored.
  /// One credential entry per provider, isolated by the vault's (provider, name)
  /// key so no provider can read another provider's credential.
  public let credentialEntryName = "provider-credential";

  /// AWS typed credential schema (Role ARN-based, least-privilege).
  public type AwsCredentialInput = {
    roleArn : Text;
    externalId : ?Text;
    regions : [Text];
  };

  /// Azure typed credential schema.
  public type AzureCredentialInput = {
    clientId : Text;
    clientSecret : Text;
    tenantId : Text;
    subscriptionIds : [Text];
  };

  /// GCP typed credential schema.
  public type GcpCredentialInput = {
    serviceAccountJson : Text;
    projectIds : [Text];
  };

  /// A typed credential payload for a specific provider. The variant tag selects
  /// which provider's fixed schema the payload must satisfy.
  public type ProviderCredentialInput = {
    #AWS : AwsCredentialInput;
    #Azure : AzureCredentialInput;
    #GCP : GcpCredentialInput;
  };

  /// A single masked credential field shown in status/overview responses. The
  /// value is always masked — never plaintext.
  public type CredentialFieldView = {
    name : Text;
    maskedValue : Text;
    isSet : Bool;
  };

  /// Public status of a provider's typed credential. `configured` is false when
  /// the provider's vault has no credential entry; in that state the pipeline
  /// reports unconfigured and does not attempt to poll or connect. When
  /// configured, `fields` carries the masked structured fields only.
  public type ProviderCredentialStatus = {
    provider : Types.ProviderType;
    configured : Bool;
    fields : [CredentialFieldView];
    updatedAt : ?Int;
  };

  /// Error returned by provider credential operations.
  public type CredentialError = {
    #NotAuthorized;
    #NotFound;
    #InvalidCredential : Text;
    #VaultError : Text;
  };
};
