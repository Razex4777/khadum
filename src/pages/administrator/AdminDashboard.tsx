import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Users,
    UserCheck,
    Briefcase,
    Shield,
    LogOut,
    BarChart3,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    MessageCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";


interface AdminData {
    id: string;
    email: string;
    full_name: string;
    role: string;
}

interface UserStats {
    totalUsers: number;
    totalClients: number;
    totalFreelancers: number;
    pendingVerifications: number;
}

interface PendingUser {
    id: string;
    full_name: string;
    email: string;
    whatsapp_number?: string;
    field?: string;
    experience_level?: string;
    user_type: 'client' | 'freelancer';
    created_at: string;
}

const AdminDashboard = () => {
    const [admin, setAdmin] = useState<AdminData | null>(null);
    const [activeSection, setActiveSection] = useState<'overview' | 'verification' | 'whatsapp'>('overview');
    const [stats, setStats] = useState<UserStats>({
        totalUsers: 0,
        totalClients: 0,
        totalFreelancers: 0,
        pendingVerifications: 0
    });
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const adminData = localStorage.getItem('admin');
        if (adminData) {
            setAdmin(JSON.parse(adminData));
            loadStats();
            loadPendingUsers();
        } else {
            navigate('/admin-login');
        }
    }, [navigate]);

    const loadStats = async () => {
        try {
            // Get clients count
            const { count: clientsCount } = await supabase
                .from('clients')
                .select('*', { count: 'exact', head: true });

            // Get freelancers count
            const { count: freelancersCount } = await supabase
                .from('freelancers')
                .select('*', { count: 'exact', head: true });

            // Get pending verifications count
            const { count: pendingClientsCount } = await supabase
                .from('clients')
                .select('*', { count: 'exact', head: true })
                .eq('is_verified', false);

            const { count: pendingFreelancersCount } = await supabase
                .from('freelancers')
                .select('*', { count: 'exact', head: true })
                .eq('is_verified', false);

            setStats({
                totalClients: clientsCount || 0,
                totalFreelancers: freelancersCount || 0,
                totalUsers: (clientsCount || 0) + (freelancersCount || 0),
                pendingVerifications: (pendingClientsCount || 0) + (pendingFreelancersCount || 0)
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const loadPendingUsers = async () => {
        try {
            // Get pending clients
            const { data: pendingClients } = await supabase
                .from('clients')
                .select('*')
                .eq('is_verified', false)
                .order('created_at', { ascending: false });

            // Get pending freelancers
            const { data: pendingFreelancers } = await supabase
                .from('freelancers')
                .select('*')
                .eq('is_verified', false)
                .order('created_at', { ascending: false });

            // Combine and format the data
            const allPendingUsers: PendingUser[] = [
                ...(pendingClients || []).map(client => ({
                    ...client,
                    user_type: 'client' as const
                })),
                ...(pendingFreelancers || []).map(freelancer => ({
                    ...freelancer,
                    user_type: 'freelancer' as const
                }))
            ];

            setPendingUsers(allPendingUsers);
        } catch (error) {
            console.error('Error loading pending users:', error);
        }
    };

    const handleApproveUser = async (userId: string, userType: 'client' | 'freelancer') => {
        setIsLoading(true);
        try {
            const tableName = userType === 'client' ? 'clients' : 'freelancers';

            const { error } = await supabase
                .from(tableName)
                .update({ is_verified: true })
                .eq('id', userId);

            if (error) throw error;

            toast({
                title: "تم قبول المستخدم",
                description: "تم تفعيل حساب المستخدم بنجاح",
            });

            // Refresh data
            loadStats();
            loadPendingUsers();
        } catch (error: any) {
            toast({
                title: "خطأ في الموافقة",
                description: error.message || "حدث خطأ أثناء الموافقة على المستخدم",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin');
        navigate('/admin-login');
    };

    if (!admin) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 font-tajawal relative overflow-hidden">
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-slate-900 to-slate-950"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

            <div className="relative z-10 flex">
                {/* Enhanced Premium Sidebar */}
                <div className="w-72 bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-2xl border-r border-primary/20 min-h-screen shadow-2xl relative">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 p-6">
                        {/* Logo Section */}
                        <div className="flex items-center gap-3 mb-10 animate-in slide-in-from-right duration-500">
                            <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg shadow-primary/50">
                                <Shield className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">لوحة الإدارة</h1>
                                <p className="text-sm text-slate-400 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    خدوم - متصل
                                </p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="space-y-2">
                            <Button
                                variant={activeSection === 'overview' ? 'default' : 'ghost'}
                                className={`w-full justify-start h-12 group transition-all duration-300 ${
                                    activeSection === 'overview'
                                        ? 'bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white shadow-lg shadow-primary/50'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:border-primary/30'
                                }`}
                                onClick={() => setActiveSection('overview')}
                            >
                                <BarChart3 className={`h-5 w-5 mr-3 transition-transform group-hover:scale-110 ${
                                    activeSection === 'overview' ? 'text-white' : ''
                                }`} />
                                <span className="font-medium">الإحصائيات العامة</span>
                            </Button>

                            <Button
                                variant={activeSection === 'verification' ? 'default' : 'ghost'}
                                className={`w-full justify-start h-12 group transition-all duration-300 ${
                                    activeSection === 'verification'
                                        ? 'bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white shadow-lg shadow-primary/50'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:border-primary/30'
                                }`}
                                onClick={() => setActiveSection('verification')}
                            >
                                <UserCheck className={`h-5 w-5 mr-3 transition-transform group-hover:scale-110 ${
                                    activeSection === 'verification' ? 'text-white' : ''
                                }`} />
                                <span className="font-medium flex-1 text-right">التحقق من المستخدمين</span>
                                {stats.pendingVerifications > 0 && (
                                    <Badge className="mr-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg animate-pulse">
                                        {stats.pendingVerifications}
                                    </Badge>
                                )}
                            </Button>

                            <Button
                                variant={activeSection === 'whatsapp' ? 'default' : 'ghost'}
                                className={`w-full justify-start h-12 group transition-all duration-300 ${
                                    activeSection === 'whatsapp'
                                        ? 'bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white shadow-lg shadow-primary/50'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:border-primary/30'
                                }`}
                                onClick={() => setActiveSection('whatsapp')}
                            >
                                <MessageCircle className={`h-5 w-5 mr-3 transition-transform group-hover:scale-110 ${
                                    activeSection === 'whatsapp' ? 'text-white' : ''
                                }`} />
                                <span className="font-medium">WhatsApp Bot</span>
                            </Button>
                        </div>
                    </div>

                    {/* Admin Profile at Bottom */}
                    <div className="absolute bottom-6 left-6 right-6 space-y-3">
                        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-4 border border-primary/20 shadow-xl">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse">
                                    <Shield className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-semibold text-sm">{admin.full_name}</p>
                                    <p className="text-slate-400 text-xs flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                        {admin.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-red-600 hover:text-white hover:border-red-500 transition-all duration-300 h-11"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            تسجيل الخروج
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    {activeSection === 'overview' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between animate-in slide-in-from-top duration-500">
                                <div>
                                    <h2 className="text-4xl font-bold text-white mb-2">الإحصائيات العامة</h2>
                                    <p className="text-slate-400">نظرة شاملة على المنصة</p>
                                </div>
                                <Badge className="bg-gradient-to-r from-primary to-primary-dark text-white border-0 px-4 py-2 shadow-lg shadow-primary/50 animate-pulse">
                                    <span className="w-2 h-2 bg-white rounded-full mr-2 inline-block" />
                                    تحديث مباشر
                                </Badge>
                            </div>

                            {/* Enhanced Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { 
                                        label: "إجمالي المستخدمين", 
                                        value: stats.totalUsers, 
                                        subtitle: "مستخدم مسجل", 
                                        icon: Users, 
                                        gradient: "from-blue-500 to-cyan-500",
                                        bgGradient: "from-blue-500/10 to-cyan-500/10"
                                    },
                                    { 
                                        label: "العملاء", 
                                        value: stats.totalClients, 
                                        subtitle: "عميل نشط", 
                                        icon: Briefcase, 
                                        gradient: "from-green-500 to-emerald-500",
                                        bgGradient: "from-green-500/10 to-emerald-500/10"
                                    },
                                    { 
                                        label: "المستقلون", 
                                        value: stats.totalFreelancers, 
                                        subtitle: "مستقل محترف", 
                                        icon: TrendingUp, 
                                        gradient: "from-purple-500 to-pink-500",
                                        bgGradient: "from-purple-500/10 to-pink-500/10"
                                    },
                                    { 
                                        label: "في انتظار التحقق", 
                                        value: stats.pendingVerifications, 
                                        subtitle: "يحتاج مراجعة", 
                                        icon: Clock, 
                                        gradient: "from-orange-500 to-red-500",
                                        bgGradient: "from-orange-500/10 to-red-500/10"
                                    }
                                ].map((stat, index) => (
                                    <Card 
                                        key={index}
                                        className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl border-slate-700/50 hover:border-slate-600 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-in slide-in-from-bottom`}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -mr-16 -mt-16`} />
                                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                                            <CardTitle className="text-sm font-medium text-slate-300">{stat.label}</CardTitle>
                                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                                                <stat.icon className="h-5 w-5 text-white" />
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" />
                                                {stat.subtitle}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}</div>

                            {/* Additional Info */}
                            <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                                <CardHeader>
                                    <CardTitle className="text-white">نظرة عامة على النظام</CardTitle>
                                    <CardDescription className="text-slate-400">
                                        إحصائيات سريعة حول أداء المنصة
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                                            <div className="text-2xl font-bold text-green-400">
                                                {((stats.totalClients / stats.totalUsers) * 100 || 0).toFixed(1)}%
                                            </div>
                                            <p className="text-sm text-slate-400">نسبة العملاء</p>
                                        </div>
                                        <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                                            <div className="text-2xl font-bold text-purple-400">
                                                {((stats.totalFreelancers / stats.totalUsers) * 100 || 0).toFixed(1)}%
                                            </div>
                                            <p className="text-sm text-slate-400">نسبة المستقلين</p>
                                        </div>
                                        <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                                            <div className="text-2xl font-bold text-orange-400">
                                                {((stats.pendingVerifications / stats.totalUsers) * 100 || 0).toFixed(1)}%
                                            </div>
                                            <p className="text-sm text-slate-400">نسبة المعلقين</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeSection === 'verification' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-bold text-white">التحقق من المستخدمين</h2>
                                <Badge className="bg-orange-600/20 text-orange-400 border-orange-500/30">
                                    {pendingUsers.length} في الانتظار
                                </Badge>
                            </div>

                            <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                                <CardHeader>
                                    <CardTitle className="text-white">المستخدمون المعلقون</CardTitle>
                                    <CardDescription className="text-slate-400">
                                        المستخدمون الذين يحتاجون إلى موافقة للتفعيل
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {pendingUsers.length === 0 ? (
                                        <div className="text-center py-8">
                                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                            <p className="text-slate-400">لا توجد طلبات تحقق معلقة</p>
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-slate-700">
                                                    <TableHead className="text-slate-300">الاسم</TableHead>
                                                    <TableHead className="text-slate-300">البريد الإلكتروني</TableHead>
                                                    <TableHead className="text-slate-300">النوع</TableHead>
                                                    <TableHead className="text-slate-300">المجال</TableHead>
                                                    <TableHead className="text-slate-300">تاريخ التسجيل</TableHead>
                                                    <TableHead className="text-slate-300">الإجراء</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {pendingUsers.map((user) => (
                                                    <TableRow key={user.id} className="border-slate-700">
                                                        <TableCell className="text-white">{user.full_name}</TableCell>
                                                        <TableCell className="text-slate-300">{user.email}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={user.user_type === 'client' ? 'default' : 'secondary'}>
                                                                {user.user_type === 'client' ? 'عميل' : 'مستقل'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-slate-300">
                                                            {user.field || 'غير محدد'}
                                                        </TableCell>
                                                        <TableCell className="text-slate-300">
                                                            {new Date(user.created_at).toLocaleDateString('ar-SA')}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                size="sm"
                                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                                onClick={() => handleApproveUser(user.id, user.user_type)}
                                                                disabled={isLoading}
                                                            >
                                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                                موافقة
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeSection === 'whatsapp' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-bold text-white">WhatsApp Bot Management</h2>
                                <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
                                    🤖 Bot Active
                                </Badge>
                            </div>

                            <div className="p-8 text-center text-muted-foreground">
                                <div className="text-4xl mb-4">🚧</div>
                                <p>WhatsApp Bot Management</p>
                                <p className="text-sm">Coming Soon...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;