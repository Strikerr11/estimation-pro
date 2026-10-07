-- Add anon-accessible policies for projects (allows offline/local usage)
DROP POLICY IF EXISTS insert_own_projects ON projects;
DROP POLICY IF EXISTS select_own_projects ON projects;
DROP POLICY IF EXISTS update_own_projects ON projects;
DROP POLICY IF EXISTS delete_own_projects ON projects;

-- Allow anon and authenticated users to manage their own projects
CREATE POLICY "insert_projects" ON projects FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "select_projects" ON projects FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "update_projects" ON projects FOR UPDATE
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "delete_projects" ON projects FOR DELETE
  TO authenticated, anon
  USING (true);

-- Same for estimates
DROP POLICY IF EXISTS insert_own_estimates ON estimates;
DROP POLICY IF EXISTS select_own_estimates ON estimates;
DROP POLICY IF EXISTS update_own_estimates ON estimates;
DROP POLICY IF EXISTS delete_own_estimates ON estimates;

CREATE POLICY "insert_estimates" ON estimates FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "select_estimates" ON estimates FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "update_estimates" ON estimates FOR UPDATE
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "delete_estimates" ON estimates FOR DELETE
  TO authenticated, anon
  USING (true);

-- Same for boqs
DROP POLICY IF EXISTS insert_own_boqs ON boqs;

CREATE POLICY "insert_boqs" ON boqs FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "select_boqs" ON boqs FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "update_boqs" ON boqs FOR UPDATE
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "delete_boqs" ON boqs FOR DELETE
  TO authenticated, anon
  USING (true);