CREATE TABLE private.user_account (
  id serial PRIMARY KEY,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  iv VARCHAR(32),
  name varchar(255) DEFAULT 'Lolli'
);

CREATE INDEX user_account_email_idx ON private.user_account (email);