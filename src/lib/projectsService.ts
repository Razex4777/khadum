import { supabase } from './supabase'
import type { Project } from './supabase'

export class ProjectsService {
  static async listMyProjects(freelancerUserId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('freelancer_user_id', freelancerUserId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error listing projects:', error)
      return []
    }
    return data || []
  }

  static async createProject(project: Partial<Project>): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error)
      return null
    }
    return data
  }

  static async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating project:', error)
      return null
    }
    return data
  }

  static async deleteProject(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting project:', error)
      return false
    }
    return true
  }

  static async uploadImage(userId: string, file: File): Promise<string | null> {
    if (file.size > 10 * 1024 * 1024) {
      console.warn('File too large (max 10MB)')
      return null
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.warn('Invalid file type')
      return null
    }

    const ext = file.name.split('.').pop()?.toLowerCase()
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif']
    if (!ext || !allowedExts.includes(ext)) {
      console.warn('Invalid file extension')
      return null
    }

    const name = `${userId}/${Date.now()}-${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage
      .from('project-images')
      .upload(name, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(name)
    return publicUrl
  }

  static async deleteImage(url: string): Promise<boolean> {
    try {
      // Extract path from URL
      const urlParts = url.split('/project-images/')
      if (urlParts.length < 2) return false
      
      const path = urlParts[1]
      const { error } = await supabase.storage
        .from('project-images')
        .remove([path])

      if (error) {
        console.error('Delete error:', error)
        return false
      }
      return true
    } catch (error) {
      console.error('Delete error:', error)
      return false
    }
  }

  static async getProject(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching project:', error)
      return null
    }
    return data
  }

  static async incrementViewCount(id: string): Promise<void> {
    await supabase
      .from('projects')
      .update({ view_count: supabase.raw('view_count + 1') })
      .eq('id', id)
  }
}


