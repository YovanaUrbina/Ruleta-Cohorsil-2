import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import Ruleta from "./Ruleta";
import Premios from "./Premios";
import BayerLogo from "../img/BAYER.png";
import cohorsil from "../img/cohorsil.png";
import syngenta from "../img/syngenta.png";
import "./index.css";
import { ChevronLeft } from "lucide-react";

// Define los 10 segmentos reales de la ruleta y si cada uno gana o pierde.
const SEGMENTOS = [
  { numero: 0, color: "rojo", premio: "Bolsa", win: true, peso: 7.5 },
  { numero: 1, color: "naranja", premio: null, win: false, peso: 10 },
  { numero: 2, color: "amarillo", premio: "Sombrilla", win: true, peso: 15 },
  { numero: 3, color: "verde", premio: "Gorra", win: true, peso: 7.5 },
  { numero: 4, color: "verde aqua", premio: null, win: false, peso: 10 },
  { numero: 5, color: "azul claro", premio: "Gorra", win: true, peso: 7.5 },
  { numero: 6, color: "azul oscuro", premio: null, win: false, peso: 10 },
  { numero: 7, color: "morado", premio: "Bolsa", win: true, peso: 7.5 },
  { numero: 8, color: "rosado", premio: null, win: false, peso: 10 },
  { numero: 9, color: "rosado oscuro", premio: "Sombrero", win: true, peso: 15 },
];

// La imagen "Ruleta_Nueva.png" ya tiene la sombrilla amarilla centrada perfectamente arriba.
// La imagen de la ruleta esta perfectamente alineada con la bolsa roja en el grado 0.
const OFFSET_INICIAL_NARANJA = 0;

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
    { id: 1, premio: "Gorra", precio: "" },
    { id: 2, premio: "Sombrilla", precio: "" },
    { id: 4, premio: "Sombrero", precio: "" },
    { id: 5, premio: "Bolsa", precio: "" },
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

    // Logica de "ruleta trucada" para igualar la probabilidad de los premios
    let sumaPesos = 0;
    for (let i = 0; i < SEGMENTOS.length; i++) {
      sumaPesos += SEGMENTOS[i].peso;
    }

    let valorAleatorio = 0;
    let maxIntentos = 10; // Evita ciclos infinitos

    // Sistema Anti-Repetición: Sigue tirando los dados si sale lo mismo que la vez anterior
    do {
      let random = Math.random() * sumaPesos;
      for (let i = 0; i < SEGMENTOS.length; i++) {
        if (random < SEGMENTOS[i].peso) {
          valorAleatorio = i;
          break;
        }
        random -= SEGMENTOS[i].peso;
      }
      maxIntentos--;
    } while (
      maxIntentos > 0 &&
      (
        valorAleatorio === ruletsData || // Evita caer en el mismo pedazo físico
        (resultado && resultado.premio && SEGMENTOS[valorAleatorio].premio === resultado.premio) // Evita dar el mismo premio 2 veces
      )
    );

    const valorPremio = gradosCirculo * 5 + valorAleatorio * gradosSegmento;

    setResultado(null);
    setShowCelebration(false);
    setShowSadBurst(false);
    setRuletsData(valorAleatorio);
    // Reinicia el angulo en el ultimo segmento para evitar saltos visuales.
    setDataRuleta(ruletaTemp * gradosSegmento);
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
              <img src={BayerLogo} alt="Bayer" className="logo-side " />
            </div>
            <div className="logo-slot">
              <img src={cohorsil} alt="COHORSIL" className="logo-center" />
            </div>
            <div className="logo-slot">
              <img src={syngenta} alt="Syngenta" className="logo-side" />
            </div>
          </div>
        </div>

        <div className="game-shell" style={{ transform: "translateX(-5px)" }}>


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

          {/* Mensaje de Resultado Integrado (Aparece sin interrumpir) */}
          <div style={{ minHeight: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {resultado && (
              <div style={{
                background: resultado.win ? "#d1fae5" : "#fee2e2",
                color: resultado.win ? "#065f46" : "#991b1b",
                padding: "16px 32px",
                borderRadius: "20px",
                border: `2px solid ${resultado.win ? "#34d399" : "#f87171"}`,
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                animation: "fadeIn 0.5s ease-out"
              }}>
                <h3 style={{ margin: 0, fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: "800", display: "flex", alignItems: "center", gap: "10px" }}>
                  {resultado.win ? `🎉 ¡Has ganado: ${resultado.premio}! 🎉` : "😢 Sigue intentándolo..."}
                </h3>
              </div>
            )}
          </div>

          {/* Ruleta principal con flecha y boton de accion. */}
          <Ruleta
            total_points={0}
            animatedRuleta={animatedRuleta}
            data_ruleta={dataRuleta}
            showRuletaResult={showRuletaResult}
            animarEvent={animarEvent}
            ruleta={ruleta}
            segmentos={SEGMENTOS}
          />
          <br />
        </div>

        {/* BOTON DE REGRESO */}
        <button
          type="button"
          className="boton-volver"
          onClick={() => window.location.href = "https://juegos-cohorsil-libreria.vercel.app/"}
        >
          <ChevronLeft size={40} />
        </button>

      </div>
    </div>
  );
}

export default App;
