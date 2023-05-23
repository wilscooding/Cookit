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
    qty_amount INT NOT NULL
);

CREATE TABLE measurement_units (
    id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    measurement_description VARCHAR NOT NULL
);

CREATE TABLE recipes (
    id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    creator_id INT NOT NULL REFERENCES users(id),
    recipe_name VARCHAR NOT NULL,
    diet VARCHAR NOT NULL,
    img TEXT
);

CREATE TABLE recipe_ingredients (
    recipe_id INT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    measurement_id INT NOT NULL REFERENCES measurement_units(id),
    measurement_qty_id INT NOT NULL REFERENCES measurement_qty(id),
    ingredient_id INT NOT NULL REFERENCES ingredients(id)
);

CREATE TABLE my_ingredients (
    id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    ingredient_name VARCHAR NOT NULL,
    measurement_id INT NOT NULL REFERENCES measurement_units(id),
    measurement_qty_id INT NOT NULL REFERENCES measurement_qty(id),
    notes TEXT
);

CREATE TABLE grocery_list (
    id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    ingredient_name VARCHAR NOT NULL,
    measurement_id INT NOT NULL REFERENCES measurement_units(id),
    measurement_qty_id INT NOT NULL REFERENCES measurement_qty(id),
    notes TEXT
);

INSERT INTO users VALUES
  (1, 'John', 'Smith', '1780000.jpeg', 'John@gmail.com', 'Jsmith', 'password', null),
  (2, 'Dave', 'Jones', '178030988.jpeg', 'Dave@gmail.com', 'Djones', 'password', null),
  (3, 'Patrick', 'Lacquer', '17800.jpeg', 'Patrick@gmail.com', 'Placquer', 'password', null),
  (4, 'Abbie', 'Schmabbie', '10000.jpeg', 'Abbie@gmail.com', 'Aschabbie', 'password', null),
  (5, 'David', 'Agarwal', '170000.jpeg', 'David@gmail.com', 'Dagarwal', 'password', null),
  (6, 'Susie', 'Chen', '60000.jpeg', 'Susie@gmail.com', 'Schen', 'password', null),
  (7, 'Matt', 'Gvido', '14780000.jpeg', 'Matt@gmail.com', 'Mvido', 'password', null),
  (8, 'Zuirch', 'Hernández', '1780320948.jpeg', 'Zurich@gmail.com', 'Zhernandez', 'password', null),
  (9, 'Will', 'Smith', '17800000089.jpeg', 'Will@gmail.com', 'Wsmith', 'password', null),
  (10, 'Yuri', 'Mikhailov', '17800000293908.jpeg', 'Yuri@gmail.com', 'Ymikhailov', 'password', null)
  ;

INSERT INTO ingredients VALUES
  (1, 'Tomato'),
  (2, 'Flour'),
  (3, 'Corn')
  ;

INSERT INTO measurement_qty VALUES
  (1, 0.25),
  (2, 0.5),
  (3, 0.75),
  (4, 1)
  ;

INSERT INTO measurement_units VALUES
  (1, 'Teaspoon'),
  (2, 'Tablespoon'),
  (3, 'Cup'),
  (4, 'Ounce'),
  (5, 'Pound')
  ;

INSERT INTO recipes VALUES
  (1, 1, 'Pancakes', 'Keto', null)
  ;

INSERT INTO recipe_ingredients VALUES
  (1, 1, 1, 1)
  ;

INSERT INTO my_ingredients VALUES
  (1, 'Lemon', 1, 1, null)
  ;

INSERT INTO grocery_list VALUES
  (1, 'Lettuce', 1, 1, 'Notes for my lettuce')
  ;

SELECT setval('users_id_seq', (SELECT MAX(id) + 1 FROM users));
SELECT setval('recipes_id_seq', (SELECT MAX(id) + 1 FROM recipes));
SELECT setval('measurement_units_id_seq', (SELECT MAX(id) + 1 FROM measurement_units));
SELECT setval('measurement_qty_id_seq', (SELECT MAX(id) + 1 FROM measurement_qty));
SELECT setval('ingredients_id_seq', (SELECT MAX(id) + 1 FROM ingredients));
SELECT setval('my_ingredients_id_seq', (SELECT MAX(id) + 1 FROM my_ingredients));
SELECT setval('grocery_list_id_seq', (SELECT MAX(id) + 1 FROM grocery_list));
