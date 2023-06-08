import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RecipeDetails = ({ currentUser }) => {
  const [recipe, setRecipe] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/recipes/${id}`
        );
        const data = response.data;
        setRecipe(data.recipe);
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

      if (!recipe) {
        console.log("Recipe data not available");
        return;
      }

      const {
        title,
        image,
        diets,
        summary,
        analyzedInstructions,
        extendedIngredients,
      } = recipe;

      const steps = analyzedInstructions[0]?.steps || [];
      const ingredientPromises = [];

      for (const step of steps) {
        const { number, step: stepText } = step;
        console.log("Step:", number, stepText);
      }

      for (const ingredientData of extendedIngredients) {
        const { id, name, measures } = ingredientData;
        const amount = measures?.us?.amount;
        const unit = measures?.us?.unitShort;

        try {
          // Check if the ingredient already exists in the ingredients table
          let ingredientId = null;
          const existingIngredientResponse = await axios.get(
            `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/ingredients/`,
            {
              params: {
                ingredient_name: name,
              },
            }
          );

          if (existingIngredientResponse.data.length > 0) {
            const existingIngredient = existingIngredientResponse.data.find(
              (ingredient) => ingredient.ingredient_name === name
            );
            ingredientId = existingIngredient.id;
            console.log("Ingredient already exists:", name);
          } else {
            const newIngredientResponse = await axios.post(
              `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/ingredients/`,
              {
                ingredient_name: name,
              }
            );

            ingredientId = newIngredientResponse.data.id;
            console.log("New Ingredient created:", name);
          }

          let measurementQtyId, measurementUnitId;

          try {
            const existingMeasurementQtyResponse = await axios.get(
              `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/measurement_qty/`,
              {
                params: {
                  qty_amount: amount,
                },
              }
            );

            if (
              existingMeasurementQtyResponse.data &&
              existingMeasurementQtyResponse.data.length > 0
            ) {
              const existingMeasurementQty =
                existingMeasurementQtyResponse.data.find(
                  (measurementQty) => measurementQty.qty_amount === amount
                );
              measurementQtyId = existingMeasurementQty.id;
              console.log(
                "Measurement quantity already exists:",
                measurementQtyId
              );
            } else {
              const newMeasurementQtyResponse = await axios.post(
                `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/measurement_qty/`,
                {
                  qty_amount: amount,
                }
              );
              measurementQtyId = newMeasurementQtyResponse.data.id;
              console.log("New Measurement quantity created:", amount);
            }
          } catch (error) {
            console.error("Error checking/saving measurement quantity:", error);
          }

          try {
            const existingMeasurementUnitResponse = await axios.get(
              `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/measurement_units/`,
              {
                params: {
                  measurement_description: unit,
                },
              }
            );

            if (
              existingMeasurementUnitResponse.data &&
              existingMeasurementUnitResponse.data.length > 0
            ) {
              const existingMeasurementUnit =
                existingMeasurementUnitResponse.data.find(
                  (measurementUnit) =>
                    measurementUnit.measurement_description === unit
                );
              measurementUnitId = existingMeasurementUnit.id;
              console.log("Measurement unit already exists:", unit);
            } else {
              const newMeasurementUnitResponse = await axios.post(
                `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/measurement_units/`,
                {
                  measurement_description: unit,
                }
              );

              measurementUnitId = newMeasurementUnitResponse.data.id;
              console.log("New Measurement unit created:", unit);
            }
          } catch (error) {
            console.error("Error checking/saving measurement unit:", error);
          }

          const recipeIngredientResponse = axios.post(
            `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/recipe-ingredients/`,
            {
              recipe_id: recipeId,
              measurement_id: ingredientData.id,
              measurement_qty_id: measurementQtyId,
              ingredient_id: ingredientId,
            }
          );

          ingredientPromises.push(recipeIngredientResponse);
        } catch (error) {
          console.error("Error saving recipe ingredient:", error);
        }
      }

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
