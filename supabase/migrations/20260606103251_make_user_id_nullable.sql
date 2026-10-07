-- Make user_id nullable to allow anonymous/local projects
ALTER TABLE projects ALTER COLUMN user_id DROP NOT NULL;

-- Also make estimates and boqs project_id nullable for local estimates
ALTER TABLE estimates ALTER COLUMN project_id DROP NOT NULL;
ALTER TABLE boqs ALTER COLUMN project_id DROP NOT NULL;