import {
  Button,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Typography,
  message,
} from "antd";
import React, { useMemo } from "react";
import { useApi } from "../../hooks/useApi";
import config from "../../config.json";
import { DefaultOptionType } from "antd/es/select";
import {
  checkCoordinatesFormat,
  splitCoordinates,
} from "../../helpers/CoordinatesHelper";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AimOutlined } from "@ant-design/icons";
import { useApiResponse } from "../../hooks/useApi";
import { Settings } from "../../utilities/Settings";
import {
  EncryptionIndicator,
  InfrastructureSubjectCode,
  MessageCode,
  ReferenceIndicator,
  WhiteflagSignal,
} from "../../models/WhiteflagSignal";
import { ErrorMessage } from "@hookform/error-message";
import dayjs from "dayjs";

interface AddSignalDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  signalsEndpoint: {
    getAll(): void;
    post(entity: WhiteflagSignal, id?: string | undefined): Promise<boolean>;
  };
}

interface FormProps extends WhiteflagSignal {
  coordinates: string;
}

export const AddSignalDrawer: React.FC<AddSignalDrawerProps> = ({
  open,
  setOpen,
  signalsEndpoint,
}) => {
  const {
    endpoints: encodeEndpoint,
    loading: isLoadingEncoding,
    error: encodeError,
  } = useApi<WhiteflagSignal, string>({
    url: `${config.baseUrl}${Settings.endpoints.whiteflag.encode}`,
  });

  const onSubmit = async () => {
    const valid = await signalForm.trigger();
    if (valid) {
      const values = signalForm.getValues();
      const { latitude, longitude } = splitCoordinates(values.coordinates);
      const { latitude: newLatitude, longitude: newLongitude } =
        checkCoordinatesFormat(latitude, longitude);
      const signal = new WhiteflagSignal(
        EncryptionIndicator.noEncryption,
        "0",
        values.messageCode,
        ReferenceIndicator.Discontinue,
        "0000000000000000000000000000000000000000000000000000000000000000",
        values.subjectCode,
        `${dayjs().format("YYYY-MM-DDThh:mm:ss").toString()}Z`,
        "P00D00H00M",
        "22",
        newLatitude,
        newLongitude,
        "0",
        "0",
        "0"
      );

      const encoded = await encodeEndpoint.directPost(signal);
      console.log(encoded);

      // const res = await signalsEndpoint.post(values);
      // if (res) {
      //   message.success("Signal added");
      //   signalForm.reset();
      //   await signalsEndpoint.getAll();
      //   setOpen(false);
      // } else {
      //   message.error("Something went wrong ");
      // }
    }
  };

  const signalSchema = useMemo(() => {
    return yup.object().shape({
      messageCode: yup.string().required("Please provide type"),
      name: yup.string().optional(),
      coordinates: yup.string().required("Please provide coordinates"),
    });
  }, []);

  const signalForm = useForm<FormProps>({
    mode: "onBlur",
    shouldUnregister: false,
    // defaultValues: new WhiteflagSignal(),
    resolver: yupResolver(signalSchema),
  });

  const setCoordinatesFieldValue = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      signalForm.setValue("objectLatitude", `${latitude}`);
      signalForm.setValue("objectLongitude", `${longitude}`);
      signalForm.setValue("coordinates", `${latitude}, ${longitude}`);
    });
  };

  return (
    <Drawer
      title={"Add infrastructure"}
      width={"100%"}
      height={"100%"}
      open={open}
      placement={"bottom"}
      closable={true}
      onClose={() => {
        signalForm.reset();
        setOpen(false);
      }}
      destroyOnClose
    >
      <Form>
        <Form.Item>
          <Typography.Text type={"secondary"}>Message type</Typography.Text>
          <Controller
            name={"messageCode"}
            control={signalForm.control}
            render={({ field }) => (
              <Select
                size="large"
                {...field}
                options={Object.entries(MessageCode).map((messageCode) => {
                  return {
                    value: messageCode[1],
                    label: messageCode[0],
                    key: messageCode,
                  } as DefaultOptionType;
                })}
              />
            )}
          />
          <ErrorMessage
            errors={signalForm?.formState?.errors}
            name="messageCode"
            render={({ messages }) =>
              messages &&
              Object.entries(messages).map(([type, message]) => (
                <p key={type}>{message}</p>
              ))
            }
          />
          {/* {signalForm.formState?.errors?.messageCode && (
            <Typography.Text type={"danger"}>
              {signalForm.formState.errors.type.message}
            </Typography.Text>
          )} */}
        </Form.Item>

        <Form.Item>
          <Typography.Text type={"secondary"}>Type</Typography.Text>
          <Controller
            name={"subjectCode"}
            control={signalForm.control}
            render={({ field }) => (
              <Select
                size="large"
                {...field}
                options={Object.entries(InfrastructureSubjectCode).map(
                  (signalType) => {
                    return {
                      value: signalType[1],
                      label: signalType[0],
                      key: signalType,
                    } as DefaultOptionType;
                  }
                )}
              />
            )}
          />
          <ErrorMessage
            errors={signalForm?.formState?.errors}
            name="subjectCode"
            render={({ messages }) =>
              messages &&
              Object.entries(messages).map(([type, message]) => (
                <p key={type}>{message}</p>
              ))
            }
          />
          {/* {signalForm.formState?.errors?.messageCode && (
            <Typography.Text type={"danger"}>
              {signalForm.formState.errors.type.message}
            </Typography.Text>
          )} */}
        </Form.Item>
        <Form.Item>
          <Typography.Text type={"secondary"}>
            Coordinates (latitude, longitude)
          </Typography.Text>
          <Controller
            name={"coordinates"}
            control={signalForm.control}
            render={({ field }) => (
              <Input {...field} size="large" maxLength={30} pattern="\d*" />
            )}
          />
          {/* {signalForm.formState?.errors?.coordinates && (
            <Typography.Text type={"danger"}>
              {signalForm.formState.errors.coordinates.message}
            </Typography.Text>
          )} */}
          <Row
            style={{ marginTop: "4px" }}
            onClick={() => setCoordinatesFieldValue()}
          >
            <AimOutlined />
            <Typography.Link
              strong
              style={{ marginTop: "0", margin: "0px", marginLeft: "4px" }}
            >
              Enter my current location
            </Typography.Link>
          </Row>
        </Form.Item>
        {/* <Form.Item>
          <Typography.Text type={"secondary"}>Name (optional)</Typography.Text>
          <Controller
            name={"name"}
            control={signalForm.control}
            render={({ field }) => (
              <Input size="large" maxLength={120} {...field} />
            )}
          />
          {signalForm.formState?.errors?.name && (
            <Typography.Text type={"danger"}>
              {signalForm.formState.errors.name.message}
            </Typography.Text>
          )}
        </Form.Item> */}

        <Form.Item>
          <Button size="large" type="primary" onClick={onSubmit}>
            Add
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
