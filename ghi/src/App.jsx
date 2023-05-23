import { useEffect, useState } from "react";
import { Main } from "./Construct.js";
import ErrorNotification from "./ErrorNotification.js";
import LoginForm from "./LoginForm.jsx";
import SignupForm from './SignUpForm.jsx';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@galvanize-inc/jwtdown-for-react";

function App() {
  const [launchInfo, setLaunchInfo] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getData() {
      let url = `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/api/launch-details`;
      console.log("fastapi url: ", url);
      let response = await fetch(url);
      console.log("------- hello? -------");
      let data = await response.json();

      if (response.ok) {
        console.log("got launch data!");
        setLaunchInfo(data.launch_details);
      } else {
        console.log("drat! something happened");
        setError(data.message);
      }
    }
    getData();
  }, []);

  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
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
