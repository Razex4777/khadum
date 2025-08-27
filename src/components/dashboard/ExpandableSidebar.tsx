import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  LogOut, 
  ChevronRight,
  Bell,
  Briefcase,
  Star,
  MessageCircle,
  CreditCard,
  Shield,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
  isNew?: boolean;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'لوحة التحكم',
    icon: LayoutDashboard,
    path: '/dashboard'
  },
  {
    id: 'profile',
    label: 'الملف الشخصي',
    icon: User,
    path: '/dashboard/profile',
    isNew: true
  },
  {
    id: 'projects',
    label: 'المشاريع',
    icon: Briefcase,
    path: '/dashboard/projects',
    badge: 3
  },
  {
    id: 'messages',
    label: 'الرسائل',
    icon: MessageCircle,
    path: '/dashboard/messages',
    badge: 7
  },
  {
    id: 'reviews',
    label: 'التقييمات',
    icon: Star,
    path: '/dashboard/reviews'
  },
  {
    id: 'payments',
    label: 'المدفوعات',
    icon: CreditCard,
    path: '/dashboard/payments'
  }
];

const bottomItems: SidebarItem[] = [
  {
    id: 'notifications',
    label: 'الإشعارات',
    icon: Bell,
    path: '/dashboard/notifications',
    badge: 2
  },
  {
    id: 'security',
    label: 'الأمان',
    icon: Shield,
    path: '/dashboard/security'
  },
  {
    id: 'settings',
    label: 'الإعدادات',
    icon: Settings,
    path: '/dashboard/settings'
  },
  {
    id: 'help',
    label: 'المساعدة',
    icon: HelpCircle,
    path: '/dashboard/help'
  }
];

interface ExpandableSidebarProps {
  children: React.ReactNode;
}

const ExpandableSidebar: React.FC<ExpandableSidebarProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: 'مستخدم', title: 'مستقل' });
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        console.log('🔍 Sidebar: Fetching user info...');
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log('📧 Sidebar: Session email:', session?.user?.email);
        
        if (session?.user?.email) {
          const { data: freelancer, error } = await supabase
            .from('freelancers')
            .select('full_name, field')
            .eq('email', session.user.email)
            .single();
          
          console.log('👤 Sidebar: Freelancer data:', { freelancer, error });
          
          if (freelancer) {
            const newUserInfo = {
              name: freelancer.full_name || 'مستخدم',
              title: freelancer.field || 'مستقل'
            };
            console.log('✅ Sidebar: Setting user info:', newUserInfo);
            setUserInfo(newUserInfo);
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  // Auto-expand logic
  useEffect(() => {
    if (isHovering) {
      const timer = setTimeout(() => setIsExpanded(true), 100);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setIsExpanded(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isHovering]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Add logout logic here
    navigate('/');
  };

  const SidebarItem: React.FC<{ item: SidebarItem; isBottom?: boolean }> = ({ item, isBottom = false }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <Button
        variant="ghost"
        onClick={() => handleNavigation(item.path)}
        className={cn(
          "w-full justify-start h-12 px-3 transition-all duration-300",
          "hover:bg-primary/10 hover:border-l-2 hover:border-primary",
          "group relative overflow-hidden",
          isActive && "bg-primary/20 border-l-2 border-primary text-primary",
          isBottom && "text-muted-foreground hover:text-foreground"
        )}
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
          <Icon 
            className={cn(
              "h-5 w-5 transition-all duration-300",
              isActive ? "text-primary" : "text-muted-foreground",
              "group-hover:text-primary group-hover:scale-110"
            )} 
          />
        </div>

        {/* Label with smooth animation */}
        <span 
          className={cn(
            "mr-3 font-medium transition-all duration-300 whitespace-nowrap",
            isExpanded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          )}
        >
          {item.label}
        </span>

        {/* Badge or New indicator */}
        {isExpanded && (
          <div className="mr-auto flex items-center gap-2">
            {item.isNew && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-2 py-0">
                جديد
              </Badge>
            )}
            {item.badge && item.badge > 0 && (
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs min-w-[20px] h-5 flex items-center justify-center px-1">
                {item.badge}
              </Badge>
            )}
          </div>
        )}

        {/* Hover effect background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Button>
    );
  };

  return (
    <div className="flex min-h-screen bg-background font-tajawal">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full z-50 transition-all duration-300 ease-in-out",
          "bg-card/90 backdrop-blur-xl border-l border-border",
          "shadow-lg shadow-black/20",
          isExpanded ? "w-64" : "w-16"
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-sm">خ</span>
              </div>
              {isExpanded && (
                <div className="mr-3 animate-in slide-in-from-right-2 duration-300">
                  <h2 className="font-bold text-foreground">خدوم</h2>
                  <p className="text-xs text-muted-foreground">منصة المستقلين</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Navigation */}
          <div className="flex-1 p-2 space-y-1">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <SidebarItem key={item.id} item={item} />
              ))}
            </div>

            {/* Separator */}
            <div className="py-2">
              <Separator className="bg-border" />
            </div>

            {/* Bottom items */}
            <div className="space-y-1">
              {bottomItems.map((item) => (
                <SidebarItem key={item.id} item={item} isBottom />
              ))}
            </div>
          </div>

          {/* User section & Logout */}
          <div className="p-2 border-t border-border">
            <div className="space-y-2">
              {/* User info */}
              <div className="flex items-center p-2 rounded-lg bg-primary/5">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                {isExpanded && (
                  <div className="mr-3 animate-in slide-in-from-right-2 duration-300">
                    <p className="text-sm font-medium text-foreground">{userInfo.name}</p>
                    <p className="text-xs text-muted-foreground">{userInfo.title}</p>
                  </div>
                )}
              </div>

              {/* Logout button */}
              <Button
                variant="ghost"
                onClick={handleLogout}
                className={cn(
                  "w-full justify-start h-10 px-3 text-destructive",
                  "hover:bg-destructive/10 hover:text-destructive"
                )}
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                {isExpanded && (
                  <span className="mr-3 transition-all duration-300">
                    تسجيل الخروج
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Expand indicator */}
          <div 
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2",
              "w-6 h-6 bg-primary rounded-full flex items-center justify-center",
              "border-2 border-background shadow-lg transition-all duration-300",
              "opacity-0 group-hover:opacity-100",
              isExpanded ? "rotate-180" : "rotate-0"
            )}
          >
            <ChevronRight className="h-3 w-3 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isExpanded ? "mr-64" : "mr-16"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default ExpandableSidebar;
