-- Test Verification System
-- Run these commands in Supabase SQL Editor to test the verification flow

-- 1. Check current verification status for your email
SELECT 
    id, 
    full_name, 
    email, 
    is_verified,
    created_at
FROM freelancers 
WHERE email = 'razexelite11@gmail.com';

-- 2. Set your account to unverified (to test the popup)
UPDATE freelancers 
SET is_verified = false 
WHERE email = 'razexelite11@gmail.com';

-- 3. Verify the change was applied
SELECT 
    full_name, 
    email, 
    is_verified,
    whatsapp_number,
    field
FROM freelancers 
WHERE email = 'razexelite11@gmail.com';

-- 4. After testing, set it back to verified
-- UPDATE freelancers 
-- SET is_verified = true 
-- WHERE email = 'razexelite11@gmail.com';

-- 5. Check all freelancers and their verification status
SELECT 
    full_name,
    email,
    is_verified,
    created_at
FROM freelancers
ORDER BY created_at DESC;
