import { useState, useEffect } from "react";
import { Main } from "./Main.jsx";
import LoginForm from "./LoginForm.jsx";
import SignupForm from "./SignUpForm.jsx";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@galvanize-inc/jwtdown-for-react";
import RecipeDetails from "./RecipeDetails.jsx";
import RecipeSearch from "./RecipeSearch.jsx";
import Nav from "./NavBar.jsx";
import UserDataCard from "./UserDataCard.jsx";
import useToken from "@galvanize-inc/jwtdown-for-react";
import Dashboard from "./Dashboard.jsx";
import MyRecipes from "./MyRecipes.jsx";
import MyIngredients from "./MyIngredients.jsx";
import Profile from "./Profile.jsx";
import EditProfile from "./EditProfile.jsx";
import GroceryList from "./GroceryList.jsx";



function App(props) {
    const baseUrl = `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}`;
    const [selectedRecipeId, setSelectedRecipeId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (query) => {
    setSearchQuery(query);
    };

    const handleRecipeSelect = (id) => {
    setSelectedRecipeId(id);
    };

    return (
		<div>
			<BrowserRouter>
				<AuthProvider baseUrl={baseUrl}>
					<Nav />
					<Routes>
						<Route path="/" element={<Main />} />
						<Route path="/signup" element={<SignupForm />}/>
						<Route path="/login" element={<LoginForm />}/>
						<Route path="/userdata" element={<UserDataCard />}/>
						<Route
							path="/recipes"
							element={
								<RecipeSearch
									onSearch={handleSearch}
									onSelectRecipe={handleRecipeSelect}
									searchQuery={searchQuery}
								/>
							}
						/>
						<Route
							path="/recipes/:id"
							element={<RecipeDetails />}
						/>
						<Route
							path="/home"
							element={<Dashboard />}
						/>
						<Route
							path="/grocerylist"
							element={<GroceryList />}
						/>
						<Route
							path="/myrecipes"
							element={<MyRecipes />}
						/>
						<Route
							path="/myingredients"
							element={<MyIngredients />}
						/>
                        <Route
							path="/profile"
							element={<Profile />}
                        />
                        <Route path="/profile/edit"
                            element={<EditProfile />}
                        />
					</Routes>
				</AuthProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
