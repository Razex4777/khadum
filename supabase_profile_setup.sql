-- Create comprehensive freelancer profile table
CREATE TABLE profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    freelancer_user_id UUID REFERENCES freelancers(id) ON DELETE CASCADE,
    
    -- Personal Information
    display_name VARCHAR(100),
    bio TEXT,
    title VARCHAR(150), -- Professional title like "Senior Full-Stack Developer"
    location VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(20),
    
    -- Profile Images
    avatar_url TEXT, -- Profile picture URL from storage
    cover_image_url TEXT, -- Cover/banner image URL
    
    -- Professional Details
    experience_years INTEGER DEFAULT 0,
    hourly_rate DECIMAL(10,2),
    minimum_project_budget DECIMAL(10,2),
    availability_status VARCHAR(50) DEFAULT 'available', -- available, busy, vacation
    work_preference VARCHAR(50), -- remote, on-site, hybrid
    
    -- Skills and Expertise
    primary_skills TEXT[], -- Array of main skills
    secondary_skills TEXT[], -- Array of additional skills
    languages JSONB, -- {"arabic": "native", "english": "fluent", "french": "basic"}
    certifications TEXT[], -- Professional certifications
    
    -- Portfolio and Work
    portfolio_items JSONB, -- Array of portfolio pieces with images/links
    education JSONB, -- Education background
    work_experience JSONB, -- Previous work experience
    
    -- Service Delivery
    response_time INTEGER DEFAULT 24, -- Hours to respond
    revision_rounds INTEGER DEFAULT 3,
    delivery_guarantee BOOLEAN DEFAULT false,
    
    -- Verification and Trust
    identity_verified BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    document_verification_status VARCHAR(50) DEFAULT 'pending', -- pending, verified, rejected
    
    -- Platform Metrics
    profile_completion_percentage INTEGER DEFAULT 0,
    profile_views INTEGER DEFAULT 0,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_featured BOOLEAN DEFAULT false,
    is_top_rated BOOLEAN DEFAULT false,
    
    -- Preferences and Settings
    notification_preferences JSONB DEFAULT '{"email": true, "whatsapp": true, "project_updates": true}',
    privacy_settings JSONB DEFAULT '{"show_email": false, "show_phone": false, "show_location": true}',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_freelancer_user_id ON profiles(freelancer_user_id);
CREATE INDEX idx_profiles_availability_status ON profiles(availability_status);
CREATE INDEX idx_profiles_hourly_rate ON profiles(hourly_rate);
CREATE INDEX idx_profiles_experience_years ON profiles(experience_years);
CREATE INDEX idx_profiles_is_featured ON profiles(is_featured);
CREATE INDEX idx_profiles_is_top_rated ON profiles(is_top_rated);
CREATE INDEX idx_profiles_last_active ON profiles(last_active);
CREATE INDEX idx_profiles_primary_skills ON profiles USING GIN(primary_skills);

-- Create update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for profile assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'profiles',
    'profiles',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
);

-- Set up RLS (Row Level Security) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view public profile information
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

-- Policy: Users can only update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = freelancer_user_id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = freelancer_user_id);

-- Storage policies for profile bucket
CREATE POLICY "Profile images are publicly viewable" ON storage.objects
    FOR SELECT USING (bucket_id = 'profiles');

CREATE POLICY "Users can upload their own profile images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'profiles' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own profile images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'profiles' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own profile images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'profiles' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Sample data for testing (optional)
-- This will be commented out in production
/*
INSERT INTO profiles (
    freelancer_user_id,
    display_name,
    bio,
    title,
    location,
    experience_years,
    hourly_rate,
    primary_skills,
    languages,
    availability_status
) VALUES (
    (SELECT id FROM freelancers LIMIT 1), -- Use existing freelancer ID
    'أحمد محمد',
    'مطور ويب متخصص في React و Node.js مع أكثر من 5 سنوات خبرة في تطوير التطبيقات الحديثة',
    'مطور ويب متقدم',
    'الرياض، السعودية',
    5,
    150.00,
    ARRAY['React', 'Node.js', 'TypeScript', 'MongoDB'],
    '{"arabic": "native", "english": "fluent"}',
    'available'
);
*/



