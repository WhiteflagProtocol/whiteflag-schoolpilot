import { Button, Form, Input, Modal } from "antd";
import { Location } from "../signals/SignalsList";

interface Props {
  location: Location;
  setLocation: (location: Location) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface FormProps {
  gpsCoordinates: string;
}

export const SetLocationModal: React.FC<Props> = ({
  location,
  setLocation,
  open,
  setOpen,
}) => {
  const onSubmit = (values: FormProps) => {
    const { latitude, longitude } = splitCoordinates(values.gpsCoordinates);
    setLocation({ latitude, longitude });
    setOpen(false);
  };

  return (
    <Modal open={open} style={{ width: "80%" }}>
      <Form
        name="setLocationForm"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onSubmit}
      >
        <Form.Item
          label="GPS coordinates"
          name="gpsCoordinates"
          rules={[
            { required: true, message: "Please input your GPS coordinates!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
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
