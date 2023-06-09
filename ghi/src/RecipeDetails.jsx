import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { Button, Card } from "flowbite-react";

const RecipeDetails = () => {
	const { fetchWithCookie } = useToken();
	const { token } = useToken();
	const [currentUser, setUser] = useState();

	const handleFetchWithCookie = async () => {
		const data = await fetchWithCookie(
			`${process.env.REACT_APP_COOKIT_API_HOST}/token`
		);
		if (data !== undefined) {
			const currentUser = data.user;
			setUser(currentUser);
		}
	};

	useEffect(() => {
		handleFetchWithCookie();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	const [recipe, setRecipe] = useState("");
	const { id } = useParams();

	useEffect(() => {
		console.log("RecipeDetails - id:", id);
		const fetchRecipe = async () => {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_COOKIT_API_HOST}/recipes/${id}`
				);
				const data = response.data;
				console.log("Recipe Info Response:", data);
				setRecipe(data.recipe);
			} catch (error) {
				console.error(error);
			}
		};
		fetchRecipe();
	}, [id]);

	const handleSaveRecipe = async () => {
		try {
			if (!currentUser) {
				console.log("No current user found");
				return;
			}

			const {
				title,
				image,
				extendedIngredients,
			} = recipe;

			const stepsText = recipe.analyzedInstructions[0].steps
				.map((step) => step.step)
				.join("\n");
			console.log("steps text", stepsText);
			console.log("analized inst", recipe.analyzedInstructions);
			const response = await axios.post(
				`${process.env.REACT_APP_COOKIT_API_HOST}/api/myrecipes/`,
				{
					creator_id: currentUser.id,
					recipe_name: title,
					diet: recipe.diets[0],
					img: image,
					description: recipe.summary,
					steps: stepsText,
				}
			);
			// console.log("creator_id:", currentUser.id);
			// Handle the response as needed
			// console.log("Save Recipe Response:", response.data);
			const savedRecipeId = response.data.id;
			// console.log("Saved Recipe ID:", savedRecipeId);
			let ingredientId;
			for (const ingredient of extendedIngredients) {
				const { name, measures } = ingredient;

				const existingIngredientResponse = await axios.get(
					`${process.env.REACT_APP_COOKIT_API_HOST}/api/ingredients/`,
					{
						params: {
							ingredient_name: name,
						},
					}
				);

				if (existingIngredientResponse.data.length > 0) {
					const existingIngredient = existingIngredientResponse.data.find(
						(ingredient) => ingredient.ingredient_name === name
					);
					ingredientId = existingIngredient.id;
					// console.log("Ingredient already exists:", name);
					// console.log("Ingredient ID:", ingredientId);
					// Associate the existing ingredient with the saved recipe
				} else {
					const newIngredientResponse = await axios.post(
						`${process.env.REACT_APP_COOKIT_API_HOST}/api/ingredients/`,
						{
							ingredient_name: name,
						}
					);

					const newIngredient = newIngredientResponse.data;
					ingredientId = newIngredient.id;
					// console.log("New Ingredient created:", name);
					// console.log("Ingredient ID:", ingredientId);
					// Associate the new ingredient with the saved recipe
				}

				const amount = measures.us.amount;
				let measurementQtyId;
				// console.log("Amount from frontend:", amount);

				const existingMeasurementQtyResponse = await axios.get(
					`${process.env.REACT_APP_COOKIT_API_HOST}/api/measurement_qty/`,
					{
						params: {
							qty_amount: amount,
						},
					}
				);
				// console.log(
				//   "Existing qty_amounts from backend:",
				//   existingMeasurementQtyResponse.data.map((item) => item.qty_amount)
				// );

				if (
					existingMeasurementQtyResponse.data &&
					existingMeasurementQtyResponse.data.length > 0
				) {
					const existingMeasurementQty =
						existingMeasurementQtyResponse.data.find(
							(measurementQty) => measurementQty.qty_amount === amount
						);

					if (existingMeasurementQty) {
						measurementQtyId = existingMeasurementQty.id;
						// console.log(
						//   "Measurement quantity already exists:",
						//   measurementQtyId
						// );
					} else {
						const newMeasurementQtyResponse = await axios.post(
							`${process.env.REACT_APP_COOKIT_API_HOST}/api/measurement_qty/`,
							{
								qty_amount: amount,
							}
						);
						measurementQtyId = newMeasurementQtyResponse.data.id;
						// console.log("New Measurement quantity created:", amount);
					}
				}

				const unit = measures.us.unitLong;
				let measurementUnitId;
				// console.log("Unit from frontend:", unit);

				const existingMeasurementUnitResponse = await axios.get(
					`${process.env.REACT_APP_COOKIT_API_HOST}/api/measurement_units/`,
					{
						params: {
							measurement_description: unit,
						},
					}
				);
				// console.log(
				//   "Existing measurement units from backend:",
				//   existingMeasurementUnitResponse.data.map(
				//     (item) => item.measurement_description
				//   )
				// );

				if (
					existingMeasurementUnitResponse.data &&
					existingMeasurementUnitResponse.data.length > 0
				) {
					const existingMeasurementUnit =
						existingMeasurementUnitResponse.data.find(
							(measurementUnit) =>
								measurementUnit.measurement_description === unit
						);

					if (existingMeasurementUnit) {
						measurementUnitId = existingMeasurementUnit.id;
						// console.log("Measurement unit already exists:", unit);
					} else {
						const newMeasurementUnitResponse = await axios.post(
							`${process.env.REACT_APP_COOKIT_API_HOST}/api/measurement_units/`,
							{
								measurement_description: unit,
							}
						);
						measurementUnitId = newMeasurementUnitResponse.data.id;
						// console.log("New Measurement unit created:", unit);
					}
				}

				// console.log("Ingredient:", name);
				// console.log("Measurement Quantity ID:", measurementQtyId);
				// console.log("Measurement Unit ID:", measurementUnitId);
				// console.log("---------------------------");

				const ingredientData = {
					recipe_id: savedRecipeId,
					measurement_id: measurementUnitId,
					measurement_qty_id: measurementQtyId,
					ingredient_id: ingredientId,
				};
				// console.log("before recipe ingredients", ingredientData);

				const recipeIngredientResponse = await axios.post(
					`${process.env.REACT_APP_COOKIT_API_HOST}/api/recipe_ingredients/`,
					ingredientData
				);

				// console.log("Saved Recipe Ingredient:", recipeIngredientResponse.data);
			}

			console.log("Ingredients saved successfully!");
		} catch (error) {
			console.error(error);
		}
	};
	if (!recipe) {
		return (
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
		);
	}

	const ingredientNames = recipe.extendedIngredients.map((ingredient) => ({
		name: ingredient.name,
		original: ingredient.original,
	}));

	if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
		const instructions = recipe.analyzedInstructions[0].steps.map((step) => ({
			number: step.number,
			step: step.step,
		}));

		return (
			<div className="relative w-full bg-gray-100">
				<div className="flex p-4 justify-center">
					<div className="container justify-center">
						<h2 className="p-4 pl-0 pb-0 text-3xl font-bold">{recipe.title}</h2>
						<img
							className="rounded-md shadow m-2 ml-0"
							src={recipe.image}
							alt={recipe.title}
						/>
						<div className="flex">
							<Button onClick={handleSaveRecipe}>Save Recipe</Button>
							<h3 className="flex pl-2 text-xs justify-center">
								Created By: {recipe.creditsText}
							</h3>
						</div>
						<Card className="justify-center my-6">
							<div className="flex">
								<h3 className="flex w-full text-center justify-center text-2xl font-bold">
									Summary:
								</h3>
								<div
									className="font-normal"
									dangerouslySetInnerHTML={{ __html: recipe.summary }}
								/>
							</div>
						</Card>
						<h3 className="capitalize text-2xl underline font-bold">Ingredients</h3>
						<ol className=" indent-3 mb-3">
							{ingredientNames.map((ingredient, index) => (
								<li key={index}>
									<div className="row">
										<div className="col-sm-8">{ingredient.original}</div>
									</div>
								</li>
							))}
						</ol>
						<h3 className="text-lg font-bold">Instructions</h3>
						<ul>
							{instructions.map((instruction, index) => (
								<li key={index}>
									{instruction.number}{": "}{instruction.step}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		);
	} else {
		return <div>No instructions found for this recipe.</div>;
	}
};

export default RecipeDetails;
