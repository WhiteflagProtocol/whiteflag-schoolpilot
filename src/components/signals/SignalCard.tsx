import React, { useContext } from "react";
import { Card, List, Row, Typography, Button } from "antd";
import WhiteFlagContext from "../../helpers/Context";
import { DecodedSignal } from "../../models/DecodedSignal";
import { InfrastructureSubjectCode } from "../../models/WhiteflagSignal";
import { SignalBodyText } from "../../models/SignalBodyText";
import { CompassOutlined, EnvironmentOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { formatCoordinate } from "../../helpers/CoordinatesHelper";

interface SignalCardProps {
  signal: DecodedSignal;
}

const SignalCard: React.FC<SignalCardProps> = ({signal}) => {
  const navigate = useNavigate();
  const ctx = useContext(WhiteFlagContext);
  const { latitude, longitude } = ctx.extractCoordinates(signal);
  const bearing = ctx.calculateBearing(signal);
  const subjectCodeIndex = Object.values(InfrastructureSubjectCode).indexOf(
    signal.signal_body.subjectCode
  );

  const texts = signal?.signal_body?.text
    ? (JSON.parse(signal.signal_body.text) as SignalBodyText)
    : undefined;

  return (
    <List.Item>
        <Card
        hoverable
        bordered={false}
        bodyStyle={{ padding: "16px" }}
        style={{
            marginLeft: "4px",
            marginRight: "4px",
        }}
        onClick={() => ctx.handleSignalSelect(signal)}
        >
        <Row>
            <Typography.Text
            type={"secondary"}
            style={{ color: "#FFFFFF", fontSize: "18px" }}
            >
            {Object.keys(InfrastructureSubjectCode)[subjectCodeIndex]}
            </Typography.Text>
        </Row>
        <Row>
            <Typography.Title
            level={1}
            style={{ fontWeight: "normal", marginTop: "0px" }}
            >
            {texts?.name}
            </Typography.Title>
        </Row>
        <Row style={{ display: "flex" }}>
            <CompassOutlined
            style={{
                paddingRight: "10px",
                height: "24px",
                width: "24px",
            }}
            />
            <div>
            <Row>
                <Typography.Text style={{ marginTop: "0px" }}>
                {bearing
                    ? `${ctx
                        .calculateDistanceToSignal(ctx.extractCoordinates(signal))
                        ?.toFixed(2)} km · ${bearing?.toFixed(
                        0
                    )}° ${ctx.getCompassDirection(bearing!)}`
                    : "Provide reference location"}
                </Typography.Text>
            </Row>
            <Row>
                <Typography.Text type={"secondary"} style={{ color: "#FFFFFF" }}>
                {`${latitude ? formatCoordinate("latitude", latitude) : 0}, 
                    ${longitude ? formatCoordinate("longitude", longitude) : 0}`}
                </Typography.Text>
            </Row>
            </div>
        </Row>
        <div style={{ paddingTop: "16px" }}>
            <Row>
            <Typography.Text type={"secondary"} style={{ color: "#FFFFFF" }}>
                Uploaded by
            </Typography.Text>
            </Row>
            <Row>
            <Typography.Text>{signal.sender.username}</Typography.Text>
            </Row>
        </div>
        <div style={{ paddingTop: "16px" }}>
            <Row>
            <Typography.Text type={"secondary"} style={{ color: "#FFFFFF" }}>
                Uploaded on
            </Typography.Text>
            </Row>
            <Row>
            <Typography.Text>
                {dayjs(signal?.timestamp).format("D MMMM YYYY, HH:mm")}
            </Typography.Text>
            </Row>
            <Row>
            <Typography.Text>{`by ${signal.sender_group}`}</Typography.Text>
            </Row>
        </div>
        <Row className="signal-card__button-row">
            <Button
            type="default"
            style={{
                display: "block",
                borderRadius: "16px",
                fontWeight: 500,
                marginTop: "15px",
                backgroundColor: "#FFFFFF00",
                borderColor: "#FFFFFF",
                color: "#FFFFFF",
                marginRight: "12px",
            }}
            onClick={() => {
                ctx.mapNavigationHandler(
                Number.parseFloat(latitude).toFixed(8),
                Number.parseFloat(longitude).toFixed(8)
                );
                ctx.activeSignalHandler(signal);
                navigate("/maps");
            }}
            >
            Show on map
            </Button>
            <Button
            type="default"
            style={{
                display: "block",
                borderRadius: "16px",
                fontWeight: 500,
                marginTop: "15px",
                backgroundColor: "#FFFFFF00",
                borderColor: "#FFFFFF",
                color: "#FFFFFF",
            }}
            icon={<EnvironmentOutlined />}
            href={`https://www.google.com/maps/dir/${ctx.location.latitude},${ctx.location.longitude}/${latitude},${longitude}`}
            target="_blank"
            >
            Show route
            </Button>
        </Row>
        </Card>
    </List.Item>
  );
}

export default SignalCard;
