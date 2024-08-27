import { useEffect, useState } from "react";
import { useDebounceFunction } from "./useDebounceFunction";

export enum FilterTypes {
  MessageType = "message_type",
  InfrastructureType = "infrastructure_type",
  Author = "author",
}

export type Filters = {
  [key in FilterTypes]?: string[];
};

export function useSearch(
  searchFunction: (searchText: string, filters: Filters) => void,
  clearFunction?: () => void,
  minSearchString = 2
): [
  string,
  (val: string) => void,
  Filters,
  (filter: FilterTypes, value: string[]) => void,
  (filters: Filters) => void,
  () => void
] {
  const [searchText, _setSearchText] = useState<string | undefined>();
  const [debouncedSearchText, _setDebouncedSearchText] = useState<
    string | undefined
  >(); // Decoupling is needed to ensure debouncing works
  const [searchParams, _setSearchParams] = useState<string | undefined>();
  const [filters, _setFiltersMap] = useState<Filters>({});

  const debouncedSearchTextUpdate = useDebounceFunction(
    (_searchText: string) => {
      _setDebouncedSearchText(_searchText);
    }
  );

  const setSearchValue = (val: string) => {
    _setSearchText(val);
    if (val.length > minSearchString || val.length === 0) {
      debouncedSearchTextUpdate(val);
    }
  };

  const setFilter = (filter: FilterTypes, value: string[]) => {
    console.log(filter, value);
    _setFiltersMap((prev) => ({ ...prev, [filter]: value }));
  };

  const setFilters = (filters: Filters) => {
    _setFiltersMap(filters);
  };

  useEffect(() => {
    if (debouncedSearchText?.length > 0 || Object.keys(filters).length > 0) {
      searchFunction(debouncedSearchText, filters);
    } else if (debouncedSearchText?.length === 0 && clearFunction) {
      clearFunction();
    }
  }, [debouncedSearchText, filters]);

  const refresh = () => {
    searchFunction(searchText, filters);
  };

  return [searchText, setSearchValue, filters, setFilter, setFilters, refresh];
}
