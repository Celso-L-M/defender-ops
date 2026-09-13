import "@testing-library/jest-dom/vitest";
import { configure } from "@testing-library/react";

// The generated components use `data-ocid` as their test id attribute.
configure({ testIdAttribute: "data-ocid" });
