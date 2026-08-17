-- Jarvis — grants + reload schema p/ task_lists / task_items (hotfix A.2)
-- Rode no SQL Editor se a API autenticada não gravar (RLS ok, faltam GRANTs)

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE task_lists TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE task_items TO authenticated;
GRANT ALL ON TABLE task_lists TO service_role;
GRANT ALL ON TABLE task_items TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

NOTIFY pgrst, 'reload schema';
