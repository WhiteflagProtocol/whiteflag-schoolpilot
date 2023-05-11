import { useState, useEffect } from "react";

export type useApiResponse<T> = {
  status: number;
  statusText: string;
  data: any;
  entities: T[];
  error: any;
  loading: boolean;
  endpoints: {
    getAll(): void;
  };
};

interface ResponseState<T> {
  status: number;
  statusText: string;
  data: any;
  entities: T[];
  error: any;
}

export const useApi = <T>(url: string): useApiResponse<T> => {
  const [responseState, setResponseState] = useState<ResponseState<T>>({
    status: 0,
    statusText: "",
    data: undefined,
    entities: [],
    error: undefined,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const getAll = async () => {
    setLoading(true);
    try {
      const apiResponse = await fetch(url);
      const json = await apiResponse.json();
      setResponseState({
        ...responseState,
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        data: json,
        entities: json as T[],
      });
    } catch (error) {
      setResponseState({ ...responseState, error });
    }
    setLoading(false);
  };

  return {
    status: responseState.status,
    statusText: responseState.statusText,
    data: responseState.data,
    entities: responseState.entities,
    error: responseState.error,
    loading,
    endpoints: {
      getAll,
    },
  };
};
