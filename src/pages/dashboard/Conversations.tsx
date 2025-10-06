import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  MessageSquarePlus,
  Users,
  Archive,
  Star,
  Settings
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ConversationList from '@/components/dashboard/conversations/ConversationList';
import MessageCard from '@/components/dashboard/conversations/MessageCard';
import MessageInput from '@/components/dashboard/conversations/MessageInput';
import { 
  ConversationService, 
  ConversationListItem, 
  Conversation, 
  ConversationMessage, 
  ConversationAttachment 
} from '@/lib/conversationService';
import { supabase } from '@/lib/supabase';

const Conversations: React.FC = () => {
  // State management
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [freelancerId, setFreelancerId] = useState<string | null>(null);
  
  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    archived: 0,
    unread: 0,
    high_priority: 0
  });
  
  // Reply state
  const [replyTo, setReplyTo] = useState<{
    id: string;
    content: string;
    senderName: string;
  } | null>(null);
  
  // Auto-scroll for messages
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Get freelancer ID from session
  useEffect(() => {
    const getFreelancerId = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.email) return;

        const { data: freelancer, error } = await supabase
          .from('freelancers')
          .select('id')
          .eq('email', session.user.email)
          .single();

        if (error) {
          console.error('Error fetching freelancer:', error);
          return;
        }

        setFreelancerId(freelancer.id);
      } catch (error) {
        console.error('Error in getFreelancerId:', error);
      }
    };

    getFreelancerId();
  }, []);

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!freelancerId) return;

    try {
      setLoading(true);
      const filters: any = {};
      
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }

      const conversationsData = await ConversationService.getConversations(
        freelancerId,
        {
          ...filters,
          search: searchQuery || undefined,
          limit: 50
        }
      );

      setConversations(conversationsData);

      // Load statistics
      const statsData = await ConversationService.getConversationStats(freelancerId);
      setStats(statsData);

    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "خطأ في تحميل المحادثات",
        description: "حاول مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [freelancerId, searchQuery, statusFilter]);

  // Load selected conversation details
  const loadConversationDetails = useCallback(async (conversationId: string) => {
    try {
      setMessagesLoading(true);
      const conversation = await ConversationService.getConversation(conversationId);
      
      if (conversation) {
        setSelectedConversation(conversation);
        // Mark as read
        await ConversationService.markAsRead(conversationId, 'freelancer');
        // Refresh conversation list to update unread counts
        loadConversations();
      }
    } catch (error) {
      console.error('Error loading conversation details:', error);
      toast({
        title: "خطأ في تحميل المحادثة",
        description: "حاول مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setMessagesLoading(false);
    }
  }, [loadConversations]);

  // Handle conversation selection
  const handleSelectConversation = useCallback((conversationId: string) => {
    setSelectedConversationId(conversationId);
    loadConversationDetails(conversationId);
    setReplyTo(null);
  }, [loadConversationDetails]);

  // Send message
  const handleSendMessage = useCallback(async (
    content: string,
    attachments: Omit<ConversationAttachment, 'id'>[],
    messageType: 'text' | 'image' | 'file' | 'voice_note',
    replyToId?: string
  ) => {
    if (!selectedConversationId || !freelancerId) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email) return;

      const { data: freelancer } = await supabase
        .from('freelancers')
        .select('full_name')
        .eq('email', session.user.email)
        .single();

      const message = await ConversationService.sendMessage(selectedConversationId, {
        content,
        sender_type: 'freelancer',
        sender_name: freelancer?.full_name || 'مستقل',
        message_type: messageType,
        attachments,
        reply_to: replyToId
      });

      if (message) {
        // Reload conversation to get updated messages
        loadConversationDetails(selectedConversationId);
        loadConversations(); // Update conversation list
        
        toast({
          title: "تم إرسال الرسالة",
          description: "تم إرسال رسالتك بنجاح"
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [selectedConversationId, freelancerId, loadConversationDetails, loadConversations]);

  // Upload file
  const handleUploadFile = useCallback(async (file: File): Promise<ConversationAttachment | null> => {
    if (!freelancerId || !selectedConversationId) return null;

    try {
      const attachment = await ConversationService.uploadAttachment(
        freelancerId,
        selectedConversationId,
        file
      );

      if (!attachment) {
        throw new Error('فشل في رفع الملف');
      }

      return attachment;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "خطأ في رفع الملف",
        description: "حاول مرة أخرى",
        variant: "destructive"
      });
      return null;
    }
  }, [freelancerId, selectedConversationId]);

  // Record voice note
  const handleRecordVoiceNote = useCallback(async (
    audioBlob: Blob, 
    duration: number
  ): Promise<ConversationAttachment | null> => {
    if (!freelancerId || !selectedConversationId) return null;

    try {
      const attachment = await ConversationService.recordVoiceNote(
        freelancerId,
        selectedConversationId,
        audioBlob,
        duration
      );

      if (!attachment) {
        throw new Error('فشل في تسجيل الرسالة الصوتية');
      }

      return attachment;
    } catch (error) {
      console.error('Error recording voice note:', error);
      toast({
        title: "خطأ في التسجيل",
        description: "حاول مرة أخرى",
        variant: "destructive"
      });
      return null;
    }
  }, [freelancerId, selectedConversationId]);

  // Handle message actions
  const handleReply = useCallback((messageId: string) => {
    if (!selectedConversation) return;
    
    const message = selectedConversation.messages.find(m => m.id === messageId);
    if (message) {
      setReplyTo({
        id: messageId,
        content: message.content,
        senderName: message.sender_name
      });
    }
  }, [selectedConversation]);

  const handleDownloadAttachment = useCallback((attachment: ConversationAttachment) => {
    // Create download link
    const link = document.createElement('a');
    link.href = attachment.file_url;
    link.download = attachment.file_name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation?.messages]);

  // Load conversations when freelancer ID is available
  useEffect(() => {
    if (freelancerId) {
      loadConversations();
    }
  }, [freelancerId, loadConversations]);

  // Real-time subscriptions
  useEffect(() => {
    if (!freelancerId) return;

    const subscription = ConversationService.subscribeToConversations(
      freelancerId,
      (payload) => {
        console.log('Real-time conversation update:', payload);
        loadConversations();
        
        // If the updated conversation is currently selected, reload it
        if (selectedConversationId && payload.new?.id === selectedConversationId) {
          loadConversationDetails(selectedConversationId);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [freelancerId, selectedConversationId, loadConversations, loadConversationDetails]);

  return (
    <div className="min-h-screen bg-background font-tajawal">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">المحادثات</h1>
            <p className="text-muted-foreground">تواصل مع عملائك</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <MessageSquarePlus className="h-4 w-4 ml-2" />
              محادثة جديدة
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Archive className="h-4 w-4 ml-2" />
                  أرشفة المحادثات المحددة
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="h-4 w-4 ml-2" />
                  تمييز كمهم
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 ml-2" />
                  إعدادات المحادثات
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي المحادثات</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">نشطة</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">غير مقروءة</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
                </div>
                <Badge className="bg-blue-500 text-white">{stats.unread}</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">مهمة</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.high_priority}</p>
                </div>
                <Star className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">مؤرشفة</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
                </div>
                <Archive className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-400px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">قائمة المحادثات</CardTitle>
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Search and Filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="البحث في المحادثات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="active">نشطة</SelectItem>
                      <SelectItem value="archived">مؤرشفة</SelectItem>
                      <SelectItem value="closed">مغلقة</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="الأولوية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأولويات</SelectItem>
                      <SelectItem value="urgent">عاجل</SelectItem>
                      <SelectItem value="high">مهم</SelectItem>
                      <SelectItem value="normal">عادي</SelectItem>
                      <SelectItem value="low">منخفض</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-3 h-full overflow-hidden">
              <div className="h-full overflow-y-auto">
                <ConversationList
                  conversations={conversations}
                  selectedConversationId={selectedConversationId}
                  onSelectConversation={handleSelectConversation}
                  loading={loading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-medium">
                          {selectedConversation.client_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {selectedConversation.client_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedConversation.title}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {selectedConversation.status === 'active' ? 'نشط' : 
                         selectedConversation.status === 'archived' ? 'مؤرشف' : 'مغلق'}
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>أرشفة المحادثة</DropdownMenuItem>
                          <DropdownMenuItem>تمييز كمهم</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">حذف المحادثة</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages Area */}
                <CardContent className="flex-1 overflow-hidden p-0">
                  <div 
                    ref={messagesContainerRef}
                    className="h-full overflow-y-auto p-4 space-y-4"
                  >
                    {messagesLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <>
                        {selectedConversation.messages.map((message) => (
                          <MessageCard
                            key={message.id}
                            message={message}
                            isOwn={message.sender_type === 'freelancer'}
                            onReply={handleReply}
                            onDownloadAttachment={handleDownloadAttachment}
                          />
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>
                </CardContent>

                {/* Message Input */}
                <MessageInput
                  onSendMessage={handleSendMessage}
                  onUploadFile={handleUploadFile}
                  onRecordVoiceNote={handleRecordVoiceNote}
                  replyTo={replyTo}
                  onCancelReply={() => setReplyTo(null)}
                  placeholder="اكتب رسالتك هنا..."
                />
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquarePlus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    اختر محادثة
                  </h3>
                  <p className="text-muted-foreground">
                    اختر محادثة من القائمة لبدء التواصل
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Conversations;