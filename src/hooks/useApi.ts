import { useState } from "react";

export type useApiResponse<T, RT> = {
  status: number;
  statusText: string;
  data: any;
  entity?: RT;
  entities: RT[];
  error: any;
  loading: boolean;
  endpoints: {
    getAll(): void;
    post(entity: T, id?: string): Promise<boolean>;
  };
};

interface ResponseState<T, RT> {
  status: number;
  statusText: string;
  data: any;
  entity?: RT;
  entities: RT[];
  error: any;
}

export const useApi = <T, RT = T>(url: string): useApiResponse<T, RT> => {
  const [responseState, setResponseState] = useState<ResponseState<T, RT>>({
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
        entities: json as RT[],
      });
    } catch (error) {
      setResponseState({ ...responseState, error });
    }
    setLoading(false);
  };

  const httpPost = async (entity: any, id?: string) => {
    setLoading(true);
    try {
      const apiResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entity),
      });
      const json = await apiResponse.json();
      setResponseState({
        ...responseState,
        error: null,
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        entity: json as RT,
      });
      return true;
    } catch (error) {
      setResponseState({ ...responseState, error });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    status: responseState.status,
    statusText: responseState.statusText,
    data: responseState.data,
    entity: responseState.entity,
    entities: responseState.entities,
    error: responseState.error,
    loading,
    endpoints: {
      getAll,
      post: httpPost,
    },
  };
};
