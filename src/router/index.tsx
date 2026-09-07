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
import { jurusanRoutes } from '../app/master-data/jurusan/route';
import { mahasiswaRoutes } from '../app/master-data/mahasiswa/route';
import { dosenRoutes } from '../app/master-data/dosen/route';
import { instansiRoutes } from '../app/kkl-management/instansi/route';
import { pembimbingLapanganRoutes } from '../app/kkl-management/pembimbing-lapangan/route';
import { kklPeriodeRoutes } from '../app/kkl-management/kkl-periode/route';
import { kklKlpRoutes } from '../app/kkl-management/kkl-klp/route';
import { kklAgtRoutes } from '../app/kkl-management/kkl-agt/route';
import { laporanRoutes } from '../app/kkl-management/laporan/route';
import { penilaianRoutes } from '../app/kkl-management/penilaian/route';
import { dosenAreaRoutes } from '../app/dosen/route';
import { pembimbingLapanganAreaRoutes } from '../app/pembimbing-lapangan/route';
import { mahasiswaLaporanRoutes } from '../app/mahasiswa/laporan/route';
import { mahasiswaPenilaianRoutes } from '../app/mahasiswa/penilaian/route';
import { publicInstansiRoutes } from '../app/instansi/route';
import { surveyRoutes } from '../app/surveys/route';
import { susKklAppRoutes } from '../app/sus-kkl-app/route';

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
      {jurusanRoutes}
      {mahasiswaRoutes}
      {dosenRoutes}
      {instansiRoutes}
      {pembimbingLapanganRoutes}
      {kklPeriodeRoutes}
      {kklKlpRoutes}
      {kklAgtRoutes}
      {laporanRoutes}
      {penilaianRoutes}
      {dosenAreaRoutes}
      {pembimbingLapanganAreaRoutes}
      {mahasiswaLaporanRoutes}
      {mahasiswaPenilaianRoutes}
      {publicInstansiRoutes}
      {surveyRoutes}
      {susKklAppRoutes}
    </Route>
  </>
);
