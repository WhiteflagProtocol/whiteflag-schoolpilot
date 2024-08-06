import { Collapse } from "antd";
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
import { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import WhiteFlagContext from "../../helpers/Context";
import { BackIcon } from "../../icons/Icons";

export interface SearchPanelProps {}

export const SearchPanel = ({}: SearchPanelProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {
    entities: signalResponses,
    endpoints: signalsEndpoint,
    loading: isLoadingSignals,
    error: signalsError,
  } = useApi<WhiteflagSignal, WhiteflagResponse>({
    url: `${config.baseUrl}${Settings.endpoints.signals.get}`,
  });
  const navigate = useNavigate();
  const ctx = useContext(WhiteFlagContext);

  const [controlFilters, setControlFilters] = useState<Filters>({}); //This is only used for the filter accordion, these filters are only applied once the user clicks on the "apply" button

  const getSignals = useCallback((queryParams: string) => {
    signalsEndpoint.getByParams(queryParams);
  }, []);

  const [value, setValue, filters, _, setFilters] = useSearch(
    (searchText: string, filters: Filters) => {
      const queryString = Object.entries(filters).reduce((prev, [k, v]) => {
        return `${prev}&${encodeURIComponent(k)}=${v}`;
      }, `title=${searchText}`);

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
          <SearchInput value={value} setValue={setValue} />
          <div className="search__button-group">
            <button className="button" onClick={() => setDrawerOpen(true)}>
              {`Filter (${Object.keys(filters).length})`}
            </button>
            <button className="button">Sort</button>
          </div>
        </div>
      </div>

      <WhiteflagDrawer
        className="search__filter-drawer"
        open={drawerOpen}
        setOpen={setDrawerOpen}
        title="Filter"
      >
        <FilterAccordion
          controlFilters={controlFilters}
          setControlFilters={setControlFilters}
        />
        <button
          className="button"
          onClick={() => {
            setFilters(controlFilters);
            setDrawerOpen(false);
          }}
        >
          Apply Filters
        </button>
      </WhiteflagDrawer>
    </div>
  );
};
