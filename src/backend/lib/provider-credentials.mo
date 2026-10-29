import Array "mo:core/Array";
import List "mo:core/List";
import Result "mo:core/Result";
import Text "mo:core/Text";
import Types "../types/common";
import DomainTypes "../types/provider-credentials";
import VaultTypes "../types/vault";
import VaultLib "vault";

/// Vault-backed provider credential read/write path.
///
/// Each provider's fixed typed credential is serialised to a canonical text
/// form and stored as that provider's isolated vault secret under
/// `credentialEntryName`. The ingestion/polling pipeline, connection tests,
/// credential health, and remediation playbooks resolve a provider's
/// credentials from that provider's vault entry — never from legacy
/// per-provider credential storage.
module {

  // ── Canonical text encoding ───────────────────────────────────────────────
  // Fields are encoded as `key` US `value` (US = U+001F unit separator) and
  // joined with RS (U+001E record separator). Array values are joined with GS
  // (U+001D group separator). These control characters cannot appear in the
  // structured credential fields, so the encoding is unambiguous and needs no
  // escaping.

  let US = "\u{1f}";
  let RS = "\u{1e}";
  let GS = "\u{1d}";

  func encodeFields(fields : [(Text, Text)]) : Text {
    fields.map(func((k, v)) { k # US # v }).values().join(RS);
  };

  func decodeFields(text : Text) : [(Text, Text)] {
    let out = List.empty<(Text, Text)>();
    for (record in text.split(#text RS)) {
      if (record.size() > 0) {
        let parts = record.split(#text US).toArray();
        if (parts.size() >= 2) {
          out.add((parts[0], parts[1]));
        };
      };
    };
    out.toArray();
  };

  func field(fields : [(Text, Text)], key : Text) : ?Text {
    switch (fields.find(func((k, _)) { Text.equal(k, key) })) {
      case (?(_, v)) ?v;
      case null null;
    };
  };

  func fieldOr(fields : [(Text, Text)], key : Text, default : Text) : Text {
    field(fields, key).get(default);
  };

  func encodeArray(values : [Text]) : Text {
    values.values().join(GS);
  };

  func decodeArray(value : Text) : [Text] {
    if (value.size() == 0) return [];
    value.split(#text GS).toArray();
  };

  // ── Provider / encoding ───────────────────────────────────────────────────

  /// The provider a typed credential payload belongs to.
  public func providerOf(input : DomainTypes.ProviderCredentialInput) : Types.ProviderType {
    switch (input) {
      case (#AWS(_)) #AWS;
      case (#Azure(_)) #Azure;
      case (#GCP(_)) #GCP;
    };
  };

  /// Serialise a typed credential payload for its provider to the canonical
  /// vault text form.
  public func encode(input : DomainTypes.ProviderCredentialInput) : Text {
    switch (input) {
      case (#AWS(c)) {
        encodeFields([
          ("roleArn", c.roleArn),
          ("externalId", c.externalId.get("")),
          ("regions", encodeArray(c.regions)),
        ]);
      };
      case (#Azure(c)) {
        encodeFields([
          ("clientId", c.clientId),
          ("clientSecret", c.clientSecret),
          ("tenantId", c.tenantId),
          ("subscriptionIds", encodeArray(c.subscriptionIds)),
        ]);
      };
      case (#GCP(c)) {
        encodeFields([
          ("serviceAccountJson", c.serviceAccountJson),
          ("projectIds", encodeArray(c.projectIds)),
        ]);
      };
    };
  };

  /// Decode the canonical vault text form back into an AWS typed credential.
  public func decodeAws(text : Text) : DomainTypes.AwsCredentialInput {
    let fields = decodeFields(text);
    let externalId = field(fields, "externalId");
    {
      roleArn = fieldOr(fields, "roleArn", "");
      externalId = switch (externalId) {
        case (?v) { if (v.size() == 0) null else ?v };
        case null null;
      };
      regions = decodeArray(fieldOr(fields, "regions", ""));
    };
  };

  /// Decode the canonical vault text form back into an Azure typed credential.
  public func decodeAzure(text : Text) : DomainTypes.AzureCredentialInput {
    let fields = decodeFields(text);
    {
      clientId = fieldOr(fields, "clientId", "");
      clientSecret = fieldOr(fields, "clientSecret", "");
      tenantId = fieldOr(fields, "tenantId", "");
      subscriptionIds = decodeArray(fieldOr(fields, "subscriptionIds", ""));
    };
  };

  /// Decode the canonical vault text form back into a GCP typed credential.
  public func decodeGcp(text : Text) : DomainTypes.GcpCredentialInput {
    let fields = decodeFields(text);
    {
      serviceAccountJson = fieldOr(fields, "serviceAccountJson", "");
      projectIds = decodeArray(fieldOr(fields, "projectIds", ""));
    };
  };

  // ── Validation ────────────────────────────────────────────────────────────

  func requireNonEmpty(value : Text, name : Text) : ?Text {
    if (value.size() == 0) ?("Missing required field: " # name) else null;
  };

  func requireNonEmptyArray(values : [Text], name : Text) : ?Text {
    if (values.size() == 0) ?("Missing required field: " # name) else null;
  };

  /// Validate a typed credential payload against its provider's fixed schema.
  public func validate(input : DomainTypes.ProviderCredentialInput) : Result.Result<(), DomainTypes.CredentialError> {
    let error : ?Text = switch (input) {
      case (#AWS(c)) {
        switch (requireNonEmpty(c.roleArn, "roleArn")) {
          case (?e) ?e;
          case null { requireNonEmptyArray(c.regions, "regions") };
        };
      };
      case (#Azure(c)) {
        switch (requireNonEmpty(c.clientId, "clientId")) {
          case (?e) ?e;
          case null {
            switch (requireNonEmpty(c.clientSecret, "clientSecret")) {
              case (?e) ?e;
              case null {
                switch (requireNonEmpty(c.tenantId, "tenantId")) {
                  case (?e) ?e;
                  case null { requireNonEmptyArray(c.subscriptionIds, "subscriptionIds") };
                };
              };
            };
          };
        };
      };
      case (#GCP(c)) {
        switch (requireNonEmpty(c.serviceAccountJson, "serviceAccountJson")) {
          case (?e) ?e;
          case null { requireNonEmptyArray(c.projectIds, "projectIds") };
        };
      };
    };
    switch (error) {
      case (?e) #err(#InvalidCredential(e));
      case null #ok(());
    };
  };

  // ── Vault-backed CRUD ─────────────────────────────────────────────────────

  /// Store a provider's typed credential as its isolated vault secret.
  public func saveCredential(
    vaultState : VaultTypes.VaultState,
    input : DomainTypes.ProviderCredentialInput,
    nowNs : Int
  ) : Result.Result<(), DomainTypes.CredentialError> {
    switch (validate(input)) {
      case (#err(e)) { return #err(e) };
      case (#ok(())) {};
    };
    let provider = providerOf(input);
    let result = VaultLib.saveSecret(
      vaultState, provider, DomainTypes.credentialEntryName, encode(input), nowNs
    );
    switch (result) {
      case (#ok(())) #ok(());
      case (#err(#AlreadyExists)) #err(#VaultError("credential already exists"));
      case (#err(#InvalidName)) #err(#VaultError("invalid credential entry name"));
      case (#err(#NotFound)) #err(#NotFound);
      case (#err(#NotAuthorized)) #err(#NotAuthorized);
    };
  };

  /// Overwrite a provider's typed credential in its isolated vault secret.
  public func updateCredential(
    vaultState : VaultTypes.VaultState,
    input : DomainTypes.ProviderCredentialInput,
    nowNs : Int
  ) : Result.Result<(), DomainTypes.CredentialError> {
    switch (validate(input)) {
      case (#err(e)) { return #err(e) };
      case (#ok(())) {};
    };
    let provider = providerOf(input);
    let result = VaultLib.updateSecret(
      vaultState, provider, DomainTypes.credentialEntryName, encode(input), nowNs
    );
    switch (result) {
      case (#ok(())) #ok(());
      case (#err(#NotFound)) #err(#NotFound);
      case (#err(#InvalidName)) #err(#VaultError("invalid credential entry name"));
      case (#err(#AlreadyExists)) #err(#VaultError("credential already exists"));
      case (#err(#NotAuthorized)) #err(#NotAuthorized);
    };
  };

  /// Clear a provider's typed credential from its isolated vault secret.
  public func clearCredential(
    vaultState : VaultTypes.VaultState,
    provider : Types.ProviderType
  ) : Result.Result<(), DomainTypes.CredentialError> {
    let result = VaultLib.deleteSecret(vaultState, provider, DomainTypes.credentialEntryName);
    switch (result) {
      case (#ok(())) #ok(());
      case (#err(#NotFound)) #err(#NotFound);
      case (#err(#InvalidName)) #err(#VaultError("invalid credential entry name"));
      case (#err(#AlreadyExists)) #err(#VaultError("credential already exists"));
      case (#err(#NotAuthorized)) #err(#NotAuthorized);
    };
  };

  // ── Status (masked) ───────────────────────────────────────────────────────

  /// Mask a credential value for display. Short values are fully masked; longer
  /// values reveal only their last four characters.
  func maskValue(value : Text) : Text {
    if (value.size() <= 4) { "••••••••" }
    else {
      let chars = value.toIter().toArray();
      let tail = Text.fromIter(chars.sliceToArray(chars.size() - 4 : Nat, chars.size()).values());
      "••••••••" # tail;
    };
  };

  func fieldView(name : Text, value : Text) : DomainTypes.CredentialFieldView {
    { name; maskedValue = maskValue(value); isSet = value.size() > 0 };
  };

  func arrayFieldView(name : Text, values : [Text]) : DomainTypes.CredentialFieldView {
    {
      name;
      maskedValue = if (values.size() == 0) "" else values.size().toText() # " configured";
      isSet = values.size() > 0;
    };
  };

  /// Read a provider's credential status from its isolated vault entry.
  public func getStatus(
    vaultState : VaultTypes.VaultState,
    provider : Types.ProviderType
  ) : DomainTypes.ProviderCredentialStatus {
    let view = VaultLib.getSecretView(vaultState, provider, DomainTypes.credentialEntryName);
    switch (view) {
      case null {
        { provider; configured = false; fields = []; updatedAt = null };
      };
      case (?entry) {
        let plaintext = switch (VaultLib.revealSecret(vaultState, provider, DomainTypes.credentialEntryName)) {
          case (#ok(t)) t;
          case (#err(_)) "";
        };
        let fields : [DomainTypes.CredentialFieldView] = switch (provider) {
          case (#AWS) {
            let c = decodeAws(plaintext);
            [
              fieldView("roleArn", c.roleArn),
              fieldView("externalId", c.externalId.get("")),
              arrayFieldView("regions", c.regions),
            ];
          };
          case (#Azure) {
            let c = decodeAzure(plaintext);
            [
              fieldView("clientId", c.clientId),
              fieldView("clientSecret", c.clientSecret),
              fieldView("tenantId", c.tenantId),
              arrayFieldView("subscriptionIds", c.subscriptionIds),
            ];
          };
          case (#GCP) {
            let c = decodeGcp(plaintext);
            [
              fieldView("serviceAccountJson", c.serviceAccountJson),
              arrayFieldView("projectIds", c.projectIds),
            ];
          };
        };
        { provider; configured = true; fields; updatedAt = ?entry.updatedAt };
      };
    };
  };

  // ── Resolution for the ingestion pipeline ─────────────────────────────────

  func resolveText(vaultState : VaultTypes.VaultState, provider : Types.ProviderType) : ?Text {
    switch (VaultLib.revealSecret(vaultState, provider, DomainTypes.credentialEntryName)) {
      case (#ok(t)) ?t;
      case (#err(_)) null;
    };
  };

  /// Resolve a provider's typed credential from its isolated vault entry for the
  /// ingestion/polling pipeline. Returns `null` when the provider is
  /// unconfigured, so the pipeline reports unconfigured and does not poll.
  public func resolveAws(vaultState : VaultTypes.VaultState) : ?DomainTypes.AwsCredentialInput {
    switch (resolveText(vaultState, #AWS)) {
      case null null;
      case (?t) ?decodeAws(t);
    };
  };

  /// Resolve an Azure typed credential from its isolated vault entry.
  public func resolveAzure(vaultState : VaultTypes.VaultState) : ?DomainTypes.AzureCredentialInput {
    switch (resolveText(vaultState, #Azure)) {
      case null null;
      case (?t) ?decodeAzure(t);
    };
  };

  /// Resolve a GCP typed credential from its isolated vault entry.
  public func resolveGcp(vaultState : VaultTypes.VaultState) : ?DomainTypes.GcpCredentialInput {
    switch (resolveText(vaultState, #GCP)) {
      case null null;
      case (?t) ?decodeGcp(t);
    };
  };

  /// Whether a provider has a credential entry configured in its vault.
  public func isConfigured(
    vaultState : VaultTypes.VaultState,
    provider : Types.ProviderType
  ) : Bool {
    switch (VaultLib.getSecretView(vaultState, provider, DomainTypes.credentialEntryName)) {
      case (?_) true;
      case null false;
    };
  };
};
