export const Settings = {
  endpoints: {
    register: "/v1/auth/register/",
    login: "/v1/auth/login/",
    logout: "/v1/auth/logout/",
    signals: {
      get: "/v1/fennel/get_signals/",
      send: "/v1/fennel/send_new_signal/",
    },
    whiteflag: {
      authenticate: "/v1/whiteflag/authenticate/",
      createAccount: "/v1/fennel/create_account/",
      decodeList: "/v1/whiteflag/decode_list/",
      encode: "/v1/whiteflag/encode/",
      getAddress: "/v1/fennel/get_address/",
    },
  },
};
