import { useEffect, useState } from "react";
import { Filters } from "./useSearch";

export function useURLPath(
  filters: Filters,
  setFilters: (val: Filters) => void
): [queryParams: { [key: string]: string }] {
  const [path, setPath] = useState("");
  const [queryParams, setQueryParams] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const split = window.location.href.split("?");
    setPath(split[0]);
    if (split.length > 1) {
      const queryString = `?${split[1]}`;

      const pattern = /[?&]([^=]+)=([^&]+)/g;
      const params: { [key: string]: string[] } = {};

      let match;

      while ((match = pattern.exec(queryString)) !== null) {
        const key = match[1];
        const value = match[2];
        if (Object.keys(params).includes(key)) {
          params[key] = [...params[key], value];
        } else {
          params[key] = [value];
        }
      }

      setFilters(params);
    }
  }, []);

  useEffect(() => {
    console.log("tick", filters);
    const queryString = Object.entries(filters).reduce((prev, [k, v]) => {
      return `${prev}&${encodeURIComponent(k)}=${v}`;
    }, `?`);
    const url = `${path}${queryString}`;
    console.log(
      window.location.href.toString(),
      url,
      window.location.href.toString() == url
    );
    // if (url !== window.location.href) {
    //   window.location.href = url;
    // }
  }, [filters]);

  //   const setQueryParamsInLocation = () => {
  //     window.location.href = `${path}?fuc`;
  //   };

  return [queryParams];
}
