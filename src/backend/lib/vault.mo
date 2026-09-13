import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Result "mo:core/Result";
import Runtime "mo:core/Runtime";
import Sha256 "mo:sha2/Sha256";
import Text "mo:core/Text";
import Types "../types/common";
import DomainTypes "../types/vault";

module {

  /// Fixed-length mask shown in place of a secret value in list/overview views.
  /// The plaintext is never exposed in these responses.
  let mask = "••••••••";

  /// A secret name is valid when non-empty and at most 256 characters.
  func isValidName(name : DomainTypes.VaultSecretName) : Bool {
    name.size() > 0 and name.size() <= 256
  };

  /// Ordering for the (ProviderType, name) map key. ProviderType is a closed
  /// variant with no module of its own, so the comparator is supplied
  /// explicitly to every Map operation.
  func compareProvider(a : Types.ProviderType, b : Types.ProviderType) : Order.Order {
    switch (a, b) {
      case (#AWS, #AWS) #equal;
      case (#AWS, _) #less;
      case (#Azure, #AWS) #greater;
      case (#Azure, #Azure) #equal;
      case (#Azure, #GCP) #less;
      case (#GCP, #GCP) #equal;
      case (#GCP, _) #greater;
    };
  };

  func compareKey(
    a : (Types.ProviderType, DomainTypes.VaultSecretName),
    b : (Types.ProviderType, DomainTypes.VaultSecretName)
  ) : Order.Order {
    switch (compareProvider(a.0, b.0)) {
      case (#equal) Text.compare(a.1, b.1);
      case c c;
    };
  };

  /// 4-byte big-endian counter used to derive successive keystream blocks.
  func counterBytes(i : Nat) : [Nat8] {
    let n = i % 4294967296;
    [
      (n / 16777216).toNat8(),
      ((n / 65536) % 256).toNat8(),
      ((n / 256) % 256).toNat8(),
      (n % 256).toNat8(),
    ];
  };

  func concatBytes(a : [Nat8], b : [Nat8]) : [Nat8] {
    let n = a.size() + b.size();
    Array.tabulate(n, func i =
      if (i < a.size()) a[i] else b[i - a.size()]
    );
  };

  /// Deterministic per-(provider, name) nonce: SHA256(key ‖ provider ‖ name).
  func makeNonce(key : [Nat8], provider : Types.ProviderType, name : Text) : [Nat8] {
    let providerText = switch (provider) {
      case (#AWS) "AWS";
      case (#Azure) "Azure";
      case (#GCP) "GCP";
    };
    let input = concatBytes(
      concatBytes(key, providerText.encodeUtf8().toArray()),
      name.encodeUtf8().toArray()
    );
    Sha256.fromBlob(#sha256, input.toBlob()).toArray();
  };

  /// Generate `len` keystream bytes as SHA256(key ‖ nonce ‖ counter) blocks.
  func keystream(key : [Nat8], nonce : [Nat8], len : Nat) : [Nat8] {
    let out = Array.repeat<Nat8>(0, len).toVarArray();
    var offset = 0;
    var block = 0;
    while (offset < len) {
      let blockBytes = Sha256.fromBlob(
        #sha256,
        concatBytes(concatBytes(key, nonce), counterBytes(block)).toBlob()
      ).toArray();
      var j = 0;
      while (j < 32 and offset < len) {
        out[offset] := blockBytes[j];
        offset += 1;
        j += 1;
      };
      block += 1;
    };
    Array.fromVarArray(out);
  };

  func xorBytes(a : [Nat8], b : [Nat8]) : [Nat8] {
    Array.tabulate(a.size(), func i = a[i] ^ b[i]);
  };

  /// Encrypt plaintext into (ciphertext, nonce). ciphertext = tag ‖ encrypted,
  /// where tag = SHA256(key ‖ nonce ‖ plaintext) and encrypted = plaintext XOR
  /// keystream. The nonce is stored alongside so decryption can regenerate the
  /// keystream and verify the tag.
  func encrypt(
    key : [Nat8],
    provider : Types.ProviderType,
    name : Text,
    plaintext : Text
  ) : (Blob, Blob) {
    let nonce = makeNonce(key, provider, name);
    let data = plaintext.encodeUtf8().toArray();
    let tag = Sha256.fromBlob(#sha256, concatBytes(concatBytes(key, nonce), data).toBlob()).toArray();
    let stream = keystream(key, nonce, data.size());
    let encrypted = xorBytes(data, stream);
    (concatBytes(tag, encrypted).toBlob(), nonce.toBlob());
  };

  /// Decrypt a stored (ciphertext, nonce) back to plaintext, verifying the
  /// integrity tag. Traps when the tag does not match (tampered or corrupted)
  /// or the recovered bytes are not valid UTF-8.
  func decrypt(
    key : [Nat8],
    ciphertext : Blob,
    nonce : Blob
  ) : Text {
    let ct = ciphertext.toArray();
    let nonceArr = nonce.toArray();
    if (ct.size() < 32) {
      Runtime.trap("Vault: malformed ciphertext");
    };
    let tag = Array.tabulate(32, func i = ct[i]);
    let encrypted = ct.sliceToArray(32, ct.size().toInt());
    let stream = keystream(key, nonceArr, encrypted.size());
    let data = xorBytes(encrypted, stream);
    let expectedTag = Sha256.fromBlob(#sha256, concatBytes(concatBytes(key, nonceArr), data).toBlob()).toArray();
    var ok = true;
    for (i in tag.keys()) {
      if (tag[i] != expectedTag[i]) { ok := false };
    };
    if (not ok) {
      Runtime.trap("Vault: decryption integrity check failed");
    };
    switch (data.toBlob().decodeUtf8()) {
      case (?t) t;
      case null Runtime.trap("Vault: decrypted value is not valid UTF-8");
    };
  };

  /// Encrypt and store a new named secret for a provider. Returns
  /// `#AlreadyExists` when a secret with the same name already exists for the
  /// provider, and `#InvalidName` when the name is empty or too long.
  public func saveSecret(
    state : DomainTypes.VaultState,
    provider : Types.ProviderType,
    name : DomainTypes.VaultSecretName,
    plaintext : Text,
    nowNs : Int
  ) : Result.Result<(), DomainTypes.VaultError> {
    if (not isValidName(name)) { return #err(#InvalidName) };
    let key = state.key ?? Runtime.trap("Vault key not initialized");
    let keyArr = key.toArray();
    let keyTuple = (provider, name);
    switch (state.entries.get(compareKey, keyTuple)) {
      case (?_) { #err(#AlreadyExists) };
      case null {
        let (ciphertext, nonce) = encrypt(keyArr, provider, name, plaintext);
        state.entries.add(compareKey, keyTuple, {
          provider;
          name;
          ciphertext;
          nonce;
          createdAt = nowNs;
          updatedAt = nowNs;
        });
        #ok(());
      };
    };
  };

  /// Re-encrypt and update an existing named secret for a provider. Returns
  /// `#NotFound` when no such secret exists, and `#InvalidName` when the name
  /// is empty or too long.
  public func updateSecret(
    state : DomainTypes.VaultState,
    provider : Types.ProviderType,
    name : DomainTypes.VaultSecretName,
    plaintext : Text,
    nowNs : Int
  ) : Result.Result<(), DomainTypes.VaultError> {
    if (not isValidName(name)) { return #err(#InvalidName) };
    let key = state.key ?? Runtime.trap("Vault key not initialized");
    let keyArr = key.toArray();
    let keyTuple = (provider, name);
    switch (state.entries.get(compareKey, keyTuple)) {
      case null { #err(#NotFound) };
      case (?entry) {
        let (ciphertext, nonce) = encrypt(keyArr, provider, name, plaintext);
        state.entries.add(compareKey, keyTuple, {
          provider;
          name;
          ciphertext;
          nonce;
          createdAt = entry.createdAt;
          updatedAt = nowNs;
        });
        #ok(());
      };
    };
  };

  /// Delete a named secret for a provider. Returns `#NotFound` when no such
  /// secret exists.
  public func deleteSecret(
    state : DomainTypes.VaultState,
    provider : Types.ProviderType,
    name : DomainTypes.VaultSecretName
  ) : Result.Result<(), DomainTypes.VaultError> {
    let keyTuple = (provider, name);
    switch (state.entries.get(compareKey, keyTuple)) {
      case null { #err(#NotFound) };
      case (?_) {
        state.entries.remove(compareKey, keyTuple);
        #ok(());
      };
    };
  };

  /// List all vault entries for a provider as masked views (never plaintext).
  public func listSecrets(
    state : DomainTypes.VaultState,
    provider : Types.ProviderType
  ) : [DomainTypes.VaultEntryView] {
    let views = List.empty<DomainTypes.VaultEntryView>();
    for ((k, entry) in state.entries.entries()) {
      if (k.0 == provider) {
        views.add({
          provider = entry.provider;
          name = entry.name;
          maskedValue = mask;
          createdAt = entry.createdAt;
          updatedAt = entry.updatedAt;
        });
      };
    };
    views.toArray();
  };

  /// Decrypt and return a single secret value on demand. Returns `#NotFound`
  /// when no such secret exists.
  public func revealSecret(
    state : DomainTypes.VaultState,
    provider : Types.ProviderType,
    name : DomainTypes.VaultSecretName
  ) : Result.Result<Text, DomainTypes.VaultError> {
    let key = state.key ?? Runtime.trap("Vault key not initialized");
    let keyArr = key.toArray();
    let keyTuple = (provider, name);
    switch (state.entries.get(compareKey, keyTuple)) {
      case null { #err(#NotFound) };
      case (?entry) {
        #ok(decrypt(keyArr, entry.ciphertext, entry.nonce));
      };
    };
  };

  /// Return a single masked view of a vault entry (never plaintext).
  public func getSecretView(
    state : DomainTypes.VaultState,
    provider : Types.ProviderType,
    name : DomainTypes.VaultSecretName
  ) : ?DomainTypes.VaultEntryView {
    let keyTuple = (provider, name);
    switch (state.entries.get(compareKey, keyTuple)) {
      case null null;
      case (?entry) ?{
        provider = entry.provider;
        name = entry.name;
        maskedValue = mask;
        createdAt = entry.createdAt;
        updatedAt = entry.updatedAt;
      };
    };
  };
};
