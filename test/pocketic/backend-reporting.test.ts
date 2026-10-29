import { PocketIc, createIdentity } from "@dfinity/pic";
import type { CanisterFixture } from "@dfinity/pic";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";
// Set only on a converted project: the last pre-EM revision, whose schema this
// app's migration chain replays from. Installing the current wasm onto an empty
// canister there traps IC0503 before any test runs.
const BASELINE_WASM = process.env.BACKEND_WASM_BASELINE;

// The canister controller is the owner; `createIdentity` names a deterministic
// caller without importing a Principal class (which the lane cannot resolve).
const admin = createIdentity("admin");

const AWS = { AWS: null } as const;
const AZURE = { Azure: null } as const;
const GCP = { GCP: null } as const;

const SECURITY_POSTURE = { SecurityPosture: null } as const;

/** A fixed microsecond timestamp (2026-10-01T00:00:00Z). */
const PERIOD_START = BigInt(Date.UTC(2026, 9, 1)) * 1_000_000n;
/** A fixed microsecond timestamp (2026-10-08T00:00:00Z). */
const PERIOD_END = BigInt(Date.UTC(2026, 9, 8)) * 1_000_000n;

let pic: PocketIc | undefined;
let actor: _SERVICE;
let canisterId: CanisterFixture<_SERVICE>["canisterId"];

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  if (BASELINE_WASM === undefined) {
    ({ actor, canisterId } = await pic.setupCanister<_SERVICE>({
      idlFactory,
      wasm: BACKEND_WASM,
      sender: admin.getPrincipal(),
    }));
    return;
  }
  const installed = await pic.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BASELINE_WASM,
    sender: admin.getPrincipal(),
  });
  await pic.upgradeCanister({
    canisterId: installed.canisterId,
    wasm: BACKEND_WASM,
    arg: new Uint8Array(),
  });
  ({ actor, canisterId } = installed);
});

afterAll(async () => {
  await pic?.tearDown();
});

describe("cursor pagination on getNormalizedAlerts", () => {
  it("answers an empty first page instead of trapping", async () => {
    actor.setIdentity(admin);
    const page = await actor.getNormalizedAlerts({
      customer: "default",
      cursor: [],
      limit: 50n,
      provider: [],
      severity: [],
      status: [],
    });
    expect(page.items).toEqual([]);
    expect(page.nextCursor).toEqual([]);
  });

  it("returns a page shape with items and an optional next cursor", async () => {
    actor.setIdentity(admin);
    const page = await actor.getNormalizedAlerts({
      customer: "default",
      cursor: [],
      limit: 1n,
      provider: [AWS],
      severity: [],
      status: [],
    });
    expect(Array.isArray(page.items)).toBe(true);
    // nextCursor is an optional; on an empty result it is absent.
    expect(page.nextCursor.length).toBeLessThanOrEqual(1);
  });
});

describe("report runs and on-demand generation", () => {
  it("answers an empty report-run read instead of trapping", async () => {
    actor.setIdentity(admin);
    await expect(actor.getReportRuns("default", 50n)).resolves.toEqual([]);
  });

  it("returns no recipients for an unconfigured report type", async () => {
    actor.setIdentity(admin);
    await expect(
      actor.getReportRecipients(SECURITY_POSTURE, "default"),
    ).resolves.toEqual([]);
  });

  it("runs an on-demand report for a custom range and records the run", async () => {
    actor.setIdentity(admin);
    const result = await actor.runReportOnDemand(
      SECURITY_POSTURE,
      PERIOD_START,
      PERIOD_END,
      "default",
      [AWS, AZURE],
    );
    expect("ok" in result).toBe(true);
    if (!("ok" in result)) {
      return;
    }
    const run = result.ok;
    expect(run.reportType).toEqual(SECURITY_POSTURE);
    expect(run.trigger).toEqual({ OnDemand: null });
    expect(run.periodStart).toBe(PERIOD_START);
    expect(run.periodEnd).toBe(PERIOD_END);
    expect(run.providerScope).toEqual([AWS, AZURE]);

    const runs = await actor.getReportRuns("default", 50n);
    expect(runs.some((r) => r.runId === run.runId)).toBe(true);
  });

  it("rejects an on-demand report with an inverted period", async () => {
    actor.setIdentity(admin);
    const result = await actor.runReportOnDemand(
      SECURITY_POSTURE,
      PERIOD_END,
      PERIOD_START,
      "default",
      [AWS],
    );
    expect("err" in result).toBe(true);
  });

  it("records a scheduled weekly run for the previous 7 days", async () => {
    actor.setIdentity(admin);
    const result = await actor.runScheduledReport(
      SECURITY_POSTURE,
      { ScheduledWeekly: null },
      "default",
      [AWS, AZURE, GCP],
    );
    expect("ok" in result).toBe(true);
    if (!("ok" in result)) {
      return;
    }
    expect(result.ok.trigger).toEqual({ ScheduledWeekly: null });
    expect(result.ok.periodEnd).toBeGreaterThan(result.ok.periodStart);
  });

  it("records a scheduled monthly run for the previous calendar month", async () => {
    actor.setIdentity(admin);
    const result = await actor.runScheduledReport(
      SECURITY_POSTURE,
      { ScheduledMonthly: null },
      "default",
      [AWS],
    );
    expect("ok" in result).toBe(true);
    if (!("ok" in result)) {
      return;
    }
    expect(result.ok.trigger).toEqual({ ScheduledMonthly: null });
    expect(result.ok.periodEnd).toBeGreaterThan(result.ok.periodStart);
  });

  it("exports a branded PDF as non-empty bytes", async () => {
    actor.setIdentity(admin);
    const bytes = await actor.exportReportPdf(
      SECURITY_POSTURE,
      PERIOD_START,
      PERIOD_END,
      "default",
      [AWS, AZURE],
    );
    expect(bytes.length).toBeGreaterThan(0);
    // PDF-1.4 magic header.
    expect(Array.from(bytes.slice(0, 4))).toEqual([37, 80, 68, 70]);
  });

  it("saves per-report-type recipients and reads them back", async () => {
    actor.setIdentity(admin);
    await expect(
      actor.saveReportRecipients({
        customer: "default",
        reportType: SECURITY_POSTURE,
        recipients: ["soc@example.com"],
      }),
    ).resolves.toEqual({ ok: null });

    const config = await actor.getReportRecipients(SECURITY_POSTURE, "default");
    expect(config).toHaveLength(1);
    expect(config[0].recipients).toEqual(["soc@example.com"]);
  });

  it("rejects an invalid recipient address", async () => {
    actor.setIdentity(admin);
    const result = await actor.saveReportRecipients({
      customer: "default",
      reportType: SECURITY_POSTURE,
      recipients: ["not-an-email"],
    });
    expect("err" in result).toBe(true);
  });
});

describe("notification routing, rules and log", () => {
  it("returns no routing for an unconfigured customer", async () => {
    actor.setIdentity(admin);
    await expect(actor.getNotificationRouting("default")).resolves.toEqual([]);
  });

  it("saves per-customer routing with webhook, recipients, cooldown and escalation", async () => {
    actor.setIdentity(admin);
    await expect(
      actor.saveNotificationRouting({
        customer: "default",
        cooldownMinutes: 60n,
        emailRecipients: ["soc@example.com"],
        teamsWebhookUrl: ["https://outlook.office.com/webhook/abc"],
        escalationMinutes: [30n],
      }),
    ).resolves.toEqual({ ok: null });

    const routing = await actor.getNotificationRouting("default");
    expect(routing).toHaveLength(1);
    expect(routing[0].cooldownMinutes).toBe(60n);
    expect(routing[0].emailRecipients).toEqual(["soc@example.com"]);
  });

  it("rejects a non-https Teams webhook URL", async () => {
    actor.setIdentity(admin);
    const result = await actor.saveNotificationRouting({
      customer: "default",
      cooldownMinutes: 60n,
      emailRecipients: [],
      teamsWebhookUrl: ["http://insecure.example.com/hook"],
      escalationMinutes: [],
    });
    expect("err" in result).toBe(true);
  });

  it("saves an alert rule and reads it back for the customer", async () => {
    actor.setIdentity(admin);
    const rule = {
      id: "rule-1",
      name: "Critical AWS Alerts",
      customer: "default",
      enabled: true,
      severityThreshold: [{ AnyCritical: null }],
      provider: [AWS],
      channels: [{ InApp: null }, { Email: null }, { TeamsWebhook: null }],
      cooldownMinutes: 60n,
      findingType: ["UnauthorizedAccess"],
      assetId: ["i-0abc"],
      region: ["us-east-1"],
      escalationMinutes: [30n],
      escalationRecipient: ["oncall@example.com"],
    };
    await expect(actor.saveAlertRule(rule)).resolves.toBe(true);

    const rules = await actor.getAlertRules("default");
    const saved = rules.find((r) => r.id === "rule-1");
    expect(saved).toBeDefined();
    expect(saved!.channels).toEqual([
      { InApp: null },
      { Email: null },
      { TeamsWebhook: null },
    ]);
    expect(saved!.cooldownMinutes).toBe(60n);
  });

  it("deletes an alert rule", async () => {
    actor.setIdentity(admin);
    await expect(actor.deleteAlertRule("rule-1")).resolves.toBe(true);
    const rules = await actor.getAlertRules("default");
    expect(rules.some((r) => r.id === "rule-1")).toBe(false);
  });

  it("answers an empty notification log instead of trapping", async () => {
    actor.setIdentity(admin);
    await expect(
      actor.getNotificationLogs({ customer: "default", limit: 50n }),
    ).resolves.toEqual([]);
  });

  it("runs the escalation check without trapping", async () => {
    actor.setIdentity(admin);
    await expect(actor.runEscalationCheck()).resolves.toBeGreaterThanOrEqual(0n);
  });
});

describe("rate-limit backoff state", () => {
  it("answers a backoff read instead of trapping", async () => {
    actor.setIdentity(admin);
    const states = await actor.getRateLimitStates();
    expect(Array.isArray(states)).toBe(true);
  });

  it("answers a throttle-event read instead of trapping", async () => {
    actor.setIdentity(admin);
    await expect(actor.getThrottleEvents([], 50n)).resolves.toEqual([]);
  });

  it("resets a provider's backoff", async () => {
    actor.setIdentity(admin);
    const result = await actor.resetProviderBackoff(AWS);
    expect("ok" in result || "err" in result).toBe(true);
  });
});

describe("per-customer RBAC isolation", () => {
  it("rejects an anonymous caller on the reporting surface", async () => {
    // A freshly created actor calls as the anonymous principal until an
    // identity is set.
    const guest = pic!.createActor<_SERVICE>(idlFactory, canisterId);
    await expect(
      guest.runReportOnDemand(
        SECURITY_POSTURE,
        PERIOD_START,
        PERIOD_END,
        "default",
        [AWS],
      ),
    ).rejects.toThrow();
  });

  it("rejects an anonymous caller on the notification surface", async () => {
    const guest = pic!.createActor<_SERVICE>(idlFactory, canisterId);
    await expect(
      guest.saveNotificationRouting({
        customer: "default",
        cooldownMinutes: 60n,
        emailRecipients: [],
        teamsWebhookUrl: [],
        escalationMinutes: [],
      }),
    ).rejects.toThrow();
  });

  it("rejects an anonymous caller on the rate-limit surface", async () => {
    const guest = pic!.createActor<_SERVICE>(idlFactory, canisterId);
    await expect(guest.resetProviderBackoff(AWS)).rejects.toThrow();
  });
});
