CREATE TABLE boqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  material_cost NUMERIC NOT NULL DEFAULT 0,
  labor_cost NUMERIC NOT NULL DEFAULT 0,
  transportation_cost NUMERIC NOT NULL DEFAULT 0,
  machinery_cost NUMERIC NOT NULL DEFAULT 0,
  miscellaneous NUMERIC NOT NULL DEFAULT 0,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tax_percent NUMERIC NOT NULL DEFAULT 18,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  grand_total NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE boqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_boqs" ON boqs FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = boqs.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "insert_own_boqs" ON boqs FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE projects.id = boqs.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "update_own_boqs" ON boqs FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = boqs.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "delete_own_boqs" ON boqs FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = boqs.project_id AND projects.user_id = auth.uid()));