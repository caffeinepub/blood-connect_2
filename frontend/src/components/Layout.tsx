import { Outlet, Link, useRouter } from '@tanstack/react-router';
import { Home, Search, Activity, LayoutDashboard, Shield, Heart } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/eligibility', icon: Activity, label: 'Check' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin', icon: Shield, label: 'Admin' },
];

export default function Layout() {
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col bg-background shadow-card relative">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-border shadow-xs">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/assets/generated/blood-connect-logo.dim_256x256.png"
                alt="Blood Connect"
                className="h-10 w-10 object-contain"
              />
              <div>
                <span className="text-xl font-bold text-primary">Blood</span>
                <span className="text-xl font-bold text-foreground"> Connect</span>
              </div>
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-primary border border-primary rounded-lg px-3 py-1.5 min-h-touch flex items-center hover:bg-secondary transition-colors"
            >
              Register
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-20">
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 bg-white border-t border-border shadow-card">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map(({ to, icon: Icon, label }) => {
              const isActive = currentPath === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl min-h-touch justify-center transition-colors ${
                    isActive
                      ? 'text-primary bg-secondary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-xs font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <footer className="hidden">
          <p className="text-xs text-muted-foreground text-center py-2">
            © {new Date().getFullYear()} Blood Connect. Built with{' '}
            <Heart size={12} className="inline text-primary" />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'blood-connect')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
