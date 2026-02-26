import { useGetAdminPanelData, useDeactivateUser } from '../hooks/useQueries';
import AdminUserTable from '../components/AdminUserTable';
import AdminEmergencyRequestsTable from '../components/AdminEmergencyRequestsTable';
import AdminSosImageUpload from '../components/AdminSosImageUpload';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import type { Principal } from '@icp-sdk/core/principal';

export default function AdminPanelPage() {
  const { data, isLoading, error } = useGetAdminPanelData();
  const deactivateMutation = useDeactivateUser();

  const handleDeactivate = async (principal: Principal) => {
    try {
      await deactivateMutation.mutateAsync(principal);
      toast.success('User deactivated successfully.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to deactivate user.';
      toast.error(msg);
    }
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
                : error instanceof Error ? error.message : 'An error occurred.'}
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
          {/* Stats */}
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

          {/* SOS Image Upload Setting */}
          <AdminSosImageUpload />

          {/* User Table */}
          <AdminUserTable
            users={data.users}
            onDeactivate={handleDeactivate}
            isDeactivating={deactivateMutation.isPending}
          />

          {/* Emergency Requests Table */}
          <AdminEmergencyRequestsTable requests={data.emergencyRequests} />
        </>
      )}
    </div>
  );
}
