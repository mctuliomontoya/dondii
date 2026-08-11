# Revamp Art Deco del landing — Design

**Fecha:** 2026-08-10
**Estado:** Aprobado

## Contexto

El landing actual (`src/pages/index.astro`, 9 secciones en `src/components/home/`) vive bajo el sistema de diseño `DESIGN.md` "La Taquería de la Esquina": cálido, artesanal, plano en reposo, ladrillo tostado sobre papel de menú.

Este trabajo reemplaza ese sistema por completo con una dirección **Art Deco**: geometría monumental, fondo oscuro saturado, acentos joya (brass/esmeralda/garnet), tipografía ceremonial. Es un pivote de marca permanente, no una variante a evaluar — decidido explícitamente con el usuario.

**Alcance:** landing (`index.astro` + sus 9 secciones) + tokens globales (`DESIGN.md`, `src/styles/global.css`, `Layout.astro`) para que el resto del sitio no quede visualmente roto. Nav y Footer también migran, por continuidad. Founders/Features/Blog **no** se rediseñan sección por sección en este trabajo — solo heredan los tokens base.

## Arco emocional y estructura de secciones

Las 9 secciones existentes se mantienen (confirmado: no se convierten en anexos resumidos), pero cada una se reencuadra dentro de una de tres cámaras narrativas. El peso visual, el copy y el motion de cada sección declaran en qué momento del arco está el visitante.

**Cámara I — Asombro** *("este lugar tiene estándares")*
1. **Hero** — entrada monumental. Sunburst a escala completa, simetría total, Prata al máximo tamaño. El "maître d' corriendo la cuerda de terciopelo": el visitante todavía no sabe si va a entrar.
2. **Hook** — el manifiesto en voz alta (tesis: calidad vs. presupuesto publicitario). Autoridad tipográfica al máximo.
3. **Differentiators** — el mecanismo detrás de la promesa. Primera transición: de "mirá esto" a "dejame mostrarte cómo funciona". Menos monumental, más explicativo.

**Cámara II — Intimidad** *("y ve a quienes lo merecen")*
4. **ForDiners** — cámara personal 1. Tono baja a conversacional (Sora al frente).
5. **ForBusinesses** — cámara personal 2, mismo registro íntimo para el negocio chico.
6. **Testimonials** — pico de intimidad. Voces reales, sin ornamento de más.

**Cámara III — Convicción** *("sumate a algo con esta integridad")*
7. **FoundersTeaser** — la gente detrás del estándar. Vuelve a subir el peso visual, con autoridad pero sin la escala del hero.
8. **BlogTeaser** — evidencia editorial sostenida en el tiempo.
9. **FinalCta** — cierre. Eco deliberado del sunburst y la simetría del hero ("cerramos el círculo"). El copy encuadra la acción como entrar a un estándar ya en marcha, no como conversión.

## Sistema visual

### Paleta
Fondo base carbón verdoso oscuro (familia `#0b0f0d`), con tres acentos joya activos simultáneamente desde el hero:
- **Brass** (`#c9a35a`) — acento principal: CTAs, kickers, líneas de motivo geométrico.
- **Esmeralda** (`#5c8f6f`) — énfasis secundario, uso puntual.
- **Garnet** (`#c25a6a`) — énfasis puntual, mismo criterio de escasez que la "Regla del Rojo Escaso" del sistema anterior: señal, no fondo.
- Texto claro sobre oscuro: tono pergamino (`#f2ead9` / `#e8e2d4` según jerarquía).

### Tipografía
- **Display (`--font-display`):** Prata — títulos ceremoniales de sección (h1/h2).
- **Body (`--font-sans`):** Sora — párrafos, copy de card, tono conversacional bajo la formalidad del display.
- **Impacto (`--font-impact`, nuevo token):** NouvelleGrotesquerie — reservada a (a) palabras individuales de énfasis dentro de un titular Prata, y (b) todos los kickers/labels de sección, en mayúsculas con tracking amplio. Nunca se usa para bloques de texto corrido.

### Motivo geométrico
- **Sunburst** como firma principal — anclaje narrativo explícito al sol de Hermosillo, ciudad de origen de Dondii. Presencia completa en Hero y FinalCta (eco de cierre); versión reducida como detalle de foco en otras secciones.
- **Chevron escalonado** como acento secundario — divisores de sección y bordes de card, para no repetir el sunburst en cada superficie.

### Motion — "mecanismo de bronce"
Se conserva el patrón `reveal-on-scroll` existente (GSAP ScrollTrigger, idempotente vía `data-revealed`, respeta `prefers-reduced-motion` saltando a estado final con `gsap.set` — no negociable) con estos ajustes de carácter:
- **Easing:** `power2.out` → `expo.out`. Aceleración fuerte y frenado en seco — el "snap" mecánico del brief. Sin overshoot (nada de `elastic`/`back`), porque el brief pide motion confiado, no juguetón.
- **Revelaciones simétricas:** paneles/cards suman un `scaleX` sutil desde el centro (0.96→1) junto al fade — sensación de piezas encajando en su marco, no flotando.
- **Sunburst del hero:** rayos animados con `stroke-dasharray` al cargar la página, una sola vez (no en cada scroll) — el gesto de apertura ceremonial.

## Arquitectura técnica

- **`DESIGN.md`** — reemplazo completo: nuevo North Star, paleta, tipografía, motion, componentes. Actualiza el bloque `impeccable:product-schema` para que Prata/Sora/NouvelleGrotesquerie dejen de marcarse como fuera de sistema.
- **`src/styles/global.css`** — nuevo bloque `@theme`: `--color-ground`, `--color-brass`, `--color-emerald`, `--color-garnet`, `--color-parchment`; `--font-display: "Prata"`, `--font-sans: "Sora"`, `--font-impact: "NouvelleGrotesquerie"`. Se retiran los imports de Space Grotesk/Inter; se agrega Prata/Sora (vía `@fontsource` si hay paquete disponible, si no Google Fonts self-hosted) más un `@font-face` local para NouvelleGrotesquerie apuntando al archivo ya presente en `public/fonts/`.
- **`Layout.astro`** — `theme-color` del meta tag pasa del ladrillo tostado al nuevo ground oscuro; `bg-paper` del body pasa al nuevo fondo.
- **Componente nuevo:** `Sunburst.astro` (SVG reutilizable, con prop de tamaño/variante) para no duplicar el SVG del motivo principal en cada sección que lo use.
- **Componentes existentes migrados:** los 9 `.astro` de `src/components/home/` (Hero, Hook, Differentiators, ForDiners, ForBusinesses, Testimonials, FoundersTeaser, BlogTeaser, FinalCta) reciben nuevo copy/jerarquía por cámara narrativa y el nuevo tratamiento visual. `Nav` y `Footer` en `src/components/layout/` migran a los nuevos tokens para continuidad visual del sitio completo.
- **Fuera de alcance:** rediseño sección-por-sección de `founders.astro`, `features.astro` y `blog/*` — solo heredan tokens base (no quedan visualmente rotos, pero su contenido/estructura no se retrabaja acá).

## Testing / verificación

- Revisión visual en navegador de las 9 secciones en desktop y mobile tras la migración (dev server).
- Verificar `prefers-reduced-motion` sigue saltando a estado final sin animación.
- Correr `/impeccable audit` sobre el landing una vez migrado, para confirmar que los nuevos tokens (Prata/Sora/NouvelleGrotesquerie, paleta joya) quedan declarados en `DESIGN.md` y el hook deja de marcarlos como fuera de sistema.
- Chequeo de contraste texto/fondo (pergamino sobre carbón, brass sobre carbón) para accesibilidad AA, dado el fondo oscuro saturado.
