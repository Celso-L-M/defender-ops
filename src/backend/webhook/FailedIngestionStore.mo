import List "mo:core/List";
import Types "../types/common";

module {

  public type FailedIngestion = Types.FailedIngestion;
  public type ProviderType    = Types.ProviderType;

  /// Add a failed ingestion record to stable storage.
  public func addFailedIngestion(
    store  : List.List<FailedIngestion>,
    record : FailedIngestion,
  ) : () {
    store.add(record);
  };

  /// Return failed ingestion records, optionally filtered by provider.
  /// Returns the most recent `limit` entries (newest-first since we prepend).
  public func getFailedIngestions(
    store    : List.List<FailedIngestion>,
    provider : ?ProviderType,
    limit    : Nat,
  ) : [FailedIngestion] {
    var arr = store.toArray();
    switch (provider) {
      case null {};
      case (?p) {
        arr := arr.filter(func(fi : FailedIngestion) : Bool {
          switch (fi.provider, p) {
            case (#AWS,   #AWS)   true;
            case (#Azure, #Azure) true;
            case (#GCP,   #GCP)   true;
            case _                false;
          };
        });
      };
    };
    let len = arr.size();
    if (limit == 0 or limit >= len) arr
    else arr.sliceToArray(len - limit, len);
  };

  /// Return total count of failed ingestion records.
  public func getFailedIngestionCount(store : List.List<FailedIngestion>) : Nat {
    store.size();
  };

};
