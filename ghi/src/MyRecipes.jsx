import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { Button, Card } from "flowbite-react";

const MyRecipes = () => {
	const [recipes, setRecipes] = useState([]);
	const { fetchWithCookie } = useToken();
	const { token } = useToken();
	const [currentUser, setUser] = useState();
	const [isLoading, setLoading] = useState(false);

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
	}, [token]);

	const fetchRecipes = async () => {
		if (currentUser && currentUser.id) {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_COOKIT_API_HOST}/api/myrecipes`,
					{
						params: {
							user_id: currentUser.id,
						},
					}
				);
				const data = response.data;
				setRecipes(data.recipes);
			} catch (error) {
				console.error(error);
			}
		}
	};

  const handleDeleteRecipe = async (recipe_id) => {
		try {
			await axios.delete(
				`${process.env.REACT_APP_COOKIT_API_HOST}/api/myrecipes/${recipe_id}`
			);
			fetchRecipes();
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchRecipes();
	}, [currentUser]);

	useEffect(() => {
		const onPageLoad = () => {
			setLoading(false);
		};

		if (document.readyState === "complete" && recipes) {
			onPageLoad();
		} else {
			window.addEventListener("load", onPageLoad);
			return () => window.removeEventListener("load", onPageLoad);
		}
	}, []);

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
				<div className="flex w-full overflow-hidden">
					<div className="w-full flex items-center justify-center">
						<div className="w-full flex-col">
							<div className="w-full flex items-center justify-end">
								<Link to={"new"} className="">
									<Button className="mt-4" color="light">
										Create New Recipe
									</Button>
								</Link>
							</div>
							<div className="w-full flex items-center justify-center">
								<div className="flex-col text-center">
									{recipes.map((recipe) => (
										<Card key={recipe.id} className=" w-fit my-5 p-2">
											<Link to={recipe.id.toString()}>
												<p className="text-blue-600 text-2xl font-bold capitalize">{recipe.recipe_name}</p>
											</Link>
											<img
												src={recipe.img}
												alt={recipe.recipe_name}
												width="250px"
												className="m-auto rounded-sm outline outline-1 outline-gray-200 shadow-md"
											/>
											<div
												dangerouslySetInnerHTML={{ __html: recipe.description }}
											/>
											<Button color="failure" className="" onClick={() => handleDeleteRecipe(recipe.id)}>
												DELETE
                      </Button>
										</Card>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default MyRecipes;
