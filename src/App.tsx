import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import MainLayout from './layouts/MainLayout';
import ExecutiveOverview from './pages/ExecutiveOverview';
import RiskMonitoring from './pages/RiskMonitoring';
import CustomerProfile from './pages/CustomerProfile';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import AlertManagement from './pages/AlertManagement';
import LoginPage from './pages/LoginPage';
import BrokerDashboard from './pages/BrokerDashboard';
import CustomerPortal from './pages/CustomerPortal';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 relative font-sans">
        <Routes>
          {/* Public Routes (No Chatbot) */}
          <Route path="/login" element={<LoginPage />} />

          {/* Authenticated Routes (With Chatbot) */}
          <Route element={<MainLayout />}>
            <Route path="/broker" element={<BrokerDashboard />} />
            <Route path="/customer-portal" element={<CustomerPortal />} />

            {/* Admin Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<ExecutiveOverview />} />
              <Route path="/monitoring" element={<RiskMonitoring />} />
              <Route path="/customer/:id" element={<CustomerProfile />} />
              <Route path="/alerts" element={<AlertManagement />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
