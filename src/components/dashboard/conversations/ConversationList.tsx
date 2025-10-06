import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MessageCircle,
  MoreHorizontal,
  Star,
  Archive,
  Trash2,
  Pin,
  Clock
} from 'lucide-react';
import { ConversationListItem } from '@/lib/conversationService';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ConversationListProps {
  conversations: ConversationListItem[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onArchiveConversation?: (conversationId: string) => void;
  onDeleteConversation?: (conversationId: string) => void;
  onPinConversation?: (conversationId: string) => void;
  loading?: boolean;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onArchiveConversation,
  onDeleteConversation,
  onPinConversation,
  loading = false
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'normal':
        return 'bg-blue-500 text-white';
      case 'low':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'عاجل';
      case 'high':
        return 'مهم';
      case 'normal':
        return 'عادي';
      case 'low':
        return 'منخفض';
      default:
        return 'عادي';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'archived':
        return 'bg-yellow-500';
      case 'closed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          لا توجد محادثات
        </h3>
        <p className="text-muted-foreground max-w-sm">
          ستظهر محادثاتك مع العملاء هنا عندما يتواصلون معك
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <Card
          key={conversation.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedConversationId === conversation.id
              ? 'ring-2 ring-primary bg-primary/5'
              : 'hover:bg-muted/50'
          }`}
          onClick={() => onSelectConversation(conversation.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Client Avatar */}
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.client_avatar_url} />
                  <AvatarFallback className="text-sm">
                    {conversation.client_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Status Indicator */}
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(
                    conversation.status
                  )}`}
                />
              </div>

              {/* Conversation Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground truncate">
                      {conversation.client_name}
                    </h4>
                    
                    {/* Priority Badge */}
                    {conversation.priority !== 'normal' && (
                      <Badge
                        variant="outline"
                        className={`text-xs px-1.5 py-0.5 ${getPriorityColor(
                          conversation.priority
                        )}`}
                      >
                        {getPriorityLabel(conversation.priority)}
                      </Badge>
                    )}
                  </div>

                  {/* Actions Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onPinConversation?.(conversation.id)}>
                        <Pin className="h-4 w-4 ml-2" />
                        تثبيت
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onArchiveConversation?.(conversation.id)}>
                        <Archive className="h-4 w-4 ml-2" />
                        أرشفة
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteConversation?.(conversation.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 ml-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Conversation Title */}
                <div className="text-sm text-muted-foreground mb-1 truncate">
                  {conversation.title}
                </div>

                {/* Last Message Preview */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.last_message_by === 'freelancer' && (
                        <span className="text-primary font-medium">أنت: </span>
                      )}
                      {conversation.last_message_preview}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Timestamp */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(conversation.last_message_at), {
                        addSuffix: true,
                        locale: ar
                      })}
                    </div>

                    {/* Unread Count */}
                    {conversation.unread_count_freelancer > 0 && (
                      <Badge className="bg-primary text-primary-foreground text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center px-1.5">
                        {conversation.unread_count_freelancer > 99
                          ? '99+'
                          : conversation.unread_count_freelancer}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {conversation.tags && conversation.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {conversation.tags.slice(0, 3).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs px-2 py-0.5"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {conversation.tags.length > 3 && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-0.5 text-muted-foreground"
                      >
                        +{conversation.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ConversationList;