import { useGetDashboardData } from '../hooks/useQueries';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import DashboardStats from '../components/DashboardStats';
import NearbyDonorsList from '../components/NearbyDonorsList';
import RecentRequestsList from '../components/RecentRequestsList';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@tanstack/react-router';
import { LogIn } from 'lucide-react';

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data, isLoading, error } = useGetDashboardData();

  if (!identity) {
    return (
      <div className="px-4 py-12 flex flex-col items-center gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
          <LogIn size={36} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Login Required</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Please login to view your dashboard and nearby donors.
          </p>
        </div>
        <Link
          to="/"
          className="min-h-touch flex items-center justify-center px-6 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-colors"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-12 text-center space-y-3">
        <p className="text-base font-semibold text-primary">Unable to load dashboard</p>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error && error.message.includes('profile not found')
            ? 'Please complete your registration first.'
            : 'Please try again later.'}
        </p>
        <Link to="/register" className="text-primary underline text-sm font-semibold">
          Complete Registration →
        </Link>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="px-4 py-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-56 mt-2" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, {userProfile?.name ?? 'User'}
        </p>
      </div>

      <DashboardStats totalDonors={data.totalDonors} />

      <NearbyDonorsList
        donors={data.nearbyDonors}
        city={userProfile?.city ?? 'your city'}
      />

      <RecentRequestsList requests={data.recentRequests} />
    </div>
  );
}
