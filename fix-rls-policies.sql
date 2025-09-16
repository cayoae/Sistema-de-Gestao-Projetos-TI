-- ========================================
-- FIX ROW LEVEL SECURITY POLICIES
-- ========================================
-- This script fixes the RLS issues for the Sistema de Gestão de Projetos

-- Option 1: Create proper RLS policies for authenticated users
-- ========================================

-- Enable RLS but allow all operations for authenticated users
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT (read)
CREATE POLICY "Allow authenticated users to read clients" ON clients
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Policy for INSERT (create)
CREATE POLICY "Allow authenticated users to insert clients" ON clients
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Policy for UPDATE (edit)
CREATE POLICY "Allow authenticated users to update clients" ON clients
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Policy for DELETE
CREATE POLICY "Allow authenticated users to delete clients" ON clients
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Apply same policies to other tables
-- ========================================

-- PROJECTS table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read projects" ON projects
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert projects" ON projects
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update projects" ON projects
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete projects" ON projects
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- TASKS table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read tasks" ON tasks
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert tasks" ON tasks
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update tasks" ON tasks
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete tasks" ON tasks
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- ========================================
-- Option 2: Temporarily disable RLS for testing (UNCOMMENT IF NEEDED)
-- ========================================

-- ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- ========================================
-- Option 3: Allow anonymous access for development (UNCOMMENT IF NEEDED)
-- ========================================

-- CREATE POLICY "Allow anonymous access to clients" ON clients
--     FOR ALL
--     USING (true)
--     WITH CHECK (true);

-- CREATE POLICY "Allow anonymous access to projects" ON projects
--     FOR ALL
--     USING (true)
--     WITH CHECK (true);

-- CREATE POLICY "Allow anonymous access to tasks" ON tasks
--     FOR ALL
--     USING (true)
--     WITH CHECK (true);

-- ========================================
-- Verification queries
-- ========================================

-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('clients', 'projects', 'tasks', 'users')
ORDER BY tablename, policyname;