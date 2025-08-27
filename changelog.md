# Changelog

## 2025-08-14 23:15

### Removed Additional Freelancer Fields
- **src/lib/supabase.ts**: Removed cv_file_url, cv_external_link, and acceptance_rate from Freelancer interface
- **src/pages/authentication/Register.tsx**: Removed CV external link field, validation, and form input
- **Database Migration**: Applied migration to drop cv_file_url, cv_external_link, and acceptance_rate columns

#### Additional Fields Removed:
- CV Information: `cv_file_url`, `cv_external_link`
- Performance: `acceptance_rate`

## 2025-08-14 22:40

### Removed Freelancer Data Fields
- **src/lib/supabase.ts**: Updated Freelancer interface to remove financial, account status, and experience fields
- **src/pages/authentication/Register.tsx**: Removed form fields and validation for iban, bank_verified, subscription_type, status, experience_level, experience_years, and portfolio_items
- **whatsapp-bot/src/services/supabaseService.js**: Updated database queries to remove references to removed fields
- **whatsapp-bot/src/services/geminiService.js**: Updated freelancer display format to remove experience level and years
- **whatsapp-bot/src/controllers/messageProcessor.js**: Updated freelancer summary format to remove experience information
- **remove_freelancer_fields_migration.sql**: Created SQL migration script to drop columns from Supabase freelancers table

#### Fields Removed:
- Financial Information: `iban`, `bank_verified`
- Account Status: `subscription_type`, `status`
- Experience & Skills: `experience_level`, `experience_years`, `portfolio_items`

#### Current Remaining Fields:
- Basic Info: `id`, `full_name`, `national_id`, `email`, `whatsapp_number`, `field`
- Performance: `average_rating`, `total_projects`, `completed_projects`
- Status: `is_verified`
- Timestamps: `created_at`, `updated_at`
