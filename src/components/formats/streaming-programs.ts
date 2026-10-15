export type StreamingFamily = "native" | "hybrid";

export interface StreamingProgram {
  id: string;
  name: string;
  topic: string;
  hosts?: string;
  station?: string;
  description: string;
  frequency: string;
  recorded?: boolean;
  artwork: string;
  poster?: string;
  exampleUrl?: string;
  background: string;
  lightArtwork?: boolean;
  cast: string[];
  sourceSlide: number;
  sourceDeck?: "musical-july-2026";
}

// Original artwork and programme information: supplied RPP (August) and music (July) 2026 decks.
export const STREAMING_CATALOG: Record<StreamingFamily, {
  label: string;
  description: string;
  programs: StreamingProgram[];
}> = {
  native: {
    label: "Nativos digitales",
    description: "Programas creados para las plataformas digitales. Fútbol, música, misterio e historias con artistas y conductores que conectan con sus comunidades.",
    programs: [
      {
        id: "toco-y-me-voy",
        name: "Toco y me voy",
        topic: "Fútbol y debate",
        hosts: "Tanke Arias y Alan Diez",
        description: "El fútbol peruano e internacional se vive y se debate con una comunidad que participa en tiempo real.",
        frequency: "Lunes a viernes",
        artwork: "toco-y-me-voy-logo",
        background: "#164d41",
        cast: ["toco-y-me-voy-alan", "toco-y-me-voy-tanke"],
        sourceSlide: 3,
      },
      {
        id: "tres-en-cancha",
        name: "3 en cancha",
        topic: "Fútbol peruano",
        hosts: "Pedro Goñi, Mario Pinedo y Jean Martin Dueñas",
        description: "Actualidad del fútbol peruano y la selección, con una mirada cercana al hincha y a la cultura deportiva.",
        frequency: "Lunes a viernes",
        artwork: "tres-en-cancha-logo",
        background: "#203a4c",
        cast: ["tres-en-cancha-pedro", "tres-en-cancha-jean"],
        sourceSlide: 4,
      },
      {
        id: "viaje-a-otra-dimension",
        name: "Viaje a otra dimensión",
        topic: "Misterio y ciencia",
        hosts: "Anthony Choy",
        description: "Misterio, ciencia y fenómenos paranormales para una comunidad curiosa que comparte preguntas y experiencias.",
        frequency: "Martes, miércoles y jueves",
        artwork: "viaje-a-otra-dimension-logo",
        background: "#282438",
        cast: ["viaje-a-otra-dimension-choy"],
        sourceSlide: 5,
      },
      {
        id: "dato-franco",
        name: "Dato Franco",
        topic: "Análisis y estadísticas",
        hosts: "Daniel Franco",
        description: "Estadísticas, tendencias y pronósticos para quienes quieren entender el fútbol más allá del resultado.",
        frequency: "Lunes a viernes",
        artwork: "dato-franco-logo",
        background: "#1e3258",
        cast: ["dato-franco-daniel"],
        sourceSlide: 6,
      },
      {
        id: "la-fiesta-del-futbol",
        name: "La fiesta del fútbol",
        topic: "Fútbol internacional",
        hosts: "Pedro García",
        description: "Opinión informada y análisis del fútbol internacional con el contexto y la experiencia de Pedro García.",
        frequency: "Lunes a viernes",
        artwork: "la-fiesta-del-futbol-logo",
        background: "#1c372e",
        cast: ["la-fiesta-del-futbol-pedro"],
        sourceSlide: 7,
      },
      {
        id: "historias-caletas",
        name: "Historias caletas del Mundial",
        topic: "Historias del fútbol",
        hosts: "Pedro García",
        description: "Historias reales poco contadas, en episodios grabados de 25 a 30 minutos con una narrativa audiovisual inmersiva.",
        frequency: "Miércoles",
        recorded: true,
        artwork: "historias-caletas-logo",
        background: "#38232e",
        cast: ["historias-caletas-pedro"],
        sourceSlide: 8,
      },
      {
        id: "studio-sessions",
        name: "Studio Sessions",
        topic: "Sesiones musicales",
        station: "Studio92",
        description: "Artistas invitados presentan su música y reversionan hits a su manera en el canal de YouTube de Studio92, con sesiones y entrevistas amplificadas en redes y radio.",
        frequency: "Jueves, quincenal",
        recorded: true,
        artwork: "studio-sessions-logo",
        poster: "studio-sessions-episodio",
        exampleUrl: "https://www.youtube.com/watch?v=t3GZ6h0FGjQ",
        background: "#3b244e",
        cast: [],
        sourceSlide: 3,
        sourceDeck: "musical-july-2026",
      },
      {
        id: "zona-encendida",
        name: "Zona Encendida",
        topic: "Acústicos y música urbana",
        station: "La Zona",
        description: "Un espacio de acústicos en YouTube donde los exponentes del género urbano muestran su talento y acercan su música a la comunidad de Radio La Zona.",
        frequency: "Miércoles, quincenal",
        recorded: true,
        artwork: "zona-encendida-logo",
        poster: "zona-encendida-episodio",
        exampleUrl: "https://www.youtube.com/watch?v=djQbrkUcMuM",
        background: "#24243f",
        cast: [],
        sourceSlide: 5,
        sourceDeck: "musical-july-2026",
      },
      {
        id: "tributo-oxigeno",
        name: "Tributo Oxígeno",
        topic: "Rock y pop de los 80 y 90",
        station: "Oxígeno",
        description: "Voces invitadas rinden homenaje a los íconos del rock y pop de los 80 y 90. Un tributo en YouTube que une nostalgia y nuevas interpretaciones para varias generaciones.",
        frequency: "Lunes, mensual",
        recorded: true,
        artwork: "tributo-oxigeno-logo",
        poster: "tributo-oxigeno-episodio",
        exampleUrl: "https://www.youtube.com/watch?v=uZu_1QsvTNk&list=PLsSJbywbAs6588a_vc55LCm2P8bT_XVre&index=3",
        background: "#401a63",
        cast: [],
        sourceSlide: 7,
        sourceDeck: "musical-july-2026",
      },
      {
        id: "zona-de-djs",
        name: "Zona de DJs",
        topic: "DJs y éxitos urbanos",
        station: "La Zona",
        description: "La experiencia musical sale de la cabina. DJs peruanos mezclan éxitos urbanos desde distintos puntos de la ciudad en episodios para YouTube y redes sociales.",
        frequency: "Lunes, quincenal",
        recorded: true,
        artwork: "zona-de-djs-logo",
        poster: "zona-de-djs-episodio",
        exampleUrl: "https://www.youtube.com/watch?v=sIDaGfCEu-g&list=PLea6zjVPb1884zJXSuWT-qUIA_Snbf3Uy&index=1",
        background: "#27243c",
        cast: [],
        sourceSlide: 9,
        sourceDeck: "musical-july-2026",
      },
    ],
  },
  hybrid: {
    label: "Streaming híbrido",
    description: "Programas de radio y televisión que amplían su presencia en streaming. Voces reconocidas y nuevas oportunidades de participación para tu marca en digital.",
    programs: [
      {
        id: "vamos-al-var",
        name: "Vamos al VAR",
        topic: "Debate deportivo",
        hosts: "Tanke Arias, Alan Diez y Pedro García",
        description: "Análisis, controversia táctica y pasión por el fútbol en una mesa con tres de las voces deportivas de RPP.",
        frequency: "Lunes a viernes",
        artwork: "vamos-al-var-logo",
        background: "#d4e2e8",
        lightArtwork: true,
        cast: ["vamos-al-var-conductores"],
        sourceSlide: 14,
      },
      {
        id: "los-chistosos",
        name: "Los Chistosos",
        topic: "Humor y entretenimiento",
        hosts: "Daniel Marquina y Hernán Vidaurre",
        description: "La energía de Los Chistosos pasa de la radio a la pantalla y extiende la conversación con su comunidad.",
        frequency: "Lunes a viernes",
        artwork: "los-chistosos-logo",
        background: "#eed88f",
        lightArtwork: true,
        cast: ["los-chistosos-daniel", "los-chistosos-hernan"],
        sourceSlide: 16,
      },
      {
        id: "futbol-como-cancha",
        name: "Fútbol como cancha",
        topic: "Actualidad deportiva",
        hosts: "Tanke Arias, Alan Diez, Pedro García y Juan Carlos Ortecho",
        description: "Debate, primicias y entrevistas a los protagonistas del fútbol peruano y mundial, con la mirada del equipo deportivo de RPP.",
        frequency: "Lunes a viernes",
        artwork: "futbol-como-cancha-logo",
        background: "#d3dfd7",
        lightArtwork: true,
        cast: ["futbol-como-cancha-conductores"],
        sourceSlide: 18,
      },
    ],
  },
};
