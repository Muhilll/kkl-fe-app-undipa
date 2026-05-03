import { Component } from "solid-js";

const Footer: Component = () => {
  return (
    <footer class="agri-footer">
      <span class="footer-copy">
        © 2024 Agricultural Intelligence Framework
      </span>
      <nav class="footer-links">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <a href="/support">Contact Support</a>
      </nav>
    </footer>
  );
};

export default Footer;