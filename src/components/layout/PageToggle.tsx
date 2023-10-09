import Icon, { UnorderedListOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AddSignalDrawer } from "../signals/AddSignalDrawer";
import WhiteFlagContext from "../../helpers/Context";
interface Props {
  setNewSignalDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const PageToggle: React.FC<Props> = ({ setNewSignalDrawerOpen }) => {
  const ctx = useContext(WhiteFlagContext);
  const navigate = useNavigate();
  const [mapLink, setMapLink] = useState<string>("");

  useEffect(() => {
    if (window.location.pathname === "/") {
      setMapLink("/maps");
    }
    if (window.location.pathname === "/maps") {
      setMapLink("/");
    }
  }, [window.location.pathname]);

  const MapSvg = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
    >
      <circle cx="30" cy="30" r="30" />
      <path
        d="M23.3 28.2577L16.725 25.911L12.25 27.7026C11.9667 27.854 11.6875 27.8456 11.4125 27.6773C11.1375 27.5091 11 27.2568 11 26.9203V12.8403C11 12.6216 11.0625 12.4281 11.1875 12.2599C11.3125 12.0917 11.475 11.9655 11.675 11.8814L16.725 10.0898L23.3 12.4113L27.75 10.6197C28.0333 10.4852 28.3125 10.4978 28.5875 10.6576C28.8625 10.8174 29 11.0655 29 11.402V25.6587C29 25.8437 28.9375 26.0035 28.8125 26.1381C28.6875 26.2727 28.5333 26.3736 28.35 26.4409L23.3 28.2577ZM22.45 26.3652V13.6225L17.55 11.9571V24.6998L22.45 26.3652ZM23.95 26.3652L27.5 25.1793V12.2599L23.95 13.6225V26.3652ZM12.5 26.0624L16.05 24.6998V11.9571L12.5 13.1431V26.0624Z"
        fill="#1C1F22"
      />
    </svg>
  );
  const AddSvg = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
    >
      <circle cx="20" cy="20" r="20" />
      <path
        d="M19.25 27.14V21.3193H13V19.9223H19.25V14.1016H20.75V19.9223H27V21.3193H20.75V27.14H19.25Z"
        fill="black"
      />
    </svg>
  );
  const AddSvgBlack = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
    >
      <circle cx="20" cy="20" r="20" />
      <path
        d="M19.25 27.14V21.3193H13V19.9223H19.25V14.1016H20.75V19.9223H27V21.3193H20.75V27.14H19.25Z"
        fill="white"
      />
    </svg>
  );
  const DownloadSvg = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 16.175L7.175 11.35L8.25 10.275L11.25 13.275V4H12.75V13.275L15.75 10.275L16.825 11.35L12 16.175ZM5.5 20C5.1 20 4.75 19.85 4.45 19.55C4.15 19.25 4 18.9 4 18.5V14.925H5.5V18.5H18.5V14.925H20V18.5C20 18.9 19.85 19.25 19.55 19.55C19.25 19.85 18.9 20 18.5 20H5.5Z"
        fill="black"
      />
    </svg>
  );
  const ListSvg = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M7.25 8.5V7H21V8.5H7.25ZM7.25 12.75V11.25H21V12.75H7.25ZM7.25 17V15.5H21V17H7.25ZM3.75 8.5C3.55 8.5 3.375 8.425 3.225 8.275C3.075 8.125 3 7.94583 3 7.7375C3 7.52917 3.075 7.35417 3.225 7.2125C3.375 7.07083 3.55417 7 3.7625 7C3.97083 7 4.14583 7.07187 4.2875 7.21563C4.42917 7.35938 4.5 7.5375 4.5 7.75C4.5 7.95 4.42813 8.125 4.28438 8.275C4.14062 8.425 3.9625 8.5 3.75 8.5ZM3.75 12.75C3.55 12.75 3.375 12.675 3.225 12.525C3.075 12.375 3 12.1958 3 11.9875C3 11.7792 3.075 11.6042 3.225 11.4625C3.375 11.3208 3.55417 11.25 3.7625 11.25C3.97083 11.25 4.14583 11.3219 4.2875 11.4656C4.42917 11.6094 4.5 11.7875 4.5 12C4.5 12.2 4.42813 12.375 4.28438 12.525C4.14062 12.675 3.9625 12.75 3.75 12.75ZM3.75 17C3.55 17 3.375 16.925 3.225 16.775C3.075 16.625 3 16.4458 3 16.2375C3 16.0292 3.075 15.8542 3.225 15.7125C3.375 15.5708 3.55417 15.5 3.7625 15.5C3.97083 15.5 4.14583 15.5719 4.2875 15.7156C4.42917 15.8594 4.5 16.0375 4.5 16.25C4.5 16.45 4.42813 16.625 4.28438 16.775C4.14062 16.925 3.9625 17 3.75 17Z"
        fill="white"
      />
    </svg>
  );
  const NavigationSvg = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <g clipPath="url(#clip0_1471_17518)">
        <path
          d="M21 3L3 10.53V11.51L9.84 14.16L12.48 21H13.46L21 3Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_1471_17518">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );

  return (
    <React.Fragment>
      <div className="float-btn-container">
        <FloatButton.Group>
          {/* <FloatButton
            style={{ zIndex: "1000" }}
            onClick={() => {
              if (mapLink !== "/maps") {
                ctx.mapNavigationHandler(
                  ctx.location.latitude.toString(),
                  ctx.location.longitude.toString()
                );
              } else {
                navigate("/maps");
              }
            }}
            icon={
              mapLink === "/maps" ? (
                <Icon component={DownloadSvg} />
              ) : (
                <Icon
                  component={NavigationSvg}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                    backgroundColor: "#000000",
                    borderRadius: "50%",
                  }}
                />
              )
            }
          /> */}

          <FloatButton
            style={{ zIndex: "1000" }}
            onClick={() => setNewSignalDrawerOpen(true)}
            icon={
              mapLink === "/maps" ? (
                <Icon component={AddSvg} />
              ) : (
                <Icon
                  component={NavigationSvg}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                    backgroundColor: "#000000",
                    borderRadius: "50%",
                  }}
                />
              )
            }
          />
          {ctx.location.latitude !== 0 && ctx.location.longitude !== 0 && (
            <FloatButton
              style={{ zIndex: "1000" }}
              onClick={() => {
                ctx.activeSignalHandler(null);
                navigate(mapLink);
              }}
              icon={
                mapLink === "/maps" ? (
                  <Icon component={MapSvg} />
                ) : (
                  <Icon
                    component={ListSvg}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      height: "100%",
                      width: "100%",
                      backgroundColor: "#000000",
                      borderRadius: "50%",
                    }}
                  />
                )
              }
            />
          )}
        </FloatButton.Group>
      </div>
    </React.Fragment>
  );
};

export default PageToggle;
