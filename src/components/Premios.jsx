import React from "react";
import "./index.css";

// Tarjeta simple para renderizar cada premio disponible.
const Premios = (props) => (
  <div className="premio-container">
    <p className="premio-texto">{props.data.premio}</p>
  </div>
);

export default Premios;
