import { Button, Form, Input, Modal, Row, Typography } from "antd";
import { Location } from "../signals/SignalsList";
import { CoordinatesFormItem } from "../common/CoordinatesFormItem";
import { AimOutlined } from "@ant-design/icons";

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
    const { latitude, longitude } = splitCoordinates(values.coordinates);
    setLocation({ latitude, longitude });
    setOpen(false);
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
        onClick: () => onSubmit(form.getFieldsValue()),
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
        validateTrigger="onBlur"
      >
        <Form.Item
          label={"GPS (latitude, longitude)"}
          name={"coordinates"}
          rules={[
            { required: true, message: "Please input gps coordinates" },
            // {
            //   pattern:
            //     /^((([-+]?)([d]{1,2})(.)([d]*))|(([-+]?)([d]{1,2})([.]?)))(s*)(,)(s*)((([+-]?)([d]{1,2})(.)([d]*))|(([+-]?)([d]{1,3})([.]?)))$/g,
            //   message:
            //     "Coordinates format is wrong. Try entering latitude and longitude, separated by a comma",
            // },
            // {
            //   pattern:
            //     /^(([-+]?)([d]{1,2})(((.)([d]{5,}))(s*)(,)))(s*)(([-+]?)([d]{1,3})((.)([d]{5,})))$/g,
            //   message: "Add a minimal of 5 decimals.",
            // },
          ]}
        >
          <Input />
          <Row
            style={{ marginTop: "4px" }}
            onClick={() => setCurrentLocation()}
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

const splitCoordinates = (
  gpsCoordinates: string
): { latitude: number; longitude: number } => {
  const splitsedCoordinates = gpsCoordinates.split(",");
  return {
    latitude: Number.parseInt(splitsedCoordinates[0]),
    longitude: Number.parseInt(splitsedCoordinates[1]),
  };
};
