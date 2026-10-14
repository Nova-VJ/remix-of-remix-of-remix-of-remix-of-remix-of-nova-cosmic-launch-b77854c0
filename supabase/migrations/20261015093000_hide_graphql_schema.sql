-- The site only uses the REST API: hide the GraphQL schema (table names)
-- from visitors and signed-in users.
REVOKE USAGE ON SCHEMA graphql FROM anon, authenticated;
REVOKE USAGE ON SCHEMA graphql_public FROM anon, authenticated;
