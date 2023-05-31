import LoginForm from "./LoginForm";
import TokenCard from "./TokenCard";
import useToken from "@galvanize-inc/jwtdown-for-react";
import UserDataCard from "./UserDataCard";


export const Main = () => {
  const { token } = useToken();

  return (
    <div>
      {!token && <LoginForm />}
      {token && <TokenCard />}

      {/* <UserDataCard /> */}
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
