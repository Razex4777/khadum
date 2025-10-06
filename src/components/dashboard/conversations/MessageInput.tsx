import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Mic,
  MicOff,
  X,
  Play,
  Pause,
  Trash2,
  FileText
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { ConversationAttachment } from '@/lib/conversationService';

interface MessageInputProps {
  onSendMessage: (
    content: string,
    attachments: Omit<ConversationAttachment, 'id'>[],
    messageType: 'text' | 'image' | 'file' | 'voice_note',
    replyToId?: string
  ) => Promise<void>;
  onUploadFile: (file: File) => Promise<ConversationAttachment | null>;
  onRecordVoiceNote: (audioBlob: Blob, duration: number) => Promise<ConversationAttachment | null>;
  isLoading?: boolean;
  placeholder?: string;
  replyTo?: { id: string; content: string; senderName: string };
  onCancelReply?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onUploadFile,
  onRecordVoiceNote,
  isLoading = false,
  placeholder = "اكتب رسالتك هنا...",
  replyTo,
  onCancelReply
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<(Omit<ConversationAttachment, 'id'> & { localId: string })[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const localId = `${Date.now()}-${i}`;
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "خطأ في رفع الملف",
          description: `الملف ${file.name} كبير جداً. الحد الأقصى 10 ميجابايت.`,
          variant: "destructive"
        });
        continue;
      }

      // Add to attachments list with loading state
      const tempAttachment = {
        localId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file_url: '', // Will be set after upload
        thumbnail_url: undefined
      };

      setAttachments(prev => [...prev, tempAttachment]);
      setUploadProgress(prev => ({ ...prev, [localId]: 0 }));

      try {
        // Start upload
        const uploadedAttachment = await onUploadFile(file);
        
        if (uploadedAttachment) {
          // Update attachment with real data
          setAttachments(prev => 
            prev.map(att => 
              att.localId === localId 
                ? { 
                    ...att, 
                    file_url: uploadedAttachment.file_url,
                    thumbnail_url: uploadedAttachment.thumbnail_url 
                  }
                : att
            )
          );
          setUploadProgress(prev => ({ ...prev, [localId]: 100 }));
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "خطأ في رفع الملف",
          description: `فشل في رفع الملف ${file.name}`,
          variant: "destructive"
        });
        
        // Remove failed attachment
        setAttachments(prev => prev.filter(att => att.localId !== localId));
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[localId];
          return newProgress;
        });
      }
    }
  }, [onUploadFile]);

  // Start voice recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start duration counter
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "خطأ في التسجيل",
        description: "لا يمكن الوصول للميكروفون",
        variant: "destructive"
      });
    }
  }, []);

  // Stop voice recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  }, [isRecording]);

  // Play/pause voice preview
  const toggleVoicePreview = useCallback(() => {
    if (!audioBlob) return;
    
    if (!audioPreviewRef.current) {
      audioPreviewRef.current = new Audio(URL.createObjectURL(audioBlob));
      audioPreviewRef.current.onended = () => setIsPlayingPreview(false);
    }
    
    if (isPlayingPreview) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioPreviewRef.current.play();
      setIsPlayingPreview(true);
    }
  }, [audioBlob, isPlayingPreview]);

  // Delete voice recording
  const deleteVoiceRecording = useCallback(() => {
    setAudioBlob(null);
    setRecordingDuration(0);
    setIsPlayingPreview(false);
    
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      audioPreviewRef.current = null;
    }
  }, []);

  // Remove attachment
  const removeAttachment = useCallback((localId: string) => {
    setAttachments(prev => prev.filter(att => att.localId !== localId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[localId];
      return newProgress;
    });
  }, []);

  // Send message
  const handleSend = useCallback(async () => {
    if (!message.trim() && attachments.length === 0 && !audioBlob) return;
    
    try {
      let messageType: 'text' | 'image' | 'file' | 'voice_note' = 'text';
      let finalAttachments: Omit<ConversationAttachment, 'id'>[] = [];
      
      if (audioBlob) {
        // Send voice note
        const voiceAttachment = await onRecordVoiceNote(audioBlob, recordingDuration);
        if (voiceAttachment) {
          finalAttachments.push({
            file_name: voiceAttachment.file_name,
            file_size: voiceAttachment.file_size,
            file_type: voiceAttachment.file_type,
            file_url: voiceAttachment.file_url,
            duration: recordingDuration
          });
          messageType = 'voice_note';
        }
      } else if (attachments.length > 0) {
        // Check if upload is complete
        const incompleteUploads = attachments.filter(att => !att.file_url);
        if (incompleteUploads.length > 0) {
          toast({
            title: "انتظار رفع الملفات",
            description: "يرجى انتظار انتهاء رفع جميع الملفات",
            variant: "destructive"
          });
          return;
        }
        
        finalAttachments = attachments.map(att => ({
          file_name: att.file_name,
          file_size: att.file_size,
          file_type: att.file_type,
          file_url: att.file_url,
          thumbnail_url: att.thumbnail_url
        }));
        
        messageType = attachments.some(att => att.file_type.startsWith('image/')) ? 'image' : 'file';
      }
      
      await onSendMessage(
        message.trim() || (audioBlob ? 'رسالة صوتية' : 'مرفقات'),
        finalAttachments,
        messageType,
        replyTo?.id
      );
      
      // Reset form
      setMessage('');
      setAttachments([]);
      setUploadProgress({});
      deleteVoiceRecording();
      onCancelReply?.();
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "خطأ في إرسال الرسالة",
        description: "حاول مرة أخرى",
        variant: "destructive"
      });
    }
  }, [message, attachments, audioBlob, recordingDuration, replyTo, onSendMessage, onRecordVoiceNote, onCancelReply, deleteVoiceRecording]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-background p-4">
      {/* Reply Context */}
      {replyTo && (
        <div className="mb-3 p-3 bg-muted rounded-lg flex items-center justify-between">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">
              رد على {replyTo.senderName}
            </div>
            <div className="text-sm truncate">
              {replyTo.content}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelReply}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Voice Recording Preview */}
      {audioBlob && (
        <Card className="mb-3">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoicePreview}
                className="h-8 w-8 rounded-full p-0"
              >
                {isPlayingPreview ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              
              <div className="flex-1">
                <div className="text-sm font-medium">رسالة صوتية</div>
                <div className="text-xs text-muted-foreground">
                  {formatDuration(recordingDuration)}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={deleteVoiceRecording}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3 space-y-2">
          {attachments.map((attachment) => (
            <Card key={attachment.localId}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-8 w-8 bg-primary/10 rounded">
                    {getFileIcon(attachment.file_type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {attachment.file_name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(attachment.file_size)}
                    </div>
                    
                    {uploadProgress[attachment.localId] !== undefined && 
                     uploadProgress[attachment.localId] < 100 && (
                      <Progress 
                        value={uploadProgress[attachment.localId]} 
                        className="h-1 mt-1"
                      />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {uploadProgress[attachment.localId] === 100 && (
                      <Badge variant="outline" className="text-xs">
                        تم الرفع
                      </Badge>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(attachment.localId)}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        {/* Attachment & Voice Buttons */}
        <div className="flex gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                <Paperclip className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <FileText className="h-4 w-4 ml-2" />
                ملف
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = 'image/*';
                    fileInputRef.current.click();
                  }
                }}
              >
                <ImageIcon className="h-4 w-4 ml-2" />
                صورة
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="sm"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading || !!audioBlob}
          >
            {isRecording ? (
              <>
                <MicOff className="h-4 w-4" />
                <span className="ml-1 text-xs">
                  {formatDuration(recordingDuration)}
                </span>
              </>
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Text Input */}
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading || isRecording || !!audioBlob}
            className="min-h-[44px] max-h-32 resize-none"
            rows={1}
          />
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={isLoading || (!message.trim() && attachments.length === 0 && !audioBlob)}
          size="sm"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            handleFileUpload(e.target.files);
            e.target.value = '';
          }
        }}
        accept="image/*,audio/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  );
};

export default MessageInput;