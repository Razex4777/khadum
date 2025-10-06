-- Add payment state columns to chat_history table
-- Run this SQL in your Supabase SQL Editor

-- Add payment_state column (default: 'normal')
ALTER TABLE chat_history 
ADD COLUMN IF NOT EXISTS payment_state TEXT DEFAULT 'normal';

-- Add payment_state_updated_at timestamp column
ALTER TABLE chat_history 
ADD COLUMN IF NOT EXISTS payment_state_updated_at TIMESTAMPTZ;

-- Add pending_payment_data JSONB column for storing payment details
ALTER TABLE chat_history 
ADD COLUMN IF NOT EXISTS pending_payment_data JSONB;

-- Add index on payment_state for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_history_payment_state 
ON chat_history(payment_state);

-- Add index on payment_state_updated_at for expiration queries
CREATE INDEX IF NOT EXISTS idx_chat_history_payment_updated 
ON chat_history(payment_state_updated_at);

-- Update existing records to have default payment state
UPDATE chat_history 
SET payment_state = 'normal' 
WHERE payment_state IS NULL;

-- Verify the columns were added successfully
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'chat_history' 
AND column_name IN ('payment_state', 'payment_state_updated_at', 'pending_payment_data')
ORDER BY column_name;