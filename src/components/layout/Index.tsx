import { Component, JSX, createEffect, createMemo, createSignal, onMount } from "solid-js";
import { useNavigate, useLocation } from "@solidjs/router";
import { useAuth } from "../../services/authStore";

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
  const [navItems, setNavItems] = createSignal<NavigationItem[]>(getNavigationFromStorage());
  const [isNavLoading, setIsNavLoading] = createSignal(false);
  const [navError, setNavError] = createSignal<string | null>(null);

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

  createEffect(() => {
    if (!auth.isAuthenticated()) return;
    if (isNavLoading() || navError()) return;

    const pathname = location.pathname;
    const protectedAlwaysAllowed = ["/dashboard"];

    if (protectedAlwaysAllowed.includes(pathname)) return;
    if (hasReadablePathAccess(pathname, navItems())) return;

    navigate(fallbackPath(), { replace: true });
  });

  return (
    <div class="agri-shell">
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
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main class="agri-content">{props.children}</main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
