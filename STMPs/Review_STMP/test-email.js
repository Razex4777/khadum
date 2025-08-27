// 🧪 Quick Email Test Script
// Run this script to test the Resend API directly

const RESEND_API_KEY = 're_UqDC7zJw_MRjALuSiNQJZ2AiZrBVvLZZ6';

async function testResendAPI() {
  console.log('🧪 Testing Resend API...');
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Khadum Platform <noreply@khadum.sa>',
        to: ['test@example.com'],
        subject: '🧪 Khadum Email Test',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
            <h1 style="color: #059669;">🤖 Khadum Email Test</h1>
            <p>If you received this email, the SMTP system is working perfectly!</p>
            <p style="color: #666; font-size: 14px;">
              Test Time: ${new Date().toISOString()}
            </p>
          </div>
        `,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Email test successful!');
      console.log('📧 Email ID:', result.id);
      return result;
    } else {
      const error = await response.text();
      console.error('❌ Email test failed:', error);
      throw new Error(error);
    }
    
  } catch (error) {
    console.error('❌ Error testing email:', error);
    throw error;
  }
}

// Run the test if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  testResendAPI()
    .then(result => {
      console.log('🎉 Test completed successfully!', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testResendAPI };

