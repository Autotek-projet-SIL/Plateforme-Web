import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./stylesheets/Alert.css";
// Alert personalisée
const alertStyle = {
  position: "relative",
  backgroundColor: "var(--mediumGreen)",
  color: "var(--white)",
  padding: "10px",
  borderRadius: "3px",
  gap: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0px 2px 2px 2px rgba(0, 0, 0, 0.03)",
  width: "50vw",
  boxSizing: "border-box",
  zIndex: "1600!important",
};

const buttonStyle = {
  marginLeft: "20px",
  border: "none",
  backgroundColor: "transparent",
  cursor: "pointer",
  color: "var(--white)",
};

const AlertTemplate = ({ message, options, style, close }) => {
  let theStyle = {
    backgroundColor:
      (options.type === "info" && "var(--lightGreen)") ||
      (options.type === "success" && "var(--mediumGreen)") ||
      (options.type === "error" && "var(--errorRed)"),
  };

  return (
    <div style={{ ...alertStyle, ...style, ...theStyle }}>
      {options.type === "info" && (
        <FontAwesomeIcon icon="fa-solid fa-circle-info " />
      )}
      {options.type === "success" && (
        <FontAwesomeIcon icon="fa-solid fa-circle-check " />
      )}
      {options.type === "error" && (
        <FontAwesomeIcon icon="fa-solid fa-circle-exclamation " />
      )}
      <span style={{ flex: 2 }}> {message}</span>
      <button onClick={close} style={buttonStyle}>
        <FontAwesomeIcon icon="fa-solid fa-xmark" />
      </button>
    </div>
  );
};
export default AlertTemplate;
