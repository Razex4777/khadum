import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneInput, validatePhoneNumber } from "@/components/ui/phone-input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Briefcase, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface FreelancerFormData {
  full_name: string;
  national_id: string;
  email: string;
  whatsapp_number: string;
  field: string;
  country_code: string;
}

// Validation rules interface
interface ValidationRule {
  min?: number;
  max?: number;
  exact?: number;
  pattern?: RegExp;
}

// Validation constants
const VALIDATION_RULES: Record<string, ValidationRule> = {
  full_name: { min: 2, max: 50, pattern: /^[a-zA-Zأ-ي\s]+$/ },
  national_id: { min: 10, max: 15, pattern: /^[0-9]+$/ },
  email: { max: 100, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  whatsapp_number: { min: 8, max: 15, pattern: /^[0-9]+$/ }
};

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [freelancerData, setFreelancerData] = useState<FreelancerFormData>({
    full_name: '',
    national_id: '',
    email: '',
    whatsapp_number: '',
    field: '',
    country_code: 'SA'
  });

  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  // Service categories structure
  const serviceCategories = {
    'business': {
      name: 'الأعمال والإدارة',
      subcategories: [
        'إدخال البيانات',
        'تخطيط الأعمال',
        'استشارات أعمال',
        'التجارة الإلكترونية',
        'الخدمات القانونية',
        'الخدمات المالية / المحاسبة',
        'الدراسات والأبحاث',
        'الإرشاد الوظيفي',
        'مساعد افتراضي',
        'خدمة العملاء',
        'إدارة الموارد البشرية',
        'الدعم الإداري'
      ]
    },
    'programming': {
      name: 'البرمجة والتقنية',
      subcategories: [
        'تطوير مواقع (HTML، CSS، PHP، ووردبريس، أنظمة إدارة المحتوى…)',
        'Java / .NET',
        'Python',
        'تطبيقات الهواتف الذكية',
        'تطبيقات سطح المكتب',
        'تطوير المتاجر الإلكترونية',
        'الدعم الفني / اختبار الجودة QA',
        'إدارة الخوادم / لينكس',
        'تقنية المعلومات والشبكات',
        'الهندسة العامة والدعم الفني'
      ]
    },
    'design': {
      name: 'التصميم والإبداع (جرافيك / بصريات)',
      subcategories: [
        'تصميم شعارات',
        'بطاقات أعمال',
        'أغلفة كتب',
        'فلايرات / كروت دعائية',
        'بنرات',
        'تصميم تيشيرتات',
        'عروض تقديمية',
        'تعديل الصور',
        'رسوم كرتونية',
        'تصميم معماري وديكور',
        'ابتكار بصري'
      ]
    },
    'marketing': {
      name: 'التسويق الإلكتروني',
      subcategories: [
        'إدارة حسابات التواصل الاجتماعي (إنستقرام، فيسبوك، سناب، تويتر، يوتيوب)',
        'التسويق عبر البريد الإلكتروني',
        'تسويق المحتوى',
        'تحليل البيانات وتحسين محركات البحث (SEO)',
        'الإعلان الرقمي (SEM)',
        'استراتيجيات المبيعات والتسويق'
      ]
    },
    'writing': {
      name: 'الكتابة والترجمة',
      subcategories: [
        'كتابة إبداعية',
        'محتوى مواقع',
        'محتوى متخصص (تقني، طبي، قانوني…)',
        'مقالات ومراجعات',
        'كتابة نصوص سيناريو',
        'نصوص إعلانية',
        'كتابة السيرة الذاتية',
        'تفريغ نصوص من الصوت أو الفيديو',
        'الترجمة (عربي ↔ إنجليزي ↔ فرنسي)',
        'التدقيق اللغوي',
        'التلخيص'
      ]
    },
    'video_editing': {
      name: 'الفيديو والصوتيات',
      subcategories: [
        'مونتاج الفيديو',
        'مقدمات (Intro) مرئية',
        'موشن جرافيك',
        'رسومات متحركة (GIF)',
        'تصميمات Whiteboard',
        'التعليق الصوتي',
        'تحرير ملفات بودكاست',
        'إنتاج كتب صوتية مسموعة',
        'تأليف/تلحين موسيقي',
        'إعداد أنظمة الرد الآلي (IVR)'
      ]
    },
    'training': {
      name: 'التدريب والاستشارات',
      subcategories: [
        'تقديم دورات أونلاين في مجالات مثل البرمجة أو التسويق أو التصميم أو اللغات',
        'مساعدة في حل الواجبات أو الترجمة الأكاديمية',
        'تطوير حقائب تدريبية متخصصة',
        'استشارات في التسويق، القانون، المال، والأعمال'
      ]
    }
  };

  // Handle main category selection
  const handleMainCategoryChange = (categoryKey: string) => {
    setSelectedMainCategory(categoryKey);
    setSelectedSubCategory(''); // Reset subcategory
    setFreelancerData({...freelancerData, field: ''}); // Reset field until subcategory is selected
  };

  // Handle subcategory selection
  const handleSubCategoryChange = (subcategory: string) => {
    setSelectedSubCategory(subcategory);
    // Combine main category and subcategory for storage
    const fullService = `${serviceCategories[selectedMainCategory as keyof typeof serviceCategories].name} - ${subcategory}`;
    setFreelancerData({...freelancerData, field: fullService});
  };

  // Validation functions
  const validateField = (name: keyof FreelancerFormData, value: string): string | null => {
    const rules = VALIDATION_RULES[name];
    if (!rules) return null;

    switch (name) {
      case 'full_name':
        if (rules.min && value.length < rules.min) return `الاسم يجب أن يكون ${rules.min} أحرف على الأقل`;
        if (rules.max && value.length > rules.max) return `الاسم يجب أن يكون أقل من ${rules.max} حرف`;
        if (rules.pattern && !rules.pattern.test(value)) return 'الاسم يجب أن يحتوي على أحرف فقط';
        break;
      
      case 'national_id':
        if (rules.min && value.length < rules.min) return `رقم الهوية يجب أن يكون ${rules.min} أرقام على الأقل`;
        if (rules.max && value.length > rules.max) return `رقم الهوية يجب أن يكون أقل من ${rules.max} رقم`;
        if (rules.pattern && !rules.pattern.test(value)) return 'رقم الهوية يجب أن يحتوي على أرقام فقط';
        break;
      
      case 'email':
        if (rules.max && value.length > rules.max) return 'البريد الإلكتروني طويل جداً';
        if (rules.pattern && !rules.pattern.test(value)) return 'تنسيق البريد الإلكتروني غير صحيح';
        break;
      
      case 'whatsapp_number':
        if (rules.min && value.length < rules.min) return `رقم الواتساب يجب أن يكون ${rules.min} أرقام على الأقل`;
        if (rules.max && value.length > rules.max) return `رقم الواتساب يجب أن يكون أقل من ${rules.max} رقم`;
        if (rules.pattern && !rules.pattern.test(value)) return 'رقم الواتساب يجب أن يحتوي على أرقام فقط';
        break;
      

    }
    return null;
  };

  // Input handlers with restrictions
  const handleInputChange = (field: keyof FreelancerFormData, value: string) => {
    let sanitizedValue = value;

    // Apply input restrictions
    switch (field) {
      case 'national_id':
      case 'whatsapp_number':
        sanitizedValue = value.replace(/[^0-9]/g, ''); // Numbers only
        break;
      case 'full_name':
        sanitizedValue = value.replace(/[^a-zA-Zأ-ي\s]/g, ''); // Letters and spaces only
        break;
    }

    setFreelancerData({...freelancerData, [field]: sanitizedValue});
  };

  // Helper function for Arabic field labels
  const getFieldLabel = (field: keyof FreelancerFormData): string => {
    const labels = {
      full_name: 'الاسم الكامل',
      national_id: 'رقم الهوية/الإقامة',
      email: 'البريد الإلكتروني',
      whatsapp_number: 'رقم الواتساب',
      field: 'المجال والتخصص',
      country_code: 'رمز الدولة'
    };
    return labels[field];
  };

  const handleFreelancerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Comprehensive validation
      const requiredFields = ['full_name', 'national_id', 'email', 'whatsapp_number', 'field'] as const;
      
      // Check required fields
      for (const field of requiredFields) {
        if (!freelancerData[field].trim()) {
          throw new Error(`الحقل مطلوب: ${getFieldLabel(field)}`);
        }
        
        // Validate each field
        const error = validateField(field, freelancerData[field]);
        if (error) {
          throw new Error(`${getFieldLabel(field)}: ${error}`);
        }
      }

      // Additional validation for service selection
      if (!selectedMainCategory) {
        throw new Error('يرجى اختيار المجال الرئيسي');
      }
      if (!selectedSubCategory) {
        throw new Error('يرجى اختيار التخصص الفرعي');
      }

      // Validate optional fields if provided


      // Validate WhatsApp number with country code
      const fullWhatsAppNumber = freelancerData.whatsapp_number;
      if (!validatePhoneNumber(fullWhatsAppNumber, freelancerData.country_code)) {
        throw new Error('رقم الواتساب غير صحيح للدولة المختارة');
      }

      const { data, error } = await supabase
        .from('freelancers')
        .insert([
          {
            full_name: freelancerData.full_name,
            national_id: freelancerData.national_id,
            email: freelancerData.email,
            whatsapp_number: freelancerData.whatsapp_number,
            field: freelancerData.field,
            is_verified: false
          }
        ])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('البريد الإلكتروني مسجل مسبقاً');
        }
        throw error;
      }

      toast({
        title: "تم التسجيل بنجاح",
        description: "تم إنشاء حسابك كمستقل بنجاح. سيتم مراجعة بياناتك قريباً",
      });

      navigate('/authentication/login');
    } catch (error: any) {
      toast({
        title: "خطأ في التسجيل",
        description: error.message || "حدث خطأ أثناء إنشاء الحساب",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-tajawal relative overflow-hidden p-4 theme-gradient">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'var(--gradient-hero)' }}></div>

      
      <div className="relative z-10 container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>العودة للرئيسية</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
            <span className="font-extrabold tracking-tight text-lg text-foreground">خدوم</span>
            <Badge className="accent-ring">متاح الآن</Badge>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="bg-card/80 backdrop-blur-xl border-border theme-shadow">
        <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground accent-text flex items-center justify-center gap-2">
                <Briefcase className="h-6 w-6" />
                تسجيل مستقل جديد
              </CardTitle>
          <CardDescription className="text-muted-foreground400">
                انضم إلى شبكة المستقلين في خدوم واحصل على عملاء جدد
          </CardDescription>
        </CardHeader>
        <CardContent>
              <form onSubmit={handleFreelancerSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="freelancer-name" className="text-muted-foreground300">الاسم الكامل</Label>
                  <Input
                    id="freelancer-name"
                    type="text"
                    placeholder="أدخل اسمك الكامل (أحرف فقط)"
                    value={freelancerData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    required
                    maxLength={50}
                    className="text-right bg-input700/50 border-border600 text-white placeholder:text-muted-foreground400 focus:border-green-500 focus:ring-green-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="freelancer-id" className="text-muted-foreground300">رقم الهوية/الإقامة</Label>
                  <Input
                    id="freelancer-id"
                    type="text"
                    inputMode="numeric"
                    placeholder="أدخل رقم الهوية أو الإقامة (أرقام فقط)"
                    value={freelancerData.national_id}
                    onChange={(e) => handleInputChange('national_id', e.target.value)}
                    required
                    minLength={10}
                    maxLength={15}
                    className="text-right bg-input700/50 border-border600 text-white placeholder:text-muted-foreground400 focus:border-green-500 focus:ring-green-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="freelancer-email" className="text-muted-foreground300">البريد الإلكتروني</Label>
                  <Input
                    id="freelancer-email"
                    type="email"
                    placeholder="example@email.com"
                    value={freelancerData.email}
                    onChange={(e) => setFreelancerData({...freelancerData, email: e.target.value})}
                    required
                    maxLength={100}
                    className="text-right bg-input700/50 border-border600 text-white placeholder:text-muted-foreground400 focus:border-green-500 focus:ring-green-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="freelancer-whatsapp" className="text-muted-foreground300">رقم الواتساب</Label>
                  <PhoneInput
                    value={freelancerData.whatsapp_number}
                    onChange={(value) => handleInputChange('whatsapp_number', value)}
                    countryCode={freelancerData.country_code}
                    onCountryChange={(code) => setFreelancerData({...freelancerData, country_code: code})}
                    language="ar"
                    required
                  />
                  <p className="text-xs text-muted-foreground400">
                    أرقام فقط (8-15 رقم) • مثال للسعودية: 0501234567 → 966501234567
                  </p>
                </div>

                {/* Main Service Category */}
                <div className="space-y-2">
                  <Label htmlFor="freelancer-main-category" className="text-muted-foreground300">المجال الرئيسي</Label>
                  <Select value={selectedMainCategory} onValueChange={handleMainCategoryChange}>
                    <SelectTrigger className="text-right bg-input700/50 border-border600 text-white">
                      <SelectValue placeholder="اختر المجال الرئيسي" />
                    </SelectTrigger>
                    <SelectContent className="bg-input800 border-border700 max-h-80">
                      {Object.entries(serviceCategories).map(([key, category]) => (
                        <SelectItem key={key} value={key} className="text-white hover:bg-input700">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sub Service Category */}
                {selectedMainCategory && (
                  <div className="space-y-2">
                    <Label htmlFor="freelancer-sub-category" className="text-muted-foreground300">التخصص الفرعي</Label>
                    <Select value={selectedSubCategory} onValueChange={handleSubCategoryChange}>
                      <SelectTrigger className="text-right bg-input700/50 border-border600 text-white">
                        <SelectValue placeholder="اختر التخصص الفرعي" />
                      </SelectTrigger>
                      <SelectContent className="bg-input800 border-border700 max-h-80">
                        {serviceCategories[selectedMainCategory as keyof typeof serviceCategories].subcategories.map((subcategory, index) => (
                          <SelectItem key={index} value={subcategory} className="text-white hover:bg-input700 text-right">
                            {subcategory}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground400">
                      المجال المحدد: {freelancerData.field}
                    </p>
                  </div>
                )}





                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري التسجيل..." : "تسجيل كمستقل"}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <div className="text-sm text-muted-foreground400">
                  لديك حساب مستقل بالفعل؟{" "}
                  <Link to="/authentication/login" className="text-green-400 hover:text-green-300 hover:underline transition-colors">
                تسجيل الدخول
                  </Link>
                </div>
                <div className="text-xs text-muted-foreground500 mt-2">
                  العملاء يمكنهم التواصل معنا مباشرة عبر واتساب
                </div>
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;