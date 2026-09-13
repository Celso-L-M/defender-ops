import Option "mo:core/Option";
import Array  "mo:core/Array";
import Int    "mo:core/Int";
import Types  "../types/common";

module {

  public type NormalizedAlert = Types.NormalizedAlert;
  public type Asset           = Types.Asset;

  // ── Private helpers ───────────────────────────────────────────────────────

  /// Map a single Severity to its integer weight.
  func severityToScore(s : Types.Severity) : Nat {
    switch s {
      case (#Critical) 4;
      case (#High)     3;
      case (#Medium)   2;
      case (#Low)      1;
      case (#Unknown)  0;
    };
  };

  /// Infer an AssetType from a provider-native type string.
  func inferAssetType(typeStr : Text, provider : Types.ProviderType) : Types.AssetType {
    let t = typeStr.toLower();
    switch provider {
      case (#AWS) {
        if (t.contains(#text "ec2") or t.contains(#text "instance"))  #EC2
        else if (t.contains(#text "s3") or t.contains(#text "bucket")) #S3
        else if (t.contains(#text "rds") or t.contains(#text "database") or t.contains(#text "aurora")) #RDS
        else if (t.contains(#text "lambda") or t.contains(#text "function")) #Lambda
        else #Other;
      };
      case (#Azure) {
        if (t.contains(#text "virtualmachine") or t.contains(#text "vm")) #AzureVM
        else if (t.contains(#text "storage")) #AzureStorage
        else if (t.contains(#text "sql") or t.contains(#text "database")) #AzureDatabase
        else #Other;
      };
      case (#GCP) {
        if (t.contains(#text "compute") or t.contains(#text "gce")) #GCPCompute
        else if (t.contains(#text "sql")) #GCPCloudSQL
        else if (t.contains(#text "storage")) #GCPStorage
        else #Other;
      };
    };
  };

  // ── Public API ────────────────────────────────────────────────────────────

  /// Parse assetId / assetType / accountId / region / provider from a
  /// normalized alert into one or more Asset records.
  public func extractAssetsFromFinding(alert : NormalizedAlert) : [Asset] {
    switch (alert.assetId) {
      case null { [] };
      case (?aid) {
        let asset : Asset = {
          id          = aid;
          name        = alert.assetId.get("");
          assetType   = inferAssetType(alert.assetType.get(""), alert.provider);
          provider    = alert.provider;
          accountId   = alert.accountId.get("");
          region      = alert.region.get("");
          tags        = [];
          riskScore   = severityToScore(alert.severity);
          openFindings = 1;
          lastSeen    = alert.timestamp;
          customer    = alert.customer;
        };
        [asset];
      };
    };
  };

  /// Deduplicate an incoming Asset against an existing (assetId → Asset) list.
  /// If the asset already exists, update lastSeen / riskScore / openFindings;
  /// otherwise add it as new.  Returns (isNew, assetToStore).
  public func deduplicateAsset(
    assets   : [(Text, Asset)],
    newAsset : Asset,
  ) : (Bool, Asset) {
    let existing = assets.find(func((id, _)) { id == newAsset.id });
    switch existing {
      case null { (true, newAsset) };
      case (?(_, existingAsset)) {
        let lastSeen = if (Int.greater(newAsset.lastSeen, existingAsset.lastSeen)) {
          newAsset.lastSeen;
        } else {
          existingAsset.lastSeen;
        };
        let updated : Asset = {
          id           = existingAsset.id;
          name         = existingAsset.name;
          assetType    = existingAsset.assetType;
          provider     = existingAsset.provider;
          accountId    = existingAsset.accountId;
          region       = existingAsset.region;
          tags         = existingAsset.tags;
          customer     = existingAsset.customer;
          lastSeen;
          riskScore    = existingAsset.riskScore + newAsset.riskScore;
          openFindings = existingAsset.openFindings + newAsset.openFindings;
        };
        (false, updated);
      };
    };
  };

  /// Risk score = Critical×4 + High×3 + Medium×2 + Low×1
  public func calculateRiskScore(
    criticalCount : Nat,
    highCount     : Nat,
    mediumCount   : Nat,
    lowCount      : Nat,
  ) : Nat {
    criticalCount * 4 + highCount * 3 + mediumCount * 2 + lowCount * 1;
  };

  /// Recalculate riskScore and openFindings for every asset based on the
  /// current set of open normalized alerts.
  public func recalcAllAssetScores(
    assets : [(Text, Asset)],
    alerts : [(Text, NormalizedAlert)],
  ) : [(Text, Asset)] {
    assets.map(
      func((assetId, asset)) {
        // Collect open/in-progress alerts targeting this asset
        let openAlerts = alerts.filter(
          func((_, a)) {
            a.assetId == ?assetId and
            (a.status == #Open or a.status == #InProgress)
          }
        );
        var criticalCount = 0;
        var highCount     = 0;
        var mediumCount   = 0;
        var lowCount      = 0;
        for ((_, a) in openAlerts.vals()) {
          switch (a.severity) {
            case (#Critical) { criticalCount += 1 };
            case (#High)     { highCount     += 1 };
            case (#Medium)   { mediumCount   += 1 };
            case (#Low)      { lowCount      += 1 };
            case (#Unknown)  {};
          };
        };
        let riskScore    = calculateRiskScore(criticalCount, highCount, mediumCount, lowCount);
        let openFindings = openAlerts.size();
        let updated : Asset = {
          id           = asset.id;
          name         = asset.name;
          assetType    = asset.assetType;
          provider     = asset.provider;
          accountId    = asset.accountId;
          region       = asset.region;
          tags         = asset.tags;
          customer     = asset.customer;
          lastSeen     = asset.lastSeen;
          riskScore;
          openFindings;
        };
        (assetId, updated);
      }
    );
  };

};
