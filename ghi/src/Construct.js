import LoginForm from "./LoginForm";
import TokenCard from "./TokenCard";
import useToken from "@galvanize-inc/jwtdown-for-react";


const ConsoleBanner = () => {
  const { logout } = useToken("");

  const handleLogout = (event) => {
    event.preventDefault();
    logout();
  }

  return (
    <div>
      <form onSubmit={(e) => handleLogout(e)}>
        <button>Logout</button>
      </form>
    </div>
  );
};

export const Main = () => {
  const { token } = useToken();



  return (
    <div>
      <ConsoleBanner />
      {!token && <LoginForm />}
      {token && <TokenCard />}
    </div>
  );
};



// function Construct(props) {


  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <h1>Under construction</h1>
  //       <h2>Coming on (or before)</h2>
  //       <h2>
  //         Module: {props.info.module} Week: {props.info.week} Day:{" "}
  //         {props.info.day}
  //       </h2>
  //       <h2>
  //         by or <strong>WELL BEFORE</strong> {props.info.hour}:{props.info.min}{" "}
  //         Cohort Time
  //       </h2>
  //     </header>
  //   </div>
  // );
// }

// export default Construct;
