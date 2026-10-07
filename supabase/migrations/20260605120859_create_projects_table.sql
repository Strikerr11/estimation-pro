CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  client_name TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  engineer_name TEXT NOT NULL DEFAULT '',
  project_type TEXT NOT NULL DEFAULT 'residential' CHECK (project_type IN ('residential', 'commercial', 'industrial')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed')),
  total_cost NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_projects" ON projects FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_projects" ON projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_projects" ON projects FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_projects" ON projects FOR DELETE TO authenticated USING (auth.uid() = user_id);