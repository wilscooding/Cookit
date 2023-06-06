import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
    </div>
  );
};
}

export default MyRecipes;
