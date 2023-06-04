import React, { useState, useEffect } from "react";
import axios from "axios";

const MyIngredients = ({ currentUser }) => {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({
    ingredient_name: "",
    measurement_qty_id: "",
    measurement_id: "",
    notes: "",
  });
  const [measurementQtys, setMeasurementQtys] = useState([]);
  const [measurementUnits, setMeasurementUnits] = useState([]);

  useEffect(() => {
    fetchIngredients();
    fetchMeasurementQtys();
    fetchMeasurementUnits();
  }, [currentUser]);

  const fetchIngredients = async () => {
    
    if (currentUser && currentUser.id) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/myingredients/`,
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
              await getMeasurementQtyDescription(ingredient.measurement_qty_id);
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
        console.log(error);
      }
    }
  };

  const fetchMeasurementQtys = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/measurement_qty`
      );
      setMeasurementQtys(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMeasurementUnits = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/measurement_units`
      );
      setMeasurementUnits(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getMeasurementQtyDescription = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/measurement_qty/${id}`
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
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/measurement_units/${id}`
      );
      return response.data.measurement_description;
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  const handleInputChange = (event) => {
    setNewIngredient({
      ...newIngredient,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddIngredient = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/myingredients/`,
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

  const handleDeleteIngredient = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/myingredients/${id}`
      );
      setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
          {ingredients.map((ingredient) => (
            <tr key={ingredient.id}>
              <td className="border px-4 py-2">{ingredient.ingredient_name}</td>
              <td className="border px-4 py-2">
                {ingredient.measurement_qty_description}
              </td>
              <td className="border px-4 py-2">
                {ingredient.measurement_unit_description}
              </td>
              <td className="border px-4 py-2">{ingredient.notes}</td>
              <td className="border px-4 py-2">
                <button onClick={() => handleDeleteIngredient(ingredient.id)}>
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
              <button onClick={handleAddIngredient}>Add</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MyIngredients;
