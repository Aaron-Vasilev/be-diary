CREATE TABLE private.user_account (
  user_id integer PRIMARY KEY REFERENCES diary.user (id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL
);

CREATE INDEX user_account_email_idx ON private.user_account (email);