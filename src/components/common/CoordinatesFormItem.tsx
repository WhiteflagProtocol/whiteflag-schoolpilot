import { Button, Form, Input, InputProps } from "antd";
import React, { memo } from "react";

export interface CoordinatesInputProps extends InputProps {
  required?: boolean;
}

export const CoordinatesFormItem: React.FC<CoordinatesInputProps> = (props) => {
  return (
    <Form.Item
      label={"GPS (latitude, longitude)"}
      name={"coordinates"}
      rules={[
        { required: props.required, message: "Please input gps coordinates" },
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
      <Input {...props} />
    </Form.Item>
  );
};
