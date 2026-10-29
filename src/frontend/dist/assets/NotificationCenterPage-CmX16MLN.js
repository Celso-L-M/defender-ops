import { c as require_react, et as __toESM, s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
import { R as useNotificationLogs, t as useAcknowledgeNotification, ut as createLucideIcon } from "./use-backend-C00QWIg7.js";
import { t as Button } from "./button-BzL40mBy.js";
import { n as CheckCheck, r as BellOff, t as Circle } from "./circle-CJLY8hq0.js";
import { c as Inbox, p as Bell, t as Layout } from "./Layout-9d6smJ4x.js";
import { t as CircleCheck } from "./circle-check-oM7foquT.js";
import { t as Mail } from "./mail-B9upj0k0.js";
import { t as MessageSquare } from "./message-square-cQdaFrtW.js";
import { t as TriangleAlert } from "./triangle-alert-BkFNXZBH.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-BD1RpDgK.js";
import { t as formatDistanceToNow } from "./formatDistanceToNow-C-lSiC7M.js";
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MonitorSmartphone = createLucideIcon("monitor-smartphone", [
	["path", {
		d: "M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8",
		key: "10dyio"
	}],
	["path", {
		d: "M10 19v-3.96 3.15",
		key: "1irgej"
	}],
	["path", {
		d: "M7 19h5",
		key: "qswx4l"
	}],
	["rect", {
		width: "6",
		height: "10",
		x: "16",
		y: "12",
		rx: "2",
		key: "1egngj"
	}]
]);
// src/pages/NotificationCenterPage.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var CUSTOMER = "default";
var HISTORY_LIMIT = 200;
var CHANNEL_META = {
	InApp: {
		label: "In-App",
		icon: MonitorSmartphone,
		className: "bg-primary/15 text-primary border border-primary/40"
	},
	Email: {
		label: "Email",
		icon: Mail,
		className: "bg-chart-2/15 text-chart-2 border border-chart-2/40"
	},
	TeamsWebhook: {
		label: "Teams",
		icon: MessageSquare,
		className: "bg-accent/15 text-accent-foreground border border-accent/40"
	}
};
var STATUS_META = {
	Sent: "bg-muted/30 text-muted-foreground border border-border",
	Failed: "bg-destructive/15 text-destructive border border-destructive/40",
	Acknowledged: "bg-chart-2/15 text-chart-2 border border-chart-2/40"
};
function relativeTime(ts) {
	try {
		return formatDistanceToNow(new Date(Number(ts / 1000000n)), { addSuffix: true });
	} catch {
		return "Unknown";
	}
}
function absoluteTime(ts) {
	try {
		return new Date(Number(ts / 1000000n)).toLocaleString();
	} catch {
		return "Unknown";
	}
}
function ChannelBadge({ channel }) {
	const meta = CHANNEL_META[channel];
	const Icon = meta.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide ${meta.className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 11 }), meta.label]
	});
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide ${STATUS_META[status]}`,
		children: status
	});
}
function AckBadge({ acknowledged }) {
	return acknowledged ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide bg-chart-2/15 text-chart-2 border border-chart-2/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 11 }), "Acknowledged"]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide bg-warning/15 text-warning border border-warning/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, {
			size: 9,
			className: "fill-warning"
		}), "Pending"]
	});
}
function NotificationCenterPage() {
	const { data: logs = [], isLoading } = useNotificationLogs(CUSTOMER, HISTORY_LIMIT);
	const ackMutation = useAcknowledgeNotification();
	const [pendingId, setPendingId] = (0, import_react.useState)(null);
	const unacknowledged = logs.filter((l) => !l.acknowledged);
	const acknowledgedCount = logs.length - unacknowledged.length;
	function acknowledge(id) {
		setPendingId(id);
		ackMutation.mutate(id, { onSettled: () => setPendingId(null) });
	}
	function acknowledgeAll() {
		for (const log of unacknowledged) ackMutation.mutate(log.id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "notification_center.page",
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 border border-primary/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, {
							size: 18,
							className: "text-primary"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display font-bold text-xl text-foreground",
						children: "Notification Center"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground font-mono uppercase tracking-wider",
						children: "Acknowledge alerts · Full delivery history"
					})] })]
				}), unacknowledged.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: acknowledgeAll,
					disabled: ackMutation.isPending,
					"data-ocid": "notification_center.acknowledge_all_button",
					className: "gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { size: 13 }), " Acknowledge All"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-ocid": "notification_center.pending_card",
						className: "rounded-lg border border-warning/40 bg-warning/5 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
							children: "Awaiting Acknowledgement"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl font-bold text-warning mt-1",
							children: unacknowledged.length
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-ocid": "notification_center.acknowledged_card",
						className: "rounded-lg border border-border bg-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
							children: "Acknowledged"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl font-bold text-foreground mt-1",
							children: acknowledgedCount
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-ocid": "notification_center.total_card",
						className: "rounded-lg border border-border bg-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
							children: "Total Delivered"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl font-bold text-foreground mt-1",
							children: logs.length
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
						size: 15,
						className: "text-primary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display font-semibold text-sm text-foreground",
						children: "Needs Attention"
					})]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-ocid": "notification_center.pending_loading_state",
					className: "space-y-2",
					children: Array.from({ length: 3 }, (_, i) => `pending-skeleton-${i}`).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-20 rounded-lg bg-muted/20 animate-pulse" }, id))
				}) : unacknowledged.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-ocid": "notification_center.pending_empty_state",
					className: "flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/10 py-12 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellOff, {
							size: 30,
							className: "text-muted-foreground/40"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display font-semibold text-foreground",
							children: "Nothing needs your attention"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground max-w-xs",
							children: "Every notification has been acknowledged."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: unacknowledged.map((log, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-ocid": `notification_center.pending.item.${idx + 1}`,
						className: "rounded-lg border border-warning/40 bg-warning/5 p-4 flex items-start gap-3 transition-smooth",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, {
									size: 9,
									className: "fill-warning text-warning"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0 space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: "/alerts",
											className: "text-sm font-medium text-foreground hover:text-primary transition-smooth truncate",
											children: ["Alert #", log.alertId.slice(0, 8)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelBadge, { channel: log.channel }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: log.status })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Rule:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-foreground",
												children: log.ruleId.slice(0, 12)
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Recipient:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground",
												children: log.recipient
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											title: absoluteTime(log.timestamp),
											children: relativeTime(log.timestamp)
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								size: "sm",
								variant: "outline",
								className: "shrink-0 text-xs h-7 gap-1.5",
								onClick: () => acknowledge(log.id),
								disabled: ackMutation.isPending && pendingId === log.id,
								"data-ocid": `notification_center.acknowledge_button.${idx + 1}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { size: 13 }), ackMutation.isPending && pendingId === log.id ? "Acknowledging…" : "Acknowledge"]
							})
						]
					}, log.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
						size: 15,
						className: "text-muted-foreground"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display font-semibold text-sm text-foreground",
						children: "Notification History"
					})]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-ocid": "notification_center.history_loading_state",
					className: "space-y-1",
					children: Array.from({ length: 5 }, (_, i) => `history-skeleton-${i}`).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 rounded bg-muted/20 animate-pulse" }, id))
				}) : logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-ocid": "notification_center.history_empty_state",
					className: "flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/10 py-12 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
							size: 30,
							className: "text-muted-foreground/40"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display font-semibold text-foreground",
							children: "No notification history"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground max-w-xs",
							children: "Notifications appear here once an alert rule routes a finding."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-border overflow-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: "border-border bg-muted/20",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-xs text-muted-foreground w-32",
								children: "Timestamp"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-xs text-muted-foreground w-32",
								children: "Alert"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-xs text-muted-foreground w-32",
								children: "Rule"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-xs text-muted-foreground w-28",
								children: "Channel"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-xs text-muted-foreground",
								children: "Recipient"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-xs text-muted-foreground w-28",
								children: "Delivery"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-xs text-muted-foreground w-36",
								children: "Acknowledgement"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: logs.map((log, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						"data-ocid": `notification_center.history.item.${idx + 1}`,
						className: "border-border hover:bg-muted/10 transition-smooth",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs text-muted-foreground font-mono",
								title: absoluteTime(log.timestamp),
								children: relativeTime(log.timestamp)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "/alerts",
								className: "text-xs font-mono text-primary hover:underline",
								children: [log.alertId.slice(0, 10), "…"]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
								className: "text-xs font-mono text-muted-foreground",
								children: [log.ruleId.slice(0, 10), "…"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelBadge, { channel: log.channel }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs text-foreground max-w-[180px] truncate",
								children: log.recipient
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: log.status }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AckBadge, { acknowledged: log.acknowledged }), !log.acknowledged && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									size: "sm",
									className: "h-6 px-2 text-[11px]",
									onClick: () => acknowledge(log.id),
									disabled: ackMutation.isPending && pendingId === log.id,
									"data-ocid": `notification_center.history_acknowledge_button.${idx + 1}`,
									children: "Ack"
								})]
							}) })
						]
					}, log.id)) })] })
				})]
			})
		]
	}) });
}
export { NotificationCenterPage as default };
