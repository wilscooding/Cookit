import useToken from "@galvanize-inc/jwtdown-for-react";
import JSONPretty from "react-json-pretty";

const TokenCard = () => {
  const { token } = useToken();

  return (
    <div className="card text-bg-dark mb-3">
      <h5 className="card-header data-card">Token</h5>
      <div className="card-body">
        <JSONPretty data={token}></JSONPretty>
      </div>
    </div>
  );
};

export default TokenCard;
