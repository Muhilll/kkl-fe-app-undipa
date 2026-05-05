import { Component, Show, createSignal } from "solid-js";

interface HeaderProps {
  pageTitle?: string;
  onMenuClick: () => void;
  username?: string;
  roleName?: string;
  onLogout?: () => void;
}

const IconUser = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconChevron = (props: { open: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    style={{
      transition: "transform 0.2s ease",
      transform: props.open ? "rotate(180deg)" : "rotate(0deg)",
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconLogout = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconMenu = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const Header: Component<HeaderProps> = (props) => {
  const [dropdownOpen, setDropdownOpen] = createSignal(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    setDropdownOpen(false);
    props.onLogout?.();
  };

  return (
    <header class="agri-header">
      <button class="menu-toggle" onClick={props.onMenuClick} aria-label="Toggle Menu">
        <IconMenu />
      </button>

      <div class="header-breadcrumb" />

      <div class="header-actions">
        <div class="header-profile-wrapper">
          <button class="header-profile-trigger" onClick={toggleDropdown}>
            <div class="header-profile-avatar">
              <IconUser />
            </div>
            <div class="header-profile-info">
              <span class="header-profile-name">{props.username || "User"}</span>
              <span class="header-profile-role">{props.roleName || "—"}</span>
            </div>
            <IconChevron open={dropdownOpen()} />
          </button>

          <Show when={dropdownOpen()}>
            <div class="header-dropdown-backdrop" onClick={() => setDropdownOpen(false)} />
            <div class="header-profile-dropdown">
              <button class="header-dropdown-item logout" onClick={handleLogout}>
                <IconLogout />
                Logout
              </button>
            </div>
          </Show>
        </div>
      </div>

      <style>{`
        .header-profile-wrapper {
          position: relative;
        }

        .header-profile-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          background: #fff;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .header-profile-trigger:hover {
          border-color: var(--brand-500);
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.08);
        }

        .header-profile-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--brand-50);
          border: 2px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--brand-700);
          flex-shrink: 0;
        }

        .header-profile-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.25;
          min-width: 0;
        }

        .header-profile-name {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 160px;
        }

        .header-profile-role {
          font-size: 11px;
          font-weight: 500;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .header-dropdown-backdrop {
          position: fixed;
          inset: 0;
          z-index: 90;
        }

        .header-profile-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          min-width: 160px;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.04);
          padding: 6px;
          z-index: 100;
          animation: dropdown-fade-in 0.15s ease;
        }

        @keyframes dropdown-fade-in {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 14px;
          border: none;
          background: none;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-muted);
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }

        .header-dropdown-item:hover {
          background: #f9fafb;
          color: var(--text-primary);
        }

        .header-dropdown-item.logout {
          color: #ef4444;
        }

        .header-dropdown-item.logout:hover {
          background: #fef2f2;
          color: #dc2626;
        }

        @media (max-width: 768px) {
          .header-profile-info {
            display: none;
          }
          .header-profile-trigger {
            padding: 4px;
            border: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;