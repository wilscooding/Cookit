import { useState, useEffect } from "react";
import { Button, Label } from "flowbite-react";
import axios from "axios";

function CreateRecipeForm() {
  const [creatorId, setCreatorId] = useState(null);
  const [recipeName, setRecipeName] = useState("");
  const [diet, setDiet] = useState("");
  const [image, setImage] = useState("");

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
      }
    );

    if (response.statusText === "OK") {
      setRecipeName("");
      setDiet("");
      setImage("");
    }

    console.log(response);
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

  return (
    <>
      <div className="flex w-full">
        <div className="w-full flex items-center justify-center mt-20">
          <div className="flex-col">
            <div>
              <div className="mb-2 block">
                <h1>Create A Recipe</h1>
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
                  <Label htmlFor="diet" value="Pick Your Diet Restrictions" />
                </div>
                <input
                  id="diet"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-400 dark:focus:border-orange-400 dark:shadow-sm-light"
                  placeholder="Diet"
                  value={diet}
                  onChange={handleDietChange}
                ></input>
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
              </div>
              <Button color="light" type="submit">
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
