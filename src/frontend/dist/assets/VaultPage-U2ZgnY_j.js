import { j as jsxRuntimeExports, r as reactExports, R as React } from "./index-CmSiIXAi.js";
import { c as composeEventHandlers, e as createSlottable, a as createContextScope } from "./index-CziiyC1b.js";
import { u as useComposedRefs, c as cn } from "./utils-BQL5tKpt.js";
import { R as Root, W as WarningProvider, C as Content, T as Title, D as Description, a as Close, c as createDialogScope, P as Portal, O as Overlay, b as Trigger } from "./index-f-pxu39w.js";
import { b as buttonVariants, B as Button } from "./button-DxXmQYy1.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-D61gFL1h.js";
import { I as Input } from "./input-COH4aQv5.js";
import { L as Label } from "./label-CsaknDBr.js";
import { S as Skeleton } from "./skeleton-BifbNGmV.js";
import { u as ue } from "./index-nahJUUdu.js";
import { L as Layout, b as Lock, c as ScrollText, S as ShieldAlert } from "./Layout-DSnUumzH.js";
import { P as ProviderIcon } from "./ProviderIcon-DuMT2Dc6.js";
import { c as createLucideIcon, R as useListVaultSecrets, S as useRevealVaultSecret, T as useDeleteVaultSecret, v as useAuditLog, U as useSaveVaultSecret, V as useUpdateVaultSecret } from "./use-backend-qlJEk42r.js";
import { P as Plus, T as Trash2 } from "./trash-2-6wDluCkg.js";
import { E as EyeOff } from "./eye-off-CCxrdn7b.js";
import { L as LoaderCircle } from "./loader-circle-CrazMaUV.js";
import { E as Eye } from "./eye-0jIgAMYJ.js";
import "./Combination-BO7TVYEP.js";
import "./index-AUpSpOMS.js";
import "./x-BfFmw1gQ.js";
import "./shield-tKdJ0jHt.js";
import "./shield-check-sUyafmt6.js";
import "./search-DMLdUJq7.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
      key: "1s6t7t"
    }
  ],
  ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor", key: "w0ekpg" }]
];
const KeyRound = createLucideIcon("key-round", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode);
var ROOT_NAME = "AlertDialog";
var [createAlertDialogContext] = createContextScope(ROOT_NAME, [
  createDialogScope
]);
var useDialogScope = createDialogScope();
var AlertDialog$1 = (props) => {
  const { __scopeAlertDialog, ...alertDialogProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ...dialogScope, ...alertDialogProps, modal: true });
};
AlertDialog$1.displayName = ROOT_NAME;
var TRIGGER_NAME = "AlertDialogTrigger";
var AlertDialogTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...triggerProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { ...dialogScope, ...triggerProps, ref: forwardedRef });
  }
);
AlertDialogTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "AlertDialogPortal";
var AlertDialogPortal$1 = (props) => {
  const { __scopeAlertDialog, ...portalProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { ...dialogScope, ...portalProps });
};
AlertDialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "AlertDialogOverlay";
var AlertDialogOverlay$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...overlayProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, { ...dialogScope, ...overlayProps, ref: forwardedRef });
  }
);
AlertDialogOverlay$1.displayName = OVERLAY_NAME;
var CONTENT_NAME = "AlertDialogContent";
var [AlertDialogContentProvider, useAlertDialogContentContext] = createAlertDialogContext(CONTENT_NAME);
var Slottable = createSlottable("AlertDialogContent");
var AlertDialogContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, children, ...contentProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const cancelRef = reactExports.useRef(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      WarningProvider,
      {
        contentName: CONTENT_NAME,
        titleName: TITLE_NAME,
        docsSlug: "alert-dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogContentProvider, { scope: __scopeAlertDialog, cancelRef, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Content,
          {
            role: "alertdialog",
            ...dialogScope,
            ...contentProps,
            ref: composedRefs,
            onOpenAutoFocus: composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
              var _a;
              event.preventDefault();
              (_a = cancelRef.current) == null ? void 0 : _a.focus({ preventScroll: true });
            }),
            onPointerDownOutside: (event) => event.preventDefault(),
            onInteractOutside: (event) => event.preventDefault(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Slottable, { children }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, { contentRef })
            ]
          }
        ) })
      }
    );
  }
);
AlertDialogContent$1.displayName = CONTENT_NAME;
var TITLE_NAME = "AlertDialogTitle";
var AlertDialogTitle$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...titleProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { ...dialogScope, ...titleProps, ref: forwardedRef });
  }
);
AlertDialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "AlertDialogDescription";
var AlertDialogDescription$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, ...descriptionProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { ...dialogScope, ...descriptionProps, ref: forwardedRef });
});
AlertDialogDescription$1.displayName = DESCRIPTION_NAME;
var ACTION_NAME = "AlertDialogAction";
var AlertDialogAction$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...actionProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...actionProps, ref: forwardedRef });
  }
);
AlertDialogAction$1.displayName = ACTION_NAME;
var CANCEL_NAME = "AlertDialogCancel";
var AlertDialogCancel$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...cancelProps } = props;
    const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME, __scopeAlertDialog);
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const ref = useComposedRefs(forwardedRef, cancelRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...cancelProps, ref });
  }
);
AlertDialogCancel$1.displayName = CANCEL_NAME;
var DescriptionWarning = ({ contentRef }) => {
  const MESSAGE = `\`${CONTENT_NAME}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${CONTENT_NAME}\` by passing a \`${DESCRIPTION_NAME}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${CONTENT_NAME}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;
  reactExports.useEffect(() => {
    var _a;
    const hasDescription = document.getElementById(
      (_a = contentRef.current) == null ? void 0 : _a.getAttribute("aria-describedby")
    );
    if (!hasDescription) console.warn(MESSAGE);
  }, [MESSAGE, contentRef]);
  return null;
};
var Root2 = AlertDialog$1;
var Portal2 = AlertDialogPortal$1;
var Overlay2 = AlertDialogOverlay$1;
var Content2 = AlertDialogContent$1;
var Action = AlertDialogAction$1;
var Cancel = AlertDialogCancel$1;
var Title2 = AlertDialogTitle$1;
var Description2 = AlertDialogDescription$1;
function AlertDialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay2,
    {
      "data-slot": "alert-dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function AlertDialogContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Content2,
      {
        "data-slot": "alert-dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props
      }
    )
  ] });
}
function AlertDialogHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function AlertDialogFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function AlertDialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title2,
    {
      "data-slot": "alert-dialog-title",
      className: cn("text-lg font-semibold", className),
      ...props
    }
  );
}
function AlertDialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Description2,
    {
      "data-slot": "alert-dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function AlertDialogAction({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Action,
    {
      className: cn(buttonVariants(), className),
      ...props
    }
  );
}
function AlertDialogCancel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Cancel,
    {
      className: cn(buttonVariants({ variant: "outline" }), className),
      ...props
    }
  );
}
const PROVIDERS = ["AWS", "Azure", "GCP"];
const providerAccent = {
  AWS: "provider-aws",
  Azure: "provider-azure",
  GCP: "provider-gcp"
};
function timestampToDate(ts) {
  const date = new Date(Number(ts / 1000000n));
  return Number.isNaN(date.getTime()) ? null : date;
}
function formatTimestamp(ts) {
  const d = timestampToDate(ts);
  if (!d) return "—";
  return d.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatAuditTime(ts) {
  const d = timestampToDate(ts);
  if (!d) return "—";
  return d.toLocaleString([], {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
function maskValue() {
  return "••••••••••••";
}
function SecretValueCell({
  entry,
  revealed,
  onReveal,
  isRevealing
}) {
  if (revealed !== null) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "secret-revealed text-xs",
        "data-ocid": "vault.secret_revealed",
        children: revealed
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "secret-masked text-xs", "data-ocid": "vault.secret_masked", children: maskValue() }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": "vault.reveal_button",
        onClick: onReveal,
        disabled: isRevealing,
        className: "secret-reveal-toggle inline-flex items-center gap-1",
        "aria-label": `Reveal secret ${entry.name}`,
        children: [
          isRevealing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 10, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 10 }),
          "Reveal"
        ]
      }
    )
  ] });
}
function SecretFormDialog({
  open,
  onOpenChange,
  editing,
  defaultProvider
}) {
  const save = useSaveVaultSecret();
  const update = useUpdateVaultSecret();
  const [provider, setProvider] = reactExports.useState(defaultProvider);
  const [name, setName] = reactExports.useState("");
  const [value, setValue] = reactExports.useState("");
  React.useEffect(() => {
    if (open) {
      setProvider((editing == null ? void 0 : editing.provider) ?? defaultProvider);
      setName((editing == null ? void 0 : editing.name) ?? "");
      setValue("");
    }
  }, [open, editing, defaultProvider]);
  const isEditing = editing !== null;
  const pending = save.isPending || update.isPending;
  const canSubmit = name.trim().length > 0 && value.trim().length > 0;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedValue = value.trim();
    if (!trimmedName || !trimmedValue) return;
    try {
      if (isEditing) {
        await update.mutateAsync({
          provider: editing.provider,
          name: trimmedName,
          value: trimmedValue
        });
        ue.success(`Secret "${trimmedName}" updated`);
      } else {
        await save.mutateAsync({
          provider,
          name: trimmedName,
          value: trimmedValue
        });
        ue.success(`Secret "${trimmedName}" saved`);
      }
      onOpenChange(false);
    } catch (err) {
      const kind = typeof err === "object" && err !== null && "err" in err ? err.err.__kind__ ?? "" : "";
      if (kind === "AlreadyExists") {
        ue.error(`A secret named "${trimmedName}" already exists`);
      } else if (kind === "InvalidName") {
        ue.error("That secret name is not valid");
      } else if (kind === "NotAuthorized") {
        ue.error("You do not have access to this provider's vault");
      } else {
        ue.error(
          isEditing ? "Failed to update secret" : "Failed to save secret"
        );
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "vault.secret_dialog", className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: isEditing ? "Edit Secret" : "Add Secret" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: isEditing ? `Update the value of "${editing.name}". The new value is encrypted at rest.` : "Store an arbitrary named secret (API key, token, password, service account JSON) for a provider." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "vault-provider",
            className: "text-xs text-muted-foreground uppercase tracking-wider",
            children: "Provider"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: PROVIDERS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": `vault.provider_option.${p.toLowerCase()}`,
            disabled: isEditing,
            onClick: () => setProvider(p),
            className: `${providerAccent[p]} flex items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-xs font-mono font-semibold transition-colors ${provider === p ? "nav-provider-active border-border" : "border-border text-muted-foreground hover:bg-muted/40"} ${isEditing ? "opacity-60 cursor-not-allowed" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderIcon, { provider: p, showLabel: false }),
              p
            ]
          },
          p
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "vault-name",
            className: "text-xs text-muted-foreground uppercase tracking-wider",
            children: "Secret Name"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "vault-name",
            "data-ocid": "vault.name_input",
            placeholder: "e.g. prod-stripe-api-key",
            className: "font-mono",
            value: name,
            disabled: isEditing,
            onChange: (e) => setName(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "vault-value",
            className: "text-xs text-muted-foreground uppercase tracking-wider",
            children: "Secret Value"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "vault-value",
            "data-ocid": "vault.value_input",
            placeholder: "Enter the secret value",
            className: "font-mono",
            type: "password",
            value,
            onChange: (e) => setValue(e.target.value)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Encrypted at rest. Never shown in list views." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            "data-ocid": "vault.cancel_button",
            onClick: () => onOpenChange(false),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "submit",
            size: "sm",
            "data-ocid": "vault.save_button",
            disabled: pending || !canSubmit,
            children: [
              pending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 13, className: "animate-spin mr-1.5" }),
              isEditing ? "Save Changes" : "Add Secret"
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
function ProviderVaultPanel({ provider }) {
  const { data: secrets, isLoading } = useListVaultSecrets(provider);
  const reveal = useRevealVaultSecret();
  const deleteSecret = useDeleteVaultSecret();
  const [revealed, setRevealed] = reactExports.useState({});
  const [revealing, setRevealing] = reactExports.useState({});
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [deleting, setDeleting] = reactExports.useState(null);
  const key = (name) => `${provider}:${name}`;
  const handleReveal = async (entry) => {
    const k = key(entry.name);
    setRevealing((prev) => ({ ...prev, [k]: true }));
    try {
      const value = await reveal.mutateAsync({
        provider: entry.provider,
        name: entry.name
      });
      setRevealed((prev) => ({ ...prev, [k]: value }));
    } catch {
      ue.error("Unable to reveal secret — check your provider access");
    } finally {
      setRevealing((prev) => ({ ...prev, [k]: false }));
    }
  };
  const handleHide = (entry) => {
    const k = key(entry.name);
    setRevealed((prev) => {
      const next = { ...prev };
      delete next[k];
      return next;
    });
  };
  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteSecret.mutateAsync({
        provider: deleting.provider,
        name: deleting.name
      });
      ue.success(`Secret "${deleting.name}" deleted`);
      setDeleting(null);
    } catch {
      ue.error("Failed to delete secret");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `vault.panel.${provider.toLowerCase()}`,
      className: "vault-shell",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 px-5 py-4 border-b border-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 16, className: "vault-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-base font-bold text-foreground", children: [
              provider,
              " Vault"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-vault", children: "Encrypted" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              "data-ocid": "vault.add_button",
              onClick: () => {
                setEditing(null);
                setDialogOpen(true);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "mr-1.5" }),
                "Add Secret"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left data-dense", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Secret Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Provider" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Last Updated" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Secret Value" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? Array.from({ length: 4 }, (_, i) => `skeleton-${i}`).map((id) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20 ml-auto" }) })
          ] }, id)) : secrets && secrets.length > 0 ? secrets.map((entry, idx) => {
            const k = key(entry.name);
            const isRevealed = revealed[k] !== void 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                "data-ocid": `vault.row.${idx + 1}`,
                className: "border-b border-border/30 hover:bg-muted/10 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 font-mono text-xs font-medium text-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { size: 12, className: "vault-accent" }),
                    entry.name
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `${providerAccent[entry.provider]} inline-flex`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderIcon, { provider: entry.provider })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2.5 font-mono text-[11px] text-muted-foreground", children: formatTimestamp(entry.updatedAt) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SecretValueCell,
                    {
                      entry,
                      revealed: isRevealed ? revealed[k] : null,
                      onReveal: () => handleReveal(entry),
                      isRevealing: !!revealing[k]
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                    isRevealed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "vault.hide_button",
                        onClick: () => handleHide(entry),
                        className: "secret-reveal-toggle inline-flex items-center gap-1",
                        "aria-label": `Hide secret ${entry.name}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 10 }),
                          "Hide"
                        ]
                      }
                    ) : null,
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "vault.edit_button",
                        onClick: () => {
                          setEditing(entry);
                          setDialogOpen(true);
                        },
                        className: "inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-mono text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors",
                        "aria-label": `Edit secret ${entry.name}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 11 }),
                          "Edit"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "vault.delete_button",
                        onClick: () => setDeleting(entry),
                        className: "inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-mono text-destructive hover:bg-destructive/10 transition-colors",
                        "aria-label": `Delete secret ${entry.name}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 11 }),
                          "Delete"
                        ]
                      }
                    )
                  ] }) })
                ]
              },
              k
            );
          }) : /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-5 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "vault.empty_state",
              className: "flex flex-col items-center justify-center text-center",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 28, className: "vault-accent mb-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-sm font-semibold text-foreground", children: [
                  "No secrets stored for ",
                  provider
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 max-w-sm", children: "Add API keys, tokens, passwords, or service account JSON. Values are encrypted at rest and masked by default." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    "data-ocid": "vault.empty_add_button",
                    className: "mt-4",
                    onClick: () => {
                      setEditing(null);
                      setDialogOpen(true);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "mr-1.5" }),
                      "Add Secret"
                    ]
                  }
                )
              ]
            }
          ) }) }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SecretFormDialog,
          {
            open: dialogOpen,
            onOpenChange: setDialogOpen,
            editing,
            defaultProvider: provider
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialog,
          {
            open: deleting !== null,
            onOpenChange: (o) => !o && setDeleting(null),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "vault.delete_dialog", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display", children: "Delete secret?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                  'This permanently deletes "',
                  deleting == null ? void 0 : deleting.name,
                  '" from the',
                  " ",
                  deleting == null ? void 0 : deleting.provider,
                  " vault. This action is recorded in the audit log and cannot be undone."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogCancel,
                  {
                    "data-ocid": "vault.delete_cancel_button",
                    onClick: () => setDeleting(null),
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  AlertDialogAction,
                  {
                    "data-ocid": "vault.delete_confirm_button",
                    onClick: handleDelete,
                    className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                    children: [
                      deleteSecret.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 13, className: "animate-spin mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13, className: "mr-1.5" }),
                      "Delete"
                    ]
                  }
                )
              ] })
            ] })
          }
        )
      ]
    }
  );
}
function AuditLogSection() {
  const { data: entries, isLoading } = useAuditLog("", 50);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "vault.audit_log", className: "vault-shell", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 px-5 py-4 border-b border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollText, { size: 16, className: "vault-accent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground", children: "Audit Log" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-vault", children: "Read-only" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: Array.from({ length: 4 }, (_, i) => `audit-skeleton-${i}`).map(
      (id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-full" }, id)
    ) }) : entries && entries.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5", children: entries.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "li",
      {
        "data-ocid": `vault.audit_item.${idx + 1}`,
        className: "flex items-start gap-3 rounded-md border border-border/40 bg-card/40 px-3 py-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ShieldAlert,
            {
              size: 13,
              className: "vault-accent mt-0.5 shrink-0"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold", children: entry.actorId }),
              " ",
              entry.action
            ] }),
            entry.details && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] text-muted-foreground truncate", children: entry.details })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground shrink-0", children: formatAuditTime(entry.timestamp) })
        ]
      },
      entry.id
    )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center py-4", children: "No vault activity recorded yet." }) })
  ] });
}
function VaultPage() {
  const [activeProvider, setActiveProvider] = reactExports.useState("AWS");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "vault.page", className: "space-y-6 max-w-5xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground tracking-tight", children: "Cloud Vault" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Centralized per-provider secret storage. Values are masked by default and revealed only on demand." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-vault mt-1", children: "Encrypted at rest" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "vault.provider_tabs", className: "grid grid-cols-3 gap-2", children: PROVIDERS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": `vault.provider_tab.${p.toLowerCase()}`,
        onClick: () => setActiveProvider(p),
        className: `${providerAccent[p]} flex items-center justify-center gap-2 rounded-lg border px-4 py-3 font-mono text-sm font-semibold transition-smooth ${activeProvider === p ? "nav-provider-active border-border" : "border-border bg-card text-muted-foreground hover:bg-muted/40 hover:text-foreground"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderIcon, { provider: p, showLabel: false }),
          p
        ]
      },
      p
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderVaultPanel, { provider: activeProvider }, activeProvider),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AuditLogSection, {})
  ] }) });
}
export {
  VaultPage as default
};
