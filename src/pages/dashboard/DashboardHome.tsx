import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users, Briefcase, DollarSign, Star, Bell, AlertCircle } from "lucide-react";
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationBell from '@/components/dashboard/NotificationBell';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
    const { stats, unreadCount } = useNotifications();
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-background font-tajawal p-6">
            {/* Background Effects - Using consistent design system */}
            <div className="absolute inset-0" style={{ backgroundImage: 'var(--gradient-hero)' }}></div>
            
            <div className="relative z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground accent-text flex items-center gap-3">
                                لوحة تحكم المستقل
                                {unreadCount > 0 && (
                                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                                        {unreadCount} إشعار جديد
                                    </Badge>
                                )}
                            </h1>
                            <p className="text-muted-foreground">منصة خدوم - وسيطك الذكي عبر واتساب</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <NotificationBell />
                            <Badge className="bg-primary/20 text-primary border-primary/30 accent-ring">متاح الآن</Badge>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        {/* Notifications Card */}
                        <Card className="bg-card/80 backdrop-blur-xl border-border accent-ring hover-lift cursor-pointer"
                              onClick={() => navigate('/dashboard/notifications')}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">الإشعارات</CardTitle>
                                <Bell className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground flex items-center gap-2">
                                    {stats.total}
                                    {unreadCount > 0 && (
                                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs animate-pulse">
                                            {unreadCount}
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {unreadCount > 0 ? `${unreadCount} غير مقروء` : 'جميعها مقروءة'}
                                </p>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-card/80 backdrop-blur-xl border-border accent-ring hover-lift">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">طلباتي الحالية</CardTitle>
                                <MessageCircle className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">3</div>
                                <p className="text-xs text-muted-foreground">مشروع نشط</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-card/80 backdrop-blur-xl border-border accent-ring hover-lift">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">مشاريع مكتملة</CardTitle>
                                <Briefcase className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">12</div>
                                <p className="text-xs text-muted-foreground">مشروع منجز</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-card/80 backdrop-blur-xl border-border accent-ring hover-lift">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">التقييم العام</CardTitle>
                                <Star className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">4.8</div>
                                <p className="text-xs text-muted-foreground">من 5 نجوم</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-card/80 backdrop-blur-xl border-border accent-ring hover-lift">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">الأرباح الشهرية</CardTitle>
                                <DollarSign className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">5,450 ر.س</div>
                                <p className="text-xs text-muted-foreground">هذا الشهر</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Activity */}
                        <Card className="bg-card/80 backdrop-blur-xl border-border accent-ring hover-lift">
                            <CardHeader>
                                <CardTitle className="text-foreground">النشاط الأخير</CardTitle>
                                <CardDescription className="text-muted-foreground">آخر التحديثات على حسابك</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-foreground">تم استلام إشعار جديد من عميل</p>
                                            <p className="text-xs text-muted-foreground">منذ دقائق</p>
                                        </div>
                                        {unreadCount > 0 && (
                                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs animate-pulse">
                                                جديد
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-foreground">تم استلام طلب جديد لتصميم شعار</p>
                                            <p className="text-xs text-muted-foreground">منذ ساعتين</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-foreground">تم إكمال مشروع تطوير موقع</p>
                                            <p className="text-xs text-muted-foreground">أمس</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                        <div className="w-2 h-2 bg-destructive rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-foreground">تقييم جديد 5 نجوم من عميل</p>
                                            <p className="text-xs text-muted-foreground">منذ 3 أيام</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="bg-card/80 backdrop-blur-xl border-border accent-ring hover-lift">
                            <CardHeader>
                                <CardTitle className="text-foreground">إجراءات سريعة</CardTitle>
                                <CardDescription className="text-muted-foreground">أدوات إدارة حسابك</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button className="w-full justify-start bg-primary/10 hover:bg-primary/20 text-foreground border-border" 
                                        variant="outline"
                                        onClick={() => navigate('/dashboard/notifications')}>
                                    <Bell className="mr-2 h-4 w-4 text-primary" />
                                    عرض الإشعارات
                                    {unreadCount > 0 && (
                                        <Badge className="mr-2 bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                                            {unreadCount}
                                        </Badge>
                                    )}
                                </Button>
                                <Button className="w-full justify-start bg-primary/10 hover:bg-primary/20 text-foreground border-border" variant="outline">
                                    <MessageCircle className="mr-2 h-4 w-4 text-primary" />
                                    عرض الطلبات الجديدة
                                </Button>
                                <Button className="w-full justify-start bg-primary/10 hover:bg-primary/20 text-foreground border-border" variant="outline">
                                    <Briefcase className="mr-2 h-4 w-4 text-primary" />
                                    إدارة المشاريع الحالية
                                </Button>
                                <Button className="w-full justify-start bg-primary/10 hover:bg-primary/20 text-foreground border-border" variant="outline">
                                    <Star className="mr-2 h-4 w-4 text-primary" />
                                    عرض التقييمات
                                </Button>
                                <Button className="w-full justify-start bg-primary/10 hover:bg-primary/20 text-foreground border-border" variant="outline">
                                    <Users className="mr-2 h-4 w-4 text-primary" />
                                    تحديث الملف الشخصي
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Platform Status */}
                    <Card className="mt-6 bg-card/80 backdrop-blur-xl border-border accent-ring hover-lift">
                        <CardHeader>
                            <CardTitle className="text-foreground">حالة المنصة</CardTitle>
                            <CardDescription className="text-muted-foreground">تقدم منصة خدوم ووضع الخدمات</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-foreground">منصة المستقلين</span>
                                    <Badge className="bg-primary/20 text-primary border-primary/30">مفعل</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-foreground">نظام التسجيل</span>
                                    <Badge className="bg-primary/20 text-primary border-primary/30">مفعل</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-foreground">بوت واتساب الذكي</span>
                                    <Badge className="bg-primary/20 text-primary border-primary/30">متاح</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-foreground">بوابة الدفع</span>
                                    <Badge className="bg-destructive/20 text-destructive border-destructive/30">قيد التطوير</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-foreground">مراقبة</span>
                                    <Badge className="bg-primary/20 text-primary border-primary/30">نشط</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;


