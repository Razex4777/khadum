import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface FreelancerData {
  id: string;
  full_name: string;
  email: string;
  whatsapp_number: string;
  field: string;
  is_verified: boolean;
  created_at: string;
}

export const useVerificationGuard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [freelancerData, setFreelancerData] = useState<FreelancerData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 Starting verification check...');

      // Get current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('📧 Session data:', { 
        hasSession: !!session, 
        email: session?.user?.email,
        sessionError: sessionError?.message 
      });

      if (sessionError) {
        console.error('Session error:', sessionError);
        setError(`خطأ في جلب بيانات الجلسة: ${sessionError.message}`);
        setIsLoading(false);
        return;
      }

      if (!session?.user?.email) {
        console.error('No session or email found');
        setError('لم يتم العثور على بيانات المستخدم');
        setIsLoading(false);
        return;
      }

      console.log('🔎 Looking for freelancer with email:', session.user.email);

      // Get freelancer data by email
      const { data: freelancer, error: freelancerError } = await supabase
        .from('freelancers')
        .select('*')
        .eq('email', session.user.email)
        .single();

      console.log('👤 Freelancer query result:', { 
        found: !!freelancer, 
        error: freelancerError?.message,
        data: freelancer ? { 
          id: freelancer.id, 
          name: freelancer.full_name, 
          verified: freelancer.is_verified 
        } : null 
      });

      if (freelancerError) {
        console.error('Freelancer query error:', freelancerError);
        if (freelancerError.code === 'PGRST116') {
          setError(`لم يتم العثور على حساب مستقل مرتبط بالبريد: ${session.user.email}`);
        } else {
          setError(`خطأ في جلب بيانات المستقل: ${freelancerError.message}`);
        }
        setIsLoading(false);
        return;
      }

      console.log('✅ Verification check complete:', {
        name: freelancer.full_name,
        verified: freelancer.is_verified
      });

      setFreelancerData(freelancer);
      setIsVerified(freelancer.is_verified);
      
    } catch (err) {
      console.error('Error checking verification status:', err);
      setError(`حدث خطأ غير متوقع: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStatus = async () => {
    await checkVerificationStatus();
  };

  return {
    isLoading,
    isVerified,
    freelancerData,
    error,
    refreshStatus
  };
};


