import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "flowbite-react";

const MyRecipes = ({ currentUser }) => {
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    if (currentUser && currentUser.id) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/myrecipes`,
          {
            params: {
              user_id: currentUser.id,
            },
          }
        );
        const data = response.data;
        setRecipes(data.recipes);
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    fetchRecipes();
  }, [currentUser]);

  return (
    <div>
      <h1>My Recipes</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <div>
              <Link to={recipe.id.toString()}>
                <p className="text-blue-600">{recipe.recipe_name}</p>
              </Link>
              <p>Diet: {recipe.diet}</p>
            </div>
            <img src={recipe.img} alt={recipe.recipe_name} width="100px" />
          </li>
        ))}
      </ul>
      <Link to={"new"}>
        <Button className="mb-10 mt-5" color="light">
          Create New Recipe
        </Button>
      </Link>
    </div>
  );
};

export default MyRecipes;
