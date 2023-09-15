import { Affix, Row, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import WhiteFlagContext from "../../helpers/Context";
import { SetLocationModal } from "../LocationModal/SetLocationModal";

export interface Location {
  latitude?: number;
  longitude?: number;
}
interface Props {
  // onSetLocation: (location:any) => void
}
const CoordinatesHeader: React.FC<Props> = (props) => {
  const ctx = useContext(WhiteFlagContext);
  const [locationModalVisable, setLocationModalVisable] =
    useState<boolean>(false);

  useEffect(() => {
    if (!ctx.location[0 as keyof {}]) {
      getLocation();
    }
  }, []);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      ctx.locationHandler({ latitude, longitude });
    });
  };

  return (
    <React.Fragment>
      <Affix offsetTop={0} style={{ marginTop: "-20px" }}>
        <div
          style={{
            backgroundColor: "#25292D",
            height: "56px",
            overflow: "initial",
            top: "24px",
            width: "100%",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "inline-block",
              marginLeft: "8px",
            }}
          >
            <Row>
              <Typography.Text
                type={"secondary"}
                style={{
                  color: "#9FA3AD",
                  marginTop: "4px",
                  marginBottom: "0px",
                }}
              >
                Reference coordinates
              </Typography.Text>
            </Row>
            <Row>
              <Typography.Text>
                {`${ctx.location.latitude}, ${ctx.location.longitude}`}
              </Typography.Text>
            </Row>
          </div>
          <div
            style={{ float: "right", marginRight: "16px", marginTop: "15px" }}
          >
            <Typography.Link
              strong
              onClick={() => setLocationModalVisable(true)}
            >
              Change
            </Typography.Link>
          </div>
        </div>
      </Affix>
      <SetLocationModal
        location={ctx.location}
        setLocation={ctx.locationHandler}
        setCurrentLocation={() => getLocation()}
        open={locationModalVisable}
        setOpen={setLocationModalVisable}
      />
    </React.Fragment>
  );
};
export default CoordinatesHeader;
