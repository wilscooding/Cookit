import LoginForm from "./LoginForm.jsx";
import SignupForm from "./SignUpForm.jsx";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@galvanize-inc/jwtdown-for-react";
import RecipeDetails from "./RecipeDetails.jsx";
import RecipeSearch from "./RecipeSearch.jsx";
import Nav from "./NavBar.jsx";
import Dashboard from "./Dashboard.jsx";
import MyRecipes from "./MyRecipes.jsx";
import MyIngredients from "./MyIngredients.jsx";
import Profile from "./Profile.jsx";
import EditProfile from "./EditProfile.jsx";
import GroceryList from "./GroceryList.jsx";
import CreateMyRecipeForm from "./CreateMyRecipeForm.jsx";
import EditMyRecipeForm from "./EditMyRecipeForm.jsx";
import MyRecipeDetails from "./MyRecipeDetails.jsx";

function App() {
  const baseUrl = `${process.env.REACT_APP_COOKIT_API_HOST}`;

  const domain = /https:\/\/[^/]+/;
  const basename = process.env.PUBLIC_URL.replace(domain, "");
  

  return (
    <div className="bg-amber-400/50 h-screen w-screen">
      <BrowserRouter basename={basename}>
        <AuthProvider baseUrl={baseUrl}>
          <Nav />
          <Routes>
            <Route path="/" element={<RecipeSearch />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/login" element={<LoginForm />} />
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
