import { AimOutlined } from "@ant-design/icons";
import { Form, FormInstance, FormProps, Input, Row, Typography } from "antd";
import React, { memo, useState } from "react";

export interface CoordinatesInputProps {
  required?: boolean;
  form: FormInstance<any>;
}

export const CoordinatesFormItem: React.FC<CoordinatesInputProps> = (props) => {
  return null;
  //     <React.Fragment>
  //       {/* <Input
  //         // value={props.form.getFieldValue("coordinates")}
  //         onChange={(e) =>
  //           props.form.setFieldsValue({ coordinates: e.target.value })
  //         }
  //       />
  //       <Row style={{ marginTop: "4px" }} onClick={() => setCurrentLocation()}>
  //         <AimOutlined />
  //         <Typography.Title
  //           level={5}
  //           style={{ marginTop: "0", marginLeft: "4px" }}
  //         >
  //           Enter my current location
  //         </Typography.Title>
  //       </Row> */}
  //     </React.Fragment>
};
