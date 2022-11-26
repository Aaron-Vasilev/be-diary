CREATE TABLE private.user_account (
  id serial PRIMARY KEY REFERENCES diary.user (id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  iv VARCHAR(32)
);

CREATE INDEX user_account_email_idx ON private.user_account (email);