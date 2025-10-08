import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    MessageCircle, Briefcase, DollarSign, Star, TrendingUp, 
    Zap, Target, Award, Clock, CheckCircle, ArrowRight, Sparkles
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-ultra-light font-tajawal p-6 relative overflow-hidden">
            {/* Animated Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Welcome Header with Animation */}
                <div className="mb-8 animate-in slide-in-from-top duration-700">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-dark to-primary bg-clip-text text-transparent mb-2 flex items-center gap-3">
                                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                                مرحباً بك في لوحة التحكم
                            </h1>
                            <p className="text-lg text-muted-foreground">إليك نظرة سريعة على أدائك اليوم</p>
                        </div>
                        <Badge className="bg-gradient-to-r from-primary to-primary-dark text-white border-0 px-4 py-2 text-base shadow-lg">
                            <CheckCircle className="w-4 h-4 ml-2" />
                            متاح للعمل
                        </Badge>
                    </div>
                </div>

                {/* Premium Stats Cards with Gradients */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { 
                            icon: MessageCircle, 
                            label: "طلبات نشطة", 
                            value: "3", 
                            subtitle: "مشروع جاري", 
                            gradient: "from-blue-500 to-cyan-500",
                            bgGradient: "from-blue-50 to-cyan-50"
                        },
                        { 
                            icon: Briefcase, 
                            label: "مشاريع مكتملة", 
                            value: "12", 
                            subtitle: "+2 هذا الشهر", 
                            gradient: "from-primary to-primary-dark",
                            bgGradient: "from-primary-ultra-light to-primary-ultra-light"
                        },
                        { 
                            icon: Star, 
                            label: "التقييم", 
                            value: "4.8", 
                            subtitle: "من 5 نجوم", 
                            gradient: "from-yellow-500 to-orange-500",
                            bgGradient: "from-yellow-50 to-orange-50"
                        },
                        { 
                            icon: DollarSign, 
                            label: "الأرباح", 
                            value: "5,450 ر.س", 
                            subtitle: "هذا الشهر", 
                            gradient: "from-green-500 to-emerald-500",
                            bgGradient: "from-green-50 to-emerald-50"
                        }
                    ].map((stat, index) => (
                        <Card 
                            key={index}
                            className={`relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br ${stat.bgGradient} animate-in slide-in-from-bottom`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -mr-12 -mt-12`} />
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600">{stat.label}</CardTitle>
                                <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                                    <stat.icon className="h-5 w-5 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{stat.value}</div>
                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    {stat.subtitle}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Actions - Enhanced */}
                    <Card className="lg:col-span-2 glass-card border-0 shadow-2xl animate-in slide-in-from-left duration-700">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2 text-2xl">
                                <Zap className="w-6 h-6 text-primary" />
                                إجراءات سريعة
                            </CardTitle>
                            <CardDescription>ابدأ العمل بنقرة واحدة</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { icon: Target, label: "تصفح الطلبات الجديدة", color: "from-blue-500 to-cyan-500", path: "/dashboard" },
                                { icon: Briefcase, label: "إدارة المشاريع", color: "from-primary to-primary-dark", path: "/dashboard/projects" },
                                { icon: Award, label: "عرض التقييمات", color: "from-yellow-500 to-orange-500", path: "/dashboard" },
                                { icon: Star, label: "تحديث الملف الشخصي", color: "from-purple-500 to-pink-500", path: "/dashboard/profile" }
                            ].map((action, index) => (
                                <Button 
                                    key={index}
                                    onClick={() => navigate(action.path)}
                                    className={`h-auto p-4 justify-between group bg-gradient-to-r ${action.color} hover:shadow-xl transition-all duration-300 border-0 text-white`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                                            <action.icon className="w-5 h-5" />
                                        </div>
                                        <span className="font-semibold">{action.label}</span>
                                    </div>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Activity Timeline */}
                    <Card className="glass-card border-0 shadow-2xl animate-in slide-in-from-right duration-700">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                النشاط الأخير
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {[
                                    { type: "success", text: "طلب جديد: تصميم شعار", time: "منذ ساعتين", color: "primary" },
                                    { type: "info", text: "تم إكمال مشروع موقع", time: "أمس", color: "blue-500" },
                                    { type: "star", text: "تقييم 5 نجوم جديد", time: "منذ 3 أيام", color: "yellow-500" }
                                ].map((activity, index) => (
                                    <div key={index} className="flex items-start gap-3 group cursor-pointer">
                                        <div className={`w-2 h-2 rounded-full bg-${activity.color} mt-2 group-hover:scale-150 transition-transform`} />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{activity.text}</p>
                                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Platform Status - Modern */}
                <Card className="mt-6 glass-card border-0 shadow-2xl animate-in slide-in-from-bottom duration-700">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-foreground text-2xl mb-1">حالة المنصة</CardTitle>
                                <CardDescription>جميع الأنظمة تعمل بكفاءة</CardDescription>
                            </div>
                            <Badge className="bg-green-100 text-green-700 border-0 px-4 py-2">
                                <CheckCircle className="w-4 h-4 ml-2" />
                                متصل
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[
                                { label: "منصة المستقلين", status: "مفعل", color: "green" },
                                { label: "نظام التسجيل", status: "مفعل", color: "green" },
                                { label: "بوت واتساب", status: "متاح", color: "green" },
                                { label: "بوابة الدفع", status: "قريباً", color: "yellow" },
                                { label: "مراقبة النظام", status: "نشط", color: "green" }
                            ].map((service, index) => (
                                <div key={index} className="text-center p-4 rounded-xl bg-gradient-to-br from-white to-slate-50 hover:shadow-lg transition-all duration-300">
                                    <div className={`w-3 h-3 rounded-full bg-${service.color}-500 mx-auto mb-2 ${service.color === 'green' ? 'animate-pulse' : ''}`} />
                                    <p className="text-sm font-medium text-slate-700 mb-1">{service.label}</p>
                                    <p className={`text-xs text-${service.color}-600 font-semibold`}>{service.status}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardHome;