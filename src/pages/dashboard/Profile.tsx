import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Camera, 
  Upload, 
  Save, 
  Star, 
  MapPin, 
  Calendar, 
  Briefcase,
  Award,
  Eye,
  Shield,
  Plus,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { ProfileService } from '@/lib/profileService';

interface ProfileData {
  displayName: string;
  bio: string;
  title: string;
  location: string;
  hourlyRate: number;
  minimumBudget: number;
  availabilityStatus: 'available' | 'busy' | 'vacation';
  experienceLevel: 'no_experience' | 'less_than_1' | '1_to_2' | '3_to_5' | '6_to_10' | 'more_than_10';
  skills: string[];
  languages: { [key: string]: string };
  responseTime: number;
  revisionRounds: number;
  avatarUrl?: string;
  coverImageUrl?: string;
}

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: 'أحمد محمد',
    bio: 'مطور ويب متخصص في React و Node.js مع أكثر من 5 سنوات خبرة في تطوير التطبيقات الحديثة والمتجاوبة',
    title: 'مطور ويب متقدم',
    location: 'الرياض، السعودية',
    hourlyRate: 150,
    minimumBudget: 500,
    availabilityStatus: 'available',
    experienceLevel: '3_to_5',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    languages: { 'العربية': 'أصلي', 'الإنجليزية': 'ممتاز' },
    responseTime: 2,
    revisionRounds: 3
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [profileCompletion, setProfileCompletion] = useState(85);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [freelancerId, setFreelancerId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [registrationDate, setRegistrationDate] = useState<string>('منذ شهر');

  const mapDbToState = (p: any): ProfileData => ({
    displayName: p.display_name || '',
    bio: p.bio || '',
    title: p.title || '',
    location: p.location || '',
    hourlyRate: Number(p.hourly_rate || 0),
    minimumBudget: Number(p.minimum_project_budget || 0),
    availabilityStatus: p.availability_status || 'available',
    experienceLevel: p.experience_level || '3_to_5',
    skills: p.skills || [],
    languages: p.languages || {},
    responseTime: p.response_time || 0,
    revisionRounds: p.revision_rounds || 0,
    avatarUrl: p.avatar_url || undefined,
    coverImageUrl: p.cover_image_url || undefined,
  });

  const mapStateToDb = (s: ProfileData) => ({
    display_name: s.displayName,
    bio: s.bio,
    title: s.title,
    location: s.location,
    hourly_rate: s.hourlyRate,
    minimum_project_budget: s.minimumBudget,
    availability_status: s.availabilityStatus,
    experience_level: s.experienceLevel,
    skills: s.skills,
    languages: s.languages,
    response_time: s.responseTime,
    revision_rounds: s.revisionRounds,
    avatar_url: s.avatarUrl,
    cover_image_url: s.coverImageUrl,
  });

  useEffect(() => {
    const init = async () => {
      const { data: s } = await supabase.auth.getSession();
      const email = s.session?.user?.email;
      if (!email) return;
      const { data: freelancer } = await supabase
        .from('freelancers')
        .select('id, full_name, created_at')
        .eq('email', email)
        .single();
      if (!freelancer) return;
      setFreelancerId(freelancer.id);
      
      // Format registration date
      const createdDate = new Date(freelancer.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) {
        setRegistrationDate(`منذ ${diffDays} يوم`);
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        setRegistrationDate(`منذ ${months} شهر`);
      } else {
        const years = Math.floor(diffDays / 365);
        setRegistrationDate(`منذ ${years} سنة`);
      }
      const existing = await ProfileService.getProfile(freelancer.id);
      if (existing) {
        setProfileData(mapDbToState(existing as any));
        setProfileCompletion((existing as any).profile_completion_percentage ?? 0);
      } else {
        const created = await ProfileService.createProfile({
          freelancer_user_id: freelancer.id,
          display_name: freelancer.full_name,
          availability_status: 'available',
          response_time: 0,
          revision_rounds: 0,
        } as any);
        if (created) {
          setProfileData(mapDbToState(created as any));
          setProfileCompletion((created as any).profile_completion_percentage ?? 0);
        }
      }
    };
    init();
  }, []);

  const handleSkillAdd = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleSkillRemove = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
              skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSave = async () => {
    if (!freelancerId) return;
    try {
      setIsSaving(true);
      const updates = mapStateToDb(profileData);
      const updated = await ProfileService.updateProfile(freelancerId, updates as any);
      if (updated) {
        setProfileCompletion((updated as any).profile_completion_percentage ?? profileCompletion);
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!freelancerId) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await ProfileService.uploadProfileImage(freelancerId, file, 'avatar');
    if (url) {
      const next = { ...profileData, avatarUrl: url };
      setProfileData(next);
      await ProfileService.updateProfile(freelancerId, { avatar_url: url } as any);
    }
  };

  const handleCoverSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!freelancerId) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await ProfileService.uploadProfileImage(freelancerId, file, 'cover');
    if (url) {
      const next = { ...profileData, coverImageUrl: url };
      setProfileData(next);
      await ProfileService.updateProfile(freelancerId, { cover_image_url: url } as any);
    }
  };

  const handleDeleteImage = async (type: 'avatar' | 'cover') => {
    if (!freelancerId) return;
    const ok = await ProfileService.deleteProfileImage(freelancerId, type);
    if (ok) {
      const next = { ...profileData, ...(type === 'avatar' ? { avatarUrl: undefined } : { coverImageUrl: undefined }) };
      setProfileData(next);
      await ProfileService.updateProfile(
        freelancerId,
        type === 'avatar' ? ({ avatar_url: null } as any) : ({ cover_image_url: null } as any)
      );
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-primary/20 text-primary border-primary/30';
      case 'busy': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'vacation': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getAvailabilityText = (status: string) => {
    switch (status) {
      case 'available': return 'متاح للعمل';
      case 'busy': return 'مشغول';
      case 'vacation': return 'في إجازة';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Background Effects */}
      <div className="absolute inset-0" style={{ backgroundImage: 'var(--gradient-hero)' }}></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground accent-text">الملف الشخصي</h1>
            <p className="text-muted-foreground">إدارة معلوماتك الشخصية والمهنية</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{profileCompletion}%</div>
              <div className="text-xs text-muted-foreground">اكتمال الملف</div>
            </div>
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="bg-primary hover:bg-primary/90"
              disabled={isSaving}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ التغييرات
                </>
              ) : (
                <>
                  <Button className="w-4 h-4 ml-2" />
                  تعديل الملف
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Picture & Cover */}
            <Card className="bg-card/80 backdrop-blur-xl border-border accent-ring">
              <CardContent className="p-6">
                {/* Cover Image */}
                <div className="relative h-32 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg mb-4 overflow-hidden">
                  {profileData.coverImageUrl && (
                    <img src={profileData.coverImageUrl} alt="cover" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-primary/30" />
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 left-2 bg-black/50 hover:bg-black/70"
                      onClick={() => coverInputRef.current?.click()}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverSelected}
                  />
                  {isEditing && profileData.coverImageUrl && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute bottom-2 left-2"
                      onClick={() => handleDeleteImage('cover')}
                    >
                      حذف الغلاف
                    </Button>
                  )}
                </div>

                {/* Avatar */}
                <div className="relative -mt-16 flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background bg-primary flex items-center justify-center">
                      {profileData.avatarUrl ? (
                        <img src={profileData.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-primary-foreground">أ</span>
                      )}
                    </div>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute -bottom-2 -left-2 bg-primary hover:bg-primary/90 rounded-full w-8 h-8"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarSelected}
                    />
                    {isEditing && profileData.avatarUrl && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -bottom-2 left-8 rounded-full h-8"
                        onClick={() => handleDeleteImage('avatar')}
                      >
                        حذف
                      </Button>
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="text-center mt-4 space-y-2">
                  {isEditing ? (
                    <Input
                      value={profileData.displayName}
                      onChange={(e) => setProfileData(prev => ({...prev, displayName: e.target.value}))}
                      className="text-center font-bold text-lg"
                    />
                  ) : (
                    <h3 className="font-bold text-lg text-foreground">{profileData.displayName}</h3>
                  )}
                  
                  {isEditing ? (
                    <Input
                      value={profileData.title}
                      onChange={(e) => setProfileData(prev => ({...prev, title: e.target.value}))}
                      className="text-center text-muted-foreground"
                    />
                  ) : (
                    <p className="text-muted-foreground">{profileData.title}</p>
                  )}

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {isEditing ? (
                      <Input
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({...prev, location: e.target.value}))}
                        className="text-center text-sm"
                      />
                    ) : (
                      <span>{profileData.location}</span>
                    )}
                  </div>

                  <Badge className={getAvailabilityColor(profileData.availabilityStatus)}>
                    {getAvailabilityText(profileData.availabilityStatus)}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">4.9</div>
                    <div className="text-xs text-muted-foreground">التقييم</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">42</div>
                    <div className="text-xs text-muted-foreground">مشروع</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">100%</div>
                    <div className="text-xs text-muted-foreground">اكتمال</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card/80 backdrop-blur-xl border-border accent-ring">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  إحصائيات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">وقت الاستجابة</span>
                  <span className="text-foreground">{profileData.responseTime} ساعة</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">عدد التعديلات</span>
                  <span className="text-foreground">{profileData.revisionRounds} مرات</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">تاريخ التسجيل</span>
                  <span className="text-foreground">{registrationDate}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Section */}
            <Card className="bg-card/80 backdrop-blur-xl border-border accent-ring">
              <CardHeader>
                <CardTitle className="text-foreground">نبذة شخصية</CardTitle>
                <CardDescription>اكتب نبذة موجزة عن خبراتك ومهاراتك</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-2">
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) => {
                        const text = e.target.value;
                        if (text.length <= 300) {
                          setProfileData(prev => ({...prev, bio: text}));
                        }
                      }}
                      className="min-h-[120px]"
                      placeholder="اكتب نبذة عن نفسك وخبراتك... (حد أقصى 300 حرف)"
                      maxLength={300}
                    />
                    <div className="text-sm text-muted-foreground text-left">
                      {profileData.bio.length}/300 حرف
                    </div>
                  </div>
                ) : (
                  <p className="text-foreground leading-relaxed">{profileData.bio}</p>
                )}
              </CardContent>
            </Card>

            {/* Professional Details */}
            <Card className="bg-card/80 backdrop-blur-xl border-border accent-ring">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  التفاصيل المهنية
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">السعر بالساعة (ريال)</Label>
                  {isEditing ? (
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={profileData.hourlyRate}
                      onChange={(e) => setProfileData(prev => ({...prev, hourlyRate: Number(e.target.value)}))}
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded-md text-foreground">
                      {profileData.hourlyRate} ريال
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimumBudget">أقل ميزانية مشروع (ريال)</Label>
                  {isEditing ? (
                    <Input
                      id="minimumBudget"
                      type="number"
                      value={profileData.minimumBudget}
                      onChange={(e) => setProfileData(prev => ({...prev, minimumBudget: Number(e.target.value)}))}
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded-md text-foreground">
                      {profileData.minimumBudget} ريال
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">سنوات الخبرة</Label>
                  {isEditing ? (
                    <Select 
                      value={profileData.experienceLevel}
                      onValueChange={(value: 'no_experience' | 'less_than_1' | '1_to_2' | '3_to_5' | '6_to_10' | 'more_than_10') => 
                        setProfileData(prev => ({...prev, experienceLevel: value}))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no_experience">بدون خبرة</SelectItem>
                        <SelectItem value="less_than_1">أقل من سنة</SelectItem>
                        <SelectItem value="1_to_2">من سنة إلى سنتين</SelectItem>
                        <SelectItem value="3_to_5">من 3 إلى 5 سنوات</SelectItem>
                        <SelectItem value="6_to_10">من 6 إلى 10 سنوات</SelectItem>
                        <SelectItem value="more_than_10">أكثر من 10 سنوات</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-3 bg-muted rounded-md text-foreground">
                      {profileData.experienceLevel === 'no_experience' ? 'بدون خبرة' : 
                       profileData.experienceLevel === 'less_than_1' ? 'أقل من سنة' :
                       profileData.experienceLevel === '1_to_2' ? 'من سنة إلى سنتين' :
                       profileData.experienceLevel === '3_to_5' ? 'من 3 إلى 5 سنوات' :
                       profileData.experienceLevel === '6_to_10' ? 'من 6 إلى 10 سنوات' :
                       profileData.experienceLevel === 'more_than_10' ? 'أكثر من 10 سنوات' : 'غير محدد'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">حالة التوفر</Label>
                  {isEditing ? (
                    <Select 
                      value={profileData.availabilityStatus}
                      onValueChange={(value: 'available' | 'busy' | 'vacation') => 
                        setProfileData(prev => ({...prev, availabilityStatus: value}))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">متاح للعمل</SelectItem>
                        <SelectItem value="busy">مشغول</SelectItem>
                        <SelectItem value="vacation">في إجازة</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-3 bg-muted rounded-md text-foreground">
                      {getAvailabilityText(profileData.availabilityStatus)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-card/80 backdrop-blur-xl border-border accent-ring">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  المهارات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profileData.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => handleSkillRemove(skill)}
                          className="mr-2 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>

                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="أضف مهارة جديدة..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSkillAdd()}
                    />
                    <Button onClick={handleSkillAdd} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


