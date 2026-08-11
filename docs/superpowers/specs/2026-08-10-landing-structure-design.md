# Estructura de secciones — Landing de Dondii

**Fecha:** 2026-08-10
**Estado:** Aprobado
**Fuente de contenido:** `product.md` (raíz del repo), sintetizado de los 3 PDFs fundacionales (Manifiesto, Mapa de Propuestas de Valor/Ingresos MVP, Savour_Mapa_Revenue_v4).

## Contexto

Dondii es una app de descubrimiento gastronómico en softlaunch en Hermosillo, Sonora. Este documento define la arquitectura de información y la estructura de secciones del sitio web informativo, construido con Astro + Tailwind CSS v4 + GSAP. Es el paso previo al plan de implementación — no define el sistema visual final (tipografía, spacing, paleta completa), que se resuelve durante implementación con el skill de diseño (`frontend-design` / `impeccable`).

## Decisiones de alcance

- **Estado de la app:** ya lanzada, softlaunch activo en Hermosillo. El CTA principal del sitio son los botones de descarga (App Store / Google Play) — **pendiente: el usuario debe proveer los links reales de las tiendas antes de que esos botones puedan ser funcionales.**
- **Audiencia de la Home:** dual — primero comensales, después un pivot hacia negocios/creadores. Ningún segmento se trata como secundario (principio del manifiesto: "el negocio pequeño no es de segunda clase").
- **Arquitectura:** multi-página con Astro file-based routing (no single-page/scroll-anchor). Mejor SEO por tema, y el blog necesita rutas propias de todos modos.
- **Dirección visual:** sin brand guideline cerrada aún. Ancla de color: familia naranja quemado (`Primary #812800`, `Primary Dark #5C1D00`, `Tomato #A63A0B`, `Primary Light #FECBA8`, provista por el usuario). Dirección de tono: energética/vibrante estilo "teenage engineering" (bold, geometría juguetona, alto contraste, tipografía grande y confiada), atemperada con la contención de layout y márgenes generosos de referencias tipo Fabraix. El sistema de diseño completo (tipografía, tokens, spacing) se define en implementación, no en este spec.
- **Founders y testimonios:** no hay datos reales todavía. Se construyen con estructura y componentes finales, pero con contenido placeholder claramente marcado (`TODO: reemplazar con datos reales`) — no bloquea el desarrollo del layout.
- **Blog:** solo estructura (listado + template de post vía Astro Content Collections) en esta etapa. No se redacta contenido real de lanzamiento. Se incluyen 1-2 posts de ejemplo con contenido placeholder pero con estructura real (título, subtítulos, imagen, cita) para validar que el template aguanta contenido largo — no lorem ipsum plano.
- **Features:** los 7 segmentos de público del `product.md` se muestran todos, con el mismo peso, organizados por selector de audiencia (tabs/acordeón) en vez de listas apiladas.

## Sitemap

```
/                  Home (dual-audiencia)
/features          Features por segmento (selector de audiencia, 7 públicos)
/founders          Equipo fundador (placeholder-ready)
/blog              Listado de posts
/blog/[slug]       Post individual
/privacidad        Legal (placeholder simple, solo footer)
/terminos          Legal (placeholder simple, solo footer)
```

**Nav principal:** `Home · Features · Founders · Blog` + botón de descarga (App Store/Google Play), sticky.
**Footer:** links legales, redes sociales, repetición discreta del CTA de descarga.

## Home (`/`)

Diseñada como scroll narrativo, con GSAP marcando el ritmo entre secciones. Orden:

1. **Hero** — tagline ("Descubre. Saborea. Comparte."), propuesta de valor en una línea, CTAs de descarga, visual del producto, mención del softlaunch en Hermosillo.
2. **El gancho (historia Don Chuy vs. franquicia)** — versión condensada de la anécdota ancla del manifiesto. Contraste visual entre los dos negocios. Sección con más potencial de animación de scroll.
3. **Para comensales** — feed sin ruido, reseñas honestas, playlists, comunidad local. Tono consumer app.
4. **Para negocios y creadores** — pivot de audiencia. Mini-highlights de restaurantes, negocios informales, marcas y "Creadores de Comida" (resumen — el detalle completo vive en `/features`). CTA a `/features`. Incluye mención destacada del Programa de Negocios Fundadores (primeros 50 negocios, precio de por vida, posicionamiento prioritario 12 meses) como gancho de urgencia.
5. **Por qué somos distintos** — versión corta de "lo que NO somos" (no delivery, no red social genérica, no plataforma neutral de reseñas) + 1-2 de los 6 principios del manifiesto.
6. **Testimonios** — grid/carrusel, placeholder-ready.
7. **Founders (teaser)** — franja compacta que linkea a `/founders`, placeholder-ready.
8. **Blog (teaser)** — últimos posts, linkea a `/blog`.
9. **CTA final** — repetición de descarga, cierre con la línea del manifiesto ("Donde la calidad se ve").

## Features (`/features`)

1. **Header de página** — título + bajada corta.
2. **Selector de audiencia** — 7 pestañas (tabs en desktop, acordeón en mobile): Comensales · Restaurantes establecidos · Negocios pequeños e informales · Marcas independientes sin local · Creadores de contenido · Creadores de Comida · Proveedores de mayoreo. La pestaña "Creadores de Comida" lleva badge "Categoría nueva" — es el segmento más distintivo del producto.
3. **Contenido por pestaña** — línea de posicionamiento, features de "propuesta de valor" (del `product.md`) como tarjetas, CTA propio por segmento (descarga para comensales, "sumá tu negocio" para el resto).
4. **Nota de transparencia sobre ads** — mención breve de que hay visibilidad paga con tiers balanceados que protegen a los negocios chicos, sin cifras (pricing aún no definido).

**Nota de implementación:** el contenido de las 7 pestañas se modela como datos estructurados (no HTML repetido 7 veces) para que agregar o editar un segmento sea editar datos, no tocar layout.

## Founders (`/founders`)

1. **Header de página** — línea sobre el equipo, ligada al principio de "red local de los fundadores".
2. **Grid de founders** — tarjetas con foto, nombre, rol, bio corta. Estructura para 2-4 founders (ajustable). Datos placeholder marcados explícitamente en el código.
3. **Bloque de contexto** — fragmento del manifiesto sobre por qué Hermosillo / por qué existe Dondii.
4. **CTA de cierre** — invitación a sumarse o CTA de descarga repetido.

Menor prioridad de implementación real dentro del alcance: se construye el layout y componente de tarjeta; el llenado final queda bloqueado hasta recibir fotos y bios reales.

## Blog (`/blog`, `/blog/[slug]`)

1. **Listado** — grid/lista con portada, título, fecha, extracto. Sin categorías/tags todavía.
2. **Post individual** — template con portada, título, fecha, cuerpo en Markdown/MDX, bloque de cierre con CTA de descarga.
3. **Content Collection** — `src/content/blog/`, schema tipado (`title`, `date`, `excerpt`, `cover`; slug implícito por filename).
4. **Seed de prueba** — 1-2 posts placeholder con contenido estructurado real (no lorem ipsum) para validar el template contra contenido largo.

## Transversales

- **Layout compartido:** `Nav` (sticky, CTA de descarga) y `Footer` (legal, redes, CTA repetido) en un `Layout.astro` único.
- **Flujo de datos:** todo lo que es "lista de cosas" (features por segmento, posts, founders, testimonios) vive como datos estructurados — Content Collections donde aplica (blog), arrays tipados en `src/data/` para el resto (features por segmento, founders, testimonios). Esto es lo que permite marcar founders/testimonios como placeholder-ready sin tocar componentes cuando lleguen los datos reales.
- **Motion (GSAP):** se anota a nivel estructural dónde va a haber `ScrollTrigger` (gancho Don Chuy, pivot de audiencia en Home, transiciones de tabs en Features) para que el HTML se construya como bloques animables. El detalle de qué anima y cómo se resuelve en implementación.
- **Testing/validación:** sitio mayormente estático. Validación vía `npm run dev` + revisión visual, y `astro build` sin errores. Sin tests unitarios en esta etapa (no hay lógica de negocio compleja).

## Contenido pendiente de terceros (bloqueantes para llenar, no para construir)

- Links reales de App Store / Google Play
- Fotos, nombres, roles y bios de founders
- Testimonios reales de usuarios/negocios
- Sistema de diseño final (tipografía, tokens completos) — se define en implementación
- Pricing final de los planes de ads por tier (mencionado en Features sin cifras hasta entonces)

## Fuera de alcance (explícitamente diferido)

- Nav dividida por audiencia con subpáginas dedicadas por segmento (considerado como "Approach B" y descartado por ahora — evolución natural cuando haya tracción y contenido real por segmento)
- Categorías/tags de blog (sin volumen de contenido que las justifique)
- Contenido real de posts de blog de lanzamiento
- Sistema de pago/checkout, dashboard de negocios, cualquier feature de producto real (este es el sitio informativo, no la app)
