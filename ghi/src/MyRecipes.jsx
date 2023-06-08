import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { Button, Card } from "flowbite-react";

const MyRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const { fetchWithCookie } = useToken();
    const { token } = useToken();
    const [ currentUser, setUser] = useState();

    const handleFetchWithCookie = async() => {
        const data = await fetchWithCookie(
            `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/token`
        );
        if (data !== undefined){
            const currentUser = data.user
            setUser(currentUser);
        }
    }

    useEffect(() => {
        handleFetchWithCookie();
    }, [token]);

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
        };
    }
  };

  const handleDeleteRecipe = async (recipe_id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/myrecipes/${recipe_id}`
      );
      fetchRecipes();
    } catch (error) {
      console.error(error);
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
              <button onClick={() => handleDeleteRecipe(recipe.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRecipes;
