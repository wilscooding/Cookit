// import React, { useState } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "@galvanize-inc/jwtdown-for-react";
// import UserDataCard from "./UserDataCard";
// import RecipeDetails from "./RecipeDetails";
// import RecipeSearch from "./RecipeSearch";
// import LoginForm from "./LoginForm";
// import SignupForm from "./SignUpForm";
// import "./App.css";
// import { Main } from "./Construct";

// function App() {
//   const baseUrl = `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}`;
//   const [selectedRecipeId, setSelectedRecipeId] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [userData, setUserData] = useState(null);

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//   };

//   const handleRecipeSelect = (id) => {
//     setSelectedRecipeId(id);
//   };

//   const handleUserFetch = (data) => {
//     setUserData(data);
//   };

//   return (
//     <div>
//       <BrowserRouter>
//         <AuthProvider baseUrl={baseUrl}>
//           <Routes>
//             <Route path="/" element={<Main />} />
//             <Route path="/signup" element={<SignupForm />} />
//             <Route path="/login" element={<LoginForm />} />
//             {/* Pass userData and onUserFetch function to UserDataCard */}
//             <Route
//               path="/"
//               element={
//                 <UserDataCard
//                   userData={userData}
//                   onUserFetch={handleUserFetch}
//                 />
//               }
//             />
//             <Route
//               path="/recipes"
//               element={
//                 <RecipeSearch
//                   onSearch={handleSearch}
//                   onSelectRecipe={handleRecipeSelect}
//                   searchQuery={searchQuery}
//                 />
//               }
//             />
//             {/* Pass currentUser as userData to RecipeDetails */}
//             <Route
//               path="/recipes/:id"
//               element={<RecipeDetails currentUser={userData} />}
//             />
//           </Routes>
//         </AuthProvider>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@galvanize-inc/jwtdown-for-react";
import UserDataCard from "./UserDataCard";
import RecipeDetails from "./RecipeDetails";
import RecipeSearch from "./RecipeSearch";
import LoginForm from "./LoginForm";
import SignupForm from "./SignUpForm";
import "./App.css";
import { Main } from "./Construct";

function App() {
  const baseUrl = `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}`;
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRecipeSelect = (id) => {
    setSelectedRecipeId(id);
  };

  const handleUserFetch = (data) => {
    setUserData(data);
  };

  return (
    <div>
      <BrowserRouter>
        <AuthProvider baseUrl={baseUrl}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/login" element={<LoginForm />} />
            {/* Pass userData and onUserFetch function to UserDataCard */}
            <Route
              path="/"
              element={<UserDataCard onUserFetch={handleUserFetch} />}
            />
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
            {/* Pass currentUser as userData to RecipeDetails */}
            <Route
              path="/recipes/:id"
              element={<RecipeDetails currentUser={userData} />}
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
