import Int "mo:core/Int";
import Text "mo:core/Text";
import Types "../types/common";

/// alert-pagination.mo
/// Cursor-pagination helpers for getNormalizedAlerts. The cursor is an opaque
/// text token that encodes the position of the last item on the previous page;
/// it is stable across inserts because it is keyed on the alert's sort key
/// (timestamp + id) rather than on an array offset.
///
/// The newest-first ordering used by getNormalizedAlerts sorts by `timestamp`
/// descending, then by `id` descending as a tie-breaker. A cursor therefore
/// carries the (timestamp, id) of the last item on the previous page, and the
/// next page contains every item that sorts strictly after that position.
module {

  /// Separator between the encoded timestamp and the alert id. The id may
  /// itself contain the separator, so decoding splits on the first occurrence.
  let separator : Text = "|";

  /// Encode a cursor from the last item's sort key (timestamp + id).
  public func encodeCursor(timestamp : Types.Timestamp, id : Text) : Types.Cursor {
    timestamp.toText() # separator # id;
  };

  /// Decode a cursor back to its (timestamp, id) position. Returns null when
  /// the cursor is malformed.
  public func decodeCursor(cursor : Types.Cursor) : ?(Types.Timestamp, Text) {
    let parts = cursor.split(#text separator).toArray();
    if (parts.size() < 2) {
      return null;
    };
    let timestampText = parts[0];
    // Rejoin the remaining segments so an id containing the separator survives.
    let id = parts.sliceToArray(1, parts.size().toInt()).values().join(separator);
    switch (Int.fromText(timestampText)) {
      case null null;
      case (?timestamp) ?(timestamp, id);
    };
  };

  /// Return true when the item sorts strictly after the cursor position in the
  /// newest-first ordering used by getNormalizedAlerts. Items are ordered by
  /// timestamp descending, then id descending; an item is "after" the cursor
  /// when it is older, or the same age with a lexicographically smaller id.
  public func isAfterCursor(
    cursor : (Types.Timestamp, Text),
    timestamp : Types.Timestamp,
    id : Text
  ) : Bool {
    let (cursorTs, cursorId) = cursor;
    if (timestamp < cursorTs) {
      true;
    } else if (timestamp > cursorTs) {
      false;
    } else {
      Text.compare(id, cursorId) == #less;
    };
  };
};
