import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const RecipeSearch = ({ onRecipeSelect }) => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);

  const searchRecipes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/recipes`,
        {
          params: {
            query: query,
          },
        }
      );
      const data = response.data;
      console.log("Search Recipes Response:", data);
      setRecipes(data.recipes);
    } catch (error) {
      console.error(error);
    }
  };

  // const handleRecipeClick = (id) => {
  //   onRecipeSelect(id);
  // };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchRecipes}>Search</button>
      <ul>
        {recipes.map((recipe) => {
          console.log("all stuff:", recipe); // Log the recipe object to the console
          return (
            <li key={recipe.id}>
              <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
              <img src={recipe.image} alt={recipe.title} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecipeSearch;
