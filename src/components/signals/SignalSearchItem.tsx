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

interface SignalSearchItemProps {
  signal: DecodedSignal;
}

const SignalSearchItem = ({ signal }: SignalSearchItemProps) => {
  const navigate = useNavigate();
  const ctx = useContext(WhiteFlagContext);
  const { latitude, longitude } = ctx.extractCoordinates(signal);
  const distance = ctx.calculateDistanceToSignal(
    ctx.extractCoordinates(signal)
  );
  const subjectCodeIndex = Object.values(InfrastructureSubjectCode).indexOf(
    signal.signal_body.subjectCode
  );

  const texts = signal?.signal_body?.text
    ? (JSON.parse(signal.signal_body.text) as SignalBodyText)
    : undefined;

  return (
    <List.Item>
      <div className="signal__search-list-item">{texts.name}</div>
      {distance ? `${distance.toFixed(2)} km ` : "Provide a reference location"}
    </List.Item>
  );
};

export default SignalSearchItem;
