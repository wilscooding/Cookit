import { useState, useEffect } from "react";
import { Button, Label } from "flowbite-react";
import axios from "axios";

function CreateRecipeForm() {
  const [creatorId, setCreatorId] = useState(null);
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [diet, setDiet] = useState("");
  const [image, setImage] = useState("");
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

  async function fetchCreatorId() {
    const response = await axios.get(
      `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/token`,
      { withCredentials: true }
    );
    const data = response.data;
    setCreatorId(data.user.id);
  }

  useEffect(() => {
    fetchCreatorId();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await axios.post(
      `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/myrecipes/`,
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
      setRecipeName("");
      setDiet("");
      setImage("");
      setDescription("");
      setSteps("");
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

  return (
    <>
      <div className="flex w-full">
        <div className="w-full flex items-center justify-center mt-20">
          <div className="flex-col">
            <div>
              <div className="mb-6 block">
                <h1 className="text-4xl">Create A Recipe</h1>
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
                Create Recipe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateRecipeForm;
