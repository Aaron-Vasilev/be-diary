CREATE FUNCTION diary.authenticate (email text, password text)
  RETURNS diary.jwt
  AS $$
DECLARE
  account private.user_account;
BEGIN
  SELECT
    * INTO account
  FROM
    private.user_account
  WHERE
    user_account.email = authenticate.email;
  IF account.password_hash = crypt(password, account.password_hash) THEN
    RETURN ('logged_user',
      account.user_id,
      extract(epoch FROM (now() + interval '30 days')))::diary.jwt;
  ELSE
    RETURN NULL;
  END IF;
END;
$$
LANGUAGE plpgsql
STRICT
SECURITY DEFINER;