export type BrandedChannel = "web" | "social";

export interface BrandedFormat {
  slug: string;
  title: string;
  category: string;
  description: string;
  integration: string[];
  channel: BrandedChannel;
  specification: string;
  examples: { label: string; url: string }[];
  imageAlt: string;
}

export const BRANDED_CHANNELS: Record<BrandedChannel, { label: string; title: string; description: string }> = {
  web: {
    label: "Web",
    title: "Contenido que invita a quedarse.",
    description: "Desde una nota hasta una experiencia interactiva: encuentra el espacio editorial para contar lo que tu marca tiene en común con su audiencia.",
  },
  social: {
    label: "Redes sociales",
    title: "La conversación sigue en redes.",
    description: "Talentos, historias y comunidades se encuentran en transmisiones, videos y publicaciones creadas alrededor del concepto de tu campaña.",
  },
};

export const BRANDED_FORMATS: BrandedFormat[] = [
  {
    slug: "nota", title: "Nota", category: "Contenido editorial", channel: "web", specification: "Artículo multimedia",
    description: "Una historia afín al universo de tu marca, integrada al formato de lectura habitual de RPP.",
    integration: ["El tema conecta con la filosofía de la marca, sin mencionarla en el texto.", "Conserva la estructura de una noticia del portal.", "Puede sumar video, infografías o audio para desarrollar la historia."],
    examples: [{ label: "Ver ejemplo", url: "https://rpp.pe/campanas/contenido-patrocinado/que-alimentos-consumir-para-reforzar-el-sistema-inmunologico-noticia-1258578" }],
    imageAlt: "Ilustración de una nota editorial con contenido de marca destacado en rojo, en web y móvil.",
  },
  {
    slug: "reportaje", title: "Reportaje", category: "Contenido en profundidad", channel: "web", specification: "Diseño personalizado",
    description: "Más contexto, más desarrollo y una narrativa visual propia para explorar un tema que merece profundidad.",
    integration: ["Desarrolla un tema de interés con investigación y mayor extensión.", "Permite adaptar la tipografía, el color y la estructura de la pieza.", "Combina secciones, videos, infografías o audio según la historia."],
    examples: [{ label: "Ver ejemplo", url: "https://rpp.pe/campanas/contenido-patrocinado/guia-cervecera-como-disfrutar-con-responsabilidad-la-maestria-de-una-cerveza-noticia-1355246" }],
    imageAlt: "Ilustración de un reportaje con apertura inmersiva roja y bloques de lectura en web y móvil.",
  },
  {
    slug: "landing", title: "Landing", category: "Destino de marca", channel: "web", specification: "Hub de contenidos",
    description: "Un destino patrocinado que reúne historias y recursos bajo la identidad visual de tu marca.",
    integration: ["Integra logo, banners y colores de la marca en el espacio.", "Reúne notas, galerías, videos, testimonios e infografías.", "Los artículos abordan temas afines a la marca sin mencionarla en su desarrollo."],
    examples: [{ label: "Ver ejemplo en video", url: "https://f.rpp-noticias.io/2022/02/23/portadalanding.mp4" }],
    imageAlt: "Ilustración de una landing con cabecera de marca roja y una colección de artículos.",
  },
  {
    slug: "blog", title: "Blog", category: "Voces especialistas", channel: "web", specification: "Espacio temático",
    description: "Un espacio de contenido especializado donde las voces expertas desarrollan temas relevantes para tu marca.",
    integration: ["Concentra artículos dedicados a una temática especial para la marca.", "Las notas son producidas por líderes o especialistas.", "El equipo de Branded Content edita los textos según los lineamientos del portal."],
    examples: [{ label: "Ver ejemplo", url: "https://youtu.be/eONQdB4sybo" }],
    imageAlt: "Ilustración de un blog con banner temático rojo, columnas editoriales y autores especialistas.",
  },
  {
    slug: "ruta-interactiva", title: "Ruta interactiva", category: "Storytelling participativo", channel: "web", specification: "Decisiones del usuario",
    description: "La audiencia elige cómo avanzar. Cada decisión abre un camino y la historia termina conectando con tu marca.",
    integration: ["El usuario participa tomando decisiones dentro del relato.", "Cada elección desarrolla un recorrido diferente.", "La marca se vincula con la historia en el paso final de la experiencia."],
    examples: [{ label: "Ver ejemplo en video", url: "https://f.rpp-noticias.io/2022/02/23/portadaruta-interactiva.mp4" }],
    imageAlt: "Ilustración de una historia interactiva roja con opciones y caminos de decisión.",
  },
  {
    slug: "publirreportaje", title: "Publirreportaje", category: "Comunicación de marca", channel: "web", specification: "Identificación publicitaria",
    description: "Tu producto, campaña o evento toma la palabra en una pieza con tratamiento editorial y presencia explícita de marca.",
    integration: ["Se publica con la estructura habitual de las notas de RPP.", "Menciona a la marca y se identifica como publirreportaje.", "Cumple los requisitos editoriales de GRPP y puede incorporar recursos multimedia."],
    examples: [{ label: "Ver ejemplo", url: "https://rpp.pe/campanas/publirreportaje/pierre-leon-encontro-una-forma-de-ganar-dinero-extra-que-le-ha-permitido-pasar-tiempo-con-su-familia-y-cumplir-un-gran-sueno-noticia-1360554?ref=rpp" }],
    imageAlt: "Ilustración de un publirreportaje con identificación de patrocinio y producto en el contenido rojo.",
  },
  {
    slug: "facebook-live-informativo", title: "Facebook Live informativo", category: "Conversación en vivo", channel: "social", specification: "Aprox. 12 minutos",
    description: "Una entrevista con los conductores y un representante de tu marca para desarrollar una conversación informativa.",
    integration: ["La dinámica se adapta al brief de la marca.", "Incluye presencia de logo y product placement.", "La entrevista conecta el mensaje de la marca con el contenido del programa."],
    examples: [{ label: "Ver ejemplo", url: "https://www.facebook.com/rppnoticias/videos/1975128499335035" }],
    imageAlt: "Ilustración de una entrevista en Facebook Live con dos participantes en una transmisión roja.",
  },
  {
    slug: "facebook-live-musical", title: "Facebook Live musical", category: "Entretenimiento en vivo", channel: "social", specification: "Aprox. 12 minutos",
    description: "El concepto de tu campaña se convierte en una dinámica con las voces y la comunidad de nuestras radios musicales.",
    integration: ["El contenido de la transmisión se relaciona con el concepto de marca.", "Participan los conductores del programa de radio.", "La dinámica personalizada incorpora logo y product placement."],
    examples: [{ label: "Ver ejemplo 01", url: "https://www.facebook.com/watch/?v=556747869028856" }, { label: "Ver ejemplo 02", url: "https://www.facebook.com/watch/live/?ref=watch_permalink&v=3065959823663389" }],
    imageAlt: "Ilustración de un Facebook Live musical con conductores, audífonos y micrófonos sobre rojo.",
  },
  {
    slug: "video-patrocinado", title: "Video patrocinado", category: "Talento + marca", channel: "social", specification: "Contenido personalizado",
    description: "Nuestros talentos protagonizan una pieza audiovisual construida alrededor del mensaje de tu marca.",
    integration: ["Se desarrolla un contenido personalizado para la campaña.", "La propuesta incorpora la presencia de nuestros talentos.", "El concepto de marca guía la historia del video."],
    examples: [{ label: "Ver ejemplo", url: "https://www.facebook.com/Studio92Radio/videos/1149444838837148/" }],
    imageAlt: "Ilustración de un video patrocinado rojo con un talento y presencia de producto.",
  },
  {
    slug: "playground", title: "Playground", category: "Contenido útil", channel: "social", specification: "Marca al cierre",
    description: "Un video que parte de un tema relevante para la audiencia y reserva la presencia de marca para el cierre.",
    integration: ["El contenido aporta información de interés para el consumidor.", "La historia se desarrolla en formato de video.", "La marca aparece al final de la pieza."],
    examples: [{ label: "Ver ejemplo", url: "https://www.facebook.com/rppnoticias/videos/899801574072980" }],
    imageAlt: "Ilustración de un video explicativo rojo y una tarjeta final con presencia de marca.",
  },
  {
    slug: "stories", title: "Stories patrocinados", category: "Instagram / radios musicales", channel: "social", specification: "Guion de 15 segundos",
    description: "Una historia vertical y directa que lleva el concepto de tu campaña al lenguaje cotidiano de Instagram.",
    integration: ["Se trabaja un guion de 15 segundos.", "El concepto o campaña del cliente define el contenido.", "Se publica en Instagram de las marcas musicales."],
    examples: [{ label: "Ver ejemplo en video", url: "https://f.rpp-noticias.io/2022/02/23/portadahistoria-patrocinada.mp4" }],
    imageAlt: "Ilustración de tres stories verticales rojos con barras de progreso y elementos de campaña.",
  },
  {
    slug: "reel", title: "Reel", category: "Instagram / video vertical", channel: "social", specification: "Aprox. 30 segundos",
    description: "Un video breve con nuestros talentos, creado desde Instagram y adaptado al concepto de tu marca.",
    integration: ["El contenido se personaliza para la marca.", "Participan nuestros talentos.", "La grabación se realiza desde la propia plataforma de Instagram."],
    examples: [{ label: "Ver ejemplo", url: "https://www.instagram.com/reel/CWYlayWl9Pq/" }],
    imageAlt: "Ilustración de un reel vertical rojo con talento, subtítulos y controles sociales.",
  },
  {
    slug: "video-on-site", title: "Video on site", category: "Producción en locación", channel: "social", specification: "De 2 a 3 minutos máx.",
    description: "La historia se cuenta desde el lugar donde sucede: un evento o un local relacionado con tu producto o servicio.",
    integration: ["El contenido se vincula con el servicio o producto de la marca.", "Puede incluir la asistencia a un evento o a un local.", "Consulta la disponibilidad y el alcance de producción con nuestro equipo."],
    examples: [],
    imageAlt: "Ilustración conceptual de una cobertura audiovisual de marca en un evento, con entrevistador y micrófono.",
  },
  {
    slug: "post-publicitario", title: "Post publicitario", category: "Facebook e Instagram", channel: "social", specification: "Publicidad directa",
    description: "Una publicación que presenta tu propuesta comercial a las comunidades de nuestras marcas en redes sociales.",
    integration: ["La pieza comunica publicidad directa de la marca.", "La difusión se realiza en Facebook o Instagram.", "El contenido se integra al feed de la cuenta seleccionada."],
    examples: [{ label: "Ver ejemplo", url: "https://www.facebook.com/Studio92Radio/posts/5082237225155359" }],
    imageAlt: "Ilustración de un post publicitario estático con una creatividad cuadrada roja y un producto.",
  },
  {
    slug: "infografia", title: "Infografía patrocinada", category: "Contenido visual", channel: "social", specification: "Diseño para cada cliente",
    description: "El mensaje de tu marca se convierte en información visual, organizada para entenderse y compartirse.",
    integration: ["El contenido se personaliza para cada cliente.", "La información se desarrolla en una pieza gráfica.", "La publicación lleva el contenido al entorno social de la marca seleccionada."],
    examples: [{ label: "Ver ejemplo", url: "https://www.facebook.com/rppnoticias/photos/a.123284421753/10161580860001754/" }],
    imageAlt: "Ilustración de una infografía patrocinada con módulos rojos, diagramas y lectura vertical.",
  },
  {
    slug: "crossposting", title: "Crossposting", category: "Amplificación simultánea", channel: "social", specification: "Live o video de marca",
    description: "Tu transmisión o video llega a otra comunidad mediante su retransmisión simultánea en nuestras fanpages.",
    integration: ["Retransmite un Facebook Live o video de la marca.", "Se difunde al mismo tiempo en la fanpage seleccionada.", "El contenido requiere la aprobación previa de la radio."],
    examples: [{ label: "Ver ejemplo", url: "https://www.facebook.com/watch/live/?ref=watch_permalink&v=3741707392807541" }],
    imageAlt: "Ilustración de una misma transmisión roja distribuida simultáneamente en tres ventanas sociales.",
  },
  {
    slug: "tema-del-dia", title: "Tema del día", category: "Radio + redes sociales", channel: "social", specification: "1 hora de programa + Live",
    description: "Un hashtag lleva el concepto de tu marca a la conversación entre los conductores y su audiencia.",
    integration: ["La producción crea un hashtag alineado al concepto de marca.", "La activación ocupa una hora del programa e incorpora un Facebook Live.", "Stories y posts gráficos promueven el tema e invitan a participar."],
    examples: [{ label: "Ver ejemplo", url: "https://youtu.be/TiKRQ0xkgjQ" }],
    imageAlt: "Ilustración de un tema del día con transmisión de radio roja y stories unidos por un hashtag.",
  },
];

export function getBrandedThumbnail(slug: string) {
  return `/images/formats/thumbnails/branded-content/${slug}.webp`;
}
