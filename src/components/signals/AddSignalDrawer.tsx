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
import { SIGNAL_TYPE, Signal } from "../../models/Signal";
import config from "../../config.json";
import { DefaultOptionType } from "antd/es/select";
import { splitCoordinates } from "../../helpers/CoordinatesHelper";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AimOutlined } from "@ant-design/icons";

interface AddSignalDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface FormProps {
  type: SIGNAL_TYPE;
  name: string;
  coordinates: string;
}

export const AddSignalDrawer: React.FC<AddSignalDrawerProps> = ({
  open,
  setOpen,
}) => {
  const {
    entities: signals,
    endpoints: signalsEndpoint,
    loading: isLoadingSignals,
    error: signalsError,
  } = useApi<Signal>(`${config.baseUrl}/signals`);

  const onSubmit = async () => {
    const values = addSchoolForm.getValues();
    const { latitude, longitude } = splitCoordinates(values.coordinates);
    const signal = new Signal(
      Math.random() * 100000,
      values.type,
      values.name,
      latitude,
      longitude
    );

    const res = await signalsEndpoint.post(signal);
    if (res) {
      message.success("Signal added");
      addSchoolForm.reset();
      setOpen(false);
    } else {
      message.error("Something went wrong ");
    }
  };

  const addSchoolFormSchema = useMemo(() => {
    return yup.object().shape({
      type: yup.string().required("Please provide type"),
      name: yup.string().required("Please provide name"),
      coordinates: yup.string().required("Please provide coordinates"),
    });
  }, []);

  const addSchoolForm = useForm<FormProps>({
    mode: "onBlur",
    shouldUnregister: false,
    defaultValues: { type: SIGNAL_TYPE.school },
    resolver: yupResolver(addSchoolFormSchema),
  });

  const setCoordinatesFieldValue = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      addSchoolForm.setValue("coordinates", `${latitude}, ${longitude}`);
    });
  };

  return (
    <Drawer
      title={"Add infrastructure"}
      width={"100%"}
      height={"90%"}
      open={open}
      placement={"bottom"}
      closable={true}
      onClose={() => setOpen(false)}
    >
      <Form>
        <Form.Item>
          <Typography.Title level={5}>Type</Typography.Title>
          <Controller
            name={"type"}
            control={addSchoolForm.control}
            render={({ field }) => (
              <Select
                {...field}
                options={Object.entries(SIGNAL_TYPE).map((signalType) => {
                  return {
                    value: signalType[0],
                    label: signalType[1],
                    key: signalType,
                  } as DefaultOptionType;
                })}
              />
            )}
          />
          {addSchoolForm.formState?.errors?.type && (
            <Typography.Text type={"danger"}>
              {addSchoolForm.formState.errors.type.message}
            </Typography.Text>
          )}
        </Form.Item>
        <Form.Item>
          <Typography.Title level={5}>Name</Typography.Title>
          <Controller
            name={"name"}
            control={addSchoolForm.control}
            render={({ field }) => <Input {...field} />}
          />
          {addSchoolForm.formState?.errors?.name && (
            <Typography.Text type={"danger"}>
              {addSchoolForm.formState.errors.name.message}
            </Typography.Text>
          )}
        </Form.Item>
        <Form.Item>
          <Typography.Title level={5}>Coordinates</Typography.Title>
          <Controller
            name={"coordinates"}
            control={addSchoolForm.control}
            render={({ field }) => <Input {...field} />}
          />
          {addSchoolForm.formState?.errors?.coordinates && (
            <Typography.Text type={"danger"}>
              {addSchoolForm.formState.errors.coordinates.message}
            </Typography.Text>
          )}
          <Row
            style={{ marginTop: "4px" }}
            onClick={() => setCoordinatesFieldValue()}
          >
            <AimOutlined />
            <Typography.Title
              level={5}
              style={{ marginTop: "0", margin: "0px", marginLeft: "4px" }}
            >
              Enter my current location
            </Typography.Title>
          </Row>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={() => onSubmit()}>
            Submit
          </Button>
          <Button
            type="default"
            htmlType="button"
            onClick={() => {
              addSchoolForm.reset();
              setOpen(false);
            }}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
