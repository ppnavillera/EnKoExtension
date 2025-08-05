-- Grant permissions for service_role to access notion table
-- This allows Edge Functions to read and update the notion table

-- Grant all necessary permissions to service_role
GRANT SELECT, INSERT, UPDATE ON TABLE "public"."notion" TO "service_role";

-- Optional: Grant permissions to authenticated users if needed for future features
-- GRANT SELECT, INSERT, UPDATE ON TABLE "public"."notion" TO "authenticated";