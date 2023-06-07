import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RecipeDetails = ({ currentUser }) => {
  const [recipe, setRecipe] = useState("");
  const [extendedIngredientsData, setExtendedIngredientsData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    console.log("RecipeDetails - id:", id);
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/recipes/${id}`
        );
        const data = response.data;
        console.log("Recipe Info Response:", data);
        setRecipe(data.recipe);
        setExtendedIngredientsData(data.recipe.extendedIngredientsData)
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecipe();
  }, [id]);

const handleSaveRecipe = async () => {
  try {
    if (!currentUser) {
      console.log("No current user found");
      return;
    }

    const { title, image, diets, summary, analyzedInstructions } = recipe;

    const steps = analyzedInstructions[0].steps.map(
      (step) => `${step.number} - ${step.step}`
    );
    console.log("steps:", steps);
    const savedRecipe = {
      creator_id: currentUser.id,
      recipe_name: title,
      diet: diets[0],
      img: image,
      description: summary,
      steps: steps.join("\n"),
    };

    const response = await axios.post(
      `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/myrecipes/`,
      savedRecipe
    );

    console.log("Save Recipe Response:", response.data);

    const recipeId = response.data.id;
    const extendedIngredientsData = recipe.extendedIngredients

    const ingredientPromises = extendedIngredientsData.map(async (ingredientData) => {
      const { id, name } = ingredientData;
      console.log("ingredientPromises:", ingredientPromises)

      // Check if the ingredient already exists in the ingredients table
      let ingredientId = null;
      const existingIngredient = await axios.get(
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/myingredients/?ingredient_name=${name}`
      );

      if (existingIngredient.data.length > 0) {
        ingredientId = existingIngredient.data[0].id;
      } else {
        // Create a new ingredient if it doesn't exist
        const newIngredientResponse = await axios.post(
          `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/myingredients/`,
          {
            ingredient_name: name,
          }
        );

        ingredientId = newIngredientResponse.data.id;
      }

      // Create the recipe_ingredient entry
      const recipeIngredientResponse = await axios.post(
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/recipe-ingredients/`,
        {
          recipe_id: recipeId,
          measurement_id: ingredientData.id,
          measurement_qty_id: ingredientData.amount,
          ingredient_id: ingredientId,
        }
      );

      console.log("Saved Recipe Ingredient:", recipeIngredientResponse.data);
    });

    await Promise.all(ingredientPromises);

    console.log("All recipe ingredients saved successfully!");
  } catch (error) {
    console.error(error);
  }
};

  if (!recipe) {
    return <div>Loading...</div>;
  }

  const ingredientNames = recipe.extendedIngredients.map((ingredient) => ({
    name: ingredient.name,
    original: ingredient.original,
  }));

  if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
    const instructions = recipe.analyzedInstructions[0].steps.map((step) => ({
      number: step.number,
      step: step.step,
    }));

    return (
      <div>
        <h2>{recipe.title}</h2>
        <img src={recipe.image} alt={recipe.title} />
        {/* Add a button to save the recipe */}
        <button onClick={handleSaveRecipe}>Save Recipe</button>
        <h3>{recipe.creditsText}</h3>
        <h3>Summary</h3>
        <div dangerouslySetInnerHTML={{ __html: recipe.summary }} />
        <h3>Ingredients</h3>
        <ul>
          {ingredientNames.map((ingredient, index) => (
            <li key={index}>
              <div className="row">
                <div className="col-sm-4">
                  <strong>{ingredient.name}</strong>
                </div>
                <div className="col-sm-8">{ingredient.original}</div>
              </div>
            </li>
          ))}
        </ul>
        <h3>Instructions</h3>
        <ul>
          {instructions.map((step, index) => (
            <li key={index}>
              {step.number} - {step.step}
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default RecipeDetails;
