import { Button, Form, Input } from "antd";
import React from "react";
import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { Account } from "../../models/Account";

enum authModeEnum {
  singin = "SIGNIN",
  singup = "SIGNUP",
}

interface SignInForm {
  email: string;
  password: string;
}

interface Token {
  token: string;
}

interface RegisterForm extends SignInForm {
  username: string;
}

interface Props {
  setToken: (token: string) => void;
}

// https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
export const Authenticate: React.FC<Props> = ({ setToken }) => {
  const {
    entities: accounts,
    endpoints: accountsEndpoint,
    loading: isLoadingAccounts,
    error: accountsError,
  } = useApi<Account>("http://localhost:5001/accounts");

  const {
    entity: token,
    endpoints: loginEndpoint,
    loading: isLoadingLogin,
    error: loginError,
  } = useApi<SignInForm, Token>("http://localhost:5001/login");

  const [authMode, setAuthMode] = useState<authModeEnum>(authModeEnum.singin);
  //   const [username, setUserName] = useState();
  //   const [password, setPassword] = useState();

  const changeAuthMode = () => {
    setAuthMode(
      authMode === authModeEnum.singin
        ? authModeEnum.singup
        : authModeEnum.singin
    );
  };

  const register = (values: RegisterForm) => {
    const account = new Account(values.username, values.password, values.email);
    accountsEndpoint.post(account);
  };

  const signin = async (values: SignInForm) => {
    const success = await loginEndpoint.post(values);
    if (success) {
      setToken(token!.token);
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
            label="email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: "8px" }}
            >
              Submit
            </Button>
            <Button onClick={changeAuthMode}>Register</Button>
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
            label="username"
            name="username"
            rules={[{ required: true, message: "Please type your email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="email"
            name="email"
            rules={[{ required: true, message: "Please type your email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="password"
            name="password"
            rules={[{ required: true, message: "Please type your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: "8px" }}
            >
              Submit
            </Button>
            <Button onClick={changeAuthMode}>Back to login</Button>
          </Form.Item>
        </Form>
      )}
    </React.Fragment>
  );
};
