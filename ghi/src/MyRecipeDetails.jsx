import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, Card } from "flowbite-react";
import axios from "axios";

const MyRecipeDetails = ({ currentUser }) => {
	const [recipe, setRecipe] = useState("");
	const [recipeIngredients, setRecipeIngredients] = useState([]);
	const { id } = useParams();
	const [isLoading, setLoading] = useState(true);

	const fetchRecipe = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/myrecipes/${id}`
			);
			const data = response.data;
			setRecipe(data);
		} catch (error) {
			console.error(error);
		}
	};

	const fetchRecipeIngredients = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/recipe_ingredients/recipe/${id}`
			);
			const data = response.data;
			setRecipeIngredients(data);

			// Fetch additional details for each ingredient
			const ingredientPromises = data.map(async (ingredient) => {
				const ingredientResponse = await axios.get(
					`${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/ingredients/${ingredient.ingredient_id}`
				);
				const ingredientData = ingredientResponse.data;
				ingredient.ingredient_name = ingredientData.ingredient_name;

				const qtyAmountResponse = await axios.get(
					`${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/measurement_qty/${ingredient.measurement_qty_id}`
				);
				const qtyAmountData = qtyAmountResponse.data;
				ingredient.qty_amount = qtyAmountData.qty_amount;

				const measurementResponse = await axios.get(
					`${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/measurement_units/${ingredient.measurement_id}`
				);
				const measurementData = measurementResponse.data;
				ingredient.measurement_description =
					measurementData.measurement_description;

				return ingredient;
			});

			const updatedIngredients = await Promise.all(ingredientPromises);
			setRecipeIngredients(updatedIngredients);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchRecipe();
		fetchRecipeIngredients();
		setLoading(false);
	}, [id]);

	if (!recipe) {
		return <div>Loading...</div>;
	}

	if (currentUser && recipe.creator_id !== currentUser.id) {
		return <div>This recipe does not belong to you!</div>;
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
				<div className="relative w-full">
						<div className="w-full flex flex-col justify-center">
							<div className="w-full flex items-center justify-end">
								<Link to={`/myrecipes/${recipe.id}/edit`} className="mr-10">
									<Button className="m-4" color="light">
										Edit Recipe
									</Button>
								</Link>
							</div>
							<div className="w-full flex items-center justify-center">
								<div className="flex text-center justify-center">
									<Card>
										<h1 className="border-b border-slate-300 pb-2">
											<strong>{recipe.recipe_name}</strong>
										</h1>
                    <div className="flex justify-center">
										  <img src={recipe.img} alt={recipe.title} width="300px" />
                    </div>
										<div className="border-b border-slate-300 pb-3">
											<div
												dangerouslySetInnerHTML={{ __html: recipe.description }}
											/>
										</div>
										<div className="flex justify-center overflow-x-auto shadow-md sm:rounded-lg border-b border-slate-300 pb-3">
											<table className=" w-1/2 text-sm text-gray-500 dark:text-gray-400">
												<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
													<tr>
														<th scope="col" className="px-6 py-3">
															Ingredients
														</th>
														<th scope="col" className="px-6 py-3">
															Amount
														</th>
													</tr>
                            </thead>
													<tbody>
														{recipeIngredients.map((ingredient) => (
																<tr key={ingredient.id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
																	<th
																		scope="row"
																		className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
																	>
																		{ingredient.ingredient_name}
																	</th>
																	<td className="px-6 py-4">
																		{ingredient.qty_amount}{" "}
																		{ingredient.measurement_description}
																	</td>
																</tr>
														))}
													</tbody>
											</table>
										</div>
                    <h1 className="font-bold text-xl">Instructions</h1>
										<div className="border-b border-slate-300 pb-3">
											{recipe.steps}
										</div>
										<div>{recipe.diet}</div>
									</Card>
								</div>
							</div>
						</div>
				</div>
			)}
		</>
	);
};

export default MyRecipeDetails;
