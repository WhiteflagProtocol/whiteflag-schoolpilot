import config from "../config.json";
import { ErrorResponse } from "../models/ErrorResponse";

interface IWebServiceConstructorArgs {
  api: string;
  //   input: RequestInfo;
  token?: string;
}

export class WebService<T = {}> {
  protected request: RequestInfo;
  protected readonly token: string;

  constructor({ api, token }: IWebServiceConstructorArgs) {
    this.request = api;
    this.token = token;
  }

  public async get(): Promise<T> {
    const params = await this.params("GET");
    return fetch(this.request, params).then((reponse) => {
      return this.checkResponse(reponse);
    });
  }

  public async post(data: any): Promise<T> {
    const params = await this.params("POST", data);
    return fetch(this.request, params).then((reponse) =>
      this.checkResponse(reponse)
    );
  }

  public async put(data: any = null): Promise<T> {
    const params = await this.params("PUT", data);
    return fetch(this.request, params).then((reponse) =>
      this.checkResponse(reponse)
    );
  }

  public async delete(): Promise<T> {
    const params = await this.params("DELETE");

    return fetch(this.request, params).then((reponse) =>
      this.checkResponse(reponse)
    );
  }

  protected async params(
    method: string,
    data: any = null
  ): Promise<RequestInit> {
    let authorization = "Token";
    if (!this.token) {
      throw new Error("Fatal Error: User is not logged in.");
    }
    authorization = `Token ${this.token}`;

    const p = {
      body: !!data ? JSON.stringify(data) : null,
      method,
      headers: {
        // Accept: "application/json",
        // "Content-Type": "application/json",
        // Pragma: "no-cache",
        Authorization: authorization,
        // Host: config.baseUrl,
      },
    };

    return p;
  }

  protected async checkResponse(response: Response): Promise<T> {
    if (!response.ok) {
      throw response;
    } else {
      if (response.status !== 204) {
        // TODO: Enumerate status codes
        return response.json() as Promise<T>;
      }
    }
  }
}
