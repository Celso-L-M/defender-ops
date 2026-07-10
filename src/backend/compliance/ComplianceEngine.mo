import Text "mo:core/Text";
import List "mo:core/List";

import Types "../types/common";

module {

  // ── Private helpers ────────────────────────────────────────────────────────

  private func frameworkText(f : Types.ComplianceFramework) : Text {
    switch f {
      case (#NISTCSF)  "NIST CSF";
      case (#CISAws)   "CIS AWS";
      case (#CISAzure) "CIS Azure";
      case (#CISGCP)   "CIS GCP";
      case (#ISO27001) "ISO 27001";
      case (#SOC2)     "SOC 2 Type II";
    };
  };

  private func controlStatusText(s : Types.ControlStatus) : Text {
    switch s {
      case (#Passing)    "Passing";
      case (#Failing)    "Failing";
      case (#NoCoverage) "NoCoverage";
    };
  };

  /// True when the alert's provider matches the control's optional provider filter.
  private func _providerMatches(alertProv : Types.ProviderType, ctrlProv : ?Types.ProviderType) : Bool {
    switch ctrlProv {
      case null     true;
      case (?cp) {
        switch (alertProv, cp) {
          case (#AWS,   #AWS)   true;
          case (#Azure, #Azure) true;
          case (#GCP,   #GCP)   true;
          case _                false;
        };
      };
    };
  };

  /// Minimal curated control catalog. Returns the baseline set for a framework.
  /// Each framework gets representative controls (not exhaustive — a real
  /// implementation would have a full catalog; here we produce enough structure
  /// to satisfy score/report operations).
  private func baseControls(framework : Types.ComplianceFramework) : [Types.ComplianceControl] {
    let noProvider : ?Types.ProviderType = null;
    switch framework {
      case (#NISTCSF) [
        { controlId = "NIST-ID.AM-1"; framework; title = "Asset Management - Physical Devices Inventory";                    description = "Physical devices and systems within the organization are inventoried";               remediationGuidance = "Maintain inventory of all physical devices and systems";                         status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "NIST-ID.AM-2"; framework; title = "Asset Management - Software Platform Inventory";                   description = "Software platforms and applications within the organization are inventoried";           remediationGuidance = "Maintain inventory of software platforms and applications";                      status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "NIST-PR.AC-1"; framework; title = "Identity Management - Identities and Credentials Managed";          description = "Identities and credentials are issued, managed, verified, revoked, and audited";          remediationGuidance = "Identities and credentials are issued, managed, verified, revoked";               status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "NIST-PR.AC-3"; framework; title = "Access Management - Remote Access Managed";                         description = "Remote access is managed";                                                               remediationGuidance = "Remote access is managed with MFA and logging";                                 status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "NIST-DE.CM-1"; framework; title = "Security Monitoring - Network Monitoring";                          description = "The network is monitored to detect potential cybersecurity events";                       remediationGuidance = "The network is monitored to detect potential cybersecurity events";              status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "NIST-DE.CM-4"; framework; title = "Security Monitoring - Malicious Code Detected";                     description = "Malicious code is detected and the event is handled";                                   remediationGuidance = "Malicious code is detected";                                                    status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "NIST-RS.AN-1"; framework; title = "Analysis - Notifications from Detection Systems Investigated";       description = "Notifications from detection systems are investigated";                                 remediationGuidance = "Notifications from detection systems are investigated";                          status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "NIST-RC.RP-1"; framework; title = "Recovery Planning - Recovery Plan Executed";                        description = "Recovery plan is executed during or after a cybersecurity incident";                     remediationGuidance = "Recovery plan is executed during or after a cybersecurity incident";           status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider }
      ];
      case (#CISAws) [
        { controlId = "CIS-AWS-1.1"; framework; title = "Avoid use of root account";                                          description = "Avoid the use of the root account";                                                    remediationGuidance = "Monitor root account usage and disable direct root access";                   status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#AWS },
        { controlId = "CIS-AWS-1.4"; framework; title = "Ensure access keys rotated every 90 days";                           description = "Ensure access keys are rotated every 90 days or less";                                 remediationGuidance = "Rotate access keys regularly and remove unused keys";                          status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#AWS },
        { controlId = "CIS-AWS-2.1"; framework; title = "Ensure CloudTrail enabled in all regions";                           description = "Ensure CloudTrail is enabled in all regions";                                          remediationGuidance = "Enable CloudTrail logging across all regions";                                 status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#AWS },
        { controlId = "CIS-AWS-2.6"; framework; title = "Ensure CloudTrail log file validation enabled";                      description = "Ensure CloudTrail log file validation is enabled";                                     remediationGuidance = "Enable log file validation to detect tampering";                              status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#AWS },
        { controlId = "CIS-AWS-4.1"; framework; title = "Restrict SSH access from 0.0.0.0/0";                                 description = "Ensure no security groups allow ingress from 0.0.0.0/0 to port 22";                    remediationGuidance = "Remove overly permissive inbound SSH rules from security groups";             status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#AWS },
        { controlId = "CIS-AWS-4.2"; framework; title = "Restrict RDP access from 0.0.0.0/0";                                 description = "Ensure no security groups allow ingress from 0.0.0.0/0 to port 3389";                  remediationGuidance = "Remove overly permissive inbound RDP rules from security groups";             status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#AWS },
        { controlId = "CIS-AWS-4.3"; framework; title = "No unrestricted inbound access on other ports";                      description = "Ensure no security groups allow unrestricted inbound access on other ports";           remediationGuidance = "Review all security groups for unrestricted inbound access";                 status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#AWS },
        { controlId = "CIS-AWS-3.1"; framework; title = "Ensure log metric filter for unauthorized API calls";                 description = "Ensure a log metric filter and alarm exist for unauthorized API calls";               remediationGuidance = "Create metric filter and alarm for unauthorized API calls";                   status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#AWS }
      ];
      case (#CISAzure) [
        { controlId = "CIS-AZ-1.1"; framework; title = "Multi-factor authentication for all users";                           description = "Ensure that multi-factor authentication is enabled for all users";                     remediationGuidance = "Enforce MFA for all Azure Active Directory users";                            status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#Azure },
        { controlId = "CIS-AZ-1.2"; framework; title = "Ensure no guest users exist";                                         description = "Ensure that there are no guest users";                                                 remediationGuidance = "Review and remove unnecessary guest accounts";                                status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#Azure },
        { controlId = "CIS-AZ-2.1"; framework; title = "Azure Defender enabled for Servers";                                  description = "Ensure that Microsoft Defender for Cloud is set to On for Servers";                   remediationGuidance = "Enable Microsoft Defender for all server resources";                          status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#Azure },
        { controlId = "CIS-AZ-2.2"; framework; title = "Azure Defender enabled for App Services";                             description = "Ensure that Microsoft Defender for Cloud is set to On for App Service";               remediationGuidance = "Enable Microsoft Defender for App Service";                                  status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#Azure },
        { controlId = "CIS-AZ-3.1"; framework; title = "Restrict access to storage accounts from public networks";            description = "Ensure that Storage account access is restricted from public networks";              remediationGuidance = "Disable public blob access on all storage accounts";                         status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#Azure },
        { controlId = "CIS-AZ-4.1"; framework; title = "SQL Servers with public network access disabled";                     description = "Ensure that Azure SQL server access is restricted from public networks";              remediationGuidance = "Disable public access to SQL Server instances";                              status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#Azure },
        { controlId = "CIS-AZ-5.1"; framework; title = "Monitor subscription activity log alerts";                            description = "Ensure that Activity Log Alerts exist for specific operations";                       remediationGuidance = "Configure activity log alerts for critical operations";                       status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#Azure },
        { controlId = "CIS-AZ-7.1"; framework; title = "Enable Transparent Data Encryption for SQL databases";               description = "Ensure that Transparent Data Encryption is enabled on SQL Databases";               remediationGuidance = "Ensure TDE is enabled on all SQL databases";                                 status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#Azure }
      ];
      case (#CISGCP) [
        { controlId = "CIS-GCP-1.1"; framework; title = "Ensure corporate login credentials for GCP access";                  description = "Ensure that corporate login credentials are used instead of personal accounts";       remediationGuidance = "Use Google Workspace or Cloud Identity for access";                          status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#GCP },
        { controlId = "CIS-GCP-1.4"; framework; title = "Ensure service accounts do not have admin privileges";                description = "Ensure that service accounts do not have admin privileges";                          remediationGuidance = "Review and restrict service account IAM roles";                              status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#GCP },
        { controlId = "CIS-GCP-2.1"; framework; title = "Ensure Cloud Audit Logging configured for all services";             description = "Ensure that Cloud Audit Logging is configured properly across all services";         remediationGuidance = "Enable audit logs for all services and projects";                            status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#GCP },
        { controlId = "CIS-GCP-3.1"; framework; title = "Ensure default firewall rules deny all incoming traffic";            description = "Ensure that the default firewall rules deny all incoming connections";               remediationGuidance = "Review default firewall rules and restrict inbound access";                  status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#GCP },
        { controlId = "CIS-GCP-4.1"; framework; title = "Ensure osLogin is enabled on all instances";                        description = "Ensure that OS Login is enabled on project level";                                    remediationGuidance = "Enable OS Login for SSH key management via IAM";                             status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#GCP },
        { controlId = "CIS-GCP-5.1"; framework; title = "Ensure Cloud Storage buckets not publicly accessible";               description = "Ensure that Cloud Storage bucket is not publicly accessible";                        remediationGuidance = "Review bucket IAM policies and disable public access";                       status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#GCP },
        { controlId = "CIS-GCP-6.1"; framework; title = "Ensure Cloud SQL instances not publicly accessible";                 description = "Ensure that Cloud SQL database instances are not publicly exposed";                  remediationGuidance = "Remove authorized network 0.0.0.0/0 from Cloud SQL instances";              status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#GCP },
        { controlId = "CIS-GCP-6.2"; framework; title = "Ensure Cloud SQL instances have automated backups enabled";          description = "Ensure that Cloud SQL database instances have automated backups configured";         remediationGuidance = "Enable automated daily backups for all Cloud SQL instances";                status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#GCP }
      ];
      case (#ISO27001) [
        { controlId = "ISO-A.8.1.1";  framework; title = "Inventory of Assets";                         description = "All assets associated with information processing facilities should be identified";     remediationGuidance = "All assets should be inventoried and owners assigned";                       status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "ISO-A.9.1.1";  framework; title = "Access Control Policy";                       description = "An access control policy should be established, documented and reviewed";               remediationGuidance = "An access control policy should be established and reviewed";                 status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "ISO-A.9.2.1";  framework; title = "User Registration and De-registration";        description = "A formal user registration and de-registration procedure should be implemented";        remediationGuidance = "A formal user registration process should exist";                           status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "ISO-A.10.1.1"; framework; title = "Policy on Use of Cryptographic Controls";      description = "A policy on the use of cryptographic controls for protection of information";          remediationGuidance = "A policy on cryptographic controls should be implemented";                   status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "ISO-A.12.4.1"; framework; title = "Event Logging";                                description = "Event logs recording user activities and security events should be produced and kept"; remediationGuidance = "Event logs recording user activities should be produced and kept";           status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "ISO-A.12.6.1"; framework; title = "Management of Technical Vulnerabilities";      description = "Information about technical vulnerabilities should be obtained in a timely fashion";   remediationGuidance = "Timely identification and remediation of technical vulnerabilities";         status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "ISO-A.16.1.2"; framework; title = "Reporting Information Security Events";        description = "Information security events should be reported through appropriate channels promptly"; remediationGuidance = "Information security events should be reported promptly";                   status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "ISO-A.18.1.1"; framework; title = "Identification of Applicable Legislation";     description = "All relevant legislative and regulatory requirements should be identified";           remediationGuidance = "Relevant legislation and contractual requirements should be identified";     status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider }
      ];
      case (#SOC2) [
        { controlId = "SOC2-CC1.1"; framework; title = "Control Environment - Integrity and Ethical Values";                  description = "Management demonstrates a commitment to integrity and ethical values";                 remediationGuidance = "Management demonstrates commitment to integrity and ethics";                 status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "SOC2-CC2.1"; framework; title = "Information and Communication - Internal Communication";              description = "Information is communicated across the organization to support the functioning of controls"; remediationGuidance = "Information is communicated across the organization";                 status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "SOC2-CC6.1"; framework; title = "Logical and Physical Access Controls - Logical Access Security";      description = "Logical access security software, infrastructure, and architectures restrict access";  remediationGuidance = "Logical access security measures restrict access to information assets";    status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "SOC2-CC6.2"; framework; title = "Logical Access - Prior to Issuing System Credentials";               description = "Prior to issuing system credentials new internal and external users are registered";   remediationGuidance = "New internal and external users are registered and authorized";             status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "SOC2-CC7.1"; framework; title = "System Operations - Detection and Monitoring";                        description = "To meet its objectives the entity uses detection and monitoring procedures";          remediationGuidance = "Detection and monitoring procedures are implemented to identify anomalies"; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "SOC2-CC7.2"; framework; title = "System Operations - Monitoring for Anomalies";                       description = "The entity monitors system components for anomalies that indicate malicious acts";   remediationGuidance = "System performance is monitored and deviations from established performance baselines are evaluated"; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "SOC2-CC8.1"; framework; title = "Change Management - Authorize, Design, Develop, Acquire, Implement"; description = "Infrastructure changes are authorized, designed, developed and implemented";          remediationGuidance = "Changes to infrastructure, data, software, and procedures are authorized, designed, developed"; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider },
        { controlId = "SOC2-A1.1";  framework; title = "Availability - Capacity Planning";                                   description = "Current processing capacity and usage of system components are maintained";           remediationGuidance = "Current processing capacity and usage are maintained and evaluated";       status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = noProvider }
      ];
    };
  };

  // ── Public API ─────────────────────────────────────────────────────────────

  /// Returns list of controlIds that this alert maps to within the given framework.
  public func mapAlertToControls(
    alert     : Types.NormalizedAlert,
    framework : Types.ComplianceFramework
  ) : [Text] {
    let lower = alert.title.toLower();

    let accessIds   : [Text] = ["NIST-PR.AC-1", "CIS-AWS-1.1", "CIS-AZ-1.1", "CIS-GCP-1.4", "ISO-A.9.1.1", "SOC2-CC6.1"];
    let loggingIds  : [Text] = ["NIST-DE.CM-1", "CIS-AWS-2.1", "CIS-AZ-5.1", "CIS-GCP-2.1", "ISO-A.12.4.1", "SOC2-CC7.1"];
    let storageIds  : [Text] = ["CIS-AWS-4.3",  "CIS-AZ-3.1",  "CIS-GCP-5.1", "ISO-A.10.1.1"];
    let incidentIds : [Text] = ["NIST-RS.AN-1", "ISO-A.16.1.2", "SOC2-CC7.2"];
    let vulnIds     : [Text] = ["ISO-A.12.6.1", "NIST-DE.CM-4"];

    let isAccess  = lower.contains(#text "unauthorized") or lower.contains(#text "access");
    let isLogging = lower.contains(#text "log") or lower.contains(#text "audit");
    let isStorage = lower.contains(#text "storage") or lower.contains(#text "bucket") or lower.contains(#text "s3");
    let isHighSev = switch (alert.severity) { case (#Critical or #High) true; case _ false };
    let isVuln    = lower.contains(#text "vulnerability") or lower.contains(#text "patch");

    let frameworkControls = baseControls(framework);

    let inFramework = func(id : Text) : Bool {
      for (c in frameworkControls.vals()) {
        if (Text.equal(c.controlId, id)) return true;
      };
      false;
    };

    let seen   = List.empty<Text>();
    let result = List.empty<Text>();

    let addIfMatch = func(candidates : [Text]) {
      for (id in candidates.vals()) {
        if (inFramework(id)) {
          var alreadySeen = false;
          for (s in seen.values()) {
            if (Text.equal(s, id)) { alreadySeen := true };
          };
          if (not alreadySeen) {
            seen.add(id);
            result.add(id);
          };
        };
      };
    };

    if (isAccess)  { addIfMatch(accessIds)   };
    if (isLogging) { addIfMatch(loggingIds)  };
    if (isStorage) { addIfMatch(storageIds)  };
    if (isHighSev) { addIfMatch(incidentIds) };
    if (isVuln)    { addIfMatch(vulnIds)     };

    result.toArray();
  };

  /// Returns the curated control definitions for the framework,
  /// optionally filtered by provider.
  public func getFrameworkControls(
    framework : Types.ComplianceFramework,
    provider : ?Types.ProviderType
  ) : [Types.ComplianceControl] {
    let all = List.empty<Types.ComplianceControl>();
    switch (framework) {
      case (#NISTCSF) {
        all.add({ controlId = "DE.CM-1"; framework = #NISTCSF; title = "Network Monitoring"; description = "The network is monitored to detect potential cybersecurity events."; remediationGuidance = "Enable continuous network traffic monitoring and anomaly detection."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "DE.CM-7"; framework = #NISTCSF; title = "Unauthorized Personnel Monitoring"; description = "Monitoring for unauthorized personnel, connections, devices, and software is performed."; remediationGuidance = "Deploy UEBA and enforce strict access controls."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "PR.AC-1"; framework = #NISTCSF; title = "Identity Management"; description = "Identities and credentials are issued, managed, verified, revoked, and audited."; remediationGuidance = "Implement centralized IAM with regular access reviews."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "PR.AC-4"; framework = #NISTCSF; title = "Access Permissions"; description = "Access permissions and authorizations are managed, incorporating least privilege principles."; remediationGuidance = "Enforce least privilege and review permissions quarterly."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "PR.DS-1"; framework = #NISTCSF; title = "Data-at-Rest Protection"; description = "Data-at-rest is protected."; remediationGuidance = "Enable encryption at rest for all storage services."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "PR.DS-5"; framework = #NISTCSF; title = "Data Leakage Protection"; description = "Protections against data leaks are implemented."; remediationGuidance = "Implement DLP controls and monitor egress traffic."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "PR.PT-3"; framework = #NISTCSF; title = "Least Functionality"; description = "The principle of least functionality is incorporated by configuring systems to provide only essential capabilities."; remediationGuidance = "Restrict network ports and protocols to only required services."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "RS.RP-1"; framework = #NISTCSF; title = "Response Plan"; description = "Response plan is executed during or after an incident."; remediationGuidance = "Maintain and test an incident response plan."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "ID.AM-1"; framework = #NISTCSF; title = "Asset Inventory"; description = "Physical devices and systems within the organization are inventoried."; remediationGuidance = "Maintain a complete and updated asset inventory."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
      };
      case (#CISAws) {
        all.add({ controlId = "CIS-AWS-1.1"; framework = #CISAws; title = "Root Account MFA"; description = "Ensure MFA is enabled for the root account."; remediationGuidance = "Enable hardware or virtual MFA on root account."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#AWS });
        all.add({ controlId = "CIS-AWS-1.4"; framework = #CISAws; title = "Access Key Rotation"; description = "Ensure access keys are rotated every 90 days or less."; remediationGuidance = "Rotate IAM access keys and automate rotation enforcement."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#AWS });
        all.add({ controlId = "CIS-AWS-2.1"; framework = #CISAws; title = "CloudTrail Enabled"; description = "Ensure CloudTrail is enabled in all regions."; remediationGuidance = "Enable multi-region CloudTrail and ensure log file validation."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#AWS });
        all.add({ controlId = "CIS-AWS-2.2"; framework = #CISAws; title = "CloudTrail Log Validation"; description = "Ensure CloudTrail log file validation is enabled."; remediationGuidance = "Enable log file validation in CloudTrail configuration."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#AWS });
        all.add({ controlId = "CIS-AWS-2.6"; framework = #CISAws; title = "S3 Bucket Logging"; description = "Ensure S3 bucket access logging is enabled on the CloudTrail S3 bucket."; remediationGuidance = "Enable server access logging on CloudTrail S3 bucket."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#AWS });
        all.add({ controlId = "CIS-AWS-3.1"; framework = #CISAws; title = "Unauthorized API Calls"; description = "Ensure a log metric filter and alarm exist for unauthorized API calls."; remediationGuidance = "Create CloudWatch metric filter for unauthorized API calls."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#AWS });
        all.add({ controlId = "CIS-AWS-5.1"; framework = #CISAws; title = "No Unrestricted SSH"; description = "Ensure no security groups allow ingress from 0.0.0.0/0 to port 22."; remediationGuidance = "Restrict SSH access to known IP ranges only."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#AWS });
        all.add({ controlId = "CIS-AWS-5.2"; framework = #CISAws; title = "No Unrestricted RDP"; description = "Ensure no security groups allow ingress from 0.0.0.0/0 to port 3389."; remediationGuidance = "Restrict RDP access to known IP ranges only."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#AWS });
      };
      case (#CISAzure) {
        all.add({ controlId = "CIS-AZ-1.1"; framework = #CISAzure; title = "MFA for Privileged Users"; description = "Ensure MFA is enabled for all privileged users."; remediationGuidance = "Enable Azure MFA for all accounts with privileged roles."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#Azure });
        all.add({ controlId = "CIS-AZ-1.2"; framework = #CISAzure; title = "MFA for All Users"; description = "Ensure MFA is enabled for all users."; remediationGuidance = "Deploy Conditional Access policy requiring MFA."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#Azure });
        all.add({ controlId = "CIS-AZ-2.1"; framework = #CISAzure; title = "Security Contacts"; description = "Ensure that Microsoft Defender for Cloud contact emails are set."; remediationGuidance = "Configure security contact email in Defender for Cloud."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#Azure });
        all.add({ controlId = "CIS-AZ-3.1"; framework = #CISAzure; title = "Storage Encryption"; description = "Ensure that Storage Account uses encryption."; remediationGuidance = "Verify storage encryption is enabled and use customer-managed keys."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#Azure });
        all.add({ controlId = "CIS-AZ-3.2"; framework = #CISAzure; title = "Blob Storage Private"; description = "Ensure that public access is disabled on storage accounts."; remediationGuidance = "Disable public blob access on all storage accounts."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#Azure });
        all.add({ controlId = "CIS-AZ-6.1"; framework = #CISAzure; title = "NSG Flow Logs"; description = "Ensure that Network Security Group Flow logs are captured."; remediationGuidance = "Enable NSG flow logs and send to Log Analytics."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#Azure });
        all.add({ controlId = "CIS-AZ-6.2"; framework = #CISAzure; title = "Network Watcher"; description = "Ensure that Network Watcher is enabled."; remediationGuidance = "Enable Network Watcher in all regions used."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#Azure });
      };
      case (#CISGCP) {
        all.add({ controlId = "CIS-GCP-1.1"; framework = #CISGCP; title = "IAM Admin Roles"; description = "Ensure no service account has admin privileges."; remediationGuidance = "Remove admin-level bindings from service accounts."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#GCP });
        all.add({ controlId = "CIS-GCP-1.5"; framework = #CISGCP; title = "Service Account Keys"; description = "Ensure user-managed service account keys are rotated within 90 days."; remediationGuidance = "Rotate service account keys and prefer workload identity."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#GCP });
        all.add({ controlId = "CIS-GCP-2.1"; framework = #CISGCP; title = "Cloud Audit Logging"; description = "Ensure Cloud Audit Logging is configured to track admin activities."; remediationGuidance = "Enable DATA_READ and DATA_WRITE audit log types."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#GCP });
        all.add({ controlId = "CIS-GCP-2.2"; framework = #CISGCP; title = "Log Sink"; description = "Ensure a log sink is configured for all projects."; remediationGuidance = "Create a log export sink to Cloud Storage or BigQuery."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#GCP });
        all.add({ controlId = "CIS-GCP-3.1"; framework = #CISGCP; title = "Default Network"; description = "Ensure the default network does not exist in projects."; remediationGuidance = "Delete the default network and create custom VPCs."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#GCP });
        all.add({ controlId = "CIS-GCP-5.1"; framework = #CISGCP; title = "GCS Bucket Logging"; description = "Ensure access logging is enabled on GCS buckets."; remediationGuidance = "Enable access logs on all GCS buckets."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#GCP });
        all.add({ controlId = "CIS-GCP-5.2"; framework = #CISGCP; title = "GCS Bucket Versioning"; description = "Ensure versioning is enabled on GCS buckets."; remediationGuidance = "Enable object versioning on critical GCS buckets."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = ?#GCP });
      };
      case (#ISO27001) {
        all.add({ controlId = "ISO-A.6.1"; framework = #ISO27001; title = "Information Security Roles"; description = "All information security responsibilities shall be defined and allocated."; remediationGuidance = "Define and document information security roles and responsibilities."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "ISO-A.8.2"; framework = #ISO27001; title = "Information Classification"; description = "Information shall be classified in terms of legal requirements, value, and sensitivity."; remediationGuidance = "Implement data classification policy and label sensitive data."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "ISO-A.9.1"; framework = #ISO27001; title = "Access Control Policy"; description = "An access control policy shall be established, documented, and reviewed."; remediationGuidance = "Establish formal access control policy aligned to business requirements."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "ISO-A.9.2"; framework = #ISO27001; title = "User Access Management"; description = "A formal user registration and de-registration process shall be implemented."; remediationGuidance = "Implement user lifecycle management processes."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "ISO-A.10.1"; framework = #ISO27001; title = "Cryptographic Controls"; description = "A policy on the use of cryptographic controls shall be developed and implemented."; remediationGuidance = "Define encryption standards and enforce across all systems."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "ISO-A.13.1"; framework = #ISO27001; title = "Network Controls"; description = "Networks shall be managed and controlled to protect information in systems."; remediationGuidance = "Segment networks and enforce firewall rules."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "ISO-A.16.1"; framework = #ISO27001; title = "Incident Management"; description = "Responsibilities and procedures shall be established to ensure a quick effective and orderly response to information security incidents."; remediationGuidance = "Implement incident response procedures and run tabletop exercises."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
      };
      case (#SOC2) {
        all.add({ controlId = "SOC2-CC1.1"; framework = #SOC2; title = "COSO Principles"; description = "The entity demonstrates a commitment to integrity and ethical values."; remediationGuidance = "Document and communicate code of conduct and ethical standards."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "SOC2-CC6.1"; framework = #SOC2; title = "Logical Access Security"; description = "The entity implements logical access security measures to protect against threats."; remediationGuidance = "Enforce MFA, least privilege, and periodic access reviews."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "SOC2-CC6.2"; framework = #SOC2; title = "Authentication"; description = "Prior to issuing system credentials, the entity registers and authorizes new users."; remediationGuidance = "Implement formal user registration and onboarding process."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "SOC2-CC7.1"; framework = #SOC2; title = "Security Monitoring"; description = "The entity uses detection and monitoring procedures to identify changes."; remediationGuidance = "Deploy SIEM and configure alerting for anomalous activity."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "SOC2-CC7.2"; framework = #SOC2; title = "Anomaly Detection"; description = "The entity monitors system components for anomalies that indicate security events."; remediationGuidance = "Configure anomaly detection and baseline normal behavior."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "SOC2-CC8.1"; framework = #SOC2; title = "Change Management"; description = "The entity authorizes, designs, develops, and implements changes to infrastructure."; remediationGuidance = "Implement change management process with approval gates."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "SOC2-CC9.1"; framework = #SOC2; title = "Risk Mitigation"; description = "The entity identifies, selects, and develops risk mitigation activities."; remediationGuidance = "Conduct regular risk assessments and implement controls."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
        all.add({ controlId = "SOC2-A1.1"; framework = #SOC2; title = "Availability"; description = "The entity maintains, monitors, and evaluates current processing capacity."; remediationGuidance = "Implement availability monitoring and capacity planning."; status = #NoCoverage; passingFindings = 0; failingFindings = 0; provider = null });
      };
    };
    switch (provider) {
      case null { all.toArray() };
      case (?p) {
        let filtered = List.empty<Types.ComplianceControl>();
        for (ctrl in all.values()) {
          let keep = switch (ctrl.provider) {
            case null    { true };
            case (?cp) {
              switch (cp, p) {
                case (#AWS, #AWS)     { true };
                case (#Azure, #Azure) { true };
                case (#GCP, #GCP)     { true };
                case _               { false };
              };
            };
          };
          if (keep) { filtered.add(ctrl) };
        };
        filtered.toArray();
      };
    };
  };

  /// Calculates passing/(total)*100 and returns percentage breakdown.
  public func calculateComplianceScore(
    controls : [Types.ComplianceControl]
  ) : { total : Nat; passing : Nat; failing : Nat; score : Nat } {
    var passing = 0;
    var failing = 0;
    for (ctrl in controls.vals()) {
      switch (ctrl.status) {
        case (#Passing)    { passing += 1 };
        case (#Failing)    { failing += 1 };
        case (#NoCoverage) {};
      };
    };
    let total = controls.size();
    let score = if (total == 0) { 0 } else { (passing * 100) / total };
    { total; passing; failing; score };
  };

  /// Creates a weekly compliance trend snapshot.
  public func takeWeeklySnapshot(
    framework : Types.ComplianceFramework,
    controls : [Types.ComplianceControl],
    weekTimestamp : Int
  ) : Types.ComplianceTrendEntry {
    let result = calculateComplianceScore(controls);
    {
      framework;
      weekTimestamp;
      score = result.score;
      totalControls = result.total;
      passingControls = result.passing;
    };
  };

  /// Returns CSV text: controlId,framework,title,status,passingFindings,failingFindings,remediationGuidance
  public func generateCsvReport(
    framework : Types.ComplianceFramework,
    controls : [Types.ComplianceControl]
  ) : Text {
    let fwText = frameworkText(framework);
    let header = "controlId,framework,title,status,passingFindings,failingFindings,remediationGuidance\n";
    let rows = List.empty<Text>();
    for (ctrl in controls.vals()) {
      let statusText = controlStatusText(ctrl.status);
      let escapedTitle = "\"" # ctrl.title # "\"";
      let escapedRemediation = "\"" # ctrl.remediationGuidance # "\"";
      let row = ctrl.controlId # "," # fwText # "," # escapedTitle # "," # statusText # "," #
        ctrl.passingFindings.toText() # "," # ctrl.failingFindings.toText() # "," # escapedRemediation # "\n";
      rows.add(row);
    };
    var csv = header;
    for (row in rows.values()) {
      csv := csv # row;
    };
    csv;
  };

  /// Returns minimal PDF blob (plain text PDF structure) for auditor review.
  public func generatePdfReport(
    framework : Types.ComplianceFramework,
    controls : [Types.ComplianceControl]
  ) : Blob {
    let fwText = frameworkText(framework);
    let result = calculateComplianceScore(controls);
    var content = "Compliance Report: " # fwText # "\n";
    content := content # "Generated: SecOps Platform\n\n";
    content := content # "SUMMARY\n";
    content := content # "Total Controls: " # result.total.toText() # "\n";
    content := content # "Passing: " # result.passing.toText() # "\n";
    content := content # "Failing: " # result.failing.toText() # "\n";
    content := content # "Compliance Score: " # result.score.toText() # "%\n\n";
    content := content # "CONTROL DETAILS\n";
    for (ctrl in controls.vals()) {
      let marker = switch (ctrl.status) {
        case (#Passing)    "[PASS]";
        case (#Failing)    "[FAIL]";
        case (#NoCoverage) "[N/A]";
      };
      content := content # marker # " " # ctrl.controlId # " - " # ctrl.title # "\n";
      let needsRemediation = switch (ctrl.status) {
        case (#Failing or #NoCoverage) true;
        case _ false;
      };
      if (needsRemediation) {
        content := content # "  Remediation: " # ctrl.remediationGuidance # "\n";
      };
    };
    let contentLength = content.size();
    var pdfText = "%PDF-1.4\n";
    pdfText := pdfText # "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
    pdfText := pdfText # "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
    pdfText := pdfText # "4 0 obj\n<< /Length " # contentLength.toText() # " >>\nstream\n" # content # "\nendstream\nendobj\n";
    pdfText := pdfText # "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n";
    pdfText := pdfText # "xref\n0 5\n";
    pdfText := pdfText # "trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n0\n%%EOF";
    pdfText.encodeUtf8();
  };

};
