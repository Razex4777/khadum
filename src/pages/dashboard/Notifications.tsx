import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Bell,
  Search,
  Filter,
  CheckCheck,
  Archive,
  AlertCircle,
  DollarSign,
  Calendar,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import NotificationCard from '@/components/dashboard/notifications/NotificationCard';
import { 
  NotificationService, 
  NotificationListItem, 
  NotificationStats 
} from '@/lib/notificationService';

interface NotificationsProps {
  freelancerId: string;
}

const Notifications: React.FC<NotificationsProps> = ({ freelancerId }) => {
  const [notifications, setNotifications] = useState<NotificationListItem[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    today: 0,
    this_week: 0,
    pending_payment: 0,
    completed_payment: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');

  const PAGE_SIZE = 10;

  // Load notifications
  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      const [notificationData, statsData] = await Promise.all([
        NotificationService.getNotifications(freelancerId, {
          status: statusFilter,
          payment_status: paymentFilter || undefined,
          search: searchQuery || undefined,
          limit: PAGE_SIZE,
          offset: (currentPage - 1) * PAGE_SIZE
        }),
        NotificationService.getNotificationStats(freelancerId)
      ]);

      setNotifications(notificationData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast({
        title: "خطأ في تحميل الإشعارات",
        description: "حاول مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    
    // Set up real-time subscription
    const subscription = NotificationService.subscribeToNotifications(
      freelancerId,
      (payload) => {
        console.log('Real-time notification update:', payload);
        
        if (payload.eventType === 'INSERT') {
          // New notification received
          setNotifications(prev => [payload.new, ...prev]);
          setStats(prev => ({
            ...prev,
            total: prev.total + 1,
            unread: prev.unread + 1,
            today: prev.today + 1,
            this_week: prev.this_week + 1
          }));
          
          // Show toast notification
          toast({
            title: "إشعار جديد",
            description: `طلب جديد من ${payload.new.client_name}`,
            variant: "default"
          });
        } else if (payload.eventType === 'UPDATE') {
          // Notification updated
          setNotifications(prev =>
            prev.map(n => 
              n.id === payload.new.id 
                ? { ...n, ...payload.new }
                : n
            )
          );
        } else if (payload.eventType === 'DELETE') {
          // Notification deleted
          setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
          setStats(prev => ({
            ...prev,
            total: Math.max(0, prev.total - 1)
          }));
        }
      }
    );
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [freelancerId, statusFilter, paymentFilter, searchQuery, currentPage]);

  // Handle mark as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const success = await NotificationService.markAsRead(notificationId);
      if (success) {
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        );
        setStats(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
        
        toast({
          title: "تم تحديد الإشعار كمقروء",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      toast({
        title: "خطأ في تحديث الإشعار",
        variant: "destructive"
      });
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(n => !n.is_read)
        .map(n => n.id);
      
      if (unreadIds.length === 0) return;

      const success = await NotificationService.markMultipleAsRead(unreadIds);
      if (success) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setStats(prev => ({ ...prev, unread: 0 }));
        
        toast({
          title: "تم تحديد جميع الإشعارات كمقروءة",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        title: "خطأ في تحديث الإشعارات",
        variant: "destructive"
      });
    }
  };

  // Handle archive
  const handleArchive = async (notificationId: string) => {
    try {
      const success = await NotificationService.archiveNotification(notificationId);
      if (success) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        setStats(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
        
        toast({
          title: "تم أرشفة الإشعار",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error archiving notification:', error);
      toast({
        title: "خطأ في أرشفة الإشعار",
        variant: "destructive"
      });
    }
  };

  // Handle respond
  const handleRespond = async (notificationId: string, response: string) => {
    try {
      const success = await NotificationService.respondToNotification(notificationId, response);
      if (success) {
        toast({
          title: "تم إرسال الرد بنجاح",
          description: "سيتم إشعار العميل بردك",
          variant: "default"
        });
        
        // Reload to get updated data
        loadNotifications();
      }
    } catch (error) {
      console.error('Error responding to notification:', error);
      toast({
        title: "خطأ في إرسال الرد",
        variant: "destructive"
      });
    }
  };

  // Handle view details
  const handleViewDetails = (notificationId: string) => {
    // TODO: Implement detailed view modal or navigate to detail page
    console.log('View details for:', notificationId);
  };

  // Filter notifications by tab
  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.is_read);
      case 'priority':
        return notifications.filter(n => n.priority === 'high' || n.priority === 'urgent');
      case 'payment':
        return notifications.filter(n => n.payment_status === 'pending');
      default:
        return notifications;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-8 w-8 text-primary" />
            الإشعارات
          </h1>
          <p className="text-muted-foreground">
            إدارة إشعارات العملاء المهتمين بخدماتك
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleMarkAllAsRead}
            disabled={stats.unread === 0}
          >
            <CheckCheck className="h-4 w-4 ml-2" />
            تحديد الكل كمقروء
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">المجموع</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">غير مقروء</p>
                <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">اليوم</p>
                <p className="text-2xl font-bold">{stats.today}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">هذا الأسبوع</p>
                <p className="text-2xl font-bold">{stats.this_week}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">دفع معلق</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending_payment}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCheck className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">دفع مكتمل</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed_payment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في الإشعارات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الإشعارات</SelectItem>
                  <SelectItem value="unread">غير مقروء</SelectItem>
                  <SelectItem value="read">مقروء</SelectItem>
                  <SelectItem value="archived">مؤرشف</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="حالة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع الحالات</SelectItem>
                  <SelectItem value="pending">في الانتظار</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="failed">فشل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            الكل
            {stats.total > 0 && (
              <Badge variant="secondary" className="ml-1">
                {stats.total}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="unread" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            غير مقروء
            {stats.unread > 0 && (
              <Badge variant="destructive" className="ml-1">
                {stats.unread}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="priority" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            مهم
          </TabsTrigger>
          
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            دفع معلق
            {stats.pending_payment > 0 && (
              <Badge variant="outline" className="ml-1">
                {stats.pending_payment}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="mr-2 text-muted-foreground">جاري التحميل...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {getFilteredNotifications().length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      لا توجد إشعارات
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {activeTab === 'unread' 
                        ? 'جميع الإشعارات مقروءة' 
                        : 'لم يتم العثور على إشعارات تطابق المعايير المحددة'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                getFilteredNotifications().map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onArchive={handleArchive}
                    onRespond={handleRespond}
                    onViewDetails={handleViewDetails}
                  />
                ))
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {notifications.length >= PAGE_SIZE && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            السابق
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            صفحة {currentPage}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={notifications.length < PAGE_SIZE}
          >
            التالي
          </Button>
        </div>
      )}
    </div>
  );
};

export default Notifications;