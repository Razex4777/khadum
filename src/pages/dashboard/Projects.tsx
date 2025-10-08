import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase'
import type { Project, ProjectTag } from '@/lib/supabase'
import { ProjectsService } from '@/lib/projectsService'
import { ProjectTagsService } from '@/lib/projectTagsService'
import { 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Link2, 
  Edit3, 
  Eye, 
  Heart, 
  Calendar,
  Clock,
  User,
  Filter,
  Search,
  Grid3X3,
  List,
  Save,
  X,
  Tag,
  Star,
  Briefcase
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ProjectFormData {
  title: string
  description: string
  client_name: string
  project_year: number
  project_duration: string
  external_link: string
  tags: string[]
  thumbnail_url?: string
  images: string[]
}

const Projects = () => {
  const [freelancerId, setFreelancerId] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [tagFilter, setTagFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [availableTags, setAvailableTags] = useState<ProjectTag[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const [tagSuggestions, setTagSuggestions] = useState<ProjectTag[]>([])
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    client_name: '',
    project_year: new Date().getFullYear(),
    project_duration: '',
    external_link: '',
    tags: [],
    images: []
  })

  const imagesInputRef = useRef<HTMLInputElement>(null)
  const thumbInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const init = async () => {
      const { data: s } = await supabase.auth.getSession()
      const email = s.session?.user?.email
      if (!email) return
      const { data: freelancer } = await supabase
        .from('freelancers')
        .select('id')
        .eq('email', email)
        .single()
      if (!freelancer) return
      setFreelancerId(freelancer.id)
      await Promise.all([
        loadProjects(freelancer.id),
        loadAvailableTags()
      ])
    }
    init()
  }, [])

  // Filter projects when search or tag changes
  useEffect(() => {
    let filtered = projects
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    if (tagFilter !== 'all') {
      filtered = filtered.filter(p => p.tags?.includes(tagFilter))
    }
    setFilteredProjects(filtered)
  }, [projects, searchTerm, tagFilter])

  // Search tags for suggestions
  useEffect(() => {
    const searchTags = async () => {
      if (currentTag.trim().length > 0) {
        const suggestions = await ProjectTagsService.searchTags(currentTag)
        setTagSuggestions(suggestions)
      } else {
        setTagSuggestions([])
      }
    }
    searchTags()
  }, [currentTag])

  const loadProjects = async (freelancerId: string) => {
    const list = await ProjectsService.listMyProjects(freelancerId)
    setProjects(list)
  }

  const loadAvailableTags = async () => {
    const tags = await ProjectTagsService.getPopularTags(50)
    setAvailableTags(tags)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      client_name: '',
      project_year: new Date().getFullYear(),
      project_duration: '',
      external_link: '',
      tags: [],
      images: []
    })
    setCurrentTag('')
    setEditingProject(null)
  }

  const handleUploadThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!freelancerId) return
    const file = e.target.files?.[0]
    if (!file) return

    const url = await ProjectsService.uploadImage(freelancerId, file)
    if (url) {
      setFormData(prev => ({ ...prev, thumbnail_url: url }))
      toast({ title: '✅ تم رفع الصورة المصغرة بنجاح' })
    } else {
      toast({ title: '❌ فشل في رفع الصورة', variant: 'destructive' })
    }
  }

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!freelancerId) return
    const files = Array.from(e.target.files || [])
    const remaining = Math.max(0, 10 - formData.images.length)
    const slice = files.slice(0, remaining)
    
    const uploaded: string[] = []
    for (const f of slice) {
      const url = await ProjectsService.uploadImage(freelancerId, f)
      if (url) uploaded.push(url)
    }
    
    if (uploaded.length > 0) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...uploaded] }))
      toast({ title: `✅ تم رفع ${uploaded.length} صورة بنجاح` })
    }
  }

  const handleRemoveImage = async (url: string) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter(u => u !== url) }))
    await ProjectsService.deleteImage(url)
  }

  const handleAddTag = async (tagName?: string) => {
    const name = (tagName || currentTag).trim().toLowerCase()
    if (!name || formData.tags.includes(name)) return

    // Create or get tag
    await ProjectTagsService.getOrCreateTag(name)
    
    setFormData(prev => ({ 
      ...prev, 
      tags: [...prev.tags, name] 
    }))
    setCurrentTag('')
    setTagSuggestions([])
    
    // Refresh available tags
    await loadAvailableTags()
  }

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(t => t !== tag) 
    }))
  }

  const handleSubmit = async () => {
    if (!freelancerId || !formData.title.trim()) {
      toast({ title: '❌ يرجى إدخال عنوان المشروع', variant: 'destructive' })
      return
    }

    setIsSubmitting(true)
    try {
      const projectData = {
        freelancer_user_id: freelancerId,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        client_name: formData.client_name.trim() || undefined,
        project_year: formData.project_year,
        project_duration: formData.project_duration.trim() || undefined,
        thumbnail_url: formData.thumbnail_url || undefined,
        images: formData.images,
        external_link: formData.external_link.trim() || undefined,
        tags: formData.tags
      }

      let result: Project | null = null
      if (editingProject) {
        result = await ProjectsService.updateProject(editingProject.id, projectData)
      } else {
        result = await ProjectsService.createProject(projectData)
      }

      if (result) {
        await Promise.all([
          loadProjects(freelancerId),
          loadAvailableTags() // Refresh to update usage counts
        ])
        resetForm()
        setShowCreateDialog(false)
        toast({ 
          title: editingProject ? '✅ تم تحديث المشروع بنجاح' : '✅ تم إضافة المشروع بنجاح'
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description || '',
      client_name: project.client_name || '',
      project_year: project.project_year || new Date().getFullYear(),
      project_duration: project.project_duration || '',
      external_link: project.external_link || '',
      tags: project.tags || [],
      thumbnail_url: project.thumbnail_url,
      images: project.images || []
    })
    setShowCreateDialog(true)
  }

  const handleDelete = async (project: Project) => {
    const confirmed = window.confirm(`هل أنت متأكد من حذف مشروع "${project.title}"؟`)
    if (!confirmed) return

    // Delete associated images
    if (project.thumbnail_url) {
      await ProjectsService.deleteImage(project.thumbnail_url)
    }
    if (project.images) {
      for (const img of project.images) {
        await ProjectsService.deleteImage(img)
      }
    }

    const success = await ProjectsService.deleteProject(project.id)
    if (success) {
      await Promise.all([
        loadProjects(freelancerId!),
        loadAvailableTags() // Refresh to update usage counts
      ])
      toast({ title: '✅ تم حذف المشروع بنجاح' })
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-SA', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getTagColor = (tagName: string) => {
    const tag = availableTags.find(t => t.name === tagName)
    return tag?.color || '#3B82F6'
  }

  // Get popular tags for filtering
  const popularTags = availableTags.filter(tag => tag.usage_count && tag.usage_count > 0).slice(0, 10)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-ultra-light p-6 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between animate-in slide-in-from-top duration-700">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-dark to-primary bg-clip-text text-transparent mb-2 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-primary" />
              معرض المشاريع
            </h1>
            <p className="text-lg text-muted-foreground">إدارة وعرض أعمالك ومشاريعك السابقة</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-12 px-6">
                <Plus className="w-5 h-5 ml-2" />
                إضافة مشروع جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
                </DialogTitle>
                <DialogDescription>
                  {editingProject ? 'قم بتعديل تفاصيل المشروع' : 'أضف مشروعًا جديدًا إلى معرض أعمالك'}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">عنوان المشروع *</Label>
                    <Input 
                      id="title" 
                      value={formData.title} 
                      onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="مثال: تطبيق إدارة المهام" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client">اسم العميل</Label>
                    <Input 
                      id="client" 
                      value={formData.client_name} 
                      onChange={e => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                      placeholder="شركة ABC" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">سنة المشروع</Label>
                      <Input 
                        id="year" 
                        type="number" 
                        value={formData.project_year} 
                        onChange={e => setFormData(prev => ({ ...prev, project_year: parseInt(e.target.value) || new Date().getFullYear() }))}
                        min="2000" 
                        max={new Date().getFullYear() + 1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">مدة المشروع</Label>
                      <Input 
                        id="duration" 
                        value={formData.project_duration} 
                        onChange={e => setFormData(prev => ({ ...prev, project_duration: e.target.value }))}
                        placeholder="3 أسابيع" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="link">رابط خارجي</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="link" 
                        value={formData.external_link} 
                        onChange={e => setFormData(prev => ({ ...prev, external_link: e.target.value }))}
                        placeholder="https://example.com" 
                      />
                      <Link2 className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-2" />
                    </div>
                  </div>
                </div>

                {/* Description & Tags */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="desc">وصف المشروع</Label>
                    <Textarea 
                      id="desc" 
                      value={formData.description} 
                      onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="اكتب وصفًا تفصيليًا للمشروع والتحديات والحلول المستخدمة..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>المهارات</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={currentTag} 
                        onChange={e => setCurrentTag(e.target.value)}
                        placeholder="أضف مهارة جديدة..."
                        onKeyPress={e => e.key === 'Enter' && handleAddTag()}
                      />
                      <Button type="button" variant="secondary" onClick={() => handleAddTag()}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Tag Suggestions */}
                    {tagSuggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-md">
                        <span className="text-xs text-muted-foreground">اقتراحات:</span>
                        {tagSuggestions.map((tag) => (
                          <Button
                            key={tag.id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddTag(tag.name)}
                            className="h-6 text-xs"
                          >
                            {tag.name}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    {/* Selected Tags */}
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          className="text-white border-0"
                          style={{ backgroundColor: getTagColor(tag) }}
                        >
                          <Tag className="w-3 h-3 ml-1" />
                          {tag}
                          <button onClick={() => handleRemoveTag(tag)} className="mr-1 hover:text-destructive">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>

                    {/* Popular Tags */}
                    {popularTags.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">المهارات الشائعة:</Label>
                        <div className="flex flex-wrap gap-2">
                          {popularTags.filter(tag => !formData.tags.includes(tag.name)).slice(0, 8).map((tag) => (
                            <Button
                              key={tag.id}
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddTag(tag.name)}
                              className="h-7 text-xs"
                            >
                              <Tag className="w-3 h-3 ml-1" />
                              {tag.name} ({tag.usage_count})
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Images */}
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>الصورة المصغرة</Label>
                      <div className="flex items-center gap-3">
                        <Button type="button" variant="secondary" onClick={() => thumbInputRef.current?.click()}>
                          <Upload className="w-4 h-4 ml-2" /> رفع صورة
                        </Button>
                        <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadThumbnail} />
                      </div>
                      {formData.thumbnail_url && (
                        <div className="relative inline-block">
                          <img src={formData.thumbnail_url} alt="thumbnail" className="h-24 w-24 object-cover rounded-md border border-border" />
                          <button 
                            onClick={() => setFormData(prev => ({ ...prev, thumbnail_url: undefined }))}
                            className="absolute -top-2 -left-2 bg-destructive text-destructive-foreground rounded-full p-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>صور المشروع ({formData.images.length}/10)</Label>
                      <div className="flex items-center gap-3">
                        <Button type="button" variant="secondary" onClick={() => imagesInputRef.current?.click()}>
                          <ImageIcon className="w-4 h-4 ml-2" /> رفع صور
                        </Button>
                        <span className="text-sm text-muted-foreground">حد أقصى 10MB لكل صورة</span>
                        <input ref={imagesInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUploadImages} />
                      </div>
                    </div>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                      {formData.images.map((url) => (
                        <div key={url} className="relative group">
                          <img src={url} alt="project" className="h-20 w-20 object-cover rounded border border-border" />
                          <button 
                            onClick={() => handleRemoveImage(url)}
                            className="absolute -top-2 -left-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className="md:col-span-2 flex gap-3 pt-4">
                  <Button onClick={handleSubmit} disabled={isSubmitting || !formData.title.trim()} className="bg-primary">
                    <Save className="w-4 h-4 ml-2" />
                    {editingProject ? 'تحديث المشروع' : 'إضافة المشروع'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    إلغاء
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Enhanced Stats */}
        <Card className="glass-card border-0 shadow-2xl animate-in slide-in-from-bottom duration-700">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 hover:shadow-lg transition-all duration-300">
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">{projects.length}</div>
                <div className="text-sm text-muted-foreground font-medium">إجمالي المشاريع</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 hover:shadow-lg transition-all duration-300">
                <div className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">{projects.filter(p => p.is_featured).length}</div>
                <div className="text-sm text-muted-foreground font-medium">المشاريع المميزة</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:shadow-lg transition-all duration-300">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">{projects.reduce((sum, p) => sum + (p.view_count || 0), 0)}</div>
                <div className="text-sm text-muted-foreground font-medium">إجمالي المشاهدات</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:shadow-lg transition-all duration-300">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{availableTags.length}</div>
                <div className="text-sm text-muted-foreground font-medium">المهارات المستخدمة</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:shadow-lg transition-all duration-300">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">{projects.reduce((sum, p) => sum + (p.likes_count || 0), 0)}</div>
                <div className="text-sm text-muted-foreground font-medium">إجمالي الإعجابات</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search & Filters */}
        <Card className="glass-card border-0 shadow-2xl animate-in slide-in-from-left duration-700">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="البحث في المشاريع..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Tags Filter */}
        {popularTags.length > 0 && (
          <Card className="glass-card border-0 shadow-2xl animate-in slide-in-from-right duration-700">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Tag className="w-5 h-5" />
                فلترة بالمهارات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={tagFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTagFilter('all')}
                >
                  جميع المشاريع ({projects.length})
                </Button>
                {popularTags.map((tag) => (
                  <Button
                    key={tag.id}
                    variant={tagFilter === tag.name ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTagFilter(tag.name)}
                    className="gap-2"
                  >
                    <Badge 
                      className="text-white border-0 text-xs"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name} ({tag.usage_count})
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects List */}
        <Card className="glass-card border-0 shadow-2xl animate-in slide-in-from-bottom duration-700">
          <CardHeader>
            <CardTitle className="text-foreground">مشاريعي ({filteredProjects.length})</CardTitle>
            <CardDescription>إدارة وتعديل المشاريع المضافة</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredProjects.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">لا توجد مشاريع</p>
                <p className="text-sm">
                  {tagFilter !== 'all' 
                    ? `لا توجد مشاريع تحتوي على "${tagFilter}"` 
                    : 'ابدأ بإضافة مشروعك الأول'
                  }
                </p>
              </div>
            )}

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                  <div key={project.id} className="border-0 rounded-2xl overflow-hidden bg-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                    {/* Project Image */}
                    <div className="relative">
                      {project.thumbnail_url ? (
                        <img src={project.thumbnail_url} alt={project.title} className="w-full h-48 object-cover" />
                      ) : (
                        <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="w-12 h-12" />
                        </div>
                      )}
                      {project.is_featured && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            <Star className="w-3 h-3 ml-1" />
                            مميز
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Project Info */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{project.title}</h3>
                        {project.client_name && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {project.client_name}
                          </p>
                        )}
                      </div>

                      {project.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                      )}

                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.tags.slice(0, 3).map((tag) => (
                            <Badge 
                              key={tag} 
                              className="text-white border-0 text-xs"
                              style={{ backgroundColor: getTagColor(tag) }}
                            >
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 3 && (
                            <Badge className="bg-muted text-muted-foreground text-xs">
                              +{project.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          {project.project_year && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {project.project_year}
                            </span>
                          )}
                          {project.project_duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {project.project_duration}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {project.view_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {project.likes_count || 0}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-between items-center pt-3 border-t border-border">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                            <Edit3 className="w-4 h-4 ml-1" />
                            تعديل
                          </Button>
                          {project.external_link && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={project.external_link} target="_blank" rel="noopener noreferrer">
                                <Link2 className="w-4 h-4 ml-1" />
                                رابط
                              </a>
                            </Button>
                          )}
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(project)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredProjects.map(project => (
                  <div key={project.id} className="border border-border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0">
                        {project.thumbnail_url ? (
                          <img src={project.thumbnail_url} alt={project.title} className="w-20 h-20 object-cover rounded-md" />
                        ) : (
                          <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{project.title}</h3>
                            {project.client_name && (
                              <p className="text-sm text-muted-foreground">{project.client_name}</p>
                            )}
                          </div>
                          {project.is_featured && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              <Star className="w-3 h-3 ml-1" />
                              مميز
                            </Badge>
                          )}
                        </div>

                        {project.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                        )}

                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.tags.map((tag) => (
                              <Badge 
                                key={tag} 
                                className="text-white border-0 text-xs"
                                style={{ backgroundColor: getTagColor(tag) }}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {project.project_year && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {project.project_year}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {project.view_count || 0}
                            </span>
                            <span>تم الإنشاء في {formatDate(project.created_at)}</span>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                              <Edit3 className="w-4 h-4 ml-1" />
                              تعديل
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(project)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Projects