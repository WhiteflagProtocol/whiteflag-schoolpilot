import { AimOutlined } from "@ant-design/icons";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
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
import { DefaultOptionType } from "antd/es/select";
import dayjs from "dayjs";
import _ from "lodash";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import config from "../../config.json";
import {
  checkCoordinatesFormat,
  splitCoordinates,
} from "../../helpers/CoordinatesHelper";
import { useApi } from "../../hooks/useApi";
import { SignalBodyText } from "../../models/SignalBodyText";
import {
  EncryptionIndicator,
  InfrastructureSubjectCode,
  MessageCode,
  ReferenceIndicator,
  WhiteflagSignal,
} from "../../models/WhiteflagSignal";
import { WhiteflagSignalWithAnnotations } from "../../models/WhiteflagSignalWithAnnotations";
import { Settings } from "../../utilities/Settings";

interface AddSignalDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  signalsEndpoint?: {
    getAll(): void;
    post(entity: WhiteflagSignal, id?: string | undefined): Promise<boolean>;
  };
}

interface FormProps {
  signal_body: WhiteflagSignal;
  annotations: SignalBodyText;
  coordinates: string;
  recipient_group: string;
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

  const {
    endpoints: sendSignalEndpoint,
    loading: isLoadingSendingSignals,
    error: sendSignalsError,
  } = useApi<{ signal: string }>({
    url: `${config.baseUrl}${Settings.endpoints.whiteflag.signals.encodeAndSend}`,
  });

  const {
    endpoints: signalWithAnnotationsEndpoint,
    loading: isLoadingSignalWithAnnotations,
    error: signalWithAnnotationsError,
  } = useApi<WhiteflagSignal[]>({
    url: `${config.baseUrl}${Settings.endpoints.whiteflag.signals.sendWithAnnotations}`,
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
        values.signal_body.messageCode,
        ReferenceIndicator.Discontinue,
        "0000000000000000000000000000000000000000000000000000000000000000",
        values.signal_body.subjectCode,
        `${dayjs().format("YYYY-MM-DDThh:mm:ss").toString()}Z`,
        "P00D00H00M",
        "22",
        newLatitude,
        newLongitude,
        "0000",
        "0000",
        "000"
      );

      var annotations = {};
      if (values.annotations?.name) {
        annotations = { ...annotations, name: values.annotations?.name };
      }

      if (values.annotations?.text) {
        annotations = { ...annotations, text: values.annotations?.text };
      }

      const signalWithAnnotations = new WhiteflagSignalWithAnnotations(
        signal,
        annotations,
        values.recipient_group
      );

      if (_.isEmpty(annotations)) {
        const res = await sendSignalEndpoint.directPost({
          signal_body: signal,
          recipient_group: values.recipient_group,
        });
        if (res) {
          message.success("Signal added");
          signalForm.reset();
          if (signalsEndpoint) {
            await signalsEndpoint.getAll();
          }
          setOpen(false);
        } else {
          if (navigator.onLine) {
            message.error("Something went wrong");
          } else {
            message.error(
              "You're currently not online, signal is uploaded next time you login and you're back online"
            );
            setOpen(false);
          }
        }
      } else {
        const res = await signalWithAnnotationsEndpoint.directPost(
          signalWithAnnotations
        );
        if (res) {
          message.success("Signal added");
          signalForm.reset();
          await signalsEndpoint.getAll();
          setOpen(false);
        } else {
          if (navigator.onLine) {
            message.error("Something went wrong");
          } else {
            message.error(
              "You're currently not online, signal is uploaded next time you login and you're back online"
            );
            setOpen(false);
          }
        }
      }
    }
  };

  const signalSchema = useMemo(() => {
    return yup.object().shape({
      coordinates: yup.string().required("Please provide coordinates"),
      signal_body: yup.object().shape({
        messageCode: yup.string().required("Please provide type"),
      }),
      recipient_group: yup.string().optional(),
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
      signalForm.setValue(
        "signal_body.objectLatitude",
        `${latitude.toFixed(5)}`
      );
      signalForm.setValue(
        "signal_body.objectLongitude",
        `${longitude.toFixed(5)}`
      );
      signalForm.setValue(
        "coordinates",
        `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
      );
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
          <Typography.Text type={"secondary"}>Name (optional)</Typography.Text>
          <Controller
            name={"annotations.name"}
            control={signalForm.control}
            render={({ field }) => (
              <Input
                size="large"
                maxLength={40}
                showCount
                disabled={
                  isLoadingEncoding ||
                  isLoadingSendingSignals ||
                  isLoadingSignalWithAnnotations
                }
                {...field}
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
        </Form.Item>
        <Form.Item>
          <Typography.Text type={"secondary"}>Message type</Typography.Text>
          <Controller
            name={"signal_body.messageCode"}
            control={signalForm.control}
            render={({ field }) => (
              <Select
                size="large"
                disabled={
                  isLoadingEncoding ||
                  isLoadingSendingSignals ||
                  isLoadingSignalWithAnnotations
                }
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
          {signalForm.formState?.errors?.signal_body?.messageCode && (
            <Typography.Text type={"danger"}>
              {signalForm.formState.errors.signal_body?.messageCode?.message}
            </Typography.Text>
          )}
        </Form.Item>
        <Form.Item>
          <Typography.Text type={"secondary"}>Type</Typography.Text>
          <Controller
            name={"signal_body.subjectCode"}
            control={signalForm.control}
            render={({ field }) => (
              <Select
                size="large"
                disabled={
                  isLoadingEncoding ||
                  isLoadingSendingSignals ||
                  isLoadingSignalWithAnnotations
                }
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
              <Input
                {...field}
                size="large"
                maxLength={30}
                pattern="\d*"
                disabled={
                  isLoadingEncoding ||
                  isLoadingSendingSignals ||
                  isLoadingSignalWithAnnotations
                }
              />
            )}
          />
          {signalForm.formState?.errors?.coordinates && (
            <Typography.Text type={"danger"}>
              {signalForm.formState.errors.coordinates.message}
            </Typography.Text>
          )}
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
        <Form.Item>
          <Typography.Text type={"secondary"}>
            Additional information (optional)
          </Typography.Text>
          <Controller
            name={"annotations.text"}
            control={signalForm.control}
            render={({ field }) => (
              <Input.TextArea
                size="large"
                autoSize={{ minRows: 2, maxRows: 5 }}
                maxLength={40}
                showCount
                disabled={
                  isLoadingEncoding ||
                  isLoadingSendingSignals ||
                  isLoadingSignalWithAnnotations
                }
                {...field}
              />
            )}
          />
        </Form.Item>{" "}
        <Form.Item>
          <Typography.Text type={"secondary"}>Group (optional)</Typography.Text>
          <Controller
            name={"recipient_group"}
            control={signalForm.control}
            render={({ field }) => (
              <Input size="large" maxLength={120} {...field} />
            )}
          />
          {signalForm.formState?.errors?.recipient_group && (
            <Typography.Text type={"danger"}>
              {signalForm.formState.errors.recipient_group.message}
            </Typography.Text>
          )}
        </Form.Item>
        <Form.Item>
          <Button
            size="large"
            type="primary"
            onClick={onSubmit}
            style={{ height: "auto ", width: "100%" }}
            disabled={
              isLoadingEncoding ||
              isLoadingSendingSignals ||
              isLoadingSignalWithAnnotations
            }
            loading={
              isLoadingEncoding ||
              isLoadingSendingSignals ||
              isLoadingSignalWithAnnotations
            }
          >
            Add
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
