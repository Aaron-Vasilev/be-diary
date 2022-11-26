CREATE TABLE diary.note (
  id serial PRIMARY KEY,
  user_id integer REFERENCES diary.user (id) ON DELETE CASCADE,
  text text NOT NULL,
  created_date DATE NOT NULL DEFAULT CURRENT_DATE,
  question_id integer REFERENCES diary.question (id) NOT NULL
);

CREATE INDEX note_created_date_idx ON diary.note (created_date);

COMMENT ON TABLE diary.note IS 'Table for notes in notebook';
COMMENT ON COLUMN diary.note.id IS 'The primary unique identifier';
COMMENT ON COLUMN diary.note.user_id IS 'The reference to user table';
COMMENT ON COLUMN diary.note.text IS 'The text itself of the note';
COMMENT ON COLUMN diary.note.created_date IS 'The date when the note was created';