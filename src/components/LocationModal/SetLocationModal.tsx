import { AimOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Input, Modal, Row, Space, Tooltip, Typography } from "antd";
import Card from "antd/es/card/Card";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { splitCoordinates } from "../../helpers/CoordinatesHelper";
import { Location } from "../signals/SignalsList";

const { Text, Title } = Typography;

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
  const [disabledModal, setDisabledModal] = useState<boolean>(true);

  const coordinateValidation = /^-?\d{1,3}\.\d{5,}$/;

  const coordinatesFormSchema = useMemo(() => {
    return yup.object().shape({
      coordinates: yup.string().required("Please provide coordinates")
      .test(
        'is-valid-coordinates',
        'At least 5 latitude decimal (-90 to 90) and 5 longitude decimal (-180 to 180) points',
        value => {
          const parts = value.split(',');
          if (parts.length === 2) {
            const lat = parseFloat(parts[0].trim());
            const lng = parseFloat(parts[1].trim());
            return coordinateValidation .test(parts[0].trim()) &&
                   coordinateValidation.test(parts[1].trim()) &&
                   lat >= -90 && lat <= 90 &&
                   lng >= -180 && lng <= 180;
          }
        })
    });
  }, []);

  const coordinatesForm = useForm<FormProps>({
    mode: "onBlur",
    shouldUnregister: false,
    resolver: yupResolver(coordinatesFormSchema),
  });

  const onSubmit = async (values: FormProps) => {
    const valid = await coordinatesForm.trigger();
    if (valid) {
      const { latitude, longitude } = splitCoordinates(values.coordinates);
      setLocation({
        latitude: Number.parseFloat(latitude),
        longitude: Number.parseFloat(longitude),
      });

      setOpen(false);
    }
  };

  const setCoordinatesFieldValue = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      coordinatesForm.setValue("coordinates", `${latitude}, ${longitude}`);
      setDisabledModal(false);

    // Trigger validation manually
    coordinatesForm.trigger("coordinates")
      .then((isValid) => setDisabledModal(!isValid));
    });
  };

  return (
    <Modal
      className="location-modal"
      open={open}
      style={{ width: "80%" }}
      okText={"Save and find nearby flags"}
      okButtonProps={{
        type: "primary",
        disabled: !coordinatesForm.formState.isValid,
        size: "large",
      }}
      onOk={() => {
        const coordinates = coordinatesForm.getValues();
        return onSubmit(coordinates);
      }}
      cancelButtonProps={{
        type: "default",
        size: "large",
      }}
      closable={false}
      onCancel={() => {
        if (location.latitude === 0 && location.longitude === 0) {
          setOpen(true);
        } else {
          setOpen(false);
        }
      }}
    >
      <div className="modal-title-wrapper">
        <h1>Find nearby flags by entering your reference location</h1>
        <Tooltip
          overlayClassName="modal-tooltip"
          placement="topRight"
          title={
            <Space direction="vertical">
              <Title>Search nearby signs</Title>
              <Text>
                You can look up signs by adding your reference location (GPS
                coordinates) to show all nearby signs
              </Text>
            </Space>
          }
        >
          <span className="tooltip-button">?</span>
        </Tooltip>
      </div>
      <Space className="modal-subtext">
        <Text>
          Enter your reference location with GPS (latitude, longitude)
        </Text>
      </Space>

      <Form>
        <Form.Item>
          <Controller
            name={"coordinates"}
            control={coordinatesForm.control}
            render={({ field }) => (
              <React.Fragment>
                <Input size="large" maxLength={30} {...field} />
                {coordinatesForm.formState?.errors?.coordinates && (
                  <Typography.Text type={"danger"}>
                    {coordinatesForm.formState.errors.coordinates.message}
                  </Typography.Text>
                )}
                <Row
                  style={{ marginTop: "4px" }}
                  onClick={() => setCoordinatesFieldValue()}
                >
                  <AimOutlined />
                  <Typography.Link
                    style={{ margin: "5px 0 5px 10px", marginLeft: "4px" }}
                  >
                    Enter my current location
                  </Typography.Link>
                </Row>
                <Card className="green-message">
                  <Space className="green-message-header">
                    <svg
                      className="green-checkmark"
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="24"
                      viewBox="0 0 22 24"
                      fill="none"
                    >
                      <path
                        d="M8.78218 17.8496L3.74731 12.2496L4.71383 11.1746L8.78218 15.6996L17.4134 6.09961L18.3799 7.17461L8.78218 17.8496Z"
                        fill="#006127"
                      />
                    </svg>
                    <Title>Your data is secure</Title>
                  </Space>
                  <Space>
                    <Text>
                      Your GPS coordinates are only used to find nearby flags
                      and will not be shared with anyone else.{" "}
                    </Text>
                  </Space>
                </Card>
              </React.Fragment>
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
