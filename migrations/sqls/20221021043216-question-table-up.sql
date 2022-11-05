CREATE TABLE diary.question (
  id serial PRIMARY KEY,
  text text NOT NULL,
  shown_date date NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX question_shown_date_idx ON diary.question (shown_date);

COMMENT ON TABLE diary.question IS 'Questions for different dates';
COMMENT ON COLUMN diary.question.id IS 'The primary unique identifier';
COMMENT ON COLUMN diary.question.text IS 'The text of the question';
COMMENT ON COLUMN diary.question.shown_date IS 'The date when the question is shown';