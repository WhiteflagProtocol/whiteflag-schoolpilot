import { Button, Form, Input, Space, Typography } from "antd";
import _ from "lodash";
import React, { useState } from "react";
import config from "../../config.json";
import { useApi } from "../../hooks/useApi";
import { Account } from "../../models/Account";
import { RegisterResponse } from "../../models/RegisterResponse";
import { User } from "../../models/User";
import { Settings } from "../../utilities/Settings";

const { Text, Link } = Typography;

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
    <div
      className="login-wrapper"
      style={{ backgroundColor: "#090A0B", minHeight: "calc(100vh - 40px)" }}
    >
      <div className="logo">
        <img
          style={{
            minHeight: "auto",
            maxWidth: "80%",
            width: "82px",
            height: "70px",
          }}
          src="assets/wf-logo.png"
          alt="Whitflag Logo"
        />
      </div>
      {authMode === authModeEnum.singin ? (
        <React.Fragment>
          <Form
            name="signin"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            requiredMark={"optional"}
            style={{
              maxWidth: 600,
              backgroundColor: "#353941",
              padding: "40px 16px 2px",
              borderRadius: "16px",
            }}
            onFinish={signin}
          >
            <legend>Login</legend>
            <Form.Item
              label="Username or e-mail *"
              name="username"
              hasFeedback
              rules={[
                { required: true, message: "Please input your username" },
              ]}
            >
              <Input style={{ borderRadius: "8px", height: "50px" }} />
            </Form.Item>
            <Form.Item
              label="Password *"
              name="password"
              hasFeedback
              rules={[
                { required: true, message: "Please input your password" },
              ]}
            >
              <Input.Password style={{ borderRadius: "8px", height: "50px" }} />
            </Form.Item>
            <Form.Item>
              <Button
                type="default"
                htmlType="submit"
                style={{
                  borderRadius: "16px",
                  fontWeight: 700,
                  marginTop: "15px",
                }}
                block
              >
                Login
              </Button>
            </Form.Item>
          </Form>
          <Space
            direction="vertical"
            align="start"
            style={{
              width: "100%",
              justifyContent: "start",
              padding: "20px 0 50px",
            }}
          >
            <Link style={{ textAlign: "left" }}>Forgot password?</Link>
          </Space>
          <Space direction="vertical">
            <Text>Don't have an account?</Text>
            <Link underline onClick={changeAuthMode}>
              Create Account
            </Link>
          </Space>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Form
            name="register"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            requiredMark={"optional"}
            style={{
              maxWidth: 600,
              backgroundColor: "#353941",
              padding: "40px 16px 2px",
              borderRadius: "16px",
            }}
            onFinish={register}
          >
            <legend>Create Account</legend>
            <Form.Item
              label="Name"
              name="username"
              hasFeedback
              rules={[{ required: true, message: "Please type your email!" }]}
            >
              <Input style={{ borderRadius: "8px", height: "50px" }} />
            </Form.Item>
            <Form.Item
              label="E-mail *"
              name="email"
              hasFeedback
              rules={[{ required: true, message: "Please type your email!" }]}
            >
              <Input style={{ borderRadius: "8px", height: "50px" }} />
            </Form.Item>
            <Form.Item
              label="Password *"
              name="password"
              hasFeedback
              rules={[
                { required: true, message: "Please type your password!" },
              ]}
            >
              <Input.Password style={{ borderRadius: "8px", height: "50px" }} />
            </Form.Item>
            <Form.Item>
              <Button
                type="default"
                htmlType="submit"
                style={{
                  borderRadius: "16px",
                  fontWeight: 700,
                  marginTop: "15px",
                }}
                block
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>
          <Space
            direction="vertical"
            style={{
              padding: "50px 0 50px",
            }}
          >
            <Text>Already have an account?</Text>
            <Link underline onClick={changeAuthMode}>
              Login
            </Link>
          </Space>
        </React.Fragment>
      )}
    </div>
  );
};
