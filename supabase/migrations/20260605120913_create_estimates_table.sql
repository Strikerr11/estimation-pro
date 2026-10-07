CREATE TABLE estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('window', 'door', 'brickwork', 'rcc_slab', 'flooring', 'paint')),
  name TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  results JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_estimates" ON estimates FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = estimates.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "insert_own_estimates" ON estimates FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE projects.id = estimates.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "update_own_estimates" ON estimates FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = estimates.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "delete_own_estimates" ON estimates FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = estimates.project_id AND projects.user_id = auth.uid()));