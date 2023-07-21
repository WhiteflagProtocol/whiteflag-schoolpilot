export const Settings = {
  endpoints: {
    register: "/v1/auth/register/",
    login: "/v1/auth/login/",
    logout: "/v1/auth/logout/",
    signals: {
      get: "/v1/fennel/get_signals/",
    },
    whiteflag: {
      authenticate: "/v1/whiteflag/authenticate/",
      createAccount: "/v1/fennel/create_account/",
      encode: "/v1/whiteflag/encode/",
      getAddress: "/v1/fennel/get_address/",
    },
  },
};
