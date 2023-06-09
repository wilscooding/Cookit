import React, { useState, useEffect } from "react";
import axios from "axios";
import useToken from "@galvanize-inc/jwtdown-for-react";
import {
  getMeasurementQtyDescription,
  getMeasurementUnitDescription,
} from "./MyIngredients";

const GroceryList = () => {
  const { fetchWithCookie } = useToken();
  const { token } = useToken();
  const [currentUser, setUser] = useState();
  const [items, setItems] = useState([]);
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

  const handleFetchWithCookie = async () => {
    try {
      const data = await fetchWithCookie(
        `${process.env.REACT_APP_COOKIT_API_HOST}/token`
      );
      if (data !== undefined) {
        const currentUser = data.user;
        setUser(currentUser);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleFetchWithCookie();
  }, [token]);

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

  const handleInputChange = (event) => {
    setNewItem({
      ...newItem,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddItem = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_COOKIT_API_HOST}/api/grocerylist/`,
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
      setItems([...items, newItemWithDescriptions]);
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
        `${process.env.REACT_APP_COOKIT_API_HOST}/api/grocerylist/${selectedIngredient.id}`,
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

      setItems((prevIngredients) =>
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
        `${process.env.REACT_APP_COOKIT_API_HOST}/api/grocerylist/${itemId}`
      );
      setItems(items.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      if (currentUser && currentUser.id) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_COOKIT_API_HOST}/api/grocerylist/`,
            {
              params: {
                user_id: currentUser.id,
              },
            }
          );
          const data = response.data;
          const processedItems = await Promise.all(
            data.map(async (item) => {
              const measurementQtyDescription =
                await getMeasurementQtyDescription(item.measurement_qty_id);
              const measurementUnitDescription =
                await getMeasurementUnitDescription(item.measurement_id);
              return {
                ...item,
                measurement_qty_description: measurementQtyDescription,
                measurement_unit_description: measurementUnitDescription,
              };
            })
          );
          setItems(processedItems);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchItems();
    fetchMeasurementQtys();
    fetchMeasurementUnits();
  }, [currentUser]);

  if (!items) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Inventory</h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Item</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Unit</th>
            <th className="px-4 py-2">Notes</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={item.id}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
            >
              <td className="border px-4 py-2">{item.ingredient_name}</td>
              <td className="border px-4 py-2">
                {item.measurement_qty_description}
              </td>
              <td className="border px-4 py-2">
                {item.measurement_unit_description}
              </td>
              <td className="border px-4 py-2">{item.notes}</td>
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
                  onClick={() => handleSelectIngredient(item)}
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
                  onClick={() => handleDeleteItem(item.id)}
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
                onClick={handleAddItem}
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
  );
};

export default GroceryList;
