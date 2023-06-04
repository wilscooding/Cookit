import { redirect, useNavigate } from "react-router-dom";
import RecipeSearch from "./RecipeSearch";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "flowbite-react";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery) {
      navigate(`/recipes?query=${encodeURIComponent(searchQuery)}`);
    }
  }, [searchQuery, navigate]);

  const handleRecipeSearch = () => {
    if (searchQuery) {
      navigate(`/recipes?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleRecipeSearch}>Search</button>
    </div>
  );
};

export default Dashboard;
