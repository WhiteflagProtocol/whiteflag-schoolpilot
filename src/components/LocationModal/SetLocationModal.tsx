import { Button, Form, Input, Modal, Row, Typography } from "antd";
import { Location } from "../signals/SignalsList";
import { CoordinatesFormItem } from "../common/CoordinatesFormItem";
import { AimOutlined } from "@ant-design/icons";
import { splitCoordinates } from "../../helpers/CoordinatesHelper";
import { useEffect } from "react";

interface Props {
  location: Location;
  setLocation: (location: Location) => void;
  setCurrentLocation: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface FormProps {
  coordinates: string;
}

export const SetLocationModal: React.FC<Props> = ({
  location,
  setLocation,
  setCurrentLocation,
  open,
  setOpen,
}) => {
  const [form] = Form.useForm();

  const onSubmit = (values: FormProps) => {
    console.log(values);

    const { latitude, longitude } = splitCoordinates(values.coordinates);
    setLocation({ latitude, longitude });
    setOpen(false);
  };

  const setCoordinatesFieldValue = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      form.setFieldsValue({ coordinates: `${latitude}, ${longitude}` });
    });
  };

  return (
    <Modal
      title={"Where do you want to find infrastructure?"}
      open={open}
      style={{ width: "80%" }}
      okText={"Save"}
      okButtonProps={{
        type: "primary",
        htmlType: "submit",
        onClick: () => {
          const coordinates = form.getFieldsValue();
          return onSubmit(coordinates);
        },
      }}
      cancelButtonProps={{
        type: "default",
      }}
      closable={false}
      onCancel={() => setOpen(false)}
    >
      <Form
        form={form}
        name="setLocationForm"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        layout="vertical"
        validateTrigger="onChange"
        onFinish={onSubmit}
      >
        <Form.Item
          required={true}
          label={"GPS (latitude, longitude)"}
          name="coordinates"
          rules={[
            {
              required: true,
              message: "Please input gps coordinates",
            },
            // {
            //   type: "regexp",
            //   pattern: new RegExp(
            //     "^((([-+]?)([d]{1,2})(.)([d]*))|(([-+]?)([d]{1,2})([.]?)))(s*)(,)(s*)((([+-]?)([d]{1,2})(.)([d]*))|(([+-]?)([d]{1,3})([.]?)))$",
            //     "g"
            //   ),
            //   message:
            //     "Coordinates format is wrong. Try entering latitude and longitude, separated by a comma",
            // },
            // {
            //   type: "regexp",
            //   pattern: new RegExp(
            //     "^(([-+]?)([d]{1,2})(((.)([d]{5,}))(s*)(,)))(s*)(([-+]?)([d]{1,3})((.)([d]{5,})))$",
            //     "g"
            //   ),
            //   message: "Add a minimal of 5 decimals.",
            // },
          ]}
        >
          <Input
            value={form.getFieldValue("coordinates")}
            onChange={(e) => form.setFieldValue("coordinates", e.target.value)}
          />
          <Row
            style={{ marginTop: "4px" }}
            onClick={() => setCoordinatesFieldValue()}
          >
            <AimOutlined />
            <Typography.Title
              level={5}
              style={{ marginTop: "0", marginLeft: "4px" }}
            >
              Enter my current location
            </Typography.Title>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};
