import { FilterTypes, Filters, useSearch } from "../../hooks/useSearch";
import { WhiteflagDrawer } from "../layout/WhiteflagDrawer";
import { SearchInput } from "./SearchInput";
import Item from "antd/es/list/Item";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import { FilterAccordion } from "./FilterAccordion";
import { useApi } from "../../hooks/useApi";
import config from "../../config.json";
import {
  WhiteflagResponse,
  WhiteflagSignal,
} from "../../models/WhiteflagSignal";
import { Settings } from "../../utilities/Settings";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WhiteFlagContext from "../../helpers/Context";
import { BackIcon } from "../../icons/Icons";
import { SignalList } from "../signals/SignalList";
import { DecodedSignal } from "../../models/DecodedSignal";
import { useURLPath } from "../../hooks/useURLPath";
import { Collapse } from "../layout/Collapse";

export interface SearchPanelProps {}

export const SearchPanel = ({}: SearchPanelProps) => {
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [decodedSignals, setDecodedSignals] = useState<WhiteflagResponse[]>([]);

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

  const navigate = useNavigate();
  const ctx = useContext(WhiteFlagContext);

  const [controlFilters, setControlFilters] = useState<Filters>({}); //This is only used for the filter accordion, these filters are only applied once the user clicks on the "apply" button

  const getSignals = useCallback((queryParams: string) => {
    signalsEndpoint.getByParams(queryParams);
  }, []);

  useEffect(() => {
    const getDecodedSignals = async () => {
      const ids = signalResponses.map((response) => response.id);
      const response = await decodeListEndpoint.directPost({
        signals: ids,
      });

      ctx.whiteflagSearchedSignalsHandler(
        response.map((response) => response as unknown as DecodedSignal)
      );
    };

    getDecodedSignals();
  }, [signalResponses]);

  const [value, setValue, filters, _, setFilters, refresh] = useSearch(
    (searchText: string, filters: Filters) => {
      const queryString = Object.entries(filters).reduce(
        (prev, [k, v]) => {
          return `${prev}&${encodeURIComponent(k)}=${v}`;
        },
        searchText ? `title=${searchText}` : ""
      );

      getSignals(queryString);
    }
  );

  return (
    <div className="search">
      <div className="search__header">
        <button
          className="button button--no-border"
          onClick={() => navigate(ctx.lastPage ? ctx.lastPage : "/")}
        >
          <BackIcon />
        </button>
        <div className="search__controls">
          {/* <SearchInput value={value} setValue={setValue} /> */}

          <button
            className="button search__search-button"
            onClick={() => setSearchDrawerOpen(true)}
          ></button>
          <div className="search__button-group">
            <button
              className="button"
              onClick={() => setFilterDrawerOpen(true)}
            >
              {`Filter`}
            </button>
            <button className="button">Sort</button>
          </div>
        </div>
      </div>

      <div>
        <SignalList
          isLoading={isLoadingSignals || isLoadingDecodeList}
          signals={ctx.whiteflagSearchedSignals}
          refreshFunc={refresh}
          className="search__result-list"
        />
      </div>

      <WhiteflagDrawer
        className="search__filter-drawer"
        open={searchDrawerOpen}
        setOpen={setSearchDrawerOpen}
        title="Search"
      >
        <SearchInput value={value} setValue={setValue} />
        <div>
          <SignalList
            isLoading={isLoadingSignals || isLoadingDecodeList}
            signals={ctx.whiteflagSearchedSignals}
            refreshFunc={refresh}
            className="search__result-list"
            quickResults
          />
        </div>
      </WhiteflagDrawer>

      <WhiteflagDrawer
        className="search__filter-drawer"
        open={filterDrawerOpen}
        setOpen={setFilterDrawerOpen}
        title="Filter"
      >
        <FilterAccordion
          controlFilters={controlFilters}
          setControlFilters={setControlFilters}
        />
        <div className="search__filter-drawer__button-group">
          <button
            className="button"
            onClick={() => {
              setControlFilters({});
              setFilters({});
              setFilterDrawerOpen(false);
            }}
          >
            Clear filters
          </button>
          <button
            className="button"
            onClick={() => {
              setFilters(controlFilters);
              setFilterDrawerOpen(false);
            }}
          >
            Apply filters
          </button>
        </div>
      </WhiteflagDrawer>
    </div>
  );
};
