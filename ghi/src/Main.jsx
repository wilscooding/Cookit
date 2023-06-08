
import useToken from "@galvanize-inc/jwtdown-for-react";
import RecipeSearch from "./RecipeSearch.jsx";
import { useState } from "react";
import SignupForm from "./SignUpForm";

export const Main = () => {
  const { token } = useToken();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);


  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRecipeSelect = (id) => {
    setSelectedRecipeId(id);
  };


  return (
    <div>
      {!token && <SignupForm />}
      {token && <RecipeSearch
                  onSearch={handleSearch}
                  onSelectRecipe={handleRecipeSelect}
                  searchQuery={searchQuery}
                />}
    </div>
  );
};
