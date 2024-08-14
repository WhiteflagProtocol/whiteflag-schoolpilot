import { ReloadOutlined } from "@ant-design/icons";
import { Col, List, Row, Typography } from "antd";
import _ from "lodash";
import React, { useContext, useEffect, useMemo, useState } from "react";
import config from "../../config.json";
import WhiteFlagContext from "../../helpers/Context";
import { useApi } from "../../hooks/useApi";
import { DecodedSignal } from "../../models/DecodedSignal";
import {
  WhiteflagResponse,
  WhiteflagSignal,
} from "../../models/WhiteflagSignal";
import { Settings } from "../../utilities/Settings";
import { SetLocationModal } from "../LocationModal/SetLocationModal";
import CoordinatesHeader from "../layout/CoordinatesHeader";
import PageToggle from "../layout/PageToggle";
import { AddSignalDrawer } from "./AddSignalDrawer";
import { SignalDetailDrawer } from "./SignalDetailDrawer";
import SignalCard from "./SignalCard";
import { SignalList } from "./SignalList";
import { SearchPanel } from "../search/SearchPanel";

export interface Location {
  latitude?: number;
  longitude?: number;
}

export const SignalsList = () => {
  const ctx = useContext(WhiteFlagContext);
  const [locationModalVisable, setLocationModalVisable] =
    useState<boolean>(false);
  const [newSignalDrawerOpen, setNewSignalDrawerOpen] =
    useState<boolean>(false);
  const [activeSignal, setActiveSignal] = useState<DecodedSignal>();
  const [distanceToSignal, setDistanceToSignal] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchMode, setSearchMode] = useState<boolean>(false);

  const {
    entities: signalResponses,
    endpoints: signalsEndpoint,
    loading: isLoadingSignals,
    error: signalsError,
  } = useApi<WhiteflagSignal, WhiteflagResponse>({
    url: `${config.baseUrl}${Settings.endpoints.signals.get}`,
  });

  const {
    endpoints: decodeListEndpoint,
    loading: isLoadingDecodeList,
    error: decodeListError,
  } = useApi<WhiteflagResponse[]>({
    url: `${config.baseUrl}${Settings.endpoints.whiteflag.decodeList}`,
  });

  useEffect(() => {
    signalsEndpoint.getAll();
    if (ctx?.whiteflagSignals?.length > 0) {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (signalResponses && !_.isEmpty(signalResponses)) {
      getAllSignals();
    }
  }, [signalResponses]);

  useEffect(() => {
    if (ctx.activeSignal) {
      setActiveSignal(ctx.activeSignal);
    } else {
      setActiveSignal(null);
    }
  }, [ctx.activeSignal]);

  useEffect(() => {
    if (ctx.distanceToSignal) {
      setDistanceToSignal(ctx.distanceToSignal);
    } else {
      setDistanceToSignal(null);
    }
  }, [ctx.distanceToSignal]);

  useEffect(() => {
    ctx.setLastPage(window.location.pathname);
  }, [ctx]);

  // useEffect(() => {
  //   // sync signals in queue
  //   navigator.serviceWorker.controller.postMessage({
  //     action: "resyncQueue",
  //     transfer: localStorage.getItem("token"),
  //   });
  // }, []);

  const getAllSignals = async () => {
    //TODO
    if (!ctx.whiteflagSignals) {
      setIsLoading(true);
    }
    const ids = signalResponses.map((response) => response.id);
    const whiteflagResponse = await decodeListEndpoint.directPost({
      signals: ids,
    });

    if (whiteflagResponse) {
      ctx.whiteflagSignalsHandler(
        whiteflagResponse.map(
          (response) => response as unknown as DecodedSignal
        )
      );
      setIsLoading(false);
    }
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      ctx.locationHandler({ latitude, longitude });
    });
  };

  const referenceTextSignalIds = useMemo(() => {
    return ctx?.whiteflagSignals
      .filter((signal) => !_.isNil(signal.signal_body.text))
      .flatMap((signal) =>
        signal?.references.flatMap((referenceSignal) => referenceSignal.id)
      );
  }, [ctx?.whiteflagSignals]);

  useEffect(() => {
    if (referenceTextSignalIds && ctx.whiteflagSignals) {
      ctx.filteredWhiteflagSignalsHandler(
        ctx.whiteflagSignals
          .map((response) => response as unknown as DecodedSignal)
          ?.filter((signal) => signalExistAsReferenceOfTextSignal(signal))
          ?.sort(ctx.compareDistances)
      );
    }
  }, [referenceTextSignalIds, ctx.whiteflagSignals]);

  const signalExistAsReferenceOfTextSignal = (
    signal: DecodedSignal
  ): boolean => {
    return !referenceTextSignalIds?.includes(signal.id);
  };

  const validSignals = useMemo(() => {
    const signalsWithValidCoordinates =
      ctx?.filteredWhiteflagTextSignals.filter((signal) => {
        const coordinates = ctx.extractCoordinates(signal);
        return coordinates !== null;
      });

    const sortedSignals = signalsWithValidCoordinates.sort(
      ctx.compareDistances
    );

    return sortedSignals;
  }, [ctx?.filteredWhiteflagTextSignals, ctx.location]);

  useEffect(() => {
    ctx.setValidSignals(validSignals);
  }, [validSignals, ctx.setValidSignals]);

  return (
    <React.Fragment>
      <CoordinatesHeader />
      <SearchPanel
        className="signal-list-search"
        setMainPageSearchMode={setSearchMode}
      />
      {ctx.location.latitude !== 0 && ctx.location.longitude !== 0 && (
        <React.Fragment>
          <SignalList
            isLoading={isLoadingSignals || isLoadingDecodeList}
            signals={
              searchMode ? ctx.whiteflagSearchedSignals : ctx.whiteflagSignals
            }
            refreshFunc={() => {
              getAllSignals();
              setIsLoading(true);
            }}
            className="signal-list"
          />
          <SetLocationModal
            location={ctx.location}
            setLocation={ctx.locationHandler}
            setCurrentLocation={getLocation}
            open={locationModalVisable}
            setOpen={setLocationModalVisable}
          />
          {activeSignal && (
            <SignalDetailDrawer
              bearing={ctx.calculateBearing(activeSignal)!}
              open={_.isUndefined(activeSignal) ? false : true}
              setOpen={setActiveSignal}
              signal={activeSignal}
              distanceToSignal={distanceToSignal}
              compassDirection={ctx.getCompassDirection(
                ctx.calculateBearing(activeSignal)
              )}
            />
          )}
        </React.Fragment>
      )}
      {!newSignalDrawerOpen && (
        <PageToggle
          setNewSignalDrawerOpen={setNewSignalDrawerOpen}
          hideFirstButton={!!activeSignal}
          hideSecondButton={!!activeSignal}
        />
      )}
      <AddSignalDrawer
        open={newSignalDrawerOpen}
        setOpen={setNewSignalDrawerOpen}
        signalsEndpoint={signalsEndpoint}
      />
    </React.Fragment>
  );
};
