-- Phase 22: User Roles, Permissions, and Audit Logging

-- 1. Create Roles Table
CREATE TABLE IF NOT EXISTS public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- 2. Create Permissions Matrix
CREATE TABLE IF NOT EXISTS public.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid REFERENCES public.roles(id) ON DELETE CASCADE,
  action text NOT NULL, -- e.g., 'create_question', 'export_pdf', 'manage_users'
  created_at timestamptz DEFAULT now(),
  UNIQUE(role_id, action)
);

-- 3. Map Users to Roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  assigned_by uuid REFERENCES auth.users(id),
  PRIMARY KEY (user_id, role_id)
);

-- 4. Create Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type text NOT NULL,
  entity_type text, -- e.g., 'question', 'user_account'
  entity_id uuid,
  ip_address text,
  user_agent text,
  timestamp timestamptz DEFAULT now()
);

-- 5. Insert Default Roles
INSERT INTO public.roles (name, description) VALUES
('Super Admin', 'Full system access'),
('Admin', 'Manage content and users'),
('Question Setter', 'Create and edit own questions'),
('Reviewer', 'Approve or reject questions'),
('Teacher', 'Generate and export papers'),
('Viewer', 'Read-only access')
ON CONFLICT (name) DO NOTHING;

-- Note: RLS Policies should be applied here to ensure only Super Admins can insert into user_roles.
