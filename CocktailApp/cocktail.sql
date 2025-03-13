DROP TABLE IF EXISTS Cocktail;
DROP TABLE IF EXISTS Ingredient;
DROP TABLE IF EXISTS Cocktail_Ingredient;

CREATE TABLE Cocktail (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    alcoholic TEXT,
    glass TEXT,
    instructions TEXT,
    image_url TEXT
);

CREATE TABLE Ingredient (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE Cocktail_Ingredient (
    cocktail_id INTEGER,
    ingredient_id INTEGER,
    PRIMARY KEY (cocktail_id, ingredient_id),
    FOREIGN KEY (cocktail_id) REFERENCES Cocktail(id),
    FOREIGN KEY (ingredient_id) REFERENCES Ingredient(id)
);
