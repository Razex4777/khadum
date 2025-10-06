import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Clock,
  DollarSign,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Archive,
  MoreHorizontal,
  Eye,
  Calendar,
  Target
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { NotificationListItem } from '@/lib/notificationService';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface NotificationCardProps {
  notification: NotificationListItem;
  onMarkAsRead?: (id: string) => void;
  onArchive?: (id: string) => void;
  onRespond?: (id: string, response: string) => void;
  onViewDetails?: (id: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onArchive,
  onRespond,
  onViewDetails
}) => {
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [response, setResponse] = useState('');
  const [isResponding, setIsResponding] = useState(false);

  const handleRespond = async () => {
    if (!response.trim()) return;
    
    setIsResponding(true);
    try {
      await onRespond?.(notification.id, response);
      setResponse('');
      setShowResponseDialog(false);
    } catch (error) {
      console.error('Error responding to notification:', error);
    } finally {
      setIsResponding(false);
    }
  };

  const getPriorityColor = (priority: 'normal' | 'high' | 'urgent') => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getPriorityLabel = (priority: 'normal' | 'high' | 'urgent') => {
    switch (priority) {
      case 'urgent':
        return 'عاجل';
      case 'high':
        return 'مهم';
      default:
        return 'عادي';
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'في الانتظار';
      case 'failed':
        return 'فشل';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      !notification.is_read ? 'border-primary/50 bg-primary/5' : ''
    }`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {notification.client_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">
                  {notification.client_name}
                </h3>
                <Badge 
                  variant="outline" 
                  className={`text-xs px-2 py-0 ${getPriorityColor(notification.priority)} text-white border-0`}
                >
                  {getPriorityLabel(notification.priority)}
                </Badge>
                {!notification.is_read && (
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(notification.selection_date), { 
                    addSuffix: true, 
                    locale: ar 
                  })}
                </span>
                
                {notification.payment_amount && (
                  <>
                    <span>•</span>
                    <DollarSign className="h-3 w-3" />
                    <span>{notification.payment_amount.toLocaleString()} ريال</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails?.(notification.id)}>
                <Eye className="h-4 w-4 ml-2" />
                عرض التفاصيل
              </DropdownMenuItem>
              
              {!notification.is_read && (
                <DropdownMenuItem onClick={() => onMarkAsRead?.(notification.id)}>
                  <CheckCircle className="h-4 w-4 ml-2" />
                  تحديد كمقروء
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem onClick={() => onArchive?.(notification.id)}>
                <Archive className="h-4 w-4 ml-2" />
                أرشفة
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Project Description */}
        <div className="mb-3">
          <p className="text-sm text-foreground leading-relaxed line-clamp-2">
            {notification.project_description}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Payment Status */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">حالة الدفع:</span>
            <Badge 
              variant="outline" 
              className={`text-xs ${getPaymentStatusColor(notification.payment_status)}`}
            >
              {getPaymentStatusLabel(notification.payment_status)}
            </Badge>
          </div>

          {/* Budget */}
          {notification.estimated_budget && (
            <div className="flex items-center gap-2">
              <Target className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                الميزانية: {notification.estimated_budget.toLocaleString()} ريال
              </span>
            </div>
          )}
        </div>

        {/* Why Chosen */}
        {notification.why_chosen && (
          <div className="mb-3 p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-primary">سبب الاختيار:</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {notification.why_chosen}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageSquare className="h-3 w-3 ml-2" />
                رد على العميل
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>رد على {notification.client_name}</DialogTitle>
                <DialogDescription>
                  اكتب ردك على طلب العميل للمشروع
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <Textarea
                  placeholder="اكتب ردك هنا..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="min-h-[100px]"
                />
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleRespond} 
                    disabled={!response.trim() || isResponding}
                    className="flex-1"
                  >
                    {isResponding ? 'جاري الإرسال...' : 'إرسال الرد'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowResponseDialog(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            variant="default" 
            size="sm"
            onClick={() => onViewDetails?.(notification.id)}
          >
            <Eye className="h-3 w-3 ml-2" />
            التفاصيل
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;