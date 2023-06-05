import { useNavigate } from "react-router-dom";
// import RecipeSearch from "./RecipeSearch";
import React, { useState, useEffect } from "react";
import axios from "axios";
// import { Card } from "flowbite-react";



const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery) {
      navigate(`/recipes?query=${encodeURIComponent(searchQuery)}`);
    }
  }, [searchQuery, navigate]);

  const handleRecipeSearch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/recipes`,
        {
          params: {
            query: searchQuery,
          },
        }
      );
      const data = response.data;
      console.log("Search Recipes Response:", data);
      navigate(`/recipes?query=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error(error);
    }
  };


return (
  <>
			<div>
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<button onClick={handleRecipeSearch}>Search</button>
			</div>
		</>
	);
}

export default Dashboard
