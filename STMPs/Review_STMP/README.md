# 📧 Khadum Review SMTP System

This is the email notification system for sending review notifications (approval/rejection) to freelancers using Supabase Edge Functions and Resend API.

## 🚀 Features

- **Beautiful HTML Emails**: Professional Arabic/English email templates
- **Approval Notifications**: Welcome emails with platform features
- **Rejection Notifications**: Helpful feedback with improvement suggestions  
- **Resend API Integration**: Reliable email delivery
- **CORS Support**: Cross-origin request handling
- **Error Handling**: Comprehensive error logging and responses

## 📁 Structure

```
STMPs/Review_STMP/
├── supabase/
│   ├── functions/
│   │   ├── send-review-notification/
│   │   │   └── index.ts              # Main edge function
│   │   └── _shared/
│   │       └── cors.ts               # CORS utilities
│   ├── config.toml                   # Supabase configuration
│   └── .env.example                  # Environment variables template
└── README.md                         # This file
```

## 🔧 Setup Instructions

### 1. Environment Variables

Add to your `.env` file:
```bash
RESEND_API_KEY=re_UqDC7zJw_MRjALuSiNQJZ2AiZrBVvLZZ6
```

### 2. Deploy Edge Function

```bash
# Navigate to the SMTP directory
cd STMPs/Review_STMP

# Deploy the edge function to Supabase
supabase functions deploy send-review-notification --project-ref YOUR_PROJECT_REF
```

### 3. Set Environment Variables in Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **Settings** > **Edge Functions**
3. Add the environment variable:
   - Key: `RESEND_API_KEY`
   - Value: `re_UqDC7zJw_MRjALuSiNQJZ2AiZrBVvLZZ6`

## 🔗 Integration

### Frontend Usage

```typescript
import { sendApprovalEmail, sendRejectionEmail } from '@/lib/emailService';

// Send approval email
await sendApprovalEmail('user@example.com', 'أحمد محمد');

// Send rejection email with reason
await sendRejectionEmail(
  'user@example.com', 
  'أحمد محمد',
  'يرجى تحديث معلومات الهوية الشخصية'
);
```

### Admin Dashboard Integration

The email service is integrated into the admin dashboard approval/rejection workflow:

```typescript
const handleApproveUser = async (userId: string) => {
  // Update user status in database
  await supabase
    .from('freelancers')
    .update({ is_verified: true })
    .eq('id', userId);

  // Send approval email
  await sendApprovalEmail(user.email, user.full_name);
};
```

## 📧 Email Templates

### Approval Email Features:
- ✅ Welcome message with celebration
- 🚀 Call-to-action button to login
- ✨ Platform features overview
- 📞 Contact information
- 🎨 Professional Arabic RTL design

### Rejection Email Features:
- 📋 Clear explanation of review status
- 💡 Specific rejection reasons (optional)
- 📝 Call-to-action to update application
- 🤝 Support contact information
- 🎨 Professional Arabic RTL design

## 🌐 API Endpoint

**URL**: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-review-notification`

**Method**: `POST`

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_ANON_KEY"
}
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "full_name": "أحمد محمد",
  "status": "approved", // or "rejected"
  "rejection_reason": "Optional rejection reason"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Review notification sent successfully",
  "email_id": "resend_email_id"
}
```

## 🎨 Email Design

The emails feature:
- **RTL Support**: Proper Arabic text direction
- **Responsive Design**: Mobile-friendly layout
- **Brand Colors**: Khadum green theme (#059669)
- **Professional Typography**: Clean, readable fonts
- **Interactive Elements**: Buttons and links
- **Contact Information**: WhatsApp and email links

## 🔐 Security

- **CORS Protection**: Configured for cross-origin requests
- **Environment Variables**: Sensitive keys stored securely
- **Input Validation**: Required field validation
- **Error Handling**: Secure error messages

## 📊 Monitoring

Check email delivery status in:
1. **Supabase Dashboard** > **Edge Functions** > **Logs**
2. **Resend Dashboard** > **Emails** > **Delivery Status**

## 🚨 Troubleshooting

### Common Issues:

1. **RESEND_API_KEY not found**
   - Ensure environment variable is set in Supabase dashboard
   - Verify the API key is valid in Resend dashboard

2. **CORS errors**
   - Check that CORS headers are properly configured
   - Verify the request origin is allowed

3. **Email not delivered**
   - Check Resend dashboard for delivery status
   - Verify recipient email address is valid
   - Check spam folder

### Debug Logs:

The edge function provides detailed logging:
```
📧 Sending review notification: { email, full_name, status }
✅ Email sent successfully: { result }
❌ Error details: { error }
```

## 📈 Usage Analytics

Monitor email performance through:
- **Delivery Rate**: Track successful deliveries
- **Open Rate**: Monitor email engagement  
- **Click Rate**: Track CTA button clicks
- **Error Rate**: Monitor failed deliveries

---

**Built with ❤️ for Khadum Platform**
