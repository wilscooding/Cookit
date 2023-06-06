import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import axios from "axios";

const MyRecipeDetails = ({ currentUser }) => {
  const [recipe, setRecipe] = useState("");
  const { id } = useParams();

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/myrecipes/${id}`
      );
      const data = response.data;
      setRecipe(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  if (currentUser && recipe.creator_id !== currentUser.id) {
    return <div>This recipe does not belong to you!</div>;
  }

  return (
    <div>
      <h2>{recipe.recipe_name}</h2>
      <img src={recipe.img} alt={recipe.title} width="300px" />
      <h3>Description</h3>
      <div>{recipe.description}</div>
      <h3>Steps</h3>
      <div>{recipe.steps}</div>
      <h3>Diet</h3>
      <div>{recipe.diet}</div>
      <Link to={`/myrecipes/${id}/edit`}>
        <Button color="light">Edit Recipe</Button>
      </Link>
    </div>
  );
};

export default MyRecipeDetails;
