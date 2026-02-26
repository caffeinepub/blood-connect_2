import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import DonorSearchPage from './pages/DonorSearchPage';
import EligibilityPage from './pages/EligibilityPage';
import DashboardPage from './pages/DashboardPage';
import AdminPanelPage from './pages/AdminPanelPage';
import ProfileSetupModal from './components/ProfileSetupModal';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';

function AppShell() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      <Outlet />
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}

const rootRoute = createRootRoute({
  component: AppShell,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: Layout,
});

const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: HomePage,
});

const registerRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/register',
  component: RegisterPage,
});

const searchRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/search',
  component: DonorSearchPage,
});

const eligibilityRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/eligibility',
  component: EligibilityPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const adminRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/admin',
  component: AdminPanelPage,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    homeRoute,
    registerRoute,
    searchRoute,
    eligibilityRoute,
    dashboardRoute,
    adminRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
