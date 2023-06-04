import { useState, useEffect } from "react";
import { Main } from "./Main.jsx";
// import ErrorNotification from "./ErrorNotification.js";
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
import MyRecipes from "./MyRecipes.jsx";
import MyIngredients from "./MyIngredients.jsx";
import SuggestedRecipes from "./SuggestedRecipes.jsx";

function App(props) {
  const baseUrl = `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}`;
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState(null);
  const { fetchWithCookie } = useToken();

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRecipeSelect = (id) => {
    setSelectedRecipeId(id);
  };

  const handleUserFetch = async () => {
    const data = await fetchWithCookie(
      `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/token`
    );
    if (data !== undefined) {
      const userData = data.user;
      console.log("userData:", userData);
      setUserData(userData);
    }
  };

  useEffect(() => {
    handleUserFetch();
  }, []);

  return (
    <div>
      <BrowserRouter>
        <AuthProvider baseUrl={baseUrl}>
          <Nav />
          <Routes>
            <Route path="/" element={<Main />}></Route>
            <Route path="/signup" element={<SignupForm />}></Route>
            <Route path="/login" element={<LoginForm />}></Route>
            <Route path="/userdata" element={<UserDataCard />}></Route>
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
              element={<RecipeDetails currentUser={userData} />}
            />
            <Route
              path="/myrecipes"
              element={<MyRecipes currentUser={userData} />}
            />
            <Route
              path="/myingredients"
              element={<MyIngredients currentUser={userData} />}
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
