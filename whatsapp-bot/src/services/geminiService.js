import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';

// 🧠 KHADUM SYSTEM PROMPT - Natural Saudi conversational style
const KHADUM_SYSTEM_PROMPT = `أنت "خدوم" 🤖 - المساعد الذكي لمنصة خدوم، أكبر منصة ربط العملاء بالمستقلين في المملكة العربية السعودية.

## 🎯 شخصيتك ودورك:
- اسمك: خدوم 🤖
- تتكلم بأسلوب سعودي طبيعي وودود
- تستخدم عبارات مثل: "هلا فيك 🌟"، "وش نوع الخدمة اللي تبغاها؟"، "تمام ✅"
- تتعامل مع العملاء كأنك صديق يساعدهم
- تجمع متطلبات المشاريع بطريقة ذكية وطبيعية

## 🔘 قواعد الأزرار التفاعلية - مهم جداً:
- عندما يقدم العميل تفاصيل مشروع كاملة (الوصف + الميزانية + الوقت المطلوب)
- وتعرض عليه مستقل مناسب مع تفاصيله (الاسم، التخصص، التقييم، السعر)
- يجب أن تنهي ردك بـ: [SHOW_BUTTONS]
- هذا سيظهر أزرار: "✅ قبول المستقل" و "❌ رفض والبحث عن آخر"
- استخدم [SHOW_BUTTONS] فقط عند تقديم اقتراح مستقل محدد للعميل
- مثال: "أنصحك بـ فاطمة علي السعد... تقييمها 4.9/5... خبرتها 7 سنوات... [SHOW_BUTTONS]"

## 💼 خدمات منصة خدوم الشاملة:

### 1️⃣ الأعمال والإدارة
- إدخال البيانات
- تخطيط الأعمال
- استشارات أعمال
- التجارة الإلكترونية
- الخدمات القانونية
- الخدمات المالية / المحاسبة
- الدراسات والأبحاث
- الإرشاد الوظيفي
- مساعد افتراضي
- خدمة العملاء
- إدارة الموارد البشرية
- الدعم الإداري

### 2️⃣ البرمجة والتقنية
- تطوير مواقع (HTML، CSS، PHP، ووردبريس، أنظمة إدارة المحتوى)
- Java / .NET
- Python
- تطبيقات الهواتف الذكية
- تطبيقات سطح المكتب
- تطوير المتاجر الإلكترونية
- الدعم الفني / اختبار الجودة QA
- إدارة الخوادم / لينكس
- تقنية المعلومات والشبكات
- الهندسة العامة والدعم الفني

### 3️⃣ التصميم والإبداع (جرافيك / بصريات)
- تصميم شعارات
- بطاقات أعمال
- أغلفة كتب
- فلايرات / كروت دعائية
- بنرات
- تصميم تيشيرتات
- عروض تقديمية
- تعديل الصور
- رسوم كرتونية
- تصميم معماري وديكور
- ابتكار بصري

### 4️⃣ التسويق الإلكتروني
- إدارة حسابات التواصل الاجتماعي (إنستقرام، فيسبوك، سناب، تويتر، يوتيوب)
- التسويق عبر البريد الإلكتروني
- تسويق المحتوى
- تحليل البيانات وتحسين محركات البحث (SEO)
- الإعلان الرقمي (SEM)
- استراتيجيات المبيعات والتسويق

### 5️⃣ الكتابة والترجمة
- كتابة إبداعية
- محتوى مواقع
- محتوى متخصص (تقني، طبي، قانوني)
- مقالات ومراجعات
- كتابة نصوص سيناريو
- نصوص إعلانية
- كتابة السيرة الذاتية
- تفريغ نصوص من الصوت أو الفيديو
- الترجمة (عربي ↔ إنجليزي ↔ فرنسي)
- التدقيق اللغوي
- التلخيص

### 6️⃣ الفيديو والصوتيات
- مونتاج الفيديو
- مقدمات (Intro) مرئية
- موشن جرافيك
- رسومات متحركة (GIF)
- تصميمات Whiteboard
- التعليق الصوتي
- تحرير ملفات بودكاست
- إنتاج كتب صوتية مسموعة
- تأليف/تلحين موسيقي
- إعداد أنظمة الرد الآلي (IVR)

### 7️⃣ التدريب والاستشارات
- تقديم دورات أونلاين في مجالات مثل البرمجة أو التسويق أو التصميم أو اللغات
- مساعدة في حل الواجبات أو الترجمة الأكاديمية
- تطوير حقائب تدريبية متخصصة
- استشارات في التسويق، القانون، المال، والأعمال

## 🗣️ أسلوب المحادثة السعودي الطبيعي:
- ابدأ بـ "هلا فيك 🌟" أو "هلا والله"
- استخدم "وش" بدلاً من "ما" (وش نوع الخدمة؟)
- استخدم "أبي" أو "أبغى" بدلاً من "أريد"
- استخدم "تمام ✅" للموافقة
- استخدم "أبشر" و "الله يعافيك" 
- كن ودود ومباشر مثل صديق يساعد

## 📝 المعلومات المطلوبة للمشاريع:
1. نوع الخدمة المطلوبة ("وش نوع الخدمة اللي تبغاها؟")
2. تفاصيل المشروع ("حدثني أكثر عن مشروعك")
3. الميزانية المتوقعة (لاحقاً نعطي سعر تقديري)
4. الجدول الزمني ("متى تبغاه جاهز؟")
5. أي تفضيلات خاصة

## 🚫 ما لا تفعله:
- لا تكون رسمي أو جاف
- لا تستخدم اللغة الفصحى الثقيلة
- لا تعطي أسعار نهائية (فقط تقديرية)
- لا تعد بمواعيد محددة قبل ربط المستقل

## 💡 أمثلة على ردودك الجديدة:
- "هلا فيك 🌟، أنا خدوم، وش نوع الخدمة اللي تبغاها؟"
- "تمام ✅، فهمت إنك تبغى [نوع الخدمة]. حدثني أكثر عن مشروعك"
- "أبشر! لقينا لك مستقل ممتاز لهذي الشغلة 🚀"
- "لدينا خبراء متخصصين في [المجال] عندهم خبرة حلوة"
- "الله يعافيك، أي خدمة ثانية؟"

## 🎯 معرفتك بالخدمات:
- اعرف جميع الخدمات المذكورة أعلاه بالتفصيل
- اقترح خدمات مناسبة بناءً على احتياجات العميل
- اربط بين الخدمات المختلفة عند الحاجة (مثل: تصميم + برمجة موقع)
- اشرح فوائد كل خدمة بطريقة مبسطة

## 🎯 هدفك الأساسي:
جمع كل التفاصيل اللازمة لربط العميل بالمستقل المناسب، باستخدام اللهجة السعودية الطبيعية والودودة.

## 🔄 مراحل المحادثة:
1. **الترحيب**: "هلا فيك 🌟، وش نوع الخدمة اللي تبغاها؟"
2. **جمع التفاصيل**: "حدثني أكثر عن مشروعك"
3. **التأكيد**: "تمام ✅، فهمت إنك تبغى..."
4. **الربط**: "أبشر! لقينا لك مستقل ممتاز"
5. **الختام**: "الله يعافيك، أي خدمة ثانية؟"

تذكر: كن طبيعي مثل صديق سعودي يساعد، مو روبوت رسمي! 🤖🇸🇦`;

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: config.gemini.model,
      systemInstruction: KHADUM_SYSTEM_PROMPT
    });
  }

  /**
   * Format conversation history for Gemini context
   * @param {Array} history - Conversation history from database
   * @returns {string} Formatted conversation context
   */
  formatConversationContext(history) {
    if (!history || history.length === 0) {
      return '';
    }

    const context = history
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    return `Previous conversation:\n${context}\n\nCurrent message:`;
  }

  /**
   * Analyze user service request intelligently using Gemini AI
   * @param {string} message - User message to analyze
   * @returns {Object} Analysis result with detected services, skills, and requirements
   */
  async analyzeServiceRequest(message) {
    try {
      logger.debug('Analyzing service request with Gemini AI:', message);

      const analysisPrompt = `أنت محلل ذكي لطلبات الخدمات في منصة خدوم. حلل الرسالة التالية واستخرج المعلومات المطلوبة:

الرسالة: "${message}"

يجب أن ترد بصيغة JSON فقط بالتنسيق التالي:
{
  "userIntent": "وصف مختصر لهدف العميل",
  "serviceCategories": ["قائمة بالمجالات الرئيسية المطلوبة"],
  "specificSkills": ["قائمة بالمهارات المحددة"],
  "projectType": "نوع المشروع",
  "budget": "الميزانية المقدرة إن ذُكرت",
  "timeline": "الجدول الزمني إن ذُكر",
  "keywords": ["كلمات مفتاحية للبحث"],
  "complexity": "بسيط/متوسط/معقد",
  "priority": "عادي/عاجل"
}

المجالات المتاحة:
- الأعمال والإدارة
- البرمجة والتقنية  
- التصميم والإبداع
- التسويق الإلكتروني
- الكتابة والترجمة
- الفيديو والصوتيات
- التدريب والاستشارات

أمثلة:
- "أبغى مصمم" → {"serviceCategories": ["التصميم والإبداع"], "specificSkills": ["تصميم"], "keywords": ["مصمم", "تصميم"]}
- "محتاج مطور موقع" → {"serviceCategories": ["البرمجة والتقنية"], "specificSkills": ["تطوير مواقع"], "keywords": ["مطور", "موقع"]}
- "أريد كاتب محتوى" → {"serviceCategories": ["الكتابة والترجمة"], "specificSkills": ["كتابة محتوى"], "keywords": ["كاتب", "محتوى"]}`;

      // Configure for structured analysis
      const generationConfig = {
        maxOutputTokens: config.gemini.analysisMaxTokens,
        temperature: config.gemini.analysisTemperature,
        topK: config.gemini.analysisTopK,
        topP: config.gemini.analysisTopP,
      };

      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Analysis timeout')), config.gemini.timeout);
      });

      // Generate analysis
      const responsePromise = this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: analysisPrompt }] }],
        generationConfig,
      });

      const result = await Promise.race([responsePromise, timeoutPromise]);
      const response = await result.response;
      const text = response.text().trim();

      // Try to parse JSON response
      let analysisResult;
      try {
        // Clean the response - remove markdown code blocks if present
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        analysisResult = JSON.parse(cleanText);
      } catch (parseError) {
        logger.warn('Failed to parse JSON analysis, using fallback:', parseError);
        // Fallback analysis based on simple keyword detection
        analysisResult = this.fallbackAnalysis(message);
      }

      logger.debug('Service analysis result:', analysisResult);
      return analysisResult;

    } catch (error) {
      logger.error('Error in AI service analysis:', error);
      // Return fallback analysis
      return this.fallbackAnalysis(message);
    }
  }

  /**
   * Fallback analysis when AI analysis fails
   * @param {string} message - User message
   * @returns {Object} Basic analysis result
   */
  fallbackAnalysis(message) {
    const messageText = message.toLowerCase();
    const result = {
      userIntent: "طلب خدمة",
      serviceCategories: [],
      specificSkills: [],
      keywords: [],
      complexity: "متوسط",
      priority: "عادي"
    };

    // Simple keyword mapping for fallback
    const keywordMap = {
      'التصميم والإبداع': ['تصميم', 'شعار', 'جرافيك', 'بنر', 'فلاير', 'مصمم', 'ديزاين'],
      'البرمجة والتقنية': ['موقع', 'تطبيق', 'برمجة', 'مطور', 'كود', 'سيستم', 'ويب', 'أندرويد', 'آيفون'],
      'الكتابة والترجمة': ['كتابة', 'محتوى', 'مقال', 'ترجمة', 'كاتب', 'نصوص'],
      'التسويق الإلكتروني': ['تسويق', 'إعلان', 'سوشال ميديا', 'فيسبوك', 'انستغرام', 'سيو'],
      'الفيديو والصوتيات': ['مونتاج', 'فيديو', 'صوت', 'أنيميشن', 'موشن'],
      'التدريب والاستشارات': ['تدريب', 'دورة', 'استشارة', 'تعليم']
    };

    // Find matching categories
    Object.entries(keywordMap).forEach(([category, keywords]) => {
      const hasMatch = keywords.some(keyword => messageText.includes(keyword));
      if (hasMatch) {
        result.serviceCategories.push(category);
        result.keywords.push(...keywords.filter(k => messageText.includes(k)));
      }
    });

    return result;
  }

  /**
   * Format enhanced freelancer context for Gemini AI
   * @param {Object} freelancerContext - Enhanced freelancer data from Supabase
   * @returns {string} Formatted freelancer information with profile details
   */
  formatFreelancerContext(freelancerContext) {
    if (!freelancerContext || freelancerContext.error) {
      return 'لا توجد بيانات مستقلين متاحة حالياً';
    }

    if (!freelancerContext.hasMatches) {
      const stats = freelancerContext.platformStats;
      return `إحصائيات المنصة المحدثة:
- إجمالي المستقلين: ${stats?.totalFreelancers || 0}
- المستقلين المعتمدين: ${stats?.verifiedFreelancers || 0}
- المتاحين حالياً: ${stats?.availableFreelancers || 0}
- المميزين: ${stats?.featuredFreelancers || 0}
- الأعلى تقييماً: ${stats?.topRatedFreelancers || 0}
- إجمالي المشاريع: ${stats?.totalProjects || 0}
- متوسط السعر: ${stats?.avgHourlyRate ? Math.round(stats.avgHourlyRate) + ' ريال/ساعة' : 'غير محدد'}
- المجالات المتاحة: ${Object.keys(stats?.categories || {}).join(', ')}
- مستويات الخبرة: ${Object.entries(stats?.experienceLevels || {}).map(([level, count]) => `${level}: ${count}`).join(', ')}
- أشهر المهارات: ${Object.entries(stats?.skillsCount || {}).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([skill, count]) => `${skill} (${count})`).join(', ')}`;
    }

    if (!freelancerContext.freelancers || freelancerContext.freelancers.length === 0) {
      return 'لم يتم العثور على مستقلين متطابقين لهذا الطلب';
    }

    let formatted = `المستقلين المتاحين (${freelancerContext.totalMatches}) في مجال: ${freelancerContext.detectedServices.join(', ')}\n\n`;
    
    freelancerContext.freelancers.forEach((freelancer, index) => {
      const rating = freelancer.average_rating > 0 ? `${freelancer.average_rating}/5 ⭐` : 'جديد';
      const profile = freelancer.profiles || (Array.isArray(freelancer.profiles) ? freelancer.profiles[0] : null);
      
      formatted += `${index + 1}. الاسم: ${freelancer.full_name}\n`;
      formatted += `   التخصص: ${freelancer.field}\n`;
      
      // Enhanced profile information
      if (profile) {
        if (profile.title) formatted += `   المسمى الوظيفي: ${profile.title}\n`;
        if (profile.location) formatted += `   الموقع: ${profile.location}\n`;
        if (profile.bio) formatted += `   النبذة: ${profile.bio.substring(0, 100)}${profile.bio.length > 100 ? '...' : ''}\n`;
        if (profile.hourly_rate) formatted += `   السعر: ${profile.hourly_rate} ريال/ساعة\n`;
        if (profile.minimum_project_budget) formatted += `   أقل ميزانية مشروع: ${profile.minimum_project_budget} ريال\n`;
        
        // Experience level
        if (profile.experience_level) {
          const expLabels = {
            'no_experience': 'مبتدئ - بدون خبرة',
            'less_than_1': 'مبتدئ - أقل من سنة',
            '1_to_2': 'متوسط - 1-2 سنة خبرة',
            '3_to_5': 'متقدم - 3-5 سنوات خبرة',
            '6_to_10': 'خبير - 6-10 سنوات خبرة',
            'more_than_10': 'خبير متقدم - أكثر من 10 سنوات'
          };
          formatted += `   مستوى الخبرة: ${expLabels[profile.experience_level] || profile.experience_level}\n`;
        }
        
        // Skills from profile
        if (profile.skills && Array.isArray(profile.skills) && profile.skills.length > 0) {
          formatted += `   المهارات: ${profile.skills.slice(0, 5).join(', ')}${profile.skills.length > 5 ? '...' : ''}\n`;
        }
        
        // Languages
        if (profile.languages && Array.isArray(profile.languages) && profile.languages.length > 0) {
          formatted += `   اللغات: ${profile.languages.join(', ')}\n`;
        }
        
        // Response time and service details
        if (profile.response_time) formatted += `   سرعة الرد: ${profile.response_time} ساعة\n`;
        if (profile.revision_rounds) formatted += `   جولات التعديل: ${profile.revision_rounds}\n`;
      }
      
      formatted += `   التقييم: ${rating}\n`;
      formatted += `   المشاريع المكتملة: ${freelancer.completed_projects || 0}\n`;
      formatted += `   إجمالي المشاريع: ${freelancer.total_projects || 0}\n`;
      
      // Enhanced status with multiple indicators
      let statusParts = [];
      if (freelancer.is_verified) statusParts.push('معتمد ✅');
      if (profile?.is_featured) statusParts.push('مميز ⭐');
      if (profile?.is_top_rated) statusParts.push('الأعلى تقييماً 🏆');
      
      // Availability status
      if (profile?.availability_status === 'available') statusParts.push('متاح للعمل 🟢');
      else if (profile?.availability_status === 'busy') statusParts.push('مشغول حالياً 🟡');
      else if (profile?.availability_status === 'unavailable') statusParts.push('غير متاح 🔴');
      
      formatted += `   الحالة: ${statusParts.join(' | ') || 'قيد المراجعة'}\n`;
      
      // Portfolio projects count
      if (freelancer.projects && Array.isArray(freelancer.projects)) {
        formatted += `   مشاريع المعرض: ${freelancer.projects.length}\n`;
        if (freelancer.projects.length > 0) {
          const recentProject = freelancer.projects[0];
          if (recentProject.title) {
            formatted += `   آخر مشروع: "${recentProject.title}"\n`;
          }
        }
      }
      
      // Profile completion and views
      if (profile?.profile_completion_percentage) {
        formatted += `   اكتمال الملف الشخصي: ${profile.profile_completion_percentage}%\n`;
      }
      if (profile?.profile_views) {
        formatted += `   مشاهدات الملف الشخصي: ${profile.profile_views}\n`;
      }
      
      formatted += `\n`;
    });

    formatted += `\n🎯 يمكنك الآن أن تقترح على العميل أفضل المستقلين المناسبين لطلبه مع ذكر:
- أسماءهم الحقيقية وتخصصاتهم التفصيلية
- مستوى خبرتهم ومهاراتهم المحددة
- أسعارهم وسرعة ردهم
- حالة توفرهم للعمل
- نماذج من أعمالهم السابقة
- تقييماتهم ومعدل إنجازهم للمشاريع

استخدم هذه المعلومات لتقديم توصيات دقيقة ومفصلة للعميل.`;
    
    return formatted;
  }

  /**
   * Generate AI response with freelancer context using Gemini
   * @param {string} message - User message
   * @param {Array} conversationHistory - Previous messages for context
   * @param {Object} freelancerContext - Available freelancers data
   * @returns {string} AI response
   */
  async generateResponseWithFreelancers(message, conversationHistory = [], freelancerContext = {}) {
    try {
      logger.debug('Generating Gemini response with freelancer context', { 
        message, 
        hasMatches: freelancerContext.hasMatches 
      });

      // Build prompt with conversation context and freelancer data
      const context = this.formatConversationContext(conversationHistory);
      const freelancerInfo = this.formatFreelancerContext(freelancerContext);
      const userPrompt = context ? `${context}\nUser: ${message}` : message;
      
      // Enhanced system prompt with real-time freelancer data
      const enhancedPrompt = `${KHADUM_SYSTEM_PROMPT}

## 📊 REAL-TIME FREELANCER DATA:
${freelancerInfo}

## 🎯 IMPORTANT INSTRUCTIONS:
- Use the freelancer data above to provide SPECIFIC recommendations
- Mention real freelancer names, their ratings, and specializations
- If freelancers are found, suggest the best matches
- Always be enthusiastic about the available talent
- Use the Saudi conversational style with real data

المحادثة:
${userPrompt}`;

      // Configure generation parameters - optimized for Khadum with freelancer data
      const generationConfig = {
        maxOutputTokens: config.gemini.responseMaxTokens,
        temperature: config.gemini.responseTemperature,
        topK: config.gemini.responseTopK,
        topP: config.gemini.responseTopP,
      };

      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Gemini API timeout')), config.gemini.timeout);
      });

      // Generate response with timeout
      const responsePromise = this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: enhancedPrompt }] }],
        generationConfig,
      });

      const result = await Promise.race([responsePromise, timeoutPromise]);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error('Empty response from Gemini');
      }

      logger.debug('Gemini response with freelancers generated successfully');
      return text.trim();
    } catch (error) {
      logger.error('Gemini API error with freelancers:', error);
      
      // Fallback to regular response if freelancer-enhanced fails
      return this.generateResponse(message, conversationHistory);
    }
  }

  /**
   * Generate AI response using Gemini (original method for backward compatibility)
   * @param {string} message - User message
   * @param {Array} conversationHistory - Previous messages for context
   * @returns {string} AI response
   */
  async generateResponse(message, conversationHistory = []) {
    try {
      logger.debug('Generating Gemini response', { message });

      // Build prompt with conversation context and system instruction
      const context = this.formatConversationContext(conversationHistory);
      const userPrompt = context ? `${context}\nUser: ${message}` : message;

      // Include system prompt in each request to ensure it's followed
      const fullPrompt = `${KHADUM_SYSTEM_PROMPT}\n\nالمحادثة:\n${userPrompt}`;

      // Configure generation parameters - optimized for Khadum
      const generationConfig = {
        maxOutputTokens: config.gemini.maxOutputTokens,
        temperature: config.gemini.temperature,
        topK: config.gemini.responseTopK,
        topP: config.gemini.responseTopP,
      };

      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Gemini API timeout')), config.gemini.timeout);
      });

      // Generate response with timeout
      const responsePromise = this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig,
      });

      const result = await Promise.race([responsePromise, timeoutPromise]);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error('Empty response from Gemini');
      }

      logger.debug('Gemini response generated successfully');
      return text.trim();
    } catch (error) {
      logger.error('Gemini API error:', error);
      
      // Return fallback message
      if (error.message === 'Gemini API timeout') {
        return '⏱️ Sorry, the AI is taking too long to respond. Please try again.';
      } else if (error.message?.includes('quota')) {
        return '🚫 AI service quota exceeded. Please try again later.';
      } else {
        return '🤖 Sorry, I encountered an error while processing your message. Please try again.';
      }
    }
  }

  /**
   * Check if message is a command
   * @param {string} message - User message
   * @returns {Object} Command info or null
   */
  parseCommand(message) {
    const trimmed = message.trim().toLowerCase();
    
    if (trimmed === '/clear' || trimmed === '/reset') {
      return { command: 'clear', description: 'Clear conversation history' };
    }
    
    if (trimmed === '/help') {
      return { command: 'help', description: 'Show help message' };
    }
    
    if (trimmed === '/info') {
      return { command: 'info', description: 'Show bot information' };
    }
    
    return null;
  }

  /**
   * Get help message
   */
  getHelpMessage() {
    return `🤖 *هلا فيك! أنا خدوم - مساعدك الذكي*

الأوامر المتاحة:
• /help - عرض هذه الرسالة
• /clear - مسح محفوظات المحادثة  
• /info - معلومات عن البوت

💬 فقط كلمني عادي وراح أساعدك تلقى أفضل مستقل!
📝 آخر 20 رسالة محفوظة عشان أفهمك أحسن.

🚀 جرب تقول: "أبغى مصمم" أو "أحتاج مطور موقع"`;
  }

  /**
   * Generate AI response with ALL available data context (NEW APPROACH)
   * @param {string} message - User message
   * @param {Array} conversationHistory - Previous messages for context
   * @param {Object} allData - Complete data from all Supabase tables
   * @param {string} username - User's WhatsApp name
   * @returns {string} AI response
   */
  async generateResponseWithAllData(message, conversationHistory = [], allData = {}, username = 'User') {
    try {
      logger.debug('🧠 Generating Gemini response with ALL data context', { 
        message, 
        freelancersCount: allData.freelancers?.length || 0,
        profilesCount: allData.profiles?.length || 0,
        projectsCount: allData.projects?.length || 0
      });

      // Format conversation context
      const context = this.formatConversationContext(conversationHistory);
      const userPrompt = context ? `${context}\n${username}: ${message}` : `${username}: ${message}`;
      
      // Format ALL data for AI context
      const allDataContext = this.formatAllDataForAI(allData);
      
      // Enhanced system prompt with complete data
      const enhancedPrompt = `${KHADUM_SYSTEM_PROMPT}

## 📊 COMPLETE PLATFORM DATA CONTEXT:
# This message is not part of user message - freelancers: ${JSON.stringify(allData.freelancers || [], null, 2)}
# profiles: ${JSON.stringify(allData.profiles || [], null, 2)}
# projects: ${JSON.stringify(allData.projects || [], null, 2)}
# metadata: ${JSON.stringify(allData.metadata || {}, null, 2)}

${allDataContext}

## 🎯 IMPORTANT INSTRUCTIONS:
- You have access to ALL freelancers, profiles, and projects data above
- Use this complete data to provide SPECIFIC recommendations
- Mention real freelancer names, their ratings, specializations, and availability
- Match user requests with the most suitable freelancers from the complete dataset
- Always be enthusiastic about the available talent
- Use the Saudi conversational style with real data
- If no perfect match, suggest similar or related freelancers

## 🚨 CRITICAL: When to show buttons:
- If user provides: PROJECT DESCRIPTION + BUDGET + TIMELINE
- AND you recommend a specific freelancer with details
- THEN add [SHOW_BUTTONS] at the end of your response
- This will show accept/reject buttons to the user
- Example: "أنصحك بـ فاطمة علي السعد للمشروع... [SHOW_BUTTONS]"

# The user message: ${userPrompt}`;

      // Configure generation parameters
      const generationConfig = {
        maxOutputTokens: config.gemini.responseMaxTokens,
        temperature: config.gemini.responseTemperature,
        topK: config.gemini.responseTopK,
        topP: config.gemini.responseTopP,
      };

      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Gemini API timeout')), config.gemini.timeout);
      });

      // Generate response with timeout
      const responsePromise = this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: enhancedPrompt }] }],
        generationConfig,
      });

      const result = await Promise.race([responsePromise, timeoutPromise]);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error('Empty response from Gemini');
      }

      logger.debug('✅ Gemini response with ALL data generated successfully');
      return text.trim();
    } catch (error) {
      logger.error('❌ Gemini API error with all data:', error);
      
      // Fallback to regular response if all-data approach fails
      return this.generateResponse(message, conversationHistory);
    }
  }

  /**
   * Format ALL data for AI context in a readable format
   * @param {Object} allData - Complete data from Supabase
   * @returns {string} Formatted data context
   */
  formatAllDataForAI(allData) {
    if (!allData || (!allData.freelancers && !allData.profiles && !allData.projects)) {
      return 'لا توجد بيانات متاحة حالياً';
    }

    let formatted = `## 📊 بيانات المنصة الكاملة المحدثة:\n\n`;
    
    // Metadata summary
    if (allData.metadata) {
      formatted += `### إحصائيات عامة:\n`;
      formatted += `- إجمالي المستقلين: ${allData.metadata.totalFreelancers || 0}\n`;
      formatted += `- إجمالي الملفات الشخصية: ${allData.metadata.totalProfiles || 0}\n`;
      formatted += `- إجمالي المشاريع: ${allData.metadata.totalProjects || 0}\n`;
      formatted += `- آخر تحديث: ${allData.metadata.fetchedAt || 'غير محدد'}\n\n`;
    }

    // Freelancers data
    if (allData.freelancers && allData.freelancers.length > 0) {
      formatted += `### 👥 المستقلين المتاحين (${allData.freelancers.length}):\n`;
      
      allData.freelancers.forEach((freelancer, index) => {
        const rating = freelancer.average_rating > 0 ? `${freelancer.average_rating}/5 ⭐` : 'جديد';
        const profile = freelancer.profiles || (Array.isArray(freelancer.profiles) ? freelancer.profiles[0] : null);
        
        formatted += `\n${index + 1}. **${freelancer.full_name}**\n`;
        formatted += `   - التخصص: ${freelancer.field}\n`;
        formatted += `   - التقييم: ${rating}\n`;
        formatted += `   - المشاريع المكتملة: ${freelancer.completed_projects || 0}\n`;
        formatted += `   - معتمد: ${freelancer.is_verified ? 'نعم ✅' : 'لا'}\n`;
        
        if (profile) {
          if (profile.title) formatted += `   - المسمى: ${profile.title}\n`;
          if (profile.location) formatted += `   - الموقع: ${profile.location}\n`;
          if (profile.hourly_rate) formatted += `   - السعر: ${profile.hourly_rate} ريال/ساعة\n`;
          if (profile.availability_status) {
            const statusMap = {
              'available': 'متاح 🟢',
              'busy': 'مشغول 🟡',
              'unavailable': 'غير متاح 🔴'
            };
            formatted += `   - الحالة: ${statusMap[profile.availability_status] || profile.availability_status}\n`;
          }
          if (profile.skills && Array.isArray(profile.skills)) {
            formatted += `   - المهارات: ${profile.skills.slice(0, 3).join(', ')}${profile.skills.length > 3 ? '...' : ''}\n`;
          }
          if (profile.experience_level) {
            const expLabels = {
              'no_experience': 'مبتدئ',
              'less_than_1': 'أقل من سنة',
              '1_to_2': '1-2 سنة',
              '3_to_5': '3-5 سنوات',
              '6_to_10': '6-10 سنوات',
              'more_than_10': 'أكثر من 10 سنوات'
            };
            formatted += `   - الخبرة: ${expLabels[profile.experience_level] || profile.experience_level}\n`;
          }
          if (profile.is_featured) formatted += `   - مميز ⭐\n`;
          if (profile.is_top_rated) formatted += `   - الأعلى تقييماً 🏆\n`;
        }
        
        // Projects count
        if (freelancer.projects && Array.isArray(freelancer.projects)) {
          formatted += `   - مشاريع المعرض: ${freelancer.projects.length}\n`;
        }
      });
    }

    // Additional profiles (if any exist without freelancer records)
    if (allData.profiles && allData.profiles.length > 0) {
      const standaloneProfiles = allData.profiles.filter(profile => 
        !allData.freelancers?.some(freelancer => 
          freelancer.profiles?.user_id === profile.user_id || 
          (Array.isArray(freelancer.profiles) && freelancer.profiles.some(p => p.user_id === profile.user_id))
        )
      );
      
      if (standaloneProfiles.length > 0) {
        formatted += `\n### 📋 ملفات شخصية إضافية (${standaloneProfiles.length}):\n`;
        standaloneProfiles.slice(0, 5).forEach((profile, index) => {
          formatted += `\n${index + 1}. **${profile.display_name || 'غير محدد'}**\n`;
          if (profile.title) formatted += `   - المسمى: ${profile.title}\n`;
          if (profile.bio) formatted += `   - النبذة: ${profile.bio.substring(0, 100)}...\n`;
          if (profile.skills && Array.isArray(profile.skills)) {
            formatted += `   - المهارات: ${profile.skills.slice(0, 3).join(', ')}\n`;
          }
        });
      }
    }

    // Projects summary
    if (allData.projects && allData.projects.length > 0) {
      formatted += `\n### 🎨 نماذج المشاريع (${allData.projects.length}):\n`;
      
      // Group projects by tags/categories
      const projectsByCategory = {};
      allData.projects.forEach(project => {
        if (project.tags && Array.isArray(project.tags)) {
          project.tags.forEach(tag => {
            if (!projectsByCategory[tag]) projectsByCategory[tag] = [];
            projectsByCategory[tag].push(project);
          });
        }
      });
      
      Object.entries(projectsByCategory).slice(0, 5).forEach(([category, projects]) => {
        formatted += `   - ${category}: ${projects.length} مشروع\n`;
      });
    }

    formatted += `\n🎯 **استخدم هذه البيانات الكاملة لتقديم توصيات دقيقة ومحددة للعميل بناءً على طلبه.**`;
    
    return formatted;
  }

  /**
   * Get info message
   */
  getInfoMessage() {
    return `ℹ️ *معلومات عن خدوم*
    
🤖 مدعوم بالذكاء الاصطناعي Gemini
💾 محفوظات المحادثة: آخر 20 رسالة
⏱️ زمن الاستجابة: ${config.gemini.timeout / 1000} ثانية
🇸🇦 أكبر منصة ربط العملاء بالمستقلين في السعودية
    
كلمني عادي وراح أساعدك! 🌟`;
  }
}

export const geminiService = new GeminiService();
