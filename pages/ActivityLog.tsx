
import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import { ActivityLogEntry, UserRole } from '../types';
import Table, { Column } from '../components/Table';

const ActivityLog: React.FC = () => {
    const { user } = useAuth();
    
    // In a real app, Admins might see all logs, while owners see only their outlets.
    // For this mock, we'll show owners all logs for outlets they have access to.
    const accessibleOutletIds = user?.outletIds || [];
    const { data: log, loading, error } = useApi(api.getActivityLog, accessibleOutletIds);

    const canView = user && [UserRole.Admin, UserRole.RestaurantOwner].includes(user.role);
    
    if (!canView) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <h2 className="text-2xl font-bold text-danger">Access Denied</h2>
                <p className="text-slate-600 mt-2">You do not have permission to view the activity log.</p>
            </div>
        );
    }

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };

    const columns: Column<ActivityLogEntry>[] = [
        { header: 'Timestamp', accessor: (item) => formatDate(item.timestamp), className: 'w-1/4' },
        { header: 'User', accessor: (item) => (
            <div>
                <p className="font-medium text-secondary">{item.userName}</p>
                <p className="text-xs text-slate-500">{item.userRole}</p>
            </div>
        ), className: 'w-1/4' },
        { header: 'Action', accessor: 'action', className: 'font-semibold w-1/4' },
        { header: 'Details', accessor: 'details', className: 'w-1/4' },
        { header: 'Outlet', accessor: 'outletName' },
    ];
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary">System Activity Log</h2>
            <p className="text-slate-600">
                A record of all significant actions taken within the system.
            </p>

            {loading && <div className="text-center p-8">Loading activity log...</div>}
            {error && <div className="text-center p-8 text-danger">Failed to load log.</div>}
            {log && <Table data={log} columns={columns} />}
        </div>
    );
};

export default ActivityLog;
