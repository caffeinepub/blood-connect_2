import { useState } from 'react';
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
import { useCreateEmergencyRequest } from '../hooks/useQueries';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { formatBloodGroup } from '../lib/bloodGroup';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SOSButton() {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const createRequest = useCreateEmergencyRequest();

  const handleSOS = async () => {
    if (!userProfile) return;
    try {
      await createRequest.mutateAsync({
        requester: userProfile.name,
        bloodGroup: userProfile.bloodGroup,
        city: userProfile.city,
      });
      setOpen(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setOpen(false);
    }
  };

  const isLoggedIn = !!identity;
  const hasProfile = !!userProfile;

  return (
    <div className="flex flex-col items-center gap-4">
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 rounded-2xl px-4 py-3 text-base font-medium animate-in fade-in">
          <CheckCircle2 size={20} className="text-green-600 shrink-0" />
          <span>Emergency request sent! Nearby donors have been notified.</span>
        </div>
      )}

      {!isLoggedIn && (
        <p className="text-sm text-muted-foreground text-center bg-secondary rounded-xl px-4 py-2">
          Please login to send an emergency request
        </p>
      )}

      <button
        onClick={() => {
          if (isLoggedIn && hasProfile) setOpen(true);
        }}
        disabled={!isLoggedIn || !hasProfile}
        className={`relative w-44 h-44 rounded-full flex flex-col items-center justify-center gap-2 font-black text-2xl text-white shadow-2xl transition-transform active:scale-95 ${
          isLoggedIn && hasProfile
            ? 'bg-primary sos-pulse cursor-pointer hover:scale-105'
            : 'bg-primary/40 cursor-not-allowed'
        }`}
        aria-label="Send SOS Emergency Request"
      >
        <img
          src="/assets/generated/sos-button.dim_256x256.png"
          alt="SOS"
          className="w-28 h-28 object-contain"
        />
        <span className="text-lg font-black tracking-widest">SOS</span>
      </button>

      {isLoggedIn && hasProfile && (
        <p className="text-sm text-muted-foreground text-center">
          Tap to send emergency blood request
        </p>
      )}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-[380px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-primary text-xl">
              <AlertTriangle size={22} className="text-primary" />
              Confirm Emergency Request
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              This will broadcast an urgent blood request for{' '}
              <strong>{userProfile ? formatBloodGroup(userProfile.bloodGroup) : ''}</strong> in{' '}
              <strong>{userProfile?.city}</strong> to all nearby matching donors.
              <br /><br />
              Only use this in a genuine emergency.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="min-h-touch">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSOS}
              disabled={createRequest.isPending}
              className="min-h-touch bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
            >
              {createRequest.isPending ? (
                <><Loader2 size={16} className="animate-spin mr-2" /> Sending...</>
              ) : (
                'Send SOS Now'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
