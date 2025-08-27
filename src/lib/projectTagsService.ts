import { supabase } from './supabase'
import type { ProjectTag } from './supabase'

export class ProjectTagsService {
  static async getAllTags(): Promise<ProjectTag[]> {
    const { data, error } = await supabase
      .from('project_tags')
      .select('*')
      .order('usage_count', { ascending: false })

    if (error) {
      console.error('Error fetching project tags:', error)
      return []
    }
    return data || []
  }

  static async getPopularTags(limit: number = 20): Promise<ProjectTag[]> {
    const { data, error } = await supabase
      .from('project_tags')
      .select('*')
      .gt('usage_count', 0)
      .order('usage_count', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching popular tags:', error)
      return []
    }
    return data || []
  }

  static async searchTags(query: string): Promise<ProjectTag[]> {
    const { data, error } = await supabase
      .from('project_tags')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('usage_count', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error searching tags:', error)
      return []
    }
    return data || []
  }

  static async createTag(name: string, color?: string): Promise<ProjectTag | null> {
    const { data, error } = await supabase
      .from('project_tags')
      .insert({
        name: name.toLowerCase().trim(),
        color: color || '#3B82F6'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating tag:', error)
      return null
    }
    return data
  }

  static async getOrCreateTag(name: string, color?: string): Promise<ProjectTag | null> {
    // First try to find existing tag
    const { data: existing } = await supabase
      .from('project_tags')
      .select('*')
      .eq('name', name.toLowerCase().trim())
      .single()

    if (existing) {
      return existing
    }

    // Create new tag if not found
    return this.createTag(name, color)
  }
}
