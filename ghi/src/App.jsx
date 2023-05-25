// import { useEffect, useState } from "react";
import { Main } from "./Construct.js";
// import ErrorNotification from "./ErrorNotification.js";
import LoginForm from "./LoginForm.jsx";
import SignupForm from './SignUpForm.jsx';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@galvanize-inc/jwtdown-for-react";

function App() {
  const baseURL = "http://localhost:8000";
  // const domain = /https:\/\/[^/]+/;
  // const basename = process.env.PUBLIC_URL.replace(domain, "");

  return (
    <div>
      <BrowserRouter>
        <AuthProvider baseURl={ baseURL }>
          <Routes>
            <Route path="/" element={ <Main /> }></Route>
            <Route path="/signup" element={<SignupForm/>}></Route>
            <Route path="/login" element={<LoginForm />}></Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>

    </div>
  );
}

export default App;
