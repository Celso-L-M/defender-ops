import { c as require_react, et as __toESM } from "./dist-B87Aq9lc.js";
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/tiny-warning@1.0.3/node_modules/tiny-warning/dist/tiny-warning.esm.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function warning(condition, message) {}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/routerContext.js
var routerContext = import_react.createContext(null);
function getRouterContext() {
	if (typeof document === "undefined") return routerContext;
	if (window.__TSR_ROUTER_CONTEXT__) return window.__TSR_ROUTER_CONTEXT__;
	window.__TSR_ROUTER_CONTEXT__ = routerContext;
	return routerContext;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/useRouter.js
function useRouter(opts) {
	const value = import_react.useContext(getRouterContext());
	opts == null || opts.warn;
	return value;
}
export { getRouterContext as n, warning as r, useRouter as t };
