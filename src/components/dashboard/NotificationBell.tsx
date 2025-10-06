import React from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NotificationBellProps {
  className?: string;
  showDropdown?: boolean;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ 
  className = '',
  showDropdown = true 
}) => {
  const { stats, unreadCount, loading, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/dashboard/notifications');
  };

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await markAllAsRead();
  };

  if (!showDropdown) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleViewAll}
        className={cn("relative", className)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("relative", className)}
        >
          <Bell className={cn(
            "h-5 w-5 transition-colors",
            unreadCount > 0 && "text-primary animate-pulse"
          )} />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-bounce"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <div className="px-3 py-2 font-semibold border-b">
          <div className="flex items-center justify-between">
            <span>الإشعارات</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} جديد
              </Badge>
            )}
          </div>
        </div>
        
        <DropdownMenuSeparator />

        {loading ? (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            جاري التحميل...
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="px-3 py-2">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-bold text-blue-600">{stats.total}</div>
                  <div className="text-muted-foreground">المجموع</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-600">{stats.today}</div>
                  <div className="text-muted-foreground">اليوم</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-orange-600">{stats.pending_payment}</div>
                  <div className="text-muted-foreground">معلق</div>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator />

            {/* Quick Actions */}
            <div className="px-2 py-1">
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewAll}
                  className="flex-1 h-8 text-xs"
                >
                  <Bell className="h-3 w-3 mr-1" />
                  عرض الكل
                </Button>
                
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllRead}
                    className="flex-1 h-8 text-xs"
                  >
                    <CheckCheck className="h-3 w-3 mr-1" />
                    تحديد الكل
                  </Button>
                )}
              </div>
            </div>

            {unreadCount === 0 && (
              <>
                <DropdownMenuSeparator />
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <div>لا توجد إشعارات جديدة</div>
                  <div className="text-xs mt-1">جميع الإشعارات مقروءة</div>
                </div>
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;