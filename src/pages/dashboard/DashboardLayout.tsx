import { Outlet } from 'react-router-dom';
import ExpandableSidebar from '@/components/dashboard/ExpandableSidebar';
import VerificationPending from '@/components/VerificationPending';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { useVerificationGuard } from '@/hooks/useVerificationGuard';

const DashboardLayout = () => {
  const { isLoading, isVerified, freelancerData, error } = useVerificationGuard();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">جاري التحقق من حالة الحساب...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-destructive text-xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">خطأ في تحميل البيانات</h2>
          <p className="text-muted-foreground">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // Verification pending state
  if (!isVerified) {
    return (
      <VerificationPending 
        freelancerData={freelancerData}
        isPopup={false}
      />
    );
  }

  // Verified user - show normal dashboard
  return (
    <NotificationProvider freelancerId={freelancerData.id}>
      <ExpandableSidebar>
        <Outlet />
      </ExpandableSidebar>
    </NotificationProvider>
  );
};

export default DashboardLayout;
