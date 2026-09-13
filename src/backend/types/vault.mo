import Map "mo:core/Map";
import Types "../types/common";

module {

  /// The name of a secret within a provider's vault. Arbitrary and user-defined
  /// (e.g. "abuseipdb-key", "service-account-json", "webhook-token"). Names are
  /// unique per provider.
  public type VaultSecretName = Text;

  /// Internal vault entry stored encrypted at rest. The plaintext secret value
  /// is never stored — only the AES-GCM ciphertext and nonce. `updatedAt` is
  /// the last-write timestamp (nanoseconds since the Unix epoch).
  public type VaultEntry = {
    provider : Types.ProviderType;
    name : VaultSecretName;
    ciphertext : Blob;
    nonce : Blob;
    createdAt : Int;
    updatedAt : Int;
  };

  /// Public view of a vault entry. The value is always masked — never plaintext.
  /// `maskedValue` is a fixed-length mask (e.g. "••••••••") so the secret is
  /// never exposed in list/overview responses.
  public type VaultEntryView = {
    provider : Types.ProviderType;
    name : VaultSecretName;
    maskedValue : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  /// Error returned by vault operations.
  public type VaultError = {
    #NotAuthorized;
    #NotFound;
    #AlreadyExists;
    #InvalidName;
  };

  /// Stable state shared between the vault mixin and lib. `entries` maps each
  /// (provider, name) pair to its encrypted entry. `key` is the AES-256
  /// encryption key seeded from `raw_rand` at canister init; it is held in
  /// memory and used to encrypt/decrypt secret values at rest.
  public type VaultState = {
    var entries : Map.Map<(Types.ProviderType, VaultSecretName), VaultEntry>;
    var key : ?Blob;
  };
};
