export interface Segment {
  id: string;
  label: string;
  badge?: string;
  tagline: string;
  features: { title: string; body: string }[];
  cta: { label: string; href: string };
}

export const segments: Segment[] = [
  {
    id: "comensales",
    label: "Comensales",
    tagline: "Elimina la fricción de decidir dónde comer.",
    features: [
      { title: "Filtros que eliminan incertidumbre", body: "Precio, ambiente, apto para niños, estacionamiento — todo de un vistazo." },
      { title: "Bitácora gastronómica personal", body: "Tu historial privado de lugares visitados, con notas y calificaciones." },
      { title: "Playlists curadas", body: "Listas temáticas de restaurantes, como playlists de Spotify." },
      { title: "Feed personalizado", body: "Recomendaciones basadas en tus gustos, tu historial y tu ubicación." },
    ],
    cta: { label: "Descargar la app", href: "#" },
  },
  {
    id: "restaurantes",
    label: "Restaurantes establecidos",
    tagline: "Compite por calidad, no por presupuesto publicitario.",
    features: [
      { title: "Ads sin ruido", body: "Toda la audiencia ya tiene intención gastronómica." },
      { title: "Data accionable por platillo", body: "Calificación desagregada por cada artículo de tu menú." },
      { title: "Rankings semanales por categoría", body: "Compite en mejor carne asada, mejor mariscos, y más." },
      { title: "Dashboard de inteligencia de mercado", body: "Tendencias, demografía de clientes y comparativa con competidores." },
    ],
    cta: { label: "Sumar mi restaurante", href: "#" },
  },
  {
    id: "negocios-pequenos",
    label: "Negocios pequeños",
    tagline: "Del boca a boca de tu colonia a toda Hermosillo.",
    features: [
      { title: "Canal de descubrimiento desde cero", body: "Perfil con fotos y reseñas sin saber nada de marketing digital." },
      { title: "Reviews anónimas opcionales", body: "Feedback honesto, sin la presión social de vender a conocidos." },
      { title: "Venta integrada", body: "Vende directo desde tu perfil, sin abrir un local." },
      { title: "Ads accesibles", body: "Boost efectivo en el feed local desde una inversión mínima." },
    ],
    cta: { label: "Sumar mi negocio", href: "#" },
  },
  {
    id: "marcas-independientes",
    label: "Marcas independientes",
    tagline: "Productos artesanales invisibles, ahora descubribles.",
    features: [
      { title: "Discoverability para productos invisibles", body: "Un catálogo frente a gente que busca descubrir comida nueva." },
      { title: "Credibilidad mediante reseñas", body: "Validación social real que convierte curiosos en compradores." },
      { title: "Catálogo en un solo lugar", body: "Fotos, descripciones, precios y puntos de venta, todo junto." },
      { title: "Ecosistema nivelado", body: "Las mismas herramientas que un restaurante establecido." },
    ],
    cta: { label: "Sumar mi marca", href: "#" },
  },
  {
    id: "creadores-contenido",
    label: "Creadores de contenido",
    tagline: "Tu audiencia es 100% gastronómica. Sin competir contra un video de gatos.",
    features: [
      { title: "Audiencia 100% gastronómica", body: "Engagement más alto porque la relevancia es máxima." },
      { title: "Posicionamiento como referente local", body: "La voz gastronómica de tu ciudad, no otro foodie más." },
      { title: "Comunidades temáticas propias", body: "Crea y modera espacios de discusión con tu propia base de fans." },
    ],
    cta: { label: "Crear mi perfil", href: "#" },
  },
  {
    id: "creadores-de-comida",
    label: "Creadores de Comida",
    badge: "Categoría nueva",
    tagline: "Cocinas en casa. Ahora también puedes vender sin registrarte como negocio.",
    features: [
      { title: "Perfil sin negocio formal", body: "Solo subes tu comida, tu historia, y empiezas." },
      { title: "Audiencia pre-calificada", body: "Alta conversión de \"me gusta\" a \"¿me lo vendes?\"." },
      { title: "Mensajería directa para pedidos", body: "Coordina encargos y precios sin salir de la app." },
      { title: "Camino a negocio establecido", body: "Dondii te acompaña de creador a negocio verificado." },
    ],
    cta: { label: "Empezar a vender", href: "#" },
  },
  {
    id: "proveedores",
    label: "Proveedores de mayoreo",
    tagline: "Pedidos al mayoreo para eventos, simplificados.",
    features: [
      { title: "Pedidos al mayoreo simplificados", body: "Compara precios y solicita directo desde la app." },
      { title: "Pricing escalonado por volumen", body: "Configura tus propios tramos de descuento por cantidad." },
      { title: "Proveedores verificados", body: "Reseñas de calidad, puntualidad y atención al cliente." },
      { title: "Catálogo especializado para eventos", body: "Piñatas, posadas, bodas, XV años — todo curado." },
    ],
    cta: { label: "Sumar mi negocio", href: "#" },
  },
];
