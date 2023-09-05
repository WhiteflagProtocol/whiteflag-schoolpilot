import Icon from "@ant-design/icons";
import { FloatButton } from "antd";
import { Link, useNavigate, useNavigation } from "react-router-dom";

const PageToggle = () => {
  const navigate = useNavigate();
  let mapLink: string;
  if (window.location.pathname === "/") {
    mapLink = "/maps";
  }
  if (window.location.pathname === "/maps") {
    mapLink = "/";
  }

  const MapSvg = () => (
    <svg width="1em" height="1em" fill="black" viewBox="0 0 1024 1024">
      <path
        d="M323.398,1.108c-1.581-1.122-3.604-1.414-5.412-0.776L216.674,35.46L115.369,0.333
		c-1.289-0.448-2.661-0.418-3.908,0.024c-1.253-0.442-2.625-0.471-3.908-0.024L4.295,36.134c-2.399,0.835-4.01,3.097-4.01,5.639
		v278.456c0,1.933,0.937,3.741,2.506,4.857c1.02,0.734,2.238,1.11,3.461,1.11c0.656,0,1.319-0.107,1.957-0.328l103.257-35.801
		l103.263,35.801c0.024,0,0.048,0,0.072,0.012c0.615,0.197,1.241,0.316,1.88,0.316s1.271-0.119,1.88-0.316
		c0.024-0.012,0.048-0.012,0.072-0.012l103.263-35.801c2.405-0.841,4.016-3.103,4.016-5.639V5.971
		C325.904,4.038,324.973,2.23,323.398,1.108z M103.548,280.173l-91.323,31.666V46.021l91.323-31.666V280.173z M119.384,14.355
		l91.323,31.666v265.818l-91.323-31.666V14.355z M313.97,280.173l-91.329,31.666V46.021l91.329-31.666V280.173z"
      />
    </svg>
  );

  return (
    <FloatButton
      onClick={() => navigate(mapLink)}
      icon={<Icon component={MapSvg} />}
    />
    // <div className="page-toggle">
    //   <Link to={`${mapLink}`}>
    //     <img
    //       src={window.location.origin + "/assets/icon-map-outlined.png"}
    //     />
    //   </Link>
    // </div>
  );
};

export default PageToggle;
