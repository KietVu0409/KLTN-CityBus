import React from "react";

import "./index.scss";

const StatusCard = (props) => {
  return (
    <div className="status-card">
      <div className="status-card__icon">
        <i className={props.icon}></i>
      </div>
      <div className="status-card__info">
        <span style={{ fontSize: 20, fontWeight: "bold" }}>{props.count}</span>
        <span style={{ fontSize: 16}}>{props.title}</span>
      </div>
    </div>
  );
};

export default StatusCard;
