import { useGetAdminPanelData } from '../hooks/useQueries';
import AdminUserTable from '../components/AdminUserTable';
import AdminEmergencyRequestsTable from '../components/AdminEmergencyRequestsTable';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, AlertTriangle } from 'lucide-react';
import type { Principal } from '@icp-sdk/core/principal';

export default function AdminPanelPage() {
  const { data, isLoading, error } = useGetAdminPanelData();

  const handleDeactivate = async (_principal: Principal) => {
    // Deactivation requires principal ID which is not returned by getAdminPanelData
    // See backend-gaps for details
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Shield size={20} className="text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Manage users and requests</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-primary">Access Denied</p>
            <p className="text-sm text-muted-foreground mt-1">
              {error instanceof Error && error.message.includes('Unauthorized')
                ? 'You need admin privileges to access this panel. Use the admin token URL parameter to gain access.'
                : error.message}
            </p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary rounded-2xl p-4 text-center border border-border">
              <p className="text-3xl font-black text-primary">{data.users.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Users</p>
            </div>
            <div className="bg-secondary rounded-2xl p-4 text-center border border-border">
              <p className="text-3xl font-black text-primary">{data.emergencyRequests.length}</p>
              <p className="text-sm text-muted-foreground mt-1">SOS Requests</p>
            </div>
          </div>

          <AdminUserTable
            users={data.users}
            onDeactivate={handleDeactivate}
            isDeactivating={false}
          />

          <AdminEmergencyRequestsTable requests={data.emergencyRequests} />
        </>
      )}
    </div>
  );
}
