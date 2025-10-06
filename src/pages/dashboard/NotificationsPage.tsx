import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Notifications from './Notifications';
import { Loader2 } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const [freelancerId, setFreelancerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFreelancerId = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user?.email) {
          setError('No user session found');
          setLoading(false);
          return;
        }

        const { data: freelancer, error } = await supabase
          .from('freelancers')
          .select('id')
          .eq('email', session.user.email)
          .single();

        if (error) {
          console.error('Error fetching freelancer:', error);
          setError('Failed to fetch freelancer information');
        } else if (freelancer) {
          setFreelancerId(freelancer.id);
        } else {
          setError('Freelancer not found');
        }
      } catch (error) {
        console.error('Error in getFreelancerId:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    getFreelancerId();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  if (error || !freelancerId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            خطأ في تحميل الإشعارات
          </h2>
          <p className="text-muted-foreground">
            {error || 'Failed to load freelancer information'}
          </p>
        </div>
      </div>
    );
  }

  return <Notifications freelancerId={freelancerId} />;
};

export default NotificationsPage;