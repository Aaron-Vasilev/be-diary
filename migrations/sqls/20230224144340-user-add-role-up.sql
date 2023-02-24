-- Add the "role" column to the "user_account" table
ALTER TABLE private.user_account
ADD COLUMN role VARCHAR(10);

-- Set the default value of the "role" column to "user"
ALTER TABLE private.user_account
ALTER COLUMN role SET DEFAULT 'user';

-- Update all existing rows to have the "user" role
UPDATE private.user_account
SET role = 'user';
