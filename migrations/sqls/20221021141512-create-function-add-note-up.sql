CREATE FUNCTION diary.add_note (note_text text, note_date date, quesion_id integer)
  RETURNS diary.note
  AS $$
DECLARE
  new_note diary.note;
BEGIN
  INSERT INTO diary.note (text, created_date, question_id)
    VALUES (note_text, note_date, quesion_id)
  RETURNING
    * INTO new_note;
  RETURN new_note;
END;
$$
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER;