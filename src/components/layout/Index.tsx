import { Component, JSX, createEffect, createMemo, createSignal, onMount } from "solid-js";
import { useNavigate, useLocation } from "@solidjs/router";
import { useAuth } from "../../services/authStore";
import { lookupAPI } from "../../services/lookups";
import type { Role } from "../../app/master-data/role/type/role";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import {
  clearNavigationStorage,
  filterReadableMenus,
  getNavigationFromStorage,
  hasReadablePathAccess,
  navigationAPI,
  saveNavigationToStorage,
} from "./navigation";
import type { NavigationItem } from "./navigation";

import "./style.css";

interface LayoutProps {
  children: JSX.Element;
  pageTitle?: string;
}

const Layout: Component<LayoutProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [sidebarDesktopHidden, setSidebarDesktopHidden] = createSignal(false);
  const [navItems, setNavItems] = createSignal<NavigationItem[]>(getNavigationFromStorage());
  const [isNavLoading, setIsNavLoading] = createSignal(false);
  const [navError, setNavError] = createSignal<string | null>(null);
  const [roles, setRoles] = createSignal<Role[]>([]);

  const isActive = (path: string) => location.pathname.startsWith(path);
  const fallbackPath = createMemo(() => navItems().find((item) => item.path)?.path || "/dashboard");

  const fetchNavigation = async () => {
    if (!auth.isAuthenticated()) {
      setNavItems([]);
      clearNavigationStorage();
      return;
    }

    setIsNavLoading(true);
    setNavError(null);

    try {
      const result = await navigationAPI.getMyNavigation();

      if (result.success && result.data) {
        const readableItems = filterReadableMenus(result.data);
        setNavItems(readableItems);
        saveNavigationToStorage(readableItems);
      } else {
        setNavItems([]);
        clearNavigationStorage();
        setNavError(result.error || result.message || "Failed to load navigation");
      }
    } catch (error) {
      setNavItems([]);
      clearNavigationStorage();
      setNavError(
        error instanceof Error ? error.message : "Failed to load navigation",
      );
    } finally {
      setIsNavLoading(false);
    }
  };

  const handleLogout = () => {
    auth.logout();
    clearNavigationStorage();
    navigate("/login");
  };

  onMount(fetchNavigation);

  onMount(async () => {
    try {
      const result = await lookupAPI.getRoles();
      if (result.success && result.data) setRoles(result.data);
    } catch { /* ignore */ }
  });

  const roleName = createMemo(() => {
    const user = auth.user();
    if (!user) return "";
    const role = roles().find((r) => r.id === user.role_id);
    return role?.name || "";
  });

  createEffect(() => {
    if (!auth.isAuthenticated()) return;
    if (isNavLoading() || navError()) return;

    const pathname = location.pathname;
    const protectedAlwaysAllowed = ["/dashboard"];
    const protectedAlwaysAllowedPrefixes = [
      "/dosen/anggota-kelompok",
      "/pembimbing-lapangan/anggota-kelompok",
      "/mahasiswa/laporan",
      "/mahasiswa/penilaian",
      "/instansi",
    ];

    if (protectedAlwaysAllowed.includes(pathname)) return;
    if (protectedAlwaysAllowedPrefixes.some((path) => pathname.startsWith(path))) return;
    if (hasReadablePathAccess(pathname, navItems())) return;

    navigate(fallbackPath(), { replace: true });
  });

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(true);
    } else {
      setSidebarDesktopHidden((prev) => !prev);
    }
  };

  return (
    <div class={`agri-shell ${sidebarDesktopHidden() ? "sidebar-hidden" : ""}`}>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navItems={navItems()}
        isLoading={isNavLoading()}
        error={navError()}
        isActive={isActive}
        onLogout={handleLogout}
      />

      {sidebarOpen() && (
        <div class="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div class="agri-main">
        <Header
          pageTitle={props.pageTitle}
          onMenuClick={toggleSidebar}
          username={auth.user()?.username}
          roleName={roleName()}
          onLogout={handleLogout}
        />

        <main class="agri-content">{props.children}</main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
