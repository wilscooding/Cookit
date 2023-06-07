import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  getMeasurementQtyDescription,
  getMeasurementUnitDescription,
} from "./MyIngredients";

const GroceryList = ({ currentUser }) => {
  const [groceryItems, setGroceryItems] = useState([]);
  const [newItem, setNewItem] = useState({
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
    fetchGroceryList();
    fetchMeasurementQtys();
    fetchMeasurementUnits();
  }, [currentUser]);

  const fetchGroceryList = async () => {
    if (currentUser && currentUser.id) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/grocerylist/`,
          {
            params: {
              user_id: currentUser.id,
            },
          }
        );
        const groceryListData = response.data;
        const itemsWithDescriptions = await Promise.all(
          groceryListData.map(async (item) => {
            const measurementQty = await getMeasurementQtyDescription(
              item.measurement_qty_id
            );
            const measurementUnit = await getMeasurementUnitDescription(
              item.measurement_id
            );
            return {
              ...item,
              measurement_qty_description: measurementQty,
              measurement_unit_description: measurementUnit,
            };
          })
        );

        setGroceryItems(itemsWithDescriptions);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchMeasurementQtys = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/measurement_qty/`
      );
      setMeasurementQtys(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMeasurementUnits = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/measurement_units/`
      );
      setMeasurementUnits(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    setNewItem({
      ...newItem,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddItem = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/grocerylist/`,
        {
          user_id: currentUser.id,
          ...newItem,
        }
      );
      const newItemData = response.data;
      const measurementQtyDescription = await getMeasurementQtyDescription(
        newItemData.measurement_qty_id
      );
      const measurementUnitDescription = await getMeasurementUnitDescription(
        newItemData.measurement_id
      );

      const newItemWithDescriptions = {
        ...newItemData,
        measurement_qty_description: measurementQtyDescription,
        measurement_unit_description: measurementUnitDescription,
      };
      setGroceryItems([...groceryItems, newItemWithDescriptions]);
      setNewItem({
        ingredient_name: "",
        measurement_qty_id: "",
        measurement_id: "",
        notes: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectIngredient = (item) => {
    setSelectedIngredient(item);
    setUpdatedIngredient({
      ingredient_name: item.ingredient_name,
      measurement_qty_id: item.measurement_qty_id,
      measurement_id: item.measurement_id,
      notes: item.notes,
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
        measurement_qty_id: selectedQTY?.id || null,
        measurement_id: selectedUnit?.id || null,
        notes: updatedIngredient.notes,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/myingredients/${selectedIngredient.id}`,
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

      setGroceryItems((prevIngredients) =>
        prevIngredients.map((item) =>
          item.id === selectedIngredient.id
            ? updatedIngredientWithDescriptions
            : item
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

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/grocerylist/${itemId}`
      );
      setGroceryItems(groceryItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Grocery List</h2>
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
          {groceryItems.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.ingredient_name}</td>
              <td className="border px-4 py-2">
                {item.measurement_qty_description}
              </td>
              <td className="border px-4 py-2">
                {item.measurement_unit_description}
              </td>
              <td className="border px-4 py-2">{item.notes}</td>
              <td className="border px-4 py-2">
                <button onClick={() => handleSelectIngredient(item)}>
                  Update
                </button>
                <button onClick={() => handleDeleteItem(item.id)}>
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
                value={newItem.ingredient_name}
                onChange={handleInputChange}
              />
            </td>
            <td className="border px-4 py-2">
              <select
                name="measurement_qty_id"
                value={newItem.measurement_qty_id}
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
                value={newItem.measurement_id}
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
                value={newItem.notes}
                onChange={handleInputChange}
              />
            </td>
            <td className="border px-4 py-2">
              <button onClick={handleAddItem}>Add</button>
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
          <button onClick={handleUpdateIngredient}>Update</button>
          <button onClick={() => setSelectedIngredient(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default GroceryList;
