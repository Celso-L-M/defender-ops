import { A as Subscribable, B as Null$1, C as noop, D as shouldThrowError, E as shallowEqualObjects, F as Func, G as Text$1, H as Principal$2, I as Int$1, J as Vec, K as Tuple, L as Nat$1, M as HttpAgent, N as Bool$1, P as Float64$1, Q as hexToBytes, R as Nat16$1, U as Record, V as Opt, W as Service, X as sha224, Y as Principal$3, Z as bytesToHex, c as require_react, et as __toESM, i as useQuery, j as Actor, o as useQueryClient, p as notifyManager, q as Variant, t as useActor, u as getDefaultState, y as hashKey, z as Nat8$1 } from "./dist-B87Aq9lc.js";
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/mutationObserver.js
var MutationObserver = class extends Subscribable {
	#client;
	#currentResult = void 0;
	#currentMutation;
	#mutateOptions;
	constructor(client, options) {
		super();
		this.#client = client;
		this.setOptions(options);
		this.bindMethods();
		this.#updateResult();
	}
	bindMethods() {
		this.mutate = this.mutate.bind(this);
		this.reset = this.reset.bind(this);
	}
	setOptions(options) {
		const prevOptions = this.options;
		this.options = this.#client.defaultMutationOptions(options);
		if (!shallowEqualObjects(this.options, prevOptions)) this.#client.getMutationCache().notify({
			type: "observerOptionsUpdated",
			mutation: this.#currentMutation,
			observer: this
		});
		if (prevOptions?.mutationKey && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) this.reset();
		else if (this.#currentMutation?.state.status === "pending") this.#currentMutation.setOptions(this.options);
	}
	onUnsubscribe() {
		if (!this.hasListeners()) this.#currentMutation?.removeObserver(this);
	}
	onMutationUpdate(action) {
		this.#updateResult();
		this.#notify(action);
	}
	getCurrentResult() {
		return this.#currentResult;
	}
	reset() {
		this.#currentMutation?.removeObserver(this);
		this.#currentMutation = void 0;
		this.#updateResult();
		this.#notify();
	}
	mutate(variables, options) {
		this.#mutateOptions = options;
		this.#currentMutation?.removeObserver(this);
		this.#currentMutation = this.#client.getMutationCache().build(this.#client, this.options);
		this.#currentMutation.addObserver(this);
		return this.#currentMutation.execute(variables);
	}
	#updateResult() {
		const state = this.#currentMutation?.state ?? getDefaultState();
		this.#currentResult = {
			...state,
			isPending: state.status === "pending",
			isSuccess: state.status === "success",
			isError: state.status === "error",
			isIdle: state.status === "idle",
			mutate: this.mutate,
			reset: this.reset
		};
	}
	#notify(action) {
		notifyManager.batch(() => {
			if (this.#mutateOptions && this.hasListeners()) {
				const variables = this.#currentResult.variables;
				const onMutateResult = this.#currentResult.context;
				const context = {
					client: this.#client,
					meta: this.options.meta,
					mutationKey: this.options.mutationKey
				};
				if (action?.type === "success") {
					try {
						this.#mutateOptions.onSuccess?.(action.data, variables, onMutateResult, context);
					} catch (e) {
						Promise.reject(e);
					}
					try {
						this.#mutateOptions.onSettled?.(action.data, null, variables, onMutateResult, context);
					} catch (e) {
						Promise.reject(e);
					}
				} else if (action?.type === "error") {
					try {
						this.#mutateOptions.onError?.(action.error, variables, onMutateResult, context);
					} catch (e) {
						Promise.reject(e);
					}
					try {
						this.#mutateOptions.onSettled?.(void 0, action.error, variables, onMutateResult, context);
					} catch (e) {
						Promise.reject(e);
					}
				}
			}
			this.listeners.forEach((listener) => {
				listener(this.#currentResult);
			});
		});
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-query@5.95.2_react@19.1.5/node_modules/@tanstack/react-query/build/modern/useMutation.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function useMutation(options, queryClient) {
	const client = useQueryClient(queryClient);
	const [observer] = import_react.useState(() => new MutationObserver(client, options));
	import_react.useEffect(() => {
		observer.setOptions(options);
	}, [observer, options]);
	const result = import_react.useSyncExternalStore(import_react.useCallback((onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)), [observer]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
	const mutate = import_react.useCallback((variables, mutateOptions) => {
		observer.mutate(variables, mutateOptions).catch(noop);
	}, [observer]);
	if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) throw result.error;
	return {
		...result,
		mutate,
		mutateAsync: result.mutate
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/lucide-react@0.511.0_react@19.1.5/node_modules/lucide-react/dist/esm/shared/src/utils.js
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
var toCamelCase = (string) => string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase());
var toPascalCase = (string) => {
	const camelCase = toCamelCase(string);
	return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
var mergeClasses = (...classes) => classes.filter((className, index, array) => {
	return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
var hasA11yProp = (props) => {
	for (const prop in props) if (prop.startsWith("aria-") || prop === "role" || prop === "title") return true;
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/lucide-react@0.511.0_react@19.1.5/node_modules/lucide-react/dist/esm/defaultAttributes.js
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var defaultAttributes = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round"
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/lucide-react@0.511.0_react@19.1.5/node_modules/lucide-react/dist/esm/Icon.js
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Icon = (0, import_react.forwardRef)(({ color = "currentColor", size = 24, strokeWidth = 2, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref) => (0, import_react.createElement)("svg", {
	ref,
	...defaultAttributes,
	width: size,
	height: size,
	stroke: color,
	strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
	className: mergeClasses("lucide", className),
	...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
	...rest
}, [...iconNode.map(([tag, attrs]) => (0, import_react.createElement)(tag, attrs)), ...Array.isArray(children) ? children : [children]]));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/lucide-react@0.511.0_react@19.1.5/node_modules/lucide-react/dist/esm/createLucideIcon.js
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var createLucideIcon = (iconName, iconNode) => {
	const Component = (0, import_react.forwardRef)(({ className, ...props }, ref) => (0, import_react.createElement)(Icon, {
		ref,
		iconNode,
		className: mergeClasses(`lucide-${toKebabCase(toPascalCase(iconName))}`, `lucide-${iconName}`, className),
		...props
	}));
	Component.displayName = toPascalCase(iconName);
	return Component;
};
// src/declarations/backend.did.js
var ProviderType$1 = Variant({
	"AWS": Null$1,
	"GCP": Null$1,
	"Azure": Null$1
});
var PlaybookResult = Record({
	"rawApiError": Opt(Text$1),
	"dryRunPreview": Opt(Text$1),
	"provider": Opt(ProviderType$1),
	"message": Text$1,
	"success": Bool$1
});
var CredentialError = Variant({
	"InvalidCredential": Text$1,
	"NotFound": Null$1,
	"NotAuthorized": Null$1,
	"VaultError": Text$1
});
var Result_1 = Variant({
	"ok": Null$1,
	"err": CredentialError
});
var VaultSecretName = Text$1;
var VaultError = Variant({
	"NotFound": Null$1,
	"NotAuthorized": Null$1,
	"AlreadyExists": Null$1,
	"InvalidName": Null$1
});
var Result = Variant({
	"ok": Null$1,
	"err": VaultError
});
var Result_8 = Variant({
	"ok": Text$1,
	"err": Text$1
});
var Value = Variant({
	"int": Int$1,
	"nat": Nat$1,
	"float": Float64$1,
	"bool": Bool$1,
	"null": Null$1,
	"text": Text$1
});
var Cell = Record({
	"value": Value,
	"name": Text$1
});
var Result__1 = Record({
	"hasMore": Bool$1,
	"rows": Vec(Vec(Cell))
});
var ComplianceFramework = Variant({
	"CISAws": Null$1,
	"CISGCP": Null$1,
	"SOC2": Null$1,
	"ISO27001": Null$1,
	"CISAzure": Null$1,
	"NISTCSF": Null$1
});
var ReportType = Variant({
	"IncidentSummary": Null$1,
	"SecurityPosture": Null$1,
	"ComplianceStatus": Null$1,
	"ThreatIntelSummary": Null$1
});
var Timestamp = Int$1;
var CustomerId = Text$1;
var Result_7 = Variant({
	"ok": Record({
		"csvData": Text$1,
		"reportId": Text$1
	}),
	"err": Text$1
});
var AlertStatus = Variant({
	"Open": Null$1,
	"InProgress": Null$1,
	"Resolved": Null$1
});
var MitreTag = Record({
	"techniqueId": Text$1,
	"technique": Text$1,
	"tactic": Text$1
});
var Severity = Variant({
	"Low": Null$1,
	"High": Null$1,
	"Medium": Null$1,
	"Critical": Null$1,
	"Unknown": Null$1
});
var DomainRep = Record({
	"suspiciousVotes": Nat$1,
	"maliciousVotes": Nat$1,
	"cleanVotes": Nat$1,
	"lastAnalysisDate": Text$1
});
var IpReputation = Record({
	"isp": Text$1,
	"country": Text$1,
	"lastReported": Text$1,
	"totalReports": Nat$1,
	"abuseScore": Nat$1
});
var MitreDetail = Record({
	"techniqueName": Text$1,
	"tacticName": Text$1,
	"mitigations": Text$1,
	"description": Text$1
});
var AlertEnrichment = Record({
	"domainRep": Opt(DomainRep),
	"knownMaliciousIp": Bool$1,
	"ipReputation": Opt(IpReputation),
	"enrichedAt": Opt(Text$1),
	"mitreDetail": Opt(MitreDetail)
});
var NormalizedAlert = Record({
	"id": Text$1,
	"region": Opt(Text$1),
	"status": AlertStatus,
	"mitre": Opt(MitreTag),
	"title": Text$1,
	"findingId": Text$1,
	"provider": ProviderType$1,
	"accountId": Opt(Text$1),
	"customer": Text$1,
	"assetId": Opt(Text$1),
	"owner": Opt(Text$1),
	"rawFindingId": Text$1,
	"recurrenceCount": Nat$1,
	"description": Text$1,
	"ingestionSource": Opt(Variant({
		"Poll": Null$1,
		"Webhook": Null$1
	})),
	"originalSeverity": Text$1,
	"timestamp": Int$1,
	"assetType": Opt(Text$1),
	"severity": Severity,
	"enrichment": Opt(AlertEnrichment)
});
var RuleSeverityThreshold = Variant({
	"All": Null$1,
	"AnyHigh": Null$1,
	"CriticalOrHigh": Null$1,
	"AnyCritical": Null$1,
	"AnyLow": Null$1,
	"AnyMedium": Null$1
});
var NotificationChannel = Variant({
	"Email": Null$1,
	"InApp": Null$1,
	"TeamsWebhook": Null$1
});
var AlertRule = Record({
	"id": Text$1,
	"region": Opt(Text$1),
	"escalationRecipient": Opt(Text$1),
	"severityThreshold": Opt(RuleSeverityThreshold),
	"provider": Opt(ProviderType$1),
	"customer": Text$1,
	"assetId": Opt(Text$1),
	"name": Text$1,
	"escalationMinutes": Opt(Nat$1),
	"channels": Vec(NotificationChannel),
	"cooldownMinutes": Nat$1,
	"enabled": Bool$1,
	"findingType": Opt(Text$1)
});
var AssetType = Variant({
	"S3": Null$1,
	"AzureVM": Null$1,
	"EC2": Null$1,
	"RDS": Null$1,
	"AzureDatabase": Null$1,
	"GCPStorage": Null$1,
	"GCPCloudSQL": Null$1,
	"Lambda": Null$1,
	"AzureStorage": Null$1,
	"GCPCompute": Null$1,
	"Other": Null$1
});
var Asset = Record({
	"id": Text$1,
	"region": Text$1,
	"provider": ProviderType$1,
	"accountId": Text$1,
	"customer": Text$1,
	"name": Text$1,
	"tags": Vec(Tuple(Text$1, Text$1)),
	"assetType": AssetType,
	"lastSeen": Int$1,
	"riskScore": Nat$1,
	"openFindings": Nat$1
});
var AuditLogEntry = Record({
	"id": Text$1,
	"action": Text$1,
	"customer": Text$1,
	"actorId": Text$1,
	"timestamp": Int$1,
	"details": Text$1
});
var ControlStatus = Variant({
	"Passing": Null$1,
	"NoCoverage": Null$1,
	"Failing": Null$1
});
var ComplianceControl = Record({
	"status": ControlStatus,
	"title": Text$1,
	"provider": Opt(ProviderType$1),
	"framework": ComplianceFramework,
	"failingFindings": Nat$1,
	"description": Text$1,
	"controlId": Text$1,
	"remediationGuidance": Text$1,
	"passingFindings": Nat$1
});
var ComplianceTrendEntry = Record({
	"passingControls": Nat$1,
	"framework": ComplianceFramework,
	"totalControls": Nat$1,
	"score": Nat$1,
	"weekTimestamp": Int$1
});
var IncidentStatus = Variant({
	"Open": Null$1,
	"Investigating": Null$1,
	"Resolved": Null$1
});
var CorrelatedIncident = Record({
	"status": IncidentStatus,
	"incidentId": Text$1,
	"customer": Text$1,
	"sourceAlerts": Vec(Text$1),
	"detectedAt": Int$1,
	"assignedOwner": Opt(Text$1),
	"sourceIp": Opt(Text$1),
	"sourceProviders": Vec(ProviderType$1),
	"timeDeltaMinutes": Float64$1,
	"notes": Opt(Text$1),
	"affectedResources": Vec(Text$1),
	"severity": Severity,
	"correlationWindowMinutes": Nat$1,
	"incidentType": Text$1
});
var CorrelationStats = Record({
	"totalAllTime": Nat$1,
	"byType": Vec(Tuple(Text$1, Nat$1)),
	"totalToday": Nat$1,
	"totalThisWeek": Nat$1
});
var CredentialHealth = Variant({
	"Error": Text$1,
	"Authenticating": Null$1,
	"Valid": Null$1,
	"ExpiringSoon": Text$1,
	"Expired": Null$1
});
var CredentialHealthStatus = Record({
	"provider": Text$1,
	"expiryNs": Opt(Int$1),
	"health": CredentialHealth
});
var PollingStatus = Variant({
	"Error": Null$1,
	"AuthPaused": Null$1,
	"Inactive": Null$1,
	"Active": Null$1
});
var PollingInterval = Variant({
	"OneHour": Null$1,
	"ThirtyMin": Null$1,
	"FifteenMin": Null$1,
	"FiveMin": Null$1
});
var ProviderPollingState = Record({
	"status": PollingStatus,
	"provider": ProviderType$1,
	"interval": PollingInterval,
	"lastPollAttempt": Opt(Int$1),
	"lastSuccessfulPoll": Opt(Int$1),
	"findingsToday": Nat$1,
	"lastError": Opt(Text$1),
	"consecutiveFailures": Nat$1
});
var IngestionStats = Record({
	"providerStates": Vec(ProviderPollingState),
	"activeProviders": Nat$1,
	"totalFindingsToday": Nat$1
});
var Cursor = Text$1;
var Page = Record({
	"items": Vec(NormalizedAlert),
	"nextCursor": Opt(Cursor)
});
var NotificationStatus = Variant({
	"Failed": Null$1,
	"Sent": Null$1,
	"Acknowledged": Null$1
});
var NotificationLog = Record({
	"id": Text$1,
	"status": NotificationStatus,
	"acknowledgedAt": Opt(Int$1),
	"customer": Text$1,
	"ruleId": Text$1,
	"recipient": Text$1,
	"alertId": Text$1,
	"acknowledged": Bool$1,
	"timestamp": Int$1,
	"channel": NotificationChannel
});
var NotificationRouting = Record({
	"customer": CustomerId,
	"escalationMinutes": Opt(Nat$1),
	"cooldownMinutes": Nat$1,
	"teamsWebhookUrl": Opt(Text$1),
	"emailRecipients": Vec(Text$1)
});
var CredentialFieldView = Record({
	"name": Text$1,
	"maskedValue": Text$1,
	"isSet": Bool$1
});
var ProviderCredentialStatus = Record({
	"provider": ProviderType$1,
	"fields": Vec(CredentialFieldView),
	"updatedAt": Opt(Int$1),
	"configured": Bool$1
});
var RateLimitBackoffState = Record({
	"lastResetAt": Opt(Timestamp),
	"provider": ProviderType$1,
	"nextAttemptAt": Opt(Timestamp),
	"lastThrottledAt": Opt(Timestamp),
	"backoffSeconds": Nat$1,
	"consecutiveThrottles": Nat$1
});
var RawFinding = Record({
	"id": Text$1,
	"region": Opt(Text$1),
	"title": Text$1,
	"findingId": Text$1,
	"provider": ProviderType$1,
	"accountId": Opt(Text$1),
	"description": Text$1,
	"rawMetadata": Text$1,
	"timestamp": Int$1,
	"severity": Severity
});
var ReportRecipientConfig = Record({
	"customer": CustomerId,
	"reportType": ReportType,
	"recipients": Vec(Text$1)
});
var ReportTrigger = Variant({
	"ScheduledWeekly": Null$1,
	"OnDemand": Null$1,
	"ScheduledMonthly": Null$1
});
var ReportDeliveryOutcome = Record({
	"recipient": Text$1,
	"sentAt": Opt(Timestamp),
	"error": Opt(Text$1),
	"success": Bool$1
});
var ReportRunOutcome = Variant({
	"Failed": Text$1,
	"Succeeded": Null$1
});
var ReportRun = Record({
	"trigger": ReportTrigger,
	"deliveries": Vec(ReportDeliveryOutcome),
	"customer": CustomerId,
	"providerScope": Vec(ProviderType$1),
	"generatedAt": Timestamp,
	"reportType": ReportType,
	"periodEnd": Timestamp,
	"recipients": Vec(Text$1),
	"periodStart": Timestamp,
	"outcome": ReportRunOutcome,
	"runId": Text$1
});
var GeneratedReport = Record({
	"csvData": Opt(Text$1),
	"customer": Text$1,
	"providerScope": Vec(Text$1),
	"generatedAt": Text$1,
	"generatedBy": Text$1,
	"dateRangeStart": Text$1,
	"dateRangeEnd": Text$1,
	"reportType": Text$1,
	"reportId": Text$1,
	"format": Text$1
});
var ThrottleEvent = Record({
	"id": Text$1,
	"provider": ProviderType$1,
	"message": Text$1,
	"timestamp": Timestamp,
	"retryAfterSec": Opt(Nat$1),
	"statusCode": Opt(Nat$1)
});
var TimelineEvent = Record({
	"id": Text$1,
	"title": Text$1,
	"provider": Opt(ProviderType$1),
	"customer": Text$1,
	"description": Text$1,
	"timestamp": Int$1,
	"severity": Opt(Severity),
	"eventType": Text$1
});
var SearchResult = Record({
	"id": Text$1,
	"title": Text$1,
	"provider": Opt(ProviderType$1),
	"customer": Text$1,
	"description": Text$1,
	"timestamp": Int$1,
	"sourceModule": Text$1,
	"severity": Opt(Severity)
});
var UserAssignmentView = Record({
	"principal": Text$1,
	"providers": Vec(ProviderType$1)
});
var VaultEntryView = Record({
	"provider": ProviderType$1,
	"name": VaultSecretName,
	"createdAt": Int$1,
	"updatedAt": Int$1,
	"maskedValue": Text$1
});
var RateLimitError = Variant({
	"UnknownProvider": Null$1,
	"NotAuthorized": Null$1
});
var Result_6 = Variant({
	"ok": Null$1,
	"err": RateLimitError
});
var Result_5 = Variant({
	"ok": Text$1,
	"err": VaultError
});
var ReportingError = Variant({
	"NotFound": Null$1,
	"NotAuthorized": Null$1,
	"InvalidPeriod": Null$1,
	"InvalidRecipient": Text$1
});
var Result_4 = Variant({
	"ok": ReportRun,
	"err": ReportingError
});
var NotificationError = Variant({
	"InvalidWebhookUrl": Text$1,
	"NotFound": Null$1,
	"NotAuthorized": Null$1,
	"InvalidRule": Text$1
});
var Result_3 = Variant({
	"ok": Null$1,
	"err": NotificationError
});
var AwsCredentialInput = Record({
	"externalId": Opt(Text$1),
	"roleArn": Text$1,
	"regions": Vec(Text$1)
});
var GcpCredentialInput = Record({
	"serviceAccountJson": Text$1,
	"projectIds": Vec(Text$1)
});
var AzureCredentialInput = Record({
	"clientId": Text$1,
	"subscriptionIds": Vec(Text$1),
	"tenantId": Text$1,
	"clientSecret": Text$1
});
var ProviderCredentialInput = Variant({
	"AWS": AwsCredentialInput,
	"GCP": GcpCredentialInput,
	"Azure": AzureCredentialInput
});
var Result_2 = Variant({
	"ok": Null$1,
	"err": ReportingError
});
var ConnectionTestResult = Variant({
	"Success": Text$1,
	"Failure": Text$1
});
var HttpHeader = Record({
	"value": Text$1,
	"name": Text$1
});
var HttpRequestResult = Record({
	"status": Nat$1,
	"body": Vec(Nat8$1),
	"headers": Vec(HttpHeader)
});
var TransformationInput = Record({
	"context": Vec(Nat8$1),
	"response": HttpRequestResult
});
var TransformationOutput = Record({
	"status": Nat$1,
	"body": Vec(Nat8$1),
	"headers": Vec(HttpHeader)
});
Service({
	"acknowledgeNotification": Func([Text$1], [Bool$1], []),
	"assignProviderAccess": Func([Principal$2, Vec(ProviderType$1)], [], []),
	"blockIp": Func([Record({
		"ip": Text$1,
		"customer": Text$1,
		"providers": Vec(ProviderType$1),
		"dryRun": Bool$1
	})], [PlaybookResult], []),
	"clearProviderCredential": Func([ProviderType$1], [Result_1], []),
	"deleteAlertRule": Func([Text$1], [Bool$1], []),
	"deleteReport": Func([Text$1, Text$1], [], []),
	"deleteVaultSecret": Func([ProviderType$1, VaultSecretName], [Result], []),
	"disableAzureAdAccount": Func([Record({
		"customer": Text$1,
		"userPrincipalName": Text$1,
		"dryRun": Bool$1
	})], [PlaybookResult], []),
	"enrichAlertPublic": Func([Text$1, Text$1], [Result_8], []),
	"escalateToIncident": Func([Record({
		"customer": Text$1,
		"assignedOwner": Opt(Text$1),
		"alertId": Text$1,
		"notes": Opt(Text$1),
		"severity": Text$1,
		"dryRun": Bool$1
	})], [PlaybookResult], []),
	"execute": Func([Text$1], [Result__1], ["query"]),
	"exportComplianceCsv": Func([ComplianceFramework], [Text$1], ["query"]),
	"exportCompliancePdf": Func([ComplianceFramework], [Vec(Nat8$1)], ["query"]),
	"exportReportPdf": Func([
		ReportType,
		Timestamp,
		Timestamp,
		CustomerId,
		Vec(ProviderType$1)
	], [Vec(Nat8$1)], ["query"]),
	"forceGcpIamReview": Func([Record({
		"customer": Text$1,
		"projectId": Text$1,
		"dryRun": Bool$1
	})], [PlaybookResult], []),
	"generateReport": Func([Record({
		"customer": Text$1,
		"providerScope": Vec(Text$1),
		"dateRangeStart": Text$1,
		"dateRangeEnd": Text$1,
		"reportType": Text$1
	})], [Result_7], []),
	"getAlertById": Func([Text$1], [Opt(NormalizedAlert)], ["query"]),
	"getAlertRules": Func([Text$1], [Vec(AlertRule)], ["query"]),
	"getAlertsForCorrelation": Func([Vec(Text$1)], [Vec(NormalizedAlert)], ["query"]),
	"getApiDoc": Func([], [Text$1], ["query"]),
	"getAssetById": Func([Text$1], [Opt(Asset)], ["query"]),
	"getAssetFindings": Func([Text$1], [Vec(NormalizedAlert)], ["query"]),
	"getAssets": Func([Record({
		"region": Opt(Text$1),
		"minRiskScore": Opt(Nat$1),
		"provider": Opt(ProviderType$1),
		"customer": Text$1,
		"limit": Nat$1,
		"assetType": Opt(AssetType)
	})], [Vec(Asset)], ["query"]),
	"getAuditLog": Func([Text$1, Nat$1], [Vec(AuditLogEntry)], ["query"]),
	"getComplianceControlGaps": Func([ComplianceFramework], [Vec(ComplianceControl)], ["query"]),
	"getComplianceStatus": Func([ComplianceFramework, Opt(ProviderType$1)], [Record({
		"total": Nat$1,
		"failing": Nat$1,
		"controls": Vec(ComplianceControl),
		"score": Nat$1,
		"passing": Nat$1
	})], ["query"]),
	"getComplianceTrend": Func([ComplianceFramework], [Vec(ComplianceTrendEntry)], ["query"]),
	"getCorrelatedIncidentById": Func([Text$1], [Opt(CorrelatedIncident)], ["query"]),
	"getCorrelatedIncidents": Func([Nat$1], [Vec(Tuple(Text$1, CorrelatedIncident))], ["query"]),
	"getCorrelationStats": Func([], [CorrelationStats], ["query"]),
	"getCredentialHealth": Func([], [Vec(CredentialHealthStatus)], ["query"]),
	"getEnrichmentKeys": Func([], [Record({
		"abuseIpdbKeySet": Bool$1,
		"virusTotalKeySet": Bool$1
	})], []),
	"getFailedIngestions": Func([Opt(ProviderType$1), Nat$1], [Vec(Record({
		"id": Text$1,
		"status": Text$1,
		"provider": Text$1,
		"errorMessage": Text$1,
		"errorType": Text$1,
		"timestamp": Int$1,
		"rawPayload": Text$1
	}))], ["query"]),
	"getIngestionStats": Func([], [IngestionStats], ["query"]),
	"getMyProviders": Func([], [Vec(ProviderType$1)], ["query"]),
	"getNormalizedAlerts": Func([Record({
		"status": Opt(AlertStatus),
		"provider": Opt(ProviderType$1),
		"customer": Text$1,
		"cursor": Opt(Cursor),
		"limit": Nat$1,
		"severity": Opt(Severity)
	})], [Page], ["query"]),
	"getNotificationLogs": Func([Record({
		"customer": Text$1,
		"limit": Nat$1
	})], [Vec(NotificationLog)], ["query"]),
	"getNotificationRouting": Func([CustomerId], [Opt(NotificationRouting)], ["query"]),
	"getPipelineHealth": Func([], [Vec(Record({
		"provider": Text$1,
		"failedIngestionCount": Nat$1,
		"pollEventsToday": Nat$1,
		"normalizationSuccessRate": Float64$1,
		"webhookEventsToday": Nat$1,
		"avgLatencyMs": Float64$1
	}))], ["query"]),
	"getProviderCredentialStatus": Func([ProviderType$1], [ProviderCredentialStatus], ["query"]),
	"getProviderStates": Func([], [Vec(ProviderPollingState)], ["query"]),
	"getRateLimitStates": Func([], [Vec(RateLimitBackoffState)], ["query"]),
	"getRawFindings": Func([
		ProviderType$1,
		Nat$1,
		Nat$1
	], [Record({
		"hasMore": Bool$1,
		"totalCount": Nat$1,
		"items": Vec(RawFinding)
	})], ["query"]),
	"getReportCsv": Func([Text$1, Text$1], [Opt(Text$1)], []),
	"getReportEmailConfig": Func([Text$1], [Vec(Record({
		"reportType": Text$1,
		"recipients": Vec(Text$1)
	}))], []),
	"getReportRecipients": Func([ReportType, CustomerId], [Opt(ReportRecipientConfig)], ["query"]),
	"getReportRun": Func([Text$1, CustomerId], [Opt(ReportRun)], ["query"]),
	"getReportRuns": Func([CustomerId, Nat$1], [Vec(ReportRun)], ["query"]),
	"getReports": Func([Text$1], [Vec(GeneratedReport)], []),
	"getThrottleEvents": Func([Opt(ProviderType$1), Nat$1], [Vec(ThrottleEvent)], ["query"]),
	"getTimeline": Func([Text$1, Nat$1], [Vec(TimelineEvent)], ["query"]),
	"getWebhookSecretStatus": Func([], [Record({
		"azureSet": Bool$1,
		"gcpSet": Bool$1,
		"awsSet": Bool$1
	})], []),
	"getWebhookStats": Func([], [Record({
		"webhookNormalizationRate": Float64$1,
		"webhookEventsToday": Nat$1
	})], ["query"]),
	"globalSearch": Func([
		Text$1,
		Text$1,
		Nat$1
	], [Record({
		"hasMore": Bool$1,
		"results": Vec(SearchResult)
	})], ["query"]),
	"hasAdminCredentials": Func([], [Bool$1], ["query"]),
	"http_request": Func([Record({
		"url": Text$1,
		"method": Text$1,
		"body": Vec(Nat8$1),
		"headers": Vec(Tuple(Text$1, Text$1))
	})], [Record({
		"body": Vec(Nat8$1),
		"headers": Vec(Tuple(Text$1, Text$1)),
		"upgrade": Opt(Bool$1),
		"streaming_strategy": Opt(Null$1),
		"status_code": Nat16$1
	})], ["query"]),
	"http_request_update": Func([Record({
		"url": Text$1,
		"method": Text$1,
		"body": Vec(Nat8$1),
		"headers": Vec(Tuple(Text$1, Text$1))
	})], [Record({
		"body": Vec(Nat8$1),
		"headers": Vec(Tuple(Text$1, Text$1)),
		"upgrade": Opt(Bool$1),
		"streaming_strategy": Opt(Null$1),
		"status_code": Nat16$1
	})], []),
	"isolateResource": Func([Record({
		"provider": ProviderType$1,
		"customer": Text$1,
		"resourceId": Text$1,
		"dryRun": Bool$1
	})], [PlaybookResult], []),
	"listUserAssignments": Func([], [Vec(UserAssignmentView)], ["query"]),
	"listVaultSecrets": Func([ProviderType$1], [Vec(VaultEntryView)], ["query"]),
	"removeProviderAccess": Func([Principal$2, ProviderType$1], [], []),
	"resetProviderBackoff": Func([ProviderType$1], [Result_6], []),
	"revealVaultSecret": Func([ProviderType$1, VaultSecretName], [Result_5], []),
	"revokeIamCredentials": Func([Record({
		"provider": ProviderType$1,
		"customer": Text$1,
		"userId": Text$1,
		"accessKeyId": Opt(Text$1),
		"dryRun": Bool$1
	})], [PlaybookResult], []),
	"runEscalationCheck": Func([], [Nat$1], []),
	"runReportOnDemand": Func([
		ReportType,
		Timestamp,
		Timestamp,
		CustomerId,
		Vec(ProviderType$1)
	], [Result_4], []),
	"runScheduledReport": Func([
		ReportType,
		ReportTrigger,
		CustomerId,
		Vec(ProviderType$1)
	], [Result_4], []),
	"saveAlertRule": Func([AlertRule], [Bool$1], []),
	"saveEnrichmentKeys": Func([Record({
		"virusTotalKey": Opt(Text$1),
		"abuseIpdbKey": Opt(Text$1)
	})], [], []),
	"saveNotificationRouting": Func([NotificationRouting], [Result_3], []),
	"saveProviderCredential": Func([ProviderCredentialInput], [Result_1], []),
	"saveReportEmailConfig": Func([Record({
		"customer": Text$1,
		"reportType": Text$1,
		"recipients": Vec(Text$1)
	})], [], []),
	"saveReportRecipients": Func([ReportRecipientConfig], [Result_2], []),
	"saveVaultSecret": Func([
		ProviderType$1,
		VaultSecretName,
		Text$1
	], [Result], []),
	"saveWebhookSecret": Func([ProviderType$1, Text$1], [], []),
	"schema": Func([], [Text$1], ["query"]),
	"setPollingInterval": Func([ProviderType$1, PollingInterval], [], []),
	"testAwsConnection": Func([], [ConnectionTestResult], []),
	"testAzureConnection": Func([], [ConnectionTestResult], []),
	"testGcpConnection": Func([], [ConnectionTestResult], []),
	"testProviderConnection": Func([ProviderType$1], [ConnectionTestResult], []),
	"transform": Func([TransformationInput], [TransformationOutput], ["query"]),
	"triggerPoll": Func([ProviderType$1], [], []),
	"updateAlertStatus": Func([
		Text$1,
		AlertStatus,
		Opt(Text$1)
	], [Bool$1], []),
	"updateCorrelatedIncidentStatus": Func([
		Text$1,
		IncidentStatus,
		Opt(Text$1),
		Opt(Text$1)
	], [Bool$1], []),
	"updateProviderCredential": Func([ProviderCredentialInput], [Result_1], []),
	"updateVaultSecret": Func([
		ProviderType$1,
		VaultSecretName,
		Text$1
	], [Result], [])
});
var idlFactory = ({ IDL }) => {
	const ProviderType = IDL.Variant({
		"AWS": IDL.Null,
		"GCP": IDL.Null,
		"Azure": IDL.Null
	});
	const PlaybookResult = IDL.Record({
		"rawApiError": IDL.Opt(IDL.Text),
		"dryRunPreview": IDL.Opt(IDL.Text),
		"provider": IDL.Opt(ProviderType),
		"message": IDL.Text,
		"success": IDL.Bool
	});
	const CredentialError = IDL.Variant({
		"InvalidCredential": IDL.Text,
		"NotFound": IDL.Null,
		"NotAuthorized": IDL.Null,
		"VaultError": IDL.Text
	});
	const Result_1 = IDL.Variant({
		"ok": IDL.Null,
		"err": CredentialError
	});
	const VaultSecretName = IDL.Text;
	const VaultError = IDL.Variant({
		"NotFound": IDL.Null,
		"NotAuthorized": IDL.Null,
		"AlreadyExists": IDL.Null,
		"InvalidName": IDL.Null
	});
	const Result = IDL.Variant({
		"ok": IDL.Null,
		"err": VaultError
	});
	const Result_8 = IDL.Variant({
		"ok": IDL.Text,
		"err": IDL.Text
	});
	const Value = IDL.Variant({
		"int": IDL.Int,
		"nat": IDL.Nat,
		"float": IDL.Float64,
		"bool": IDL.Bool,
		"null": IDL.Null,
		"text": IDL.Text
	});
	const Cell = IDL.Record({
		"value": Value,
		"name": IDL.Text
	});
	const Result__1 = IDL.Record({
		"hasMore": IDL.Bool,
		"rows": IDL.Vec(IDL.Vec(Cell))
	});
	const ComplianceFramework = IDL.Variant({
		"CISAws": IDL.Null,
		"CISGCP": IDL.Null,
		"SOC2": IDL.Null,
		"ISO27001": IDL.Null,
		"CISAzure": IDL.Null,
		"NISTCSF": IDL.Null
	});
	const ReportType = IDL.Variant({
		"IncidentSummary": IDL.Null,
		"SecurityPosture": IDL.Null,
		"ComplianceStatus": IDL.Null,
		"ThreatIntelSummary": IDL.Null
	});
	const Timestamp = IDL.Int;
	const CustomerId = IDL.Text;
	const Result_7 = IDL.Variant({
		"ok": IDL.Record({
			"csvData": IDL.Text,
			"reportId": IDL.Text
		}),
		"err": IDL.Text
	});
	const AlertStatus = IDL.Variant({
		"Open": IDL.Null,
		"InProgress": IDL.Null,
		"Resolved": IDL.Null
	});
	const MitreTag = IDL.Record({
		"techniqueId": IDL.Text,
		"technique": IDL.Text,
		"tactic": IDL.Text
	});
	const Severity = IDL.Variant({
		"Low": IDL.Null,
		"High": IDL.Null,
		"Medium": IDL.Null,
		"Critical": IDL.Null,
		"Unknown": IDL.Null
	});
	const DomainRep = IDL.Record({
		"suspiciousVotes": IDL.Nat,
		"maliciousVotes": IDL.Nat,
		"cleanVotes": IDL.Nat,
		"lastAnalysisDate": IDL.Text
	});
	const IpReputation = IDL.Record({
		"isp": IDL.Text,
		"country": IDL.Text,
		"lastReported": IDL.Text,
		"totalReports": IDL.Nat,
		"abuseScore": IDL.Nat
	});
	const MitreDetail = IDL.Record({
		"techniqueName": IDL.Text,
		"tacticName": IDL.Text,
		"mitigations": IDL.Text,
		"description": IDL.Text
	});
	const AlertEnrichment = IDL.Record({
		"domainRep": IDL.Opt(DomainRep),
		"knownMaliciousIp": IDL.Bool,
		"ipReputation": IDL.Opt(IpReputation),
		"enrichedAt": IDL.Opt(IDL.Text),
		"mitreDetail": IDL.Opt(MitreDetail)
	});
	const NormalizedAlert = IDL.Record({
		"id": IDL.Text,
		"region": IDL.Opt(IDL.Text),
		"status": AlertStatus,
		"mitre": IDL.Opt(MitreTag),
		"title": IDL.Text,
		"findingId": IDL.Text,
		"provider": ProviderType,
		"accountId": IDL.Opt(IDL.Text),
		"customer": IDL.Text,
		"assetId": IDL.Opt(IDL.Text),
		"owner": IDL.Opt(IDL.Text),
		"rawFindingId": IDL.Text,
		"recurrenceCount": IDL.Nat,
		"description": IDL.Text,
		"ingestionSource": IDL.Opt(IDL.Variant({
			"Poll": IDL.Null,
			"Webhook": IDL.Null
		})),
		"originalSeverity": IDL.Text,
		"timestamp": IDL.Int,
		"assetType": IDL.Opt(IDL.Text),
		"severity": Severity,
		"enrichment": IDL.Opt(AlertEnrichment)
	});
	const RuleSeverityThreshold = IDL.Variant({
		"All": IDL.Null,
		"AnyHigh": IDL.Null,
		"CriticalOrHigh": IDL.Null,
		"AnyCritical": IDL.Null,
		"AnyLow": IDL.Null,
		"AnyMedium": IDL.Null
	});
	const NotificationChannel = IDL.Variant({
		"Email": IDL.Null,
		"InApp": IDL.Null,
		"TeamsWebhook": IDL.Null
	});
	const AlertRule = IDL.Record({
		"id": IDL.Text,
		"region": IDL.Opt(IDL.Text),
		"escalationRecipient": IDL.Opt(IDL.Text),
		"severityThreshold": IDL.Opt(RuleSeverityThreshold),
		"provider": IDL.Opt(ProviderType),
		"customer": IDL.Text,
		"assetId": IDL.Opt(IDL.Text),
		"name": IDL.Text,
		"escalationMinutes": IDL.Opt(IDL.Nat),
		"channels": IDL.Vec(NotificationChannel),
		"cooldownMinutes": IDL.Nat,
		"enabled": IDL.Bool,
		"findingType": IDL.Opt(IDL.Text)
	});
	const AssetType = IDL.Variant({
		"S3": IDL.Null,
		"AzureVM": IDL.Null,
		"EC2": IDL.Null,
		"RDS": IDL.Null,
		"AzureDatabase": IDL.Null,
		"GCPStorage": IDL.Null,
		"GCPCloudSQL": IDL.Null,
		"Lambda": IDL.Null,
		"AzureStorage": IDL.Null,
		"GCPCompute": IDL.Null,
		"Other": IDL.Null
	});
	const Asset = IDL.Record({
		"id": IDL.Text,
		"region": IDL.Text,
		"provider": ProviderType,
		"accountId": IDL.Text,
		"customer": IDL.Text,
		"name": IDL.Text,
		"tags": IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
		"assetType": AssetType,
		"lastSeen": IDL.Int,
		"riskScore": IDL.Nat,
		"openFindings": IDL.Nat
	});
	const AuditLogEntry = IDL.Record({
		"id": IDL.Text,
		"action": IDL.Text,
		"customer": IDL.Text,
		"actorId": IDL.Text,
		"timestamp": IDL.Int,
		"details": IDL.Text
	});
	const ControlStatus = IDL.Variant({
		"Passing": IDL.Null,
		"NoCoverage": IDL.Null,
		"Failing": IDL.Null
	});
	const ComplianceControl = IDL.Record({
		"status": ControlStatus,
		"title": IDL.Text,
		"provider": IDL.Opt(ProviderType),
		"framework": ComplianceFramework,
		"failingFindings": IDL.Nat,
		"description": IDL.Text,
		"controlId": IDL.Text,
		"remediationGuidance": IDL.Text,
		"passingFindings": IDL.Nat
	});
	const ComplianceTrendEntry = IDL.Record({
		"passingControls": IDL.Nat,
		"framework": ComplianceFramework,
		"totalControls": IDL.Nat,
		"score": IDL.Nat,
		"weekTimestamp": IDL.Int
	});
	const IncidentStatus = IDL.Variant({
		"Open": IDL.Null,
		"Investigating": IDL.Null,
		"Resolved": IDL.Null
	});
	const CorrelatedIncident = IDL.Record({
		"status": IncidentStatus,
		"incidentId": IDL.Text,
		"customer": IDL.Text,
		"sourceAlerts": IDL.Vec(IDL.Text),
		"detectedAt": IDL.Int,
		"assignedOwner": IDL.Opt(IDL.Text),
		"sourceIp": IDL.Opt(IDL.Text),
		"sourceProviders": IDL.Vec(ProviderType),
		"timeDeltaMinutes": IDL.Float64,
		"notes": IDL.Opt(IDL.Text),
		"affectedResources": IDL.Vec(IDL.Text),
		"severity": Severity,
		"correlationWindowMinutes": IDL.Nat,
		"incidentType": IDL.Text
	});
	const CorrelationStats = IDL.Record({
		"totalAllTime": IDL.Nat,
		"byType": IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)),
		"totalToday": IDL.Nat,
		"totalThisWeek": IDL.Nat
	});
	const CredentialHealth = IDL.Variant({
		"Error": IDL.Text,
		"Authenticating": IDL.Null,
		"Valid": IDL.Null,
		"ExpiringSoon": IDL.Text,
		"Expired": IDL.Null
	});
	const CredentialHealthStatus = IDL.Record({
		"provider": IDL.Text,
		"expiryNs": IDL.Opt(IDL.Int),
		"health": CredentialHealth
	});
	const PollingStatus = IDL.Variant({
		"Error": IDL.Null,
		"AuthPaused": IDL.Null,
		"Inactive": IDL.Null,
		"Active": IDL.Null
	});
	const PollingInterval = IDL.Variant({
		"OneHour": IDL.Null,
		"ThirtyMin": IDL.Null,
		"FifteenMin": IDL.Null,
		"FiveMin": IDL.Null
	});
	const ProviderPollingState = IDL.Record({
		"status": PollingStatus,
		"provider": ProviderType,
		"interval": PollingInterval,
		"lastPollAttempt": IDL.Opt(IDL.Int),
		"lastSuccessfulPoll": IDL.Opt(IDL.Int),
		"findingsToday": IDL.Nat,
		"lastError": IDL.Opt(IDL.Text),
		"consecutiveFailures": IDL.Nat
	});
	const IngestionStats = IDL.Record({
		"providerStates": IDL.Vec(ProviderPollingState),
		"activeProviders": IDL.Nat,
		"totalFindingsToday": IDL.Nat
	});
	const Cursor = IDL.Text;
	const Page = IDL.Record({
		"items": IDL.Vec(NormalizedAlert),
		"nextCursor": IDL.Opt(Cursor)
	});
	const NotificationStatus = IDL.Variant({
		"Failed": IDL.Null,
		"Sent": IDL.Null,
		"Acknowledged": IDL.Null
	});
	const NotificationLog = IDL.Record({
		"id": IDL.Text,
		"status": NotificationStatus,
		"acknowledgedAt": IDL.Opt(IDL.Int),
		"customer": IDL.Text,
		"ruleId": IDL.Text,
		"recipient": IDL.Text,
		"alertId": IDL.Text,
		"acknowledged": IDL.Bool,
		"timestamp": IDL.Int,
		"channel": NotificationChannel
	});
	const NotificationRouting = IDL.Record({
		"customer": CustomerId,
		"escalationMinutes": IDL.Opt(IDL.Nat),
		"cooldownMinutes": IDL.Nat,
		"teamsWebhookUrl": IDL.Opt(IDL.Text),
		"emailRecipients": IDL.Vec(IDL.Text)
	});
	const CredentialFieldView = IDL.Record({
		"name": IDL.Text,
		"maskedValue": IDL.Text,
		"isSet": IDL.Bool
	});
	const ProviderCredentialStatus = IDL.Record({
		"provider": ProviderType,
		"fields": IDL.Vec(CredentialFieldView),
		"updatedAt": IDL.Opt(IDL.Int),
		"configured": IDL.Bool
	});
	const RateLimitBackoffState = IDL.Record({
		"lastResetAt": IDL.Opt(Timestamp),
		"provider": ProviderType,
		"nextAttemptAt": IDL.Opt(Timestamp),
		"lastThrottledAt": IDL.Opt(Timestamp),
		"backoffSeconds": IDL.Nat,
		"consecutiveThrottles": IDL.Nat
	});
	const RawFinding = IDL.Record({
		"id": IDL.Text,
		"region": IDL.Opt(IDL.Text),
		"title": IDL.Text,
		"findingId": IDL.Text,
		"provider": ProviderType,
		"accountId": IDL.Opt(IDL.Text),
		"description": IDL.Text,
		"rawMetadata": IDL.Text,
		"timestamp": IDL.Int,
		"severity": Severity
	});
	const ReportRecipientConfig = IDL.Record({
		"customer": CustomerId,
		"reportType": ReportType,
		"recipients": IDL.Vec(IDL.Text)
	});
	const ReportTrigger = IDL.Variant({
		"ScheduledWeekly": IDL.Null,
		"OnDemand": IDL.Null,
		"ScheduledMonthly": IDL.Null
	});
	const ReportDeliveryOutcome = IDL.Record({
		"recipient": IDL.Text,
		"sentAt": IDL.Opt(Timestamp),
		"error": IDL.Opt(IDL.Text),
		"success": IDL.Bool
	});
	const ReportRunOutcome = IDL.Variant({
		"Failed": IDL.Text,
		"Succeeded": IDL.Null
	});
	const ReportRun = IDL.Record({
		"trigger": ReportTrigger,
		"deliveries": IDL.Vec(ReportDeliveryOutcome),
		"customer": CustomerId,
		"providerScope": IDL.Vec(ProviderType),
		"generatedAt": Timestamp,
		"reportType": ReportType,
		"periodEnd": Timestamp,
		"recipients": IDL.Vec(IDL.Text),
		"periodStart": Timestamp,
		"outcome": ReportRunOutcome,
		"runId": IDL.Text
	});
	const GeneratedReport = IDL.Record({
		"csvData": IDL.Opt(IDL.Text),
		"customer": IDL.Text,
		"providerScope": IDL.Vec(IDL.Text),
		"generatedAt": IDL.Text,
		"generatedBy": IDL.Text,
		"dateRangeStart": IDL.Text,
		"dateRangeEnd": IDL.Text,
		"reportType": IDL.Text,
		"reportId": IDL.Text,
		"format": IDL.Text
	});
	const ThrottleEvent = IDL.Record({
		"id": IDL.Text,
		"provider": ProviderType,
		"message": IDL.Text,
		"timestamp": Timestamp,
		"retryAfterSec": IDL.Opt(IDL.Nat),
		"statusCode": IDL.Opt(IDL.Nat)
	});
	const TimelineEvent = IDL.Record({
		"id": IDL.Text,
		"title": IDL.Text,
		"provider": IDL.Opt(ProviderType),
		"customer": IDL.Text,
		"description": IDL.Text,
		"timestamp": IDL.Int,
		"severity": IDL.Opt(Severity),
		"eventType": IDL.Text
	});
	const SearchResult = IDL.Record({
		"id": IDL.Text,
		"title": IDL.Text,
		"provider": IDL.Opt(ProviderType),
		"customer": IDL.Text,
		"description": IDL.Text,
		"timestamp": IDL.Int,
		"sourceModule": IDL.Text,
		"severity": IDL.Opt(Severity)
	});
	const UserAssignmentView = IDL.Record({
		"principal": IDL.Text,
		"providers": IDL.Vec(ProviderType)
	});
	const VaultEntryView = IDL.Record({
		"provider": ProviderType,
		"name": VaultSecretName,
		"createdAt": IDL.Int,
		"updatedAt": IDL.Int,
		"maskedValue": IDL.Text
	});
	const RateLimitError = IDL.Variant({
		"UnknownProvider": IDL.Null,
		"NotAuthorized": IDL.Null
	});
	const Result_6 = IDL.Variant({
		"ok": IDL.Null,
		"err": RateLimitError
	});
	const Result_5 = IDL.Variant({
		"ok": IDL.Text,
		"err": VaultError
	});
	const ReportingError = IDL.Variant({
		"NotFound": IDL.Null,
		"NotAuthorized": IDL.Null,
		"InvalidPeriod": IDL.Null,
		"InvalidRecipient": IDL.Text
	});
	const Result_4 = IDL.Variant({
		"ok": ReportRun,
		"err": ReportingError
	});
	const NotificationError = IDL.Variant({
		"InvalidWebhookUrl": IDL.Text,
		"NotFound": IDL.Null,
		"NotAuthorized": IDL.Null,
		"InvalidRule": IDL.Text
	});
	const Result_3 = IDL.Variant({
		"ok": IDL.Null,
		"err": NotificationError
	});
	const AwsCredentialInput = IDL.Record({
		"externalId": IDL.Opt(IDL.Text),
		"roleArn": IDL.Text,
		"regions": IDL.Vec(IDL.Text)
	});
	const GcpCredentialInput = IDL.Record({
		"serviceAccountJson": IDL.Text,
		"projectIds": IDL.Vec(IDL.Text)
	});
	const AzureCredentialInput = IDL.Record({
		"clientId": IDL.Text,
		"subscriptionIds": IDL.Vec(IDL.Text),
		"tenantId": IDL.Text,
		"clientSecret": IDL.Text
	});
	const ProviderCredentialInput = IDL.Variant({
		"AWS": AwsCredentialInput,
		"GCP": GcpCredentialInput,
		"Azure": AzureCredentialInput
	});
	const Result_2 = IDL.Variant({
		"ok": IDL.Null,
		"err": ReportingError
	});
	const ConnectionTestResult = IDL.Variant({
		"Success": IDL.Text,
		"Failure": IDL.Text
	});
	const HttpHeader = IDL.Record({
		"value": IDL.Text,
		"name": IDL.Text
	});
	const HttpRequestResult = IDL.Record({
		"status": IDL.Nat,
		"body": IDL.Vec(IDL.Nat8),
		"headers": IDL.Vec(HttpHeader)
	});
	const TransformationInput = IDL.Record({
		"context": IDL.Vec(IDL.Nat8),
		"response": HttpRequestResult
	});
	const TransformationOutput = IDL.Record({
		"status": IDL.Nat,
		"body": IDL.Vec(IDL.Nat8),
		"headers": IDL.Vec(HttpHeader)
	});
	return IDL.Service({
		"acknowledgeNotification": IDL.Func([IDL.Text], [IDL.Bool], []),
		"assignProviderAccess": IDL.Func([IDL.Principal, IDL.Vec(ProviderType)], [], []),
		"blockIp": IDL.Func([IDL.Record({
			"ip": IDL.Text,
			"customer": IDL.Text,
			"providers": IDL.Vec(ProviderType),
			"dryRun": IDL.Bool
		})], [PlaybookResult], []),
		"clearProviderCredential": IDL.Func([ProviderType], [Result_1], []),
		"deleteAlertRule": IDL.Func([IDL.Text], [IDL.Bool], []),
		"deleteReport": IDL.Func([IDL.Text, IDL.Text], [], []),
		"deleteVaultSecret": IDL.Func([ProviderType, VaultSecretName], [Result], []),
		"disableAzureAdAccount": IDL.Func([IDL.Record({
			"customer": IDL.Text,
			"userPrincipalName": IDL.Text,
			"dryRun": IDL.Bool
		})], [PlaybookResult], []),
		"enrichAlertPublic": IDL.Func([IDL.Text, IDL.Text], [Result_8], []),
		"escalateToIncident": IDL.Func([IDL.Record({
			"customer": IDL.Text,
			"assignedOwner": IDL.Opt(IDL.Text),
			"alertId": IDL.Text,
			"notes": IDL.Opt(IDL.Text),
			"severity": IDL.Text,
			"dryRun": IDL.Bool
		})], [PlaybookResult], []),
		"execute": IDL.Func([IDL.Text], [Result__1], ["query"]),
		"exportComplianceCsv": IDL.Func([ComplianceFramework], [IDL.Text], ["query"]),
		"exportCompliancePdf": IDL.Func([ComplianceFramework], [IDL.Vec(IDL.Nat8)], ["query"]),
		"exportReportPdf": IDL.Func([
			ReportType,
			Timestamp,
			Timestamp,
			CustomerId,
			IDL.Vec(ProviderType)
		], [IDL.Vec(IDL.Nat8)], ["query"]),
		"forceGcpIamReview": IDL.Func([IDL.Record({
			"customer": IDL.Text,
			"projectId": IDL.Text,
			"dryRun": IDL.Bool
		})], [PlaybookResult], []),
		"generateReport": IDL.Func([IDL.Record({
			"customer": IDL.Text,
			"providerScope": IDL.Vec(IDL.Text),
			"dateRangeStart": IDL.Text,
			"dateRangeEnd": IDL.Text,
			"reportType": IDL.Text
		})], [Result_7], []),
		"getAlertById": IDL.Func([IDL.Text], [IDL.Opt(NormalizedAlert)], ["query"]),
		"getAlertRules": IDL.Func([IDL.Text], [IDL.Vec(AlertRule)], ["query"]),
		"getAlertsForCorrelation": IDL.Func([IDL.Vec(IDL.Text)], [IDL.Vec(NormalizedAlert)], ["query"]),
		"getApiDoc": IDL.Func([], [IDL.Text], ["query"]),
		"getAssetById": IDL.Func([IDL.Text], [IDL.Opt(Asset)], ["query"]),
		"getAssetFindings": IDL.Func([IDL.Text], [IDL.Vec(NormalizedAlert)], ["query"]),
		"getAssets": IDL.Func([IDL.Record({
			"region": IDL.Opt(IDL.Text),
			"minRiskScore": IDL.Opt(IDL.Nat),
			"provider": IDL.Opt(ProviderType),
			"customer": IDL.Text,
			"limit": IDL.Nat,
			"assetType": IDL.Opt(AssetType)
		})], [IDL.Vec(Asset)], ["query"]),
		"getAuditLog": IDL.Func([IDL.Text, IDL.Nat], [IDL.Vec(AuditLogEntry)], ["query"]),
		"getComplianceControlGaps": IDL.Func([ComplianceFramework], [IDL.Vec(ComplianceControl)], ["query"]),
		"getComplianceStatus": IDL.Func([ComplianceFramework, IDL.Opt(ProviderType)], [IDL.Record({
			"total": IDL.Nat,
			"failing": IDL.Nat,
			"controls": IDL.Vec(ComplianceControl),
			"score": IDL.Nat,
			"passing": IDL.Nat
		})], ["query"]),
		"getComplianceTrend": IDL.Func([ComplianceFramework], [IDL.Vec(ComplianceTrendEntry)], ["query"]),
		"getCorrelatedIncidentById": IDL.Func([IDL.Text], [IDL.Opt(CorrelatedIncident)], ["query"]),
		"getCorrelatedIncidents": IDL.Func([IDL.Nat], [IDL.Vec(IDL.Tuple(IDL.Text, CorrelatedIncident))], ["query"]),
		"getCorrelationStats": IDL.Func([], [CorrelationStats], ["query"]),
		"getCredentialHealth": IDL.Func([], [IDL.Vec(CredentialHealthStatus)], ["query"]),
		"getEnrichmentKeys": IDL.Func([], [IDL.Record({
			"abuseIpdbKeySet": IDL.Bool,
			"virusTotalKeySet": IDL.Bool
		})], []),
		"getFailedIngestions": IDL.Func([IDL.Opt(ProviderType), IDL.Nat], [IDL.Vec(IDL.Record({
			"id": IDL.Text,
			"status": IDL.Text,
			"provider": IDL.Text,
			"errorMessage": IDL.Text,
			"errorType": IDL.Text,
			"timestamp": IDL.Int,
			"rawPayload": IDL.Text
		}))], ["query"]),
		"getIngestionStats": IDL.Func([], [IngestionStats], ["query"]),
		"getMyProviders": IDL.Func([], [IDL.Vec(ProviderType)], ["query"]),
		"getNormalizedAlerts": IDL.Func([IDL.Record({
			"status": IDL.Opt(AlertStatus),
			"provider": IDL.Opt(ProviderType),
			"customer": IDL.Text,
			"cursor": IDL.Opt(Cursor),
			"limit": IDL.Nat,
			"severity": IDL.Opt(Severity)
		})], [Page], ["query"]),
		"getNotificationLogs": IDL.Func([IDL.Record({
			"customer": IDL.Text,
			"limit": IDL.Nat
		})], [IDL.Vec(NotificationLog)], ["query"]),
		"getNotificationRouting": IDL.Func([CustomerId], [IDL.Opt(NotificationRouting)], ["query"]),
		"getPipelineHealth": IDL.Func([], [IDL.Vec(IDL.Record({
			"provider": IDL.Text,
			"failedIngestionCount": IDL.Nat,
			"pollEventsToday": IDL.Nat,
			"normalizationSuccessRate": IDL.Float64,
			"webhookEventsToday": IDL.Nat,
			"avgLatencyMs": IDL.Float64
		}))], ["query"]),
		"getProviderCredentialStatus": IDL.Func([ProviderType], [ProviderCredentialStatus], ["query"]),
		"getProviderStates": IDL.Func([], [IDL.Vec(ProviderPollingState)], ["query"]),
		"getRateLimitStates": IDL.Func([], [IDL.Vec(RateLimitBackoffState)], ["query"]),
		"getRawFindings": IDL.Func([
			ProviderType,
			IDL.Nat,
			IDL.Nat
		], [IDL.Record({
			"hasMore": IDL.Bool,
			"totalCount": IDL.Nat,
			"items": IDL.Vec(RawFinding)
		})], ["query"]),
		"getReportCsv": IDL.Func([IDL.Text, IDL.Text], [IDL.Opt(IDL.Text)], []),
		"getReportEmailConfig": IDL.Func([IDL.Text], [IDL.Vec(IDL.Record({
			"reportType": IDL.Text,
			"recipients": IDL.Vec(IDL.Text)
		}))], []),
		"getReportRecipients": IDL.Func([ReportType, CustomerId], [IDL.Opt(ReportRecipientConfig)], ["query"]),
		"getReportRun": IDL.Func([IDL.Text, CustomerId], [IDL.Opt(ReportRun)], ["query"]),
		"getReportRuns": IDL.Func([CustomerId, IDL.Nat], [IDL.Vec(ReportRun)], ["query"]),
		"getReports": IDL.Func([IDL.Text], [IDL.Vec(GeneratedReport)], []),
		"getThrottleEvents": IDL.Func([IDL.Opt(ProviderType), IDL.Nat], [IDL.Vec(ThrottleEvent)], ["query"]),
		"getTimeline": IDL.Func([IDL.Text, IDL.Nat], [IDL.Vec(TimelineEvent)], ["query"]),
		"getWebhookSecretStatus": IDL.Func([], [IDL.Record({
			"azureSet": IDL.Bool,
			"gcpSet": IDL.Bool,
			"awsSet": IDL.Bool
		})], []),
		"getWebhookStats": IDL.Func([], [IDL.Record({
			"webhookNormalizationRate": IDL.Float64,
			"webhookEventsToday": IDL.Nat
		})], ["query"]),
		"globalSearch": IDL.Func([
			IDL.Text,
			IDL.Text,
			IDL.Nat
		], [IDL.Record({
			"hasMore": IDL.Bool,
			"results": IDL.Vec(SearchResult)
		})], ["query"]),
		"hasAdminCredentials": IDL.Func([], [IDL.Bool], ["query"]),
		"http_request": IDL.Func([IDL.Record({
			"url": IDL.Text,
			"method": IDL.Text,
			"body": IDL.Vec(IDL.Nat8),
			"headers": IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))
		})], [IDL.Record({
			"body": IDL.Vec(IDL.Nat8),
			"headers": IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
			"upgrade": IDL.Opt(IDL.Bool),
			"streaming_strategy": IDL.Opt(IDL.Null),
			"status_code": IDL.Nat16
		})], ["query"]),
		"http_request_update": IDL.Func([IDL.Record({
			"url": IDL.Text,
			"method": IDL.Text,
			"body": IDL.Vec(IDL.Nat8),
			"headers": IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))
		})], [IDL.Record({
			"body": IDL.Vec(IDL.Nat8),
			"headers": IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
			"upgrade": IDL.Opt(IDL.Bool),
			"streaming_strategy": IDL.Opt(IDL.Null),
			"status_code": IDL.Nat16
		})], []),
		"isolateResource": IDL.Func([IDL.Record({
			"provider": ProviderType,
			"customer": IDL.Text,
			"resourceId": IDL.Text,
			"dryRun": IDL.Bool
		})], [PlaybookResult], []),
		"listUserAssignments": IDL.Func([], [IDL.Vec(UserAssignmentView)], ["query"]),
		"listVaultSecrets": IDL.Func([ProviderType], [IDL.Vec(VaultEntryView)], ["query"]),
		"removeProviderAccess": IDL.Func([IDL.Principal, ProviderType], [], []),
		"resetProviderBackoff": IDL.Func([ProviderType], [Result_6], []),
		"revealVaultSecret": IDL.Func([ProviderType, VaultSecretName], [Result_5], []),
		"revokeIamCredentials": IDL.Func([IDL.Record({
			"provider": ProviderType,
			"customer": IDL.Text,
			"userId": IDL.Text,
			"accessKeyId": IDL.Opt(IDL.Text),
			"dryRun": IDL.Bool
		})], [PlaybookResult], []),
		"runEscalationCheck": IDL.Func([], [IDL.Nat], []),
		"runReportOnDemand": IDL.Func([
			ReportType,
			Timestamp,
			Timestamp,
			CustomerId,
			IDL.Vec(ProviderType)
		], [Result_4], []),
		"runScheduledReport": IDL.Func([
			ReportType,
			ReportTrigger,
			CustomerId,
			IDL.Vec(ProviderType)
		], [Result_4], []),
		"saveAlertRule": IDL.Func([AlertRule], [IDL.Bool], []),
		"saveEnrichmentKeys": IDL.Func([IDL.Record({
			"virusTotalKey": IDL.Opt(IDL.Text),
			"abuseIpdbKey": IDL.Opt(IDL.Text)
		})], [], []),
		"saveNotificationRouting": IDL.Func([NotificationRouting], [Result_3], []),
		"saveProviderCredential": IDL.Func([ProviderCredentialInput], [Result_1], []),
		"saveReportEmailConfig": IDL.Func([IDL.Record({
			"customer": IDL.Text,
			"reportType": IDL.Text,
			"recipients": IDL.Vec(IDL.Text)
		})], [], []),
		"saveReportRecipients": IDL.Func([ReportRecipientConfig], [Result_2], []),
		"saveVaultSecret": IDL.Func([
			ProviderType,
			VaultSecretName,
			IDL.Text
		], [Result], []),
		"saveWebhookSecret": IDL.Func([ProviderType, IDL.Text], [], []),
		"schema": IDL.Func([], [IDL.Text], ["query"]),
		"setPollingInterval": IDL.Func([ProviderType, PollingInterval], [], []),
		"testAwsConnection": IDL.Func([], [ConnectionTestResult], []),
		"testAzureConnection": IDL.Func([], [ConnectionTestResult], []),
		"testGcpConnection": IDL.Func([], [ConnectionTestResult], []),
		"testProviderConnection": IDL.Func([ProviderType], [ConnectionTestResult], []),
		"transform": IDL.Func([TransformationInput], [TransformationOutput], ["query"]),
		"triggerPoll": IDL.Func([ProviderType], [], []),
		"updateAlertStatus": IDL.Func([
			IDL.Text,
			AlertStatus,
			IDL.Opt(IDL.Text)
		], [IDL.Bool], []),
		"updateCorrelatedIncidentStatus": IDL.Func([
			IDL.Text,
			IncidentStatus,
			IDL.Opt(IDL.Text),
			IDL.Opt(IDL.Text)
		], [IDL.Bool], []),
		"updateProviderCredential": IDL.Func([ProviderCredentialInput], [Result_1], []),
		"updateVaultSecret": IDL.Func([
			ProviderType,
			VaultSecretName,
			IDL.Text
		], [Result], [])
	});
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/agent/api.js
/**
* Codes used by the replica for rejecting a message.
* See {@link https://sdk.dfinity.org/docs/interface-spec/#reject-codes | the interface spec}.
*/
var ReplicaRejectCode;
(function(ReplicaRejectCode) {
	ReplicaRejectCode[ReplicaRejectCode["SysFatal"] = 1] = "SysFatal";
	ReplicaRejectCode[ReplicaRejectCode["SysTransient"] = 2] = "SysTransient";
	ReplicaRejectCode[ReplicaRejectCode["DestinationInvalid"] = 3] = "DestinationInvalid";
	ReplicaRejectCode[ReplicaRejectCode["CanisterReject"] = 4] = "CanisterReject";
	ReplicaRejectCode[ReplicaRejectCode["CanisterError"] = 5] = "CanisterError";
})(ReplicaRejectCode || (ReplicaRejectCode = {}));
var QueryResponseStatus;
(function(QueryResponseStatus) {
	QueryResponseStatus["Replied"] = "replied";
	QueryResponseStatus["Rejected"] = "rejected";
})(QueryResponseStatus || (QueryResponseStatus = {}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/principal/utils/base32.js
var alphabet = "abcdefghijklmnopqrstuvwxyz234567";
var lookupTable = Object.create(null);
for (let i = 0; i < 32; i++) lookupTable[alphabet[i]] = i;
lookupTable["0"] = lookupTable.o;
lookupTable["1"] = lookupTable.i;
/**
* @param input The Uint8Array to encode.
* @returns A Base32 string encoding the input.
*/
function base32Encode(input) {
	let skip = 0;
	let bits = 0;
	let output = "";
	function encodeByte(byte) {
		if (skip < 0) bits |= byte >> -skip;
		else bits = byte << skip & 248;
		if (skip > 3) {
			skip -= 8;
			return 1;
		}
		if (skip < 4) {
			output += alphabet[bits >> 3];
			skip += 5;
		}
		return 0;
	}
	for (let i = 0; i < input.length;) i += encodeByte(input[i]);
	return output + (skip < 0 ? alphabet[bits >> 3] : "");
}
/**
* @param input The base32 encoded string to decode.
*/
function base32Decode(input) {
	let skip = 0;
	let byte = 0;
	const output = new Uint8Array(input.length * 4 / 3 | 0);
	let o = 0;
	function decodeChar(char) {
		let val = lookupTable[char.toLowerCase()];
		if (val === void 0) throw new Error(`Invalid character: ${JSON.stringify(char)}`);
		val <<= 3;
		byte |= val >>> skip;
		skip += 5;
		if (skip >= 8) {
			output[o++] = byte;
			skip -= 8;
			if (skip > 0) byte = val << 5 - skip & 255;
			else byte = 0;
		}
	}
	for (const c of input) decodeChar(c);
	return output.slice(0, o);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/principal/utils/getCrc.js
var lookUpTable = new Uint32Array([
	0,
	1996959894,
	3993919788,
	2567524794,
	124634137,
	1886057615,
	3915621685,
	2657392035,
	249268274,
	2044508324,
	3772115230,
	2547177864,
	162941995,
	2125561021,
	3887607047,
	2428444049,
	498536548,
	1789927666,
	4089016648,
	2227061214,
	450548861,
	1843258603,
	4107580753,
	2211677639,
	325883990,
	1684777152,
	4251122042,
	2321926636,
	335633487,
	1661365465,
	4195302755,
	2366115317,
	997073096,
	1281953886,
	3579855332,
	2724688242,
	1006888145,
	1258607687,
	3524101629,
	2768942443,
	901097722,
	1119000684,
	3686517206,
	2898065728,
	853044451,
	1172266101,
	3705015759,
	2882616665,
	651767980,
	1373503546,
	3369554304,
	3218104598,
	565507253,
	1454621731,
	3485111705,
	3099436303,
	671266974,
	1594198024,
	3322730930,
	2970347812,
	795835527,
	1483230225,
	3244367275,
	3060149565,
	1994146192,
	31158534,
	2563907772,
	4023717930,
	1907459465,
	112637215,
	2680153253,
	3904427059,
	2013776290,
	251722036,
	2517215374,
	3775830040,
	2137656763,
	141376813,
	2439277719,
	3865271297,
	1802195444,
	476864866,
	2238001368,
	4066508878,
	1812370925,
	453092731,
	2181625025,
	4111451223,
	1706088902,
	314042704,
	2344532202,
	4240017532,
	1658658271,
	366619977,
	2362670323,
	4224994405,
	1303535960,
	984961486,
	2747007092,
	3569037538,
	1256170817,
	1037604311,
	2765210733,
	3554079995,
	1131014506,
	879679996,
	2909243462,
	3663771856,
	1141124467,
	855842277,
	2852801631,
	3708648649,
	1342533948,
	654459306,
	3188396048,
	3373015174,
	1466479909,
	544179635,
	3110523913,
	3462522015,
	1591671054,
	702138776,
	2966460450,
	3352799412,
	1504918807,
	783551873,
	3082640443,
	3233442989,
	3988292384,
	2596254646,
	62317068,
	1957810842,
	3939845945,
	2647816111,
	81470997,
	1943803523,
	3814918930,
	2489596804,
	225274430,
	2053790376,
	3826175755,
	2466906013,
	167816743,
	2097651377,
	4027552580,
	2265490386,
	503444072,
	1762050814,
	4150417245,
	2154129355,
	426522225,
	1852507879,
	4275313526,
	2312317920,
	282753626,
	1742555852,
	4189708143,
	2394877945,
	397917763,
	1622183637,
	3604390888,
	2714866558,
	953729732,
	1340076626,
	3518719985,
	2797360999,
	1068828381,
	1219638859,
	3624741850,
	2936675148,
	906185462,
	1090812512,
	3747672003,
	2825379669,
	829329135,
	1181335161,
	3412177804,
	3160834842,
	628085408,
	1382605366,
	3423369109,
	3138078467,
	570562233,
	1426400815,
	3317316542,
	2998733608,
	733239954,
	1555261956,
	3268935591,
	3050360625,
	752459403,
	1541320221,
	2607071920,
	3965973030,
	1969922972,
	40735498,
	2617837225,
	3943577151,
	1913087877,
	83908371,
	2512341634,
	3803740692,
	2075208622,
	213261112,
	2463272603,
	3855990285,
	2094854071,
	198958881,
	2262029012,
	4057260610,
	1759359992,
	534414190,
	2176718541,
	4139329115,
	1873836001,
	414664567,
	2282248934,
	4279200368,
	1711684554,
	285281116,
	2405801727,
	4167216745,
	1634467795,
	376229701,
	2685067896,
	3608007406,
	1308918612,
	956543938,
	2808555105,
	3495958263,
	1231636301,
	1047427035,
	2932959818,
	3654703836,
	1088359270,
	936918e3,
	2847714899,
	3736837829,
	1202900863,
	817233897,
	3183342108,
	3401237130,
	1404277552,
	615818150,
	3134207493,
	3453421203,
	1423857449,
	601450431,
	3009837614,
	3294710456,
	1567103746,
	711928724,
	3020668471,
	3272380065,
	1510334235,
	755167117
]);
/**
* Calculate the CRC32 of a Uint8Array.
* @param buf The Uint8Array to calculate the CRC32 of.
*/
function getCrc32(buf) {
	let crc = -1;
	for (let i = 0; i < buf.length; i++) crc = lookUpTable[(buf[i] ^ crc) & 255] ^ crc >>> 8;
	return (crc ^ -1) >>> 0;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/principal/principal.js
var JSON_KEY_PRINCIPAL = "__principal__";
var SELF_AUTHENTICATING_SUFFIX = 2;
var ANONYMOUS_SUFFIX = 4;
var MANAGEMENT_CANISTER_PRINCIPAL_TEXT_STR = "aaaaa-aa";
var Principal$1 = class Principal$1 {
	static anonymous() {
		return new this(new Uint8Array([ANONYMOUS_SUFFIX]));
	}
	/**
	* Utility method, returning the principal representing the management canister, decoded from the hex string `'aaaaa-aa'`
	* @returns {Principal} principal of the management canister
	*/
	static managementCanister() {
		return this.fromText(MANAGEMENT_CANISTER_PRINCIPAL_TEXT_STR);
	}
	static selfAuthenticating(publicKey) {
		const sha = sha224(publicKey);
		return new this(new Uint8Array([...sha, SELF_AUTHENTICATING_SUFFIX]));
	}
	static from(other) {
		if (typeof other === "string") return Principal$1.fromText(other);
		if (Object.getPrototypeOf(other) === Uint8Array.prototype) return new Principal$1(other);
		if (Principal$1.isPrincipal(other)) return new Principal$1(other._arr);
		throw new Error(`Impossible to convert ${JSON.stringify(other)} to Principal.`);
	}
	static fromHex(hex) {
		return new this(hexToBytes(hex));
	}
	static fromText(text) {
		let maybePrincipal = text;
		if (text.includes("__principal__")) {
			const obj = JSON.parse(text);
			if ("__principal__" in obj) maybePrincipal = obj[JSON_KEY_PRINCIPAL];
		}
		let arr = base32Decode(maybePrincipal.toLowerCase().replace(/-/g, ""));
		arr = arr.slice(4, arr.length);
		const principal = new this(arr);
		if (principal.toText() !== maybePrincipal) throw new Error(`Principal "${principal.toText()}" does not have a valid checksum (original value "${maybePrincipal}" may not be a valid Principal ID).`);
		return principal;
	}
	static fromUint8Array(arr) {
		return new this(arr);
	}
	static isPrincipal(other) {
		return other instanceof Principal$1 || typeof other === "object" && other !== null && "_isPrincipal" in other && other["_isPrincipal"] === true && "_arr" in other && other["_arr"] instanceof Uint8Array;
	}
	constructor(_arr) {
		this._arr = _arr;
		this._isPrincipal = true;
	}
	isAnonymous() {
		return this._arr.byteLength === 1 && this._arr[0] === ANONYMOUS_SUFFIX;
	}
	toUint8Array() {
		return this._arr;
	}
	toHex() {
		return bytesToHex(this._arr).toUpperCase();
	}
	toText() {
		const checksumArrayBuf = /* @__PURE__ */ new ArrayBuffer(4);
		new DataView(checksumArrayBuf).setUint32(0, getCrc32(this._arr));
		const checksum = new Uint8Array(checksumArrayBuf);
		const matches = base32Encode(new Uint8Array([...checksum, ...this._arr])).match(/.{1,5}/g);
		if (!matches) throw new Error();
		return matches.join("-");
	}
	toString() {
		return this.toText();
	}
	/**
	* Serializes to JSON
	* @returns {JsonnablePrincipal} a JSON object with a single key, {@link JSON_KEY_PRINCIPAL}, whose value is the principal as a string
	*/
	toJSON() {
		return { [JSON_KEY_PRINCIPAL]: this.toText() };
	}
	/**
	* Utility method taking a Principal to compare against. Used for determining canister ranges in certificate verification
	* @param {Principal} other - a {@link Principal} to compare
	* @returns {'lt' | 'eq' | 'gt'} `'lt' | 'eq' | 'gt'` a string, representing less than, equal to, or greater than
	*/
	compareTo(other) {
		for (let i = 0; i < Math.min(this._arr.length, other._arr.length); i++) {
			if (this._arr[i] < other._arr[i]) return "lt";
			if (this._arr[i] > other._arr[i]) return "gt";
		}
		if (this._arr.length < other._arr.length) return "lt";
		if (this._arr.length > other._arr.length) return "gt";
		return "eq";
	}
	/**
	* Utility method checking whether a provided Principal is less than or equal to the current one using the {@link Principal.compareTo} method
	* @param other a {@link Principal} to compare
	* @returns {boolean} boolean
	*/
	ltEq(other) {
		const cmp = this.compareTo(other);
		return cmp == "lt" || cmp == "eq";
	}
	/**
	* Utility method checking whether a provided Principal is greater than or equal to the current one using the {@link Principal.compareTo} method
	* @param other a {@link Principal} to compare
	* @returns {boolean} boolean
	*/
	gtEq(other) {
		const cmp = this.compareTo(other);
		return cmp == "gt" || cmp == "eq";
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/errors.js
var ErrorKindEnum;
(function(ErrorKindEnum) {
	ErrorKindEnum["Trust"] = "Trust";
	ErrorKindEnum["Protocol"] = "Protocol";
	ErrorKindEnum["Reject"] = "Reject";
	ErrorKindEnum["Transport"] = "Transport";
	ErrorKindEnum["External"] = "External";
	ErrorKindEnum["Limit"] = "Limit";
	ErrorKindEnum["Input"] = "Input";
	ErrorKindEnum["Unknown"] = "Unknown";
})(ErrorKindEnum || (ErrorKindEnum = {}));
/**
* Controls the level of detail included in error messages.
* - `Normal` (default): includes error message, call context, and HTTP details, but omits large binary fields (arg, certificate, nonce).
* - `Verbose`: same as Normal, but includes hex-encoded binary fields.
*
* To enable verbose mode: `ErrorCode.verbosity = ErrorVerbosity.Verbose`
*/
var ErrorVerbosity;
(function(ErrorVerbosity) {
	ErrorVerbosity["Normal"] = "normal";
	ErrorVerbosity["Verbose"] = "verbose";
})(ErrorVerbosity || (ErrorVerbosity = {}));
var VERBOSE_ONLY_KEYS = /* @__PURE__ */ new Set([
	"arg",
	"certificate",
	"nonce"
]);
function bytesReplacer(verbosity) {
	return (key, value) => {
		if (value instanceof Uint8Array) {
			if (verbosity === ErrorVerbosity.Normal && VERBOSE_ONLY_KEYS.has(key)) return `<${value.length} bytes, set ErrorCode.verbosity = ErrorVerbosity.Verbose to display>`;
			return `hex(${value.length}):${bytesToHex(value)}`;
		}
		return value;
	};
}
var ErrorCode = class ErrorCode {
	static {
		this.verbosity = ErrorVerbosity.Normal;
	}
	constructor(isCertified = false) {
		this.isCertified = isCertified;
	}
	toString() {
		let errorMessage = this.toErrorMessage();
		if (this.requestContext) errorMessage += `\nRequest context:\n  Request ID (hex): ${this.requestContext.requestId ? bytesToHex(this.requestContext.requestId) : "undefined"}\n  Sender pubkey (hex): ${bytesToHex(this.requestContext.senderPubKey)}\n  Sender signature (hex): ${bytesToHex(this.requestContext.senderSignature)}\n  Ingress expiry: ${this.requestContext.ingressExpiry.toString()}`;
		if (this.callContext) {
			errorMessage += `\nCall context:\n  Canister ID: ${this.callContext.canisterId.toText()}\n  Method name: ${this.callContext.methodName}`;
			if ("httpDetails" in this.callContext) errorMessage += `\n  HTTP details: ${JSON.stringify(this.callContext.httpDetails, bytesReplacer(ErrorCode.verbosity), 2)}`;
		}
		return errorMessage;
	}
};
/**
* An error that happens in the Agent. This is the root of all errors and should be used
* everywhere in the Agent code (this package).
*
* To know if the error is certified, use the `isCertified` getter.
*/
var AgentError = class AgentError extends Error {
	get code() {
		return this.cause.code;
	}
	set code(code) {
		this.cause.code = code;
	}
	get kind() {
		return this.cause.kind;
	}
	set kind(kind) {
		this.cause.kind = kind;
	}
	/**
	* Reads the `isCertified` property of the underlying error code.
	* @returns `true` if the error is certified, `false` otherwise.
	*/
	get isCertified() {
		return this.code.isCertified;
	}
	constructor(code, kind) {
		super(code.toString());
		this.name = "AgentError";
		this.cause = {
			code,
			kind
		};
		Object.setPrototypeOf(this, AgentError.prototype);
	}
	hasCode(code) {
		return this.code instanceof code;
	}
	toString() {
		return `${this.name} (${this.kind}): ${this.message}`;
	}
};
var ErrorKind = class extends AgentError {
	static fromCode(code) {
		return new this(code);
	}
};
var InputError = class InputError extends ErrorKind {
	constructor(code) {
		super(code, ErrorKindEnum.Input);
		this.name = "InputError";
		Object.setPrototypeOf(this, InputError.prototype);
	}
};
var DerDecodeLengthMismatchErrorCode = class DerDecodeLengthMismatchErrorCode extends ErrorCode {
	constructor(expectedLength, actualLength) {
		super();
		this.expectedLength = expectedLength;
		this.actualLength = actualLength;
		this.name = "DerDecodeLengthMismatchErrorCode";
		Object.setPrototypeOf(this, DerDecodeLengthMismatchErrorCode.prototype);
	}
	toErrorMessage() {
		return `DER payload mismatch: Expected length ${this.expectedLength}, actual length: ${this.actualLength}`;
	}
};
var DerDecodeErrorCode = class DerDecodeErrorCode extends ErrorCode {
	constructor(error) {
		super();
		this.error = error;
		this.name = "DerDecodeErrorCode";
		Object.setPrototypeOf(this, DerDecodeErrorCode.prototype);
	}
	toErrorMessage() {
		return `Failed to decode DER: ${this.error}`;
	}
};
var DerEncodeErrorCode = class DerEncodeErrorCode extends ErrorCode {
	constructor(error) {
		super();
		this.error = error;
		this.name = "DerEncodeErrorCode";
		Object.setPrototypeOf(this, DerEncodeErrorCode.prototype);
	}
	toErrorMessage() {
		return `Failed to encode DER: ${this.error}`;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/candid/utils/buffer.js
/**
* Concatenate multiple Uint8Arrays.
* @param uint8Arrays The Uint8Arrays to concatenate.
*/
function concat(...uint8Arrays) {
	const result = new Uint8Array(uint8Arrays.reduce((acc, curr) => acc + curr.byteLength, 0));
	let index = 0;
	for (const b of uint8Arrays) {
		result.set(b, index);
		index += b.byteLength;
	}
	return result;
}
/**
* A class that abstracts a pipe-like Uint8Array.
*/
var PipeArrayBuffer = class {
	/**
	* Save a checkpoint of the reading view (for backtracking)
	*/
	save() {
		return this._view;
	}
	/**
	* Restore a checkpoint of the reading view (for backtracking)
	* @param checkPoint a previously saved checkpoint
	*/
	restore(checkPoint) {
		if (!(checkPoint instanceof Uint8Array)) throw new Error("Checkpoint must be a Uint8Array");
		this._view = checkPoint;
	}
	/**
	* Creates a new instance of a pipe
	* @param buffer an optional buffer to start with
	* @param length an optional amount of bytes to use for the length.
	*/
	constructor(buffer, length = buffer?.byteLength || 0) {
		if (buffer && !(buffer instanceof Uint8Array)) try {
			buffer = uint8FromBufLike(buffer);
		} catch {
			throw new Error("Buffer must be a Uint8Array");
		}
		if (length < 0 || !Number.isInteger(length)) throw new Error("Length must be a non-negative integer");
		if (buffer && length > buffer.byteLength) throw new Error("Length cannot exceed buffer length");
		this._buffer = buffer || /* @__PURE__ */ new Uint8Array(0);
		this._view = new Uint8Array(this._buffer.buffer, 0, length);
	}
	get buffer() {
		return this._view.slice();
	}
	get byteLength() {
		return this._view.byteLength;
	}
	/**
	* Read `num` number of bytes from the front of the pipe.
	* @param num The number of bytes to read.
	*/
	read(num) {
		const result = this._view.subarray(0, num);
		this._view = this._view.subarray(num);
		return result.slice();
	}
	readUint8() {
		if (this._view.byteLength === 0) return;
		const result = this._view[0];
		this._view = this._view.subarray(1);
		return result;
	}
	/**
	* Write a buffer to the end of the pipe.
	* @param buf The bytes to write.
	*/
	write(buf) {
		if (!(buf instanceof Uint8Array)) throw new Error("Buffer must be a Uint8Array");
		const offset = this._view.byteLength;
		if (this._view.byteOffset + this._view.byteLength + buf.byteLength >= this._buffer.byteLength) this.alloc(buf.byteLength);
		else this._view = new Uint8Array(this._buffer.buffer, this._view.byteOffset, this._view.byteLength + buf.byteLength);
		this._view.set(buf, offset);
	}
	/**
	* Whether or not there is more data to read from the buffer
	*/
	get end() {
		return this._view.byteLength === 0;
	}
	/**
	* Allocate a fixed amount of memory in the buffer. This does not affect the view.
	* @param amount A number of bytes to add to the buffer.
	*/
	alloc(amount) {
		if (amount <= 0 || !Number.isInteger(amount)) throw new Error("Amount must be a positive integer");
		const b = new Uint8Array((this._buffer.byteLength + amount) * 1.2 | 0);
		const v = new Uint8Array(b.buffer, 0, this._view.byteLength + amount);
		v.set(this._view);
		this._buffer = b;
		this._view = v;
	}
};
/**
* Returns a true Uint8Array from an ArrayBufferLike object.
* @param bufLike a buffer-like object
* @returns Uint8Array
*/
function uint8FromBufLike(bufLike) {
	if (!bufLike) throw new Error("Input cannot be null or undefined");
	if (bufLike instanceof Uint8Array) return bufLike;
	if (bufLike instanceof ArrayBuffer) return new Uint8Array(bufLike);
	if (Array.isArray(bufLike)) return new Uint8Array(bufLike);
	if ("buffer" in bufLike) return uint8FromBufLike(bufLike.buffer);
	return new Uint8Array(bufLike);
}
/**
* Helpers to convert a Uint8Array to a DataView.
* @param uint8 Uint8Array
* @returns DataView
*/
function uint8ToDataView(uint8) {
	if (!(uint8 instanceof Uint8Array)) throw new Error("Input must be a Uint8Array");
	return new DataView(uint8.buffer, uint8.byteOffset, uint8.byteLength);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/candid/utils/bigint-math.js
/**
* Equivalent to `Math.log2(n)` with support for `BigInt` values
* @param n bigint or integer
* @returns integer
*/
function ilog2(n) {
	const nBig = BigInt(n);
	if (n <= 0) throw new RangeError("Input must be positive");
	return nBig.toString(2).length - 1;
}
/**
* Equivalent to `2 ** n` with support for `BigInt` values
* (necessary for browser preprocessors which replace the `**` operator with `Math.pow`)
* @param n bigint or integer
* @returns bigint
*/
function iexp2(n) {
	const nBig = BigInt(n);
	if (n < 0) throw new RangeError("Input must be non-negative");
	return BigInt(1) << nBig;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/candid/utils/leb128.js
function eob() {
	throw new Error("unexpected end of buffer");
}
/**
*
* @param pipe Pipe from buffer-pipe
* @param num number
* @returns Uint8Array
*/
function safeRead(pipe, num) {
	if (pipe.byteLength < num) eob();
	return pipe.read(num);
}
/**
* @param pipe - PipeArrayBuffer simulating buffer-pipe api
*/
function safeReadUint8(pipe) {
	const byte = pipe.readUint8();
	if (byte === void 0) eob();
	return byte;
}
/**
* Encode a positive number (or bigint) into a Buffer. The number will be floored to the
* nearest integer.
* @param value The number to encode.
*/
function lebEncode(value) {
	if (typeof value === "number") value = BigInt(value);
	if (value < BigInt(0)) throw new Error("Cannot leb encode negative values.");
	const byteLength = (value === BigInt(0) ? 0 : ilog2(value)) + 1;
	const pipe = new PipeArrayBuffer(new Uint8Array(byteLength), 0);
	while (true) {
		const i = Number(value & BigInt(127));
		value /= BigInt(128);
		if (value === BigInt(0)) {
			pipe.write(new Uint8Array([i]));
			break;
		} else pipe.write(new Uint8Array([i | 128]));
	}
	return pipe.buffer;
}
/**
* Decode a leb encoded buffer into a bigint. The number will always be positive (does not
* support signed leb encoding).
* @param pipe A Buffer containing the leb encoded bits.
*/
function lebDecode(pipe) {
	let weight = BigInt(1);
	let value = BigInt(0);
	let byte;
	do {
		byte = safeReadUint8(pipe);
		value += BigInt(byte & 127).valueOf() * weight;
		weight *= BigInt(128);
	} while (byte >= 128);
	return value;
}
/**
* Encode a number (or bigint) into a Buffer, with support for negative numbers. The number
* will be floored to the nearest integer.
* @param value The number to encode.
*/
function slebEncode(value) {
	if (typeof value === "number") value = BigInt(value);
	const isNeg = value < BigInt(0);
	if (isNeg) value = -value - BigInt(1);
	const byteLength = (value === BigInt(0) ? 0 : ilog2(value)) + 1;
	const pipe = new PipeArrayBuffer(new Uint8Array(byteLength), 0);
	while (true) {
		const i = getLowerBytes(value);
		value /= BigInt(128);
		if (isNeg && value === BigInt(0) && (i & 64) !== 0 || !isNeg && value === BigInt(0) && (i & 64) === 0) {
			pipe.write(new Uint8Array([i]));
			break;
		} else pipe.write(new Uint8Array([i | 128]));
	}
	function getLowerBytes(num) {
		const bytes = num % BigInt(128);
		if (isNeg) return Number(BigInt(128) - bytes - BigInt(1));
		return Number(bytes);
	}
	return pipe.buffer;
}
/**
* Decode a leb encoded buffer into a bigint. The number is decoded with support for negative
* signed-leb encoding.
* @param pipe A Buffer containing the signed leb encoded bits.
*/
function slebDecode(pipe) {
	const pipeView = new Uint8Array(pipe.buffer);
	let len = 0;
	for (; len < pipeView.byteLength; len++) if (pipeView[len] < 128) {
		if ((pipeView[len] & 64) === 0) return lebDecode(pipe);
		break;
	}
	const bytes = new Uint8Array(safeRead(pipe, len + 1));
	let value = BigInt(0);
	for (let i = bytes.byteLength - 1; i >= 0; i--) value = value * BigInt(128) + BigInt(128 - (bytes[i] & 127) - 1);
	return -value - BigInt(1);
}
/**
*
* @param value bigint or number
* @param byteLength number
* @returns Uint8Array
*/
function writeUIntLE(value, byteLength) {
	if (BigInt(value) < BigInt(0)) throw new Error("Cannot write negative values.");
	return writeIntLE(value, byteLength);
}
/**
*
* @param value - bigint or number
* @param byteLength - number
* @returns Uint8Array
*/
function writeIntLE(value, byteLength) {
	value = BigInt(value);
	const pipe = new PipeArrayBuffer(new Uint8Array(Math.min(1, byteLength)), 0);
	let i = 0;
	let mul = BigInt(256);
	let sub = BigInt(0);
	let byte = Number(value % mul);
	pipe.write(new Uint8Array([byte]));
	while (++i < byteLength) {
		if (value < 0 && sub === BigInt(0) && byte !== 0) sub = BigInt(1);
		byte = Number((value / mul - sub) % BigInt(256));
		pipe.write(new Uint8Array([byte]));
		mul *= BigInt(256);
	}
	return pipe.buffer;
}
/**
*
* @param pipe Pipe from buffer-pipe
* @param byteLength number
* @returns bigint
*/
function readUIntLE(pipe, byteLength) {
	if (byteLength <= 0 || !Number.isInteger(byteLength)) throw new Error("Byte length must be a positive integer");
	let val = BigInt(safeReadUint8(pipe));
	let mul = BigInt(1);
	let i = 0;
	while (++i < byteLength) {
		mul *= BigInt(256);
		const byte = BigInt(safeReadUint8(pipe));
		val = val + mul * byte;
	}
	return val;
}
/**
*
* @param pipe Pipe from buffer-pipe
* @param byteLength number
* @returns bigint
*/
function readIntLE(pipe, byteLength) {
	if (byteLength <= 0 || !Number.isInteger(byteLength)) throw new Error("Byte length must be a positive integer");
	let val = readUIntLE(pipe, byteLength);
	const mul = BigInt(2) ** (BigInt(8) * BigInt(byteLength - 1) + BigInt(7));
	if (val >= mul) val -= mul * BigInt(2);
	return val;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/candid/idl.js
/**
* This module provides a combinator library to create serializers/deserializers
* between JavaScript values and IDL used by canisters on the Internet Computer,
* as documented at https://github.com/dfinity/candid/blob/119703ba342d2fef6ab4972d2541b9fe36ae8e36/spec/Candid.md
*/
/**
* Error thrown when candid decoding fails due to a type mismatch
* between the expected and received types.
*/
var CandidDecodeError = class CandidDecodeError extends Error {
	constructor(message) {
		super(message);
		this.name = "CandidDecodeError";
		Object.setPrototypeOf(this, CandidDecodeError.prototype);
	}
};
var IDLTypeIds;
(function(IDLTypeIds) {
	IDLTypeIds[IDLTypeIds["Null"] = -1] = "Null";
	IDLTypeIds[IDLTypeIds["Bool"] = -2] = "Bool";
	IDLTypeIds[IDLTypeIds["Nat"] = -3] = "Nat";
	IDLTypeIds[IDLTypeIds["Int"] = -4] = "Int";
	IDLTypeIds[IDLTypeIds["Float32"] = -13] = "Float32";
	IDLTypeIds[IDLTypeIds["Float64"] = -14] = "Float64";
	IDLTypeIds[IDLTypeIds["Text"] = -15] = "Text";
	IDLTypeIds[IDLTypeIds["Reserved"] = -16] = "Reserved";
	IDLTypeIds[IDLTypeIds["Empty"] = -17] = "Empty";
	IDLTypeIds[IDLTypeIds["Opt"] = -18] = "Opt";
	IDLTypeIds[IDLTypeIds["Vector"] = -19] = "Vector";
	IDLTypeIds[IDLTypeIds["Record"] = -20] = "Record";
	IDLTypeIds[IDLTypeIds["Variant"] = -21] = "Variant";
	IDLTypeIds[IDLTypeIds["Func"] = -22] = "Func";
	IDLTypeIds[IDLTypeIds["Service"] = -23] = "Service";
	IDLTypeIds[IDLTypeIds["Principal"] = -24] = "Principal";
})(IDLTypeIds || (IDLTypeIds = {}));
new TextEncoder().encode("DIDL");
var toReadableString_max = 400;
var Visitor = class {
	visitType(_t, _data) {
		throw new Error("Not implemented");
	}
	visitPrimitive(t, data) {
		return this.visitType(t, data);
	}
	visitEmpty(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitBool(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitNull(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitReserved(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitText(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitNumber(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitInt(t, data) {
		return this.visitNumber(t, data);
	}
	visitNat(t, data) {
		return this.visitNumber(t, data);
	}
	visitFloat(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitFixedInt(t, data) {
		return this.visitNumber(t, data);
	}
	visitFixedNat(t, data) {
		return this.visitNumber(t, data);
	}
	visitPrincipal(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitConstruct(t, data) {
		return this.visitType(t, data);
	}
	visitVec(t, _ty, data) {
		return this.visitConstruct(t, data);
	}
	visitOpt(t, _ty, data) {
		return this.visitConstruct(t, data);
	}
	visitRecord(t, _fields, data) {
		return this.visitConstruct(t, data);
	}
	visitTuple(t, components, data) {
		const fields = components.map((ty, i) => [`_${i}_`, ty]);
		return this.visitRecord(t, fields, data);
	}
	visitVariant(t, _fields, data) {
		return this.visitConstruct(t, data);
	}
	visitRec(_t, ty, data) {
		return this.visitConstruct(ty, data);
	}
	visitFunc(t, data) {
		return this.visitConstruct(t, data);
	}
	visitService(t, data) {
		return this.visitConstruct(t, data);
	}
};
var IdlTypeName;
(function(IdlTypeName) {
	IdlTypeName["EmptyClass"] = "__IDL_EmptyClass__";
	IdlTypeName["UnknownClass"] = "__IDL_UnknownClass__";
	IdlTypeName["BoolClass"] = "__IDL_BoolClass__";
	IdlTypeName["NullClass"] = "__IDL_NullClass__";
	IdlTypeName["ReservedClass"] = "__IDL_ReservedClass__";
	IdlTypeName["TextClass"] = "__IDL_TextClass__";
	IdlTypeName["IntClass"] = "__IDL_IntClass__";
	IdlTypeName["NatClass"] = "__IDL_NatClass__";
	IdlTypeName["FloatClass"] = "__IDL_FloatClass__";
	IdlTypeName["FixedIntClass"] = "__IDL_FixedIntClass__";
	IdlTypeName["FixedNatClass"] = "__IDL_FixedNatClass__";
	IdlTypeName["VecClass"] = "__IDL_VecClass__";
	IdlTypeName["OptClass"] = "__IDL_OptClass__";
	IdlTypeName["RecordClass"] = "__IDL_RecordClass__";
	IdlTypeName["TupleClass"] = "__IDL_TupleClass__";
	IdlTypeName["VariantClass"] = "__IDL_VariantClass__";
	IdlTypeName["RecClass"] = "__IDL_RecClass__";
	IdlTypeName["PrincipalClass"] = "__IDL_PrincipalClass__";
	IdlTypeName["FuncClass"] = "__IDL_FuncClass__";
	IdlTypeName["ServiceClass"] = "__IDL_ServiceClass__";
})(IdlTypeName || (IdlTypeName = {}));
/**
* Represents an IDL type.
*/
var Type = class {
	display() {
		return this.name;
	}
	valueToString(x) {
		return toReadableString(x);
	}
	buildTypeTable(typeTable) {
		if (!typeTable.has(this)) this._buildTypeTableImpl(typeTable);
	}
};
var PrimitiveType = class extends Type {
	checkType(t) {
		if (this.name !== t.name) throw new Error(`type mismatch: type on the wire ${t.name}, expect type ${this.name}`);
		return t;
	}
	_buildTypeTableImpl(_typeTable) {}
};
var ConstructType = class extends Type {
	checkType(t) {
		if (t instanceof RecClass) {
			const ty = t.getType();
			if (typeof ty === "undefined") throw new CandidDecodeError("Type mismatch: cannot decode from uninitialized recursive type");
			return ty;
		}
		throw new Error(`type mismatch: type on the wire ${t.name}, expect type ${this.name}`);
	}
	encodeType(typeTable) {
		return typeTable.indexOf(this.name);
	}
};
/**
* Represents an IDL Empty, a type which has no inhabitants.
* Since no values exist for this type, it cannot be serialised or deserialised.
* Result types like `Result<Text, Empty>` should always succeed.
*/
var EmptyClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.EmptyClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.EmptyClass;
	}
	accept(v, d) {
		return v.visitEmpty(this, d);
	}
	covariant(x) {
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue() {
		throw new Error("Empty cannot appear as a function argument");
	}
	valueToString() {
		throw new Error("Empty cannot appear as a value");
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Empty);
	}
	decodeValue() {
		throw new Error("Empty cannot appear as an output");
	}
	get name() {
		return "empty";
	}
};
/**
* Represents an IDL Unknown, a placeholder type for deserialization only.
* When decoding a value as Unknown, all fields will be retained but the names are only available in
* hashed form.
* A deserialized unknown will offer it's actual type by calling the `type()` function.
* Unknown cannot be serialized and attempting to do so will throw an error.
*/
var UnknownClass = class extends Type {
	get typeName() {
		return IdlTypeName.UnknownClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.UnknownClass;
	}
	checkType(_t) {
		throw new Error("Method not implemented for unknown.");
	}
	accept(v, d) {
		throw v.visitType(this, d);
	}
	covariant(x) {
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue() {
		throw new Error("Unknown cannot appear as a function argument");
	}
	valueToString() {
		throw new Error("Unknown cannot appear as a value");
	}
	encodeType() {
		throw new Error("Unknown cannot be serialized");
	}
	decodeValue(b, t) {
		let decodedValue = t.decodeValue(b, t);
		if (Object(decodedValue) !== decodedValue) decodedValue = Object(decodedValue);
		let typeFunc;
		if (t instanceof RecClass) typeFunc = () => t.getType();
		else typeFunc = () => t;
		Object.defineProperty(decodedValue, "type", {
			value: typeFunc,
			writable: true,
			enumerable: false,
			configurable: true
		});
		return decodedValue;
	}
	_buildTypeTableImpl() {
		throw new Error("Unknown cannot be serialized");
	}
	get name() {
		return "Unknown";
	}
};
/**
* Represents an IDL Bool
*/
var BoolClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.BoolClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.BoolClass;
	}
	accept(v, d) {
		return v.visitBool(this, d);
	}
	covariant(x) {
		if (typeof x === "boolean") return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		return new Uint8Array([x ? 1 : 0]);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Bool);
	}
	decodeValue(b, t) {
		this.checkType(t);
		switch (safeReadUint8(b)) {
			case 0: return false;
			case 1: return true;
			default: throw new Error("Boolean value out of range");
		}
	}
	get name() {
		return "bool";
	}
};
/**
* Represents an IDL Null
*/
var NullClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.NullClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.NullClass;
	}
	accept(v, d) {
		return v.visitNull(this, d);
	}
	covariant(x) {
		if (x === null) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue() {
		return /* @__PURE__ */ new Uint8Array(0);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Null);
	}
	decodeValue(_b, t) {
		this.checkType(t);
		return null;
	}
	get name() {
		return "null";
	}
};
/**
* Represents an IDL Reserved
*/
var ReservedClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.ReservedClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.ReservedClass;
	}
	accept(v, d) {
		return v.visitReserved(this, d);
	}
	covariant(_x) {
		return true;
	}
	encodeValue() {
		return /* @__PURE__ */ new Uint8Array(0);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Reserved);
	}
	decodeValue(b, t) {
		if (t.name !== this.name) t.decodeValue(b, t);
		return null;
	}
	get name() {
		return "reserved";
	}
};
/**
* Represents an IDL Text
*/
var TextClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.TextClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.TextClass;
	}
	accept(v, d) {
		return v.visitText(this, d);
	}
	covariant(x) {
		if (typeof x === "string") return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		const buf = new TextEncoder().encode(x);
		return concat(lebEncode(buf.byteLength), buf);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Text);
	}
	decodeValue(b, t) {
		this.checkType(t);
		const len = lebDecode(b);
		const buf = safeRead(b, Number(len));
		return new TextDecoder("utf8", { fatal: true }).decode(buf);
	}
	get name() {
		return "text";
	}
	valueToString(x) {
		return `"${x}"`;
	}
};
/**
* Represents an IDL Int
*/
var IntClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.IntClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.IntClass;
	}
	accept(v, d) {
		return v.visitInt(this, d);
	}
	covariant(x) {
		if (typeof x === "bigint" || Number.isInteger(x)) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		return slebEncode(x);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Int);
	}
	decodeValue(b, t) {
		this.checkType(t);
		return slebDecode(b);
	}
	get name() {
		return "int";
	}
	valueToString(x) {
		return x.toString();
	}
};
/**
* Represents an IDL Nat
*/
var NatClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.NatClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.NatClass;
	}
	accept(v, d) {
		return v.visitNat(this, d);
	}
	covariant(x) {
		if (typeof x === "bigint" && x >= BigInt(0) || Number.isInteger(x) && x >= 0) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		return lebEncode(x);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Nat);
	}
	decodeValue(b, t) {
		this.checkType(t);
		return lebDecode(b);
	}
	get name() {
		return "nat";
	}
	valueToString(x) {
		return x.toString();
	}
};
/**
* Represents an IDL Float
*/
var FloatClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.FloatClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.FloatClass;
	}
	constructor(_bits) {
		super();
		this._bits = _bits;
		if (_bits !== 32 && _bits !== 64) throw new Error("not a valid float type");
	}
	accept(v, d) {
		return v.visitFloat(this, d);
	}
	covariant(x) {
		if (typeof x === "number" || x instanceof Number) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		const buf = /* @__PURE__ */ new ArrayBuffer(this._bits / 8);
		const view = new DataView(buf);
		if (this._bits === 32) view.setFloat32(0, x, true);
		else view.setFloat64(0, x, true);
		return new Uint8Array(buf);
	}
	encodeType() {
		return slebEncode(this._bits === 32 ? IDLTypeIds.Float32 : IDLTypeIds.Float64);
	}
	decodeValue(b, t) {
		this.checkType(t);
		const view = uint8ToDataView(safeRead(b, this._bits / 8));
		if (this._bits === 32) return view.getFloat32(0, true);
		return view.getFloat64(0, true);
	}
	get name() {
		return `float${this._bits}`;
	}
	valueToString(x) {
		return x.toString();
	}
};
/**
* Represents an IDL fixed-width Int(n)
*/
var FixedIntClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.FixedIntClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.FixedIntClass;
	}
	constructor(_bits) {
		super();
		this._bits = _bits;
	}
	accept(v, d) {
		return v.visitFixedInt(this, d);
	}
	covariant(x) {
		const min = iexp2(this._bits - 1) * BigInt(-1);
		const max = iexp2(this._bits - 1) - BigInt(1);
		if (typeof x === "bigint") {
			if (x >= min && x <= max) return true;
		} else if (Number.isInteger(x)) {
			const v = BigInt(x);
			if (v >= min && v <= max) return true;
		}
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		return writeIntLE(x, this._bits / 8);
	}
	encodeType() {
		return slebEncode(-9 - (Math.log2(this._bits) - 3));
	}
	decodeValue(b, t) {
		this.checkType(t);
		const num = readIntLE(b, this._bits / 8);
		if (this._bits <= 32) return Number(num);
		return num;
	}
	get name() {
		return `int${this._bits}`;
	}
	valueToString(x) {
		return x.toString();
	}
};
/**
* Represents an IDL fixed-width Nat(n)
*/
var FixedNatClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.FixedNatClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.FixedNatClass;
	}
	constructor(_bits) {
		super();
		this._bits = _bits;
	}
	accept(v, d) {
		return v.visitFixedNat(this, d);
	}
	covariant(x) {
		const max = iexp2(this._bits);
		if (typeof x === "bigint" && x >= BigInt(0)) {
			if (x < max) return true;
		} else if (Number.isInteger(x) && x >= 0) {
			if (BigInt(x) < max) return true;
		}
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		return writeUIntLE(x, this._bits / 8);
	}
	encodeType() {
		return slebEncode(-5 - (Math.log2(this._bits) - 3));
	}
	decodeValue(b, t) {
		this.checkType(t);
		const num = readUIntLE(b, this._bits / 8);
		if (this._bits <= 32) return Number(num);
		return num;
	}
	get name() {
		return `nat${this._bits}`;
	}
	valueToString(x) {
		return x.toString();
	}
};
/**
* Represents a reference to an IDL type, used for defining recursive data
* types.
*/
var RecClass = class RecClass extends ConstructType {
	constructor() {
		super(...arguments);
		this._id = RecClass._counter++;
	}
	get typeName() {
		return IdlTypeName.RecClass;
	}
	static {
		this._counter = 0;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.RecClass;
	}
	accept(v, d) {
		if (!this._type) throw Error("Recursive type uninitialized.");
		return v.visitRec(this, this._type, d);
	}
	fill(t) {
		this._type = t;
	}
	getType() {
		return this._type;
	}
	covariant(x) {
		if (this._type ? this._type.covariant(x) : false) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		if (!this._type) throw Error("Recursive type uninitialized.");
		return this._type.encodeValue(x);
	}
	_buildTypeTableImpl(typeTable) {
		if (!this._type) throw Error("Recursive type uninitialized.");
		typeTable.add(this, new Uint8Array([]));
		this._type.buildTypeTable(typeTable);
		typeTable.merge(this, this._type.name);
	}
	decodeValue(b, t) {
		if (!this._type) throw Error("Recursive type uninitialized.");
		return this._type.decodeValue(b, t);
	}
	get name() {
		return `rec_${this._id}`;
	}
	display() {
		if (!this._type) throw Error("Recursive type uninitialized.");
		return `μ${this.name}.${this._type.name}`;
	}
	valueToString(x) {
		if (!this._type) throw Error("Recursive type uninitialized.");
		return this._type.valueToString(x);
	}
};
function decodePrincipalId(b) {
	if (safeReadUint8(b) !== 1) throw new Error("Cannot decode principal");
	const len = Number(lebDecode(b));
	return Principal$1.fromUint8Array(new Uint8Array(safeRead(b, len)));
}
/**
* Represents an IDL principal reference
*/
var PrincipalClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.PrincipalClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.PrincipalClass;
	}
	accept(v, d) {
		return v.visitPrincipal(this, d);
	}
	covariant(x) {
		if (x && x._isPrincipal) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		const buf = x.toUint8Array();
		const len = lebEncode(buf.byteLength);
		return concat(new Uint8Array([1]), len, buf);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Principal);
	}
	decodeValue(b, t) {
		this.checkType(t);
		return decodePrincipalId(b);
	}
	get name() {
		return "principal";
	}
	valueToString(x) {
		return `${this.name} "${x.toText()}"`;
	}
};
/**
* Takes an unknown value and returns a string representation of it.
* @param x - unknown value
* @returns {string} string representation of the value
*/
function toReadableString(x) {
	const str = JSON.stringify(x, (_key, value) => typeof value === "bigint" ? `BigInt(${value})` : value);
	return str && str.length > toReadableString_max ? `${str.substring(0, 397)}...` : str;
}
new EmptyClass();
new ReservedClass();
new UnknownClass();
new BoolClass();
new NullClass();
new TextClass();
new IntClass();
new NatClass();
new FloatClass(32);
new FloatClass(64);
new FixedIntClass(8);
new FixedIntClass(16);
new FixedIntClass(32);
new FixedIntClass(64);
new FixedNatClass(8);
new FixedNatClass(16);
new FixedNatClass(32);
new FixedNatClass(64);
new PrincipalClass();
new class Relations {
	constructor(relations = /* @__PURE__ */ new Map()) {
		this.rels = relations;
	}
	copy() {
		const copy = /* @__PURE__ */ new Map();
		for (const [key, value] of this.rels.entries()) {
			const valCopy = new Map(value);
			copy.set(key, valCopy);
		}
		return new Relations(copy);
	}
	known(t1, t2) {
		return this.rels.get(t1.name)?.get(t2.name);
	}
	addNegative(t1, t2) {
		this.addNames(t1.name, t2.name, false);
	}
	add(t1, t2) {
		this.addNames(t1.name, t2.name, true);
	}
	display() {
		let result = "";
		for (const [t1, v] of this.rels) for (const [t2, known] of v) result += `${t1} ${known ? ":<" : "!<:"} ${t2}\n`;
		return result;
	}
	addNames(t1, t2, isSubtype) {
		const t1Map = this.rels.get(t1);
		if (t1Map == void 0) {
			const newMap = /* @__PURE__ */ new Map();
			newMap.set(t2, isSubtype);
			this.rels.set(t1, newMap);
		} else t1Map.set(t2, isSubtype);
	}
}();
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/candid/candid-core.js
var InputBox = class {
	constructor(idl, ui) {
		this.idl = idl;
		this.ui = ui;
		this.label = null;
		this.value = void 0;
		const status = document.createElement("span");
		status.className = "status";
		this.status = status;
		if (ui.input) {
			ui.input.addEventListener("blur", () => {
				if (ui.input.value === "") return;
				this.parse();
			});
			ui.input.addEventListener("input", () => {
				status.style.display = "none";
				ui.input.classList.remove("reject");
			});
		}
	}
	isRejected() {
		return this.value === void 0;
	}
	parse(config = {}) {
		if (this.ui.form) {
			const value = this.ui.form.parse(config);
			this.value = value;
			return value;
		}
		if (this.ui.input) {
			const input = this.ui.input;
			try {
				const value = this.ui.parse(this.idl, config, input.value);
				if (!this.idl.covariant(value)) throw new Error(`${input.value} is not of type ${this.idl.display()}`);
				this.status.style.display = "none";
				this.value = value;
				return value;
			} catch (err) {
				input.classList.add("reject");
				this.status.style.display = "block";
				this.status.innerHTML = `InputError: ${err.message}`;
				this.value = void 0;
				return;
			}
		}
		return null;
	}
	render(dom) {
		const container = document.createElement("span");
		if (this.label) {
			const label = document.createElement("label");
			label.innerText = this.label;
			container.appendChild(label);
		}
		if (this.ui.input) {
			container.appendChild(this.ui.input);
			container.appendChild(this.status);
		}
		if (this.ui.form) this.ui.form.render(container);
		dom.appendChild(container);
	}
};
var InputForm = class {
	constructor(ui) {
		this.ui = ui;
		this.form = [];
	}
	renderForm(dom) {
		if (this.ui.container) {
			this.form.forEach((e) => e.render(this.ui.container));
			dom.appendChild(this.ui.container);
		} else this.form.forEach((e) => e.render(dom));
	}
	render(dom) {
		if (this.ui.open && this.ui.event) {
			dom.appendChild(this.ui.open);
			const form = this;
			form.ui.open.addEventListener(form.ui.event, () => {
				if (form.ui.container) form.ui.container.innerHTML = "";
				else {
					const oldContainer = form.ui.open.nextElementSibling;
					if (oldContainer) oldContainer.parentNode.removeChild(oldContainer);
				}
				form.generateForm();
				form.renderForm(dom);
			});
		} else {
			this.generateForm();
			this.renderForm(dom);
		}
	}
};
var RecordForm = class extends InputForm {
	constructor(fields, ui) {
		super(ui);
		this.fields = fields;
		this.ui = ui;
	}
	generateForm() {
		this.form = this.fields.map(([key, type]) => {
			const input = this.ui.render(type);
			if (this.ui.labelMap && this.ui.labelMap.hasOwnProperty(key)) input.label = `${this.ui.labelMap[key]} `;
			else input.label = `${key} `;
			return input;
		});
	}
	parse(config) {
		const v = {};
		this.fields.forEach(([key, _], i) => {
			const value = this.form[i].parse(config);
			v[key] = value;
		});
		if (this.form.some((input) => input.isRejected())) return;
		return v;
	}
};
var TupleForm = class extends InputForm {
	constructor(components, ui) {
		super(ui);
		this.components = components;
		this.ui = ui;
	}
	generateForm() {
		this.form = this.components.map((type) => {
			return this.ui.render(type);
		});
	}
	parse(config) {
		const v = [];
		this.components.forEach((_, i) => {
			const value = this.form[i].parse(config);
			v.push(value);
		});
		if (this.form.some((input) => input.isRejected())) return;
		return v;
	}
};
var VariantForm = class extends InputForm {
	constructor(fields, ui) {
		super(ui);
		this.fields = fields;
		this.ui = ui;
	}
	generateForm() {
		const index = this.ui.open.selectedIndex;
		const [_, type] = this.fields[index];
		const variant = this.ui.render(type);
		this.form = [variant];
	}
	parse(config) {
		const select = this.ui.open;
		const selected = select.options[select.selectedIndex].value;
		const value = this.form[0].parse(config);
		if (value === void 0) return;
		const v = {};
		v[selected] = value;
		return v;
	}
};
var OptionForm = class extends InputForm {
	constructor(ty, ui) {
		super(ui);
		this.ty = ty;
		this.ui = ui;
	}
	generateForm() {
		if (this.ui.open.checked) {
			const opt = this.ui.render(this.ty);
			this.form = [opt];
		} else this.form = [];
	}
	parse(config) {
		if (this.form.length === 0) return [];
		const value = this.form[0].parse(config);
		if (value === void 0) return;
		return [value];
	}
};
var VecForm = class extends InputForm {
	constructor(ty, ui) {
		super(ui);
		this.ty = ty;
		this.ui = ui;
	}
	generateForm() {
		const len = +this.ui.open.value;
		this.form = [];
		for (let i = 0; i < len; i++) {
			const t = this.ui.render(this.ty);
			this.form.push(t);
		}
	}
	parse(config) {
		const value = this.form.map((input) => {
			return input.parse(config);
		});
		if (this.form.some((input) => input.isRejected())) return;
		return value;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/candid/candid-ui.js
var InputConfig = { parse: parsePrimitive };
var FormConfig = { render: renderInput };
var inputBox = (t, config) => {
	return new InputBox(t, {
		...InputConfig,
		...config
	});
};
var recordForm = (fields, config) => {
	return new RecordForm(fields, {
		...FormConfig,
		...config
	});
};
var tupleForm = (components, config) => {
	return new TupleForm(components, {
		...FormConfig,
		...config
	});
};
var variantForm = (fields, config) => {
	return new VariantForm(fields, {
		...FormConfig,
		...config
	});
};
var optForm = (ty, config) => {
	return new OptionForm(ty, {
		...FormConfig,
		...config
	});
};
var vecForm = (ty, config) => {
	return new VecForm(ty, {
		...FormConfig,
		...config
	});
};
var Render = class extends Visitor {
	visitType(t, _d) {
		const input = document.createElement("input");
		input.classList.add("argument");
		input.placeholder = t.display();
		return inputBox(t, { input });
	}
	visitNull(t, _d) {
		return inputBox(t, {});
	}
	visitRecord(t, fields, _d) {
		let config = {};
		if (fields.length > 1) {
			const container = document.createElement("div");
			container.classList.add("popup-form");
			config = { container };
		}
		return inputBox(t, { form: recordForm(fields, config) });
	}
	visitTuple(t, components, _d) {
		let config = {};
		if (components.length > 1) {
			const container = document.createElement("div");
			container.classList.add("popup-form");
			config = { container };
		}
		return inputBox(t, { form: tupleForm(components, config) });
	}
	visitVariant(t, fields, _d) {
		const select = document.createElement("select");
		for (const [key, _type] of fields) {
			const option = new Option(key);
			select.add(option);
		}
		select.selectedIndex = -1;
		select.classList.add("open");
		return inputBox(t, { form: variantForm(fields, {
			open: select,
			event: "change"
		}) });
	}
	visitOpt(t, ty, _d) {
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.classList.add("open");
		return inputBox(t, { form: optForm(ty, {
			open: checkbox,
			event: "change"
		}) });
	}
	visitVec(t, ty, _d) {
		const len = document.createElement("input");
		len.type = "number";
		len.min = "0";
		len.max = "100";
		len.style.width = "8rem";
		len.placeholder = "len";
		len.classList.add("open");
		const container = document.createElement("div");
		container.classList.add("popup-form");
		return inputBox(t, { form: vecForm(ty, {
			open: len,
			event: "change",
			container
		}) });
	}
	visitRec(_t, ty, _d) {
		return renderInput(ty);
	}
};
var Parse = class extends Visitor {
	visitNull(_t, _v) {
		return null;
	}
	visitBool(_t, v) {
		if (v === "true") return true;
		if (v === "false") return false;
		throw new Error(`Cannot parse ${v} as boolean`);
	}
	visitText(_t, v) {
		return v;
	}
	visitFloat(_t, v) {
		return parseFloat(v);
	}
	visitFixedInt(t, v) {
		if (t._bits <= 32) return parseInt(v, 10);
		return BigInt(v);
	}
	visitFixedNat(t, v) {
		if (t._bits <= 32) return parseInt(v, 10);
		return BigInt(v);
	}
	visitNumber(_t, v) {
		return BigInt(v);
	}
	visitPrincipal(_t, v) {
		return Principal$1.fromText(v);
	}
	visitService(_t, v) {
		return Principal$1.fromText(v);
	}
	visitFunc(_t, v) {
		const x = v.split(".", 2);
		return [Principal$1.fromText(x[0]), x[1]];
	}
};
var Random = class extends Visitor {
	visitNull(_t, _v) {
		return null;
	}
	visitBool(_t, _v) {
		return Math.random() < .5;
	}
	visitText(_t, _v) {
		return Math.random().toString(36).substring(6);
	}
	visitFloat(_t, _v) {
		return Math.random();
	}
	visitInt(_t, _v) {
		return BigInt(this.generateNumber(true));
	}
	visitNat(_t, _v) {
		return BigInt(this.generateNumber(false));
	}
	visitFixedInt(t, v) {
		const x = this.generateNumber(true);
		if (t._bits <= 32) return x;
		return BigInt(v);
	}
	visitFixedNat(t, v) {
		const x = this.generateNumber(false);
		if (t._bits <= 32) return x;
		return BigInt(v);
	}
	generateNumber(signed) {
		const num = Math.floor(Math.random() * 100);
		if (signed && Math.random() < .5) return -num;
		return num;
	}
};
function parsePrimitive(t, config, d) {
	if (config.random && d === "") return t.accept(new Random(), d);
	return t.accept(new Parse(), d);
}
/**
*
* @param t an IDL type
* @returns an input for that type
*/
function renderInput(t) {
	return t.accept(new Render(), null);
}
/**
*
* @param t an IDL Type
* @param input an InputBox
* @param value any
* @returns rendering that value to the provided input
*/
function renderValue(t, input, value) {
	return t.accept(new RenderValue(), {
		input,
		value
	});
}
var RenderValue = class extends Visitor {
	visitType(t, d) {
		d.input.ui.input.value = t.valueToString(d.value);
	}
	visitNull(_t, _d) {}
	visitText(_t, d) {
		d.input.ui.input.value = d.value;
	}
	visitRec(_t, ty, d) {
		renderValue(ty, d.input, d.value);
	}
	visitOpt(_t, ty, d) {
		if (d.value.length !== 0) {
			const form = d.input.ui.form;
			const open = form.ui.open;
			open.checked = true;
			open.dispatchEvent(new Event(form.ui.event));
			renderValue(ty, form.form[0], d.value[0]);
		}
	}
	visitRecord(_t, fields, d) {
		const form = d.input.ui.form;
		fields.forEach(([key, type], i) => {
			renderValue(type, form.form[i], d.value[key]);
		});
	}
	visitTuple(_t, components, d) {
		const form = d.input.ui.form;
		components.forEach((type, i) => {
			renderValue(type, form.form[i], d.value[i]);
		});
	}
	visitVariant(_t, fields, d) {
		const form = d.input.ui.form;
		const selected = Object.entries(d.value)[0];
		fields.forEach(([key, type], i) => {
			if (key === selected[0]) {
				const open = form.ui.open;
				open.selectedIndex = i;
				open.dispatchEvent(new Event(form.ui.event));
				renderValue(type, form.form[0], selected[1]);
			}
		});
	}
	visitVec(_t, ty, d) {
		const form = d.input.ui.form;
		const len = d.value.length;
		const open = form.ui.open;
		open.value = len;
		open.dispatchEvent(new Event(form.ui.event));
		d.value.forEach((v, i) => {
			renderValue(ty, form.form[i], v);
		});
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/utils/buffer.js
/**
* Compares two Uint8Arrays for equality.
* @param a The first Uint8Array.
* @param b The second Uint8Array.
* @returns True if the Uint8Arrays are equal, false otherwise.
*/
function uint8Equals(a, b) {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
	return true;
}
new TextEncoder().encode("\ric-state-root");
new TextEncoder().encode("\nic-request");
new TextEncoder().encode("\vic-response");
new TextEncoder().encode("ic-request-auth-delegation");
new TextDecoder();
var C = 2048;
new TextEncoder();
var a = new Uint8Array(C);
new DataView(a.buffer);
var MINUTES_TO_MILLISECONDS = BigInt(60) * BigInt(1e3);
BigInt(1) * MINUTES_TO_MILLISECONDS;
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/agent/http/types.js
/**
* @internal
*/
var Endpoint;
(function(Endpoint) {
	Endpoint["Query"] = "read";
	Endpoint["ReadState"] = "read_state";
	Endpoint["Call"] = "call";
})(Endpoint || (Endpoint = {}));
var SubmitRequestType;
(function(SubmitRequestType) {
	SubmitRequestType["Call"] = "call";
})(SubmitRequestType || (SubmitRequestType = {}));
var ReadRequestType;
(function(ReadRequestType) {
	ReadRequestType["Query"] = "query";
	ReadRequestType["ReadState"] = "read_state";
})(ReadRequestType || (ReadRequestType = {}));
/**
* Possible values for the request status in the IC state tree.
* @see https://internetcomputer.org/docs/references/ic-interface-spec#state-tree-request-status
*/
var RequestStatusResponseStatus;
(function(RequestStatusResponseStatus) {
	/** The call has made it past the endpoint into the IC's state. */
	RequestStatusResponseStatus["Received"] = "received";
	/** The initial effect of the call has happened or will happen. */
	RequestStatusResponseStatus["Processing"] = "processing";
	/** The call completed successfully; the reply is available at `/request_status/<id>/reply`. */
	RequestStatusResponseStatus["Replied"] = "replied";
	/** The call failed; reject code and message are available at `/request_status/<id>/reject_code` and `/request_status/<id>/reject_message`. */
	RequestStatusResponseStatus["Rejected"] = "rejected";
	/** The request status path is absent from the state tree, the request is unknown to the IC (never received or pruned after expiry). */
	RequestStatusResponseStatus["Unknown"] = "unknown";
	/** The IC has pruned the response data but remembers the request to prevent replay attacks. */
	RequestStatusResponseStatus["Done"] = "done";
})(RequestStatusResponseStatus || (RequestStatusResponseStatus = {}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/certificate.js
var NodeType;
(function(NodeType) {
	NodeType[NodeType["Empty"] = 0] = "Empty";
	NodeType[NodeType["Fork"] = 1] = "Fork";
	NodeType[NodeType["Labeled"] = 2] = "Labeled";
	NodeType[NodeType["Leaf"] = 3] = "Leaf";
	NodeType[NodeType["Pruned"] = 4] = "Pruned";
})(NodeType || (NodeType = {}));
hexToBytes("308182301d060d2b0601040182dc7c0503010201060c2b0601040182dc7c05030201036100");
var LookupPathStatus;
(function(LookupPathStatus) {
	LookupPathStatus["Unknown"] = "Unknown";
	LookupPathStatus["Absent"] = "Absent";
	LookupPathStatus["Found"] = "Found";
	LookupPathStatus["Error"] = "Error";
})(LookupPathStatus || (LookupPathStatus = {}));
var LookupSubtreeStatus;
(function(LookupSubtreeStatus) {
	LookupSubtreeStatus["Absent"] = "Absent";
	LookupSubtreeStatus["Unknown"] = "Unknown";
	LookupSubtreeStatus["Found"] = "Found";
})(LookupSubtreeStatus || (LookupSubtreeStatus = {}));
var LookupLabelStatus;
(function(LookupLabelStatus) {
	LookupLabelStatus["Absent"] = "Absent";
	LookupLabelStatus["Unknown"] = "Unknown";
	LookupLabelStatus["Found"] = "Found";
	LookupLabelStatus["Less"] = "Less";
	LookupLabelStatus["Greater"] = "Greater";
})(LookupLabelStatus || (LookupLabelStatus = {}));
Principal$1.fromText("tdb26-jop6k-aogll-7ltgs-eruif-6kk7m-qpktf-gdiqx-mxtrf-vb5e6-eqe");
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/der.js
var encodeLenBytes = (len) => {
	if (len <= 127) return 1;
	if (len <= 255) return 2;
	if (len <= 65535) return 3;
	if (len <= 16777215) return 4;
	throw InputError.fromCode(new DerEncodeErrorCode("Length too long (> 4 bytes)"));
};
var encodeLen = (buf, offset, len) => {
	if (len <= 127) {
		buf[offset] = len;
		return 1;
	}
	if (len <= 255) {
		buf[offset] = 129;
		buf[offset + 1] = len;
		return 2;
	}
	if (len <= 65535) {
		buf[offset] = 130;
		buf[offset + 1] = len >> 8;
		buf[offset + 2] = len;
		return 3;
	}
	if (len <= 16777215) {
		buf[offset] = 131;
		buf[offset + 1] = len >> 16;
		buf[offset + 2] = len >> 8;
		buf[offset + 3] = len;
		return 4;
	}
	throw InputError.fromCode(new DerEncodeErrorCode("Length too long (> 4 bytes)"));
};
var decodeLenBytes = (buf, offset) => {
	if (buf[offset] < 128) return 1;
	if (buf[offset] === 128) throw InputError.fromCode(new DerDecodeErrorCode("Invalid length 0"));
	if (buf[offset] === 129) return 2;
	if (buf[offset] === 130) return 3;
	if (buf[offset] === 131) return 4;
	throw InputError.fromCode(new DerDecodeErrorCode("Length too long (> 4 bytes)"));
};
var decodeLen = (buf, offset) => {
	const lenBytes = decodeLenBytes(buf, offset);
	if (lenBytes === 1) return buf[offset];
	if (lenBytes === 2) return buf[offset + 1];
	if (lenBytes === 3) return (buf[offset + 1] << 8) + buf[offset + 2];
	if (lenBytes === 4) return (buf[offset + 1] << 16) + (buf[offset + 2] << 8) + buf[offset + 3];
	throw InputError.fromCode(new DerDecodeErrorCode("Length too long (> 4 bytes)"));
};
Uint8Array.from([
	...[48, 12],
	...[6, 10],
	...[
		43,
		6,
		1,
		4,
		1,
		131,
		184,
		67,
		1,
		1
	]
]);
/**
* A DER encoded `SEQUENCE(OID)` for the Ed25519 algorithm
*/
var ED25519_OID = Uint8Array.from([
	...[48, 5],
	...[6, 3],
	...[
		43,
		101,
		112
	]
]);
Uint8Array.from([
	...[48, 16],
	...[6, 7],
	...[
		42,
		134,
		72,
		206,
		61,
		2,
		1
	],
	...[6, 5],
	...[
		43,
		129,
		4,
		0,
		10
	]
]);
Uint8Array.from([
	...[48, 29],
	...[6, 13],
	...[
		43,
		6,
		1,
		4,
		1,
		130,
		220,
		124,
		5,
		3,
		1,
		2,
		1
	],
	...[6, 12],
	...[
		43,
		6,
		1,
		4,
		1,
		130,
		220,
		124,
		5,
		3,
		2,
		1
	]
]);
/**
* Wraps the given `payload` in a DER encoding tagged with the given encoded `oid` like so:
* `SEQUENCE(oid, BITSTRING(payload))`
* @param payload The payload to encode as the bit string
* @param oid The DER encoded (and SEQUENCE wrapped!) OID to tag the payload with
*/
function wrapDER(payload, oid) {
	const bitStringHeaderLength = 2 + encodeLenBytes(payload.byteLength + 1);
	const len = oid.byteLength + bitStringHeaderLength + payload.byteLength;
	let offset = 0;
	const buf = new Uint8Array(1 + encodeLenBytes(len) + len);
	buf[offset++] = 48;
	offset += encodeLen(buf, offset, len);
	buf.set(oid, offset);
	offset += oid.byteLength;
	buf[offset++] = 3;
	offset += encodeLen(buf, offset, payload.byteLength + 1);
	buf[offset++] = 0;
	buf.set(new Uint8Array(payload), offset);
	return buf;
}
/**
* Extracts a payload from the given `derEncoded` data, and checks that it was tagged with the given `oid`.
*
* `derEncoded = SEQUENCE(oid, BITSTRING(payload))`
* @param derEncoded The DER encoded and tagged data
* @param oid The DER encoded (and SEQUENCE wrapped!) expected OID
* @returns The unwrapped payload
*/
var unwrapDER = (derEncoded, oid) => {
	let offset = 0;
	const expect = (n, msg) => {
		if (buf[offset++] !== n) throw InputError.fromCode(new DerDecodeErrorCode(`Expected ${msg} at offset ${offset}`));
	};
	const buf = new Uint8Array(derEncoded);
	expect(48, "sequence");
	offset += decodeLenBytes(buf, offset);
	if (!uint8Equals(buf.slice(offset, offset + oid.byteLength), oid)) throw InputError.fromCode(new DerDecodeErrorCode("Not the expected OID."));
	offset += oid.byteLength;
	expect(3, "bit string");
	const payloadLen = decodeLen(buf, offset) - 1;
	offset += decodeLenBytes(buf, offset);
	expect(0, "0 padding");
	const result = buf.slice(offset);
	if (payloadLen !== result.length) throw InputError.fromCode(new DerDecodeLengthMismatchErrorCode(payloadLen, result.length));
	return result;
};
(class Ed25519PublicKey {
	static from(key) {
		return this.fromDer(key.toDer());
	}
	static fromRaw(rawKey) {
		return new Ed25519PublicKey(rawKey);
	}
	static fromDer(derKey) {
		return new Ed25519PublicKey(this.derDecode(derKey));
	}
	static {
		this.RAW_KEY_LENGTH = 32;
	}
	static derEncode(publicKey) {
		return wrapDER(publicKey, ED25519_OID);
	}
	static derDecode(key) {
		const unwrapped = unwrapDER(key, ED25519_OID);
		if (unwrapped.length !== this.RAW_KEY_LENGTH) throw InputError.fromCode(new DerDecodeErrorCode("An Ed25519 public key must be exactly 32 bytes long"));
		return unwrapped;
	}
	#rawKey;
	get rawKey() {
		return this.#rawKey;
	}
	#derKey;
	get derKey() {
		return this.#derKey;
	}
	constructor(key) {
		if (key.byteLength !== Ed25519PublicKey.RAW_KEY_LENGTH) throw InputError.fromCode(new DerDecodeErrorCode("An Ed25519 public key must be exactly 32 bytes long"));
		this.#rawKey = key;
		this.#derKey = Ed25519PublicKey.derEncode(key);
	}
	toDer() {
		return this.derKey;
	}
	toRaw() {
		return this.rawKey;
	}
});
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/polling/backoff.js
var RANDOMIZATION_FACTOR = .5;
var MULTIPLIER = 1.5;
var INITIAL_INTERVAL_MSEC = 500;
var MAX_INTERVAL_MSEC = 6e4;
var MAX_ELAPSED_TIME_MSEC = 9e5;
var MAX_ITERATIONS = 10;
(class ExponentialBackoff {
	#currentInterval;
	#randomizationFactor;
	#multiplier;
	#maxInterval;
	#startTime;
	#maxElapsedTime;
	#maxIterations;
	#date;
	#count = 0;
	static {
		this.default = {
			initialInterval: INITIAL_INTERVAL_MSEC,
			randomizationFactor: RANDOMIZATION_FACTOR,
			multiplier: MULTIPLIER,
			maxInterval: MAX_INTERVAL_MSEC,
			maxElapsedTime: MAX_ELAPSED_TIME_MSEC,
			maxIterations: MAX_ITERATIONS,
			date: Date
		};
	}
	constructor(options = ExponentialBackoff.default) {
		const { initialInterval = INITIAL_INTERVAL_MSEC, randomizationFactor = RANDOMIZATION_FACTOR, multiplier = MULTIPLIER, maxInterval = MAX_INTERVAL_MSEC, maxElapsedTime = MAX_ELAPSED_TIME_MSEC, maxIterations = MAX_ITERATIONS, date = Date } = options;
		this.#currentInterval = initialInterval;
		this.#randomizationFactor = randomizationFactor;
		this.#multiplier = multiplier;
		this.#maxInterval = maxInterval;
		this.#date = date;
		this.#startTime = date.now();
		this.#maxElapsedTime = maxElapsedTime;
		this.#maxIterations = maxIterations;
	}
	get ellapsedTimeInMsec() {
		return this.#date.now() - this.#startTime;
	}
	get currentInterval() {
		return this.#currentInterval;
	}
	get count() {
		return this.#count;
	}
	get randomValueFromInterval() {
		const delta = this.#randomizationFactor * this.#currentInterval;
		const min = this.#currentInterval - delta;
		const max = this.#currentInterval + delta;
		return Math.random() * (max - min) + min;
	}
	incrementCurrentInterval() {
		this.#currentInterval = Math.min(this.#currentInterval * this.#multiplier, this.#maxInterval);
		this.#count++;
		return this.#currentInterval;
	}
	next() {
		if (this.ellapsedTimeInMsec >= this.#maxElapsedTime || this.#count >= this.#maxIterations) return null;
		this.incrementCurrentInterval();
		return this.randomValueFromInterval;
	}
});
new TextEncoder().encode("icfs-chunk/");
new TextEncoder().encode("icfs-metadata/");
new TextEncoder().encode("ynode/");
// src/backend.ts
function candid_some(value) {
	return [value];
}
function candid_none() {
	return [];
}
function record_opt_to_undefined(arg) {
	return arg == null ? void 0 : arg;
}
var Backend = class {
	actor;
	_uploadFile;
	_downloadFile;
	processError;
	constructor(actor, _uploadFile, _downloadFile, processError) {
		this.actor = actor;
		this._uploadFile = _uploadFile;
		this._downloadFile = _downloadFile;
		this.processError = processError;
	}
	async acknowledgeNotification(arg0) {
		if (this.processError) try {
			return await this.actor.acknowledgeNotification(arg0);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.acknowledgeNotification(arg0);
	}
	async assignProviderAccess(arg0, arg1) {
		if (this.processError) try {
			return await this.actor.assignProviderAccess(arg0, to_candid_vec_n1(this._uploadFile, this._downloadFile, arg1));
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.assignProviderAccess(arg0, to_candid_vec_n1(this._uploadFile, this._downloadFile, arg1));
	}
	async blockIp(arg0) {
		if (this.processError) try {
			const result = await this.actor.blockIp(to_candid_record_n3(this._uploadFile, this._downloadFile, arg0));
			return from_candid_PlaybookResult_n4(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.blockIp(to_candid_record_n3(this._uploadFile, this._downloadFile, arg0));
			return from_candid_PlaybookResult_n4(this._uploadFile, this._downloadFile, result);
		}
	}
	async clearProviderCredential(arg0) {
		if (this.processError) try {
			const result = await this.actor.clearProviderCredential(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0));
			return from_candid_Result_1_n9(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.clearProviderCredential(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0));
			return from_candid_Result_1_n9(this._uploadFile, this._downloadFile, result);
		}
	}
	async deleteAlertRule(arg0) {
		if (this.processError) try {
			return await this.actor.deleteAlertRule(arg0);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.deleteAlertRule(arg0);
	}
	async deleteReport(arg0, arg1) {
		if (this.processError) try {
			return await this.actor.deleteReport(arg0, arg1);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.deleteReport(arg0, arg1);
	}
	async deleteVaultSecret(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.deleteVaultSecret(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1);
			return from_candid_Result_n13(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.deleteVaultSecret(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1);
			return from_candid_Result_n13(this._uploadFile, this._downloadFile, result);
		}
	}
	async disableAzureAdAccount(arg0) {
		if (this.processError) try {
			const result = await this.actor.disableAzureAdAccount(arg0);
			return from_candid_PlaybookResult_n4(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.disableAzureAdAccount(arg0);
			return from_candid_PlaybookResult_n4(this._uploadFile, this._downloadFile, result);
		}
	}
	async enrichAlertPublic(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.enrichAlertPublic(arg0, arg1);
			return from_candid_Result_8_n16(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.enrichAlertPublic(arg0, arg1);
			return from_candid_Result_8_n16(this._uploadFile, this._downloadFile, result);
		}
	}
	async escalateToIncident(arg0) {
		if (this.processError) try {
			const result = await this.actor.escalateToIncident(to_candid_record_n18(this._uploadFile, this._downloadFile, arg0));
			return from_candid_PlaybookResult_n4(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.escalateToIncident(to_candid_record_n18(this._uploadFile, this._downloadFile, arg0));
			return from_candid_PlaybookResult_n4(this._uploadFile, this._downloadFile, result);
		}
	}
	async execute(arg0) {
		if (this.processError) try {
			const result = await this.actor.execute(arg0);
			return from_candid_Result__1_n19(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.execute(arg0);
			return from_candid_Result__1_n19(this._uploadFile, this._downloadFile, result);
		}
	}
	async exportComplianceCsv(arg0) {
		if (this.processError) try {
			return await this.actor.exportComplianceCsv(to_candid_ComplianceFramework_n27(this._uploadFile, this._downloadFile, arg0));
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.exportComplianceCsv(to_candid_ComplianceFramework_n27(this._uploadFile, this._downloadFile, arg0));
	}
	async exportCompliancePdf(arg0) {
		if (this.processError) try {
			return await this.actor.exportCompliancePdf(to_candid_ComplianceFramework_n27(this._uploadFile, this._downloadFile, arg0));
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.exportCompliancePdf(to_candid_ComplianceFramework_n27(this._uploadFile, this._downloadFile, arg0));
	}
	async exportReportPdf(arg0, arg1, arg2, arg3, arg4) {
		if (this.processError) try {
			return await this.actor.exportReportPdf(to_candid_ReportType_n28(this._uploadFile, this._downloadFile, arg0), arg1, arg2, arg3, to_candid_vec_n1(this._uploadFile, this._downloadFile, arg4));
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.exportReportPdf(to_candid_ReportType_n28(this._uploadFile, this._downloadFile, arg0), arg1, arg2, arg3, to_candid_vec_n1(this._uploadFile, this._downloadFile, arg4));
	}
	async forceGcpIamReview(arg0) {
		if (this.processError) try {
			const result = await this.actor.forceGcpIamReview(arg0);
			return from_candid_PlaybookResult_n4(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.forceGcpIamReview(arg0);
			return from_candid_PlaybookResult_n4(this._uploadFile, this._downloadFile, result);
		}
	}
	async generateReport(arg0) {
		if (this.processError) try {
			const result = await this.actor.generateReport(arg0);
			return from_candid_Result_7_n29(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.generateReport(arg0);
			return from_candid_Result_7_n29(this._uploadFile, this._downloadFile, result);
		}
	}
	async getAlertById(arg0) {
		if (this.processError) try {
			const result = await this.actor.getAlertById(arg0);
			return from_candid_opt_n31(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getAlertById(arg0);
			return from_candid_opt_n31(this._uploadFile, this._downloadFile, result);
		}
	}
	async getAlertRules(arg0) {
		if (this.processError) try {
			const result = await this.actor.getAlertRules(arg0);
			return from_candid_vec_n45(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getAlertRules(arg0);
			return from_candid_vec_n45(this._uploadFile, this._downloadFile, result);
		}
	}
	async getAlertsForCorrelation(arg0) {
		if (this.processError) try {
			const result = await this.actor.getAlertsForCorrelation(arg0);
			return from_candid_vec_n53(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getAlertsForCorrelation(arg0);
			return from_candid_vec_n53(this._uploadFile, this._downloadFile, result);
		}
	}
	async getApiDoc() {
		if (this.processError) try {
			return await this.actor.getApiDoc();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.getApiDoc();
	}
	async getAssetById(arg0) {
		if (this.processError) try {
			const result = await this.actor.getAssetById(arg0);
			return from_candid_opt_n54(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getAssetById(arg0);
			return from_candid_opt_n54(this._uploadFile, this._downloadFile, result);
		}
	}
	async getAssetFindings(arg0) {
		if (this.processError) try {
			const result = await this.actor.getAssetFindings(arg0);
			return from_candid_vec_n53(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getAssetFindings(arg0);
			return from_candid_vec_n53(this._uploadFile, this._downloadFile, result);
		}
	}
	async getAssets(arg0) {
		if (this.processError) try {
			const result = await this.actor.getAssets(to_candid_record_n58(this._uploadFile, this._downloadFile, arg0));
			return from_candid_vec_n60(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getAssets(to_candid_record_n58(this._uploadFile, this._downloadFile, arg0));
			return from_candid_vec_n60(this._uploadFile, this._downloadFile, result);
		}
	}
	async getAuditLog(arg0, arg1) {
		if (this.processError) try {
			return await this.actor.getAuditLog(arg0, arg1);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.getAuditLog(arg0, arg1);
	}
	async getComplianceControlGaps(arg0) {
		if (this.processError) try {
			const result = await this.actor.getComplianceControlGaps(to_candid_ComplianceFramework_n27(this._uploadFile, this._downloadFile, arg0));
			return from_candid_vec_n61(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getComplianceControlGaps(to_candid_ComplianceFramework_n27(this._uploadFile, this._downloadFile, arg0));
			return from_candid_vec_n61(this._uploadFile, this._downloadFile, result);
		}
	}
	async getComplianceStatus(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.getComplianceStatus(to_candid_ComplianceFramework_n27(this._uploadFile, this._downloadFile, arg0), to_candid_opt_n66(this._uploadFile, this._downloadFile, arg1));
			return from_candid_record_n67(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getComplianceStatus(to_candid_ComplianceFramework_n27(this._uploadFile, this._downloadFile, arg0), to_candid_opt_n66(this._uploadFile, this._downloadFile, arg1));
			return from_candid_record_n67(this._uploadFile, this._downloadFile, result);
		}
	}
	async getComplianceTrend(arg0) {
		if (this.processError) try {
			const result = await this.actor.getComplianceTrend(to_candid_ComplianceFramework_n27(this._uploadFile, this._downloadFile, arg0));
			return from_candid_vec_n68(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getComplianceTrend(to_candid_ComplianceFramework_n27(this._uploadFile, this._downloadFile, arg0));
			return from_candid_vec_n68(this._uploadFile, this._downloadFile, result);
		}
	}
	async getCorrelatedIncidentById(arg0) {
		if (this.processError) try {
			const result = await this.actor.getCorrelatedIncidentById(arg0);
			return from_candid_opt_n71(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getCorrelatedIncidentById(arg0);
			return from_candid_opt_n71(this._uploadFile, this._downloadFile, result);
		}
	}
	async getCorrelatedIncidents(arg0) {
		if (this.processError) try {
			const result = await this.actor.getCorrelatedIncidents(arg0);
			return from_candid_vec_n76(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getCorrelatedIncidents(arg0);
			return from_candid_vec_n76(this._uploadFile, this._downloadFile, result);
		}
	}
	async getCorrelationStats() {
		if (this.processError) try {
			return await this.actor.getCorrelationStats();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.getCorrelationStats();
	}
	async getCredentialHealth() {
		if (this.processError) try {
			const result = await this.actor.getCredentialHealth();
			return from_candid_vec_n78(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getCredentialHealth();
			return from_candid_vec_n78(this._uploadFile, this._downloadFile, result);
		}
	}
	async getEnrichmentKeys() {
		if (this.processError) try {
			return await this.actor.getEnrichmentKeys();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.getEnrichmentKeys();
	}
	async getFailedIngestions(arg0, arg1) {
		if (this.processError) try {
			return await this.actor.getFailedIngestions(to_candid_opt_n66(this._uploadFile, this._downloadFile, arg0), arg1);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.getFailedIngestions(to_candid_opt_n66(this._uploadFile, this._downloadFile, arg0), arg1);
	}
	async getIngestionStats() {
		if (this.processError) try {
			const result = await this.actor.getIngestionStats();
			return from_candid_IngestionStats_n84(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getIngestionStats();
			return from_candid_IngestionStats_n84(this._uploadFile, this._downloadFile, result);
		}
	}
	async getMyProviders() {
		if (this.processError) try {
			const result = await this.actor.getMyProviders();
			return from_candid_vec_n75(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getMyProviders();
			return from_candid_vec_n75(this._uploadFile, this._downloadFile, result);
		}
	}
	async getNormalizedAlerts(arg0) {
		if (this.processError) try {
			const result = await this.actor.getNormalizedAlerts(to_candid_record_n91(this._uploadFile, this._downloadFile, arg0));
			return from_candid_Page_n94(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getNormalizedAlerts(to_candid_record_n91(this._uploadFile, this._downloadFile, arg0));
			return from_candid_Page_n94(this._uploadFile, this._downloadFile, result);
		}
	}
	async getNotificationLogs(arg0) {
		if (this.processError) try {
			const result = await this.actor.getNotificationLogs(arg0);
			return from_candid_vec_n97(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getNotificationLogs(arg0);
			return from_candid_vec_n97(this._uploadFile, this._downloadFile, result);
		}
	}
	async getNotificationRouting(arg0) {
		if (this.processError) try {
			const result = await this.actor.getNotificationRouting(arg0);
			return from_candid_opt_n101(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getNotificationRouting(arg0);
			return from_candid_opt_n101(this._uploadFile, this._downloadFile, result);
		}
	}
	async getPipelineHealth() {
		if (this.processError) try {
			return await this.actor.getPipelineHealth();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.getPipelineHealth();
	}
	async getProviderCredentialStatus(arg0) {
		if (this.processError) try {
			const result = await this.actor.getProviderCredentialStatus(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0));
			return from_candid_ProviderCredentialStatus_n104(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getProviderCredentialStatus(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0));
			return from_candid_ProviderCredentialStatus_n104(this._uploadFile, this._downloadFile, result);
		}
	}
	async getProviderStates() {
		if (this.processError) try {
			const result = await this.actor.getProviderStates();
			return from_candid_vec_n86(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getProviderStates();
			return from_candid_vec_n86(this._uploadFile, this._downloadFile, result);
		}
	}
	async getRateLimitStates() {
		if (this.processError) try {
			const result = await this.actor.getRateLimitStates();
			return from_candid_vec_n106(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getRateLimitStates();
			return from_candid_vec_n106(this._uploadFile, this._downloadFile, result);
		}
	}
	async getRawFindings(arg0, arg1, arg2) {
		if (this.processError) try {
			const result = await this.actor.getRawFindings(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1, arg2);
			return from_candid_record_n110(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getRawFindings(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1, arg2);
			return from_candid_record_n110(this._uploadFile, this._downloadFile, result);
		}
	}
	async getReportCsv(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.getReportCsv(arg0, arg1);
			return from_candid_opt_n6(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getReportCsv(arg0, arg1);
			return from_candid_opt_n6(this._uploadFile, this._downloadFile, result);
		}
	}
	async getReportEmailConfig(arg0) {
		if (this.processError) try {
			return await this.actor.getReportEmailConfig(arg0);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.getReportEmailConfig(arg0);
	}
	async getReportRecipients(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.getReportRecipients(to_candid_ReportType_n28(this._uploadFile, this._downloadFile, arg0), arg1);
			return from_candid_opt_n114(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getReportRecipients(to_candid_ReportType_n28(this._uploadFile, this._downloadFile, arg0), arg1);
			return from_candid_opt_n114(this._uploadFile, this._downloadFile, result);
		}
	}
	async getReportRun(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.getReportRun(arg0, arg1);
			return from_candid_opt_n118(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getReportRun(arg0, arg1);
			return from_candid_opt_n118(this._uploadFile, this._downloadFile, result);
		}
	}
	async getReportRuns(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.getReportRuns(arg0, arg1);
			return from_candid_vec_n127(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getReportRuns(arg0, arg1);
			return from_candid_vec_n127(this._uploadFile, this._downloadFile, result);
		}
	}
	async getReports(arg0) {
		if (this.processError) try {
			const result = await this.actor.getReports(arg0);
			return from_candid_vec_n128(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getReports(arg0);
			return from_candid_vec_n128(this._uploadFile, this._downloadFile, result);
		}
	}
	async getThrottleEvents(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.getThrottleEvents(to_candid_opt_n66(this._uploadFile, this._downloadFile, arg0), arg1);
			return from_candid_vec_n131(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getThrottleEvents(to_candid_opt_n66(this._uploadFile, this._downloadFile, arg0), arg1);
			return from_candid_vec_n131(this._uploadFile, this._downloadFile, result);
		}
	}
	async getTimeline(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.getTimeline(arg0, arg1);
			return from_candid_vec_n134(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getTimeline(arg0, arg1);
			return from_candid_vec_n134(this._uploadFile, this._downloadFile, result);
		}
	}
	async getWebhookSecretStatus() {
		if (this.processError) try {
			return await this.actor.getWebhookSecretStatus();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.getWebhookSecretStatus();
	}
	async getWebhookStats() {
		if (this.processError) try {
			return await this.actor.getWebhookStats();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.getWebhookStats();
	}
	async globalSearch(arg0, arg1, arg2) {
		if (this.processError) try {
			const result = await this.actor.globalSearch(arg0, arg1, arg2);
			return from_candid_record_n138(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.globalSearch(arg0, arg1, arg2);
			return from_candid_record_n138(this._uploadFile, this._downloadFile, result);
		}
	}
	async hasAdminCredentials() {
		if (this.processError) try {
			return await this.actor.hasAdminCredentials();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.hasAdminCredentials();
	}
	async http_request(arg0) {
		if (this.processError) try {
			const result = await this.actor.http_request(arg0);
			return from_candid_record_n142(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.http_request(arg0);
			return from_candid_record_n142(this._uploadFile, this._downloadFile, result);
		}
	}
	async http_request_update(arg0) {
		if (this.processError) try {
			const result = await this.actor.http_request_update(arg0);
			return from_candid_record_n142(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.http_request_update(arg0);
			return from_candid_record_n142(this._uploadFile, this._downloadFile, result);
		}
	}
	async isolateResource(arg0) {
		if (this.processError) try {
			const result = await this.actor.isolateResource(to_candid_record_n145(this._uploadFile, this._downloadFile, arg0));
			return from_candid_PlaybookResult_n4(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.isolateResource(to_candid_record_n145(this._uploadFile, this._downloadFile, arg0));
			return from_candid_PlaybookResult_n4(this._uploadFile, this._downloadFile, result);
		}
	}
	async listUserAssignments() {
		if (this.processError) try {
			const result = await this.actor.listUserAssignments();
			return from_candid_vec_n146(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.listUserAssignments();
			return from_candid_vec_n146(this._uploadFile, this._downloadFile, result);
		}
	}
	async listVaultSecrets(arg0) {
		if (this.processError) try {
			const result = await this.actor.listVaultSecrets(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0));
			return from_candid_vec_n149(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.listVaultSecrets(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0));
			return from_candid_vec_n149(this._uploadFile, this._downloadFile, result);
		}
	}
	async removeProviderAccess(arg0, arg1) {
		if (this.processError) try {
			return await this.actor.removeProviderAccess(arg0, to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg1));
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.removeProviderAccess(arg0, to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg1));
	}
	async resetProviderBackoff(arg0) {
		if (this.processError) try {
			const result = await this.actor.resetProviderBackoff(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0));
			return from_candid_Result_6_n152(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.resetProviderBackoff(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0));
			return from_candid_Result_6_n152(this._uploadFile, this._downloadFile, result);
		}
	}
	async revealVaultSecret(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.revealVaultSecret(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1);
			return from_candid_Result_5_n155(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.revealVaultSecret(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1);
			return from_candid_Result_5_n155(this._uploadFile, this._downloadFile, result);
		}
	}
	async revokeIamCredentials(arg0) {
		if (this.processError) try {
			const result = await this.actor.revokeIamCredentials(to_candid_record_n157(this._uploadFile, this._downloadFile, arg0));
			return from_candid_PlaybookResult_n4(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.revokeIamCredentials(to_candid_record_n157(this._uploadFile, this._downloadFile, arg0));
			return from_candid_PlaybookResult_n4(this._uploadFile, this._downloadFile, result);
		}
	}
	async runEscalationCheck() {
		if (this.processError) try {
			return await this.actor.runEscalationCheck();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.runEscalationCheck();
	}
	async runReportOnDemand(arg0, arg1, arg2, arg3, arg4) {
		if (this.processError) try {
			const result = await this.actor.runReportOnDemand(to_candid_ReportType_n28(this._uploadFile, this._downloadFile, arg0), arg1, arg2, arg3, to_candid_vec_n1(this._uploadFile, this._downloadFile, arg4));
			return from_candid_Result_4_n158(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.runReportOnDemand(to_candid_ReportType_n28(this._uploadFile, this._downloadFile, arg0), arg1, arg2, arg3, to_candid_vec_n1(this._uploadFile, this._downloadFile, arg4));
			return from_candid_Result_4_n158(this._uploadFile, this._downloadFile, result);
		}
	}
	async runScheduledReport(arg0, arg1, arg2, arg3) {
		if (this.processError) try {
			const result = await this.actor.runScheduledReport(to_candid_ReportType_n28(this._uploadFile, this._downloadFile, arg0), to_candid_ReportTrigger_n162(this._uploadFile, this._downloadFile, arg1), arg2, to_candid_vec_n1(this._uploadFile, this._downloadFile, arg3));
			return from_candid_Result_4_n158(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.runScheduledReport(to_candid_ReportType_n28(this._uploadFile, this._downloadFile, arg0), to_candid_ReportTrigger_n162(this._uploadFile, this._downloadFile, arg1), arg2, to_candid_vec_n1(this._uploadFile, this._downloadFile, arg3));
			return from_candid_Result_4_n158(this._uploadFile, this._downloadFile, result);
		}
	}
	async saveAlertRule(arg0) {
		if (this.processError) try {
			return await this.actor.saveAlertRule(to_candid_AlertRule_n163(this._uploadFile, this._downloadFile, arg0));
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.saveAlertRule(to_candid_AlertRule_n163(this._uploadFile, this._downloadFile, arg0));
	}
	async saveEnrichmentKeys(arg0) {
		if (this.processError) try {
			return await this.actor.saveEnrichmentKeys(to_candid_record_n168(this._uploadFile, this._downloadFile, arg0));
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.saveEnrichmentKeys(to_candid_record_n168(this._uploadFile, this._downloadFile, arg0));
	}
	async saveNotificationRouting(arg0) {
		if (this.processError) try {
			const result = await this.actor.saveNotificationRouting(to_candid_NotificationRouting_n169(this._uploadFile, this._downloadFile, arg0));
			return from_candid_Result_3_n171(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.saveNotificationRouting(to_candid_NotificationRouting_n169(this._uploadFile, this._downloadFile, arg0));
			return from_candid_Result_3_n171(this._uploadFile, this._downloadFile, result);
		}
	}
	async saveProviderCredential(arg0) {
		if (this.processError) try {
			const result = await this.actor.saveProviderCredential(to_candid_ProviderCredentialInput_n175(this._uploadFile, this._downloadFile, arg0));
			return from_candid_Result_1_n9(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.saveProviderCredential(to_candid_ProviderCredentialInput_n175(this._uploadFile, this._downloadFile, arg0));
			return from_candid_Result_1_n9(this._uploadFile, this._downloadFile, result);
		}
	}
	async saveReportEmailConfig(arg0) {
		if (this.processError) try {
			return await this.actor.saveReportEmailConfig(arg0);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.saveReportEmailConfig(arg0);
	}
	async saveReportRecipients(arg0) {
		if (this.processError) try {
			const result = await this.actor.saveReportRecipients(to_candid_ReportRecipientConfig_n179(this._uploadFile, this._downloadFile, arg0));
			return from_candid_Result_2_n181(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.saveReportRecipients(to_candid_ReportRecipientConfig_n179(this._uploadFile, this._downloadFile, arg0));
			return from_candid_Result_2_n181(this._uploadFile, this._downloadFile, result);
		}
	}
	async saveVaultSecret(arg0, arg1, arg2) {
		if (this.processError) try {
			const result = await this.actor.saveVaultSecret(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1, arg2);
			return from_candid_Result_n13(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.saveVaultSecret(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1, arg2);
			return from_candid_Result_n13(this._uploadFile, this._downloadFile, result);
		}
	}
	async saveWebhookSecret(arg0, arg1) {
		if (this.processError) try {
			return await this.actor.saveWebhookSecret(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.saveWebhookSecret(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1);
	}
	async schema() {
		if (this.processError) try {
			return await this.actor.schema();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.schema();
	}
	async setPollingInterval(arg0, arg1) {
		if (this.processError) try {
			return await this.actor.setPollingInterval(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), to_candid_PollingInterval_n183(this._uploadFile, this._downloadFile, arg1));
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.setPollingInterval(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), to_candid_PollingInterval_n183(this._uploadFile, this._downloadFile, arg1));
	}
	async testAwsConnection() {
		if (this.processError) try {
			const result = await this.actor.testAwsConnection();
			return from_candid_ConnectionTestResult_n184(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.testAwsConnection();
			return from_candid_ConnectionTestResult_n184(this._uploadFile, this._downloadFile, result);
		}
	}
	async testAzureConnection() {
		if (this.processError) try {
			const result = await this.actor.testAzureConnection();
			return from_candid_ConnectionTestResult_n184(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.testAzureConnection();
			return from_candid_ConnectionTestResult_n184(this._uploadFile, this._downloadFile, result);
		}
	}
	async testGcpConnection() {
		if (this.processError) try {
			const result = await this.actor.testGcpConnection();
			return from_candid_ConnectionTestResult_n184(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.testGcpConnection();
			return from_candid_ConnectionTestResult_n184(this._uploadFile, this._downloadFile, result);
		}
	}
	async testProviderConnection(arg0) {
		if (this.processError) try {
			const result = await this.actor.testProviderConnection(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0));
			return from_candid_ConnectionTestResult_n184(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.testProviderConnection(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0));
			return from_candid_ConnectionTestResult_n184(this._uploadFile, this._downloadFile, result);
		}
	}
	async transform(arg0) {
		if (this.processError) try {
			return await this.actor.transform(arg0);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.transform(arg0);
	}
	async triggerPoll(arg0) {
		if (this.processError) try {
			return await this.actor.triggerPoll(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0));
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.triggerPoll(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0));
	}
	async updateAlertStatus(arg0, arg1, arg2) {
		if (this.processError) try {
			return await this.actor.updateAlertStatus(arg0, to_candid_AlertStatus_n92(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n186(this._uploadFile, this._downloadFile, arg2));
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.updateAlertStatus(arg0, to_candid_AlertStatus_n92(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n186(this._uploadFile, this._downloadFile, arg2));
	}
	async updateCorrelatedIncidentStatus(arg0, arg1, arg2, arg3) {
		if (this.processError) try {
			return await this.actor.updateCorrelatedIncidentStatus(arg0, to_candid_IncidentStatus_n187(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n186(this._uploadFile, this._downloadFile, arg2), to_candid_opt_n186(this._uploadFile, this._downloadFile, arg3));
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.updateCorrelatedIncidentStatus(arg0, to_candid_IncidentStatus_n187(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n186(this._uploadFile, this._downloadFile, arg2), to_candid_opt_n186(this._uploadFile, this._downloadFile, arg3));
	}
	async updateProviderCredential(arg0) {
		if (this.processError) try {
			const result = await this.actor.updateProviderCredential(to_candid_ProviderCredentialInput_n175(this._uploadFile, this._downloadFile, arg0));
			return from_candid_Result_1_n9(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.updateProviderCredential(to_candid_ProviderCredentialInput_n175(this._uploadFile, this._downloadFile, arg0));
			return from_candid_Result_1_n9(this._uploadFile, this._downloadFile, result);
		}
	}
	async updateVaultSecret(arg0, arg1, arg2) {
		if (this.processError) try {
			const result = await this.actor.updateVaultSecret(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1, arg2);
			return from_candid_Result_n13(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.updateVaultSecret(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1, arg2);
			return from_candid_Result_n13(this._uploadFile, this._downloadFile, result);
		}
	}
};
function from_candid_AlertEnrichment_n40(_uploadFile, _downloadFile, value) {
	return from_candid_record_n41(_uploadFile, _downloadFile, value);
}
function from_candid_AlertRule_n46(_uploadFile, _downloadFile, value) {
	return from_candid_record_n47(_uploadFile, _downloadFile, value);
}
function from_candid_AlertStatus_n34(_uploadFile, _downloadFile, value) {
	return "Open" in value ? "Open" : "InProgress" in value ? "InProgress" : "Resolved" in value ? "Resolved" : value;
}
function from_candid_AssetType_n57(_uploadFile, _downloadFile, value) {
	return "S3" in value ? "S3" : "AzureVM" in value ? "AzureVM" : "EC2" in value ? "EC2" : "RDS" in value ? "RDS" : "AzureDatabase" in value ? "AzureDatabase" : "GCPStorage" in value ? "GCPStorage" : "GCPCloudSQL" in value ? "GCPCloudSQL" : "Lambda" in value ? "Lambda" : "AzureStorage" in value ? "AzureStorage" : "GCPCompute" in value ? "GCPCompute" : "Other" in value ? "Other" : value;
}
function from_candid_Asset_n55(_uploadFile, _downloadFile, value) {
	return from_candid_record_n56(_uploadFile, _downloadFile, value);
}
function from_candid_Cell_n23(_uploadFile, _downloadFile, value) {
	return from_candid_record_n24(_uploadFile, _downloadFile, value);
}
function from_candid_ComplianceControl_n62(_uploadFile, _downloadFile, value) {
	return from_candid_record_n63(_uploadFile, _downloadFile, value);
}
function from_candid_ComplianceFramework_n65(_uploadFile, _downloadFile, value) {
	return "CISAws" in value ? "CISAws" : "CISGCP" in value ? "CISGCP" : "SOC2" in value ? "SOC2" : "ISO27001" in value ? "ISO27001" : "CISAzure" in value ? "CISAzure" : "NISTCSF" in value ? "NISTCSF" : value;
}
function from_candid_ComplianceTrendEntry_n69(_uploadFile, _downloadFile, value) {
	return from_candid_record_n70(_uploadFile, _downloadFile, value);
}
function from_candid_ConnectionTestResult_n184(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n185(_uploadFile, _downloadFile, value);
}
function from_candid_ControlStatus_n64(_uploadFile, _downloadFile, value) {
	return "Passing" in value ? "Passing" : "NoCoverage" in value ? "NoCoverage" : "Failing" in value ? "Failing" : value;
}
function from_candid_CorrelatedIncident_n72(_uploadFile, _downloadFile, value) {
	return from_candid_record_n73(_uploadFile, _downloadFile, value);
}
function from_candid_CredentialError_n11(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n12(_uploadFile, _downloadFile, value);
}
function from_candid_CredentialHealthStatus_n79(_uploadFile, _downloadFile, value) {
	return from_candid_record_n80(_uploadFile, _downloadFile, value);
}
function from_candid_CredentialHealth_n82(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n83(_uploadFile, _downloadFile, value);
}
function from_candid_GeneratedReport_n129(_uploadFile, _downloadFile, value) {
	return from_candid_record_n130(_uploadFile, _downloadFile, value);
}
function from_candid_IncidentStatus_n74(_uploadFile, _downloadFile, value) {
	return "Open" in value ? "Open" : "Investigating" in value ? "Investigating" : "Resolved" in value ? "Resolved" : value;
}
function from_candid_IngestionStats_n84(_uploadFile, _downloadFile, value) {
	return from_candid_record_n85(_uploadFile, _downloadFile, value);
}
function from_candid_NormalizedAlert_n32(_uploadFile, _downloadFile, value) {
	return from_candid_record_n33(_uploadFile, _downloadFile, value);
}
function from_candid_NotificationChannel_n52(_uploadFile, _downloadFile, value) {
	return "Email" in value ? "Email" : "InApp" in value ? "InApp" : "TeamsWebhook" in value ? "TeamsWebhook" : value;
}
function from_candid_NotificationError_n173(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n174(_uploadFile, _downloadFile, value);
}
function from_candid_NotificationLog_n98(_uploadFile, _downloadFile, value) {
	return from_candid_record_n99(_uploadFile, _downloadFile, value);
}
function from_candid_NotificationRouting_n102(_uploadFile, _downloadFile, value) {
	return from_candid_record_n103(_uploadFile, _downloadFile, value);
}
function from_candid_NotificationStatus_n100(_uploadFile, _downloadFile, value) {
	return "Failed" in value ? "Failed" : "Sent" in value ? "Sent" : "Acknowledged" in value ? "Acknowledged" : value;
}
function from_candid_Page_n94(_uploadFile, _downloadFile, value) {
	return from_candid_record_n95(_uploadFile, _downloadFile, value);
}
function from_candid_PlaybookResult_n4(_uploadFile, _downloadFile, value) {
	return from_candid_record_n5(_uploadFile, _downloadFile, value);
}
function from_candid_PollingInterval_n90(_uploadFile, _downloadFile, value) {
	return "OneHour" in value ? "OneHour" : "ThirtyMin" in value ? "ThirtyMin" : "FifteenMin" in value ? "FifteenMin" : "FiveMin" in value ? "FiveMin" : value;
}
function from_candid_PollingStatus_n89(_uploadFile, _downloadFile, value) {
	return "Error" in value ? "Error" : "AuthPaused" in value ? "AuthPaused" : "Inactive" in value ? "Inactive" : "Active" in value ? "Active" : value;
}
function from_candid_ProviderCredentialStatus_n104(_uploadFile, _downloadFile, value) {
	return from_candid_record_n105(_uploadFile, _downloadFile, value);
}
function from_candid_ProviderPollingState_n87(_uploadFile, _downloadFile, value) {
	return from_candid_record_n88(_uploadFile, _downloadFile, value);
}
function from_candid_ProviderType_n8(_uploadFile, _downloadFile, value) {
	return "AWS" in value ? "AWS" : "GCP" in value ? "GCP" : "Azure" in value ? "Azure" : value;
}
function from_candid_RateLimitBackoffState_n107(_uploadFile, _downloadFile, value) {
	return from_candid_record_n108(_uploadFile, _downloadFile, value);
}
function from_candid_RateLimitError_n154(_uploadFile, _downloadFile, value) {
	return "UnknownProvider" in value ? "UnknownProvider" : "NotAuthorized" in value ? "NotAuthorized" : value;
}
function from_candid_RawFinding_n112(_uploadFile, _downloadFile, value) {
	return from_candid_record_n113(_uploadFile, _downloadFile, value);
}
function from_candid_ReportDeliveryOutcome_n123(_uploadFile, _downloadFile, value) {
	return from_candid_record_n124(_uploadFile, _downloadFile, value);
}
function from_candid_ReportRecipientConfig_n115(_uploadFile, _downloadFile, value) {
	return from_candid_record_n116(_uploadFile, _downloadFile, value);
}
function from_candid_ReportRunOutcome_n125(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n126(_uploadFile, _downloadFile, value);
}
function from_candid_ReportRun_n119(_uploadFile, _downloadFile, value) {
	return from_candid_record_n120(_uploadFile, _downloadFile, value);
}
function from_candid_ReportTrigger_n121(_uploadFile, _downloadFile, value) {
	return "ScheduledWeekly" in value ? "ScheduledWeekly" : "OnDemand" in value ? "OnDemand" : "ScheduledMonthly" in value ? "ScheduledMonthly" : value;
}
function from_candid_ReportType_n117(_uploadFile, _downloadFile, value) {
	return "IncidentSummary" in value ? "IncidentSummary" : "SecurityPosture" in value ? "SecurityPosture" : "ComplianceStatus" in value ? "ComplianceStatus" : "ThreatIntelSummary" in value ? "ThreatIntelSummary" : value;
}
function from_candid_ReportingError_n160(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n161(_uploadFile, _downloadFile, value);
}
function from_candid_Result_1_n9(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n10(_uploadFile, _downloadFile, value);
}
function from_candid_Result_2_n181(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n182(_uploadFile, _downloadFile, value);
}
function from_candid_Result_3_n171(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n172(_uploadFile, _downloadFile, value);
}
function from_candid_Result_4_n158(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n159(_uploadFile, _downloadFile, value);
}
function from_candid_Result_5_n155(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n156(_uploadFile, _downloadFile, value);
}
function from_candid_Result_6_n152(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n153(_uploadFile, _downloadFile, value);
}
function from_candid_Result_7_n29(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n30(_uploadFile, _downloadFile, value);
}
function from_candid_Result_8_n16(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n17(_uploadFile, _downloadFile, value);
}
function from_candid_Result__1_n19(_uploadFile, _downloadFile, value) {
	return from_candid_record_n20(_uploadFile, _downloadFile, value);
}
function from_candid_Result_n13(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n14(_uploadFile, _downloadFile, value);
}
function from_candid_RuleSeverityThreshold_n49(_uploadFile, _downloadFile, value) {
	return "All" in value ? "All" : "AnyHigh" in value ? "AnyHigh" : "CriticalOrHigh" in value ? "CriticalOrHigh" : "AnyCritical" in value ? "AnyCritical" : "AnyLow" in value ? "AnyLow" : "AnyMedium" in value ? "AnyMedium" : value;
}
function from_candid_SearchResult_n140(_uploadFile, _downloadFile, value) {
	return from_candid_record_n141(_uploadFile, _downloadFile, value);
}
function from_candid_Severity_n38(_uploadFile, _downloadFile, value) {
	return "Low" in value ? "Low" : "High" in value ? "High" : "Medium" in value ? "Medium" : "Critical" in value ? "Critical" : "Unknown" in value ? "Unknown" : value;
}
function from_candid_ThrottleEvent_n132(_uploadFile, _downloadFile, value) {
	return from_candid_record_n133(_uploadFile, _downloadFile, value);
}
function from_candid_TimelineEvent_n135(_uploadFile, _downloadFile, value) {
	return from_candid_record_n136(_uploadFile, _downloadFile, value);
}
function from_candid_UserAssignmentView_n147(_uploadFile, _downloadFile, value) {
	return from_candid_record_n148(_uploadFile, _downloadFile, value);
}
function from_candid_Value_n25(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n26(_uploadFile, _downloadFile, value);
}
function from_candid_VaultEntryView_n150(_uploadFile, _downloadFile, value) {
	return from_candid_record_n151(_uploadFile, _downloadFile, value);
}
function from_candid_VaultError_n15(_uploadFile, _downloadFile, value) {
	return "NotFound" in value ? "NotFound" : "NotAuthorized" in value ? "NotAuthorized" : "AlreadyExists" in value ? "AlreadyExists" : "InvalidName" in value ? "InvalidName" : value;
}
function from_candid_opt_n101(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_NotificationRouting_n102(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n109(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n114(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_ReportRecipientConfig_n115(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n118(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_ReportRun_n119(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n137(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_Severity_n38(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n143(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n144(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n31(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_NormalizedAlert_n32(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n35(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n36(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_variant_n37(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n39(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_AlertEnrichment_n40(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n42(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n43(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n44(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n48(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_RuleSeverityThreshold_n49(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n50(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n54(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_Asset_n55(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n6(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n7(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_ProviderType_n8(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n71(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_CorrelatedIncident_n72(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n81(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n96(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_record_n103(_uploadFile, _downloadFile, value) {
	return {
		customer: value.customer,
		escalationMinutes: record_opt_to_undefined(from_candid_opt_n50(_uploadFile, _downloadFile, value.escalationMinutes)),
		cooldownMinutes: value.cooldownMinutes,
		teamsWebhookUrl: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.teamsWebhookUrl)),
		emailRecipients: value.emailRecipients
	};
}
function from_candid_record_n105(_uploadFile, _downloadFile, value) {
	return {
		provider: from_candid_ProviderType_n8(_uploadFile, _downloadFile, value.provider),
		fields: value.fields,
		updatedAt: record_opt_to_undefined(from_candid_opt_n81(_uploadFile, _downloadFile, value.updatedAt)),
		configured: value.configured
	};
}
function from_candid_record_n108(_uploadFile, _downloadFile, value) {
	return {
		lastResetAt: record_opt_to_undefined(from_candid_opt_n109(_uploadFile, _downloadFile, value.lastResetAt)),
		provider: from_candid_ProviderType_n8(_uploadFile, _downloadFile, value.provider),
		nextAttemptAt: record_opt_to_undefined(from_candid_opt_n109(_uploadFile, _downloadFile, value.nextAttemptAt)),
		lastThrottledAt: record_opt_to_undefined(from_candid_opt_n109(_uploadFile, _downloadFile, value.lastThrottledAt)),
		backoffSeconds: value.backoffSeconds,
		consecutiveThrottles: value.consecutiveThrottles
	};
}
function from_candid_record_n110(_uploadFile, _downloadFile, value) {
	return {
		hasMore: value.hasMore,
		totalCount: value.totalCount,
		items: from_candid_vec_n111(_uploadFile, _downloadFile, value.items)
	};
}
function from_candid_record_n113(_uploadFile, _downloadFile, value) {
	return {
		id: value.id,
		region: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.region)),
		title: value.title,
		findingId: value.findingId,
		provider: from_candid_ProviderType_n8(_uploadFile, _downloadFile, value.provider),
		accountId: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.accountId)),
		description: value.description,
		rawMetadata: value.rawMetadata,
		timestamp: value.timestamp,
		severity: from_candid_Severity_n38(_uploadFile, _downloadFile, value.severity)
	};
}
function from_candid_record_n116(_uploadFile, _downloadFile, value) {
	return {
		customer: value.customer,
		reportType: from_candid_ReportType_n117(_uploadFile, _downloadFile, value.reportType),
		recipients: value.recipients
	};
}
function from_candid_record_n120(_uploadFile, _downloadFile, value) {
	return {
		trigger: from_candid_ReportTrigger_n121(_uploadFile, _downloadFile, value.trigger),
		deliveries: from_candid_vec_n122(_uploadFile, _downloadFile, value.deliveries),
		customer: value.customer,
		providerScope: from_candid_vec_n75(_uploadFile, _downloadFile, value.providerScope),
		generatedAt: value.generatedAt,
		reportType: from_candid_ReportType_n117(_uploadFile, _downloadFile, value.reportType),
		periodEnd: value.periodEnd,
		recipients: value.recipients,
		periodStart: value.periodStart,
		outcome: from_candid_ReportRunOutcome_n125(_uploadFile, _downloadFile, value.outcome),
		runId: value.runId
	};
}
function from_candid_record_n124(_uploadFile, _downloadFile, value) {
	return {
		recipient: value.recipient,
		sentAt: record_opt_to_undefined(from_candid_opt_n109(_uploadFile, _downloadFile, value.sentAt)),
		error: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.error)),
		success: value.success
	};
}
function from_candid_record_n130(_uploadFile, _downloadFile, value) {
	return {
		csvData: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.csvData)),
		customer: value.customer,
		providerScope: value.providerScope,
		generatedAt: value.generatedAt,
		generatedBy: value.generatedBy,
		dateRangeStart: value.dateRangeStart,
		dateRangeEnd: value.dateRangeEnd,
		reportType: value.reportType,
		reportId: value.reportId,
		format: value.format
	};
}
function from_candid_record_n133(_uploadFile, _downloadFile, value) {
	return {
		id: value.id,
		provider: from_candid_ProviderType_n8(_uploadFile, _downloadFile, value.provider),
		message: value.message,
		timestamp: value.timestamp,
		retryAfterSec: record_opt_to_undefined(from_candid_opt_n50(_uploadFile, _downloadFile, value.retryAfterSec)),
		statusCode: record_opt_to_undefined(from_candid_opt_n50(_uploadFile, _downloadFile, value.statusCode))
	};
}
function from_candid_record_n136(_uploadFile, _downloadFile, value) {
	return {
		id: value.id,
		title: value.title,
		provider: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.provider)),
		customer: value.customer,
		description: value.description,
		timestamp: value.timestamp,
		severity: record_opt_to_undefined(from_candid_opt_n137(_uploadFile, _downloadFile, value.severity)),
		eventType: value.eventType
	};
}
function from_candid_record_n138(_uploadFile, _downloadFile, value) {
	return {
		hasMore: value.hasMore,
		results: from_candid_vec_n139(_uploadFile, _downloadFile, value.results)
	};
}
function from_candid_record_n141(_uploadFile, _downloadFile, value) {
	return {
		id: value.id,
		title: value.title,
		provider: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.provider)),
		customer: value.customer,
		description: value.description,
		timestamp: value.timestamp,
		sourceModule: value.sourceModule,
		severity: record_opt_to_undefined(from_candid_opt_n137(_uploadFile, _downloadFile, value.severity))
	};
}
function from_candid_record_n142(_uploadFile, _downloadFile, value) {
	return {
		body: value.body,
		headers: value.headers,
		upgrade: record_opt_to_undefined(from_candid_opt_n143(_uploadFile, _downloadFile, value.upgrade)),
		streaming_strategy: record_opt_to_undefined(from_candid_opt_n144(_uploadFile, _downloadFile, value.streaming_strategy)),
		status_code: value.status_code
	};
}
function from_candid_record_n148(_uploadFile, _downloadFile, value) {
	return {
		principal: value.principal,
		providers: from_candid_vec_n75(_uploadFile, _downloadFile, value.providers)
	};
}
function from_candid_record_n151(_uploadFile, _downloadFile, value) {
	return {
		provider: from_candid_ProviderType_n8(_uploadFile, _downloadFile, value.provider),
		name: value.name,
		createdAt: value.createdAt,
		updatedAt: value.updatedAt,
		maskedValue: value.maskedValue
	};
}
function from_candid_record_n20(_uploadFile, _downloadFile, value) {
	return {
		hasMore: value.hasMore,
		rows: from_candid_vec_n21(_uploadFile, _downloadFile, value.rows)
	};
}
function from_candid_record_n24(_uploadFile, _downloadFile, value) {
	return {
		value: from_candid_Value_n25(_uploadFile, _downloadFile, value.value),
		name: value.name
	};
}
function from_candid_record_n33(_uploadFile, _downloadFile, value) {
	return {
		id: value.id,
		region: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.region)),
		status: from_candid_AlertStatus_n34(_uploadFile, _downloadFile, value.status),
		mitre: record_opt_to_undefined(from_candid_opt_n35(_uploadFile, _downloadFile, value.mitre)),
		title: value.title,
		findingId: value.findingId,
		provider: from_candid_ProviderType_n8(_uploadFile, _downloadFile, value.provider),
		accountId: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.accountId)),
		customer: value.customer,
		assetId: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.assetId)),
		owner: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.owner)),
		rawFindingId: value.rawFindingId,
		recurrenceCount: value.recurrenceCount,
		description: value.description,
		ingestionSource: record_opt_to_undefined(from_candid_opt_n36(_uploadFile, _downloadFile, value.ingestionSource)),
		originalSeverity: value.originalSeverity,
		timestamp: value.timestamp,
		assetType: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.assetType)),
		severity: from_candid_Severity_n38(_uploadFile, _downloadFile, value.severity),
		enrichment: record_opt_to_undefined(from_candid_opt_n39(_uploadFile, _downloadFile, value.enrichment))
	};
}
function from_candid_record_n41(_uploadFile, _downloadFile, value) {
	return {
		domainRep: record_opt_to_undefined(from_candid_opt_n42(_uploadFile, _downloadFile, value.domainRep)),
		knownMaliciousIp: value.knownMaliciousIp,
		ipReputation: record_opt_to_undefined(from_candid_opt_n43(_uploadFile, _downloadFile, value.ipReputation)),
		enrichedAt: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.enrichedAt)),
		mitreDetail: record_opt_to_undefined(from_candid_opt_n44(_uploadFile, _downloadFile, value.mitreDetail))
	};
}
function from_candid_record_n47(_uploadFile, _downloadFile, value) {
	return {
		id: value.id,
		region: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.region)),
		escalationRecipient: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.escalationRecipient)),
		severityThreshold: record_opt_to_undefined(from_candid_opt_n48(_uploadFile, _downloadFile, value.severityThreshold)),
		provider: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.provider)),
		customer: value.customer,
		assetId: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.assetId)),
		name: value.name,
		escalationMinutes: record_opt_to_undefined(from_candid_opt_n50(_uploadFile, _downloadFile, value.escalationMinutes)),
		channels: from_candid_vec_n51(_uploadFile, _downloadFile, value.channels),
		cooldownMinutes: value.cooldownMinutes,
		enabled: value.enabled,
		findingType: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.findingType))
	};
}
function from_candid_record_n5(_uploadFile, _downloadFile, value) {
	return {
		rawApiError: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.rawApiError)),
		dryRunPreview: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.dryRunPreview)),
		provider: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.provider)),
		message: value.message,
		success: value.success
	};
}
function from_candid_record_n56(_uploadFile, _downloadFile, value) {
	return {
		id: value.id,
		region: value.region,
		provider: from_candid_ProviderType_n8(_uploadFile, _downloadFile, value.provider),
		accountId: value.accountId,
		customer: value.customer,
		name: value.name,
		tags: value.tags,
		assetType: from_candid_AssetType_n57(_uploadFile, _downloadFile, value.assetType),
		lastSeen: value.lastSeen,
		riskScore: value.riskScore,
		openFindings: value.openFindings
	};
}
function from_candid_record_n63(_uploadFile, _downloadFile, value) {
	return {
		status: from_candid_ControlStatus_n64(_uploadFile, _downloadFile, value.status),
		title: value.title,
		provider: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.provider)),
		framework: from_candid_ComplianceFramework_n65(_uploadFile, _downloadFile, value.framework),
		failingFindings: value.failingFindings,
		description: value.description,
		controlId: value.controlId,
		remediationGuidance: value.remediationGuidance,
		passingFindings: value.passingFindings
	};
}
function from_candid_record_n67(_uploadFile, _downloadFile, value) {
	return {
		total: value.total,
		failing: value.failing,
		controls: from_candid_vec_n61(_uploadFile, _downloadFile, value.controls),
		score: value.score,
		passing: value.passing
	};
}
function from_candid_record_n70(_uploadFile, _downloadFile, value) {
	return {
		passingControls: value.passingControls,
		framework: from_candid_ComplianceFramework_n65(_uploadFile, _downloadFile, value.framework),
		totalControls: value.totalControls,
		score: value.score,
		weekTimestamp: value.weekTimestamp
	};
}
function from_candid_record_n73(_uploadFile, _downloadFile, value) {
	return {
		status: from_candid_IncidentStatus_n74(_uploadFile, _downloadFile, value.status),
		incidentId: value.incidentId,
		customer: value.customer,
		sourceAlerts: value.sourceAlerts,
		detectedAt: value.detectedAt,
		assignedOwner: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.assignedOwner)),
		sourceIp: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.sourceIp)),
		sourceProviders: from_candid_vec_n75(_uploadFile, _downloadFile, value.sourceProviders),
		timeDeltaMinutes: value.timeDeltaMinutes,
		notes: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.notes)),
		affectedResources: value.affectedResources,
		severity: from_candid_Severity_n38(_uploadFile, _downloadFile, value.severity),
		correlationWindowMinutes: value.correlationWindowMinutes,
		incidentType: value.incidentType
	};
}
function from_candid_record_n80(_uploadFile, _downloadFile, value) {
	return {
		provider: value.provider,
		expiryNs: record_opt_to_undefined(from_candid_opt_n81(_uploadFile, _downloadFile, value.expiryNs)),
		health: from_candid_CredentialHealth_n82(_uploadFile, _downloadFile, value.health)
	};
}
function from_candid_record_n85(_uploadFile, _downloadFile, value) {
	return {
		providerStates: from_candid_vec_n86(_uploadFile, _downloadFile, value.providerStates),
		activeProviders: value.activeProviders,
		totalFindingsToday: value.totalFindingsToday
	};
}
function from_candid_record_n88(_uploadFile, _downloadFile, value) {
	return {
		status: from_candid_PollingStatus_n89(_uploadFile, _downloadFile, value.status),
		provider: from_candid_ProviderType_n8(_uploadFile, _downloadFile, value.provider),
		interval: from_candid_PollingInterval_n90(_uploadFile, _downloadFile, value.interval),
		lastPollAttempt: record_opt_to_undefined(from_candid_opt_n81(_uploadFile, _downloadFile, value.lastPollAttempt)),
		lastSuccessfulPoll: record_opt_to_undefined(from_candid_opt_n81(_uploadFile, _downloadFile, value.lastSuccessfulPoll)),
		findingsToday: value.findingsToday,
		lastError: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.lastError)),
		consecutiveFailures: value.consecutiveFailures
	};
}
function from_candid_record_n95(_uploadFile, _downloadFile, value) {
	return {
		items: from_candid_vec_n53(_uploadFile, _downloadFile, value.items),
		nextCursor: record_opt_to_undefined(from_candid_opt_n96(_uploadFile, _downloadFile, value.nextCursor))
	};
}
function from_candid_record_n99(_uploadFile, _downloadFile, value) {
	return {
		id: value.id,
		status: from_candid_NotificationStatus_n100(_uploadFile, _downloadFile, value.status),
		acknowledgedAt: record_opt_to_undefined(from_candid_opt_n81(_uploadFile, _downloadFile, value.acknowledgedAt)),
		customer: value.customer,
		ruleId: value.ruleId,
		recipient: value.recipient,
		alertId: value.alertId,
		acknowledged: value.acknowledged,
		timestamp: value.timestamp,
		channel: from_candid_NotificationChannel_n52(_uploadFile, _downloadFile, value.channel)
	};
}
function from_candid_tuple_n77(_uploadFile, _downloadFile, value) {
	return [value[0], from_candid_CorrelatedIncident_n72(_uploadFile, _downloadFile, value[1])];
}
function from_candid_variant_n10(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_CredentialError_n11(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n12(_uploadFile, _downloadFile, value) {
	return "InvalidCredential" in value ? {
		__kind__: "InvalidCredential",
		InvalidCredential: value.InvalidCredential
	} : "NotFound" in value ? {
		__kind__: "NotFound",
		NotFound: value.NotFound
	} : "NotAuthorized" in value ? {
		__kind__: "NotAuthorized",
		NotAuthorized: value.NotAuthorized
	} : "VaultError" in value ? {
		__kind__: "VaultError",
		VaultError: value.VaultError
	} : value;
}
function from_candid_variant_n126(_uploadFile, _downloadFile, value) {
	return "Failed" in value ? {
		__kind__: "Failed",
		Failed: value.Failed
	} : "Succeeded" in value ? {
		__kind__: "Succeeded",
		Succeeded: value.Succeeded
	} : value;
}
function from_candid_variant_n14(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_VaultError_n15(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n153(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_RateLimitError_n154(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n156(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_VaultError_n15(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n159(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: from_candid_ReportRun_n119(_uploadFile, _downloadFile, value.ok)
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_ReportingError_n160(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n161(_uploadFile, _downloadFile, value) {
	return "NotFound" in value ? {
		__kind__: "NotFound",
		NotFound: value.NotFound
	} : "NotAuthorized" in value ? {
		__kind__: "NotAuthorized",
		NotAuthorized: value.NotAuthorized
	} : "InvalidPeriod" in value ? {
		__kind__: "InvalidPeriod",
		InvalidPeriod: value.InvalidPeriod
	} : "InvalidRecipient" in value ? {
		__kind__: "InvalidRecipient",
		InvalidRecipient: value.InvalidRecipient
	} : value;
}
function from_candid_variant_n17(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: value.err
	} : value;
}
function from_candid_variant_n172(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_NotificationError_n173(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n174(_uploadFile, _downloadFile, value) {
	return "InvalidWebhookUrl" in value ? {
		__kind__: "InvalidWebhookUrl",
		InvalidWebhookUrl: value.InvalidWebhookUrl
	} : "NotFound" in value ? {
		__kind__: "NotFound",
		NotFound: value.NotFound
	} : "NotAuthorized" in value ? {
		__kind__: "NotAuthorized",
		NotAuthorized: value.NotAuthorized
	} : "InvalidRule" in value ? {
		__kind__: "InvalidRule",
		InvalidRule: value.InvalidRule
	} : value;
}
function from_candid_variant_n182(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_ReportingError_n160(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n185(_uploadFile, _downloadFile, value) {
	return "Success" in value ? {
		__kind__: "Success",
		Success: value.Success
	} : "Failure" in value ? {
		__kind__: "Failure",
		Failure: value.Failure
	} : value;
}
function from_candid_variant_n26(_uploadFile, _downloadFile, value) {
	return "int" in value ? {
		__kind__: "int",
		int: value.int
	} : "nat" in value ? {
		__kind__: "nat",
		nat: value.nat
	} : "float" in value ? {
		__kind__: "float",
		float: value.float
	} : "bool" in value ? {
		__kind__: "bool",
		bool: value.bool
	} : "null" in value ? {
		__kind__: "null",
		null: value.null
	} : "text" in value ? {
		__kind__: "text",
		text: value.text
	} : value;
}
function from_candid_variant_n30(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: value.err
	} : value;
}
function from_candid_variant_n37(_uploadFile, _downloadFile, value) {
	return "Poll" in value ? "Poll" : "Webhook" in value ? "Webhook" : value;
}
function from_candid_variant_n83(_uploadFile, _downloadFile, value) {
	return "Error" in value ? {
		__kind__: "Error",
		Error: value.Error
	} : "Authenticating" in value ? {
		__kind__: "Authenticating",
		Authenticating: value.Authenticating
	} : "Valid" in value ? {
		__kind__: "Valid",
		Valid: value.Valid
	} : "ExpiringSoon" in value ? {
		__kind__: "ExpiringSoon",
		ExpiringSoon: value.ExpiringSoon
	} : "Expired" in value ? {
		__kind__: "Expired",
		Expired: value.Expired
	} : value;
}
function from_candid_vec_n106(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_RateLimitBackoffState_n107(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n111(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_RawFinding_n112(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n122(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_ReportDeliveryOutcome_n123(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n127(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_ReportRun_n119(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n128(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_GeneratedReport_n129(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n131(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_ThrottleEvent_n132(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n134(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_TimelineEvent_n135(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n139(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_SearchResult_n140(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n146(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_UserAssignmentView_n147(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n149(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_VaultEntryView_n150(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n21(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_vec_n22(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n22(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_Cell_n23(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n45(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_AlertRule_n46(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n51(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_NotificationChannel_n52(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n53(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_NormalizedAlert_n32(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n60(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_Asset_n55(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n61(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_ComplianceControl_n62(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n68(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_ComplianceTrendEntry_n69(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n75(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_ProviderType_n8(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n76(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_tuple_n77(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n78(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_CredentialHealthStatus_n79(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n86(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_ProviderPollingState_n87(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n97(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_NotificationLog_n98(_uploadFile, _downloadFile, x));
}
function to_candid_AlertRule_n163(_uploadFile, _downloadFile, value) {
	return to_candid_record_n164(_uploadFile, _downloadFile, value);
}
function to_candid_AlertStatus_n92(_uploadFile, _downloadFile, value) {
	return value == "Open" ? { Open: null } : value == "InProgress" ? { InProgress: null } : value == "Resolved" ? { Resolved: null } : value;
}
function to_candid_AssetType_n59(_uploadFile, _downloadFile, value) {
	return value == "S3" ? { S3: null } : value == "AzureVM" ? { AzureVM: null } : value == "EC2" ? { EC2: null } : value == "RDS" ? { RDS: null } : value == "AzureDatabase" ? { AzureDatabase: null } : value == "GCPStorage" ? { GCPStorage: null } : value == "GCPCloudSQL" ? { GCPCloudSQL: null } : value == "Lambda" ? { Lambda: null } : value == "AzureStorage" ? { AzureStorage: null } : value == "GCPCompute" ? { GCPCompute: null } : value == "Other" ? { Other: null } : value;
}
function to_candid_AwsCredentialInput_n177(_uploadFile, _downloadFile, value) {
	return to_candid_record_n178(_uploadFile, _downloadFile, value);
}
function to_candid_ComplianceFramework_n27(_uploadFile, _downloadFile, value) {
	return value == "CISAws" ? { CISAws: null } : value == "CISGCP" ? { CISGCP: null } : value == "SOC2" ? { SOC2: null } : value == "ISO27001" ? { ISO27001: null } : value == "CISAzure" ? { CISAzure: null } : value == "NISTCSF" ? { NISTCSF: null } : value;
}
function to_candid_IncidentStatus_n187(_uploadFile, _downloadFile, value) {
	return value == "Open" ? { Open: null } : value == "Investigating" ? { Investigating: null } : value == "Resolved" ? { Resolved: null } : value;
}
function to_candid_NotificationChannel_n167(_uploadFile, _downloadFile, value) {
	return value == "Email" ? { Email: null } : value == "InApp" ? { InApp: null } : value == "TeamsWebhook" ? { TeamsWebhook: null } : value;
}
function to_candid_NotificationRouting_n169(_uploadFile, _downloadFile, value) {
	return to_candid_record_n170(_uploadFile, _downloadFile, value);
}
function to_candid_PollingInterval_n183(_uploadFile, _downloadFile, value) {
	return value == "OneHour" ? { OneHour: null } : value == "ThirtyMin" ? { ThirtyMin: null } : value == "FifteenMin" ? { FifteenMin: null } : value == "FiveMin" ? { FiveMin: null } : value;
}
function to_candid_ProviderCredentialInput_n175(_uploadFile, _downloadFile, value) {
	return to_candid_variant_n176(_uploadFile, _downloadFile, value);
}
function to_candid_ProviderType_n2(_uploadFile, _downloadFile, value) {
	return value == "AWS" ? { AWS: null } : value == "GCP" ? { GCP: null } : value == "Azure" ? { Azure: null } : value;
}
function to_candid_ReportRecipientConfig_n179(_uploadFile, _downloadFile, value) {
	return to_candid_record_n180(_uploadFile, _downloadFile, value);
}
function to_candid_ReportTrigger_n162(_uploadFile, _downloadFile, value) {
	return value == "ScheduledWeekly" ? { ScheduledWeekly: null } : value == "OnDemand" ? { OnDemand: null } : value == "ScheduledMonthly" ? { ScheduledMonthly: null } : value;
}
function to_candid_ReportType_n28(_uploadFile, _downloadFile, value) {
	return value == "IncidentSummary" ? { IncidentSummary: null } : value == "SecurityPosture" ? { SecurityPosture: null } : value == "ComplianceStatus" ? { ComplianceStatus: null } : value == "ThreatIntelSummary" ? { ThreatIntelSummary: null } : value;
}
function to_candid_RuleSeverityThreshold_n165(_uploadFile, _downloadFile, value) {
	return value == "All" ? { All: null } : value == "AnyHigh" ? { AnyHigh: null } : value == "CriticalOrHigh" ? { CriticalOrHigh: null } : value == "AnyCritical" ? { AnyCritical: null } : value == "AnyLow" ? { AnyLow: null } : value == "AnyMedium" ? { AnyMedium: null } : value;
}
function to_candid_Severity_n93(_uploadFile, _downloadFile, value) {
	return value == "Low" ? { Low: null } : value == "High" ? { High: null } : value == "Medium" ? { Medium: null } : value == "Critical" ? { Critical: null } : value == "Unknown" ? { Unknown: null } : value;
}
function to_candid_opt_n186(_uploadFile, _downloadFile, value) {
	return value === null ? candid_none() : candid_some(value);
}
function to_candid_opt_n66(_uploadFile, _downloadFile, value) {
	return value === null ? candid_none() : candid_some(to_candid_ProviderType_n2(_uploadFile, _downloadFile, value));
}
function to_candid_record_n145(_uploadFile, _downloadFile, value) {
	return {
		provider: to_candid_ProviderType_n2(_uploadFile, _downloadFile, value.provider),
		customer: value.customer,
		resourceId: value.resourceId,
		dryRun: value.dryRun
	};
}
function to_candid_record_n157(_uploadFile, _downloadFile, value) {
	return {
		provider: to_candid_ProviderType_n2(_uploadFile, _downloadFile, value.provider),
		customer: value.customer,
		userId: value.userId,
		accessKeyId: value.accessKeyId ? candid_some(value.accessKeyId) : candid_none(),
		dryRun: value.dryRun
	};
}
function to_candid_record_n164(_uploadFile, _downloadFile, value) {
	return {
		id: value.id,
		region: value.region ? candid_some(value.region) : candid_none(),
		escalationRecipient: value.escalationRecipient ? candid_some(value.escalationRecipient) : candid_none(),
		severityThreshold: value.severityThreshold ? candid_some(to_candid_RuleSeverityThreshold_n165(_uploadFile, _downloadFile, value.severityThreshold)) : candid_none(),
		provider: value.provider ? candid_some(to_candid_ProviderType_n2(_uploadFile, _downloadFile, value.provider)) : candid_none(),
		customer: value.customer,
		assetId: value.assetId ? candid_some(value.assetId) : candid_none(),
		name: value.name,
		escalationMinutes: value.escalationMinutes ? candid_some(value.escalationMinutes) : candid_none(),
		channels: to_candid_vec_n166(_uploadFile, _downloadFile, value.channels),
		cooldownMinutes: value.cooldownMinutes,
		enabled: value.enabled,
		findingType: value.findingType ? candid_some(value.findingType) : candid_none()
	};
}
function to_candid_record_n168(_uploadFile, _downloadFile, value) {
	return {
		virusTotalKey: value.virusTotalKey ? candid_some(value.virusTotalKey) : candid_none(),
		abuseIpdbKey: value.abuseIpdbKey ? candid_some(value.abuseIpdbKey) : candid_none()
	};
}
function to_candid_record_n170(_uploadFile, _downloadFile, value) {
	return {
		customer: value.customer,
		escalationMinutes: value.escalationMinutes ? candid_some(value.escalationMinutes) : candid_none(),
		cooldownMinutes: value.cooldownMinutes,
		teamsWebhookUrl: value.teamsWebhookUrl ? candid_some(value.teamsWebhookUrl) : candid_none(),
		emailRecipients: value.emailRecipients
	};
}
function to_candid_record_n178(_uploadFile, _downloadFile, value) {
	return {
		externalId: value.externalId ? candid_some(value.externalId) : candid_none(),
		roleArn: value.roleArn,
		regions: value.regions
	};
}
function to_candid_record_n18(_uploadFile, _downloadFile, value) {
	return {
		customer: value.customer,
		assignedOwner: value.assignedOwner ? candid_some(value.assignedOwner) : candid_none(),
		alertId: value.alertId,
		notes: value.notes ? candid_some(value.notes) : candid_none(),
		severity: value.severity,
		dryRun: value.dryRun
	};
}
function to_candid_record_n180(_uploadFile, _downloadFile, value) {
	return {
		customer: value.customer,
		reportType: to_candid_ReportType_n28(_uploadFile, _downloadFile, value.reportType),
		recipients: value.recipients
	};
}
function to_candid_record_n3(_uploadFile, _downloadFile, value) {
	return {
		ip: value.ip,
		customer: value.customer,
		providers: to_candid_vec_n1(_uploadFile, _downloadFile, value.providers),
		dryRun: value.dryRun
	};
}
function to_candid_record_n58(_uploadFile, _downloadFile, value) {
	return {
		region: value.region ? candid_some(value.region) : candid_none(),
		minRiskScore: value.minRiskScore ? candid_some(value.minRiskScore) : candid_none(),
		provider: value.provider ? candid_some(to_candid_ProviderType_n2(_uploadFile, _downloadFile, value.provider)) : candid_none(),
		customer: value.customer,
		limit: value.limit,
		assetType: value.assetType ? candid_some(to_candid_AssetType_n59(_uploadFile, _downloadFile, value.assetType)) : candid_none()
	};
}
function to_candid_record_n91(_uploadFile, _downloadFile, value) {
	return {
		status: value.status ? candid_some(to_candid_AlertStatus_n92(_uploadFile, _downloadFile, value.status)) : candid_none(),
		provider: value.provider ? candid_some(to_candid_ProviderType_n2(_uploadFile, _downloadFile, value.provider)) : candid_none(),
		customer: value.customer,
		cursor: value.cursor ? candid_some(value.cursor) : candid_none(),
		limit: value.limit,
		severity: value.severity ? candid_some(to_candid_Severity_n93(_uploadFile, _downloadFile, value.severity)) : candid_none()
	};
}
function to_candid_variant_n176(_uploadFile, _downloadFile, value) {
	return value.__kind__ === "AWS" ? { AWS: to_candid_AwsCredentialInput_n177(_uploadFile, _downloadFile, value.AWS) } : value.__kind__ === "GCP" ? { GCP: value.GCP } : value.__kind__ === "Azure" ? { Azure: value.Azure } : value;
}
function to_candid_vec_n1(_uploadFile, _downloadFile, value) {
	return value.map((x) => to_candid_ProviderType_n2(_uploadFile, _downloadFile, x));
}
function to_candid_vec_n166(_uploadFile, _downloadFile, value) {
	return value.map((x) => to_candid_NotificationChannel_n167(_uploadFile, _downloadFile, x));
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
	const agent = options.agent || HttpAgent.createSync({ ...options.agentOptions });
	if (options.agent && options.agentOptions) console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
	return new Backend(Actor.createActor(idlFactory, {
		agent,
		canisterId,
		...options.actorOptions
	}), _uploadFile, _downloadFile, options.processError);
}
// src/backend.d.ts
var ProviderType = /* @__PURE__ */ function(ProviderType) {
	ProviderType["AWS"] = "AWS";
	ProviderType["GCP"] = "GCP";
	ProviderType["Azure"] = "Azure";
	return ProviderType;
}({});
// src/hooks/use-backend.ts
var STALE_30S = 3e4;
function toBackendProvider(p) {
	return p;
}
function toBackendFramework(f) {
	return f;
}
function useProviderStates() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: ["providerStates"],
		queryFn: async () => {
			if (!actor) return [];
			return actor.getProviderStates();
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S
	});
}
function useGetMyProviders() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: ["myProviders"],
		queryFn: async () => {
			if (!actor) return [];
			return (await actor.getMyProviders()).map((p) => p === ProviderType.AWS ? "AWS" : p === ProviderType.Azure ? "Azure" : "GCP");
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S
	});
}
function useListUserAssignments() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: ["userAssignments"],
		queryFn: async () => {
			if (!actor) return [];
			return actor.listUserAssignments();
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S
	});
}
function useAssignProviderAccess() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ principal, providers }) => {
			if (!actor) throw new Error("Actor not ready");
			return actor.assignProviderAccess(Principal$3.fromText(principal), providers.map(toBackendProvider));
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["userAssignments"] });
			qc.invalidateQueries({ queryKey: ["myProviders"] });
		}
	});
}
function useRemoveProviderAccess() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ principal, provider }) => {
			if (!actor) throw new Error("Actor not ready");
			return actor.removeProviderAccess(Principal$3.fromText(principal), toBackendProvider(provider));
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["userAssignments"] });
			qc.invalidateQueries({ queryKey: ["myProviders"] });
		}
	});
}
function useRawFindings(provider, limit) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: [
			"rawFindings",
			provider,
			limit
		],
		queryFn: async () => {
			if (!actor) return {
				hasMore: false,
				totalCount: 0n,
				items: []
			};
			return actor.getRawFindings(toBackendProvider(provider), BigInt(limit), BigInt(0));
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S
	});
}
function useNormalizedAlerts(filter) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: ["normalizedAlerts", filter],
		queryFn: async () => {
			if (!actor) return [];
			return (await actor.getNormalizedAlerts({
				customer: filter.customer,
				limit: BigInt(filter.limit),
				...filter.provider ? { provider: toBackendProvider(filter.provider) } : {},
				...filter.severity ? { severity: filter.severity } : {},
				...filter.status ? { status: filter.status } : {}
			})).items;
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S
	});
}
function useNormalizedAlertsPage(filter) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: ["normalizedAlertsPage", filter],
		queryFn: async () => {
			if (!actor) return { items: [] };
			return await actor.getNormalizedAlerts({
				customer: filter.customer,
				limit: BigInt(filter.limit),
				...filter.cursor ? { cursor: filter.cursor } : {},
				...filter.provider ? { provider: toBackendProvider(filter.provider) } : {},
				...filter.severity ? { severity: filter.severity } : {},
				...filter.status ? { status: filter.status } : {}
			});
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S
	});
}
function useUpdateAlertStatus() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ alertId, status, owner }) => {
			if (!actor) throw new Error("Actor not ready");
			return actor.updateAlertStatus(alertId, status, owner ?? null);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["normalizedAlerts"] });
			qc.invalidateQueries({ queryKey: ["alert"] });
			qc.invalidateQueries({ queryKey: ["assetFindings"] });
		}
	});
}
function useUpdateAlertOwner() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ alertId, owner }) => {
			if (!actor) throw new Error("Actor not ready");
			return actor.updateAlertStatus(alertId, "Open", owner);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["normalizedAlerts"] });
			qc.invalidateQueries({ queryKey: ["alert"] });
		}
	});
}
function useAssets(customer, limit) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: [
			"assets",
			customer,
			limit
		],
		queryFn: async () => {
			if (!actor) return [];
			return actor.getAssets({
				customer,
				limit: BigInt(limit)
			});
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S
	});
}
function useAssetById(assetId) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: ["asset", assetId],
		queryFn: async () => {
			if (!actor) return null;
			return actor.getAssetById(assetId);
		},
		enabled: !!actor && !isFetching && !!assetId,
		staleTime: STALE_30S
	});
}
function useAssetFindings(assetId) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: ["assetFindings", assetId],
		queryFn: async () => {
			if (!actor) return [];
			return actor.getAssetFindings(assetId);
		},
		enabled: !!actor && !isFetching && !!assetId,
		staleTime: STALE_30S
	});
}
function useComplianceStatus(framework, provider) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: [
			"complianceStatus",
			framework,
			provider
		],
		queryFn: async () => {
			if (!actor) return {
				total: 0n,
				passing: 0n,
				failing: 0n,
				score: 0n,
				controls: []
			};
			return actor.getComplianceStatus(toBackendFramework(framework), provider ? toBackendProvider(provider) : null);
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S
	});
}
function useExportComplianceCsv() {
	const { actor } = useActor(createActor);
	return useMutation({ mutationFn: async (framework) => {
		if (!actor) throw new Error("Actor not ready");
		return actor.exportComplianceCsv(toBackendFramework(framework));
	} });
}
function useExportCompliancePdf() {
	const { actor } = useActor(createActor);
	return useMutation({ mutationFn: async (framework) => {
		if (!actor) throw new Error("Actor not ready");
		return actor.exportCompliancePdf(toBackendFramework(framework));
	} });
}
function useAlertRules(customer) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: ["alertRules", customer],
		queryFn: async () => {
			if (!actor) return [];
			return actor.getAlertRules(customer);
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S
	});
}
function useSaveAlertRule() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (rule) => {
			if (!actor) throw new Error("Actor not ready");
			return actor.saveAlertRule(rule);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["alertRules"] });
		}
	});
}
function useDeleteAlertRule() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			if (!actor) throw new Error("Actor not ready");
			return actor.deleteAlertRule(id);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["alertRules"] });
		}
	});
}
function useNotificationLogs(customer, limit) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: [
			"notificationLogs",
			customer,
			limit
		],
		queryFn: async () => {
			if (!actor) return [];
			return actor.getNotificationLogs({
				customer,
				limit: BigInt(limit)
			});
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S
	});
}
function useAcknowledgeNotification() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (logId) => {
			if (!actor) throw new Error("Actor not ready");
			return actor.acknowledgeNotification(logId);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["notificationLogs"] });
		}
	});
}
function useBlockIp() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (req) => {
			if (!actor) throw new Error("Actor not ready");
			return await actor.blockIp({
				ip: req.ip,
				customer: req.customer,
				providers: req.providers,
				dryRun: req.dryRun
			});
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["auditLog"] });
		}
	});
}
function useIsolateResource() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (req) => {
			if (!actor) throw new Error("Actor not ready");
			return await actor.isolateResource({
				resourceId: req.resourceId,
				provider: toBackendProvider(req.provider),
				customer: req.customer,
				dryRun: req.dryRun
			});
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["auditLog"] });
		}
	});
}
function useRevokeIamCredentials() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (req) => {
			if (!actor) throw new Error("Actor not ready");
			return await actor.revokeIamCredentials({
				userId: req.userId,
				provider: toBackendProvider(req.provider),
				customer: req.customer,
				dryRun: req.dryRun
			});
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["auditLog"] });
		}
	});
}
function useDisableAzureAdAccount() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (req) => {
			if (!actor) throw new Error("Actor not ready");
			return await actor.disableAzureAdAccount({
				userPrincipalName: req.userPrincipalName,
				customer: req.customer,
				dryRun: req.dryRun
			});
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["auditLog"] });
		}
	});
}
function useForceGcpIamReview() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (req) => {
			if (!actor) throw new Error("Actor not ready");
			return await actor.forceGcpIamReview({
				projectId: req.projectId,
				customer: req.customer,
				dryRun: req.dryRun
			});
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["auditLog"] });
		}
	});
}
function useEscalateToIncident() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (req) => {
			if (!actor) throw new Error("Actor not ready");
			return await actor.escalateToIncident({
				alertId: req.alertId,
				severity: req.severity,
				assignedOwner: req.assignedOwner,
				notes: req.notes,
				customer: req.customer,
				dryRun: req.dryRun
			});
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["auditLog"] });
			qc.invalidateQueries({ queryKey: ["correlatedIncidents"] });
		}
	});
}
function useAuditLog(customer, limit) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: [
			"auditLog",
			customer,
			limit
		],
		queryFn: async () => {
			if (!actor) return [];
			return actor.getAuditLog(customer, BigInt(limit));
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S
	});
}
function usePipelineHealth() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: ["pipelineHealth"],
		queryFn: async () => {
			if (!actor) return [];
			return actor.getPipelineHealth();
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S / 2,
		refetchInterval: STALE_30S,
		refetchIntervalInBackground: false,
		refetchOnWindowFocus: false
	});
}
function useFailedIngestions(provider, limit = 100) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: [
			"failedIngestions",
			provider,
			limit
		],
		queryFn: async () => {
			if (!actor) return [];
			const backendProvider = provider ? provider : null;
			return actor.getFailedIngestions(backendProvider, BigInt(limit));
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S
	});
}
function useCorrelatedIncidents(limit) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: ["correlatedIncidents", limit],
		queryFn: async () => {
			if (!actor) return [];
			return actor.getCorrelatedIncidents(BigInt(limit));
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S
	});
}
function useCorrelationStats() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: ["correlationStats"],
		queryFn: async () => {
			if (!actor) return {
				totalToday: 0n,
				totalThisWeek: 0n,
				totalAllTime: 0n,
				byType: []
			};
			return actor.getCorrelationStats();
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S
	});
}
function useUpdateCorrelatedIncidentStatus() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, status, owner, notes }) => {
			if (!actor) throw new Error("Actor not ready");
			return actor.updateCorrelatedIncidentStatus(id, status, owner ?? null, notes ?? null);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["correlatedIncidents"] });
			qc.invalidateQueries({ queryKey: ["correlationStats"] });
			qc.invalidateQueries({ queryKey: ["correlatedIncident"] });
		}
	});
}
function useAlertsForCorrelation(alertIds) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: ["alertsForCorrelation", alertIds],
		queryFn: async () => {
			if (!actor) return [];
			return actor.getAlertsForCorrelation(alertIds);
		},
		enabled: !!actor && !isFetching && alertIds.length > 0,
		staleTime: STALE_30S
	});
}
function useEnrichAlert() {
	const { actor, isFetching } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ alertId, customer }) => {
			if (!actor || isFetching) throw new Error("Actor not ready");
			const result = await actor.enrichAlertPublic(alertId, customer);
			if (result.__kind__ === "err") throw new Error(result.err);
			return result.ok;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["normalizedAlerts"] });
			queryClient.invalidateQueries({ queryKey: ["alert"] });
		}
	});
}
function useGetEnrichmentKeys() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: ["enrichmentKeys"],
		queryFn: async () => {
			if (!actor) return {
				abuseIpdbKeySet: false,
				virusTotalKeySet: false
			};
			return actor.getEnrichmentKeys();
		},
		enabled: !!actor && !isFetching,
		refetchIntervalInBackground: false,
		refetchOnWindowFocus: false
	});
}
function useSaveEnrichmentKeys() {
	const { actor, isFetching } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (keys) => {
			if (!actor || isFetching) throw new Error("Actor not ready");
			const payload = {};
			if (keys.abuseIpdbKey) payload.abuseIpdbKey = keys.abuseIpdbKey;
			if (keys.virusTotalKey) payload.virusTotalKey = keys.virusTotalKey;
			return actor.saveEnrichmentKeys(payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["enrichmentKeys"] });
		}
	});
}
function useGetWebhookSecretStatus() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: ["webhookSecretStatus"],
		queryFn: async () => {
			if (!actor) return {
				awsSet: false,
				azureSet: false,
				gcpSet: false
			};
			return actor.getWebhookSecretStatus();
		},
		enabled: !!actor && !isFetching,
		refetchIntervalInBackground: false,
		refetchOnWindowFocus: false
	});
}
function useSaveWebhookSecret() {
	const { actor, isFetching } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ provider, secret }) => {
			if (!actor || isFetching) throw new Error("Actor not ready");
			return actor.saveWebhookSecret(toBackendProvider(provider), secret);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["webhookSecretStatus"] });
		}
	});
}
function useListVaultSecrets(provider) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: ["vaultSecrets", provider],
		queryFn: async () => {
			if (!actor) return [];
			return actor.listVaultSecrets(toBackendProvider(provider));
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S
	});
}
function useSaveVaultSecret() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ provider, name, value }) => {
			if (!actor) throw new Error("Actor not ready");
			return actor.saveVaultSecret(toBackendProvider(provider), name, value);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["vaultSecrets"] });
		}
	});
}
function useUpdateVaultSecret() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ provider, name, value }) => {
			if (!actor) throw new Error("Actor not ready");
			return actor.updateVaultSecret(toBackendProvider(provider), name, value);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["vaultSecrets"] });
		}
	});
}
function useDeleteVaultSecret() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ provider, name }) => {
			if (!actor) throw new Error("Actor not ready");
			return actor.deleteVaultSecret(toBackendProvider(provider), name);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["vaultSecrets"] });
		}
	});
}
function useRevealVaultSecret() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ provider, name }) => {
			if (!actor) throw new Error("Actor not ready");
			const result = await actor.revealVaultSecret(toBackendProvider(provider), name);
			if (result.__kind__ === "err") throw new Error(String(result.err));
			return result.ok;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["vaultSecrets"] });
		}
	});
}
function useProviderCredentialStatus(provider) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: ["providerCredentialStatus", provider],
		queryFn: async () => {
			if (!actor) return {
				provider,
				configured: false,
				fields: []
			};
			return actor.getProviderCredentialStatus(toBackendProvider(provider));
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S
	});
}
function useSaveProviderCredential() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (input) => {
			if (!actor) throw new Error("Actor not ready");
			return actor.saveProviderCredential(input);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["providerCredentialStatus"] });
			qc.invalidateQueries({ queryKey: ["auditLog"] });
		}
	});
}
function useUpdateProviderCredential() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (input) => {
			if (!actor) throw new Error("Actor not ready");
			return actor.updateProviderCredential(input);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["providerCredentialStatus"] });
			qc.invalidateQueries({ queryKey: ["auditLog"] });
		}
	});
}
function useClearProviderCredential() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (provider) => {
			if (!actor) throw new Error("Actor not ready");
			return actor.clearProviderCredential(toBackendProvider(provider));
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["providerCredentialStatus"] });
			qc.invalidateQueries({ queryKey: ["auditLog"] });
		}
	});
}
function useTestProviderConnection(provider) {
	const { actor } = useActor(createActor);
	return useMutation({ mutationFn: async () => {
		if (!actor) throw new Error("Actor not ready");
		const result = await actor.testProviderConnection(toBackendProvider(provider));
		if (result.__kind__ === "Success") return {
			success: true,
			message: result.Success
		};
		return {
			success: false,
			message: result.Failure
		};
	} });
}
function useGetReports(customer) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: ["reports", customer],
		queryFn: async () => {
			if (!actor) return [];
			return actor.getReports(customer);
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S,
		refetchIntervalInBackground: false,
		refetchOnWindowFocus: false
	});
}
function useGenerateReport() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (req) => {
			if (!actor) throw new Error("Actor not ready");
			const raw = await actor.generateReport(req);
			if (raw.__kind__ === "err") throw new Error(raw.err);
			return raw.ok;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["reports"] });
		}
	});
}
function useGetReportCsv() {
	const { actor } = useActor(createActor);
	return useMutation({ mutationFn: async ({ reportId, customer }) => {
		if (!actor) throw new Error("Actor not ready");
		return actor.getReportCsv(reportId, customer);
	} });
}
function useDeleteReport() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ reportId, customer }) => {
			if (!actor) throw new Error("Actor not ready");
			return actor.deleteReport(reportId, customer);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["reports"] });
		}
	});
}
function useGetReportEmailConfig(customer) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: ["reportEmailConfig", customer],
		queryFn: async () => {
			if (!actor) return [];
			return actor.getReportEmailConfig(customer);
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S,
		refetchIntervalInBackground: false,
		refetchOnWindowFocus: false
	});
}
function useGlobalSearch(query, customer) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: [
			"globalSearch",
			query,
			customer
		],
		queryFn: async () => {
			if (!actor || query.length < 2) return {
				hasMore: false,
				results: []
			};
			return await actor.globalSearch(query, customer, BigInt(100));
		},
		enabled: !!actor && !isFetching && query.length >= 2,
		staleTime: 1e4
	});
}
function useReportRuns(customer, limit) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: [
			"reportRuns",
			customer,
			limit
		],
		queryFn: async () => {
			if (!actor) return [];
			return actor.getReportRuns(customer, BigInt(limit));
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S,
		refetchIntervalInBackground: false,
		refetchOnWindowFocus: false
	});
}
function useSaveReportRecipients() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (config) => {
			if (!actor) throw new Error("Actor not ready");
			const raw = await actor.saveReportRecipients(config);
			if (raw.__kind__ === "err") throw new Error(raw.err.__kind__);
			return raw.ok;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["reportRecipients"] });
		}
	});
}
function useExportReportPdf() {
	const { actor } = useActor(createActor);
	return useMutation({ mutationFn: async ({ reportType, periodStart, periodEnd, customer, providerScope }) => {
		if (!actor) throw new Error("Actor not ready");
		return actor.exportReportPdf(reportType, periodStart, periodEnd, customer, providerScope.map(toBackendProvider));
	} });
}
function useNotificationRouting(customer) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: ["notificationRouting", customer],
		queryFn: async () => {
			if (!actor) return null;
			return actor.getNotificationRouting(customer);
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S
	});
}
function useSaveNotificationRouting() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (routing) => {
			if (!actor) throw new Error("Actor not ready");
			const raw = await actor.saveNotificationRouting(routing);
			if (raw.__kind__ === "err") throw new Error(raw.err.__kind__);
			return raw.ok;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["notificationRouting"] });
		}
	});
}
function useRateLimitStates() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: ["rateLimitStates"],
		queryFn: async () => {
			if (!actor) return [];
			return actor.getRateLimitStates();
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S / 2,
		refetchInterval: STALE_30S,
		refetchIntervalInBackground: false,
		refetchOnWindowFocus: false
	});
}
function useThrottleEvents(provider, limit) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: [
			"throttleEvents",
			provider,
			limit
		],
		queryFn: async () => {
			if (!actor) return [];
			return actor.getThrottleEvents(provider ? toBackendProvider(provider) : null, BigInt(limit));
		},
		enabled: !!actor && !isFetching,
		staleTime: STALE_30S
	});
}
function useResetProviderBackoff() {
	const { actor } = useActor(createActor);
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (provider) => {
			if (!actor) throw new Error("Actor not ready");
			const raw = await actor.resetProviderBackoff(toBackendProvider(provider));
			if (raw.__kind__ === "err") throw new Error(raw.err.__kind__);
			return raw.ok;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["rateLimitStates"] });
		}
	});
}
export { useSaveProviderCredential as $, useGetReports as A, usePipelineHealth as B, useFailedIngestions as C, useGetMyProviders as D, useGetEnrichmentKeys as E, useListVaultSecrets as F, useRemoveProviderAccess as G, useProviderStates as H, useNormalizedAlerts as I, useRevealVaultSecret as J, useReportRuns as K, useNormalizedAlertsPage as L, useGlobalSearch as M, useIsolateResource as N, useGetReportCsv as O, useListUserAssignments as P, useSaveNotificationRouting as Q, useNotificationLogs as R, useExportReportPdf as S, useGenerateReport as T, useRateLimitStates as U, useProviderCredentialStatus as V, useRawFindings as W, useSaveAlertRule as X, useRevokeIamCredentials as Y, useSaveEnrichmentKeys as Z, useDisableAzureAdAccount as _, useAssetFindings as a, useUpdateAlertOwner as at, useExportComplianceCsv as b, useAuditLog as c, useUpdateProviderCredential as ct, useComplianceStatus as d, useSaveReportRecipients as et, useCorrelatedIncidents as f, useDeleteVaultSecret as g, useDeleteReport as h, useAssetById as i, useThrottleEvents as it, useGetWebhookSecretStatus as j, useGetReportEmailConfig as k, useBlockIp as l, useUpdateVaultSecret as lt, useDeleteAlertRule as m, useAlertRules as n, useSaveWebhookSecret as nt, useAssets as o, useUpdateAlertStatus as ot, useCorrelationStats as p, useResetProviderBackoff as q, useAlertsForCorrelation as r, useTestProviderConnection as rt, useAssignProviderAccess as s, useUpdateCorrelatedIncidentStatus as st, useAcknowledgeNotification as t, useSaveVaultSecret as tt, useClearProviderCredential as u, createLucideIcon as ut, useEnrichAlert as v, useForceGcpIamReview as w, useExportCompliancePdf as x, useEscalateToIncident as y, useNotificationRouting as z };
