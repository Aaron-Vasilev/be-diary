CREATE TYPE diary.jwt AS (
  role text,
  user_id integer,
  exp bigint
)