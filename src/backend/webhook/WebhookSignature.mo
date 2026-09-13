import Sha256 "mo:sha2/Sha256";
import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Text "mo:core/Text";
import Nat8 "mo:core/Nat8";

/// Webhook signature verification primitives.
///
/// Provides HMAC-SHA256 (built on the trusted `sha2` package), hex encoding,
/// constant-time string comparison, and HTTP header lookup used by the
/// inbound webhook endpoints to authenticate payloads before parsing.
module {

  /// Compute HMAC-SHA256 over `msg` using `key`.
  /// HMAC(K, m) = SHA256((K' XOR opad) || SHA256((K' XOR ipad) || m))
  /// where K' is the key padded (or hashed) to the 64-byte SHA-256 block size.
  public func hmacSha256(key : Blob, msg : Blob) : Blob {
    let blockSize = 64;
    var keyArr = key.toArray();
    if (keyArr.size() > blockSize) {
      keyArr := Sha256.fromBlob(#sha256, key).toArray();
    };
    // Pad the key with zero bytes to the block size.
    let paddedKey = Array.tabulate(blockSize, func i =
      if (i < keyArr.size()) keyArr[i] else 0 : Nat8
    );
    let innerKey = Array.tabulate(blockSize, func i = paddedKey[i] ^ 0x36);
    let outerKey = Array.tabulate(blockSize, func i = paddedKey[i] ^ 0x5c);
    let innerMsg = [innerKey, msg.toArray()].flatten();
    let innerHash = Sha256.fromBlob(#sha256, innerMsg.toBlob());
    let outerMsg = [outerKey, innerHash.toArray()].flatten();
    Sha256.fromBlob(#sha256, outerMsg.toBlob());
  };

  /// Hex-encode a blob as lowercase text.
  public func toHex(blob : Blob) : Text {
    let hexChars = Text.toArray("0123456789abcdef");
    var out = "";
    for (b in blob.toArray().values()) {
      out := out # hexChars[(b / 16).toNat()].toText() # hexChars[(b % 16).toNat()].toText();
    };
    out;
  };

  /// Constant-time equality for two text values.
  /// Iterates over every byte without short-circuiting on the first mismatch,
  /// so the comparison time does not reveal how many leading bytes match.
  public func constantTimeEqual(a : Text, b : Text) : Bool {
    let aArr = a.encodeUtf8().toArray();
    let bArr = b.encodeUtf8().toArray();
    if (aArr.size() != bArr.size()) return false;
    var acc = 0;
    for (i in aArr.keys()) {
      acc := acc + (if (aArr[i] == bArr[i]) 0 else 1);
    };
    acc == 0;
  };

  /// Find a header value by name (case-insensitive).
  public func findHeader(headers : [(Text, Text)], name : Text) : ?Text {
    let lower = name.toLower();
    var found : ?Text = null;
    for ((h, v) in headers.values()) {
      if (h.toLower() == lower) { found := ?v };
    };
    found;
  };

  /// Extract the bearer token from an `Authorization` header value.
  /// Returns the text after the `"Bearer "` prefix, or "" when absent.
  public func bearerToken(auth : Text) : Text {
    let parts = auth.split(#text "Bearer ");
    var idx = 0;
    var token = "";
    for (p in parts) {
      if (idx == 1) { token := p };
      idx += 1;
    };
    token;
  };

};
