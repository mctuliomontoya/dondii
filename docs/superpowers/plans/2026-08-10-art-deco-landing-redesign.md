# Revamp Art Deco del Landing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el sistema de diseño del landing de Dondii ("La Taquería de la Esquina") por una dirección Art Deco completa — fondo oscuro carbón verdoso, acentos joya (brass/esmeralda/garnet), tipografía ceremonial (Prata + Sora + NouvelleGrotesquerie), motivo sunburst — organizada en un arco narrativo de tres cámaras (asombro → intimidad → convicción) sobre las 9 secciones existentes del home.

**Architecture:** Los tokens de color y tipografía viven en `src/styles/global.css` bajo `@theme` (Tailwind 4). En vez de renombrar las custom properties existentes (`--color-primary`, `--color-ink`, `--color-paper`, etc.), se **repuntan sus valores** a la nueva paleta oscura — esto es lo que permite que páginas fuera de alcance (`founders.astro`, `features.astro`, `blog/*`) hereden el nuevo sistema sin tocarlas, cumpliendo el requisito de "tokens globales sin romper el resto del sitio". Se agregan dos tokens nuevos (`--color-emerald`, `--font-impact`) que no tienen equivalente en el sistema viejo. Los 9 componentes de `src/components/home/`, `Nav.astro`, `Footer.astro` y `Layout.astro` se migran explícitamente con clases/copy nuevos porque están en alcance.

**Tech Stack:** Astro 7, Tailwind 4 (`@theme` CSS-first config), GSAP 3 + ScrollTrigger (ya integrado vía `src/scripts/motion.ts`), `@fontsource` para self-hosting de Google Fonts, fuente custom local (`NouvelleGrotesquerie-Regular.woff2`, ya presente en `public/fonts/`).

## Global Constraints

- El manejo de `prefers-reduced-motion` es no negociable: toda animación nueva debe saltar a estado final vía `gsap.set` (patrón ya existente en `src/scripts/motion.ts`) o su equivalente CSS `@media (prefers-reduced-motion: reduce)`.
- Ninguna transición usa easing con overshoot (`elastic`, `back`) — el motion debe sentirse mecánico y confiado, no juguetón. Easing de referencia: `expo.out` (GSAP) / `cubic-bezier(0.16, 1, 0.3, 1)` (CSS).
- `NouvelleGrotesquerie` se usa únicamente para (a) kickers/labels de sección en mayúsculas y (b) palabras individuales de énfasis dentro de un titular Prata. Nunca para párrafos ni bloques de texto corrido.
- Garnet (`--color-tomato`) y esmeralda (`--color-emerald`) son acentos escasos y puntuales — nunca color de fondo de una superficie grande.
- El sunburst es el motivo geométrico principal; el chevron escalonado es acento secundario para bordes/divisores. No se introducen terceros motivos decorativos.
- Fuera de alcance: reescritura de contenido/estructura de `founders.astro`, `features.astro`, `blog/index.astro`, `blog/[slug].astro` — solo heredan tokens.
- Las 9 secciones del home (Hero, Hook, Differentiators, ForDiners, ForBusinesses, Testimonials, FoundersTeaser, BlogTeaser, FinalCta) se mantienen como secciones propias — ninguna se convierte en anexo resumido.

---

## Mapeo de tokens (valores viejos → nuevos)

| Token | Rol | Valor viejo | Valor nuevo |
|---|---|---|---|
| `--color-primary` | Acento principal (brass) | `#812800` | `#c9a35a` |
| `--color-primary-dark` | Hover/estado activo de brass | `#5c1d00` | `#a8863f` |
| `--color-primary-light` | Tinte suave de brass (bordes, focus ring, uso con `/NN` opacidad) | `#fecba8` | `#6b5b3a` |
| `--color-tomato` | Señal viva escasa (garnet) | `#a63a0b` | `#c25a6a` |
| `--color-ink` | Texto principal | `#1a1310` | `#f2ead9` |
| `--color-paper` | Fondo base de página | `#fff8f2` | `#0b0f0d` |
| `--color-surface` | Superficie elevada (cards) | `#ffffff` | `#141b17` |
| `--color-emerald` *(nuevo)* | Acento secundario escaso | — | `#5f9f7a` |
| `--font-display` | Display/headline | Space Grotesk | Prata |
| `--font-sans` | Body | Inter | Sora |
| `--font-impact` *(nuevo)* | Kickers + palabras de énfasis | — | NouvelleGrotesquerie |

**Nota importante:** `--color-ink` y `--color-paper` se invierten en luminancia (texto ahora claro, fondo ahora oscuro). Esto significa que cualquier sección fuera de alcance que use el patrón viejo `bg-ink text-paper` (banner "invertido" sobre fondo claro) pasa a renderizar como un panel claro con texto oscuro sobre una página ahora oscura por defecto — es un efecto secundario aceptado (un panel-vitrina ocasional), no un bug. El único caso real en el código es `founders.astro:38`, fuera de alcance de este plan.

---

### Task 1: Reescribir `DESIGN.md` y `.impeccable/design.json`

**Files:**
- Modify: `DESIGN.md` (reemplazo completo)
- Modify: `.impeccable/design.json` (reemplazo completo)

**Interfaces:**
- Produces: la fuente de verdad textual del sistema de diseño que las siguientes tasks implementan en código. Ningún código depende de este archivo en build time — es documentación.

- [ ] **Step 1: Reescribir `DESIGN.md` completo**

```markdown
---
name: Dondii
description: Plataforma de descubrimiento gastronómico para México — donde la calidad se ve.
colors:
  brass: "#c9a35a"
  brass-oscuro: "#a8863f"
  brass-tenue: "#6b5b3a"
  garnet: "#c25a6a"
  esmeralda: "#5f9f7a"
  carbon-verdoso: "#0b0f0d"
  superficie-carbon: "#141b17"
  pergamino: "#f2ead9"
typography:
  display:
    fontFamily: "Prata, ui-serif, Georgia, serif"
    fontWeight: 400
  headline:
    fontFamily: "Prata, ui-serif, Georgia, serif"
    fontWeight: 400
  body:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 400
  label:
    fontFamily: "NouvelleGrotesquerie, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 400
rounded:
  pill: "9999px"
  card: "4px"
  panel: "4px"
spacing:
  section-y: "6rem"
  section-y-lg: "7rem"
  container-x: "1.5rem"
  card-p: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.carbon-verdoso}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.brass-oscuro}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.pergamino}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  card:
    backgroundColor: "{colors.superficie-carbon}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-p}"
---

# Design System: Dondii

## Overview

**Creative North Star: "El Mérito No Necesita Gritar"**

Dondii se viste como el lugar que se ganó su lugar a pulso — no con presupuesto, con estándares. La paleta vive en un carbón verdoso profundo, casi negro, con brass (dorado cálido) como acento de identidad y dos joyas de uso escaso — esmeralda y garnet — reservadas a momentos de énfasis puntual. La tipografía combina Prata (ceremonial, casi tallada) con Sora (cálida, conversacional, la voz de un maître d' que baja el tono para una aclaración sincera). El motivo geométrico de firma es el sunburst — con anclaje narrativo real al sol de Hermosillo, ciudad de origen de Dondii — con el chevron escalonado como acento secundario en bordes y divisores.

El motion se comporta como un mecanismo de bronce bien aceitado: easing decidido (`expo.out`), revelaciones simétricas (fade + `scaleX` sutil desde el centro), nunca rebote ni overshoot. La visibilidad en Dondii se enmarca como un honor que se extiende, no una feature que se vende — el diseño tiene que sostener esa sensación en cada sección.

**Rechazos confirmados:** nada de easing con rebote/overshoot (`elastic`, `back`); nada de un cuarto motivo geométrico compitiendo con sunburst/chevron; `NouvelleGrotesquerie` nunca en párrafos corridos; garnet y esmeralda nunca como color de fondo de superficies grandes — son señal, no ambiente.

**Key Characteristics:**
- Monumental en la entrada (Hero, FinalCta), progresivamente íntimo hacia el centro de la página
- Fondo oscuro por defecto en todo el sitio — la claridad es la excepción puntual, no la norma
- Sunburst como firma repetida, nunca decoración aislada sin propósito
- Prata para autoridad ceremonial, Sora para calidez conversacional, NouvelleGrotesquerie para el golpe seco de un kicker o una palabra de énfasis
- Bordes precisos en vez de sombras pesadas — la profundidad aparece solo como respuesta a interacción

## Colors

Paleta de vitrina nocturna: carbón verdoso profundo como fondo constante, brass como firma de marca, esmeralda y garnet como joyas puntuales.

### Primary
- **Brass** (`#c9a35a`): color de marca — CTAs primarios, kickers, bordes de foco, el motivo sunburst. Es el color que "es Dondii" ahora.
- **Brass Oscuro** (`#a8863f`): estado hover/activo de todo lo que usa Brass como base. Nunca aparece en reposo.
- **Brass Tenue** (`#6b5b3a`): tinte de soporte — bordes suaves de card (siempre con opacidad, ej. `/60`), fondos de acento diluido. Es el brass bajado a superficie de ambiente.

### Secondary (joyas escasas)
- **Garnet** (`#c25a6a`): señal viva puntual — badges de pulso, subrayado de hover en nav/footer. Escaso por diseño: su rareza es lo que lo hace señal.
- **Esmeralda** (`#5f9f7a`): segundo acento de énfasis, igual de escaso que garnet — nunca compiten por el mismo elemento a la vez.

### Neutral
- **Carbón Verdoso** (`#0b0f0d`): fondo base de toda la página.
- **Superficie Carbón** (`#141b17`): superficie elevada — fondo de cards, un tono más claro que el carbón base para dar separación sutil sin sombra pesada.
- **Pergamino** (`#f2ead9`): texto principal sobre fondo oscuro.

### Named Rules
**La Regla de las Joyas Escasas.** Garnet y esmeralda se usan solo para señales puntuales de énfasis — nunca cubren superficies grandes. Cada una aparece sola en su momento, nunca compitiendo la una con la otra en el mismo elemento.

## Typography

**Display Font:** Prata (fallback ui-serif, Georgia, serif) — peso único 400, no tiene variante bold; su carácter ceremonial viene de la forma de la letra, no del peso.
**Body Font:** Sora (fallback ui-sans-serif, system-ui, sans-serif).
**Impact/Label Font:** NouvelleGrotesquerie (local, `public/fonts/`) — reservada a kickers y palabras de énfasis puntuales dentro de un titular.

### Hierarchy
- **Display / Headline** (`font-normal`, `text-3xl` a `text-5xl`, `leading-tight`): títulos de sección (`h1`/`h2`) en Prata. Como Prata no tiene peso bold, la jerarquía se logra con tamaño y tracking, no con `font-black`.
- **Kicker/Label** (`font-normal`, `text-xs`/`text-sm`, `uppercase`, `tracking-[0.12em]` o mayor): en NouvelleGrotesquerie, siempre en brass.
- **Body** (`font-normal`, base Sora): párrafos, copy de card. Ancho de línea de artículo limitado a `max-w-[70ch]`.

## Motivo geométrico

**Sunburst** — rayos radiales desde un centro sólido, motivo principal. Aparece a escala completa y animado (stroke-dasharray draw-in, una sola vez al cargar) en el Hero; a escala reducida y estático como detalle de foco en otras secciones; a escala completa de nuevo como eco de cierre en FinalCta.

**Chevron escalonado** — acento secundario para bordes y divisores entre secciones, evita repetir el sunburst en cada superficie.

## Motion

Ver `src/scripts/motion.ts`. Patrón `reveal-on-scroll`: opacity 0→1, translateY 32px→0, `scaleX` 0.96→1 desde el centro, duration 0.7s, ease `expo.out`, stagger 0.08s, disparado por GSAP ScrollTrigger a `top 82%` del viewport. Idempotente vía `data-revealed`. Respeta `prefers-reduced-motion` saltando a estado final con `gsap.set`.
```

- [ ] **Step 2: Reescribir `.impeccable/design.json` completo**

```json
{
  "schemaVersion": 2,
  "generatedAt": "2026-08-10T00:00:00.000Z",
  "title": "Design System: Dondii",
  "extensions": {
    "colorMeta": {
      "brass": {
        "role": "primary",
        "displayName": "Brass",
        "canonical": "#c9a35a",
        "tonalRamp": ["#241b0c", "#3f2f15", "#6b5b3a", "#a8863f", "#c9a35a", "#dcbc7e", "#ecd6ab", "#f8ecd6"]
      },
      "brass-oscuro": {
        "role": "primary-hover",
        "displayName": "Brass Oscuro",
        "canonical": "#a8863f",
        "tonalRamp": ["#1c1409", "#332510", "#54401c", "#7c5f2c", "#a8863f", "#c4a765", "#dcc794", "#f0e3c4"]
      },
      "brass-tenue": {
        "role": "primary-light",
        "displayName": "Brass Tenue",
        "canonical": "#6b5b3a",
        "tonalRamp": ["#0f0c07", "#1e190f", "#372c1b", "#52422a", "#6b5b3a", "#8c795a", "#b0a081", "#d6ccb6"]
      },
      "garnet": {
        "role": "secondary",
        "displayName": "Garnet",
        "canonical": "#c25a6a",
        "tonalRamp": ["#280c11", "#4a1620", "#742534", "#9c3a4c", "#c25a6a", "#d6828f", "#e6afb8", "#f5dade"]
      },
      "esmeralda": {
        "role": "tertiary",
        "displayName": "Esmeralda",
        "canonical": "#5f9f7a",
        "tonalRamp": ["#0e1b14", "#1c3324", "#2f5138", "#456f4f", "#5f9f7a", "#87ba9c", "#b3d6c1", "#dcede4"]
      },
      "carbon-verdoso": {
        "role": "neutral",
        "displayName": "Carbón Verdoso",
        "canonical": "#0b0f0d",
        "tonalRamp": ["#050705", "#0b0f0d", "#131a17", "#1e2925", "#2e3d37", "#455850", "#6b8074", "#9db3a6"]
      },
      "superficie-carbon": {
        "role": "neutral",
        "displayName": "Superficie Carbón",
        "canonical": "#141b17",
        "tonalRamp": ["#070a08", "#0e1310", "#141b17", "#1f2b25", "#2f4038", "#485b51", "#6e8479", "#9fb2a8"]
      },
      "pergamino": {
        "role": "neutral",
        "displayName": "Pergamino",
        "canonical": "#f2ead9",
        "tonalRamp": ["#4a4231", "#6e644a", "#998c68", "#c3b48d", "#e2d6bc", "#eee3ce", "#f2ead9", "#faf6ec"]
      }
    },
    "typographyMeta": {
      "display": { "displayName": "Display / Prata", "purpose": "Títulos de sección — momento ceremonial. Peso único 400, jerarquía por tamaño/tracking, no por bold." },
      "body": { "displayName": "Body / Sora", "purpose": "Todo el cuerpo de lectura: párrafos, copy de card, prosa de blog." },
      "label": { "displayName": "Label / NouvelleGrotesquerie", "purpose": "Kickers de sección y palabras individuales de énfasis dentro de un titular Prata. Nunca párrafos corridos." }
    },
    "shadows": [
      { "name": "card-hover", "value": "0 10px 30px -10px color-mix(in srgb, #c9a35a 14%, transparent)", "purpose": "Aparece solo en :hover de card, junto con -translate-y-1. Confirma interactividad, nunca jerarquía en reposo." }
    ],
    "motion": [
      { "name": "reveal-on-scroll", "value": "opacity 0→1, translateY 32px→0, scaleX 0.96→1 desde el centro, duration 0.7s, ease expo.out, stagger 0.08s", "purpose": "GSAP ScrollTrigger, dispara a top 82% del viewport; idempotente vía data-revealed. Respeta prefers-reduced-motion (salta a estado final con gsap.set)." },
      { "name": "sunburst-draw", "value": "stroke-dashoffset 80→0, duration 1.4s, ease cubic-bezier(0.16,1,0.3,1), una sola vez al cargar", "purpose": "Gesto de apertura ceremonial del sunburst en el Hero. Respeta prefers-reduced-motion (sin animación, estado final directo)." }
    ]
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add DESIGN.md .impeccable/design.json
git commit -m "docs(design): reemplazar sistema de diseño por dirección Art Deco"
```

---

### Task 2: Fuentes y tokens globales (`global.css`, `package.json`)

**Files:**
- Modify: `package.json`
- Modify: `src/styles/global.css`

**Interfaces:**
- Produces: custom properties `--color-primary`, `--color-primary-dark`, `--color-primary-light`, `--color-tomato`, `--color-ink`, `--color-paper`, `--color-surface`, `--color-emerald`, `--font-display`, `--font-sans`, `--font-impact` disponibles como utilidades Tailwind (`bg-primary`, `text-ink`, `font-display`, `font-impact`, etc.) en toda la app.

- [ ] **Step 1: Instalar paquetes de fuentes**

```bash
npm install @fontsource/prata @fontsource/sora
npm uninstall @fontsource/space-grotesk @fontsource/inter
```

- [ ] **Step 2: Reescribir `src/styles/global.css`**

```css
@import "@fontsource/prata/400.css";
@import "@fontsource/sora/400.css";
@import "@fontsource/sora/500.css";
@import "@fontsource/sora/600.css";
@import "tailwindcss";

@font-face {
  font-family: "NouvelleGrotesquerie";
  src: url("/fonts/NouvelleGrotesquerie-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@theme {
  --color-primary: #c9a35a;
  --color-primary-dark: #a8863f;
  --color-tomato: #c25a6a;
  --color-primary-light: #6b5b3a;
  --color-emerald: #5f9f7a;

  --color-ink: #f2ead9;
  --color-paper: #0b0f0d;
  --color-surface: #141b17;

  --font-display: "Prata", ui-serif, Georgia, serif;
  --font-sans: "Sora", ui-sans-serif, system-ui, sans-serif;
  --font-impact: "NouvelleGrotesquerie", ui-sans-serif, system-ui, sans-serif;
}
```

- [ ] **Step 3: Copiar la fuente custom a `public/fonts/` con nombre sin espacios**

El archivo actual tiene un espacio en el nombre (`NouvelleGrotesquerie-Regular 1.woff2`), lo que rompe la URL del `@font-face` de arriba. Normalizarlo:

```bash
mv "public/fonts/NouvelleGrotesquerie-Regular 1.woff2" "public/fonts/NouvelleGrotesquerie-Regular.woff2"
```

- [ ] **Step 4: Verificar que el build resuelve las fuentes**

Run: `npm run astro -- check`
Expected: sin errores de tipo. Luego iniciar el dev server en background (`astro dev --background`, por convención del proyecto) y confirmar en `http://localhost:4321` que el body ya carga con Sora y no tira 404 en devtools Network para `/fonts/NouvelleGrotesquerie-Regular.woff2`.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/styles/global.css public/fonts
git commit -m "feat(design): migrar tokens globales y tipografía a Prata/Sora/NouvelleGrotesquerie"
```

---

### Task 3: Componente `Sunburst.astro`

**Files:**
- Create: `src/components/ui/Sunburst.astro`

**Interfaces:**
- Produces: `<Sunburst variant="full" | "compact" | "accent" animated={boolean} class={string} />` — SVG que hereda color vía `currentColor`, así que el caller controla el tinte con una clase Tailwind de texto (ej. `text-primary`, `text-emerald`).
- Consumes: nada (componente hoja).

- [ ] **Step 1: Crear el componente**

```astro
---
interface Props {
  variant?: "full" | "compact" | "accent";
  animated?: boolean;
  class?: string;
}

const { variant = "full", animated = false, class: className = "" } = Astro.props;

const rayCounts: Record<string, number> = { full: 16, compact: 10, accent: 6 };
const sizes: Record<string, number> = { full: 420, compact: 200, accent: 88 };

const rays = rayCounts[variant];
const size = sizes[variant];
const innerR = 18;
const outerR = 92;

const lines = Array.from({ length: rays }, (_, i) => {
  const angle = (i / rays) * Math.PI * 2;
  return {
    x1: 100 + Math.cos(angle) * innerR,
    y1: 100 + Math.sin(angle) * innerR,
    x2: 100 + Math.cos(angle) * outerR,
    y2: 100 + Math.sin(angle) * outerR,
  };
});
---

<svg
  class:list={["sunburst", animated && "sunburst--animated", className]}
  viewBox="0 0 200 200"
  width={size}
  height={size}
  aria-hidden="true"
  role="presentation"
>
  <g stroke="currentColor" stroke-width="1.5" fill="none">
    {lines.map((l) => <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />)}
    <circle cx="100" cy="100" r="14" fill="currentColor" stroke="none" />
  </g>
</svg>

<style>
  .sunburst {
    display: block;
  }

  .sunburst--animated line {
    stroke-dasharray: 80;
    stroke-dashoffset: 80;
    animation: sunburst-draw 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    animation-delay: calc(var(--ray-delay, 0) * 40ms);
  }

  @keyframes sunburst-draw {
    to {
      stroke-dashoffset: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sunburst--animated line {
      animation: none;
      stroke-dashoffset: 0;
    }
  }
</style>

<script>
  document.querySelectorAll<SVGLineElement>(".sunburst--animated line").forEach((line, i) => {
    line.style.setProperty("--ray-delay", String(i));
  });
</script>
```

- [ ] **Step 2: Verificar visualmente**

Crear temporalmente `<Sunburst variant="full" animated class="text-primary" />` en `src/pages/index.astro` antes del `<Hero />`, correr `astro dev --background`, confirmar en el navegador que los 16 rayos se dibujan progresivamente al cargar. Quitar el `<Sunburst>` de prueba antes de continuar (se integra de verdad en la Task 8).

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Sunburst.astro
git commit -m "feat(ui): agregar componente Sunburst reutilizable"
```

---

### Task 4: Motion — easing mecánico y revelación simétrica

**Files:**
- Modify: `src/scripts/motion.ts`

**Interfaces:**
- Consumes: nada nuevo.
- Produces: mismo API pública (`revealOnScroll(selector)`, `revealNow(selector)`) — el cambio es solo de curva de animación, ningún caller se modifica.

- [ ] **Step 1: Actualizar `revealOnScroll` — easing y scaleX simétrico**

Reemplazar el bloque `targets.forEach` en `src/scripts/motion.ts`:

```typescript
targets.forEach((el, index) => {
  gsap.fromTo(
    el,
    { opacity: 0, y: 32, scaleX: 0.96, transformOrigin: "center" },
    {
      opacity: 1,
      y: 0,
      scaleX: 1,
      duration: 0.7,
      delay: index * 0.08,
      ease: "expo.out",
      scrollTrigger: {
        trigger: el,
        start: "top 82%",
      },
    },
  );
});
```

- [ ] **Step 2: Actualizar `revealNow` — mismo easing por consistencia**

En la llamada `gsap.fromTo` de `revealNow`, cambiar `ease: "power2.out"` por `ease: "expo.out"` (sin agregar `scaleX` acá — es para cambios de tab, el scale simétrico queda reservado a las revelaciones de sección).

- [ ] **Step 3: Verificar manualmente**

Con el dev server corriendo, hacer scroll por el home y confirmar que las secciones con clase `.reveal` entran con el nuevo snap (más seco que antes, sin rebote). Activar "reduce motion" en las preferencias del sistema operativo y recargar — confirmar que las secciones aparecen directamente en su posición final, sin animación.

- [ ] **Step 4: Commit**

```bash
git add src/scripts/motion.ts
git commit -m "feat(motion): easing expo.out y scaleX simétrico para revelaciones tipo mecanismo"
```

---

### Task 5: `Layout.astro` — theme-color

**Files:**
- Modify: `src/layouts/Layout.astro:9`

**Interfaces:**
- Consumes: ninguno nuevo.
- Produces: ninguno nuevo — cambio de un solo valor.

- [ ] **Step 1: Actualizar el meta theme-color**

```astro
<meta name="theme-color" content="#0b0f0d" />
```

- [ ] **Step 2: Verificar**

Recargar el dev server y confirmar en devtools que el `<meta name="theme-color">` renderizado tiene el nuevo valor.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "fix(layout): actualizar theme-color al carbón verdoso del nuevo sistema"
```

---

### Task 6: Migrar `Nav.astro`

**Files:**
- Modify: `src/components/layout/Nav.astro`

**Interfaces:**
- Consumes: tokens de Task 2 (`bg-paper`, `text-ink`, `text-primary`, etc.), ya heredados automáticamente por las clases existentes — este task ajusta clases puntuales que quedaban mal con la inversión de luminancia.

- [ ] **Step 1: Ajustar el header sticky**

En `src/components/layout/Nav.astro:12`, el fondo semitransparente + blur ya funciona con los tokens invertidos (`bg-paper/85` ahora es carbón semitransparente), pero el borde debe usar el nuevo brass tenue explícitamente para que se vea como filo dorado, no como remanente del sistema viejo:

```astro
<header class="sticky top-0 z-50 border-b border-primary-light/40 bg-paper/90 backdrop-blur-md">
```

- [ ] **Step 2: Wordmark en Prata**

Confirmar que `font-display` en el wordmark (línea 16) ya resuelve a Prata vía el token — no requiere cambio de clase, pero como Prata no tiene peso bold, quitar `font-bold` si lo hubiera duplicado con `font-display` (no lo tiene actualmente, no-op, solo verificar visualmente que no se ve con bold sintético del navegador).

- [ ] **Step 3: Subrayado de hover a garnet (ya lo es vía `bg-tomato`)**

La línea 31 (`bg-tomato`) ya hereda garnet automáticamente por el token — sin cambio de clase necesario. Confirmar visualmente.

- [ ] **Step 4: Verificar responsive**

Con el dev server corriendo, abrir el home en viewport mobile (devtools) y confirmar que el menú hamburguesa sigue funcionando y el menú mobile (`#mobile-menu`, fondo `bg-paper`) se ve carbón oscuro con texto claro legible.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Nav.astro
git commit -m "style(nav): ajustar borde y superficie al nuevo sistema Art Deco"
```

---

### Task 7: Migrar `Footer.astro`

**Files:**
- Modify: `src/components/layout/Footer.astro:12`

**Interfaces:**
- Consumes: tokens de Task 2.

- [ ] **Step 1: Corregir el patrón invertido**

El footer actual usa `bg-ink text-paper` para forzar un banner oscuro sobre el sitio claro viejo. Con los tokens invertidos eso ahora produce un footer **claro** (pergamino) con texto oscuro — lo opuesto a lo que se quiere (el footer debe seguir oscuro, coherente con el resto de la página ya oscura por defecto). Cambiar a:

```astro
<footer class="border-t border-primary-light/30 bg-paper text-ink">
```

- [ ] **Step 2: Verificar**

Confirmar en el navegador que el footer se ve carbón oscuro con texto pergamino, consistente con el resto de la página — no como banda invertida.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.astro
git commit -m "fix(footer): corregir clases bg-ink/text-paper invertidas por el nuevo sistema oscuro"
```

---

### Task 8: Migrar `Hero.astro` (Cámara I — Asombro)

**Files:**
- Modify: `src/components/home/Hero.astro`

**Interfaces:**
- Consumes: `Sunburst` de Task 3 (`import Sunburst from "../ui/Sunburst.astro"`), tokens de Task 2.

- [ ] **Step 1: Reemplazar el contenido completo del componente**

El aurora/grain del sistema viejo no encaja con "geometría confiada, simetría que se siente ganada" del brief — se reemplaza por el sunburst animado como pieza central detrás del título.

```astro
---
import DownloadButtons from "../layout/DownloadButtons.astro";
import Sunburst from "../ui/Sunburst.astro";
---

<section class="relative isolate overflow-hidden bg-paper">
  <div class="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 text-primary/25" aria-hidden="true">
    <Sunburst variant="full" animated />
  </div>

  <div class="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 py-28 text-center md:py-36">
    <span class="inline-flex items-center gap-2 rounded-full border border-primary-light/60 px-4 py-1.5 font-impact text-xs uppercase tracking-[0.14em] text-primary">
      <span class="relative flex h-2 w-2">
        <span class="absolute inline-flex h-full w-full animate-ping motion-reduce:animate-none rounded-full bg-tomato opacity-75"></span>
        <span class="relative inline-flex h-2 w-2 rounded-full bg-tomato"></span>
      </span>
      Ya disponible en Hermosillo
    </span>

    <h1 class="v1-title max-w-3xl text-balance font-display text-5xl font-normal leading-[1.05] tracking-tight text-ink md:text-7xl">
      <span class="v1-word" style="--i:0">Donde la</span>
      <span class="v1-word text-primary" style="--i:1">calidad</span>
      <span class="v1-word" style="--i:2">se ve.</span>
    </h1>

    <p class="v1-fade max-w-xl text-lg leading-relaxed text-ink/75" style="--i:3">
      La app de descubrimiento gastronómico donde gana quien cocina mejor —
      no quien paga más por publicidad. Encuentra tu próximo lugar favorito,
      hoy mismo, en Hermosillo.
    </p>

    <div class="v1-fade flex flex-wrap items-center justify-center gap-3 mt-2" style="--i:4">
      <DownloadButtons />
    </div>
  </div>
</section>

<style>
  .v1-title {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0 0.4ch;
  }

  .v1-word {
    display: inline-block;
    animation: v1-word-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(var(--i) * 120ms + 150ms);
  }

  @keyframes v1-word-in {
    from {
      clip-path: inset(0 100% 0 0);
      transform: translateY(0.4em);
      opacity: 0;
    }
    to {
      clip-path: inset(0 0 0 0);
      transform: translateY(0);
      opacity: 1;
    }
  }

  .v1-fade {
    animation: v1-fade-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(var(--i) * 120ms + 150ms);
  }

  @keyframes v1-fade-in {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .v1-word,
    .v1-fade {
      animation: none !important;
      opacity: 1 !important;
      clip-path: none !important;
      transform: none !important;
    }
  }
</style>
```

Se elimina el `<script>` de efecto magnético de los botones del sistema viejo (era parte del look "consumer app juguetón" que el brief pide evitar — el motion Art Deco es preciso, no interactivo-lúdico) y el uso directo de `<DownloadButtons />` reemplaza los links hardcodeados del hero viejo, evitando duplicar los `TODO` de App Store/Google Play que ya viven en ese componente compartido.

- [ ] **Step 2: Verificar visualmente**

Con el dev server corriendo, abrir el home y confirmar: el sunburst se dibuja al cargar detrás del título, el título entra palabra por palabra, el badge "Ya disponible en Hermosillo" usa NouvelleGrotesquerie en mayúsculas con el punto garnet pulsando. Probar con `prefers-reduced-motion` activado — el sunburst y el título deben aparecer directo en estado final.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/Hero.astro
git commit -m "feat(hero): rediseño Art Deco con sunburst animado — Cámara I"
```

---

### Task 9: Migrar `Hook.astro` (Cámara I — el manifiesto en voz alta)

**Files:**
- Modify: `src/components/home/Hook.astro`

**Interfaces:**
- Consumes: tokens de Task 2. Requiere la clase `reveal` (consumida por `revealOnScroll` en `index.astro`, sin cambios de esa integración).

- [ ] **Step 1: Reescribir con kicker y barras recoloreadas**

```astro
---
---

<section class="reveal border-y border-primary-light/30 bg-surface py-24 md:py-28">
  <div class="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
    <div>
      <p class="font-impact text-xs uppercase tracking-[0.14em] text-primary">— El mérito —</p>
      <h2 class="mt-3 max-w-xl font-display text-3xl font-normal leading-tight text-ink md:text-4xl">
        Don Chuy vende las mejores aguas frescas de la cuadra. 4.8 estrellas,
        fila en la puerta. Y aun así, cada mes, una franquicia con 3.2 le
        gana el cliente.
      </h2>
      <div class="mt-6 max-w-xl space-y-4 text-ink/75">
        <p>
          No es que cocinen mejor. Es que pagan más por aparecer primero.
          Las plataformas que usamos todos los días reparten la atención al
          mejor postor — no a quien mejor sazona.
        </p>
        <p class="font-semibold text-ink">
          Dondii existe para romper esa lógica: una plataforma donde la
          calidad se vuelve visible, y el negocio familiar compite de tú a
          tú contra cualquier cadena.
        </p>
      </div>
      <p class="mt-6 max-w-xl font-display text-lg italic text-primary md:text-xl">
        "No estamos construyendo una app. Estamos construyendo la
        infraestructura que le permite al comercio local competir en el
        siglo 21."
      </p>
    </div>

    <div class="flex flex-col gap-10">
      <div>
        <p class="mb-3 font-impact text-xs uppercase tracking-[0.12em] text-ink/60">
          Calificación en reseñas
        </p>
        <div class="space-y-3">
          <div>
            <div class="mb-1 flex items-baseline justify-between text-sm">
              <span class="font-semibold text-ink">Don Chuy</span>
              <span class="font-display text-lg text-emerald">4.8</span>
            </div>
            <div class="h-2.5 w-full overflow-hidden rounded-full bg-ink/10">
              <div class="h-full w-[96%] rounded-full bg-emerald"></div>
            </div>
          </div>
          <div>
            <div class="mb-1 flex items-baseline justify-between text-sm">
              <span class="text-ink/60">La franquicia</span>
              <span class="font-display text-lg text-ink/50">3.2</span>
            </div>
            <div class="h-2.5 w-full overflow-hidden rounded-full bg-ink/10">
              <div class="h-full w-[64%] rounded-full bg-ink/25"></div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p class="mb-3 font-impact text-xs uppercase tracking-[0.12em] text-ink/60">
          Presupuesto publicitario
        </p>
        <div class="space-y-3">
          <div>
            <div class="mb-1 flex items-baseline justify-between text-sm">
              <span class="font-semibold text-ink">Don Chuy</span>
              <span class="font-display text-lg text-emerald">casi nada</span>
            </div>
            <div class="h-2.5 w-full overflow-hidden rounded-full bg-ink/10">
              <div class="h-full w-[6%] rounded-full bg-emerald"></div>
            </div>
          </div>
          <div>
            <div class="mb-1 flex items-baseline justify-between text-sm">
              <span class="text-ink/60">La franquicia</span>
              <span class="font-display text-lg text-ink/50">todo el mes</span>
            </div>
            <div class="h-2.5 w-full overflow-hidden rounded-full bg-ink/10">
              <div class="h-full w-full rounded-full bg-ink/25"></div>
            </div>
          </div>
        </div>
      </div>

      <p class="text-sm text-ink/55">
        Así reparte la atención cualquier plataforma que cobra por
        publicidad. Dondii la reparte distinto.
      </p>
    </div>
  </div>
</section>
```

Nota: las barras de "Don Chuy" (el negocio de mérito real) usan esmeralda — es el único lugar de la página donde esmeralda representa explícitamente "calidad confirmada", coherente con la Regla de las Joyas Escasas.

- [ ] **Step 2: Verificar**

Confirmar que la sección se revela con el nuevo motion (Task 4) al hacer scroll, y que el contraste de las barras esmeralda sobre `bg-surface` es legible.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/Hook.astro
git commit -m "feat(hook): recolorear manifiesto con kicker y barras esmeralda — Cámara I"
```

---

### Task 10: Migrar `Differentiators.astro` + reordenar `index.astro` (Cámara I → II)

**Files:**
- Modify: `src/components/home/Differentiators.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: tokens de Task 2.
- Produces: nuevo orden de secciones en `index.astro` — `Differentiators` pasa a ocupar la posición 3 (cierre de Cámara I), antes de `ForDiners`/`ForBusinesses` (Cámara II). El orden viejo tenía `ForDiners`/`ForBusinesses` antes de `Differentiators`; el spec aprobado pide lo contrario.

- [ ] **Step 1: Reescribir `Differentiators.astro` con chevron divisor**

```astro
---
const points = [
  {
    negation: "No delivery",
    title: "No competimos con la logística",
    body: "No repartimos pedidos ni peleamos tiempos de entrega. El corazón de Dondii es el descubrimiento: encontrar dónde vale la pena comer, antes de que decidas cómo llega.",
  },
  {
    negation: "No red social genérica",
    title: "No hay nada que no sea comida",
    body: "Sin política, sin ruido ajeno al plato. Verticalidad total: quien entra a Dondii ya trae intención gastronómica, no busca matar el tiempo.",
  },
  {
    negation: "No neutrales",
    title: "Tenemos una opinión, y está en el algoritmo",
    body: "La calidad merece visibilidad, aunque eso signifique que una cadena grande pierda frente al negocio familiar de la esquina. Eso no es un accidente: está horneado en cómo decidimos qué mostrar.",
  },
];
---

<section class="reveal mx-auto max-w-6xl px-6 py-24 md:py-28">
  <p class="font-impact text-xs uppercase tracking-[0.14em] text-primary">
    — Lo que no somos —
  </p>
  <h2 class="mt-3 max-w-2xl font-display text-3xl font-normal leading-tight text-ink md:text-4xl">
    Definirnos por lo que rechazamos nos deja claros en lo que sí hacemos.
  </h2>

  <div class="mt-12 divide-y divide-primary-light/20 border-t border-primary-light/20">
    {
      points.map((point) => (
        <div class="grid gap-3 py-8 md:grid-cols-[minmax(0,220px)_1fr] md:gap-10">
          <p class="font-impact text-sm uppercase tracking-wide text-tomato">
            <span aria-hidden="true">✕</span> {point.negation}
          </p>
          <div>
            <h3 class="font-display text-xl font-normal text-ink md:text-2xl">
              {point.title}
            </h3>
            <p class="mt-2 max-w-2xl leading-relaxed text-ink/70">{point.body}</p>
          </div>
        </div>
      ))
    }
  </div>
</section>
```

- [ ] **Step 2: Reordenar `index.astro`**

Editar `src/pages/index.astro` para que el orden de renderizado sea Hero → Hook → Differentiators → ForDiners → ForBusinesses → Testimonials → FoundersTeaser → BlogTeaser → FinalCta:

```astro
  <Hero />
  <Hook />
  <Differentiators />
  <ForDiners />
  <ForBusinesses />
  <Testimonials />
  <FoundersTeaser />
  <BlogTeaser />
  <FinalCta />
```

(Los imports de arriba del archivo no cambian, solo el orden de uso en el JSX.)

- [ ] **Step 3: Verificar**

Confirmar en el navegador que "Lo que no somos" ahora aparece entre el manifiesto (Hook) y "Para comensales" (ForDiners), cerrando la Cámara I antes de entrar a la intimidad de Cámara II.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/Differentiators.astro src/pages/index.astro
git commit -m "feat(differentiators): recolor Art Deco y reordenar como cierre de Cámara I"
```

---

### Task 11: Migrar `ForDiners.astro` (Cámara II — intimidad 1)

**Files:**
- Modify: `src/components/home/ForDiners.astro`

**Interfaces:**
- Consumes: tokens de Task 2.

- [ ] **Step 1: Reescribir con cards de superficie oscura**

```astro
---
const features = [
  {
    title: "Feed sin ruido",
    body: "Solo comida. Sin política, sin influencers de otros temas, sin distracciones ajenas a lo que se te antoja.",
  },
  {
    title: "Reseñas honestas",
    body: "Cuentas verificadas, fotos reales y moderación activa contra reseñas pagadas.",
  },
  {
    title: "Playlists de lugares",
    body: "Arma listas temáticas de restaurantes, como playlists de Spotify, y sigue las de otros.",
  },
  {
    title: "Comunidad local",
    body: "Recomendaciones reales de gente de tu ciudad, no de bots ni cuentas pagadas.",
  },
];
---

<section class="reveal mx-auto max-w-6xl px-6 py-24 md:py-28">
  <p class="font-impact text-xs uppercase tracking-[0.14em] text-primary">— Para quien come —</p>
  <h2 class="mt-3 max-w-2xl font-display text-3xl font-normal leading-tight text-ink md:text-4xl">
    Tu próximo lugar favorito, sin perder tiempo scrolleando.
  </h2>

  <div class="mt-12 grid gap-6 sm:grid-cols-2">
    {
      features.map((feature) => (
        <div class="rounded border border-primary-light/40 bg-surface p-6 transition duration-200 hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10">
          <h3 class="font-display text-lg font-normal text-ink">{feature.title}</h3>
          <p class="mt-2 leading-relaxed text-ink/70">{feature.body}</p>
        </div>
      ))
    }
  </div>
</section>
```

- [ ] **Step 2: Verificar**

Confirmar hover en las cards: borde pasa de `primary-light/40` a `primary/60` con leve elevación — el "encaje" del mecanismo, sin sombra pesada en reposo.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/ForDiners.astro
git commit -m "feat(for-diners): cards de superficie oscura con kicker — Cámara II"
```

---

### Task 12: Migrar `ForBusinesses.astro` (Cámara II — intimidad 2, panel vitrina)

**Files:**
- Modify: `src/components/home/ForBusinesses.astro`

**Interfaces:**
- Consumes: tokens de Task 2.

- [ ] **Step 1: Reescribir — el panel de Negocios Fundadores como "vitrina" clara**

El panel de Negocios Fundadores usa intencionalmente `bg-ink text-paper` (que con los tokens invertidos da pergamino claro + texto carbón oscuro) — es el único punto de la página, junto con Cámara III, donde se invierte deliberadamente la luminancia para que el panel se sienta como el objeto iluminado dentro de la vitrina, reforzando "el honor que se extiende" a los primeros 50 negocios.

```astro
---
const highlights = [
  {
    segment: "Restaurantes",
    body: "Visibilidad calificada y data accionable por platillo.",
  },
  {
    segment: "Negocios pequeños",
    body: "Presencia digital sin saber de marketing ni invertir un peso.",
  },
  {
    segment: "Marcas independientes",
    body: "Catálogo y reseñas para productos hoy invisibles fuera de su círculo.",
  },
  {
    segment: "Creadores de Comida",
    body: "Vende lo que cocinas sin necesidad de un negocio formalmente registrado.",
  },
];
---

<section class="reveal border-y border-primary-light/30 bg-surface py-24 md:py-28">
  <div class="mx-auto max-w-6xl px-6">
    <p class="font-impact text-xs uppercase tracking-[0.14em] text-primary">
      — Para quien cocina —
    </p>
    <h2 class="mt-3 max-w-2xl font-display text-3xl font-normal leading-tight text-ink md:text-4xl">
      La calidad merece ser vista. Así de simple.
    </h2>

    <div class="mt-12 grid gap-6 sm:grid-cols-2">
      {
        highlights.map((item) => (
          <div class="rounded border border-primary-light/40 bg-paper p-6 transition duration-200 hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10">
            <h3 class="font-display text-lg font-normal text-ink">{item.segment}</h3>
            <p class="mt-2 leading-relaxed text-ink/70">{item.body}</p>
          </div>
        ))
      }
    </div>

    <div
      class="mt-10 flex flex-col items-start gap-6 rounded bg-ink p-8 text-paper md:flex-row md:items-center md:justify-between md:gap-4"
    >
      <div>
        <p class="font-display text-lg">Programa de Negocios Fundadores</p>
        <p class="mt-1 max-w-md text-paper/70">
          Los primeros 50 negocios del softlaunch obtienen precio fundador de
          por vida y posicionamiento prioritario durante 12 meses.
        </p>
      </div>
      <a
        href="/features"
        class="shrink-0 rounded-full bg-primary px-6 py-3 font-semibold text-paper transition-colors duration-200 hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
      >
        Ver todas las features
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verificar contraste**

El panel `bg-ink text-paper` da pergamino claro (`#f2ead9`) con texto carbón oscuro (`#0b0f0d`) — contraste alto, confirmarlo visualmente. El botón brass (`bg-primary text-paper`) dentro de ese panel da brass con texto oscuro — confirmar que sigue siendo legible sobre el panel claro (brass sobre pergamino tiene menos contraste que brass sobre carbón: si se ve apagado, reducir a `border-2 border-ink text-ink` en vez de `bg-primary` para ese botón específico).

- [ ] **Step 3: Commit**

```bash
git add src/components/home/ForBusinesses.astro
git commit -m "feat(for-businesses): panel vitrina invertido para Negocios Fundadores — Cámara II"
```

---

### Task 13: Migrar `Testimonials.astro` (Cámara II — pico de intimidad)

**Files:**
- Modify: `src/components/home/Testimonials.astro`

**Interfaces:**
- Consumes: `testimonials` de `src/data/testimonials.ts` (sin cambios — sigue con placeholders marcados `TODO`, fuera de alcance de este trabajo visual).

- [ ] **Step 1: Reescribir**

```astro
---
import { testimonials } from "../../data/testimonials";
---

<section class="reveal bg-paper py-24 md:py-28">
  <div class="mx-auto max-w-6xl px-6">
    <p class="font-impact text-xs uppercase tracking-[0.14em] text-primary">
      — Las primeras voces —
    </p>
    <h2 class="mt-3 max-w-2xl font-display text-3xl font-normal leading-tight text-ink md:text-4xl">
      Apenas arrancamos en Hermosillo. Aquí van las primeras voces reales.
    </h2>

    <div class="mt-12 grid gap-6 md:grid-cols-3">
      {
        testimonials.map((testimonial) => (
          <blockquote class="flex h-full flex-col justify-between rounded border border-primary-light/30 bg-surface p-6">
            <p class="font-display text-lg italic leading-snug text-ink/90">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <footer class="mt-6 text-sm text-ink/55">
              <span class="font-semibold text-ink">{testimonial.author}</span>
              {" · "}
              {testimonial.role}
            </footer>
          </blockquote>
        ))
      }
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verificar**

Confirmar que las tres cards de testimonio se ven con borde brass tenue sobre superficie carbón, sin el borde punteado del sistema viejo (`border-dashed` se retira — no encaja con la precisión geométrica Art Deco).

- [ ] **Step 3: Commit**

```bash
git add src/components/home/Testimonials.astro
git commit -m "feat(testimonials): cards de superficie oscura, borde precisa — pico de Cámara II"
```

---

### Task 14: Migrar `FoundersTeaser.astro` (Cámara III — arranca la convicción)

**Files:**
- Modify: `src/components/home/FoundersTeaser.astro`

**Interfaces:**
- Consumes: `Sunburst` de Task 3 (variante `compact`), tokens de Task 2.

- [ ] **Step 1: Reescribir con sunburst compacto**

```astro
---
import Sunburst from "../ui/Sunburst.astro";
---

<section class="reveal mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-24 text-center md:py-28">
  <div class="text-primary/40" aria-hidden="true">
    <Sunburst variant="compact" />
  </div>
  <p class="font-impact text-xs uppercase tracking-[0.14em] text-primary">— El equipo —</p>
  <h2 class="max-w-xl font-display text-3xl font-normal leading-tight text-ink md:text-4xl">
    Conocemos Hermosillo porque somos de acá.
  </h2>
  <p class="max-w-xl leading-relaxed text-ink/70">
    A Dondii no lo construyó una oficina en otra ciudad. Lo construyó gente con
    red dentro de la escena gastronómica de Hermosillo, que conoce de primera
    mano al negocio local.
  </p>
  <a
    href="/founders"
    class="font-semibold text-primary underline underline-offset-4 transition-colors duration-200 hover:text-primary-dark"
  >
    Conocer a los founders →
  </a>
</section>
```

- [ ] **Step 2: Verificar**

Confirmar que el sunburst compacto se ve como detalle de foco (no animado, estático) sobre el kicker, marcando el regreso de autoridad visual al entrar a Cámara III.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/FoundersTeaser.astro
git commit -m "feat(founders-teaser): sunburst compacto marca inicio de Cámara III"
```

---

### Task 15: Migrar `BlogTeaser.astro` (Cámara III — evidencia editorial)

**Files:**
- Modify: `src/components/home/BlogTeaser.astro`

**Interfaces:**
- Consumes: `getCollection("blog")` (sin cambios en la lógica de datos), tokens de Task 2.

- [ ] **Step 1: Reescribir manteniendo la misma card visual que `ForDiners`/`Testimonials`**

```astro
---
import { getCollection } from "astro:content";

const posts = (await getCollection("blog"))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 2);
---

<section class="reveal border-y border-primary-light/30 bg-surface py-24 md:py-28">
  <div class="mx-auto max-w-6xl px-6">
    <p class="font-impact text-xs uppercase tracking-[0.14em] text-primary">— Del blog —</p>
    <h2 class="mt-3 max-w-2xl font-display text-3xl font-normal leading-tight text-ink md:text-4xl">
      Ideas para pensar la comida distinto.
    </h2>

    <div class="mt-12 grid gap-6 md:grid-cols-2">
      {
        posts.map((post) => (
          <a
            href={`/blog/${post.id}`}
            class="rounded border border-primary-light/40 bg-paper p-6 transition duration-200 hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10"
          >
            <time
              datetime={post.data.date.toISOString().slice(0, 10)}
              class="text-sm text-ink/50"
            >
              {post.data.date.toLocaleDateString("es-MX", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </time>
            <h3 class="mt-2 font-display text-lg font-normal text-ink">{post.data.title}</h3>
            <p class="mt-2 leading-relaxed text-ink/70">{post.data.excerpt}</p>
          </a>
        ))
      }
    </div>

    <a
      href="/blog"
      class="mt-10 inline-block font-semibold text-primary underline underline-offset-4 transition-colors duration-200 hover:text-primary-dark"
    >
      Ver todo el blog →
    </a>
  </div>
</section>
```

- [ ] **Step 2: Verificar**

Con al menos un post de blog existente en la colección, confirmar que las cards se ven consistentes con el resto del sistema (borde brass tenue, hover con elevación leve).

- [ ] **Step 3: Commit**

```bash
git add src/components/home/BlogTeaser.astro
git commit -m "feat(blog-teaser): recolor Art Deco consistente con el resto de Cámara III"
```

---

### Task 16: Migrar `FinalCta.astro` (Cámara III — cierre, eco del Hero)

**Files:**
- Modify: `src/components/home/FinalCta.astro`

**Interfaces:**
- Consumes: `Sunburst` de Task 3 (variante `full`, sin `animated` — el reveal de sección ya lo cubre GSAP), `DownloadButtons`.

- [ ] **Step 1: Reescribir con eco del sunburst del Hero**

```astro
---
import DownloadButtons from "../layout/DownloadButtons.astro";
import Sunburst from "../ui/Sunburst.astro";
---

<section class="reveal relative isolate overflow-hidden border-t border-primary-light/30 bg-paper">
  <div class="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 text-primary/20" aria-hidden="true">
    <Sunburst variant="full" />
  </div>

  <div class="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-24 text-center md:py-28">
    <h2 class="max-w-2xl font-display text-3xl font-normal leading-tight text-ink md:text-4xl">
      Donde la calidad se ve.
    </h2>
    <p class="max-w-xl leading-relaxed text-ink/70">
      No es una app más. Es un estándar que ya está en marcha en Hermosillo —
      y podés ser parte de él hoy.
    </p>
    <DownloadButtons class="mt-2" />
  </div>
</section>
```

El titular repite deliberadamente el del Hero ("Donde la calidad se ve.") — es el cierre del círculo narrativo descrito en el spec. El copy del subtítulo encuadra la acción como entrar a un estándar en marcha, no como conversión.

- [ ] **Step 2: Verificar el arco completo**

Con el dev server corriendo, hacer scroll de punta a punta del home y confirmar la sensación de arco: entrada monumental (Hero) → manifiesto (Hook) → mecanismo (Differentiators) → intimidad (ForDiners/ForBusinesses/Testimonials) → convicción (FoundersTeaser/BlogTeaser/FinalCta) → eco de cierre con el mismo sunburst y la misma línea del Hero.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/FinalCta.astro
git commit -m "feat(final-cta): eco del sunburst y titular del Hero cierra el arco narrativo"
```

---

### Task 17: Verificación final

**Files:**
- No se modifican archivos de producto en esta task — solo verificación.

**Interfaces:**
- Consumes: todo lo construido en Tasks 1–16.

- [ ] **Step 1: Type-check completo**

Run: `npm run astro -- check`
Expected: 0 errores.

- [ ] **Step 2: Build de producción**

Run: `npm run build`
Expected: build exitoso sin warnings de assets faltantes (en particular, confirmar que no hay 404 de fuentes).

- [ ] **Step 3: Revisión visual del home completo**

Con `astro dev --background`, recorrer el home en desktop (1440px) y mobile (375px, devtools). Confirmar por cada sección: paleta carbón/brass/joyas aplicada, tipografía Prata/Sora/NouvelleGrotesquerie correcta, motion sin overshoot, contraste texto/fondo legible en las secciones con panel invertido (ForBusinesses, FinalCta si aplica).

- [ ] **Step 4: Confirmar `prefers-reduced-motion`**

Activar la preferencia de sistema, recargar el home completo y confirmar que ninguna sección (incluido el Hero y su sunburst) muestra animación — todo debe estar en estado final inmediatamente.

- [ ] **Step 5: Revisar páginas fuera de alcance**

Abrir `/founders`, `/features`, `/blog` y confirmar que heredan el fondo oscuro y la tipografía nueva sin verse "rotas" — en particular confirmar el panel invertido de `founders.astro:38` (banner ahora claro) se ve intencional, no como un bug.

- [ ] **Step 6: Auditoría de diseño**

Correr `/impeccable audit` sobre el proyecto y confirmar que Prata, Sora y NouvelleGrotesquerie ya no aparecen como "fuente fuera de DESIGN.md" (deben resolver contra el `DESIGN.md` reescrito en Task 1).

- [ ] **Step 7: Commit final si hubo ajustes**

Si la verificación visual detectó ajustes menores de contraste u otros detalles, aplicarlos y commitear:

```bash
git add -A
git commit -m "fix(art-deco): ajustes de verificación visual post-migración"
```

---

## Self-Review (completado por el autor del plan)

- **Cobertura del spec:** sistema visual (Task 1-2), sunburst (Task 3), motion (Task 4), Layout/Nav/Footer (Task 5-7), las 9 secciones con su cámara narrativa asignada (Task 8-16), verificación de accesibilidad/build/impeccable (Task 17). Sin gaps identificados contra `docs/superpowers/specs/2026-08-10-art-deco-landing-redesign-design.md`.
- **Placeholders:** ninguno — todo el copy, CSS y JSON de cada task es contenido final, no relleno.
- **Consistencia de tipos/nombres:** `Sunburst` se usa con las mismas props (`variant`, `animated`, `class`) en Tasks 8, 14 y 16. Los tokens de Task 2 (`--color-primary`, `--color-emerald`, `--font-impact`, etc.) son los mismos nombres usados en las clases Tailwind de Tasks 6-16.
