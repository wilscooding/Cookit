import { useState } from "react";
import JSONPretty from "react-json-pretty";
import useToken from "@galvanize-inc/jwtdown-for-react";

const UserDataCard = () => {
  const [userData, setUserData] = useState("");
  const { fetchWithToken } = useToken();

  const handleFetchWithAPI = async () => {
    const url = `${process.env.REACT_APP_USER_SERVICE_API_HOST}/token`;
    fetch(url, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.user);
        setUserData(data);
      })
      .catch((error) => console.error(error));
  };

  const handleFetchWithJFR = async (e) => {
    e.preventDefault();
    const data = await fetchWithToken(
      `${process.env.REACT_APP_USER_SERVICE_API_HOST}/token`
    );
    console.log(data);
    setUserData(data);
  };

  return (
    <div className="card text-bg-dark mb-3">
      <h5 className="card-header d-flex">
        <span className="flex-fill">User Data</span>
        <div
          className="btn-toolbar"
          role="toolbar"
          aria-label="Toolbar with button groups"
        >
          <div className="btn-group" role="group">
            <button
              type="button"
              className="btn btn-warning"
              onClick={handleFetchWithAPI}
            >
              Get User Data using Fetch API{" "}
              <i className="bi bi-cloud-arrow-down"></i>
            </button>

            <button
              type="button"
              className="btn btn-info"
              onClick={handleFetchWithJFR}
            >
              Get User Data using fetchWithCookie{" "}
              <i className="bi bi-cloud-arrow-down-fill"></i>
            </button>

            <button
              type="button"
              className="btn eraser-bg"
              onClick={() => setUserData("")}
            >
              <i className="bi bi-eraser-fill"></i>
            </button>
          </div>
        </div>
      </h5>
      <div className="card-body">
        <JSONPretty data={userData}></JSONPretty>
      </div>
    </div>
  );
};

export default UserDataCard;
