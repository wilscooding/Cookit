import { useState } from "react";
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
import Dashboard from "./Dashboard.jsx";
import MyRecipes from "./MyRecipes.jsx";
import MyIngredients from "./MyIngredients.jsx";
import Profile from "./Profile.jsx";
import EditProfile from "./EditProfile.jsx";
import GroceryList from "./GroceryList.jsx";
import CreateMyRecipeForm from "./CreateMyRecipeForm.jsx";
import EditMyRecipeForm from "./EditMyRecipeForm.jsx";
import MyRecipeDetails from "./MyRecipeDetails.jsx";

function App(props) {
  const baseUrl = `${process.env.REACT_APP_COOKIT_API_HOST}`;
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setLoading] = useState(true);

    const domain = /https:\/\/[^/]+/;
    const basename = process.env.PUBLIC_URL.replace(domain, '');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRecipeSelect = (id) => {
    setSelectedRecipeId(id);
  };

  return (
    <div className="bg-amber-400/50 min-h-screen pb-10">
      <BrowserRouter basename={basename}>
        <AuthProvider baseUrl={baseUrl}>
          <Nav />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/userdata" element={<UserDataCard />} />
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
            <Route path="/recipes/:id" element={<RecipeDetails />} />
            <Route path="/myrecipes/new" element={<CreateMyRecipeForm />} />
            <Route path="/myrecipes/:id/edit" element={<EditMyRecipeForm />} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="/grocerylist" element={<GroceryList />} />
            <Route path="/myrecipes" element={<MyRecipes />} />
            <Route path="/myrecipes/:id" element={<MyRecipeDetails />} />
            <Route path="/myingredients" element={<MyIngredients />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
