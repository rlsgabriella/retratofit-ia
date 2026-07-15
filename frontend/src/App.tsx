import { ClerkProvider, SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import OnboardingPage from './pages/Onboarding';
import CapturePage from './pages/Capture';
import TimelinePage from './pages/Timeline';
import { setAuthToken, syncUser } from './services/api';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Variável VITE_CLERK_PUBLISHABLE_KEY não configurada.');
}

function AppSync() {
  const { getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
    getToken().then((token) => {
      if (token) {
        setAuthToken(token);
        syncUser({
          email: user.primaryEmailAddress?.emailAddress ?? '',
          nome: user.fullName ?? undefined,
        }).catch(() => {});
      }
    });
  }, [user, getToken]);

  return null;
}

function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      <NavLink to="/timeline" className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span>Histórico</span>
      </NavLink>
      <NavLink to="/capture" className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        <span>Câmera</span>
      </NavLink>
    </nav>
  );
}

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>
        <AppSync />
        <div className="app-layout">
          <div className="app-content">{children}</div>
          <BottomNav />
        </div>
      </SignedIn>
      <SignedOut>
        <Navigate to="/onboarding" replace />
      </SignedOut>
    </>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Routes>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route
            path="/capture"
            element={
              <ProtectedLayout>
                <CapturePage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/timeline"
            element={
              <ProtectedLayout>
                <TimelinePage />
              </ProtectedLayout>
            }
          />
          <Route path="*" element={<Navigate to="/timeline" replace />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}
