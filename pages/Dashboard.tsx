import React from 'react';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import Table, { Column } from '../components/Table';
import { Order, OrderStatus } from '../types';
import { useAuth } from '../auth/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const getStatusBadge = (status: OrderStatus) => {
  const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
  const statusClasses = {
    [OrderStatus.Delivered]: 'bg-green-100 text-green-800',
    [OrderStatus.Approved]: 'bg-blue-100 text-blue-800',
    [OrderStatus.PendingApproval]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.Cancelled]: 'bg-red-100 text-red-800',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const chartData = [
  { name: 'Mon', cost: 4000, spend: 2400 },
  { name: 'Tue', cost: 3000, spend: 1398 },
  { name: 'Wed', cost: 2000, spend: 9800 },
  { name: 'Thu', cost: 2780, spend: 3908 },
  { name: 'Fri', cost: 1890, spend: 4800 },
  { name: 'Sat', cost: 2390, spend: 3800 },
  { name: 'Sun', cost: 3490, spend: 4300 },
];

const Dashboard: React.FC = () => {
  const { selectedOutlet } = useAuth();
  const { data: metrics, loading: metricsLoading } = useApi(api.getDashboardMetrics, selectedOutlet?.id);
  const { data: orders, loading: ordersLoading } = useApi(api.getOrders, selectedOutlet?.id);

  const orderColumns: Column<Order>[] = [
    { header: 'Order ID', accessor: 'id' },
    { header: 'Vendor', accessor: 'vendor' },
    { header: 'Date', accessor: 'date' },
    { header: 'Total', accessor: (item: Order) => `$${item.total.toFixed(2)}` },
    { header: 'Status', accessor: (item: Order) => getStatusBadge(item.status) },
  ];

  if (!selectedOutlet) {
      return <div className="text-center p-8">Please select an outlet to view the dashboard.</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm animate-pulse">
                    <div className="h-4 bg-neutral-200 rounded w-1/3 mb-4"></div>
                    <div className="h-8 bg-neutral-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-neutral-200 rounded w-1/4"></div>
                </div>
            ))
        ) : (
          metrics?.map(metric => <DashboardCard key={metric.title} metric={metric} />)
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
           <h3 className="text-lg font-semibold text-secondary mb-4">Weekly Spend vs Food Cost</h3>
           <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B778C', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B778C', fontSize: 12}} />
              <Tooltip cursor={{fill: 'rgba(0, 82, 204, 0.1)'}} contentStyle={{borderRadius: '0.5rem', borderColor: '#DFE1E6'}}/>
              <Legend wrapperStyle={{fontSize: "14px"}}/>
              <Bar dataKey="spend" fill="#0052cc" name="Total Spend" radius={[4, 4, 0, 0]}/>
              <Bar dataKey="cost" fill="#99c2ff" name="Food Cost" radius={[4, 4, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-semibold text-secondary mb-4">Quick Links</h3>
          <div className="space-y-3">
              <a href="#/orders" className="block p-3 bg-primary-50 text-primary font-medium rounded-md hover:bg-primary-100">Create New Order</a>
              <a href="#/inventory" className="block p-3 bg-neutral-100 text-neutral-800 font-medium rounded-md hover:bg-neutral-200">Receive Goods</a>
              <a href="#/recipes" className="block p-3 bg-neutral-100 text-neutral-800 font-medium rounded-md hover:bg-neutral-200">Update Recipe Costs</a>
              <a href="#/finance" className="block p-3 bg-neutral-100 text-neutral-800 font-medium rounded-md hover:bg-neutral-200">View Mismatched Invoices</a>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-secondary mb-4">Recent Orders for {selectedOutlet.name}</h3>
        {ordersLoading ? (
          <div className="text-center p-8 bg-white rounded-lg border">Loading...</div>
        ) : (
          <Table data={orders?.slice(0, 5) || []} columns={orderColumns} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
