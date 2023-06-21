import { AimOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Input, Modal, Row, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import { splitCoordinates } from "../../helpers/CoordinatesHelper";
import { Location } from "../signals/SignalsList";
import React, { useMemo } from "react";
import * as yup from "yup";

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
  // const [form] = Form.useForm<{ coordinates: string }>();
  const coordinatesFormSchema = useMemo(() => {
    return yup.object().shape({
      coordinates: yup
        .string()
        .required("Please provide valid coordinates")
        .matches(
          new RegExp(
            "^((([-+]?)([\\d]{1,2})(.)([\\d]*))|(([-+]?)([\\d]{1,2})([.]?)))(\\s*)(,)(\\s*)((([+-]?)([\\d]{1,2})(.)([\\d]*))|(([+-]?)([\\d]{1,3})([.]?)))$",
            "g"
          ),
          "Coordinates format is wrong. Try entering latitude and longitude, separated by a comma"
        )
        .matches(
          new RegExp(
            "^(([-+]?)([\\d]{1,2})(((.)([\\d]{5,}))(\\s*)(,)))(\\s*)(([-+]?)([\\d]{1,3})((.)([\\d]{5,})))$",
            "g"
          ),
          "Add a minimal of 5 decimals."
        ),
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
      setLocation({ latitude, longitude });
      setOpen(false);
    }
  };

  const setCoordinatesFieldValue = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      coordinatesForm.setValue("coordinates", `${latitude}, ${longitude}`);
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
        size: "large",
        onClick: () => {
          const coordinates = coordinatesForm.getValues();
          return onSubmit(coordinates);
        },
      }}
      cancelButtonProps={{
        type: "default",
        size: "large",
      }}
      closable={false}
      onCancel={() => setOpen(false)}
    >
      <Form>
        <Form.Item>
          <Typography.Title level={5}>
            GPS (latitude, longitude)
          </Typography.Title>
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
                    strong
                    style={{ marginTop: "0", margin: "0px", marginLeft: "4px" }}
                  >
                    Enter my current location
                  </Typography.Link>
                </Row>
              </React.Fragment>
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
