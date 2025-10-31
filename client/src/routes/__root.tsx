import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  // Auth is initialized in App.tsx before RouterProvider renders
  // This ensures auth state is ready before any route components mount
  
  // No ProtectedRouteGuard or MainLayout here - they're applied per route
  // Public routes (sign_in, sign_up) don't need protection or layout
  // Protected routes will wrap themselves with ProtectedRouteGuard + MainLayout
  return <Outlet />;
}
 