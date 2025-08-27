import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fegxpfdvrqywmwiobuer.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlZ3hwZmR2cnF5d213aW9idWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNTUzMDAsImV4cCI6MjA2OTgzMTMwMH0.xQSEBIWmZ0XmQCWv4x9NOWM0ViiN5EODzL4p_BeXCgQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Freelancer {
  id: string
  full_name: string
  national_id: string
  email: string
  whatsapp_number: string
  field: string // Now stores detailed service like "التصميم والإبداع - تصميم شعارات"
  average_rating: number
  total_projects: number
  completed_projects: number
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  freelancer_user_id: string
  
  // Personal Information
  display_name?: string
  bio?: string
  title?: string
  location?: string
  
  // Profile Images
  avatar_url?: string
  cover_image_url?: string
  
  // Professional Details
  hourly_rate?: number
  minimum_project_budget?: number
  availability_status: 'available' | 'busy' | 'vacation'
  experience_level?: 'no_experience' | 'less_than_1' | '1_to_2' | '3_to_5' | '6_to_10' | 'more_than_10'
  
  // Skills and Expertise
  skills?: any[]
  languages?: { [key: string]: string }
  
  // Portfolio and Work (keeping for future use)
  portfolio_items?: any[]
  
  // Service Delivery
  response_time: number
  revision_rounds: number
  
  // Platform Metrics
  profile_completion_percentage: number
  profile_views: number
  last_active: string
  is_featured: boolean
  is_top_rated: boolean
  
  // Metadata
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  freelancer_user_id: string
  title: string
  description?: string
  thumbnail_url?: string
  images?: string[]
  external_link?: string
  tags?: string[]
  is_featured?: boolean
  view_count?: number
  likes_count?: number
  client_name?: string
  project_year?: number
  project_duration?: string
  created_at: string
  updated_at: string
}

export interface ProjectTag {
  id: string
  name: string
  color?: string
  usage_count?: number
  created_at: string
  updated_at: string
}

