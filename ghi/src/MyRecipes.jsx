import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, Card } from "flowbite-react";

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
    <div className="flex w-full">
      <div className="w-full flex items-center justify-center">
        <div className="w-full flex-col">
          <div className="w-full flex items-center justify-end">
            <Link to={"new"} className="mr-10">
              <Button className="mt-5" color="light">
                Create New Recipe
              </Button>
            </Link>
          </div>
          <div className="w-full flex items-center justify-center">
            <div className="flex-col text-center">
              {recipes.map((recipe) => (
                <Card key={recipe.id} className="mb-5 p-2">
                  <img
                    src={recipe.img}
                    alt={recipe.recipe_name}
                    width="250px"
                    className="m-auto"
                  />
                  <Link to={recipe.id.toString()}>
                    <p className="text-blue-600">{recipe.recipe_name}</p>
                  </Link>
                  <p>{recipe.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRecipes;
