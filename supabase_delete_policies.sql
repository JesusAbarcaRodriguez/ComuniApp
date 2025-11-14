-- ============================================================
-- POLÍTICAS RLS PARA PERMITIR ELIMINACIÓN DE EVENTOS Y GRUPOS
-- ============================================================
-- Ejecuta este script en Supabase SQL Editor
-- (Dashboard > SQL Editor > New Query)

-- ============================================================
-- 1. POLÍTICA PARA ELIMINAR EVENTOS
-- ============================================================
-- Permite eliminar un evento si el usuario es:
-- - Owner del grupo al que pertenece el evento, O
-- - Admin del grupo al que pertenece el evento

DROP POLICY IF EXISTS "Users can delete events if admin/owner" ON events;

CREATE POLICY "Users can delete events if admin/owner" ON events
FOR DELETE
TO authenticated
USING (
  -- Verifica si el usuario es owner del grupo
  EXISTS (
    SELECT 1 FROM groups
    WHERE groups.id = events.group_id
    AND groups.owner_id = auth.uid()
  )
  OR
  -- Verifica si el usuario es admin/owner en group_members
  EXISTS (
    SELECT 1 FROM group_members
    WHERE group_members.group_id = events.group_id
    AND group_members.user_id = auth.uid()
    AND group_members.role IN ('OWNER', 'ADMIN')
  )
);

-- ============================================================
-- 2. POLÍTICA PARA ELIMINAR GRUPOS
-- ============================================================
-- Permite eliminar un grupo SOLO si el usuario es el owner

DROP POLICY IF EXISTS "Users can delete groups if owner" ON groups;

CREATE POLICY "Users can delete groups if owner" ON groups
FOR DELETE
TO authenticated
USING (
  owner_id = auth.uid()
);

-- ============================================================
-- 3. VERIFICAR POLÍTICAS CREADAS
-- ============================================================
-- Ejecuta estas consultas para verificar que las políticas se crearon correctamente

-- Ver políticas de la tabla events
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'events';

-- Ver políticas de la tabla groups
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'groups';

-- ============================================================
-- NOTAS IMPORTANTES:
-- ============================================================
-- 1. Asegúrate de que RLS esté habilitado en ambas tablas:
--    ALTER TABLE events ENABLE ROW LEVEL SECURITY;
--    ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
--
-- 2. Verifica que las relaciones CASCADE estén configuradas:
--    - event_attendees.event_id debe tener ON DELETE CASCADE
--    - events.group_id debe tener ON DELETE CASCADE
--    - group_members.group_id debe tener ON DELETE CASCADE
--    - group_join_requests.group_id debe tener ON DELETE CASCADE
--
-- 3. Si los DELETE aún no funcionan, verifica los logs en:
--    Dashboard > Logs > Postgres Logs
-- ============================================================
