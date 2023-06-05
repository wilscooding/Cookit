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
    diet VARCHAR NOT NULL,
    img TEXT
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

INSERT INTO users (id, first, last, avatar, email, username, hashed_password) VALUES
  (1, 'John', 'Smith', '1780000.jpeg', 'John@gmail.com', 'Jsmith', null),
  (2, 'Dave', 'Jones', '178030988.jpeg', 'Dave@gmail.com', 'Djones', null),
  (3, 'Patrick', 'Lacquer', '17800.jpeg', 'Patrick@gmail.com', 'Placquer', null),
  (4, 'Abbie', 'Schmabbie', '10000.jpeg', 'Abbie@gmail.com', 'Aschabbie', null),
  (5, 'David', 'Agarwal', '170000.jpeg', 'David@gmail.com', 'Dagarwal', null),
  (6, 'Susie', 'Chen', '60000.jpeg', 'Susie@gmail.com', 'Schen', null),
  (7, 'Matt', 'Gvido', '14780000.jpeg', 'Matt@gmail.com', 'Mvido', null),
  (8, 'Zuirch', 'Hernández', '1780320948.jpeg', 'Zurich@gmail.com', 'Zhernandez', null),
  (9, 'Will', 'Smith', '17800000089.jpeg', 'Will@gmail.com', 'Wsmith', null),
  (10, 'Yuri', 'Mikhailov', '17800000293908.jpeg', 'Yuri@gmail.com', 'Ymikhailov', null)
  ;

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

INSERT INTO recipes (id, creator_id, recipe_name, diet, img) VALUES
  (1, 1, 'Pancakes', 'Keto', null),
  (2, 2, 'Spaghetti Bolognese', 'Classic', null),
  (3, 3, 'Chicken Curry', 'Indian', null),
  (4, 4, 'Caesar Salad', 'Vegetarian', null),
  (5, 5, 'Chocolate Chip Cookies', 'Dessert', null);

INSERT INTO recipe_ingredients (id, recipe_id, measurement_id, measurement_qty_id, ingredient_id) VALUES
  (1, 1, 1, 1, 1),
  (2, 1, 2, 2, 2),
  (3, 2, 3, 3, 4),
  (4, 3, 4, 4, 5),
  (5, 4, 5, 1, 1),
  (6, 5, 1, 2, 2);


INSERT INTO my_ingredients (id, user_id, ingredient_name, measurement_id, measurement_qty_id, notes) VALUES
  (1, 1, 'Lemon', 1, 1, null),
  (2, 1, 'Chicken', 3, 4, 'Free-range'),
  (3, 2, 'Sugar', 4, 2, null),
  (4, 2, 'Garlic', 2, 3, 'Fresh'),
  (5, 3, 'Broccoli', 3, 1, 'Organic'),
  (6, 4, 'Avocado', 5, 4, null);

INSERT INTO grocery_list (id, user_id, ingredient_name, measurement_id, measurement_qty_id, notes) VALUES
  (1, 1, 'Lettuce', 1, 1, 'Notes for my lettuce'),
  (2, 2, 'Milk', 3, 4, null),
  (3, 3, 'Eggs', 2, 3, 'Large'),
  (4, 4, 'Bread', 1, 2, 'Whole wheat'),
  (5, 5, 'Apples', 4, 5, null),
  (6, 6, 'Yogurt', 3, 2, 'Greek');



SELECT setval('users_id_seq', (SELECT MAX(id) + 1 FROM users));
SELECT setval('recipes_id_seq', (SELECT MAX(id) + 1 FROM recipes));
SELECT setval('measurement_units_id_seq', (SELECT MAX(id) + 1 FROM measurement_units));
SELECT setval('measurement_qty_id_seq', (SELECT MAX(id) + 1 FROM measurement_qty));
SELECT setval('ingredients_id_seq', (SELECT MAX(id) + 1 FROM ingredients));
SELECT setval('my_ingredients_id_seq', (SELECT MAX(id) + 1 FROM my_ingredients));
SELECT setval('grocery_list_id_seq', (SELECT MAX(id) + 1 FROM grocery_list));
