/**
 * Auth Routes
 * Route definitions for authentication-related pages
 */

import { Route } from '@solidjs/router';
import LoginPage from './LoginPage';

export const authRoutes = (
  <>
    <Route path="/login" component={LoginPage} />
  </>
);
