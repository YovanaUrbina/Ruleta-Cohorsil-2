import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import Ruleta from "./Ruleta";
import Premios from "./Premios";
import BayerLogo from "../img/BAYER.png";
import cohorsil from "../img/cohorsil.png";
import syngenta from "../img/syngenta.png";
import "./index.css";

// Define los 10 segmentos reales de la ruleta y si cada uno gana o pierde.
const SEGMENTOS = [
  { numero: 0, color: "naranja", premio: "Lapiz", win: true },
  { numero: 1, color: "rojo", premio: null, win: false },
  { numero: 2, color: "azul", premio: "Termo", win: true },
  { numero: 3, color: "amarillo", premio: null, win: false },
  { numero: 4, color: "verde", premio: "Gorra", win: true },
  { numero: 5, color: "naranja", premio: "Lapiz", win: true },
  { numero: 6, color: "rojo", premio: null, win: false },
  { numero: 7, color: "azul", premio: "Termo", win: true },
  { numero: 8, color: "amarillo", premio: null, win: false },
  { numero: 9, color: "verde", premio: "Gorra", win: true },
];

// La imagen base empieza con un corte en la parte superior.
// Este offset la acomoda para que el centro del primer segmento
// (naranja) quede apuntando a la flecha al cargar la pantalla. 
// esta es la ruta de la imagen con segmentos Ruleta2\src\img\segmentos.png
//esta es la ruta de los colores base y su orden en segmentos - Ruleta2\src\img\colores-base.png
//puede usar cualquier imagen dividida en 10 segmentos siempre que el orden de colores sea el mismo que el definido en SEGMENTOS.
// o cambiar const SEGMENTOS para que coincida con el orden de colores de la imagen que se use.
const OFFSET_INICIAL_NARANJA = 360 / SEGMENTOS.length / 2;

function App() {
  // Guarda el angulo actual de la ruleta.
  const [dataRuleta, setDataRuleta] = useState(OFFSET_INICIAL_NARANJA);
  // Bloquea el boton mientras la ruleta esta en movimiento.
  const [animatedRuleta, setAnimatedRuleta] = useState(false);
  // Guarda el indice del ultimo segmento seleccionado aleatoriamente.
  const [ruletsData, setRuletsData] = useState(0);
  // Contiene el resultado final del giro: color, premio y estado ganar/perder.
  const [resultado, setResultado] = useState(null);
  // Activa la celebracion visual al ganar.
  const [showCelebration, setShowCelebration] = useState(false);
  // Activa la rafaga de caritas tristes cuando no gana.
  const [showSadBurst, setShowSadBurst] = useState(false);

  // Premios visibles en la lista inferior.
  const premios = [
    // { id: 1, premio: "Sombrero", precio: "" },
    // { id: 2, premio: "Taza", precio: "" },
    // { id: 3, premio: "Taza", precio: "" },
    { id: 4, premio: "Lapiz", precio: "" },
    { id: 5, premio: "Gorra", precio: "" },
    { id: 6, premio: "Termo", precio: "" },
  ];

  const ruleta = useRef(null);

  useEffect(() => {
    if (!resultado || !resultado.win) {
      return;
    }

    // Lanza confeti cuando el resultado del giro es ganador.
    const fire = () => {
      confetti({
        particleCount: 180,
        spread: 90,
        origin: { y: 0.62 },
      });
    };

    fire();
    setShowCelebration(true);
    const timeoutId = setTimeout(fire, 260);
    const cleanupId = setTimeout(() => setShowCelebration(false), 4200);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(cleanupId);
    };
  }, [resultado]);

  useEffect(() => {
    if (!resultado || resultado.win) {
      return;
    }

    // Muestra una animacion temporal de caritas tristes para los segmentos perdedores.
    setShowSadBurst(true);
    const cleanupId = setTimeout(() => setShowSadBurst(false), 3200);

    return () => clearTimeout(cleanupId);
  }, [resultado]);

  const animarEvent = () => {
    // Calcula el giro con base en la cantidad real de segmentos de la imagen.
    const ruletaTemp = ruletsData;
    const segmentos = SEGMENTOS.length;
    const gradosCirculo = 360;
    const gradosSegmento = gradosCirculo / segmentos;
    const centroSegmento = gradosSegmento / 2;
    const valorAleatorio = Math.floor(Math.random() * segmentos);
    const valorPremio = gradosCirculo * 5 + centroSegmento + valorAleatorio * gradosSegmento;

    setResultado(null);
    setShowCelebration(false);
    setShowSadBurst(false);
    setRuletsData(valorAleatorio);
    // Reinicia el angulo en el centro del ultimo segmento para evitar saltos visuales.
    setDataRuleta(ruletaTemp * gradosSegmento + centroSegmento);
    setAnimatedRuleta(true);

    setTimeout(() => {
      // Agrega la transicion y luego aplica el angulo final del giro.
      ruleta.current.classList.add("img-ruleta");
      setDataRuleta(valorPremio);
    }, 200);
  };

  const showRuletaResult = async () => {
    // Toma el segmento seleccionado y lo guarda como resultado del giro.
    const segmentoResultado = SEGMENTOS[ruletsData];

    ruleta.current.classList.remove("img-ruleta");
    setAnimatedRuleta(false);
    setResultado(segmentoResultado);
  };

  return (
    <div id="main">
      <div className="page-shell">
        {/* Globos que aparecen solo cuando el usuario gana. */}
        {showCelebration && (
          <div className="celebration-layer" aria-hidden="true">
            <div className="balloons balloons-screen">
              <span className="balloon balloon-blue" />
              <span className="balloon balloon-orange" />
              <span className="balloon balloon-green" />
              <span className="balloon balloon-gold" />
            </div>
          </div>
        )}

        {/* Rafaga de caritas tristes que aparece cuando el resultado es perdedor. */}
        {showSadBurst && (
          <div className="celebration-layer" aria-hidden="true">
            <div className="sad-burst sad-burst-screen">
              <span className="sad-face sad-red">😔</span>
              <span className="sad-face sad-yellow">😔</span>
              <span className="sad-face sad-blue">😔</span>
              <span className="sad-face sad-orange">😔</span>
              <span className="sad-face sad-green">😔</span>
              <span className="sad-face sad-red">😔</span>
              <span className="sad-face sad-yellow">😔</span>
              <span className="sad-face sad-blue">😔</span>
              <span className="sad-face sad-orange">😔</span>
              <span className="sad-face sad-green">😔</span>
              <span className="sad-face sad-red">😔</span>
              <span className="sad-face sad-yellow">😔</span>
            </div>
          </div>
        )}

        {/* Banda superior con los logos institucionales. */}
        <div className="logos-shell">
          <div className="logos-grid">
            <div className="logo-slot">
              <img src={BayerLogo} alt="Bayer" className="logo-side" />
            </div>
            <div className="logo-slot">
              <img src={cohorsil} alt="COHORSIL" className="logo-center" />
            </div>
            <div className="logo-slot">
              <img src={syngenta} alt="Syngenta" className="logo-side" />
            </div>
          </div>
        </div>

        <div className="container">
          <div className="game-shell">
         

            {/* Ruleta principal con flecha y boton de accion. */}
            <Ruleta
              total_points={0}
              animatedRuleta={animatedRuleta}
              data_ruleta={dataRuleta}
              showRuletaResult={showRuletaResult}
              animarEvent={animarEvent}
              ruleta={ruleta}
            />

            {/* Titulo de la seccion de premios. */}
            <h2 className="premios-title">
              🎁 Premios 🎉
            </h2>

            {/* Dibuja una tarjeta por cada premio activo. */}
            {premios.map((item, index) => (
              <Premios
                key={item.id}
                indice={index}
                data={item}
                total_points={0}
              />
            ))}
            <br />
          </div>
        </div>
        {/* BOTON DE REGRESO */}
        <a
          href="https://juegos-cohorsil-libreria.vercel.app/"
          className="btn-back-card"
        >
          ‹
        </a>
      </div>
    </div>
  );
}

export default App;
