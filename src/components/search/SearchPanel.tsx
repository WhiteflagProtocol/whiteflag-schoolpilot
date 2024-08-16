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
import { BackIcon, CloseIcon, FilterIcon, SearchIcon } from "../../icons/Icons";
import { SignalList } from "../signals/SignalList";
import { DecodedSignal } from "../../models/DecodedSignal";
import { useURLPath } from "../../hooks/useURLPath";
import { Collapse } from "../layout/Collapse";

export interface SearchPanelProps {
  className?: string;
  setMainPageSearchMode: (v: boolean) => void;
  searchDrawerOpen: boolean;
  setSearchDrawerOpen: (v: boolean) => void;
  filterDrawerOpen: boolean;
  setFilterDrawerOpen: (v: boolean) => void;
}

export const SearchPanel = ({
  className,
  setMainPageSearchMode,
  searchDrawerOpen,
  setSearchDrawerOpen,
  filterDrawerOpen,
  setFilterDrawerOpen,
}: SearchPanelProps) => {
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

  const ctx = useContext(WhiteFlagContext);

  const [controlFilters, setControlFilters] = useState<Filters>({}); //This is only used for the filter accordion, these filters are only applied once the user clicks on the "apply" button

  const getSignals = useCallback((queryParams: string) => {
    signalsEndpoint.getByParams(queryParams);
  }, []);

  useEffect(() => {
    const getDecodedSignals = async () => {
      const ids = signalResponses.map((response) => response.id);

      if (ids.length < 1) {
        ctx.whiteflagSearchedSignalsHandler([]);
        return;
      }

      const response = await decodeListEndpoint.directPost({
        signals: ids,
      });

      ctx.whiteflagSearchedSignalsHandler(
        response.map((response) => response as unknown as DecodedSignal)
      );
    };

    getDecodedSignals();
  }, [signalResponses]);

  const [searchText, setSearchText, filters, _, setFilters, refresh] =
    useSearch(
      (searchText: string, filters: Filters) => {
        const queryString = Object.entries(filters).reduce(
          (prev, [k, v]) => {
            return `${prev}&${encodeURIComponent(k)}=${v}`;
          },
          searchText ? `title=${searchText}` : ""
        );

        getSignals(queryString);
      },
      () => ctx.whiteflagSearchedSignalsHandler([])
    );

  const clearSearchText = useCallback(() => {
    setSearchText("");
    ctx.whiteflagSearchedSignalsHandler([]);
  }, []);

  const signals = ctx.whiteflagSearchedSignals;

  return (
    <div className={`search ${className}`}>
      <div className="search__header">
        <div className="search__controls">
          {/* <SearchInput value={value} setValue={setValue} /> */}

          <div className="search__search-input-facade">
            <button
              className="search__search-button"
              onClick={() => setSearchDrawerOpen(true)}
            >
              <SearchIcon className="search__search-icon" />
              <span>{searchText}</span>
            </button>
            <button
              className="button button--no-border"
              onClick={() => {
                clearSearchText();
                setMainPageSearchMode(false);
              }}
            >
              <CloseIcon className="search__close-icon" />
            </button>
          </div>
          <div className="search__button-group">
            <button
              className="button search__filter-button"
              onClick={() => setFilterDrawerOpen(true)}
            >
              <FilterIcon />
              <span>Filter</span>
            </button>
            {/* <button className="button">Sort</button> */}
          </div>
        </div>
      </div>

      <WhiteflagDrawer
        className="search__filter-drawer"
        open={searchDrawerOpen}
        setOpen={setSearchDrawerOpen}
        hideTitleBar
      >
        <SearchInput
          value={searchText}
          setValue={setSearchText}
          closeDrawer={() => {
            setSearchDrawerOpen(false);
            setMainPageSearchMode(false);
          }}
          clearSearchText={clearSearchText}
        />
        <div>
          <SignalList
            isLoading={isLoadingSignals || isLoadingDecodeList}
            signals={signals}
            refreshFunc={refresh}
            className="search__result-list"
            quickResults
          />
        </div>
        {signals.length > 3 && (
          <div className="search__apply-button-container">
            <button
              className="button"
              onClick={() => {
                setSearchDrawerOpen(false);
                setMainPageSearchMode(true);
              }}
            >
              Search
            </button>
          </div>
        )}
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
