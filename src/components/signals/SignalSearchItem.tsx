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
import { CompassIcon } from "../../icons/Icons";

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
      <div
        className="signal__search-list-item"
        onClick={() => ctx.activeSignalHandler(signal)}
      >
        <div className="signal__search-list-item__icon-container"></div>
        <div className="signal__search-list-item__information">
          <div className="signal__search-list-item__title">{texts.name}</div>
          <div className="signal__search-list-item__location">
            <CompassIcon />
            {distance
              ? `${distance.toFixed(2)} km `
              : "Provide a reference location"}
            {` - ${latitude ? formatCoordinate("latitude", latitude) : 0}, 
            ${longitude ? formatCoordinate("longitude", longitude) : 0}`}
          </div>
        </div>
      </div>
    </List.Item>
  );
};

export default SignalSearchItem;
