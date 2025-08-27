import { supabase } from './supabase';

interface ReviewNotificationData {
  email: string;
  full_name: string;
  status: 'approved' | 'rejected';
  rejection_reason?: string;
}

export const sendReviewNotification = async (data: ReviewNotificationData) => {
  try {
    console.log('📧 Sending review notification email...', data);

    // Call the Supabase Edge Function
    const { data: result, error } = await supabase.functions.invoke('send-review-notification', {
      body: {
        email: data.email,
        full_name: data.full_name,
        status: data.status,
        rejection_reason: data.rejection_reason
      }
    });

    if (error) {
      // Log extended error context if available
      const anyErr: any = error as any;
      console.error('❌ Error calling edge function:', error);
      if (anyErr?.context) {
        console.error('🔎 Edge function error context:', anyErr.context);
      }
      const serverMessage = anyErr?.context?.error || anyErr?.context?.message;
      const message = serverMessage ? `${error.message} – ${serverMessage}` : error.message;
      throw new Error(`Failed to send email: ${message}`);
    }

    console.log('✅ Review notification sent successfully:', result);
    return result;

  } catch (error) {
    console.error('❌ Error in sendReviewNotification:', error);
    throw error;
  }
};

// Helper function for sending approval emails
export const sendApprovalEmail = async (email: string, full_name: string) => {
  return sendReviewNotification({
    email,
    full_name,
    status: 'approved'
  });
};

// Helper function for sending rejection emails
export const sendRejectionEmail = async (
  email: string, 
  full_name: string, 
  rejection_reason?: string
) => {
  return sendReviewNotification({
    email,
    full_name,
    status: 'rejected',
    rejection_reason
  });
};
