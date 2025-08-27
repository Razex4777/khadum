import { supabase } from './supabase';
import type { Profile } from './supabase';

export class ProfileService {
  /**
   * Get profile by freelancer user ID
   */
  static async getProfile(freelancerUserId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('freelancer_user_id', freelancerUserId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }

  /**
   * Create a new profile
   */
  static async createProfile(profileData: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }

    return data;
  }

  /**
   * Update existing profile
   */
  static async updateProfile(
    freelancerUserId: string, 
    updates: Partial<Profile>
  ): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('freelancer_user_id', freelancerUserId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    return data;
  }

  /**
   * Upload profile image (avatar or cover)
   */
  static async uploadProfileImage(
    freelancerUserId: string,
    file: File,
    type: 'avatar' | 'cover'
  ): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${freelancerUserId}/${type}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(fileName, file, {
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(fileName);

    return publicUrl;
  }

  /**
   * Upload portfolio item
   */
  static async uploadPortfolioItem(
    freelancerUserId: string,
    file: File,
    itemId: string
  ): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${freelancerUserId}/portfolio/${itemId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading portfolio item:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(fileName);

    return publicUrl;
  }

  /**
   * Delete profile image
   */
  static async deleteProfileImage(
    freelancerUserId: string,
    type: 'avatar' | 'cover'
  ): Promise<boolean> {
    const { error } = await supabase.storage
      .from('profiles')
      .remove([`${freelancerUserId}/${type}`]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  }

  /**
   * Calculate profile completion percentage
   */
  static calculateProfileCompletion(profile: Profile): number {
    const fields = [
      'display_name',
      'bio',
      'title',
      'location',
      'avatar_url',
      'hourly_rate',
      'minimum_project_budget',
      'skills',
      'languages',
      'experience_level'
    ];

    const completedFields = fields.filter(field => {
      const value = profile[field as keyof Profile];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === 'object' && value !== null) {
        return Object.keys(value).length > 0;
      }
      return value !== null && value !== undefined && value !== '';
    });

    return Math.round((completedFields.length / fields.length) * 100);
  }

  /**
   * Update profile completion percentage
   */
  static async updateProfileCompletion(freelancerUserId: string): Promise<void> {
    const profile = await this.getProfile(freelancerUserId);
    if (!profile) return;

    const completionPercentage = this.calculateProfileCompletion(profile);
    
    await supabase
      .from('profiles')
      .update({ profile_completion_percentage: completionPercentage })
      .eq('freelancer_user_id', freelancerUserId);
  }

  /**
   * Get featured profiles
   */
  static async getFeaturedProfiles(limit: number = 10): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        freelancers!profiles_freelancer_user_id_fkey (
          full_name,
          field,
          average_rating,
          total_projects,
          is_verified
        )
      `)
      .eq('is_featured', true)
      .eq('availability_status', 'available')
      .order('profile_completion_percentage', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured profiles:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Search profiles by skills or location
   */
  static async searchProfiles(
    query: string,
    filters?: {
      location?: string;
      availability?: 'available' | 'busy' | 'vacation';
      minHourlyRate?: number;
      maxHourlyRate?: number;
      experienceYears?: number;
    }
  ): Promise<Profile[]> {
    let queryBuilder = supabase
      .from('profiles')
      .select(`
        *,
        freelancers!profiles_freelancer_user_id_fkey (
          full_name,
          field,
          average_rating,
          total_projects,
          is_verified
        )
      `);

    // Text search in skills, title, and bio
    if (query) {
      queryBuilder = queryBuilder.or(
        `skills.cs."${query}",title.ilike.%${query}%,bio.ilike.%${query}%`
      );
    }

    // Apply filters
    if (filters?.location) {
      queryBuilder = queryBuilder.ilike('location', `%${filters.location}%`);
    }
    if (filters?.availability) {
      queryBuilder = queryBuilder.eq('availability_status', filters.availability);
    }
    if (filters?.minHourlyRate) {
      queryBuilder = queryBuilder.gte('hourly_rate', filters.minHourlyRate);
    }
    if (filters?.maxHourlyRate) {
      queryBuilder = queryBuilder.lte('hourly_rate', filters.maxHourlyRate);
    }
    if (filters?.experienceYears) {
      queryBuilder = queryBuilder.gte('experience_years', filters.experienceYears);
    }

    const { data, error } = await queryBuilder
      .order('profile_completion_percentage', { ascending: false })
      .order('last_active', { ascending: false });

    if (error) {
      console.error('Error searching profiles:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Increment profile views
   */
  static async incrementProfileViews(freelancerUserId: string): Promise<void> {
    await supabase.rpc('increment_profile_views', {
      freelancer_id: freelancerUserId
    });
  }

  /**
   * Update last active timestamp
   */
  static async updateLastActive(freelancerUserId: string): Promise<void> {
    await supabase
      .from('profiles')
      .update({ last_active: new Date().toISOString() })
      .eq('freelancer_user_id', freelancerUserId);
  }
}


