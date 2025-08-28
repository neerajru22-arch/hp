
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Recipes from './pages/Recipes';
import Finance from './pages/Finance';
import Structure from './pages/Structure';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './auth/AuthContext';
import Requisitions from './pages/Requisitions';
import Staff from './pages/Staff';
import Vendors from './pages/Vendors';

const AppLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-4 sm:p-6 md:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/structure" element={<Structure />} />
            <Route path="/requisitions" element={<Requisitions />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/vendors" element={<Vendors />} />
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
