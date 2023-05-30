import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RecipeDetails = (props) => {
  const [recipe, setRecipe] = useState("");
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
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecipe();
  }, [id]);

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
