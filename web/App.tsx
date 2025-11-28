import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth-context';
import { ProtectedRoute } from './lib/ProtectedRoute';
import LandingPage from './landing/LandingPage';
import { DashboardLayout } from './dashboard/DashboardLayout';
import Dashboard from './dashboard/Dashboard';
import Pentest from './dashboard/Pentest';
import Scans from './dashboard/Scans';
import ScanDetail from './dashboard/ScanDetail';
import Settings from './dashboard/Settings';
import Billing from './dashboard/Billing';
import LoginPage from './auth/LoginPage';
import SignupPage from './auth/SignupPage';
import AuthCallback from './auth/AuthCallback';
import GitHubCallback from './auth/GitHubCallback';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/github/callback" element={<GitHubCallback />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="pentest" element={<Pentest />} />
            <Route path="scans" element={<Scans />} />
            <Route path="scans/:scanId" element={<ScanDetail />} />
            <Route path="vulnerabilities" element={<Scans />} />
            <Route path="settings" element={<Settings />} />
            <Route path="billing" element={<Billing />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
