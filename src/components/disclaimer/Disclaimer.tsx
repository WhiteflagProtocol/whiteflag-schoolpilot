import React, { createRef, useRef } from "react";
import { Carousel, Button, Space, Typography } from "antd";

const { Text, Title, Link } = Typography;

const Disclaimer = () => {
  const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  const carouselRef: any = React.useRef();

  return (
    <React.Fragment>
      <Space direction="vertical" style={{position:"absolute", display:"block", width:"100%", padding: "0 15px", textAlign: "end"}}>
        <Link underline style={{maxWidth:"500px", width:"100%", margin:"auto"}} >Skip</Link>
      </Space>
      <Carousel className="disclaimer"
        effect="fade"
        ref={carouselRef}
        dots={true}
        style={{maxWidth:"500px", minHeight: "calc(100vh - 116px", padding: "70px 15px 0",margin:"auto" }}
      >
        <div>
          <Space direction="vertical" align="start">
            <Title>
              Search for nearby signs in the areas you want
            </Title>
          </Space>
          <Button
            type="default"
            htmlType="submit"
            style={{ borderRadius: "16px", fontWeight: 700, marginTop: "15px" }}
            block
            onClick={() => {
              carouselRef.current.next();
            }}
          >
            I understand, next
          </Button>
        </div>
        <div>
          <Space direction="vertical" align="start">
            <Title>
              Trustworthy and safety: Be aware of every sign that you upload
              within the app
            </Title>
            <Text>
              More information regarding trustworthy and safety can be found in
              your profile
            </Text>
          </Space>
          <Button
            type="default"
            htmlType="submit"
            style={{ borderRadius: "16px", fontWeight: 700, marginTop: "15px" }}
            block
            onClick={() => {
              carouselRef.current.next();
            }}
          >
            I understand, next
          </Button>
        </div>
      </Carousel>
    </React.Fragment>
  );
};
export default Disclaimer;
