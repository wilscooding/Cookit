DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL NOT NULL UNIQUE,
    first TEXT NOT NULL,
    last TEXT NOT NULL,
    avatar TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    referrer_id INTEGER REFERENCES users("id") ON DELETE CASCADE
);

INSERT INTO users VALUES
  (1, 'John', 'Smith', '1780000.jpeg', 'John@gmail.com', 'Jsmith', null),
  (2, 'Dave', 'Jones', '178030988.jpeg', 'Dave@gmail.com', 'Djones', null),
  (3, 'Patrick', 'Lacquer', '17800.jpeg', 'Patrick@gmail.com', 'Placquer', null),
  (4, 'Abbie', 'Schmabbie', '10000.jpeg', 'Abbie@gmail.com', 'Aschabbie', null),
  (5, 'David', 'Agarwal', '170000.jpeg', 'David@gmail.com', 'Dagarwal', null),
  (6, 'Susie', 'Chen', '60000.jpeg', 'Susie@gmail.com', 'Schen', null),
  (7, 'Matt', 'Gvido', '14780000.jpeg', 'Matt@gmail.com', 'Mvido', null),
  (8, 'Zuirch', 'Hernández', '1780320948.jpeg', 'Zurich@gmail.com', 'Zhernandez',5),
  (9, 'Will', 'Smith', '17800000089.jpeg', 'Will@gmail.com', 'Wsmith',4),
  (10, 'Yuri', 'Mikhailov', '17800000293908.jpeg', 'Yuri@gmail.com', 'Ymikhailov',3)
  ;

SELECT setval('users_id_seq', (SELECT MAX(id) + 1 FROM users));
