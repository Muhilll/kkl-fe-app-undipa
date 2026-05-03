/**
 * Router Configuration
 * Central routing configuration for the application
 */

import { Navigate, Route } from '@solidjs/router';
import { authRoutes } from '../app/auth/routes';
import { dashboardRoutes } from '../app/dashboard/routes';
import { roleRoutes } from '../app/master-data/role/route';
import { userRoutes } from '../app/master-data/user/route';
import { menuRoutes } from '../app/web-management/menu/route';
import { rolePermissionRoutes } from '../app/web-management/role-permission/route';

import Layout from '../components/layout/Index';
import { ParentComponent } from 'solid-js';
/**
 * Layout wrapper for protected routes
 */

const LayoutedRoutes: ParentComponent = (props) => {
  return (
    <Layout>
      {props.children}
    </Layout>
  );
};
/**
 * Configure all application routes
 */
export const routeConfig = (
  <>
    {/* Public Routes */}
    <Route path="/" component={() => <Navigate href="/login" />} />
    {authRoutes}

    {/* Protected Routes with Layout */}
    <Route component={LayoutedRoutes}>
      {dashboardRoutes}
      {menuRoutes}
      {rolePermissionRoutes}
      {roleRoutes}
      {userRoutes}
    </Route>
  </>
);
