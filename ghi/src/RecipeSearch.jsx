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
    <div className="bg-yellow-200 p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-2 px-2 py-1 border border-gray-300"
      />
      <button
        onClick={searchRecipes}
        className="px-4 py-2 bg-orange-500 text-white"
      >
        Search
      </button>
      <ul className="mt-4">
        {recipes.map((recipe) => (
          <li key={recipe.id} className="mb-4">
            <Link
              to={`/recipes/${recipe.id}`}
              className="text-blue-600 hover:underline"
            >
              {recipe.title}
            </Link>
            <img src={recipe.image} alt={recipe.title} className="mt-2" />
          </li>
        ))}
      </ul>
    </div>
  );
};


export default RecipeSearch;
