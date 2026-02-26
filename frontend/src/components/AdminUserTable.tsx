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
import { Trash2, Loader2, UserCheck, UserX } from 'lucide-react';
import type { Principal } from '@icp-sdk/core/principal';

interface AdminUserTableProps {
  users: UserProfile[];
  onDeactivate: (principal: Principal) => Promise<void>;
  isDeactivating: boolean;
}

// Note: Backend returns UserProfile without principal in the array.
// We display users but cannot deactivate without principal.
// This is a backend gap - see backend-gaps section.
export default function AdminUserTable({ users, onDeactivate: _onDeactivate, isDeactivating: _isDeactivating }: AdminUserTableProps) {
  const [page, setPage] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paginatedUsers = users.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">All Users ({users.length})</h3>
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
                  disabled={!user.active}
                  className="shrink-0 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Deactivate user"
                >
                  <Trash2 size={16} />
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
              <br /><br />
              <span className="text-xs text-muted-foreground">Note: Deactivation requires admin access and the user's principal ID.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setConfirmOpen(false)}
            >
              {_isDeactivating ? (
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
