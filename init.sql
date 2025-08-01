-- Initialize the database for kapal_lawd_articles
-- This file will be executed when the PostgreSQL container starts for the first time

-- Connect to the database
\c kapal_lawd_articles;
 

-- Log successful initialization
SELECT 'Database kapal_lawd_articles initialized successfully' as message;
