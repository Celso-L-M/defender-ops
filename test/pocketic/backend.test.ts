import { PocketIc } from "@dfinity/pic";
import { Principal } from "@dfinity/principal";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";
import {
  awsFixture,
  azureFixture,
  gcpFixture,
  webhookFixtures,
  type Provider,
  type WebhookFixture,
} from "./fixtures/webhook-payloads";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";
// Set only on a converted project: the last pre-EM revision, whose schema this
// app's migration chain replays from. Installing the current wasm onto an empty
// canister there traps IC0503 before any test runs.
const BASELINE_WASM = process.env.BACKEND_WASM_BASELINE;

const ADMIN = Principal.fromText("aaaaa-aa");

/** The shared secret the tests configure for every provider. */
const SECRET = "test-shared-secret";

/** Map a fixture provider to the Candid `ProviderType` variant the API expects. */
const providerVariant: Record<
  Provider,
  { AWS: null } | { Azure: null } | { GCP: null }
> = {
  AWS: { AWS: null },
  Azure: { Azure: null },
  GCP: { GCP: null },
};

/** Build the `http_request_update` request for a fixture over a given body. */
function buildRequest(
  fixture: WebhookFixture,
  body: string,
  signatureHeaderValue: string,
) {
  return {
    url: fixture.url,
    method: "POST",
    body: new TextEncoder().encode(body),
    headers: [[fixture.signatureHeader, signatureHeaderValue]] as Array<
      [string, string]
    >,
  };
}

/** Find a failed-ingestion record by provider text and error type. */
function findFailed(
  records: Array<{
    id: string;
    status: string;
    provider: string;
    errorMessage: string;
    errorType: string;
    timestamp: bigint;
    rawPayload: string;
  }>,
  provider: string,
  errorType: string,
) {
  return records.find(
    (r) => r.provider === provider && r.errorType === errorType,
  );
}

let pic: PocketIc | undefined;
let actor: _SERVICE;

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  if (BASELINE_WASM === undefined) {
    ({ actor } = await pic.setupCanister<_SERVICE>({ idlFactory, wasm: BACKEND_WASM }));
    return;
  }
  // `[baseline, current]`, the same install contract the hosted deploy uses for
  // a converted project. The upgrade replays the chain from the legacy schema.
  const installed = await pic.setupCanister<_SERVICE>({ idlFactory, wasm: BASELINE_WASM });
  await pic.upgradeCanister({ canisterId: installed.canisterId, wasm: BACKEND_WASM, arg: new Uint8Array() });
  actor = installed.actor;
});

afterAll(async () => {
  // `?.` because `beforeAll` may not have got that far. A failed
  // `PocketIc.create` otherwise stacks "Cannot read properties of undefined"
  // on top of the real error and buries the one line that explains the run.
  await pic?.tearDown();
});

describe("webhook secret configuration", () => {
  it("reports no webhook secrets configured on a fresh canister", async () => {
    actor.setPrincipal(ADMIN);
    await expect(actor.getWebhookSecretStatus()).resolves.toEqual({
      awsSet: false,
      azureSet: false,
      gcpSet: false,
    });
  });

  it("stores a per-provider webhook secret and reflects it in status without returning the value", async () => {
    actor.setPrincipal(ADMIN);
    await expect(actor.saveWebhookSecret({ AWS: null }, "aws-secret")).resolves.toBeNull();
    await expect(actor.saveWebhookSecret({ Azure: null }, "azure-secret")).resolves.toBeNull();
    await expect(actor.saveWebhookSecret({ GCP: null }, "gcp-secret")).resolves.toBeNull();

    const status = await actor.getWebhookSecretStatus();
    expect(status).toEqual({ awsSet: true, azureSet: true, gcpSet: true });
  });

  it("rejects saving a webhook secret from an anonymous caller", async () => {
    actor.setPrincipal(Principal.anonymous());
    await expect(actor.saveWebhookSecret({ AWS: null }, "x")).rejects.toThrow();
  });
});

describe("failed ingestion and pipeline reads", () => {
  it("answers an empty failed-ingestion read instead of trapping", async () => {
    actor.setPrincipal(ADMIN);
    await expect(actor.getFailedIngestions([], 100n)).resolves.toEqual([]);
  });

  it("answers webhook and pipeline health reads instead of trapping", async () => {
    actor.setPrincipal(ADMIN);
    await expect(actor.getWebhookStats()).resolves.toMatchObject({
      webhookEventsToday: 0n,
    });
    // getPipelineHealth always returns one stats row per provider (AWS, Azure,
    // GCP), so a fresh canister answers with three rows rather than an empty
    // array.
    await expect(actor.getPipelineHealth()).resolves.toHaveLength(3);
  });
});

describe("webhook signature verification and failed ingestion", () => {
  it("rejects an invalid signature with 401 and logs a failed ingestion per provider", async () => {
    actor.setPrincipal(ADMIN);

    for (const fixture of webhookFixtures) {
      await actor.saveWebhookSecret(providerVariant[fixture.provider], SECRET);

      // Sign with a different secret than the one configured, so the signature
      // is present but does not verify.
      const wrongSignature = fixture.sign("wrong-secret", fixture.validBody);
      const res = await actor.http_request_update(
        buildRequest(fixture, fixture.validBody, wrongSignature),
      );
      expect(res.status_code).toBe(401);

      const failed = await actor.getFailedIngestions([], 100n);
      const record = findFailed(failed, fixture.provider, "Unauthorized");
      expect(record).toBeDefined();
      expect(record!.rawPayload).toBe(fixture.validBody);
      expect(record!.timestamp).toBeGreaterThan(0n);
    }
  });

  it("rejects a correctly-signed but malformed body with 400 and logs a ParseError per provider", async () => {
    actor.setPrincipal(ADMIN);

    for (const fixture of webhookFixtures) {
      // Sign the malformed body correctly against the configured secret.
      const validSignature = fixture.sign(SECRET, fixture.malformedBody);
      const res = await actor.http_request_update(
        buildRequest(fixture, fixture.malformedBody, validSignature),
      );
      expect(res.status_code).toBe(400);

      const failed = await actor.getFailedIngestions([], 100n);
      const record = findFailed(failed, fixture.provider, "ParseError");
      expect(record).toBeDefined();
      expect(record!.rawPayload).toBe(fixture.malformedBody);
      expect(record!.timestamp).toBeGreaterThan(0n);
    }
  });

  it("returns populated failed-ingestion records with provider, error type, timestamp, and raw payload intact", async () => {
    actor.setPrincipal(ADMIN);

    const failed = await actor.getFailedIngestions([], 100n);

    // One Unauthorized + one ParseError per provider.
    expect(failed).toHaveLength(webhookFixtures.length * 2);

    for (const fixture of webhookFixtures) {
      const unauthorized = findFailed(failed, fixture.provider, "Unauthorized");
      expect(unauthorized).toBeDefined();
      expect(unauthorized!.rawPayload).toBe(fixture.validBody);
      expect(unauthorized!.timestamp).toBeGreaterThan(0n);

      const parseError = findFailed(failed, fixture.provider, "ParseError");
      expect(parseError).toBeDefined();
      expect(parseError!.rawPayload).toBe(fixture.malformedBody);
      expect(parseError!.timestamp).toBeGreaterThan(0n);
    }
  });

  it("reflects the logged failures in the failed-ingestion count", async () => {
    actor.setPrincipal(ADMIN);

    // There is no public getFailedIngestionCount endpoint, so the count is
    // asserted through the full getFailedIngestions read (a large limit returns
    // every record, so its length is the count).
    const failed = await actor.getFailedIngestions([], 100n);
    expect(failed).toHaveLength(webhookFixtures.length * 2);
  });
});
