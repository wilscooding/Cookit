import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, Card } from "flowbite-react";
import axios from "axios";

const MyRecipeDetails = ({ currentUser }) => {
  const [recipe, setRecipe] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const { id } = useParams();

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_COOKIT_API_HOST}/api/myrecipes/${id}`
      );
      const data = response.data;
      setRecipe(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecipeIngredients = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_COOKIT_API_HOST}/api/recipe_ingredients/recipe/${id}`
      );
      const data = response.data;
      setRecipeIngredients(data);

      // Fetch additional details for each ingredient
      const ingredientPromises = data.map(async (ingredient) => {
        const ingredientResponse = await axios.get(
          `${process.env.REACT_APP_COOKIT_API_HOST}/api/ingredients/${ingredient.ingredient_id}`
        );
        const ingredientData = ingredientResponse.data;
        ingredient.ingredient_name = ingredientData.ingredient_name;

        const qtyAmountResponse = await axios.get(
          `${process.env.REACT_APP_COOKIT_API_HOST}/api/measurement_qty/${ingredient.measurement_qty_id}`
        );
        const qtyAmountData = qtyAmountResponse.data;
        ingredient.qty_amount = qtyAmountData.qty_amount;

        const measurementResponse = await axios.get(
          `${process.env.REACT_APP_COOKIT_API_HOST}/api/measurement_units/${ingredient.measurement_id}`
        );
        const measurementData = measurementResponse.data;
        ingredient.measurement_description =
          measurementData.measurement_description;

        return ingredient;
      });

      const updatedIngredients = await Promise.all(ingredientPromises);
      setRecipeIngredients(updatedIngredients);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRecipe();
    fetchRecipeIngredients();
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  if (currentUser && recipe.creator_id !== currentUser.id) {
    return <div>This recipe does not belong to you!</div>;
  }

  return (
    <div className="flex w-full">
      <div className="w-full flex items-center justify-center">
        <div className="w-full flex-col">
          <div className="w-full flex items-center justify-end">
            <Link to={`/myrecipes/${recipe.id}/edit`} className="mr-10">
              <Button className="mt-5" color="light">
                Edit Recipe
              </Button>
            </Link>
          </div>
          <div className="w-full flex items-center justify-center">
            <div className="flex-col text-center">
              <Card>
                <h1 className="border-b border-slate-300 pb-2">
                  <strong>{recipe.recipe_name}</strong>
                </h1>
                <img src={recipe.img} alt={recipe.title} width="300px" />
                <div className="border-b border-slate-300 pb-3">
                  <div
                    dangerouslySetInnerHTML={{ __html: recipe.description }}
                  />
                </div>
                <div className="border-b border-slate-300 pb-3">
                  {recipeIngredients.map((ingredient) => (
                    <div key={ingredient.id}>
                      {ingredient.ingredient_name}: {ingredient.qty_amount}{" "}
                      {ingredient.measurement_description}
                    </div>
                  ))}
                </div>
                <div className="border-b border-slate-300 pb-3">
                  {recipe.steps}
                </div>
                <div>{recipe.diet}</div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRecipeDetails;
