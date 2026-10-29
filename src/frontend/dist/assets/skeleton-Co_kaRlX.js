import { s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
import { t as cn } from "./utils-Dt9zQ6gD.js";
// src/components/ui/skeleton.tsx
var import_jsx_runtime = require_jsx_runtime();
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "skeleton",
		className: cn("bg-accent animate-pulse rounded-md", className),
		...props
	});
}
export { Skeleton as t };
