CREATE TABLE meal (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    users_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL, 
    title TEXT NOT NULL,
    description TEXT,
    link TEXT NOT NULL,
    day TEXT NOT NULL,
    kind_of_meal TEXT NOT NULL
);