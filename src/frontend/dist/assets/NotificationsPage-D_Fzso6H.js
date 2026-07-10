import { r as reactExports, j as jsxRuntimeExports } from "./index-gvVWhVUu.js";
import { B as Badge } from "./badge-pakehWRD.js";
import { B as Button } from "./button-C09HiWh_.js";
import { P as Plus, C as Checkbox, T as Trash2 } from "./checkbox-BVpN4Nu3.js";
import { I as Input } from "./input-ZWwvwxl4.js";
import { L as Label } from "./label-DNWCQ9op.js";
import { u as useId, e as createCollection, f as useDirection, g as useCallbackRef, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-1PEip1P-.js";
import { u as useControllableState, P as Primitive, c as composeEventHandlers, b as usePrevious, d as useSize, e as createContextScope } from "./index-VrD3_g-G.js";
import { u as useComposedRefs, c as cn } from "./utils-B38ds5J5.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-ZOY45ZOf.js";
import { P as Presence } from "./index-BBxfRztn.js";
import { L as Layout, B as Bell } from "./Layout-BwhpjFll.js";
import { c as createLucideIcon, D as useNotificationLogs, E as useAlertRules, F as useSaveAlertRule, G as useDeleteAlertRule, H as useAcknowledgeNotification } from "./use-backend--xAfAcuU.js";
import { S as Shield } from "./shield-SgbJ0st7.js";
import { T as TriangleAlert } from "./triangle-alert-C9nGFClk.js";
import { f as formatDistanceToNow } from "./formatDistanceToNow-BnIgSvnz.js";
import "./search-BO8TdYa9.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742",
      key: "178tsu"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ["path", { d: "M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05", key: "1hqiys" }]
];
const BellOff = createLucideIcon("bell-off", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
  ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
];
const CheckCheck = createLucideIcon("check-check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]];
const Circle = createLucideIcon("circle", __iconNode);
var SWITCH_NAME = "Switch";
var [createSwitchContext] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...switchProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
      caller: SWITCH_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchProvider, { scope: __scopeSwitch, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": checked,
          "aria-required": required,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...switchProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            setChecked((prevChecked) => !prevChecked);
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...thumbProps,
        ref: forwardedRef
      }
    );
  }
);
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = reactExports.forwardRef(
  ({
    __scopeSwitch,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var Root$1 = Switch$1;
var Thumb = SwitchThumb;
function Switch({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root$1,
    {
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Thumb,
        {
          "data-slot": "switch-thumb",
          className: cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] = createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  GROUP_NAME,
  [createCollectionScope]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = reactExports.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection(__scopeRovingFocusGroup);
  const isClickFocusRef = reactExports.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RovingFocusProvider,
    {
      scope: __scopeRovingFocusGroup,
      orientation,
      dir: direction,
      loop,
      currentTabStopId,
      onItemFocus: reactExports.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: reactExports.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
          "data-orientation": orientation,
          ...groupProps,
          ref: composedRefs,
          style: { outline: "none", ...props.style },
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
                const activeItem = items.find((item) => item.active);
                const currentItem = items.find((item) => item.id === currentTabStopId);
                const candidateItems = [activeItem, currentItem, ...items].filter(
                  Boolean
                );
                const candidateNodes = candidateItems.map((item) => item.ref.current);
                focusFirst(candidateNodes, preventScrollOnEntryFocus);
              }
            }
            isClickFocusRef.current = false;
          }),
          onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
        }
      )
    }
  );
});
var ITEM_NAME = "RovingFocusGroupItem";
var RovingFocusGroupItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId,
      children,
      ...itemProps
    } = props;
    const autoId = useId();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
    reactExports.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection.ItemSlot,
      {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
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
                const items = getItems().filter((item) => item.focusable);
                let candidateNodes = items.map((item) => item.ref.current);
                if (focusIntent === "last") candidateNodes.reverse();
                else if (focusIntent === "prev" || focusIntent === "next") {
                  if (focusIntent === "prev") candidateNodes.reverse();
                  const currentIndex = candidateNodes.indexOf(event.currentTarget);
                  candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                }
                setTimeout(() => focusFirst(candidateNodes));
              }
            }),
            children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
          }
        )
      }
    );
  }
);
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
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
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
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
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
      }
    ) });
  }
);
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
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
const CUSTOMER = "default";
const SEVERITY_OPTIONS = [
  { label: "Any Critical", value: "AnyCritical" },
  { label: "Any High+", value: "AnyHigh" },
  { label: "Any Medium+", value: "AnyMedium" },
  { label: "Any Low", value: "AnyLow" },
  { label: "Critical or High", value: "CriticalOrHigh" },
  { label: "All Findings", value: "All" }
];
const CHANNEL_OPTIONS = [
  { label: "In-App", value: "InApp" },
  { label: "Email", value: "Email" },
  { label: "Teams Webhook", value: "TeamsWebhook" }
];
const CHANNEL_COLORS = {
  InApp: "bg-primary/20 text-primary border border-primary/40",
  Email: "bg-chart-2/20 text-chart-2 border border-chart-2/40",
  TeamsWebhook: "bg-accent/20 text-accent-foreground border border-accent/40"
};
const STATUS_COLORS = {
  Sent: "bg-muted/30 text-muted-foreground border border-border",
  Failed: "bg-destructive/20 text-destructive border border-destructive/40",
  Acknowledged: "bg-chart-2/20 text-chart-2 border border-chart-2/40"
};
function relativeTime(ts) {
  try {
    return formatDistanceToNow(new Date(Number(ts / 1000000n)), {
      addSuffix: true
    });
  } catch {
    return "Unknown";
  }
}
function ChannelBadge({ channel }) {
  const label = channel === "TeamsWebhook" ? "Teams" : channel;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide ${CHANNEL_COLORS[channel]}`,
      children: label
    }
  );
}
function StatusBadge({ status }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide ${STATUS_COLORS[status]}`,
      children: status
    }
  );
}
const defaultForm = {
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
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editId, setEditId] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(defaultForm);
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
    saveRule.mutate({ ...rule, enabled: !rule.enabled });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        rules.length,
        " rule",
        rules.length !== 1 ? "s" : "",
        " configured"
      ] }),
      !showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          size: "sm",
          onClick: openCreate,
          "data-ocid": "notifications.create_rule_button",
          className: "gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
            "Create Rule"
          ]
        }
      )
    ] }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "notifications.rule_form",
        className: "rounded-lg border border-border bg-card p-4 space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground", children: editId ? "Edit Rule" : "New Alert Rule" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Rule Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "notifications.rule_name_input",
                  placeholder: "e.g. Critical AWS Alerts",
                  value: form.name,
                  onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
                  className: "bg-background h-8 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  "data-ocid": "notifications.rule_enabled_switch",
                  checked: form.enabled,
                  onCheckedChange: (v) => setForm((f) => ({ ...f, enabled: v }))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Enabled" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Severity Threshold" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.severityThreshold,
                  onValueChange: (v) => setForm((f) => ({
                    ...f,
                    severityThreshold: v
                  })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        "data-ocid": "notifications.severity_threshold_select",
                        className: "bg-background h-8 text-sm",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select threshold" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: SEVERITY_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o.value, children: o.label }, o.value)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Provider (optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.provider,
                  onValueChange: (v) => setForm((f) => ({ ...f, provider: v })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        "data-ocid": "notifications.provider_select",
                        className: "bg-background h-8 text-sm",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Any provider" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "", children: "Any" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AWS", children: "AWS" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Azure", children: "Azure" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "GCP", children: "GCP" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Finding Type (optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "notifications.finding_type_input",
                  placeholder: "e.g. UnauthorizedAccess",
                  value: form.findingType,
                  onChange: (e) => setForm((f) => ({ ...f, findingType: e.target.value })),
                  className: "bg-background h-8 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Asset ID (optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "notifications.asset_id_input",
                  placeholder: "e.g. i-0abc123",
                  value: form.assetId,
                  onChange: (e) => setForm((f) => ({ ...f, assetId: e.target.value })),
                  className: "bg-background h-8 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Region (optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "notifications.region_input",
                  placeholder: "e.g. us-east-1",
                  value: form.region,
                  onChange: (e) => setForm((f) => ({ ...f, region: e.target.value })),
                  className: "bg-background h-8 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Cooldown (minutes)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "notifications.cooldown_input",
                  type: "number",
                  min: 1,
                  value: form.cooldownMinutes,
                  onChange: (e) => setForm((f) => ({
                    ...f,
                    cooldownMinutes: Math.max(1, Number(e.target.value))
                  })),
                  className: "bg-background h-8 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Escalate after (minutes, optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
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
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Escalation Recipient (optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "notifications.escalation_recipient_input",
                  placeholder: "email or username",
                  value: form.escalationRecipient,
                  onChange: (e) => setForm((f) => ({
                    ...f,
                    escalationRecipient: e.target.value
                  })),
                  className: "bg-background h-8 text-sm"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Notification Channels *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-4", children: CHANNEL_OPTIONS.map((ch) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: `channel-${ch.value}`,
                className: "flex items-center gap-2 cursor-pointer select-none",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Checkbox,
                    {
                      id: `channel-${ch.value}`,
                      "data-ocid": `notifications.channel_${ch.value.toLowerCase()}_checkbox`,
                      checked: form.channels.includes(ch.value),
                      onCheckedChange: () => toggleChannel(ch.value)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: ch.label })
                ]
              },
              ch.value
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                onClick: handleSave,
                disabled: saveRule.isPending || !form.name.trim() || form.channels.length === 0,
                "data-ocid": "notifications.save_rule_button",
                children: saveRule.isPending ? "Saving…" : "Save Rule"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                onClick: cancel,
                "data-ocid": "notifications.cancel_rule_button",
                children: "Cancel"
              }
            )
          ] })
        ]
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "notifications.rules_loading_state",
        className: "space-y-2",
        children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-20 rounded-lg bg-muted/20 animate-pulse"
          },
          `sk-${i}`
        ))
      }
    ) : rules.length === 0 && !showForm ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "notifications.rules_empty_state",
        className: "flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/10 py-14 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { size: 32, className: "text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground", children: "No alert rules yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: "Create a rule to start routing notifications to your team." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              onClick: openCreate,
              className: "mt-1 gap-1.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
                " Create Rule"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: rules.map((rule, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": `notifications.rule.item.${idx + 1}`,
        className: "rounded-lg border border-border bg-card p-4 space-y-2 hover:border-border/80 transition-smooth",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  "data-ocid": `notifications.rule.toggle.${idx + 1}`,
                  checked: rule.enabled,
                  onCheckedChange: () => handleToggleEnabled(rule),
                  "aria-label": `Toggle rule ${rule.name}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm text-foreground truncate", children: rule.name }),
              !rule.enabled && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs shrink-0", children: "Disabled" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "icon",
                  className: "h-7 w-7",
                  onClick: () => openEdit(rule),
                  "data-ocid": `notifications.rule.edit_button.${idx + 1}`,
                  "aria-label": "Edit rule",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 13 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "icon",
                  className: "h-7 w-7 text-destructive hover:text-destructive",
                  onClick: () => deleteRule.mutate(rule.id),
                  "data-ocid": `notifications.rule.delete_button.${idx + 1}`,
                  "aria-label": "Delete rule",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground", children: [
            rule.severityThreshold && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Severity:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: rule.severityThreshold })
            ] }),
            rule.provider && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Provider:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: rule.provider })
            ] }),
            rule.findingType && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Type:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: rule.findingType })
            ] }),
            rule.assetId && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Asset:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: rule.assetId })
            ] }),
            rule.region && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Region:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: rule.region })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            rule.channels.map((ch) => /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelBadge, { channel: ch }, ch)),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-1", children: [
              "· ",
              Number(rule.cooldownMinutes),
              " min cooldown"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "·",
              " ",
              rule.escalationMinutes ? `Escalate after ${Number(rule.escalationMinutes)} min${rule.escalationRecipient ? ` to ${rule.escalationRecipient}` : ""}` : "No escalation"
            ] })
          ] })
        ]
      },
      rule.id
    )) })
  ] });
}
function NotificationCenterTab() {
  const { data: logs = [], isLoading } = useNotificationLogs(CUSTOMER, 200);
  const ackMutation = useAcknowledgeNotification();
  const inAppLogs = logs.filter((l) => l.channel === "InApp");
  const unreadLogs = inAppLogs.filter((l) => !l.acknowledged);
  function markAllRead() {
    for (const log of unreadLogs) {
      ackMutation.mutate(log.id);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        unreadLogs.length,
        " unread"
      ] }),
      unreadLogs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: markAllRead,
          disabled: ackMutation.isPending,
          "data-ocid": "notifications.mark_all_read_button",
          className: "gap-1.5 text-xs",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { size: 13 }),
            " Mark All Read"
          ]
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "notifications.inbox_loading_state",
        className: "space-y-2",
        children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-16 rounded-lg bg-muted/20 animate-pulse"
          },
          `sk-${i}`
        ))
      }
    ) : inAppLogs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "notifications.inbox_empty_state",
        className: "flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/10 py-14 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 32, className: "text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground", children: "No notifications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "You're all caught up." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: inAppLogs.map((log, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": `notifications.inbox.item.${idx + 1}`,
        className: `rounded-lg border p-3.5 flex items-start gap-3 transition-smooth ${!log.acknowledged ? "border-primary/30 bg-primary/5" : "border-border bg-card"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 shrink-0", children: !log.acknowledged ? /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { size: 8, className: "fill-primary text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { size: 8, className: "text-border" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: "/alerts",
                  className: "text-sm font-medium text-foreground hover:text-primary transition-smooth truncate",
                  children: [
                    "Alert #",
                    log.alertId.slice(0, 8)
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelBadge, { channel: log.channel })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Rule:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: log.ruleId.slice(0, 12) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1.5", children: "·" }),
              relativeTime(log.timestamp)
            ] })
          ] }),
          !log.acknowledged && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              className: "shrink-0 text-xs h-7",
              onClick: () => ackMutation.mutate(log.id),
              disabled: ackMutation.isPending,
              "data-ocid": `notifications.inbox.mark_read_button.${idx + 1}`,
              children: "Mark as Read"
            }
          )
        ]
      },
      log.id
    )) })
  ] });
}
function NotificationLogTab() {
  const [limit, setLimit] = reactExports.useState(50);
  const { data: logs = [], isLoading } = useNotificationLogs(CUSTOMER, limit);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "notifications.log_loading_state", className: "space-y-1", children: [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "h-10 rounded bg-muted/20 animate-pulse"
    },
    `sk-${i}`
  )) }) : logs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "notifications.log_empty_state",
      className: "flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/10 py-14 text-center",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 32, className: "text-muted-foreground/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground", children: "No notification history" })
      ]
    }
  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border bg-muted/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground w-32", children: "Timestamp" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground w-32", children: "Alert ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground w-32", children: "Rule" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground w-24", children: "Channel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground", children: "Recipient" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground w-28", children: "Status" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: logs.map((log, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TableRow,
        {
          "data-ocid": `notifications.log.item.${idx + 1}`,
          className: "border-border hover:bg-muted/10 transition-smooth",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-muted-foreground font-mono", children: relativeTime(log.timestamp) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: "/alerts",
                className: "text-xs font-mono text-primary hover:underline",
                children: [
                  log.alertId.slice(0, 10),
                  "…"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-xs font-mono text-muted-foreground", children: [
              log.ruleId.slice(0, 10),
              "…"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              ChannelBadge,
              {
                channel: log.channel
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-foreground max-w-[160px] truncate", children: log.recipient }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: log.status }) })
          ]
        },
        log.id
      )) })
    ] }) }),
    logs.length === limit && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: () => setLimit((l) => l + 50),
        "data-ocid": "notifications.log_load_more_button",
        className: "text-xs",
        children: "Load more"
      }
    ) })
  ] }) });
}
function NotificationsPage() {
  const { data: logs = [] } = useNotificationLogs(CUSTOMER, 200);
  const unreadCount = logs.filter(
    (l) => l.channel === "InApp" && !l.acknowledged
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 border border-primary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 18, className: "text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl text-foreground", children: "Alerting & Notifications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono uppercase tracking-wider", children: "Alert rules · Notification routing" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "rules", className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "bg-muted/30 border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsTrigger,
          {
            value: "rules",
            "data-ocid": "notifications.rules_tab",
            className: "text-xs data-[state=active]:bg-card",
            children: "Alert Rules"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "center",
            "data-ocid": "notifications.center_tab",
            className: "text-xs data-[state=active]:bg-card",
            children: [
              "Notification Center",
              unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground", children: unreadCount })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsTrigger,
          {
            value: "log",
            "data-ocid": "notifications.log_tab",
            className: "text-xs data-[state=active]:bg-card",
            children: "Notification Log"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "rules", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertRulesTab, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationCenterTab, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "log", children: /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationLogTab, {}) })
    ] })
  ] }) });
}
export {
  NotificationsPage as default
};
