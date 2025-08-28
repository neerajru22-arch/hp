import React, 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Button from '../components/Button';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedEmail, setSelectedEmail] = React.useState('owner@halfplate.com');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(selectedEmail);
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed", error);
      // You could show an error message here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-center text-primary">Halfplate</h1>
          <h2 className="mt-2 text-xl font-semibold text-center text-secondary">
            Restaurant Procurement SaaS
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <select
                id="email-address"
                name="email"
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                required
                className="relative block w-full px-3 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              >
                <option value="owner@halfplate.com">Login as Restaurant Owner</option>
                <option value="admin@halfplate.com">Login as Admin</option>
                <option value="chef@halfplate.com">Login as Chef</option>
              </select>
            </div>
          </div>

          <div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
        <p className="mt-2 text-xs text-center text-neutral-500">
           Select a role to simulate login. No password needed for this demo.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
