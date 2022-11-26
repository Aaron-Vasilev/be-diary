CREATE TABLE diary.user (
  id serial PRIMARY KEY,
  created_at DATE NOT NULL DEFAULT CURRENT_DATE,
  first_name varchar(255) DEFAULT 'Lolli',
  second_name varchar(255) DEFAULT 'Molli'
);

COMMENT ON TABLE diary.user IS 'Table for registered users';
COMMENT ON COLUMN diary.user.id IS 'The primary unique identifier';
COMMENT ON COLUMN diary.user.created_at IS 'User register date';
COMMENT ON COLUMN diary.user.first_name IS 'The first name of the user';
COMMENT ON COLUMN diary.user.second_name IS 'The second name of the user';