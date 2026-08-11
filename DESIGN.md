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
