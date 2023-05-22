import { Button, Drawer, Form, Input, Select, message } from "antd";
import React from "react";
import { useApi } from "../../hooks/useApi";
import { SIGNAL_TYPE, Signal } from "../../models/Signal";
import config from "../../config.json";
import { DefaultOptionType } from "antd/es/select";
import { splitCoordinates } from "../../helpers/CoordinatesHelper";

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
  const [addSignalForm] = Form.useForm();

  const {
    entities: signals,
    endpoints: signalsEndpoint,
    loading: isLoadingSignals,
    error: signalsError,
  } = useApi<Signal>(`${config.baseUrl}/signals`);

  const onSubmit = async (values: FormProps) => {
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
      setOpen(false);
    } else {
      message.error("Something went wrong ");
    }
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
      <Form
        form={addSignalForm}
        name={"addSignalForm"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        layout="vertical"
        validateTrigger="onBlur"
        onFinish={onSubmit}
      >
        <Form.Item
          label={"Type"}
          name={"type"}
          rules={[{ required: true, message: "Please input a type" }]}
        >
          <Select
            defaultValue={SIGNAL_TYPE.school}
            options={Object.entries(SIGNAL_TYPE).map((signalType) => {
              return {
                value: signalType[1],
                label: signalType[1],
                key: signalType,
              } as DefaultOptionType;
            })}
          />
        </Form.Item>
        <Form.Item
          label={"Name"}
          name={"name"}
          rules={[{ required: true, message: "Please input a name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Coordinates"}
          name={"coordinates"}
          rules={[{ required: true, message: "Please input coordinates" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button
            type="default"
            htmlType="button"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
