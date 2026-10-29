import OutCall "mo:caffeineai-http-outcalls/outcall";
import Text "mo:core/Text";

/// TeamsWebhook.mo
/// Microsoft Teams webhook delivery for alert notifications. The message is
/// posted as a non-replicated outcall (`is_replicated = ?false` inside the
/// http-outcalls package) so a single message is sent once, not once per
/// replica. The actor's `transform` query callback is injected by the
/// composition root; this module never declares a shared or query function.
module {

  /// Maximum response bytes accepted from the Teams endpoint.
  public let maxResponseBytes : Nat64 = 16_384;

  /// Validate a Microsoft Teams webhook URL. Returns null when the URL is a
  /// well-formed https endpoint, or a human-readable reason when it is not.
  public func validateUrl(url : Text) : ?Text {
    let trimmed = url.trim(#predicate(func(c) { c == ' ' or c == '\t' or c == '\n' or c == '\r' }));
    if (trimmed.size() == 0) {
      return ?"Webhook URL is required";
    };
    if (trimmed.size() > 2048) {
      return ?"Webhook URL exceeds maximum length";
    };
    if (not trimmed.startsWith(#text "https://")) {
      return ?"Webhook URL must use https";
    };
    // Reject whitespace inside the URL.
    if (trimmed.contains(#text " ") or trimmed.contains(#text "\n") or trimmed.contains(#text "\t")) {
      return ?"Webhook URL must not contain whitespace";
    };
    null;
  };

  /// Build the Teams MessageCard JSON body for an alert notification.
  public func buildPayload(
    title : Text,
    text : Text,
    severity : Text,
    alertId : Text
  ) : Text {
    "{" #
    "\"@type\":\"MessageCard\"," #
    "\"@context\":\"http://schema.org/extensions\"," #
    "\"themeColor\":\"" # themeColor(severity) # "\"," #
    "\"summary\":\"" # escape(title) # "\"," #
    "\"title\":\"" # escape(title) # "\"," #
    "\"text\":\"" # escape(text) # "\"," #
    "\"sections\":[{\"facts\":[" #
    "{\"name\":\"Severity\",\"value\":\"" # escape(severity) # "\"}," #
    "{\"name\":\"Alert\",\"value\":\"" # escape(alertId) # "\"}" #
    "]}]" #
    "}";
  };

  /// Escape a text value for safe embedding inside a JSON string literal.
  func escape(value : Text) : Text {
    var out = "";
    for (c in value.toIter()) {
      let ch = Text.fromChar(c);
      if (ch == "\"") { out := out # "\\\"" }
      else if (ch == "\\") { out := out # "\\\\" }
      else if (ch == "\n") { out := out # "\\n" }
      else if (ch == "\r") { out := out # "\\r" }
      else if (ch == "\t") { out := out # "\\t" }
      else { out := out # ch };
    };
    out;
  };

  /// Map a severity label to a Teams card accent colour.
  func themeColor(severity : Text) : Text {
    switch (severity) {
      case "Critical" "D13438";
      case "High" "FF8C00";
      case "Medium" "FFB900";
      case "Low" "0078D4";
      case _ "808080";
    };
  };

  /// Post a message to the given Teams webhook URL. Returns true when the
  /// endpoint answered with a 2xx status. The `transform` callback is the
  /// actor's query method, injected by the composition root.
  public func send(
    webhookUrl : Text,
    payload : Text,
    transform : OutCall.Transform
  ) : async Bool {
    let response = await OutCall.httpRequest({
      url = webhookUrl;
      method = #post;
      headers = [{ name = "Content-Type"; value = "application/json" }];
      body = ?(payload.encodeUtf8());
      maxResponseBytes;
      transform;
    });
    response.status >= 200 and response.status < 300;
  };
};
