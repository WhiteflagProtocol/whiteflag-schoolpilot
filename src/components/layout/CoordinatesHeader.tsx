import { Affix, Row, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import WhiteFlagContext from "../../helpers/Context";
import { SetLocationModal } from "../LocationModal/SetLocationModal";
import { formatCoordinate } from "../../helpers/CoordinatesHelper";
import { BackIcon, LocationIcon, SearchIcon } from "../../icons/Icons";
import { FilterTypes, Filters, useSearch } from "../../hooks/useSearch";
import { WhiteflagDrawer } from "./WhiteflagDrawer";
import { SearchPanel } from "../search/SearchPanel";
import { Endpoint } from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";

export interface Location {
  latitude?: number;
  longitude?: number;
}

const CoordinatesHeader = () => {
  const ctx = useContext(WhiteFlagContext);
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [locationModalVisable, setLocationModalVisable] =
    useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (ctx.location.latitude === 0 && ctx.location.longitude === 0) {
      setLocationModalVisable(true);
    }
  }, []);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      ctx.locationHandler({ latitude, longitude });
      ctx.mapNavigationHandler(undefined, undefined);
    });
  };

  const openLocationModal = () => {
    setSearchActive(false);
    setLocationModalVisable(true);
  };

  return (
    <>
      {ctx.location.latitude !== 0 && ctx.location.longitude !== 0 && (
        <div className="app-header">
          <div className="app-header__location-container">
            <button
              className="button button--no-border"
              onClick={() => navigate(ctx.lastPage ? ctx.lastPage : "/")}
            >
              <BackIcon />
            </button>
            <div className="app-header__location-text">
              <Typography.Text type={"secondary"}>
                Your reference location
              </Typography.Text>
              <Typography.Text>
                {`${formatCoordinate(
                  "latitude",
                  ctx.location.latitude,
                  false,
                  6
                )},
                ${formatCoordinate(
                  "longitude",
                  ctx.location.longitude,
                  false,
                  6
                )}`}
              </Typography.Text>
            </div>
            {/* <div className="app-header__actions" data-expand={searchActive}>
              <button className="button" onClick={() => navigate("/search")}>
                <SearchIcon />
              </button>
              <button className="button" onClick={openLocationModal}>
                <LocationIcon />
              </button>
            </div> */}
          </div>
        </div>
      )}
      <SetLocationModal
        location={ctx.location}
        setLocation={ctx.locationHandler}
        setCurrentLocation={() => getLocation()}
        open={locationModalVisable}
        setOpen={setLocationModalVisable}
      />
    </>
  );
};
export default CoordinatesHeader;
