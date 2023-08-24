import { Link } from "react-router-dom";

const PageToggle = () => {
  let mapLink;
  if (window.location.pathname === "/") {
    mapLink = "/maps";
  }
  if (window.location.pathname === "/maps") {
    mapLink = "/";
  }

  return (
    <div className="page-toggle">
      <Link to={`${mapLink}`}>
        <img
          src={window.location.origin + "/assets/icon-map-outlined.png"}
        ></img>
      </Link>
    </div>
  );
};

export default PageToggle;
