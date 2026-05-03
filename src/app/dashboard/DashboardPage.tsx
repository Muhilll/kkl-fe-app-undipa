/**
 * Dashboard Page
 * Main dashboard for the application
 */

import { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../../services/authStore";
import PageHeader from "../../components/ui/PageHeader";
import Toast from "../../components/ui/Toast";

const DashboardPage: Component = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <div class="user-page">
      <PageHeader title="Dashboard" description="Welcome to your dashboard!" />

      <div class="user-info">
        <h2>Welcome, {auth.user()?.name}!</h2>
        <p>Email: {auth.user()?.email}</p>
      </div>

      <style>{`
        .dashboard-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          margin: 0;
          color: #333;
        }

        .logout-btn {
          padding: 0.5rem 1rem;
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s;
        }

        .logout-btn:hover {
          background: #c0392b;
        }

        .user-info {
          background: #f5f5f5;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .user-info h2 {
          margin-top: 0;
          color: #333;
        }

        .user-info p {
          margin: 0.5rem 0;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
