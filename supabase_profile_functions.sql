-- Function to increment profile views
CREATE OR REPLACE FUNCTION increment_profile_views(freelancer_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE profiles 
    SET profile_views = profile_views + 1,
        updated_at = NOW()
    WHERE freelancer_user_id = freelancer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-calculate profile completion on profile updates
CREATE OR REPLACE FUNCTION calculate_profile_completion()
RETURNS TRIGGER AS $$
DECLARE
    completion_score INTEGER := 0;
    total_fields INTEGER := 10;
BEGIN
    -- Check each important field and increment score
    IF NEW.display_name IS NOT NULL AND NEW.display_name != '' THEN
        completion_score := completion_score + 1;
    END IF;
    
    IF NEW.bio IS NOT NULL AND NEW.bio != '' THEN
        completion_score := completion_score + 1;
    END IF;
    
    IF NEW.title IS NOT NULL AND NEW.title != '' THEN
        completion_score := completion_score + 1;
    END IF;
    
    IF NEW.location IS NOT NULL AND NEW.location != '' THEN
        completion_score := completion_score + 1;
    END IF;
    
    IF NEW.avatar_url IS NOT NULL AND NEW.avatar_url != '' THEN
        completion_score := completion_score + 1;
    END IF;
    
    IF NEW.hourly_rate IS NOT NULL AND NEW.hourly_rate > 0 THEN
        completion_score := completion_score + 1;
    END IF;
    
    IF NEW.minimum_project_budget IS NOT NULL AND NEW.minimum_project_budget > 0 THEN
        completion_score := completion_score + 1;
    END IF;
    
    IF NEW.primary_skills IS NOT NULL AND array_length(NEW.primary_skills, 1) > 0 THEN
        completion_score := completion_score + 1;
    END IF;
    
    IF NEW.languages IS NOT NULL AND jsonb_object_keys(NEW.languages) IS NOT NULL THEN
        completion_score := completion_score + 1;
    END IF;
    
    IF NEW.work_preference IS NOT NULL AND NEW.work_preference != '' THEN
        completion_score := completion_score + 1;
    END IF;
    
    -- Calculate percentage
    NEW.profile_completion_percentage := ROUND((completion_score::DECIMAL / total_fields) * 100);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-calculating profile completion
CREATE TRIGGER trigger_calculate_profile_completion
    BEFORE INSERT OR UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION calculate_profile_completion();

-- Function to get profile analytics
CREATE OR REPLACE FUNCTION get_profile_analytics(freelancer_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'profile_views', COALESCE(profile_views, 0),
        'completion_percentage', COALESCE(profile_completion_percentage, 0),
        'skills_count', COALESCE(array_length(primary_skills, 1), 0),
        'is_featured', COALESCE(is_featured, false),
        'is_top_rated', COALESCE(is_top_rated, false),
        'days_since_last_active', EXTRACT(DAY FROM (NOW() - last_active))
    ) INTO result
    FROM profiles
    WHERE freelancer_user_id = freelancer_id;
    
    RETURN COALESCE(result, '{}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View for profile search with ranking
CREATE OR REPLACE VIEW profile_search_view AS
SELECT 
    p.*,
    f.full_name,
    f.field,
    f.average_rating,
    f.total_projects,
    f.is_verified,
    -- Search ranking score
    (
        CASE WHEN p.is_featured THEN 100 ELSE 0 END +
        CASE WHEN p.is_top_rated THEN 50 ELSE 0 END +
        CASE WHEN p.availability_status = 'available' THEN 30 ELSE 0 END +
        (p.profile_completion_percentage / 4) +
        (LEAST(f.average_rating * 4, 20)) +
        (LEAST(f.total_projects, 50))
    ) AS search_rank
FROM profiles p
JOIN freelancers f ON p.freelancer_user_id = f.id
WHERE p.profile_completion_percentage > 30; -- Only show reasonably complete profiles

-- Create index for search performance
CREATE INDEX IF NOT EXISTS idx_profiles_search_rank ON profiles(profile_completion_percentage DESC, last_active DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_skills_gin ON profiles USING GIN(primary_skills);
CREATE INDEX IF NOT EXISTS idx_profiles_location_text ON profiles USING GIN(to_tsvector('english', location));
CREATE INDEX IF NOT EXISTS idx_profiles_title_bio_text ON profiles USING GIN(to_tsvector('arabic', COALESCE(title, '') || ' ' || COALESCE(bio, '')));



