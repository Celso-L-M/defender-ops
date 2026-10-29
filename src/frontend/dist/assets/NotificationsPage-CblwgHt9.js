import { c as require_react, et as __toESM, s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
import { R as useNotificationLogs, X as useSaveAlertRule, m as useDeleteAlertRule, n as useAlertRules, t as useAcknowledgeNotification } from "./use-backend-C00QWIg7.js";
import { o as useComposedRefs, t as cn } from "./utils-Dt9zQ6gD.js";
import { t as Badge } from "./badge-LsDsWI7w.js";
import { t as Button } from "./button-BzL40mBy.js";
import { t as Input } from "./input-DRmrQsxb.js";
import { t as Label } from "./label-DKpYm3Db.js";
import { a as useControllableState, c as createContextScope, l as composeEventHandlers, t as Primitive } from "./dist-wg4nkkUd.js";
import { t as Switch } from "./switch-XM5b6x2f.js";
import { n as CheckCheck, r as BellOff, t as Circle } from "./circle-CJLY8hq0.js";
import { p as Bell, t as Layout } from "./Layout-9d6smJ4x.js";
import { t as CircleCheck } from "./circle-check-oM7foquT.js";
import { t as Plus } from "./plus-D4c1gqpK.js";
import { t as Shield } from "./shield-CbiefNtr.js";
import { t as Trash2 } from "./trash-2-Df6HVUZV.js";
import { t as TriangleAlert } from "./triangle-alert-BkFNXZBH.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, o as useDirection, r as SelectItem, s as createCollection, t as Select } from "./select-4ii6VlPg.js";
import { c as useCallbackRef, i as useId } from "./Combination-B2eYnCkY.js";
import { t as Presence } from "./dist-N5Uxs1Wg.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-BD1RpDgK.js";
import { t as formatDistanceToNow } from "./formatDistanceToNow-C-lSiC7M.js";
import { t as Checkbox } from "./checkbox-BgEW2MjN.js";
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@radix-ui+react-roving-focus@1.1.11_@types+react-dom@19.1.11_@types+react@19.1.17__@typ_36cadf73f63477a2272afac63e9bee96/node_modules/@radix-ui/react-roving-focus/dist/index.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = {
	bubbles: false,
	cancelable: true
};
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] = createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(GROUP_NAME, [createCollectionScope]);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = import_react.forwardRef((props, forwardedRef) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.Provider, {
		scope: props.__scopeRovingFocusGroup,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.Slot, {
			scope: props.__scopeRovingFocusGroup,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RovingFocusGroupImpl, {
				...props,
				ref: forwardedRef
			})
		})
	});
});
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeRovingFocusGroup, orientation, loop = false, dir, currentTabStopId: currentTabStopIdProp, defaultCurrentTabStopId, onCurrentTabStopIdChange, onEntryFocus, preventScrollOnEntryFocus = false, ...groupProps } = props;
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const direction = useDirection(dir);
	const [currentTabStopId, setCurrentTabStopId] = useControllableState({
		prop: currentTabStopIdProp,
		defaultProp: defaultCurrentTabStopId ?? null,
		onChange: onCurrentTabStopIdChange,
		caller: GROUP_NAME
	});
	const [isTabbingBackOut, setIsTabbingBackOut] = import_react.useState(false);
	const handleEntryFocus = useCallbackRef(onEntryFocus);
	const getItems = useCollection(__scopeRovingFocusGroup);
	const isClickFocusRef = import_react.useRef(false);
	const [focusableItemsCount, setFocusableItemsCount] = import_react.useState(0);
	import_react.useEffect(() => {
		const node = ref.current;
		if (node) {
			node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
			return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
		}
	}, [handleEntryFocus]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RovingFocusProvider, {
		scope: __scopeRovingFocusGroup,
		orientation,
		dir: direction,
		loop,
		currentTabStopId,
		onItemFocus: import_react.useCallback((tabStopId) => setCurrentTabStopId(tabStopId), [setCurrentTabStopId]),
		onItemShiftTab: import_react.useCallback(() => setIsTabbingBackOut(true), []),
		onFocusableItemAdd: import_react.useCallback(() => setFocusableItemsCount((prevCount) => prevCount + 1), []),
		onFocusableItemRemove: import_react.useCallback(() => setFocusableItemsCount((prevCount) => prevCount - 1), []),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
			"data-orientation": orientation,
			...groupProps,
			ref: composedRefs,
			style: {
				outline: "none",
				...props.style
			},
			onMouseDown: composeEventHandlers(props.onMouseDown, () => {
				isClickFocusRef.current = true;
			}),
			onFocus: composeEventHandlers(props.onFocus, (event) => {
				const isKeyboardFocus = !isClickFocusRef.current;
				if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
					const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
					event.currentTarget.dispatchEvent(entryFocusEvent);
					if (!entryFocusEvent.defaultPrevented) {
						const items = getItems().filter((item) => item.focusable);
						focusFirst([
							items.find((item) => item.active),
							items.find((item) => item.id === currentTabStopId),
							...items
						].filter(Boolean).map((item) => item.ref.current), preventScrollOnEntryFocus);
					}
				}
				isClickFocusRef.current = false;
			}),
			onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
		})
	});
});
var ITEM_NAME = "RovingFocusGroupItem";
var RovingFocusGroupItem = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeRovingFocusGroup, focusable = true, active = false, tabStopId, children, ...itemProps } = props;
	const autoId = useId();
	const id = tabStopId || autoId;
	const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup);
	const isCurrentTabStop = context.currentTabStopId === id;
	const getItems = useCollection(__scopeRovingFocusGroup);
	const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
	import_react.useEffect(() => {
		if (focusable) {
			onFocusableItemAdd();
			return () => onFocusableItemRemove();
		}
	}, [
		focusable,
		onFocusableItemAdd,
		onFocusableItemRemove
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.ItemSlot, {
		scope: __scopeRovingFocusGroup,
		id,
		focusable,
		active,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
			tabIndex: isCurrentTabStop ? 0 : -1,
			"data-orientation": context.orientation,
			...itemProps,
			ref: forwardedRef,
			onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
				if (!focusable) event.preventDefault();
				else context.onItemFocus(id);
			}),
			onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
			onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
				if (event.key === "Tab" && event.shiftKey) {
					context.onItemShiftTab();
					return;
				}
				if (event.target !== event.currentTarget) return;
				const focusIntent = getFocusIntent(event, context.orientation, context.dir);
				if (focusIntent !== void 0) {
					if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
					event.preventDefault();
					let candidateNodes = getItems().filter((item) => item.focusable).map((item) => item.ref.current);
					if (focusIntent === "last") candidateNodes.reverse();
					else if (focusIntent === "prev" || focusIntent === "next") {
						if (focusIntent === "prev") candidateNodes.reverse();
						const currentIndex = candidateNodes.indexOf(event.currentTarget);
						candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
					}
					setTimeout(() => focusFirst(candidateNodes));
				}
			}),
			children: typeof children === "function" ? children({
				isCurrentTabStop,
				hasTabStop: currentTabStopId != null
			}) : children
		})
	});
});
RovingFocusGroupItem.displayName = ITEM_NAME;
var MAP_KEY_TO_FOCUS_INTENT = {
	ArrowLeft: "prev",
	ArrowUp: "prev",
	ArrowRight: "next",
	ArrowDown: "next",
	PageUp: "first",
	Home: "first",
	PageDown: "last",
	End: "last"
};
function getDirectionAwareKey(key, dir) {
	if (dir !== "rtl") return key;
	return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
	const key = getDirectionAwareKey(event.key, dir);
	if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
	if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
	return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst(candidates, preventScroll = false) {
	const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
	for (const candidate of candidates) {
		if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
		candidate.focus({ preventScroll });
		if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
	}
}
function wrapArray(array, startIndex) {
	return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root = RovingFocusGroup;
var Item = RovingFocusGroupItem;
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@radix-ui+react-tabs@1.1.13_@types+react-dom@19.1.11_@types+react@19.1.17__@types+react_f21cc4b4766ef55b6ce735b87630a35d/node_modules/@radix-ui/react-tabs/dist/index.mjs
var TABS_NAME = "Tabs";
var [createTabsContext, createTabsScope] = createContextScope(TABS_NAME, [createRovingFocusGroupScope]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeTabs, value: valueProp, onValueChange, defaultValue, orientation = "horizontal", dir, activationMode = "automatic", ...tabsProps } = props;
	const direction = useDirection(dir);
	const [value, setValue] = useControllableState({
		prop: valueProp,
		onChange: onValueChange,
		defaultProp: defaultValue ?? "",
		caller: TABS_NAME
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsProvider, {
		scope: __scopeTabs,
		baseId: useId(),
		value,
		onValueChange: setValue,
		orientation,
		dir: direction,
		activationMode,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			dir: direction,
			"data-orientation": orientation,
			...tabsProps,
			ref: forwardedRef
		})
	});
});
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeTabs, loop = true, ...listProps } = props;
	const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
	const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		asChild: true,
		...rovingFocusGroupScope,
		orientation: context.orientation,
		dir: context.dir,
		loop,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			role: "tablist",
			"aria-orientation": context.orientation,
			...listProps,
			ref: forwardedRef
		})
	});
});
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
	const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
	const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
	const triggerId = makeTriggerId(context.baseId, value);
	const contentId = makeContentId(context.baseId, value);
	const isSelected = value === context.value;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
		asChild: true,
		...rovingFocusGroupScope,
		focusable: !disabled,
		active: isSelected,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
			type: "button",
			role: "tab",
			"aria-selected": isSelected,
			"aria-controls": contentId,
			"data-state": isSelected ? "active" : "inactive",
			"data-disabled": disabled ? "" : void 0,
			disabled,
			id: triggerId,
			...triggerProps,
			ref: forwardedRef,
			onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
				if (!disabled && event.button === 0 && event.ctrlKey === false) context.onValueChange(value);
				else event.preventDefault();
			}),
			onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
				if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
			}),
			onFocus: composeEventHandlers(props.onFocus, () => {
				const isAutomaticActivation = context.activationMode !== "manual";
				if (!isSelected && !disabled && isAutomaticActivation) context.onValueChange(value);
			})
		})
	});
});
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
	const context = useTabsContext(CONTENT_NAME, __scopeTabs);
	const triggerId = makeTriggerId(context.baseId, value);
	const contentId = makeContentId(context.baseId, value);
	const isSelected = value === context.value;
	const isMountAnimationPreventedRef = import_react.useRef(isSelected);
	import_react.useEffect(() => {
		const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
		return () => cancelAnimationFrame(rAF);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || isSelected,
		children: ({ present }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			"data-state": isSelected ? "active" : "inactive",
			"data-orientation": context.orientation,
			role: "tabpanel",
			"aria-labelledby": triggerId,
			hidden: !present,
			id: contentId,
			tabIndex: 0,
			...contentProps,
			ref: forwardedRef,
			style: {
				...props.style,
				animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
			},
			children: present && children
		})
	});
});
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
	return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
	return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
// src/components/ui/tabs.tsx
function Tabs({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2, {
		"data-slot": "tabs",
		className: cn("flex flex-col gap-2", className),
		...props
	});
}
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		"data-slot": "tabs-list",
		className: cn("bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		"data-slot": "tabs-trigger",
		className: cn("data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
		...props
	});
}
function TabsContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
		"data-slot": "tabs-content",
		className: cn("flex-1 outline-none", className),
		...props
	});
}
// src/pages/NotificationsPage.tsx
var CUSTOMER = "default";
var SEVERITY_OPTIONS = [
	{
		label: "Any Critical",
		value: "AnyCritical"
	},
	{
		label: "Any High+",
		value: "AnyHigh"
	},
	{
		label: "Any Medium+",
		value: "AnyMedium"
	},
	{
		label: "Any Low",
		value: "AnyLow"
	},
	{
		label: "Critical or High",
		value: "CriticalOrHigh"
	},
	{
		label: "All Findings",
		value: "All"
	}
];
var CHANNEL_OPTIONS = [
	{
		label: "In-App",
		value: "InApp"
	},
	{
		label: "Email",
		value: "Email"
	},
	{
		label: "Teams Webhook",
		value: "TeamsWebhook"
	}
];
var CHANNEL_COLORS = {
	InApp: "bg-primary/20 text-primary border border-primary/40",
	Email: "bg-chart-2/20 text-chart-2 border border-chart-2/40",
	TeamsWebhook: "bg-accent/20 text-accent-foreground border border-accent/40"
};
var STATUS_COLORS = {
	Sent: "bg-muted/30 text-muted-foreground border border-border",
	Failed: "bg-destructive/20 text-destructive border border-destructive/40",
	Acknowledged: "bg-chart-2/20 text-chart-2 border border-chart-2/40"
};
function relativeTime(ts) {
	try {
		return formatDistanceToNow(new Date(Number(ts / 1000000n)), { addSuffix: true });
	} catch {
		return "Unknown";
	}
}
function ChannelBadge({ channel }) {
	const label = channel === "TeamsWebhook" ? "Teams" : channel;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide ${CHANNEL_COLORS[channel]}`,
		children: label
	});
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide ${STATUS_COLORS[status]}`,
		children: status
	});
}
function AckBadge({ acknowledged }) {
	return acknowledged ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide bg-chart-2/20 text-chart-2 border border-chart-2/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 11 }), "Acknowledged"]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide bg-warning/20 text-warning border border-warning/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, {
			size: 9,
			className: "fill-warning"
		}), "Pending"]
	});
}
var defaultForm = {
	name: "",
	enabled: true,
	severityThreshold: "AnyCritical",
	findingType: "",
	assetId: "",
	provider: "",
	region: "",
	channels: ["InApp"],
	cooldownMinutes: 60,
	escalationMinutes: "",
	escalationRecipient: ""
};
function AlertRulesTab() {
	const { data: rules = [], isLoading } = useAlertRules(CUSTOMER);
	const saveRule = useSaveAlertRule();
	const deleteRule = useDeleteAlertRule();
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(defaultForm);
	function openCreate() {
		setEditId(null);
		setForm(defaultForm);
		setShowForm(true);
	}
	function openEdit(rule) {
		setEditId(rule.id);
		setForm({
			name: rule.name,
			enabled: rule.enabled,
			severityThreshold: rule.severityThreshold ?? "",
			findingType: rule.findingType ?? "",
			assetId: rule.assetId ?? "",
			provider: rule.provider ?? "",
			region: rule.region ?? "",
			channels: rule.channels,
			cooldownMinutes: Number(rule.cooldownMinutes),
			escalationMinutes: rule.escalationMinutes ? Number(rule.escalationMinutes) : "",
			escalationRecipient: rule.escalationRecipient ?? ""
		});
		setShowForm(true);
	}
	function cancel() {
		setShowForm(false);
		setEditId(null);
		setForm(defaultForm);
	}
	function toggleChannel(ch) {
		setForm((f) => ({
			...f,
			channels: f.channels.includes(ch) ? f.channels.filter((c) => c !== ch) : [...f.channels, ch]
		}));
	}
	function handleSave() {
		if (!form.name.trim() || form.channels.length === 0) return;
		const rule = {
			id: editId ?? `rule-${Date.now()}`,
			name: form.name.trim(),
			customer: CUSTOMER,
			enabled: form.enabled,
			severityThreshold: form.severityThreshold || void 0,
			findingType: form.findingType.trim() || void 0,
			assetId: form.assetId.trim() || void 0,
			provider: form.provider || void 0,
			region: form.region.trim() || void 0,
			channels: form.channels,
			cooldownMinutes: BigInt(form.cooldownMinutes),
			escalationMinutes: form.escalationMinutes !== "" ? BigInt(form.escalationMinutes) : void 0,
			escalationRecipient: form.escalationRecipient.trim() || void 0
		};
		saveRule.mutate(rule, { onSuccess: () => cancel() });
	}
	function handleToggleEnabled(rule) {
		saveRule.mutate({
			...rule,
			enabled: !rule.enabled
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						rules.length,
						" rule",
						rules.length !== 1 ? "s" : "",
						" configured"
					]
				}), !showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "sm",
					onClick: openCreate,
					"data-ocid": "notifications.create_rule_button",
					className: "gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 14 }), "Create Rule"]
				})]
			}),
			showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-ocid": "notifications.rule_form",
				className: "rounded-lg border border-border bg-card p-4 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display font-semibold text-sm text-foreground",
						children: editId ? "Edit Rule" : "New Alert Rule"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Rule Name *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									"data-ocid": "notifications.rule_name_input",
									placeholder: "e.g. Critical AWS Alerts",
									value: form.name,
									onChange: (e) => setForm((f) => ({
										...f,
										name: e.target.value
									})),
									className: "bg-background h-8 text-sm"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 pt-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									"data-ocid": "notifications.rule_enabled_switch",
									checked: form.enabled,
									onCheckedChange: (v) => setForm((f) => ({
										...f,
										enabled: v
									}))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted-foreground",
									children: "Enabled"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Severity Threshold"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.severityThreshold,
									onValueChange: (v) => setForm((f) => ({
										...f,
										severityThreshold: v
									})),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										"data-ocid": "notifications.severity_threshold_select",
										className: "bg-background h-8 text-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select threshold" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SEVERITY_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: o.value,
										children: o.label
									}, o.value)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Provider (optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.provider,
									onValueChange: (v) => setForm((f) => ({
										...f,
										provider: v
									})),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										"data-ocid": "notifications.provider_select",
										className: "bg-background h-8 text-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Any provider" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "",
											children: "Any"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "AWS",
											children: "AWS"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Azure",
											children: "Azure"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "GCP",
											children: "GCP"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Finding Type (optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									"data-ocid": "notifications.finding_type_input",
									placeholder: "e.g. UnauthorizedAccess",
									value: form.findingType,
									onChange: (e) => setForm((f) => ({
										...f,
										findingType: e.target.value
									})),
									className: "bg-background h-8 text-sm"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Asset ID (optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									"data-ocid": "notifications.asset_id_input",
									placeholder: "e.g. i-0abc123",
									value: form.assetId,
									onChange: (e) => setForm((f) => ({
										...f,
										assetId: e.target.value
									})),
									className: "bg-background h-8 text-sm"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Region (optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									"data-ocid": "notifications.region_input",
									placeholder: "e.g. us-east-1",
									value: form.region,
									onChange: (e) => setForm((f) => ({
										...f,
										region: e.target.value
									})),
									className: "bg-background h-8 text-sm"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Cooldown (minutes)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									"data-ocid": "notifications.cooldown_input",
									type: "number",
									min: 1,
									value: form.cooldownMinutes,
									onChange: (e) => setForm((f) => ({
										...f,
										cooldownMinutes: Math.max(1, Number(e.target.value))
									})),
									className: "bg-background h-8 text-sm"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Escalate after (minutes, optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									"data-ocid": "notifications.escalation_minutes_input",
									type: "number",
									min: 1,
									placeholder: "No escalation",
									value: form.escalationMinutes,
									onChange: (e) => setForm((f) => ({
										...f,
										escalationMinutes: e.target.value === "" ? "" : Number(e.target.value)
									})),
									className: "bg-background h-8 text-sm"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Escalation Recipient (optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									"data-ocid": "notifications.escalation_recipient_input",
									placeholder: "email or username",
									value: form.escalationRecipient,
									onChange: (e) => setForm((f) => ({
										...f,
										escalationRecipient: e.target.value
									})),
									className: "bg-background h-8 text-sm"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs text-muted-foreground",
							children: "Notification Channels *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-4",
							children: CHANNEL_OPTIONS.map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								htmlFor: `channel-${ch.value}`,
								className: "flex items-center gap-2 cursor-pointer select-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									id: `channel-${ch.value}`,
									"data-ocid": `notifications.channel_${ch.value.toLowerCase()}_checkbox`,
									checked: form.channels.includes(ch.value),
									onCheckedChange: () => toggleChannel(ch.value)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-foreground",
									children: ch.label
								})]
							}, ch.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "sm",
							onClick: handleSave,
							disabled: saveRule.isPending || !form.name.trim() || form.channels.length === 0,
							"data-ocid": "notifications.save_rule_button",
							children: saveRule.isPending ? "Saving…" : "Save Rule"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							size: "sm",
							onClick: cancel,
							"data-ocid": "notifications.cancel_rule_button",
							children: "Cancel"
						})]
					})
				]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-ocid": "notifications.rules_loading_state",
				className: "space-y-2",
				children: [
					0,
					1,
					2
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-20 rounded-lg bg-muted/20 animate-pulse" }, `sk-${i}`))
			}) : rules.length === 0 && !showForm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-ocid": "notifications.rules_empty_state",
				className: "flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/10 py-14 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellOff, {
						size: 32,
						className: "text-muted-foreground/40"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display font-semibold text-foreground",
						children: "No alert rules yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground max-w-xs",
						children: "Create a rule to start routing notifications to your team."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						onClick: openCreate,
						className: "mt-1 gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 14 }), " Create Rule"]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: rules.map((rule, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-ocid": `notifications.rule.item.${idx + 1}`,
					className: "rounded-lg border border-border bg-card p-4 space-y-2 hover:border-border/80 transition-smooth",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										"data-ocid": `notifications.rule.toggle.${idx + 1}`,
										checked: rule.enabled,
										onCheckedChange: () => handleToggleEnabled(rule),
										"aria-label": `Toggle rule ${rule.name}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display font-semibold text-sm text-foreground truncate",
										children: rule.name
									}),
									!rule.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: "text-xs shrink-0",
										children: "Disabled"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									size: "icon",
									className: "h-7 w-7",
									onClick: () => openEdit(rule),
									"data-ocid": `notifications.rule.edit_button.${idx + 1}`,
									"aria-label": "Edit rule",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { size: 13 })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									size: "icon",
									className: "h-7 w-7 text-destructive hover:text-destructive",
									onClick: () => deleteRule.mutate(rule.id),
									"data-ocid": `notifications.rule.delete_button.${idx + 1}`,
									"aria-label": "Delete rule",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 13 })
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground",
							children: [
								rule.severityThreshold && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Severity:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: rule.severityThreshold
									})
								] }),
								rule.provider && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Provider:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: rule.provider
									})
								] }),
								rule.findingType && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Type:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: rule.findingType
									})
								] }),
								rule.assetId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Asset:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-foreground",
										children: rule.assetId
									})
								] }),
								rule.region && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Region:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: rule.region
									})
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								rule.channels.map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelBadge, { channel: ch }, ch)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground ml-1",
									children: [
										"· ",
										Number(rule.cooldownMinutes),
										" min cooldown"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [
										"·",
										" ",
										rule.escalationMinutes ? `Escalate after ${Number(rule.escalationMinutes)} min${rule.escalationRecipient ? ` to ${rule.escalationRecipient}` : ""}` : "No escalation"
									]
								})
							]
						})
					]
				}, rule.id))
			})
		]
	});
}
function NotificationCenterTab() {
	const { data: logs = [], isLoading } = useNotificationLogs(CUSTOMER, 200);
	const ackMutation = useAcknowledgeNotification();
	const inAppLogs = logs.filter((l) => l.channel === "InApp");
	const unreadLogs = inAppLogs.filter((l) => !l.acknowledged);
	function markAllRead() {
		for (const log of unreadLogs) ackMutation.mutate(log.id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [unreadLogs.length, " unread"]
			}), unreadLogs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				onClick: markAllRead,
				disabled: ackMutation.isPending,
				"data-ocid": "notifications.mark_all_read_button",
				className: "gap-1.5 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { size: 13 }), " Mark All Read"]
			})]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"data-ocid": "notifications.inbox_loading_state",
			className: "space-y-2",
			children: [
				0,
				1,
				2,
				3
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 rounded-lg bg-muted/20 animate-pulse" }, `sk-${i}`))
		}) : inAppLogs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-ocid": "notifications.inbox_empty_state",
			className: "flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/10 py-14 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
					size: 32,
					className: "text-muted-foreground/40"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display font-semibold text-foreground",
					children: "No notifications"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "You're all caught up."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: inAppLogs.map((log, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-ocid": `notifications.inbox.item.${idx + 1}`,
				className: `rounded-lg border p-3.5 flex items-start gap-3 transition-smooth ${!log.acknowledged ? "border-primary/30 bg-primary/5" : "border-border bg-card"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 shrink-0",
						children: !log.acknowledged ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, {
							size: 8,
							className: "fill-primary text-primary"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, {
							size: 8,
							className: "text-border"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0 space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "/alerts",
								className: "text-sm font-medium text-foreground hover:text-primary transition-smooth truncate",
								children: ["Alert #", log.alertId.slice(0, 8)]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelBadge, { channel: log.channel })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Rule:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: log.ruleId.slice(0, 12)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mx-1.5",
									children: "·"
								}),
								relativeTime(log.timestamp)
							]
						})]
					}),
					!log.acknowledged && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						size: "sm",
						className: "shrink-0 text-xs h-7",
						onClick: () => ackMutation.mutate(log.id),
						disabled: ackMutation.isPending,
						"data-ocid": `notifications.inbox.mark_read_button.${idx + 1}`,
						children: "Mark as Read"
					})
				]
			}, log.id))
		})]
	});
}
function NotificationLogTab() {
	const [limit, setLimit] = (0, import_react.useState)(50);
	const { data: logs = [], isLoading } = useNotificationLogs(CUSTOMER, limit);
	const ackMutation = useAcknowledgeNotification();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"data-ocid": "notifications.log_loading_state",
			className: "space-y-1",
			children: [
				0,
				1,
				2,
				3,
				4
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 rounded bg-muted/20 animate-pulse" }, `sk-${i}`))
		}) : logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-ocid": "notifications.log_empty_state",
			className: "flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/10 py-14 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
				size: 32,
				className: "text-muted-foreground/40"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display font-semibold text-foreground",
				children: "No notification history"
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
						children: "Alert ID"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-xs text-muted-foreground w-32",
						children: "Rule"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-xs text-muted-foreground w-24",
						children: "Channel"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-xs text-muted-foreground",
						children: "Recipient"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-xs text-muted-foreground w-28",
						children: "Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-xs text-muted-foreground w-36",
						children: "Acknowledgement"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: logs.map((log, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
				"data-ocid": `notifications.log.item.${idx + 1}`,
				className: "border-border hover:bg-muted/10 transition-smooth",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-xs text-muted-foreground font-mono",
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
						className: "text-xs text-foreground max-w-[160px] truncate",
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
							onClick: () => ackMutation.mutate(log.id),
							disabled: ackMutation.isPending,
							"data-ocid": `notifications.log.acknowledge_button.${idx + 1}`,
							children: "Ack"
						})]
					}) })
				]
			}, log.id)) })] })
		}), logs.length === limit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center pt-1",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				onClick: () => setLimit((l) => l + 50),
				"data-ocid": "notifications.log_load_more_button",
				className: "text-xs",
				children: "Load more"
			})
		})] })
	});
}
function NotificationsPage() {
	const { data: logs = [] } = useNotificationLogs(CUSTOMER, 200);
	const unreadCount = logs.filter((l) => l.channel === "InApp" && !l.acknowledged).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 border border-primary/30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
					size: 18,
					className: "text-primary"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display font-bold text-xl text-foreground",
				children: "Alerting & Notifications"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground font-mono uppercase tracking-wider",
				children: "Alert rules · Notification routing"
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "rules",
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "bg-muted/30 border border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "rules",
							"data-ocid": "notifications.rules_tab",
							className: "text-xs data-[state=active]:bg-card",
							children: "Alert Rules"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "center",
							"data-ocid": "notifications.center_tab",
							className: "text-xs data-[state=active]:bg-card",
							children: ["Notification Center", unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground",
								children: unreadCount
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "log",
							"data-ocid": "notifications.log_tab",
							className: "text-xs data-[state=active]:bg-card",
							children: "Notification Log"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "rules",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertRulesTab, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationCenterTab, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "log",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationLogTab, {})
				})
			]
		})]
	}) });
}
export { NotificationsPage as default };
