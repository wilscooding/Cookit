import { useState, useEffect } from "react";
import { Button, Card, Label, Table } from "flowbite-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate } from "react-router-dom";

function EditMyRecipeForm() {
  const { id } = useParams();
  const [currentUser, setUser] = useState();
  const [isLoading, setLoading] = useState(true);
  const { fetchWithCookie } = useToken();
  const { token } = useToken();
  const navigate = useNavigate();
  const [creatorId, setCreatorId] = useState(null);
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [diet, setDiet] = useState("");
  const [image, setImage] = useState("");
  const [newRecipeIngredient, setNewRecipeIngredient] = useState({
    id: "",
    qty: "",
    unit: "",
  });

  const [recipeIngredients, setRecipeIngredients] = useState([]);

  const [ingredients, setIngredients] = useState({});
  const [qtys, setQtys] = useState({});
  const [units, setUnits] = useState({});

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

  const handleFetchWithCookie = async () => {
    const data = await fetchWithCookie(
      `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/token`
    );
    if (data !== undefined) {
      const currentUser = data.user;
      setUser(currentUser);
      setLoading(false);
    }
  };

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

  async function fetchRecipeIngredients() {
    const response = await axios.get(
      `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/recipe-ingredients/?recipe_id=${id}`,
      { withCredentials: true }
    );

    if (response.statusText === "OK") {
      const data = response.data;
      setRecipeIngredients(
        data.map((ingredient) => {
          return {
            id: ingredient.ingredient_id,
            unit: ingredient.measurement_id,
            qty: ingredient.measurement_qty_id,
            recipeIngredientId: ingredient.id,
          };
        })
      );
    }
  }

  const fetchIngredients = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/ingredients/`
      );

      const ingredientsMap = {};
      response.data.forEach((ingredient) => {
        ingredientsMap[ingredient.id] = ingredient;
      });

      setIngredients(ingredientsMap);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchQtys = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/measurement_qty`
      );

      const qtyMap = {};
      response.data.forEach((qty) => {
        qtyMap[qty.id] = qty;
      });

      setQtys(qtyMap);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/measurement_units`
      );

      const unitsMap = {};
      response.data.forEach((unit) => {
        unitsMap[unit.id] = unit;
      });

      setUnits(unitsMap);
    } catch (error) {
      console.error(error);
    }
  };

  async function handleNewRecipeIngredient(event) {
    const clonedNewRecipeIngredient = JSON.parse(
      JSON.stringify(newRecipeIngredient)
    );
    clonedNewRecipeIngredient.id = event.target.value;

    setNewRecipeIngredient(clonedNewRecipeIngredient);
  }

  async function handleNewRecipeIngredientQty(event) {
    const clonedNewRecipeIngredient = JSON.parse(
      JSON.stringify(newRecipeIngredient)
    );
    clonedNewRecipeIngredient.qty = event.target.value;

    setNewRecipeIngredient(clonedNewRecipeIngredient);
  }

  async function handleNewRecipeIngredientUnit(event) {
    const clonedNewRecipeIngredient = JSON.parse(
      JSON.stringify(newRecipeIngredient)
    );
    clonedNewRecipeIngredient.unit = event.target.value;

    setNewRecipeIngredient(clonedNewRecipeIngredient);
  }

  async function handleRemoveRecipeIngredient(
    ingredientId,
    recipeIngredientId
  ) {
    let clonedRecipeIngredients = JSON.parse(JSON.stringify(recipeIngredients));

    const response = await axios.delete(
      `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/recipe-ingredients/${recipeIngredientId}`
    );

    if (response.statusText === "OK") {
      setRecipeIngredients(
        clonedRecipeIngredients.filter(
          (ingredient) => ingredient.id !== ingredientId
        )
      );
    }
  }

  async function handleAddRecipeIngredient() {
    const clonedRecipeIngredients = JSON.parse(
      JSON.stringify(recipeIngredients)
    );

    const isValidNewIngredient =
      newRecipeIngredient.id &&
      newRecipeIngredient.qty &&
      newRecipeIngredient.unit;

    const ingredientAlreadyExists = !!recipeIngredients.find(
      (ingredient) => ingredient.id === newRecipeIngredient.id
    );

    if (!isValidNewIngredient || ingredientAlreadyExists) {
      return;
    }

    const response = await axios.post(
      `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/recipe-ingredients/`,
      {
        recipe_id: id,
        measurement_id: newRecipeIngredient.unit,
        measurement_qty_id: newRecipeIngredient.qty,
        ingredient_id: newRecipeIngredient.id,
      }
    );

    if (response.statusText === "OK") {
      newRecipeIngredient.recipeIngredientId = response.data.id;
      clonedRecipeIngredients.push(newRecipeIngredient);
      setRecipeIngredients(clonedRecipeIngredients);
      setNewRecipeIngredient({
        id: "",
        qty: "",
        unit: "",
      });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await axios.put(
      `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/myrecipes/${id}`,
      {
        creator_id: currentUser.id,
        recipe_name: recipeName,
        diet: diet,
        img: image,
        description: description,
        steps: steps,
      }
    );

    if (response.statusText === "OK") {
      navigate("/myrecipes");
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

  useEffect(() => {
    fetchRecipe();
    handleFetchWithCookie();
    fetchIngredients();
    fetchQtys();
    fetchUnits();
  }, [token]);

  useEffect(() => {
    if (
      Object.keys(qtys).length &&
      Object.keys(units).length &&
      Object.keys(ingredients).length
    ) {
      fetchRecipeIngredients();
    }
  }, [qtys, units, ingredients]);

  if (!currentUser) {
    return <div>Must be signed in!</div>;
  }

  if (creatorId !== currentUser.id) {
    return <div>You are not allowed to edit this recipe!</div>;
  }

  return (
    <>
      {isLoading ? (
        <div className="flex w-full h-screen">
          <div className="w-full flex items-center justify-center">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-24 h-24 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-orange-400 dark:fill-gray-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full">
          <div className="w-full flex items-center justify-center mt-10">
            <Card className="p-4">
              <div className="flex-col">
                <div>
                  <div className="mb-6 block text-center">
                    <h1 className="text-4xl">Create A Recipe</h1>
                  </div>
                </div>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
                      <Label
                        htmlFor="diet"
                        value="Pick Your Diet Restrictions"
                      />
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
                  <div>
                    <Table>
                      <Table.Head>
                        <Table.HeadCell className="py-1 text-center">
                          Ingredient
                        </Table.HeadCell>
                        <Table.HeadCell className="py-1 text-center">
                          Quantity
                        </Table.HeadCell>
                        <Table.HeadCell className="py-1 text-center">
                          Unit
                        </Table.HeadCell>
                        <Table.HeadCell className="py-1 text-center">
                          Add
                        </Table.HeadCell>
                      </Table.Head>
                      <Table.Body className="divide-y">
                        {recipeIngredients.map((ingredient, idx) => (
                          <Table.Row
                            key={idx}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                          >
                            <Table.Cell className="text-center py-1">
                              {ingredients[ingredient.id].ingredient_name}
                            </Table.Cell>
                            <Table.Cell className="text-center py-1">
                              {qtys[ingredient.qty].qty_amount}
                            </Table.Cell>
                            <Table.Cell className="text-center py-1">
                              {units[ingredient.unit].measurement_description}
                            </Table.Cell>
                            <Table.Cell className="text-center py-1">
                              <Button
                                size="xs"
                                className="m-auto"
                                color="failure"
                                onClick={() =>
                                  handleRemoveRecipeIngredient(
                                    ingredient.id,
                                    ingredient.recipeIngredientId
                                  )
                                }
                              >
                                Remove
                              </Button>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                        <Table.Row>
                          <Table.Cell className="py-1">
                            <select
                              name="ingredient"
                              value={newRecipeIngredient.id}
                              onChange={handleNewRecipeIngredient}
                            >
                              <option value="">Select Ingredient</option>
                              {Object.values(ingredients).map((ingredient) => (
                                <option
                                  key={ingredient.id}
                                  value={ingredient.id}
                                >
                                  {ingredients[ingredient.id].ingredient_name}
                                </option>
                              ))}
                            </select>
                          </Table.Cell>
                          <Table.Cell className="py-1">
                            <select
                              name="qty"
                              value={newRecipeIngredient.qty}
                              onChange={handleNewRecipeIngredientQty}
                            >
                              <option value="">Select Quantity</option>
                              {Object.values(qtys).map((qty) => (
                                <option key={qty.id} value={qty.id}>
                                  {qtys[qty.id].qty_amount}
                                </option>
                              ))}
                            </select>
                          </Table.Cell>
                          <Table.Cell className="py-1">
                            <select
                              name="measurement_id"
                              value={newRecipeIngredient.unit.description}
                              onChange={handleNewRecipeIngredientUnit}
                            >
                              <option value="">Select Unit</option>
                              {Object.values(units).map((unit) => (
                                <option key={unit.id} value={unit.id}>
                                  {units[unit.id].measurement_description}
                                </option>
                              ))}
                            </select>
                          </Table.Cell>
                          <Table.Cell className="py-1">
                            <Button
                              size="xs"
                              className="m-auto"
                              onClick={handleAddRecipeIngredient}
                            >
                              Add
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                  </div>
                  <Button className="mt-5" color="light" type="submit">
                    Update Recipe
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

export default EditMyRecipeForm;
