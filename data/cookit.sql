DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS measurement_qty;
DROP TABLE IF EXISTS measurement_units;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS recipe_ingredients;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS grocery_list;


CREATE TABLE users (
    id SERIAL NOT NULL UNIQUE,
    first VARCHAR,
    last VARCHAR,
    avatar VARCHAR,
    email VARCHAR NOT NULL UNIQUE,
    username VARCHAR UNIQUE,
    hashed_password VARCHAR
);

CREATE TABLE ingredients (
    id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    ingredient_name VARCHAR NOT NULL
);

CREATE TABLE measurement_qty (
    id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    qty_amount DOUBLE PRECISION NOT NULL
);

CREATE TABLE measurement_units (
    id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    measurement_description VARCHAR NOT NULL
);

CREATE TABLE recipes (
    id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    creator_id INT NOT NULL REFERENCES users(id),
    recipe_name VARCHAR NOT NULL,
    diet VARCHAR,
    img TEXT,
    description TEXT NOT NULL,
    steps TEXT NOT NULL
);

CREATE TABLE recipe_ingredients (
    id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    recipe_id INT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    measurement_id INT NOT NULL REFERENCES measurement_units(id),
    measurement_qty_id INT NOT NULL REFERENCES measurement_qty(id),
    ingredient_id INT NOT NULL REFERENCES ingredients(id)
);

CREATE TABLE my_ingredients (
    id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    ingredient_name VARCHAR NOT NULL,
    measurement_id INT NOT NULL REFERENCES measurement_units(id),
    measurement_qty_id INT NOT NULL REFERENCES measurement_qty(id),
    notes TEXT
);

CREATE TABLE grocery_list (
    id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    user_id int NOT NULL REFERENCES users(id),
    ingredient_name VARCHAR NOT NULL,
    measurement_id INT NOT NULL REFERENCES measurement_units(id),
    measurement_qty_id INT NOT NULL REFERENCES measurement_qty(id),
    notes TEXT
);


INSERT INTO ingredients (id, ingredient_name) VALUES
  (1, 'Tomato'),
  (2, 'Flour'),
  (3, 'Corn'),
  (4, 'Onion'),
  (5, 'Salt');


INSERT INTO measurement_qty (id, qty_amount) VALUES
  (1, 0.25),
  (2, 0.5),
  (3, 0.75),
  (4, 1),
  (5, 1.25)
  ;

INSERT INTO measurement_units (id, measurement_description) VALUES
  (1, 'Teaspoon'),
  (2, 'Tablespoon'),
  (3, 'Cup'),
  (4, 'Ounce'),
  (5, 'Pound'),
  (6, 'Gram');




SELECT setval('users_id_seq', (SELECT MAX(id) + 1 FROM users));
SELECT setval('recipes_id_seq', (SELECT MAX(id) + 1 FROM recipes));
SELECT setval('measurement_units_id_seq', (SELECT MAX(id) + 1 FROM measurement_units));
SELECT setval('measurement_qty_id_seq', (SELECT MAX(id) + 1 FROM measurement_qty));
SELECT setval('ingredients_id_seq', (SELECT MAX(id) + 1 FROM ingredients));
SELECT setval('my_ingredients_id_seq', (SELECT MAX(id) + 1 FROM my_ingredients));
SELECT setval('grocery_list_id_seq', (SELECT MAX(id) + 1 FROM grocery_list));
SELECT setval('recipe_ingredients_id_seq', (SELECT MAX(id) + 1 FROM recipe_ingredients));
