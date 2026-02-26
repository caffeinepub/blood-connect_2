import { Link } from '@tanstack/react-router';
import SOSButton from '../components/SOSButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Search, Activity, LayoutDashboard, LogIn, LogOut, Heart } from 'lucide-react';
import { formatBloodGroup } from '../lib/bloodGroup';

const quickLinks = [
  { to: '/search', icon: Search, label: 'Find Donors', desc: 'Search by blood group & city', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { to: '/eligibility', icon: Activity, label: 'Check Eligibility', desc: 'Am I eligible to donate?', color: 'bg-green-50 text-green-700 border-green-200' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', desc: 'View stats & nearby donors', color: 'bg-orange-50 text-orange-700 border-orange-200' },
];

export default function HomePage() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Welcome Banner */}
      <div className="blood-gradient rounded-3xl p-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black leading-tight">
              {isAuthenticated && userProfile
                ? `Hello, ${userProfile.name.split(' ')[0]}! 👋`
                : 'Save Lives Today 🩸'}
            </h1>
            <p className="text-sm opacity-90 mt-1">
              {isAuthenticated && userProfile
                ? `${formatBloodGroup(userProfile.bloodGroup)} · ${userProfile.city}`
                : 'Connect donors and receivers across India'}
            </p>
          </div>
          <button
            onClick={isAuthenticated ? handleLogout : login}
            disabled={isLoggingIn}
            className="shrink-0 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl px-3 py-2 text-sm font-semibold min-h-touch transition-colors"
          >
            {isLoggingIn ? (
              <span className="text-xs">Loading...</span>
            ) : isAuthenticated ? (
              <><LogOut size={16} /> Logout</>
            ) : (
              <><LogIn size={16} /> Login</>
            )}
          </button>
        </div>

        {!isAuthenticated && (
          <Link
            to="/register"
            className="mt-4 flex items-center justify-center gap-2 bg-white text-primary font-bold rounded-xl min-h-touch px-4 text-base hover:bg-white/90 transition-colors"
          >
            Register as Donor / Receiver
          </Link>
        )}
      </div>

      {/* SOS Section */}
      <div className="bg-white rounded-3xl border border-border shadow-card p-6 flex flex-col items-center gap-4">
        <div className="text-center">
          <h2 className="text-xl font-black text-primary">Emergency Blood Request</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Press SOS to instantly alert nearby donors
          </p>
        </div>
        <SOSButton />
      </div>

      {/* Quick Links */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3">
          {quickLinks.map(({ to, icon: Icon, label, desc, color }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 min-h-touch transition-all hover:shadow-card-hover ${color}`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center shrink-0">
                <Icon size={24} />
              </div>
              <div>
                <p className="text-base font-bold">{label}</p>
                <p className="text-sm opacity-75">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Blood Connect. Built with{' '}
          <Heart size={11} className="inline text-primary" />{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'blood-connect')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
