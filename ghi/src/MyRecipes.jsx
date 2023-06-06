import React, { useState, useEffect } from "react";
import axios from "axios";
import useToken from "@galvanize-inc/jwtdown-for-react";

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
            <img src={recipe.img} alt={recipe.recipe_name}/>
            <div>
              <p>{recipe.recipe_name}</p>
              <p>Diet: {recipe.diet}</p>
              </div>
              </li>
        ))}
      </ul>
    </div>
  );
};

export default MyRecipes;
