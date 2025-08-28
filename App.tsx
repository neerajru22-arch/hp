import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Recipes from './pages/Recipes';
import Finance from './pages/Finance';
import OrgChart from './pages/OrgChart';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './auth/AuthContext';

const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-neutral-100 text-neutral-800">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-100 p-6 md:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/org-chart" element={<OrgChart />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { user } = useAuth();
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
