-- Drop the foreign key constraint on user_id to allow anonymous projects
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_user_id_fkey;

-- Make user_id fully nullable and remove any default constraints
ALTER TABLE projects ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE projects ALTER COLUMN user_id SET DEFAULT NULL;