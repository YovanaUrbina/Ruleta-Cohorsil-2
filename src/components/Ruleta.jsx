import React from "react";
import ruleta from "../img/Ruleta2.png";
import Flecha from "../img/flechadorada.png";

import "./index.css";

// Guia para futuras calibraciones de la ruleta:
// Imagen base de referencia de colores: src/img/colores-base.png
// Uso esperado:
// 1. Comparar el orden visual de segmentos de la imagen nueva contra colores-base.png.
// 2. Ajustar el arreglo SEGMENTOS en src/components/index.jsx segun ese orden.
// 3. Si la imagen arranca con otro color arriba, recalibrar OFFSET_INICIAL_NARANJA
//    en src/components/index.jsx o crear un nuevo offset para la nueva imagen.
const Ruleta = (props) => (
  <div className="ruleta-shell" disabled={props.animatedRuleta}>
    <div className="flecha-wrap" style={{ display: "flex", justifyContent: "center" }}>
      <img src={Flecha} alt="Ruleta" className="flecha-ruleta" />
    </div>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <img
        id="img-ruleta"
        src={ruleta}
        style={{
          transform: "rotate(" + props.data_ruleta + "deg)",
          WebkitTransform: "rotate(" + props.data_ruleta + "deg)",
        }}
        alt="Ruleta"
        onTransitionEnd={props.showRuletaResult}
        className="img-responsive img-ruleta"
        ref={props.ruleta}
      />
    </div>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <button
        id="btnAnimar"
        disabled={props.animatedRuleta}
        onClick={props.animarEvent}
        className="btn btn-warning btn-orange btn-lg ruleta-btn"
        style={{ fontSize: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        GIRA LA RULETA!
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </div>
);

export default Ruleta;
