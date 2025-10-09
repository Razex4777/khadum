import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

interface ReviewNotificationData {
  email: string
  full_name: string
  status: 'approved' | 'rejected'
  rejection_reason?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, full_name, status, rejection_reason }: ReviewNotificationData = await req.json()

    console.log('📧 Sending review notification:', { email, full_name, status })

    // Validate required fields
    if (!email || !full_name || !status) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: email, full_name, status' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not found')
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate email content based on status
    const emailContent = generateEmailContent(full_name, status, rejection_reason)

    // Prefer branded sender, but fall back to Resend's onboarding domain for unverified domain errors
    const PRIMARY_FROM = 'Khadum Platform <noreply@khadum.app>'
    const FALLBACK_FROM = 'Khadum Platform <onboarding@resend.dev>'

    // Helper to send with a specific "from" address
    const sendWithFrom = async (fromAddress: string) => {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [email],
          subject: emailContent.subject,
          html: emailContent.html,
          reply_to: 'support@khadum.app'
        }),
      })
      return response
    }

    // Attempt with branded domain first
    let resendResponse = await sendWithFrom(PRIMARY_FROM)

    // If failed due to domain not verified or similar, retry with fallback domain
    if (!resendResponse.ok) {
      const errorText = await resendResponse.text()
      console.error('❌ Resend API error (primary sender):', errorText)

      const lower = errorText.toLowerCase()
      const mightBeDomainIssue = lower.includes('domain') || lower.includes('from address') || lower.includes('not verified')

      if (mightBeDomainIssue) {
        console.log('🔁 Retrying with fallback sender:', FALLBACK_FROM)
        resendResponse = await sendWithFrom(FALLBACK_FROM)
      } else {
        // Not a domain issue; keep original response for error handling
      }
    }

    if (!resendResponse.ok) {
      const finalError = await resendResponse.text()
      console.error('❌ Resend API error (final):', finalError)
      return new Response(
        JSON.stringify({
          error: 'Failed to send email',
          hint: 'Check RESEND_API_KEY and verify sending domain or use onboarding@resend.dev',
          resend_error: finalError?.slice(0, 500) // avoid returning huge payloads
        }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const result = await resendResponse.json()
    console.log('✅ Email sent successfully:', result)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Review notification sent successfully',
        email_id: result.id 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Error sending review notification:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function generateEmailContent(full_name: string, status: 'approved' | 'rejected', rejection_reason?: string) {
  const isApproved = status === 'approved'
  
  const subject = isApproved 
    ? '🎉 تم قبول طلبك في منصة خدوم - Welcome to Khadum!' 
    : '📋 تحديث حالة طلبك في منصة خدوم - Application Update'

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            background-color: #f8fafc;
            color: #1e293b;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            color: white;
            padding: 2rem;
            text-align: center;
        }
        
        .logo {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        
        .subtitle {
            opacity: 0.9;
            font-size: 1rem;
        }
        
        .content {
            padding: 2rem;
        }
        
        .status-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-weight: bold;
            margin-bottom: 1.5rem;
            ${isApproved 
              ? 'background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;' 
              : 'background-color: #fef2f2; color: #991b1b; border: 1px solid #fecaca;'
            }
        }
        
        .message {
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
            line-height: 1.8;
        }
        
        .highlight {
            color: #059669;
            font-weight: 600;
        }
        
        .rejection-box {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 0.5rem;
            padding: 1rem;
            margin: 1.5rem 0;
        }
        
        .rejection-title {
            color: #991b1b;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            color: white;
            padding: 0.75rem 2rem;
            text-decoration: none;
            border-radius: 0.5rem;
            font-weight: bold;
            margin: 1.5rem 0;
            transition: transform 0.2s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .features {
            background-color: #f8fafc;
            padding: 1.5rem;
            border-radius: 0.5rem;
            margin: 1.5rem 0;
        }
        
        .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 0.75rem;
        }
        
        .feature-icon {
            color: #059669;
            margin-left: 0.5rem;
            font-weight: bold;
        }
        
        .footer {
            background-color: #1e293b;
            color: white;
            padding: 2rem;
            text-align: center;
        }
        
        .footer-links {
            margin-bottom: 1rem;
        }
        
        .footer-link {
            color: #10b981;
            text-decoration: none;
            margin: 0 1rem;
        }
        
        .social-links {
            margin-top: 1rem;
        }
        
        .social-link {
            display: inline-block;
            margin: 0 0.5rem;
            color: #10b981;
            text-decoration: none;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 0;
            }
            
            .header, .content, .footer {
                padding: 1.5rem;
            }
            
            .logo {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">خدوم 🤖</div>
            <div class="subtitle">منصة المستقلين الذكية</div>
        </div>
        
        <!-- Content -->
        <div class="content">
            <div class="status-badge">
                ${isApproved ? '✅ تم قبول طلبك' : '📋 يتطلب مراجعة إضافية'}
            </div>
            
            <div class="message">
                <strong>مرحباً ${full_name}،</strong>
            </div>
            
            ${isApproved ? `
                <div class="message">
                    🎉 <strong>مبروك!</strong> تم قبول طلب انضمامك إلى منصة خدوم كمستقل معتمد.
                </div>
                
                <div class="message">
                    يمكنك الآن <span class="highlight">تسجيل الدخول إلى حسابك</span> والبدء في استقبال طلبات العملاء من خلال بوت الواتساب الذكي.
                </div>
                
                <a href="https://khadum.sa/authentication/login" class="cta-button">
                    🚀 ابدأ رحلتك الآن
                </a>
                
                <div class="features">
                    <h3 style="color: #059669; margin-bottom: 1rem;">✨ ما يمكنك فعله الآن:</h3>
                    <div class="feature-item">
                        <span class="feature-icon">🤖</span>
                        <span>استقبال طلبات العملاء عبر بوت الواتساب الذكي</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">💼</span>
                        <span>إدارة ملفك الشخصي وعرض خدماتك</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">💰</span>
                        <span>نظام دفع آمن ومضمون</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">📊</span>
                        <span>تتبع مشاريعك وإحصائياتك</span>
                    </div>
                </div>
            ` : `
                <div class="message">
                    نشكرك على اهتمامك بالانضمام إلى منصة خدوم. بعد مراجعة طلبك، نحتاج إلى <span class="highlight">معلومات إضافية</span> لإكمال عملية التحقق.
                </div>
                
                ${rejection_reason ? `
                    <div class="rejection-box">
                        <div class="rejection-title">📋 تفاصيل المراجعة:</div>
                        <div>${rejection_reason}</div>
                    </div>
                ` : ''}
                
                <div class="message">
                    يرجى مراجعة المعلومات المطلوبة وإعادة تقديم طلبك مع البيانات المحدثة.
                </div>
                
                <a href="https://khadum.sa/authentication/register" class="cta-button">
                    📝 تحديث الطلب
                </a>
            `}
            
            <div class="message">
                إذا كان لديك أي استفسارات، لا تتردد في التواصل معنا عبر:
            </div>
            
            <div style="margin: 1rem 0;">
                📞 <strong>الواتساب:</strong> <a href="https://wa.me/966511809878" style="color: #059669;">+966511809878</a><br>
                📧 <strong>البريد الإلكتروني:</strong> <a href="mailto:support@khadum.sa" style="color: #059669;">support@khadum.sa</a>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-links">
                <a href="https://khadum.sa" class="footer-link">الموقع الرئيسي</a>
                <a href="https://khadum.sa/authentication/login" class="footer-link">تسجيل الدخول</a>
                <a href="https://wa.me/966509811981" class="footer-link">واتساب</a>
            </div>
            
            <div>
                <strong>خدوم</strong> - منصة المستقلين الذكية<br>
                الرياض، المملكة العربية السعودية
            </div>
            
            <div class="social-links">
                <a href="#" class="social-link">📱 تطبيق الجوال قريباً</a>
            </div>
            
            <div style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.8;">
                © 2024 Khadum Platform. جميع الحقوق محفوظة.
            </div>
        </div>
    </div>
</body>
</html>`

  return { subject, html }
}
