import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Label } from "flowbite-react";
import axios from "axios";

function EditMyRecipeForm({ currentUser }) {
  const { id } = useParams();

  const [creatorId, setCreatorId] = useState(null);
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [diet, setDiet] = useState("");
  const [image, setImage] = useState("");

  const navigate = useNavigate();

  const dietOptions = [
    "glutenFree",
    "ketogenic",
    "lactoVegetarian",
    "lowFodmap",
    "ovoVegetarian",
    "pescetarian",
    "paleo",
    "primal",
    "vegan",
    "vegetarian",
    "whole30",
  ];

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await axios.put(
      `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/myrecipes/${id}`,
      {
        creator_id: creatorId,
        recipe_name: recipeName,
        diet: diet,
        img: image,
        description: description,
        steps: steps,
      }
    );

    if (response.statusText === "OK") {
      return navigate(`/myrecipes/${id}`);
    }
  }

  function handleRecipeNameChange(event) {
    const value = event.target.value;
    setRecipeName(value);
  }

  function handleDietChange(event) {
    const value = event.target.value;
    setDiet(value);
  }

  function handleImageChange(event) {
    const value = event.target.value;
    setImage(value);
  }

  function handleDescriptionChange(event) {
    const value = event.target.value;
    setDescription(value);
  }

  function handleStepsChange(event) {
    const value = event.target.value;
    setSteps(value);
  }

  async function fetchRecipe() {
    const response = await axios.get(
      `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/myrecipes/${id}`,
      { withCredentials: true }
    );

    if (response.statusText === "OK") {
      const data = response.data;
      setCreatorId(data.creator_id);
      setRecipeName(data.recipe_name);
      setDiet(data.diet);
      setImage(data.img);
      setDescription(data.description);
      setSteps(data.steps);
    }
  }

  useEffect(() => {
    fetchRecipe();
  }, []);

  if (!currentUser) {
    return <div>Must be signed in to edit recipes</div>;
  }

  if (creatorId !== currentUser.id) {
    return <div>You are not allowed to edit this recipe!</div>;
  }

  return (
    <>
      <div className="flex w-full">
        <div className="w-full flex items-center justify-center mt-20">
          <div className="flex-col">
            <div>
              <div className="mb-6 block">
                <h1 className="text-4xl">Edit A Recipe</h1>
              </div>
            </div>
            <form
              className="flex max-w-md flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="recipeName" value="Name Your Recipe" />
                </div>
                <div className="relative">
                  <input
                    id="recipe-name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-400 dark:focus:border-orange-400"
                    placeholder="Recipe Name"
                    value={recipeName}
                    onChange={handleRecipeNameChange}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="description" value="Description" />
                </div>
                <textarea
                  id="description"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-400 dark:focus:border-orange-400 dark:shadow-sm-light"
                  placeholder="Description"
                  value={description}
                  onChange={handleDescriptionChange}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="steps" value="Steps" />
                </div>
                <textarea
                  id="steps"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-400 dark:focus:border-orange-400 dark:shadow-sm-light"
                  placeholder="Steps"
                  value={steps}
                  onChange={handleStepsChange}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="diet" value="Pick Your Diet Restrictions" />
                </div>
                <select
                  onChange={handleDietChange}
                  value={diet}
                  required
                  name="diet"
                  id="diet"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-400 dark:focus:border-orange-400 dark:shadow-sm-light"
                >
                  <option>Choose a Diet</option>
                  {dietOptions.map((diet) => {
                    return (
                      <option key={diet} value={diet}>
                        {diet}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="image" value="Image URL" />
                </div>
                <input
                  id="image"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-400 dark:focus:border-orange-400 dark:shadow-sm-light"
                  placeholder="Image"
                  value={image}
                  onChange={handleImageChange}
                ></input>
                <div className="w-full items-center">
                  {image && (
                    <img
                      className="mt-5 m-auto"
                      width="100px"
                      src={image}
                    ></img>
                  )}
                </div>
              </div>
              <Button className="mb-10 mt-5" color="light" type="submit">
                Edit Recipe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditMyRecipeForm;
