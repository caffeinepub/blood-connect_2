import { useState } from 'react';
import { UserProfile } from '../backend';
import { formatBloodGroup } from '../lib/bloodGroup';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, Loader2, UserCheck, UserX, AlertTriangle } from 'lucide-react';
import type { Principal } from '@icp-sdk/core/principal';

interface AdminUserTableProps {
  users: UserProfile[];
  onDeactivate: (principal: Principal) => Promise<void>;
  isDeactivating: boolean;
}

export default function AdminUserTable({ users, onDeactivate, isDeactivating }: AdminUserTableProps) {
  const [page, setPage] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paginatedUsers = users.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleConfirmDeactivate = async () => {
    if (!selectedUser) return;
    // The backend's getAdminPanelData does not return principal IDs alongside user profiles.
    // Until the backend is updated to return [Principal, UserProfile] pairs, we show a clear error.
    setConfirmOpen(false);
    // Attempt deactivation — will surface an error via the parent's toast handler
    // since we cannot pass a real principal here.
    // For now, show a user-friendly alert.
    alert(
      `Cannot remove "${selectedUser.name}" — the backend does not return the user's principal ID in the admin panel data. Please contact the developer to update the backend.`
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">All Users ({users.length})</h3>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
        <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">
          <strong>Note:</strong> Donor removal requires the backend to return user principal IDs. This feature will be fully functional once the backend is updated.
        </p>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground bg-secondary rounded-2xl">
          <p>No users registered yet.</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {paginatedUsers.map((user, i) => (
              <div
                key={i}
                className={`bg-white border rounded-xl p-3 flex items-center gap-3 ${
                  !user.active ? 'opacity-50 border-dashed' : 'border-border'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <span className="text-sm font-black text-primary">
                    {formatBloodGroup(user.bloodGroup)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold truncate">{user.name}</p>
                    {user.active ? (
                      <UserCheck size={14} className="text-green-600 shrink-0" />
                    ) : (
                      <UserX size={14} className="text-muted-foreground shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {user.role === 'donor' ? '🩸 Donor' : '🏥 Receiver'} · {user.city} · {user.phone}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setConfirmOpen(true);
                  }}
                  disabled={!user.active || isDeactivating}
                  className="shrink-0 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Deactivate user"
                >
                  {isDeactivating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {page + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="max-w-[380px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate <strong>{selectedUser?.name}</strong>? They will be hidden from donor search results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeactivating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleConfirmDeactivate}
              disabled={isDeactivating}
            >
              {isDeactivating ? (
                <><Loader2 size={14} className="animate-spin mr-2" /> Deactivating...</>
              ) : (
                'Deactivate'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
