import { Component, For, Show, createMemo, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import type { NavigationItem } from "./navigation";

interface SidebarProps {
  sidebarOpen: () => boolean;
  setSidebarOpen: (v: boolean) => void;
  navItems: NavigationItem[];
  isLoading: boolean;
  error?: string | null;
  isActive: (path: string) => boolean;
  onLogout: () => void;
}

const IconChevron = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const Sidebar: Component<SidebarProps> = (props) => {
  const [openMenus, setOpenMenus] = createSignal<Record<number, boolean>>({});

  const hasActiveChild = (items: NavigationItem[]): boolean =>
    items.some(
      (item) =>
        (item.path && props.isActive(item.path)) || hasActiveChild(item.children || []),
    );

  const toggleMenu = (id: number) => {
    setOpenMenus((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  const NavNode: Component<{ item: NavigationItem; level?: number }> = (
    nodeProps,
  ) => {
    const level = () => nodeProps.level ?? 0;
    const hasChildren = () => nodeProps.item.children.length > 0;
    const isCurrent = () => !!nodeProps.item.path && props.isActive(nodeProps.item.path);
    const isExpanded = createMemo(
      () => !!openMenus()[nodeProps.item.id] || hasActiveChild(nodeProps.item.children || []),
    );
    const paddingLeft = () => `${20 + level() * 16}px`;

    return (
      <div class="sidebar-nav-group">
        <Show
          when={hasChildren()}
          fallback={
            <Show
              when={nodeProps.item.path}
              fallback={
                <div class="sidebar-nav-label" style={{ "padding-left": paddingLeft() }}>
                  {nodeProps.item.name}
                </div>
              }
            >
              <A
                href={nodeProps.item.path}
                class={isCurrent() ? "active" : ""}
                style={{ "padding-left": paddingLeft() }}
                onClick={() => props.setSidebarOpen(false)}
              >
                {nodeProps.item.name}
              </A>
            </Show>
          }
        >
          <button
            type="button"
            class={`sidebar-dropdown-trigger${isCurrent() ? " active" : ""}`}
            style={{ "padding-left": paddingLeft() }}
            onClick={() => toggleMenu(nodeProps.item.id)}
          >
            <span>{nodeProps.item.name}</span>
            <span class={`sidebar-dropdown-icon${isExpanded() ? " open" : ""}`}>
              <IconChevron />
            </span>
          </button>

          <Show when={isExpanded()}>
            <div class="sidebar-submenu">
              <For each={nodeProps.item.children}>
                {(child) => <NavNode item={child} level={level() + 1} />}
              </For>
            </div>
          </Show>
        </Show>
      </div>
    );
  };

  return (
    <aside class={`agri-sidebar ${props.sidebarOpen() ? "open" : ""}`}>
      <button class="close-btn" onClick={() => props.setSidebarOpen(false)}>
        x
      </button>

      <div class="sidebar-brand">
        <div class="sidebar-brand-icon">EA</div>
        <div class="sidebar-brand-text">
          <span class="sidebar-brand-name">Estate Admin</span>
          <span class="sidebar-brand-sub">Management Portal</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <Show when={props.isLoading}>
          <div class="sidebar-nav-message">Loading menu...</div>
        </Show>

        <Show when={!props.isLoading && props.error}>
          <div class="sidebar-nav-message error">{props.error}</div>
        </Show>

        <Show when={!props.isLoading && !props.error && props.navItems.length > 0}>
          <For each={props.navItems}>
            {(item) => <NavNode item={item} />}
          </For>
        </Show>

        <Show when={!props.isLoading && !props.error && props.navItems.length === 0}>
          <div class="sidebar-nav-message">No menu available.</div>
        </Show>
      </nav>

      <div class="sidebar-bottom">
        <A href="/help" class="sidebar-bottom-item">
          Help Center
        </A>

        <button onClick={props.onLogout} class="sidebar-bottom-item logout">
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
