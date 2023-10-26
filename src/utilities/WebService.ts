import config from "../config.json";

interface IWebServiceConstructorArgs {
  api: string;
  token?: string;
  tokenRequired?: boolean;
}

export class WebService<T = {}> {
  protected request: RequestInfo;
  protected readonly token: string = "";
  protected readonly tokenRequired: boolean = true;

  public constructor({
    api,
    token,
    tokenRequired,
  }: IWebServiceConstructorArgs) {
    this.request = api;
    if (tokenRequired) {
      this.tokenRequired = tokenRequired;
    }
    this.tokenRequired = tokenRequired;
    if (token) {
      this.token = token;
    }
  }

  public async get(): Promise<T> {
    const params = await this.params("GET");
    return fetch(this.request, params).then((reponse) => {
      return this.checkResponse(reponse);
    });
  }

  public async post(data: any): Promise<T> {
    const params = await this.params("POST", data);
    return fetch(this.request, params).then((reponse) => {
      return this.checkResponse(reponse);
    });
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
    if (!this.token && this.tokenRequired) {
      throw new Error("Fatal Error: User is not logged in.");
    } else if (this.tokenRequired && this.token) {
      authorization = `Token ${this.token}`;
    } else if (!this.tokenRequired) {
      authorization = "";
    }

    const p = {
      body: !!data ? data : null,
      method,
      headers: this.tokenRequired
        ? {
            "Content-Type": "application/json",
            Authorization: authorization,

            // Accept: "application/json",
            // Pragma: "no-cache",
            // Host: config.baseUrl,
          }
        : {
            "Content-Type": "application/json",
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
