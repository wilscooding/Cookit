from psycopg_pool import ConnectionPool
import os
from db import RecipeOut


pool = ConnectionPool(conninfo=os.environ["DATABASE_URL"])


class UserQueries:
    def get_all_users(self):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, first, last, avatar, email, username
                    FROM users
                    ORDER BY email
                """
                )

                results = []
                for row in cur.fetchall():
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]
                    results.append(record)

                return results

    def get_user(self, user_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, first, last, avatar,
                        email, username
                    FROM users
                    WHERE id = %s
                """,
                    [user_id],
                )

                record = None
                row = cur.fetchone()
                if row is not None:
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]

                return record

    def get_user_by_email(self, email):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, first, last, avatar,
                        email, username, hashed_password
                    FROM users
                    WHERE email = %s
                """,
                    [email],
                )

                record = None
                row = cur.fetchone()
                if row is not None:
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]

                return record

    def create_user(self, data, hashed_password: str):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                params = [
                    data.email,
                    hashed_password
                ]
                cur.execute(
                    """
                    INSERT INTO users (email, hashed_password)
                    VALUES (%s, %s)
                    RETURNING id, email
                    """,
                    params,
                )

                record = None
                row = cur.fetchone()
                if row is not None:
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]

                return record

    def update_user(self, user_id, data):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                params = [
                    data.first,
                    data.last,
                    data.avatar,
                    data.email,
                    data.username,
                    user_id,
                ]
                cur.execute(
                    """
                    UPDATE users
                    SET first = %s
                      , last = %s
                      , avatar = %s
                      , email = %s
                      , username = %s
                    WHERE id = %s
                    RETURNING id, first, last, avatar, email, username
                    """,
                    params,
                )

                record = None
                row = cur.fetchone()
                if row is not None:
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]

                return record

    def delete_user(self, user_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM users
                    WHERE id = %s
                    """,
                    [user_id],
                )


class RecipeQueries:
    def get_all_recipes(self, user_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT *
                    FROM recipes
                    WHERE creator_id = %s
                    """,
                    [user_id],
                )

                results = []
                for row in cur.fetchall():
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]
                    results.append(record)

                return results

    def create_recipes(self, data) -> RecipeOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                params = [data.creator_id, data.recipe_name, data.diet, data.img]
                cur.execute(
                    """
                    INSERT INTO recipes (creator_id, recipe_name, diet, img)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id, recipe_name, diet, img
                    """,
                    params,
                )

                record = cur.fetchone()
                if record:
                    recipe_dict = {
                        "id": record[0],
                        "recipe_name": record[1],
                        "diet": record[2],
                        "img": record[3],
                    }

                    return RecipeOut(**recipe_dict)

    def delete_recipe(self, recipe_id:int):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM recipes
                    WHERE id = %s
                    """,
                    [recipe_id],
                    )
