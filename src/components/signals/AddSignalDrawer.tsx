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
import { useApiResponse } from "../../hooks/useApi";

interface AddSignalDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  signalsEndpoint: {
    getAll(): void;
    post(entity: Signal, id?: string | undefined): Promise<boolean>;
  };
}

interface FormProps {
  type: SIGNAL_TYPE;
  name: string;
  coordinates: string;
}

export const AddSignalDrawer: React.FC<AddSignalDrawerProps> = ({
  open,
  setOpen,
  signalsEndpoint,
}) => {
  const onSubmit = async () => {
    const valid = await addSchoolForm.trigger();
    if (valid) {
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
        await signalsEndpoint.getAll();
        setOpen(false);
      } else {
        message.error("Something went wrong ");
      }
    }
  };

  const addSchoolFormSchema = useMemo(() => {
    return yup.object().shape({
      type: yup.string().required("Please provide type"),
      name: yup.string().optional(),
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
      height={"100%"}
      open={open}
      placement={"bottom"}
      closable={true}
      onClose={() => {
        addSchoolForm.reset();
        setOpen(false);
      }}
      destroyOnClose
    >
      <Form>
        <Form.Item>
          <Typography.Text type={"secondary"}>Type</Typography.Text>
          <Controller
            name={"type"}
            control={addSchoolForm.control}
            render={({ field }) => (
              <Select
                size="large"
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
          <Typography.Text type={"secondary"}>
            Coordinates (latitude, longitude)
          </Typography.Text>
          <Controller
            name={"coordinates"}
            control={addSchoolForm.control}
            render={({ field }) => (
              <Input size="large" maxLength={30} {...field} pattern="\d*" />
            )}
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
          <Typography.Text type={"secondary"}>Name (optional)</Typography.Text>
          <Controller
            name={"name"}
            control={addSchoolForm.control}
            render={({ field }) => (
              <Input size="large" maxLength={120} {...field} />
            )}
          />
          {addSchoolForm.formState?.errors?.name && (
            <Typography.Text type={"danger"}>
              {addSchoolForm.formState.errors.name.message}
            </Typography.Text>
          )}
        </Form.Item>

        <Form.Item>
          <Button size="large" type="primary" onClick={onSubmit}>
            Add
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
