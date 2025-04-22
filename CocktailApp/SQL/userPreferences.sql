DROP TABLE IF EXISTS UserPreferences;

CREATE TABLE UserPreferences (
    Mail INTEGER,
    CocktailIDs TEXT,
    FOREIGN KEY (Mail) REFERENCES User(Mail)
);