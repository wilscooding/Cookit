import React, { useState, useEffect } from "react";
import axios from "axios";
import useToken from "@galvanize-inc/jwtdown-for-react";

const getMeasurementQtyDescription = async (id) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_COOKIT_API_HOST}/api/measurement_qty/${id}`
    );
    return response.data.qty_amount;
  } catch (error) {
    console.error(error);
    return "";
  }
};

const getMeasurementUnitDescription = async (id) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_COOKIT_API_HOST}/api/measurement_units/${id}`
    );
    return response.data.measurement_description;
  } catch (error) {
    console.error(error);
    return "";
  }
};

const MyIngredients = () => {
  const { fetchWithCookie } = useToken();
  const { token } = useToken();
  const [currentUser, setUser] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const handleFetchWithCookie = async () => {
      const data = await fetchWithCookie(
        `${process.env.REACT_APP_COOKIT_API_HOST}/token`
      );
      if (data !== undefined) {
        const currentUser = data.user;
        setUser(currentUser);
      }
    };
    handleFetchWithCookie();
    // eslint-disable-next-line
  }, [token]);

  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({
    ingredient_name: "",
    measurement_qty_id: "",
    measurement_id: "",
    notes: "",
  });
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [updatedIngredient, setUpdatedIngredient] = useState({
    ingredient_name: "",
    measurement_qty_id: "",
    measurement_id: "",
    notes: "",
  });
  const [measurementQtys, setMeasurementQtys] = useState([]);
  const [measurementUnits, setMeasurementUnits] = useState([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      if (currentUser && currentUser.id) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_COOKIT_API_HOST}/api/myingredients/`,
            {
              params: {
                user_id: currentUser.id,
              },
            }
          );
          const data = response.data;
          const processedIngredients = await Promise.all(
            data.map(async (ingredient) => {
              const measurementQtyDescription =
                await getMeasurementQtyDescription(
                  ingredient.measurement_qty_id
                );
              const measurementUnitDescription =
                await getMeasurementUnitDescription(ingredient.measurement_id);
              return {
                ...ingredient,
                measurement_qty_description: measurementQtyDescription,
                measurement_unit_description: measurementUnitDescription,
              };
            })
          );
          setIngredients(processedIngredients);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchIngredients();

    const fetchMeasurementQtys = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_COOKIT_API_HOST}/api/measurement_qty`
        );
        setMeasurementQtys(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMeasurementQtys();

    const fetchMeasurementUnits = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_COOKIT_API_HOST}/api/measurement_units`
        );
        setMeasurementUnits(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMeasurementUnits();

    setLoading(false);
  }, [currentUser]);

  const handleInputChange = (event) => {
    setNewIngredient({
      ...newIngredient,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddIngredient = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_COOKIT_API_HOST}/api/myingredients/`,
        {
          user_id: currentUser.id,
          ...newIngredient,
        }
      );
      const newIngredientData = response.data;
      const measurementQtyDescription = await getMeasurementQtyDescription(
        newIngredientData.measurement_qty_id
      );
      const measurementUnitDescription = await getMeasurementUnitDescription(
        newIngredientData.measurement_id
      );
      const newIngredientWithDescriptions = {
        ...newIngredientData,
        measurement_qty_description: measurementQtyDescription,
        measurement_unit_description: measurementUnitDescription,
      };
      setIngredients([...ingredients, newIngredientWithDescriptions]);
      setNewIngredient({
        ingredient_name: "",
        measurement_qty_id: "",
        measurement_id: "",
        notes: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectIngredient = (ingredient) => {
    setSelectedIngredient(ingredient);
    setUpdatedIngredient({
      ingredient_name: ingredient.ingredient_name,
      measurement_qty_id: ingredient.measurement_qty_id,
      measurement_id: ingredient.measurement_id,
      notes: ingredient.notes,
    });
  };

  const handleUpdateIngredient = async () => {
    try {
      const selectedQTY = measurementQtys.find(
        (qty) => qty.id === Number(updatedIngredient.measurement_qty_id)
      );
      const selectedUnit = measurementUnits.find(
        (unit) => unit.id === Number(updatedIngredient.measurement_id)
      );

      const updatedData = {
        user_id: currentUser.id,
        ingredient_name: updatedIngredient.ingredient_name,
        measurement_qty_id: selectedQTY ? String(selectedQTY.id) : null,
        measurement_id: selectedUnit ? String(selectedUnit.id) : null,
        notes: updatedIngredient.notes,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_COOKIT_API_HOST}/api/myingredients/${selectedIngredient.id}`,
        updatedData
      );

      const updatedIngredientData = response.data;
      const measurementQtyDescription = await getMeasurementQtyDescription(
        updatedIngredientData.measurement_qty_id
      );
      const measurementUnitDescription = await getMeasurementUnitDescription(
        updatedIngredientData.measurement_id
      );
      const updatedIngredientWithDescriptions = {
        ...updatedIngredientData,
        measurement_qty_description: measurementQtyDescription,
        measurement_unit_description: measurementUnitDescription,
      };

      setIngredients((prevIngredients) =>
        prevIngredients.map((ingredient) =>
          ingredient.id === selectedIngredient.id
            ? updatedIngredientWithDescriptions
            : ingredient
        )
      );
      setSelectedIngredient(null);
      setUpdatedIngredient({
        ingredient_name: "",
        measurement_qty_id: "",
        measurement_id: "",
        notes: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteIngredient = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_COOKIT_API_HOST}/api/myingredients/${id}`
      );
      setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

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
        <div>
          <h2 className="text-2xl font-semibold mb-4">Inventory</h2>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Ingredient</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Unit</th>
                <th className="px-4 py-2">Notes</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ingredient, index) => (
                <tr
                  key={ingredient.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                >
                  <td className="border px-4 py-2">
                    {ingredient.ingredient_name}
                  </td>
                  <td className="border px-4 py-2">
                    {ingredient.measurement_qty_description}
                  </td>
                  <td className="border px-4 py-2">
                    {ingredient.measurement_unit_description}
                  </td>
                  <td className="border px-4 py-2">{ingredient.notes}</td>
                  <td className="border px-4 py-2">
                    <button
                      style={{
                        backgroundColor: "#3B82F6",
                        color: "white",
                        fontWeight: "bold",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.25rem",
                        outline: "none",
                        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.5)",
                      }}
                      onClick={() => handleSelectIngredient(ingredient)}
                    >
                      Update
                    </button>
                    <button
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        fontWeight: "bold",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.25rem",
                        outline: "none",
                        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.5)",
                      }}
                      onClick={() => handleDeleteIngredient(ingredient.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    name="ingredient_name"
                    value={newIngredient.ingredient_name}
                    onChange={handleInputChange}
                  />
                </td>
                <td className="border px-4 py-2">
                  <select
                    name="measurement_qty_id"
                    value={newIngredient.measurement_qty_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Quantity</option>
                    {measurementQtys.map((qty) => (
                      <option key={qty.id} value={qty.id}>
                        {qty.qty_amount}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border px-4 py-2">
                  <select
                    name="measurement_id"
                    value={newIngredient.measurement_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Unit</option>
                    {measurementUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.measurement_description}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    name="notes"
                    value={newIngredient.notes}
                    onChange={handleInputChange}
                  />
                </td>
                <td className="border px-4 py-2">
                  <button
                    style={{
                      backgroundColor: "#3B82F6",
                      color: "white",
                      fontWeight: "bold",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.25rem",
                      outline: "none",
                      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.5)",
                    }}
                    onClick={handleAddIngredient}
                  >
                    Add
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          {selectedIngredient && (
            <div>
              <h3>Update Ingredient</h3>
              <input
                type="text"
                name="ingredient_name"
                value={updatedIngredient.ingredient_name}
                onChange={(event) =>
                  setUpdatedIngredient({
                    ...updatedIngredient,
                    ingredient_name: event.target.value,
                  })
                }
              />
              <select
                name="measurement_qty_id"
                value={updatedIngredient.measurement_qty_id}
                onChange={(event) =>
                  setUpdatedIngredient({
                    ...updatedIngredient,
                    measurement_qty_id: event.target.value,
                  })
                }
              >
                <option value="">Select Quantity</option>
                {measurementQtys.map((qty) => (
                  <option key={qty.id} value={qty.id}>
                    {qty.qty_amount}
                  </option>
                ))}
              </select>
              <select
                name="measurement_id"
                value={updatedIngredient.measurement_id}
                onChange={(event) =>
                  setUpdatedIngredient({
                    ...updatedIngredient,
                    measurement_id: event.target.value,
                  })
                }
              >
                <option value="">Select Unit</option>
                {measurementUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.measurement_description}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="notes"
                value={updatedIngredient.notes}
                onChange={(event) =>
                  setUpdatedIngredient({
                    ...updatedIngredient,
                    notes: event.target.value,
                  })
                }
              />
              <button
                style={{
                  backgroundColor: "#3B82F6",
                  color: "white",
                  fontWeight: "bold",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.25rem",
                  outline: "none",
                  boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.5)",
                }}
                onClick={handleUpdateIngredient}
              >
                Update
              </button>
              <button
                style={{
                  backgroundColor: "grey",
                  color: "white",
                  fontWeight: "bold",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.25rem",
                  outline: "none",
                  boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.5)",
                }}
                onClick={() => setSelectedIngredient(null)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export { getMeasurementQtyDescription, getMeasurementUnitDescription };
export default MyIngredients;
