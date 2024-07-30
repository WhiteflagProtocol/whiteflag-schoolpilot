import { Affix, Row, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import WhiteFlagContext from "../../helpers/Context";
import { SetLocationModal } from "../LocationModal/SetLocationModal";
import { formatCoordinate } from "../../helpers/CoordinatesHelper";
import { LocationIcon } from "../../icons/LocationIcon";
import { SearchIcon } from "../../icons/SearchIcon";
import { FilterTypes, Filters, useSearch } from "../../hooks/useSearch";

export interface Location {
  latitude?: number;
  longitude?: number;
}
interface Props {
  // onSetLocation: (location:any) => void
}
const CoordinatesHeader: React.FC<Props> = (props) => {
  const ctx = useContext(WhiteFlagContext);
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [locationModalVisable, setLocationModalVisable] =
    useState<boolean>(false);

  const [value, setValue, filters, setFilter] = useSearch(
    (searchText, filters) =>
      console.log("useSearch", "searching", searchText, filters)
  );

  // (searchText: string, filters: Filters) =>
  //   Object.entries(filters).reduce((prev, [k, v]) => {
  //     return `${prev}&${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
  //   }, `search=${searchText}`)

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
          {/* <div style={{ padding: "20px" }}>{locationMarker}</div> */}
          {!searchActive && (
            <div className="app-header__input">
              <Typography.Text type={"secondary"} style={{}}>
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
          )}
          <div className="app-header__actions" data-expand={searchActive}>
            <div className="app-header__search">
              {searchActive && (
                <input
                  type="search"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              )}
              <button
                className="button"
                onClick={() => setSearchActive(!searchActive)}
              >
                <SearchIcon />
              </button>
            </div>
            <button
              className="button"
              onClick={() => setFilter(FilterTypes.Author, "Nuan")}
            >
              F
            </button>
            <button className="button" onClick={openLocationModal}>
              <LocationIcon />
            </button>
            {/* <Typography.Link
              strong
              underline
              onClick={() => setLocationModalVisable(true)}
            >
              Edit
            </Typography.Link> */}
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
