import { createHmac } from "node:crypto";

/**
 * Reusable webhook payload fixtures for the PocketIC backend lane.
 *
 * Each fixture matches the real signature scheme the backend verifies in
 * `http_request_update` (see src/backend/main.mo and
 * src/backend/webhook/WebhookSignature.mo):
 *
 *   - AWS EventBridge: header `X-Amz-Signature` = lowercase hex of
 *     HMAC-SHA256(secret, body).
 *   - Azure Event Grid: header `Aeg-Sas-Key` = the shared secret verbatim.
 *   - GCP Pub/Sub: header `Authorization` = `Bearer <secret>`.
 *
 * `validBody` is a payload the corresponding parser accepts; `malformedBody`
 * is a payload that fails parsing (so the backend logs a `ParseError` failed
 * ingestion). `sign(secret, body)` returns the exact header value that passes
 * signature verification for that provider.
 */

export type Provider = "AWS" | "Azure" | "GCP";

export interface WebhookFixture {
  provider: Provider;
  /** The URL path the backend routes this provider's webhook to. */
  url: string;
  /** A body the provider's parser accepts (used to prove a valid signature). */
  validBody: string;
  /** A body the provider's parser rejects (used for the malformed-body case). */
  malformedBody: string;
  /** The header name the backend reads the signature from. */
  signatureHeader: string;
  /** Produce the header value that verifies for `secret` over `body`. */
  sign: (secret: string, body: string) => string;
}

/** AWS GuardDuty finding delivered via EventBridge. */
export const awsFixture: WebhookFixture = {
  provider: "AWS",
  url: "/webhook/aws",
  validBody: JSON.stringify({
    version: "0",
    id: "11111111-2222-3333-4444-555555555555",
    "detail-type": "GuardDuty Finding",
    source: "aws.guardduty",
    account: "123456789012",
    region: "us-east-1",
    detail: {
      schemaVersion: "2.0",
      accountId: "123456789012",
      region: "us-east-1",
      id: "abc123",
      type: "Backdoor:EC2/C&CActivity.B!DNS",
      severity: 8,
      updatedAt: "2024-01-01T00:00:00Z",
      resource: {
        instanceDetails: {
          instanceId: "i-1234567890abcdef0",
        },
      },
    },
  }),
  malformedBody: JSON.stringify({
    version: "0",
    detail: {
      accountId: "123456789012",
      resource: {
        instanceDetails: {
          instanceId: "i-1234567890abcdef0",
        },
      },
    },
  }),
  signatureHeader: "X-Amz-Signature",
  sign: (secret, body) =>
    createHmac("sha256", secret).update(body, "utf8").digest("hex"),
};

/** Azure Defender alert delivered via Event Grid. */
export const azureFixture: WebhookFixture = {
  provider: "Azure",
  url: "/webhook/azure",
  validBody: JSON.stringify({
    id: "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Security/locations/centralus/alerts/abc",
    eventType: "Microsoft.Security/alerts",
    properties: {
      compromisedEntity: "vm-01",
      alertType: "Suspicious process executed",
      timeGeneratedUtc: "2024-01-01T00:00:00Z",
      severity: "High",
      resourceIdentifiers: {
        location: "centralus",
      },
    },
  }),
  malformedBody: JSON.stringify({
    id: "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Security/locations/centralus/alerts/abc",
    eventType: "Microsoft.Security/alerts",
    properties: {
      alertType: "Suspicious process executed",
    },
  }),
  signatureHeader: "Aeg-Sas-Key",
  sign: (secret) => secret,
};

/** GCP Security Command Center finding delivered via Pub/Sub. */
export const gcpFixture: WebhookFixture = {
  provider: "GCP",
  url: "/webhook/gcp",
  validBody: JSON.stringify({
    message: {
      data: "c2VjdXJpdHktZmluZGluZw==",
    },
    finding: {
      name: "organizations/123/sources/456/findings/abc",
      resourceName:
        "//cloudresourcemanager.googleapis.com/projects/my-project",
      category: "MALWARE",
      eventTime: "2024-01-01T00:00:00Z",
      severity: "HIGH",
      sourceProperties: {
        location: "us-central1",
      },
    },
  }),
  malformedBody: JSON.stringify({
    finding: {
      category: "MALWARE",
      eventTime: "2024-01-01T00:00:00Z",
    },
  }),
  signatureHeader: "Authorization",
  sign: (secret) => `Bearer ${secret}`,
};

/** All provider fixtures, for iterating a test across every provider. */
export const webhookFixtures: WebhookFixture[] = [
  awsFixture,
  azureFixture,
  gcpFixture,
];
