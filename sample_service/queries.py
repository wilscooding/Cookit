from typing import List, Optional
from psycopg_pool import ConnectionPool
import os
from db import RecipeOut, RecipeIn,IngredientOut, IngredientIn


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

    def update_recipe(self, recipe_id: int, data:RecipeIn) -> RecipeOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                params = [data.recipe_name, data.diet, data.img, recipe_id]
                cur.execute(
                    """
                    UPDATE recipes
                    SET recipe_name = %s, diet = %s, img = %s
                    WHERE id = %s
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

    def get_recipe_by_id(self, recipe_id: int) -> Optional[RecipeOut]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, recipe_name, diet, img
                    FROM recipes
                    WHERE id = %s
                    """,
                    [recipe_id],
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


class IngredientQueries:
    def create_ingredients(self, ingredient:IngredientIn) -> IngredientOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                params = [ingredient.ingredient_name]
                cur.execute(
                    """
                    INSERT INTO ingredients (ingredient_name)
                    VALUES (%s)
                    RETURNING id, ingredient_name
                    """,
                    params,
                    )

                record = cur.fetchone()
                if record:
                    ingredient_dict = {
                        "id": record[0],
                        "ingredient_name": record[1],
                        }
                    return IngredientOut(**ingredient_dict)

    def get_ingredients(self) -> List[IngredientOut]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, ingredient_name
                    FROM ingredients
                    """,

                    )
                records = cur.fetchall()
                if records:
                    ingredients = []
                    for record in records:
                        ingredient_dict = {
                            "id": record[0],
                            "ingredient_name": record[1],
                            }
                        ingredients.append(IngredientOut(**ingredient_dict))
                    return ingredients


    def get_ingredient_by_id(self, id:int) -> IngredientOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, ingredient_name
                    FROM ingredients
                    WHERE id = %s
                    """,
                    (id,),
                    )
                record = cur.fetchone()
                if record:
                    return IngredientOut(**record)

    def update_ingredient(self, id:int, ingredient: IngredientIn) -> IngredientOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                params = [ingredient.ingredient_name, id]
                cur.execute(
                    """
                    UPDATE ingredients
                    SET ingredient_name = %s
                    WHERE id = %s
                    RETURNING id, ingredient_name
                    """,
                    params,
                    )
                record = cur.fetchone()
                if record:
                    ingredient_dict = {
                        "id": record[0],
                        "ingredient_name": record[1],
                    }
                    return IngredientOut(**ingredient_dict)

    def delete_ingredient(self, id: int) -> bool:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM ingredients
                    WHERE id = %s
                    """,
                    (id,),
                    )
                if cur.rowcount > 0:
                    return True
                return False


class MeasurementUnitQueries:
    def get_measurement_units(self):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, measurement_description
                    FROM measurement_units
                    """
                    )

                records = cur.fetchall()
                measurement_units = []
                for record in records:
                    measurement_unit_dict = {
                        "id": record[0],
                        "measurement_description": record[1],
                        }

                    measurement_units.append(measurement_unit_dict)
                    return measurement_units

    def get_measurement_unit_by_id(self, id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, measurement_description
                    FROM measurement_units
                    WHERE id = %s
                    """,
                    (id,),
                    )

                records = cur.fetchone()
                if records:
                    measurement_unit_dict = {
                        "id": records[0],
                        "measurement_description": records[1],
                        }

                    return measurement_unit_dict
