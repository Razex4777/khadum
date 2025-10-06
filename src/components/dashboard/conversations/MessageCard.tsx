import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Download, 
  Play, 
  Pause, 
  Reply, 
  MoreHorizontal,
  Eye,
  FileText,
  Image as ImageIcon,
  Music,
  Video
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConversationMessage, ConversationAttachment } from '@/lib/conversationService';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface MessageCardProps {
  message: ConversationMessage;
  isOwn: boolean;
  onReply?: (messageId: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  onDownloadAttachment?: (attachment: ConversationAttachment) => void;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  isOwn,
  onReply,
  onEdit,
  onDelete,
  onDownloadAttachment
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    if (fileType.startsWith('audio/')) return <Music className="h-4 w-4" />;
    if (fileType.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'} group`}>
      {/* Avatar */}
      {!isOwn && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={message.sender_avatar} />
          <AvatarFallback className="text-xs">
            {message.sender_name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender Name & Timestamp */}
        <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-sm font-medium text-foreground">
            {isOwn ? 'أنت' : message.sender_name}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(message.timestamp), { 
              addSuffix: true, 
              locale: ar 
            })}
          </span>
          {message.is_edited && (
            <Badge variant="outline" className="text-xs px-1 py-0">
              معدل
            </Badge>
          )}
        </div>

        {/* Message Bubble */}
        <Card className={`${
          isOwn 
            ? 'bg-primary text-primary-foreground ml-auto' 
            : 'bg-muted'
        } border-0 shadow-sm`}>
          <CardContent className="p-3">
            {/* Reply Context */}
            {message.reply_to && (
              <div className="mb-2 pb-2 border-b border-border/50">
                <div className="text-xs opacity-70 flex items-center gap-1">
                  <Reply className="h-3 w-3" />
                  رد على رسالة
                </div>
              </div>
            )}

            {/* Text Content */}
            {message.message_type === 'text' && (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            )}

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map((attachment) => (
                  <div key={attachment.id}>
                    {/* Image Attachment */}
                    {attachment.file_type.startsWith('image/') && (
                      <div className="relative">
                        <img
                          src={attachment.file_url}
                          alt={attachment.file_name}
                          className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          style={{ maxHeight: '300px' }}
                          onClick={() => window.open(attachment.file_url, '_blank')}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                          onClick={() => onDownloadAttachment?.(attachment)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    {/* Audio/Voice Note */}
                    {(attachment.file_type.startsWith('audio/') || message.message_type === 'voice_note') && (
                      <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handlePlayPause}
                          className="h-8 w-8 rounded-full p-0"
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground mb-1">
                            {message.message_type === 'voice_note' ? 'رسالة صوتية' : attachment.file_name}
                          </div>
                          
                          {/* Audio Progress Bar */}
                          <div className="w-full bg-border h-1 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-300"
                              style={{ 
                                width: attachment.duration 
                                  ? `${(currentTime / attachment.duration) * 100}%`
                                  : '0%'
                              }}
                            />
                          </div>
                          
                          <div className="text-xs text-muted-foreground mt-1">
                            {attachment.duration && formatDuration(attachment.duration)}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDownloadAttachment?.(attachment)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>

                        <audio
                          ref={audioRef}
                          src={attachment.file_url}
                          onTimeUpdate={handleTimeUpdate}
                          onEnded={() => setIsPlaying(false)}
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                        />
                      </div>
                    )}

                    {/* File Attachment */}
                    {!attachment.file_type.startsWith('image/') && 
                     !attachment.file_type.startsWith('audio/') && 
                     message.message_type !== 'voice_note' && (
                      <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center justify-center h-10 w-10 bg-primary/10 rounded-lg">
                          {getFileIcon(attachment.file_type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {attachment.file_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatFileSize(attachment.file_size)}
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(attachment.file_url, '_blank')}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDownloadAttachment?.(attachment)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Message Actions (Show on Hover) */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2 flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply?.(message.id)}
                className="h-6 w-6 p-0"
              >
                <Reply className="h-3 w-3" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isOwn && (
                    <>
                      <DropdownMenuItem onClick={() => onEdit?.(message.id, message.content)}>
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete?.(message.id)}
                        className="text-destructive"
                      >
                        حذف
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(message.content)}>
                    نسخ النص
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Read Indicators */}
        {isOwn && message.read_by && message.read_by.length > 0 && (
          <div className="text-xs text-muted-foreground mt-1">
            تم قراءتها
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCard;