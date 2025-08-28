
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Button from '../components/Button';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedEmail, setSelectedEmail] = React.useState('waiter@halfplate.com');
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
    <div className="min-h-screen bg-slate-100 md:flex md:items-center md:justify-center">
      <div className="w-full h-screen bg-white p-8 flex flex-col justify-center space-y-8 
                   md:h-auto md:w-full md:max-w-md md:rounded-lg md:shadow-lg">
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary md:text-3xl">Halfplate</h1>
          <h2 className="mt-2 text-2xl font-semibold text-secondary md:text-xl">
            Welcome Back
          </h2>
        </div>
        
        <form className="space-y-8" onSubmit={handleLogin}>
          <div>
            <label htmlFor="role-select" className="sr-only">Select Role</label>
            <select
              id="role-select"
              name="role"
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              required
              className="relative block w-full px-4 py-4 text-lg text-slate-900 border border-slate-300 rounded-md appearance-none focus:outline-none focus:ring-primary focus:border-primary md:py-3 md:text-base"
            >
              <option value="waiter@halfplate.com">Login as Waiter</option>
              <option value="owner@halfplate.com">Login as Restaurant Owner</option>
              <option value="store.manager@halfplate.com">Login as Store Manager</option>
              <option value="procurement@halfplate.com">Login as Procurement Manager</option>
              <option value="admin@halfplate.com">Login as Admin</option>
              <option value="chef@halfplate.com">Login as Chef</option>
            </select>
          </div>

          <div>
            <Button type="submit" disabled={loading} className="w-full py-4 text-lg md:py-2 md:text-sm">
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </div>
        </form>
        
        <p className="text-sm text-center text-slate-500">
           Select a role to simulate login.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
