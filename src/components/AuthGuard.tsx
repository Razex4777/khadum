import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔐 AuthGuard: Checking authentication...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('🔐 AuthGuard: Session check result:', {
          hasSession: !!session,
          email: session?.user?.email,
          error: error?.message
        });

        if (error) {
          console.error('Auth error:', error);
          navigate('/authentication/login');
          return;
        }

        if (!session) {
          console.log('🔐 AuthGuard: No session found, redirecting to login');
          navigate('/authentication/login');
          return;
        }

        console.log('✅ AuthGuard: User authenticated');
        setIsAuthenticated(true);
      } catch (err) {
        console.error('AuthGuard error:', err);
        navigate('/authentication/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 AuthGuard: Auth state changed:', event, !!session);
        
        if (event === 'SIGNED_OUT' || !session) {
          setIsAuthenticated(false);
          navigate('/authentication/login');
        } else if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground font-tajawal">جاري التحقق من تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null; // Will be redirected by useEffect
  }

  // Authenticated - render children
  return <>{children}</>;
};

export default AuthGuard;

