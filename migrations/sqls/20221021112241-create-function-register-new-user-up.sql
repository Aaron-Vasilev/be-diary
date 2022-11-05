CREATE FUNCTION diary.register_user (name VARCHAR(48), email text, password text)
  RETURNS diary.user
  AS $$
DECLARE
  new_user diary.user;
BEGIN
  INSERT INTO diary.user (name)
    VALUES (name)
  RETURNING
    * INTO new_user;
  INSERT INTO private.user_account (user_id, email, password_hash)
    VALUES (
      new_user.id,
      email,
      crypt(password, gen_salt('bf'))
    );
  RETURN new_user;
END;
$$
LANGUAGE plpgsql
STRICT
SECURITY DEFINER;