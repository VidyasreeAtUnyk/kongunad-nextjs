-- Verification Query
-- Run this in Supabase SQL Editor to verify the table was created correctly

-- Check if table exists and see its structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'form_submissions'
ORDER BY ordinal_position;

-- Check indexes
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'form_submissions';

-- Check if table is empty (should return 0 rows)
SELECT COUNT(*) as total_submissions FROM form_submissions;

-- If you want to test, you can insert a test row:
-- INSERT INTO form_submissions (form_type, form_data)
-- VALUES ('appointment', '{"firstName": "Test", "email": "test@example.com"}'::jsonb);
-- 
-- Then check it:
-- SELECT * FROM form_submissions;
--
-- And delete it:
-- DELETE FROM form_submissions WHERE form_data->>'email' = 'test@example.com';

