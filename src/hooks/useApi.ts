import { useContext, useState } from "react";
import WhiteFlagContext from "../helpers/Context";
import { WebService } from "../utilities/WebService";

export interface Endpoint<T, RT> {
  get(id: number): void;
  getByParams(queryParams: string): void;
  getAll(): void;
  post(entity: T, id?: string): Promise<boolean>;
  directPost(entity: any, id?: string, token?: string): Promise<RT | null>;
}

export type useApiResponse<T, RT> = {
  status: number;
  statusText: string;
  data: any;
  entity?: RT;
  entities: RT[];
  error: any;
  loading: boolean;
  endpoints: Endpoint<T, RT>;
};

interface ResponseState<T, RT> {
  status: number;
  statusText: string;
  data: any;
  entity?: RT;
  entities: RT[];
  error: any;
}

interface Props {
  url: string;
  withToken?: boolean;
}

export const useApi = <T, RT = T>({
  url,
  withToken = true,
}: Props): useApiResponse<T, RT> => {
  const [responseState, setResponseState] = useState<ResponseState<T, RT>>({
    status: 0,
    statusText: "",
    data: undefined,
    entities: [],
    error: undefined,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const context = useContext(WhiteFlagContext);

  const getAll = async () => {
    new WebService({ api: url, token: context.token, tokenRequired: withToken })
      .get()
      .then((response) => {
        setResponseState({
          ...responseState,
          data: response,
          entities: response as RT[],
        });
      })
      .catch((error: Response) => {
        if (error.status === 401) {
          handle401();
        }
        setResponseState({ ...responseState, error });
      })
      .finally(() => setLoading(false));

    // setLoading(true);
    // try {
    //   const apiResponse = await fetch(url, {
    //     headers: { Authorization: `Token ${tokenFromHook}` },
    //   });
    //   const json = await apiResponse.json();

    //   setResponseState({
    //     ...responseState,
    //     status: apiResponse.status,
    //     statusText: apiResponse.statusText,
    //     data: json,
    //     entities: json as RT[],
    //   });
    // } catch (error) {
    //   if (error.status === 401) {
    //     logoutAndRedirectToLogin(tokenFromHook);
    //   }
    //   setResponseState({ ...responseState, error });
    //   setResponseState({ ...responseState, error });
    // }
  };

  const getByParams = async (queryParams: string) => {
    const endpoint = `${url}?${queryParams}`;
    setLoading(true);
    new WebService({
      api: endpoint,
      token: context.token,
      tokenRequired: withToken,
    })
      .get()
      .then((response) => {
        setResponseState({
          ...responseState,
          data: response,
          entities: response as RT[],
        });
      })
      .catch((error: Response) => {
        if (error.status === 401) {
          handle401();
        }
        setResponseState({ ...responseState, error });
      })
      .finally(() => setLoading(false));
    setLoading(false);
  };

  const get = async (id: number) => {
    const endpoint = `${url}/${id}`;
    setLoading(true);
    new WebService({
      api: endpoint,
      token: context.token,
      tokenRequired: withToken,
    })
      .get()
      .then((response) => {
        setResponseState({
          ...responseState,
          data: response,
          entities: response as RT[],
        });
      })
      .catch((error: Response) => {
        if (error.status === 401) {
          handle401();
        }
        setResponseState({ ...responseState, error });
      })
      .finally(() => setLoading(false));
    setLoading(false);
  };

  const httpPost = async (entity: any, id?: string) => {
    setLoading(true);
    try {
      const apiResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: context.token,
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

  const directPost = async (entity: any, id?: string, token?: string) => {
    setLoading(true);

    return new WebService({
      api: url,
      token: withToken ? `${token ?? context.token}` : "",
      tokenRequired: withToken,
    })
      .post(JSON.stringify(entity))
      .then((response) => {
        setResponseState({
          ...responseState,
          error: null,
          entity: response as RT,
        });
        return response as RT;
      })
      .catch((error) => {
        if (error.status === 401) {
          handle401();
        }
        setResponseState({ ...responseState, error });
        return null;
      })
      .finally(() => setLoading(false));
  };

  const handle401 = () => {
    context.removeAddress();
    context.removeToken();
    window.location.reload();
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
      get,
      getAll,
      getByParams,
      post: httpPost,
      directPost,
    },
  };
};
