# 🇩🇿 WhatsApp Business API Setup Guide for Algeria

## 📱 Your Phone Number: `0672661102` → `213672661102`

### 🔧 **IMMEDIATE STEPS TO FIX 400 ERRORS:**

#### **1. Check Your Meta Developer Console**
Go to: https://developers.facebook.com/apps
- Select your Khadum app
- Go to **WhatsApp** → **API Setup**
- Verify your phone number ID: `14099439185588`

#### **2. Add Your Algerian Number to Test Numbers**
In Meta Console:
- Go to **WhatsApp** → **API Setup**
- Scroll to **"Add a phone number"**
- Add: `+213672661102` (your number with +213 prefix)
- Verify the number via SMS/call

#### **3. Check Phone Number Status**
- Your number should show as **"Verified"**
- Status should be **"Connected"**
- If not verified, click **"Verify"** and follow steps

#### **4. Verify App Permissions**
In **App Settings** → **App Review** → **Permissions and Features**:
- ✅ `whatsapp_business_messaging` - **REQUIRED**
- ✅ `whatsapp_business_management` - **REQUIRED**

#### **5. Check Business Verification**
- Go to **Meta Business Manager**: https://business.facebook.com
- Check if business verification is complete
- Some features require verified business

---

## 🚀 **TEST YOUR SETUP:**

### **Step 1: Go to Admin Dashboard**
```
http://localhost:8080/administrator
```

### **Step 2: Click "WhatsApp Bot"**

### **Step 3: Click "Run Diagnostics"**
This will test:
- ✅ Access Token validity
- ✅ Phone Number ID configuration
- ✅ Message sending to your Algerian number

---

## 🔍 **COMMON ISSUES & SOLUTIONS:**

### **Issue 1: "Phone number not found" (400 error)**
**Solution:**
- Add `213672661102` to test phone numbers in Meta Console
- Make sure it's verified with SMS code

### **Issue 2: "Invalid recipient phone number" (400 error)**
**Solution:**
- Format must be: `213672661102` (no spaces, no +)
- Remove leading zero: `0672661102` → `672661102`
- Add Algeria code: `213` + `672661102` = `213672661102`

### **Issue 3: "Access token expired" (401 error)**
**Solution:**
- Generate new permanent access token in Meta Console
- Update token in `src/lib/whatsapp.ts`

### **Issue 4: "Rate limit exceeded" (429 error)**
**Solution:**
- Wait 1 hour before testing again
- Upgrade to paid plan for higher limits

### **Issue 5: "Business not verified" (403 error)**
**Solution:**
- Complete business verification in Meta Business Manager
- Provide business documents if required

---

## 📋 **VERIFICATION CHECKLIST:**

- [ ] **Meta App Created** - WhatsApp Business API app exists
- [ ] **Phone Number Added** - `14099439185588` configured
- [ ] **Access Token Generated** - Permanent token created
- [ ] **Test Number Added** - `213672661102` in allowed list
- [ ] **Number Verified** - SMS verification completed
- [ ] **Permissions Granted** - Messaging permissions enabled
- [ ] **Business Verified** - (May be required for production)

---

## 🧪 **TESTING WORKFLOW:**

### **1. Run Diagnostics First**
```bash
# In admin dashboard
Click "Run Diagnostics" button
```

### **2. Check Each Test Result**
- 🔐 **Access Token** - Should be ✅ Valid
- 📞 **Phone Number ID** - Should be ✅ Valid  
- 💬 **Message Sending** - Should be ✅ Working

### **3. If Message Sending Fails**
- Check error details in diagnostics
- Verify your number is in test list
- Confirm number format: `213672661102`

### **4. Test Bot Conversation**
Once diagnostics pass:
- Use bot demo with your number
- Send: `أبي مصمم جرافيك`
- Should receive bot response

---

## 📞 **QUICK REFERENCE:**

| Field | Value |
|-------|-------|
| **Your Phone** | `0672661102` |
| **WhatsApp Format** | `213672661102` |
| **Phone Number ID** | `14099439185588` |
| **Country Code** | `+213` (Algeria 🇩🇿) |
| **Access Token** | `EAATfgB4Y7dI...` |

---

## 🆘 **STILL NOT WORKING?**

### **Check Meta Status**
- Visit: https://developers.facebook.com/status/
- Check for WhatsApp API outages

### **Review Webhook Setup**
- Webhook URL: `https://your-domain.com/webhook/whatsapp`
- Verify Token: `khadum_webhook_verify_token_2024`
- Subscribe to: `messages` events

### **Contact Meta Support**
If all else fails:
- Go to Meta Developer Console
- Click **"Support"** → **"Get Help"**
- Provide your app ID and error details

---

🎯 **Your Algerian number `0672661102` should work perfectly once these steps are completed!** 🇩🇿










