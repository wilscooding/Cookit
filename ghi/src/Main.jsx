import useToken from "@galvanize-inc/jwtdown-for-react";
import SignupForm from "./SignUpForm";
import Dashboard from "./Dashboard.jsx";

export const Main = () => {
  const { token } = useToken();

  return (
    <div>
      {!token && <SignupForm />}
      {token && <Dashboard />}
    </div>
  );
};
