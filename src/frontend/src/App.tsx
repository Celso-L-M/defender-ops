import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import React, { Suspense } from "react";
import { LoadingSpinner } from "./components/LoadingSpinner";

const CloudSettingsPage = React.lazy(() => import("./pages/CloudSettingsPage"));
const RawFindingsPage = React.lazy(() => import("./pages/RawFindingsPage"));
const CompliancePage = React.lazy(() => import("./pages/CompliancePage"));
const AssetsPage = React.lazy(() => import("./pages/AssetsPage"));
const AssetDetailPage = React.lazy(() => import("./pages/AssetDetailPage"));
const AlertsPage = React.lazy(() => import("./pages/AlertsPage"));
const NotificationsPage = React.lazy(() => import("./pages/NotificationsPage"));
const AuditLogPage = React.lazy(() => import("./pages/AuditLogPage"));
const FailedIngestionPage = React.lazy(
  () => import("./pages/FailedIngestionPage"),
);
const CorrelationPage = React.lazy(() => import("./pages/CorrelationPage"));
const ReportsPage = React.lazy(() => import("./pages/ReportsPage"));
const ProviderOverviewPage = React.lazy(
  () => import("./pages/ProviderOverviewPage"),
);
const AwsDashboardPage = React.lazy(() => import("./pages/AwsDashboardPage"));
const AzureDashboardPage = React.lazy(
  () => import("./pages/AzureDashboardPage"),
);
const GcpDashboardPage = React.lazy(() => import("./pages/GcpDashboardPage"));
const ProviderAccessPage = React.lazy(
  () => import("./pages/ProviderAccessPage"),
);

const rootRoute = createRootRoute();

const overviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<LoadingSpinner className="h-screen" size={32} />}>
      <ProviderOverviewPage />
    </Suspense>
  ),
});

const awsDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/providers/aws",
  component: () => (
    <Suspense fallback={<LoadingSpinner className="h-screen" size={32} />}>
      <AwsDashboardPage />
    </Suspense>
  ),
});

const azureDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/providers/azure",
  component: () => (
    <Suspense fallback={<LoadingSpinner className="h-screen" size={32} />}>
      <AzureDashboardPage />
    </Suspense>
  ),
});

const gcpDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/providers/gcp",
  component: () => (
    <Suspense fallback={<LoadingSpinner className="h-screen" size={32} />}>
      <GcpDashboardPage />
    </Suspense>
  ),
});

const providerAccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/provider-access",
  component: () => (
    <Suspense fallback={<LoadingSpinner className="h-screen" size={32} />}>
      <ProviderAccessPage />
    </Suspense>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <Suspense fallback={<LoadingSpinner className="h-screen" size={32} />}>
      <CloudSettingsPage />
    </Suspense>
  ),
});

const findingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/findings",
  component: () => (
    <Suspense fallback={<LoadingSpinner className="h-screen" size={32} />}>
      <RawFindingsPage />
    </Suspense>
  ),
});
const complianceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/compliance",
  component: () => (
    <Suspense fallback={<LoadingSpinner className="h-screen" size={32} />}>
      <CompliancePage />
    </Suspense>
  ),
});

const assetsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/assets",
  component: () => (
    <Suspense fallback={<LoadingSpinner className="h-screen" size={32} />}>
      <AssetsPage />
    </Suspense>
  ),
});

const assetDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/assets/$assetId",
  component: () => (
    <Suspense fallback={<LoadingSpinner className="h-screen" size={32} />}>
      <AssetDetailPage />
    </Suspense>
  ),
});

const alertsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/alerts",
  component: () => (
    <Suspense fallback={<LoadingSpinner className="h-screen" size={32} />}>
      <AlertsPage />
    </Suspense>
  ),
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: () => (
    <Suspense fallback={<LoadingSpinner className="h-screen" size={32} />}>
      <NotificationsPage />
    </Suspense>
  ),
});

const auditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/audit",
  component: () => (
    <Suspense fallback={<LoadingSpinner className="h-screen" size={32} />}>
      <AuditLogPage />
    </Suspense>
  ),
});

const failedIngestionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/failed-ingestions",
  component: () => (
    <Suspense fallback={<LoadingSpinner className="h-screen" size={32} />}>
      <FailedIngestionPage />
    </Suspense>
  ),
});

const correlationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/correlation",
  component: () => (
    <Suspense fallback={<LoadingSpinner className="h-screen" size={32} />}>
      <CorrelationPage />
    </Suspense>
  ),
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  component: () => (
    <Suspense fallback={<LoadingSpinner className="h-screen" size={32} />}>
      <ReportsPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  overviewRoute,
  awsDashboardRoute,
  azureDashboardRoute,
  gcpDashboardRoute,
  providerAccessRoute,
  settingsRoute,
  findingsRoute,
  complianceRoute,
  assetsRoute,
  assetDetailRoute,
  alertsRoute,
  notificationsRoute,
  auditRoute,
  failedIngestionRoute,
  correlationRoute,
  reportsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
