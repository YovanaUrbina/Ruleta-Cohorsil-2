import React from "react";
import ruleta from "../img/ruleta2026.png";
import Flecha from "../img/flechadorada.png";

import "./index.css";

// Guia para futuras calibraciones de la ruleta:
// Imagen base de referencia de colores: src/img/colores-base.png
// Uso esperado:
// 1. Comparar el orden visual de segmentos de la imagen nueva contra colores-base.png.
// 2. Ajustar el arreglo SEGMENTOS en src/components/index.jsx segun ese orden.
// 3. Si la imagen arranca con otro color arriba, recalibrar OFFSET_INICIAL_NARANJA
//    en src/components/index.jsx o crear un nuevo offset para la nueva imagen.
// Componente visual que muestra la ruleta, la flecha y el boton de giro.
const Ruleta = (props) => (
  <div className="ruleta-shell" disabled={props.animatedRuleta}>
    <p align="center" className="flecha-wrap">
      <img src={Flecha} alt="Ruleta" className="flecha-ruleta" />
    </p>
    <p align="center">
      <img
        id="img-ruleta"
        src={ruleta}
        style={{
          // El angulo actual de la ruleta lo controla el componente padre.
          transform: "rotate(" + props.data_ruleta + "deg)",
          WebkitTransform: "rotate(" + props.data_ruleta + "deg)",
        }}
        alt="Ruleta"
        // Cuando termina el giro se dispara la evaluacion del resultado.
        onTransitionEnd={props.showRuletaResult}
        className="img-responsive img-ruleta"
        ref={props.ruleta}
      />
    </p>
    <p align="center">
      <button
        id="btnAnimar"
        // Evita que se pueda girar de nuevo mientras la animacion sigue en curso.
        disabled={props.animatedRuleta}
        onClick={props.animarEvent}
        className="btn btn-warning btn-orange btn-lg ruleta-btn"
        style={{ fontSize: "40px" }}
      >
        GIRA LA RULETA!
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </button>
    </p>
  </div>
);

export default Ruleta;
