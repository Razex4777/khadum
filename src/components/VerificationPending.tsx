import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Clock, 
  Mail, 
  Phone, 
  FileText, 
  AlertCircle,
  CheckCircle,
  X,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationPendingProps {
  freelancerData?: {
    full_name: string;
    email: string;
    whatsapp_number: string;
    field: string;
    created_at: string;
  };
  onClose?: () => void;
  isPopup?: boolean;
}

const VerificationPending: React.FC<VerificationPendingProps> = ({ 
  freelancerData, 
  onClose,
  isPopup = true 
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    // Add refresh logic here - check verification status
    setTimeout(() => {
      setIsRefreshing(false);
      // Reload page or update status
      window.location.reload();
    }, 2000);
  };

  const steps = [
    {
      id: 'submitted',
      title: 'تم إرسال الطلب',
      description: 'تم استلام طلب التسجيل الخاص بك',
      status: 'completed',
      icon: CheckCircle
    },
    {
      id: 'review',
      title: 'مراجعة البيانات',
      description: 'يقوم فريقنا بمراجعة معلوماتك',
      status: 'current',
      icon: Clock
    },
    {
      id: 'verification',
      title: 'التحقق من الهوية',
      description: 'التأكد من صحة البيانات المرسلة',
      status: 'pending',
      icon: ShieldCheck
    },
    {
      id: 'approval',
      title: 'الموافقة النهائية',
      description: 'تفعيل حسابك على المنصة',
      status: 'pending',
      icon: CheckCircle
    }
  ];

  const getStepStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'current':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'pending':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const containerClasses = isPopup 
    ? "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    : "min-h-screen bg-background p-6";

  const cardClasses = isPopup 
    ? "w-full max-w-2xl bg-card/95 backdrop-blur-xl border-border neon-ring"
    : "w-full max-w-4xl mx-auto bg-card/80 backdrop-blur-xl border-border neon-ring";

  return (
    <div className={cn(containerClasses, "font-tajawal")}>
      {/* Background Effects */}
      {!isPopup && (
        <div className="absolute inset-0" style={{ backgroundImage: 'var(--gradient-hero)' }}></div>
      )}
      
      <div className="relative z-10 w-full flex justify-center">
        <Card className={cardClasses}>
          {/* Header */}
          <CardHeader className="relative">
            {isPopup && onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute top-4 left-4 hover:bg-destructive/20"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
              
              <div>
                <CardTitle className="text-2xl text-foreground neon-text">
                  حسابك قيد المراجعة
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  يرجى الانتظار حتى يتم التحقق من بياناتك وتفعيل حسابك
                </CardDescription>
              </div>
              
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                <AlertCircle className="w-4 h-4 ml-2" />
                في انتظار الموافقة
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* User Info Summary */}
            {freelancerData && (
              <Card className="bg-muted/50 border-border/50">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-3">معلومات الطلب</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">الاسم:</span>
                      <span className="text-foreground">{freelancerData.full_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">البريد:</span>
                      <span className="text-foreground">{freelancerData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">الواتساب:</span>
                      <span className="text-foreground">{freelancerData.whatsapp_number}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">التخصص:</span>
                      <span className="text-foreground">{freelancerData.field}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Verification Steps */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">مراحل التحقق</h3>
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="flex items-start gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                        getStepStatus(step.status)
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                      {step.status === 'current' && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Expected Timeline */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <h4 className="font-medium text-foreground">الوقت المتوقع للمراجعة</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  عادة ما تستغرق عملية المراجعة من 24 إلى 48 ساعة عمل. 
                  سيتم إشعارك عبر البريد الإلكتروني والواتساب فور تفعيل حسابك.
                </p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleRefreshStatus}
                disabled={isRefreshing}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                    جاري التحديث...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 ml-2" />
                    تحديث الحالة
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.open('https://wa.me/966509811981', '_blank')}
                className="flex-1 border-border hover:bg-muted"
              >
                <Phone className="w-4 h-4 ml-2" />
                تواصل معنا
              </Button>
            </div>

            {/* Help Section */}
            <Card className="bg-muted/30 border-border/50">
              <CardContent className="p-4">
                <h4 className="font-medium text-foreground mb-2">هل تحتاج مساعدة؟</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  إذا كان لديك أي استفسارات حول حالة طلبك أو تحتاج إلى مساعدة إضافية، 
                  لا تتردد في التواصل مع فريق الدعم.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline" className="bg-background/50">
                    <Mail className="w-3 h-3 ml-1" />
                    help@khadum.app
                  </Badge>
                  <Badge variant="outline" className="bg-background/50">
                    <Phone className="w-3 h-3 ml-1" />
                    +966511809878
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationPending;


