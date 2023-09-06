import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { Account } from "../../models/Account";
import config from "../../config.json";
import { Settings } from "../../utilities/Settings";
import { User } from "../../models/User";
import _ from "lodash";
import { RegisterResponse } from "../../models/RegisterResponse";

enum authModeEnum {
  singin = "SIGNIN",
  singup = "SIGNUP",
}

interface SignInForm {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface Address {
  address: string;
}

interface RegisterForm extends SignInForm {
  username: string;
}

interface Props {
  setToken: (token: string) => void;
  setAddress: (address: Address) => void;
}

export const Authenticate: React.FC<Props> = ({ setToken, setAddress }) => {
  const {
    endpoints: registrationEndpoint,
    loading: isLoadingRegistration,
    error: registrationError,
  } = useApi<RegisterResponse>({
    url: `${config.baseUrl}${Settings.endpoints.register}`,
    withToken: false,
  });

  const {
    endpoints: createBlockchainAccountEndpoint,
    loading: isLoadingCreateBlockchainAccoun,
    error: createBlockchainAccounError,
  } = useApi<boolean>({
    url: `${config.baseUrl}${Settings.endpoints.whiteflag.createAccount}`,
  });

  const {
    entity: token,
    endpoints: loginEndpoint,
    loading: isLoadingLogin,
    error: loginError,
  } = useApi<SignInForm, LoginResponse>({
    url: `${config.baseUrl}${Settings.endpoints.login}`,
    withToken: false,
  });

  const {
    endpoints: getAddressWhiteflagEndpoint,
    loading: isLoadingGetAddressWhiteflag,
    error: getAddressWhiteflagError,
  } = useApi<{}, { address: string }>({
    url: `${config.baseUrl}${Settings.endpoints.whiteflag.getAddress}`,
  });

  const [authMode, setAuthMode] = useState<authModeEnum>(authModeEnum.singin);

  const changeAuthMode = () => {
    setAuthMode(
      authMode === authModeEnum.singin
        ? authModeEnum.singup
        : authModeEnum.singin
    );
  };

  const fetchAndSetAddress = async (token: string) => {
    const address = await getAddressWhiteflagEndpoint.directPost(
      {},
      undefined,
      token
    );

    if (!_.isNil(address)) {
      setAddress(address);
    }
  };

  const register = async (values: RegisterForm) => {
    console.log("hi", values);

    const account = new Account(values.username, values.password, values.email);
    const createAccountResponse = await registrationEndpoint.directPost(
      account
    );

    if (createAccountResponse) {
      setToken(createAccountResponse.token);

      const createBlockchainAccount =
        await createBlockchainAccountEndpoint.directPost(
          {},
          undefined,
          createAccountResponse.token
        );
      if (createBlockchainAccount) {
        fetchAndSetAddress(createAccountResponse.token);
      }
    }
  };

  const signin = async (values: SignInForm) => {
    const res = await loginEndpoint.directPost(values);

    if (!_.isNil(res)) {
      setToken(res.token);
      fetchAndSetAddress(res.token);
    }
  };

  return (
    <React.Fragment>
      <div className="logo">
        <img
          style={{ minHeight: "auto", maxWidth: "80%" }}
          src="/logo180.png"
          alt="Whitflag Logo"
        />
      </div>

      {authMode === authModeEnum.singin ? (
        <Form
          name="signin"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={signin}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: "8px" }}
              size="large"
            >
              Submit
            </Button>
            <Button size="large" onClick={changeAuthMode}>
              Register
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form
          name="register"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={register}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please type your email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please type your email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please type your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              style={{ marginRight: "8px" }}
            >
              Submit
            </Button>
            <Button size="large" onClick={changeAuthMode}>
              Back to login
            </Button>
          </Form.Item>
        </Form>
      )}
    </React.Fragment>
  );
};
