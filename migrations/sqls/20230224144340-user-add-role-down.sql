-- Set the "role" column to NULL for all existing rows
UPDATE private.user_account
SET role = NULL;

-- Remove the "role" column from the "user_account" table
ALTER TABLE private.user_account
DROP COLUMN role;
