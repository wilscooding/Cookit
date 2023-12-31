from typing import List, Optional
from psycopg_pool import ConnectionPool
import os
from db import (
    RecipeOut,
    RecipeIn,
    IngredientOut,
    IngredientIn,
    MeasurementQtyIn,
    MeasurementQtyOut,
    MeasurementUnitIn,
    MeasurementUnitOut,
    RecipeIngredientOut,
    MyIngredientIn,
    MyIngredientOut,
    GroceryListItemIn,
    GroceryListItemOut,
)

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
                params = [data.email, hashed_password]
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
                params = [
                    data.creator_id,
                    data.recipe_name,
                    data.diet,
                    data.img,
                    data.description,
                    data.steps,
                ]
                cur.execute(
                    """
                    INSERT INTO recipes (creator_id, recipe_name, diet, img,
                    description, steps)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id, recipe_name, diet, img, description, steps,
                    creator_id
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
                        "description": record[4],
                        "steps": record[5],
                        "creator_id": record[6],
                    }

                    return RecipeOut(**recipe_dict)

    def delete_recipe(self, recipe_id: int):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM recipes
                    WHERE id = %s
                    """,
                    [recipe_id],
                )

    def update_recipe(self, recipe_id: int, data: RecipeIn) -> RecipeOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                params = [
                    data.recipe_name,
                    data.diet,
                    data.img,
                    data.description,
                    data.steps,
                    recipe_id,
                ]
                cur.execute(
                    """
                    UPDATE recipes
                    SET recipe_name = %s, diet = %s, img = %s,
                    description = %s,
                    steps = %s
                    WHERE id = %s
                    RETURNING id, recipe_name, diet, img, description, steps,
                    creator_id
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
                        "description": record[4],
                        "steps": record[5],
                        "creator_id": record[6],
                    }

                    return RecipeOut(**recipe_dict)

    def get_recipe_by_id(self, recipe_id: int) -> Optional[RecipeOut]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, recipe_name, diet, img, description, steps,
                    creator_id
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
                        "description": record[4],
                        "steps": record[5],
                        "creator_id": record[6],
                    }

                    return RecipeOut(**recipe_dict)

    def save_recipe_from_api(
        self, recipe_data: dict, user_id: int
    ) -> RecipeOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                params = [
                    user_id,
                    recipe_data["recipe_name"],
                    recipe_data["diet"],
                    recipe_data["img"],
                ]
                cur.execute(
                    """
                    INSERT INTO recipes (creator_id, recipe_name, diet, img)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id, creator_id, recipe_name, diet, img
                    """,
                    params,
                )
                record = cur.fetchone()
                if record:
                    recipe_dict = {
                        "id": record[0],
                        "creator_id": record[1],
                        "recipe_name": record[2],
                        "diet": record[3],
                        "img": record[4],
                    }
                    return RecipeOut(**recipe_dict)


class IngredientQueries:
    def create_ingredients(self, ingredient: IngredientIn) -> IngredientOut:
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

    def get_ingredients(
        self, ingredient_name: Optional[str] = None
    ) -> List[IngredientOut]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                query = """
                SELECT id, ingredient_name
                FROM ingredients
                """
                parameters = []

                if ingredient_name:
                    query += "WHERE ingredient_name = %s"
                    parameters.append(ingredient_name)

                cur.execute(query, parameters)

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
        return []

    def get_ingredient_by_id(self, id: int) -> IngredientOut:
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
                    ingredient_dict = {
                        "id": record[0],
                        "ingredient_name": record[1],
                    }
                    return IngredientOut(**ingredient_dict)

    def update_ingredient(
        self, id: int, ingredient: IngredientIn
    ) -> IngredientOut:
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


class MeasurementQtyQueries:
    def create_measurement_qty(
        self, measurement_qty: MeasurementQtyIn
    ) -> MeasurementQtyOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO measurement_qty(qty_amount)
                    VALUES (%s)
                    RETURNING id, qty_amount
                    """,
                    (measurement_qty.qty_amount,),
                )

                record = cur.fetchone()
                if record:
                    measurement_qty_dict = {
                        "id": record[0],
                        "qty_amount": record[1],
                    }
                    return MeasurementQtyOut(**measurement_qty_dict)

    def get_measurement_qty(self) -> List[MeasurementQtyOut]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, qty_amount
                    FROM measurement_qty
                    """,
                )

                records = cur.fetchall()
                measurement_qty_list = []
                for record in records:
                    measurement_qty_dict = {
                        "id": record[0],
                        "qty_amount": record[1],
                    }
                    measurement_qty_list.append(
                        MeasurementQtyOut(**measurement_qty_dict)
                    )
                return measurement_qty_list

    def get_measurement_qty_by_id(self, id: int) -> MeasurementQtyOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, qty_amount
                    FROM measurement_qty
                    WHERE id = %s
                    """,
                    (id,),
                )
                record = cur.fetchone()
                if record:
                    measurement_qty_dict = {
                        "id": record[0],
                        "qty_amount": record[1],
                    }
                    return MeasurementQtyOut(**measurement_qty_dict)

    def update_measurement_qty(
        self, id: int, measurement_qty: MeasurementQtyIn
    ) -> MeasurementQtyOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    UPDATE measurement_qty
                    SET qty_amount = %s
                    WHERE id = %s
                    RETURNING id, qty_amount
                    """,
                    (
                        measurement_qty.qty_amount,
                        id,
                    ),
                )
                record = cur.fetchone()
                if record:
                    measurement_qty_dict = {
                        "id": record[0],
                        "qty_amount": record[1],
                    }
                return MeasurementQtyOut(**measurement_qty_dict)

    def delete_measurement_qty(self, id: int) -> bool:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM measurement_qty
                    WHERE id = %s
                    """,
                    (id,),
                )

                if cur.rowcount > 0:
                    return True
                return False


class MeasurementUnitQueries:
    def create_measurement_unit(
        self, measurement_unit: MeasurementUnitIn
    ) -> MeasurementUnitOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO measurement_units (measurement_description)
                    VALUES (%s)
                    RETURNING id, measurement_description
                    """,
                    (measurement_unit.measurement_description,),
                )
                record = cur.fetchone()
                if record:
                    measurement_unit_dict = {
                        "id": record[0],
                        "measurement_description": record[1],
                    }
                    return MeasurementUnitOut(**measurement_unit_dict)

    def get_measurement_units(self) -> List[MeasurementUnitOut]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, measurement_description
                    FROM measurement_units
                    """,
                )
                records = cur.fetchall()
                measurement_units_list = []
                for record in records:
                    measurement_unit_dict = {
                        "id": record[0],
                        "measurement_description": record[1],
                    }
                    measurement_units_list.append(
                        MeasurementUnitOut(**measurement_unit_dict)
                    )
                return measurement_units_list

    def get_measurement_unit_by_id(self, id: int) -> MeasurementUnitOut:
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
                record = cur.fetchone()
                if record:
                    measurement_unit_dict = {
                        "id": record[0],
                        "measurement_description": record[1],
                    }

                    return MeasurementUnitOut(**measurement_unit_dict)

    def update_measurement_unit(
        self, id: int, measurement_unit: MeasurementUnitIn
    ) -> MeasurementUnitOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    UPDATE measurement_units
                    SET measurement_description = %s
                    WHERE id = %s
                    RETURNING id, measurement_description
                    """,
                    (measurement_unit.measurement_description, id),
                )
                record = cur.fetchone()
                if record:
                    measurement_unit_dict = {
                        "id": record[0],
                        "measurement_description": record[1],
                    }
                    return MeasurementUnitOut(**measurement_unit_dict)

    def delete_measurement_unit(self, id: int) -> bool:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM measurement_units
                    WHERE id = %s
                    """,
                    (id,),
                )
                if cur.rowcount > 0:
                    return True
                return False


class RecipeIngredientQueries:
    def create_recipe_ingredient(
        self,
        recipe_id: int,
        measurement_id: int,
        measurement_qty_id: int,
        ingredient_id: int,
    ) -> RecipeIngredientOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO recipe_ingredients (recipe_id, measurement_id,
                    measurement_qty_id, ingredient_id)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id, recipe_id, measurement_id,
                    measurement_qty_id, ingredient_id
                    """,
                    (
                        recipe_id,
                        measurement_id,
                        measurement_qty_id,
                        ingredient_id,
                    ),
                )
                record = cur.fetchone()
                if record:
                    return RecipeIngredientOut(
                        id=record[0],
                        recipe_id=record[1],
                        measurement_id=record[2],
                        measurement_qty_id=record[3],
                        ingredient_id=record[4],
                    )

    def get_recipe_ingredient_by_id(
        self, id: int
    ) -> Optional[RecipeIngredientOut]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, recipe_id, measurement_id, measurement_qty_id,
                    ingredient_id
                    FROM recipe_ingredients
                    WHERE id = %s
                    """,
                    (id,),
                )
                record = cur.fetchone()
                if record:
                    return RecipeIngredientOut(
                        id=record[0],
                        recipe_id=record[1],
                        measurement_id=record[2],
                        measurement_qty_id=record[3],
                        ingredient_id=record[4],
                    )
                return None

    def get_recipe_ingredients_by_recipe_id(
        self, recipe_id: int
    ) -> List[RecipeIngredientOut]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, recipe_id, measurement_id, measurement_qty_id,
                    ingredient_id
                    FROM recipe_ingredients
                    WHERE recipe_id = %s
                    """,
                    (recipe_id,),
                )
                records = cur.fetchall()
                recipe_ingredients = []
                for record in records:
                    recipe_ingredient = RecipeIngredientOut(
                        id=record[0],
                        recipe_id=record[1],
                        measurement_id=record[2],
                        measurement_qty_id=record[3],
                        ingredient_id=record[4],
                    )
                    recipe_ingredients.append(recipe_ingredient)
                return recipe_ingredients

    def delete_recipe_ingredient(self, id: int) -> None:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM recipe_ingredients
                    WHERE id = %s
                    """,
                    (id,),
                )


class MyIngredientQueries:
    def get_all_my_ingredients(
        self, user_id: int, ingredient_name: Optional[str] = None
    ):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                query = """
                SELECT *
                FROM my_ingredients
                WHERE user_id = %s
                """

                parameters = [user_id]

                if ingredient_name:
                    query += " AND ingredient_name = %s"
                    parameters.append(ingredient_name)
                cur.execute(query, parameters)

                results = []
                for row in cur.fetchall():
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]
                    results.append(record)

                return results

    def create_my_ingredient(self, data: MyIngredientIn) -> MyIngredientOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                params = [
                    data.user_id,
                    data.ingredient_name,
                    data.measurement_id,
                    data.measurement_qty_id,
                    data.notes,
                ]
                cur.execute(
                    """
                    INSERT INTO my_ingredients (user_id, ingredient_name,
                    measurement_id, measurement_qty_id, notes)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id, user_id, ingredient_name, measurement_id,
                    measurement_qty_id, notes
                    """,
                    params,
                )

                record = cur.fetchone()
                if record:
                    ingredient_dict = {
                        "id": record[0],
                        "user_id": record[1],
                        "ingredient_name": record[2],
                        "measurement_id": record[3],
                        "measurement_qty_id": record[4],
                        "notes": record[5],
                    }

                    return MyIngredientOut(**ingredient_dict)

    def delete_my_ingredient(self, ingredient_id: int):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM my_ingredients
                    WHERE id = %s
                    """,
                    [ingredient_id],
                )

    def update_my_ingredient(
        self, ingredient_id: int, data: MyIngredientIn
    ) -> MyIngredientOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                params = [
                    data.user_id,
                    data.ingredient_name,
                    data.measurement_id,
                    data.measurement_qty_id,
                    data.notes,
                    ingredient_id,
                ]
                cur.execute(
                    """
                    UPDATE my_ingredients
                    SET user_id = %s, ingredient_name = %s,
                    measurement_id = %s, measurement_qty_id = %s, notes = %s
                    WHERE id = %s
                    RETURNING id, user_id, ingredient_name, measurement_id,
                    measurement_qty_id, notes
                    """,
                    params,
                )
                record = cur.fetchone()
                if record:
                    ingredient_dict = {
                        "id": record[0],
                        "user_id": record[1],
                        "ingredient_name": record[2],
                        "measurement_id": record[3],
                        "measurement_qty_id": record[4],
                        "notes": record[5],
                    }

                    return MyIngredientOut(**ingredient_dict)
                else:
                    return None

    def get_my_ingredient_by_id(
        self, ingredient_id: int
    ) -> Optional[MyIngredientOut]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, user_id, ingredient_name, measurement_id,
                    measurement_qty_id, notes
                    FROM my_ingredients
                    WHERE id = %s
                    """,
                    [ingredient_id],
                )

                record = cur.fetchone()
                if record:
                    ingredient_dict = {
                        "id": record[0],
                        "user_id": record[1],
                        "ingredient_name": record[2],
                        "measurement_id": record[3],
                        "measurement_qty_id": record[4],
                        "notes": record[5],
                    }

                    return MyIngredientOut(**ingredient_dict)


class GroceryListQueries:
    def get_grocery_list(self, user_id: int):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT *
                    FROM grocery_list
                    WHERE user_id = %s
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

    def add_to_grocery_list(
        self, data: GroceryListItemIn
    ) -> GroceryListItemOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                params = [
                    data.user_id,
                    data.ingredient_name,
                    data.measurement_id,
                    data.measurement_qty_id,
                    data.notes,
                ]
                cur.execute(
                    """
                    INSERT INTO grocery_list (user_id, ingredient_name,
                    measurement_id, measurement_qty_id, notes)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id, user_id, ingredient_name, measurement_id,
                    measurement_qty_id, notes
                    """,
                    params,
                )

                record = cur.fetchone()
                if record:
                    item_dict = {
                        "id": record[0],
                        "user_id": record[1],
                        "ingredient_name": record[2],
                        "measurement_id": record[3],
                        "measurement_qty_id": record[4],
                        "notes": record[5],
                    }

                    return GroceryListItemOut(**item_dict)

    def remove_from_grocery_list(self, item_id: int):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM grocery_list
                    WHERE id = %s
                    """,
                    [item_id],
                )

    def update_grocery_list_item(
        self, item_id: int, data: GroceryListItemIn
    ) -> GroceryListItemOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                params = [
                    data.user_id,
                    data.ingredient_name,
                    data.measurement_id,
                    data.measurement_qty_id,
                    data.notes,
                    item_id,
                ]
                cur.execute(
                    """
                    UPDATE grocery_list
                    SET user_id = %s, ingredient_name = %s,
                    measurement_id = %s, measurement_qty_id = %s, notes = %s
                    WHERE id = %s
                    RETURNING id, user_id, ingredient_name, measurement_id,
                        measurement_qty_id, notes
                    """,
                    params,
                )
                record = cur.fetchone()
                if record:
                    item_dict = {
                        "id": record[0],
                        "user_id": record[1],
                        "ingredient_name": record[2],
                        "measurement_id": record[3],
                        "measurement_qty_id": record[4],
                        "notes": record[5],
                    }

                    return GroceryListItemOut(**item_dict)
                else:
                    return None

    def get_grocery_list_item_by_id(
        self, item_id: int
    ) -> Optional[GroceryListItemOut]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, user_id, ingredient_name, measurement_id,
                    measurement_qty_id, notes
                    FROM grocery_list
                    WHERE id = %s
                    """,
                    [item_id],
                )

                record = cur.fetchone()
                if record:
                    item_dict = {
                        "id": record[0],
                        "user_id": record[1],
                        "ingredient_name": record[2],
                        "measurement_id": record[3],
                        "measurement_qty_id": record[4],
                        "notes": record[5],
                    }

                    return GroceryListItemOut(**item_dict)
