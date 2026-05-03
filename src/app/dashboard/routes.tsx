/**
 * Dashboard Routes
 * Route definitions for dashboard-related pages
 */

import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import ProtectedPage from '../../router/ProtectedRoute';
const DashboardPage = lazy(() => import('./DashboardPage'));

export const dashboardRoutes = (
  <>
    <Route path="/dashboard" component={() => <ProtectedPage><DashboardPage /></ProtectedPage>} />
  </>
);
