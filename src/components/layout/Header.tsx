import { Component } from "solid-js";
import { A } from "@solidjs/router";

interface HeaderProps {
  pageTitle?: string;
  onMenuClick: () => void;
}

const Header: Component<HeaderProps> = (props) => {
  return (
    <header class="agri-header">
      <button class="menu-toggle" onClick={props.onMenuClick}>
        ☰
      </button>

      <div class="header-breadcrumb">
        <A href="/dashboard" class="breadcrumb-home">
          AgriIntel
        </A>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-page">
          {props.pageTitle ?? "Dashboard"}
        </span>
      </div>

      <div class="header-actions">
        <button class="header-icon-btn">🔔</button>
        <button class="header-icon-btn">⚙️</button>
        <div class="header-user-group">
          <div class="header-avatar">A</div>
          <span class="header-user-label">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;