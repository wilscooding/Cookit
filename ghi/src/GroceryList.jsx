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
	const [isLoading, setLoading] = useState(true);

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
		setLoading(false);
	}, [currentUser]);

	if (!items) {
		return <div>Loading...</div>;
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
							<button onClick={() => setSelectedIngredient(null)}>
								Cancel
							</button>
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default GroceryList;
