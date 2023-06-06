<<<<<<< HEAD
import { useState, useEffect } from "react";
import axios from "axios";
import {
	getMeasurementQtyDescription,
	getMeasurementUnitDescription,
} from "./MyIngredients";

const GroceryList = ({ currentUser }) => {
	console.log(currentUser);
	const [items, setItems] = useState([]);
	const [newItem, setNewItem] = useState({
		ingredient_name: "",
		measurement_qty_id: "",
		measurement_id: "",
		notes: "",
	});
	const [measurementQtys, setMeasurementQtys] = useState([]);
	const [measurementUnits, setMeasurementUnits] = useState([]);

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
			const newitemData = response.data;
			const measurementQtyDescription = await getMeasurementQtyDescription(
				newitemData.measurement_qty_id
			);
			const measurementUnitDescription = await getMeasurementUnitDescription(
				newitemData.measurement_id
			);
			const newitemWithDescriptions = {
				...newitemData,
				measurement_qty_description: measurementQtyDescription,
				measurement_unit_description: measurementUnitDescription,
			};
			setItems([...items, newitemWithDescriptions]);
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

	const handleDeleteItem = async (id) => {
		try {
			await axios.delete(
				`${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/grocerylist/${id}`
			);
			setItems(items.filter((item) => item.id !== id));
		} catch (error) {
			console.error(error);
		}
	};

	console.log(items);
	useEffect(() => {
		const fetchItems = async () => {
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
					const data = response.data;
					const processeditems = await Promise.all(
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
					setItems(processeditems);
					console.log("processeditems:", processeditems);
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
					{items.map((item) => (
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
		</div>
	);
};
=======
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getMeasurementQtyDescription, getMeasurementUnitDescription } from "./MyIngredients";


// const getMeasurementQtyDescription = async (id) => {
//   try {
//     const response = await axios.get(
//       `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/measurement_qty/${id}`
//     );
//     return response.data.qty_amount;
//   } catch (error) {
//     console.error(error);
//     return "";
//   }
// };

// const getMeasurementUnitDescription = async (id) => {
//   try {
//     const response = await axios.get(
//       `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/measurement_units/${id}`
//     );
//     return response.data.measurement_description;
//   } catch (error) {
//     console.error(error);
//     return "";
//   }
// };

const GroceryList = ({ currentUser }) => {
  const [groceryItems, setGroceryItems] = useState([]);
  const [newItem, setNewItem] = useState({
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


        )

        setGroceryItems(itemsWithDescriptions);
        console.log("Grocery List Data:", itemsWithDescriptions);
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
      console.log("Measurement Qty Description:", measurementQtyDescription);
      const measurementUnitDescription = await getMeasurementUnitDescription(
        newItemData.measurement_id
      );
      console.log("Measurement Unit Description:", measurementUnitDescription);
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
    </div>
  );
};

>>>>>>> Caeden
export default GroceryList;
