# Landing de Dondii — Estructura de Secciones — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir la estructura completa de páginas y secciones del sitio informativo de Dondii (Home, Features, Founders, Blog) definida en `docs/superpowers/specs/2026-08-10-landing-structure-design.md`, con datos placeholder claramente marcados donde falta contenido real, y animaciones GSAP básicas ancladas en los puntos que el spec identificó.

**Architecture:** Astro multi-página con file-based routing. Un `Layout.astro` único envuelve Nav/Footer. Cada página compone componentes `.astro` por sección. Listas de contenido (segmentos de Features, founders, testimonios) viven como datos tipados en `src/data/`; el blog usa Astro Content Collections (`src/content.config.ts` + `src/content/blog/*.md`). Interactividad mínima (tabs de Features, reveal-on-scroll) se resuelve con `<script>` vanilla — no se agrega React/Vue, no hace falta para esta superficie.

**Tech Stack:** Astro ^7.2.0 (TypeScript strict), Tailwind CSS v4 (`@tailwindcss/vite`, sin `tailwind.config.js` — theming vía `@theme` en CSS), GSAP ^3.15 + `ScrollTrigger`, Node >=22.12.0.

## Global Constraints

- **Idioma y voz del copy del sitio:** español neutro/mexicano, tratamiento de "tú" (no "vos", no rioplatense) — tiene que sonar coherente con el Manifiesto de Dondii, que está escrito en ese registro. Esto aplica a TODO el copy que se escribe en componentes `.astro` y posts de blog en este plan.
- **Placeholders de contenido pendiente:** todo dato real faltante (links de tiendas, fotos/bios de founders, testimonios, pricing) se marca con un comentario `<!-- TODO: reemplazar con [dato] real -->` inmediatamente antes o después del elemento afectado. Nunca se inventa un dato real (nombre de persona real, cifra de pricing, link de tienda funcional) — el placeholder debe ser obviamente un placeholder (ej. "Nombre Apellido", no un nombre inventado que parezca real).
- **Sin imágenes externas/binarias:** ningún task de este plan depende de assets de imagen que no existan en el repo (fotos de founders, covers de blog). Donde el diseño pide una foto/imagen, se usa un placeholder generado en CSS/SVG inline (bloque de color, iniciales) — nunca un `<img src>` roto.
- **Verificación por task:** cada task se valida con `npx astro check` (0 errores) — no se corre `astro build` de forma repetida por task (regla del usuario: no buildear después de cada cambio). El build de producción se corre una única vez, al final, en el task de integración.
- **Orden de ejecución:** los tasks están numerados en el orden exacto en que deben ejecutarse — hay dependencias reales entre ellos (ej. el blog debe existir antes de que la Home lo referencie). No saltear el orden.
- **Convención de archivos:** componentes Astro en PascalCase (`Hero.astro`), archivos de datos/utilidades en camelCase (`segments.ts`), páginas en kebab-case donde Astro lo pide por routing (`features.astro` ya es kebab por ser una sola palabra).

---

## File Structure

```
src/
  layouts/
    Layout.astro                 # Nav + Footer + <slot />, importa global.css
  components/
    layout/
      Nav.astro
      Footer.astro
      DownloadButtons.astro      # botones App Store / Google Play (placeholder href)
    home/
      Hero.astro
      Hook.astro                 # historia Don Chuy vs franquicia
      ForDiners.astro
      ForBusinesses.astro        # pivot + Programa de Negocios Fundadores
      Differentiators.astro
      Testimonials.astro
      FoundersTeaser.astro
      BlogTeaser.astro
      FinalCta.astro
    features/
      AudienceTabs.astro
    founders/
      FounderCard.astro
  data/
    segments.ts                  # 7 segmentos para Features
    founders.ts                  # founders placeholder
    testimonials.ts              # testimonios placeholder
  scripts/
    motion.ts                    # helper GSAP ScrollTrigger reveal-on-scroll
  content/
    blog/
      bienvenidos-a-dondii.md
      programa-negocios-fundadores.md
  content.config.ts              # schema de la collection "blog"
  pages/
    index.astro                  # Home (compone las secciones de home/)
    features.astro
    founders.astro
    blog/
      index.astro
      [slug].astro
    privacidad.astro
    terminos.astro
    404.astro
  styles/
    global.css                   # ya existe, se le agrega @theme
```

---

### Task 1: Design tokens de Tailwind

**Files:**
- Modify: `src/styles/global.css`

**Interfaces:**
- Produces: clases de color utilizables en todo el proyecto: `bg-primary`, `bg-primary-dark`, `bg-tomato`, `bg-primary-light`, `text-primary`, `text-ink`, `bg-paper`, y equivalentes `text-*`/`border-*` (Tailwind v4 genera automáticamente las variantes de utilidad a partir de cada token `--color-*` declarado en `@theme`).

- [ ] **Step 1: Escribir los tokens en `@theme`**

Reemplazar el contenido completo de `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-primary: #812800;
  --color-primary-dark: #5c1d00;
  --color-tomato: #a63a0b;
  --color-primary-light: #fecba8;

  --color-ink: #1a1310;
  --color-paper: #fff8f2;
}
```

- [ ] **Step 2: Verificar que Astro compila sin errores de tipos**

Run: `npx astro check`
Expected: `0 errors, 0 warnings, 0 hints` (o el conteo de hints preexistente del scaffold, pero **0 errors**).

- [ ] **Step 3: Verificar que Tailwind generó las clases**

Run: `npx astro build && rg "812800" dist/_astro/*.css`
Expected: al menos una coincidencia (confirma que el token se compiló al CSS final). Después de confirmar, borrar `dist/`:

Run: `rm -rf dist`

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add Tailwind design tokens for brand color system"
```

---

### Task 2: Layout compartido — Nav, Footer, DownloadButtons

**Files:**
- Create: `src/components/layout/DownloadButtons.astro`
- Create: `src/components/layout/Nav.astro`
- Create: `src/components/layout/Footer.astro`
- Create: `src/layouts/Layout.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: tokens de color de Task 1 (`bg-primary`, `text-ink`, `bg-paper`, etc.)
- Produces: `Layout.astro` con props `{ title: string; description: string }` y un `<slot />` para el contenido de cada página. Todas las páginas futuras lo usan así: `<Layout title="..." description="..."><section>...</section></Layout>`.

- [ ] **Step 1: Crear `DownloadButtons.astro`**

```astro
---
interface Props {
  class?: string;
}
const { class: className = "" } = Astro.props;
---

<div class={`flex flex-wrap gap-3 ${className}`}>
  <!-- TODO: reemplazar href con el link real de App Store -->
  <a
    href="#"
    class="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-paper transition hover:bg-primary-dark"
  >
    Descargar en App Store
  </a>
  <!-- TODO: reemplazar href con el link real de Google Play -->
  <a
    href="#"
    class="inline-flex items-center gap-2 rounded-full border-2 border-ink px-6 py-3 font-semibold text-ink transition hover:bg-ink hover:text-paper"
  >
    Descargar en Google Play
  </a>
</div>
```

- [ ] **Step 2: Crear `Nav.astro`**

```astro
---
import DownloadButtons from "./DownloadButtons.astro";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/features", label: "Features" },
  { href: "/founders", label: "Founders" },
  { href: "/blog", label: "Blog" },
];
---

<header class="sticky top-0 z-50 border-b border-primary-light/40 bg-paper/90 backdrop-blur">
  <nav class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
    <a href="/" class="text-xl font-black tracking-tight text-primary-dark">
      Dondii
    </a>
    <ul class="hidden items-center gap-8 md:flex">
      {
        links.map((link) => (
          <li>
            <a href={link.href} class="font-medium text-ink transition hover:text-primary">
              {link.label}
            </a>
          </li>
        ))
      }
    </ul>
    <DownloadButtons class="hidden md:flex" />
  </nav>
</header>
```

- [ ] **Step 3: Crear `Footer.astro`**

```astro
---
import DownloadButtons from "./DownloadButtons.astro";

const year = new Date().getFullYear();
---

<footer class="border-t border-primary-light/40 bg-ink text-paper">
  <div class="mx-auto max-w-6xl px-6 py-12">
    <div class="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
      <div>
        <p class="text-lg font-black">Dondii</p>
        <p class="mt-2 max-w-sm text-sm text-paper/70">
          Donde la calidad se ve. Descubre, saborea y comparte la mejor comida de tu ciudad.
        </p>
      </div>
      <DownloadButtons />
    </div>
    <div class="mt-10 flex flex-col gap-4 border-t border-paper/10 pt-6 text-sm text-paper/60 md:flex-row md:items-center md:justify-between">
      <p>&copy; {year} Dondii. Todos los derechos reservados.</p>
      <div class="flex gap-6">
        <a href="/privacidad" class="hover:text-paper">Privacidad</a>
        <a href="/terminos" class="hover:text-paper">Términos</a>
        <!-- TODO: reemplazar con los links reales de redes sociales -->
        <a href="#" class="hover:text-paper">Instagram</a>
      </div>
    </div>
  </div>
</footer>
```

- [ ] **Step 4: Crear `Layout.astro`**

```astro
---
import "../styles/global.css";
import Nav from "../components/layout/Nav.astro";
import Footer from "../components/layout/Footer.astro";

interface Props {
  title: string;
  description: string;
}
const { title, description } = Astro.props;
---

<html lang="es">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />
    <meta name="generator" content={Astro.generator} />
    <title>{title} · Dondii</title>
  </head>
  <body class="bg-paper text-ink">
    <Nav />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 5: Migrar `index.astro` al nuevo Layout**

Reemplazar el contenido completo de `src/pages/index.astro`:

```astro
---
import Layout from "../layouts/Layout.astro";
---

<Layout
  title="Inicio"
  description="Dondii es la app de descubrimiento gastronómico donde la calidad se ve. Descubre, saborea y comparte la mejor comida de tu ciudad."
>
  <p class="mx-auto max-w-2xl px-6 py-24 text-center text-ink/60">
    Contenido de la Home en construcción — ver Tasks 4 a 6 y 9 de este plan.
  </p>
</Layout>
```

- [ ] **Step 6: Verificar**

Run: `npx astro check`
Expected: `0 errors`

Run: `npm run dev` (dejarlo corriendo), abrir `http://localhost:4321/` en el navegador y confirmar visualmente: nav sticky con los 4 links y los botones de descarga, footer con los 3 links. Cortar el server con `Ctrl+C` al terminar de revisar.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout src/layouts/Layout.astro src/pages/index.astro
git commit -m "feat: add shared Layout, Nav and Footer"
```

---

### Task 3: Utilidad de motion (GSAP ScrollTrigger)

**Files:**
- Create: `src/scripts/motion.ts`

**Interfaces:**
- Produces: `revealOnScroll(selector: string): void` — registra un fade-in + slide-up para cada elemento que matchea `selector` cuando entra en viewport. Los tasks 4, 5 y 10 importan esta función.

- [ ] **Step 1: Crear `motion.ts`**

```typescript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function revealOnScroll(selector: string): void {
  const targets = gsap.utils.toArray<HTMLElement>(selector);

  targets.forEach((el, index) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: index * 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
        },
      },
    );
  });
}
```

- [ ] **Step 2: Verificar**

Run: `npx astro check`
Expected: `0 errors` (confirma que TypeScript resuelve los tipos de `gsap` y `gsap/ScrollTrigger` correctamente).

- [ ] **Step 3: Commit**

```bash
git add src/scripts/motion.ts
git commit -m "feat: add GSAP ScrollTrigger reveal-on-scroll helper"
```

---

### Task 4: Home — Hero y Hook

**Files:**
- Create: `src/components/home/Hero.astro`
- Create: `src/components/home/Hook.astro`

**Interfaces:**
- Consumes: `DownloadButtons` (Task 2), `revealOnScroll` de `../../scripts/motion` (Task 3)
- Produces: componentes `Hero` y `Hook` sin props, listos para componerse en `index.astro` (Task 9).

- [ ] **Step 1: Crear `Hero.astro`**

```astro
---
import DownloadButtons from "../layout/DownloadButtons.astro";
---

<section class="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-24 text-center">
  <span class="rounded-full bg-primary-light px-4 py-1 text-sm font-semibold text-primary-dark">
    Ya disponible en Hermosillo
  </span>
  <h1 class="max-w-3xl text-5xl font-black leading-tight tracking-tight text-ink md:text-7xl">
    Descubre. Saborea. Comparte.
  </h1>
  <p class="max-w-xl text-lg text-ink/70">
    Dondii es la app de descubrimiento gastronómico donde la calidad se ve —
    no el presupuesto publicitario. Encuentra tu próximo lugar favorito para comer,
    hoy mismo, en tu ciudad.
  </p>
  <DownloadButtons />
</section>
```

- [ ] **Step 2: Crear `Hook.astro`**

```astro
---
---

<section class="reveal border-y border-primary-light/40 bg-primary-dark py-24 text-paper">
  <div class="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2">
    <div>
      <p class="text-sm font-semibold uppercase tracking-widest text-primary-light">
        Por qué existe Dondii
      </p>
      <h2 class="mt-4 text-3xl font-black leading-tight md:text-4xl">
        Don Chuy vende las mejores aguas frescas de la esquina. 4.8 estrellas.
        ¿Por qué una franquicia mediocre le gana el cliente todos los meses?
      </h2>
    </div>
    <div class="flex flex-col justify-center gap-4 text-paper/80">
      <p>
        La economía digital premia el presupuesto publicitario, no la calidad.
        Las plataformas que usamos todos los días se llevan la atención de los
        usuarios hacia quien más paga — no hacia quien mejor cocina.
      </p>
      <p class="font-semibold text-paper">
        Dondii existe para romper esa lógica: una plataforma donde la calidad
        se vuelve visible, y el negocio familiar compite en igualdad de
        condiciones contra cualquier cadena.
      </p>
    </div>
  </div>
</section>

<script>
  import { revealOnScroll } from "../../scripts/motion";
  revealOnScroll(".reveal");
</script>
```

- [ ] **Step 3: Verificar**

Run: `npx astro check`
Expected: `0 errors`

- [ ] **Step 4: Commit**

```bash
git add src/components/home/Hero.astro src/components/home/Hook.astro
git commit -m "feat: add Home Hero and Hook sections"
```

---

### Task 5: Home — ForDiners y ForBusinesses

**Files:**
- Create: `src/components/home/ForDiners.astro`
- Create: `src/components/home/ForBusinesses.astro`

**Interfaces:**
- Consumes: `revealOnScroll` de `../../scripts/motion` (Task 3)
- Produces: componentes `ForDiners` y `ForBusinesses` sin props.

- [ ] **Step 1: Crear `ForDiners.astro`**

```astro
---
const features = [
  { title: "Feed sin ruido", body: "Solo comida. Sin política, sin influencers de otros temas, sin distracciones." },
  { title: "Reseñas honestas", body: "Cuentas verificadas, fotos reales y moderación activa contra reseñas pagadas." },
  { title: "Playlists de lugares", body: "Arma listas temáticas de restaurantes, como playlists de Spotify, y sigue las de otros." },
  { title: "Comunidad local", body: "Recomendaciones reales de gente de tu ciudad, no de bots ni cuentas pagadas." },
];
---

<section class="mx-auto max-w-6xl px-6 py-24">
  <p class="text-sm font-semibold uppercase tracking-widest text-primary">Para comensales</p>
  <h2 class="mt-2 max-w-2xl text-3xl font-black text-ink md:text-4xl">
    Encuentra tu próximo lugar favorito sin perder tiempo scrolleando.
  </h2>
  <div class="mt-12 grid gap-8 sm:grid-cols-2">
    {
      features.map((feature) => (
        <div class="rounded-2xl border border-primary-light/60 bg-white p-6">
          <h3 class="text-lg font-bold text-ink">{feature.title}</h3>
          <p class="mt-2 text-ink/70">{feature.body}</p>
        </div>
      ))
    }
  </div>
</section>
```

- [ ] **Step 2: Crear `ForBusinesses.astro`**

```astro
---
const highlights = [
  { segment: "Restaurantes", body: "Visibilidad calificada y data accionable por platillo." },
  { segment: "Negocios pequeños", body: "Presencia digital sin saber de marketing ni invertir un peso." },
  { segment: "Marcas independientes", body: "Catálogo y reseñas para productos hoy invisibles fuera de su círculo." },
  { segment: "Creadores de Comida", body: "Vende lo que cocinas sin necesidad de un negocio formalmente registrado." },
];
---

<section class="reveal border-y border-primary-light/40 bg-primary-light/20 py-24">
  <div class="mx-auto max-w-6xl px-6">
    <p class="text-sm font-semibold uppercase tracking-widest text-primary-dark">
      Para negocios y creadores
    </p>
    <h2 class="mt-2 max-w-2xl text-3xl font-black text-ink md:text-4xl">
      La calidad debe ser visible. Así de simple.
    </h2>
    <div class="mt-12 grid gap-6 sm:grid-cols-2">
      {
        highlights.map((item) => (
          <div class="rounded-2xl bg-white p-6">
            <h3 class="text-lg font-bold text-ink">{item.segment}</h3>
            <p class="mt-2 text-ink/70">{item.body}</p>
          </div>
        ))
      }
    </div>
    <div class="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-ink p-8 text-paper md:flex-row md:items-center md:justify-between">
      <div>
        <p class="font-bold">Programa de Negocios Fundadores</p>
        <p class="mt-1 text-paper/70">
          Los primeros 50 negocios del softlaunch obtienen precio fundador de
          por vida y posicionamiento prioritario durante 12 meses.
        </p>
      </div>
      <a
        href="/features"
        class="shrink-0 rounded-full bg-primary px-6 py-3 font-semibold text-paper transition hover:bg-primary-dark"
      >
        Ver todas las features
      </a>
    </div>
  </div>
</section>

<script>
  import { revealOnScroll } from "../../scripts/motion";
  revealOnScroll(".reveal");
</script>
```

- [ ] **Step 3: Verificar**

Run: `npx astro check`
Expected: `0 errors`

- [ ] **Step 4: Commit**

```bash
git add src/components/home/ForDiners.astro src/components/home/ForBusinesses.astro
git commit -m "feat: add Home ForDiners and ForBusinesses sections"
```

---

### Task 6: Home — Differentiators y Testimonials (+ data de testimonios)

**Files:**
- Create: `src/data/testimonials.ts`
- Create: `src/components/home/Differentiators.astro`
- Create: `src/components/home/Testimonials.astro`

**Interfaces:**
- Produces: `export interface Testimonial { quote: string; author: string; role: string }` y `export const testimonials: Testimonial[]` desde `src/data/testimonials.ts`. `Testimonials.astro` lo consume.

- [ ] **Step 1: Crear `src/data/testimonials.ts`**

```typescript
export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

// TODO: reemplazar con testimonios reales de usuarios y negocios
export const testimonials: Testimonial[] = [
  {
    quote: "Testimonio de placeholder: reemplazar con una cita real de un usuario de Dondii.",
    author: "Nombre Apellido",
    role: "Usuaria de Dondii",
  },
  {
    quote: "Testimonio de placeholder: reemplazar con una cita real de un negocio en Dondii.",
    author: "Nombre Apellido",
    role: "Dueño de negocio en Dondii",
  },
  {
    quote: "Testimonio de placeholder: reemplazar con una cita real de un Creador de Comida.",
    author: "Nombre Apellido",
    role: "Creador de Comida en Dondii",
  },
];
```

- [ ] **Step 2: Crear `Differentiators.astro`**

```astro
---
const points = [
  { title: "No somos delivery", body: "No competimos con apps de logística. El corazón de Dondii es descubrimiento." },
  { title: "No somos otra red social", body: "Verticalidad total: toda la audiencia ya tiene intención gastronómica." },
  { title: "No somos neutrales", body: "Tenemos una opinión: la calidad merece visibilidad. Está horneado en el algoritmo." },
];
---

<section class="mx-auto max-w-6xl px-6 py-24">
  <p class="text-sm font-semibold uppercase tracking-widest text-primary">Lo que nos hace distintos</p>
  <div class="mt-8 grid gap-8 md:grid-cols-3">
    {
      points.map((point) => (
        <div>
          <h3 class="text-xl font-black text-ink">{point.title}</h3>
          <p class="mt-2 text-ink/70">{point.body}</p>
        </div>
      ))
    }
  </div>
</section>
```

- [ ] **Step 3: Crear `Testimonials.astro`**

```astro
---
import { testimonials } from "../../data/testimonials";
---

<section class="bg-ink py-24 text-paper">
  <div class="mx-auto max-w-6xl px-6">
    <p class="text-sm font-semibold uppercase tracking-widest text-primary-light">Lo que dicen</p>
    <div class="mt-8 grid gap-6 md:grid-cols-3">
      {
        testimonials.map((testimonial) => (
          <blockquote class="rounded-2xl bg-paper/5 p-6">
            <p class="text-paper/90">&ldquo;{testimonial.quote}&rdquo;</p>
            <footer class="mt-4 text-sm text-paper/60">
              <span class="font-semibold text-paper">{testimonial.author}</span>
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

- [ ] **Step 4: Verificar**

Run: `npx astro check`
Expected: `0 errors`

- [ ] **Step 5: Commit**

```bash
git add src/data/testimonials.ts src/components/home/Differentiators.astro src/components/home/Testimonials.astro
git commit -m "feat: add Home Differentiators and Testimonials sections"
```

---

### Task 7: Blog — Content Collection, seeds, y listado

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/blog/bienvenidos-a-dondii.md`
- Create: `src/content/blog/programa-negocios-fundadores.md`
- Create: `src/pages/blog/index.astro`

**Interfaces:**
- Produces: collection `blog` accesible vía `getCollection("blog")` con schema `{ title: string; date: Date; excerpt: string }`. `post.id` es el slug (nombre de archivo sin extensión). Los Tasks 8 y 9 consumen esta collection.

- [ ] **Step 1: Crear `src/content.config.ts`**

```typescript
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Crear el primer post placeholder**

`src/content/blog/bienvenidos-a-dondii.md`:

```markdown
---
title: "Bienvenidos a Dondii"
date: 2026-03-01
excerpt: "Contenido de placeholder — reemplazar con el post real de lanzamiento antes de publicar."
---

> **Nota:** este es un post placeholder para validar el template del blog.
> Reemplazar con contenido real antes del lanzamiento.

## Por qué existe Dondii

Dondii nace de una observación simple: la economía digital premia el
presupuesto publicitario, no la calidad. Este es el primer post de nuestro
blog, donde vamos a compartir historias de negocios locales, novedades del
producto, y todo lo que hace que Hermosillo coma distinto.

## Qué vas a encontrar acá

- Historias de negocios y Creadores de Comida en la plataforma
- Novedades de producto
- Rankings y tendencias gastronómicas locales

Quedate cerca — esto recién empieza.
```

- [ ] **Step 3: Crear el segundo post placeholder**

`src/content/blog/programa-negocios-fundadores.md`:

```markdown
---
title: "El Programa de Negocios Fundadores"
date: 2026-03-10
excerpt: "Contenido de placeholder — reemplazar con el post real sobre el programa antes de publicar."
---

> **Nota:** este es un post placeholder para validar el template del blog.
> Reemplazar con contenido real antes del lanzamiento.

## Los primeros 50

Los primeros 50 negocios que se suman al softlaunch de Dondii en Hermosillo
obtienen precio fundador de por vida y posicionamiento prioritario durante
los primeros 12 meses.

## Por qué importa

No es una promoción más: es el reconocimiento a quienes confían en Dondii
desde el día uno, cuando la plataforma es más chica pero también más
atenta a cada negocio que se suma.
```

- [ ] **Step 4: Crear `src/pages/blog/index.astro`**

```astro
---
import Layout from "../../layouts/Layout.astro";
import { getCollection } from "astro:content";

const posts = (await getCollection("blog")).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
);
---

<Layout title="Blog" description="Historias, novedades y tendencias gastronómicas de Dondii.">
  <section class="mx-auto max-w-4xl px-6 pt-20 text-center">
    <h1 class="text-4xl font-black text-ink md:text-5xl">Blog</h1>
    <p class="mx-auto mt-4 max-w-2xl text-ink/70">
      Historias de negocios locales, novedades de producto y tendencias
      gastronómicas de Hermosillo.
    </p>
  </section>

  <section class="mx-auto max-w-4xl px-6 py-16">
    <div class="grid gap-6 sm:grid-cols-2">
      {
        posts.map((post) => (
          <a
            href={`/blog/${post.id}`}
            class="flex flex-col rounded-2xl border border-primary-light/60 bg-white p-6 transition hover:-translate-y-1"
          >
            <div class="h-32 rounded-xl bg-primary-light" />
            <h2 class="mt-4 text-lg font-bold text-ink">{post.data.title}</h2>
            <p class="mt-2 text-sm text-ink/70">{post.data.excerpt}</p>
            <time class="mt-4 text-xs uppercase tracking-widest text-ink/40">
              {post.data.date.toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
            </time>
          </a>
        ))
      }
    </div>
  </section>
</Layout>
```

- [ ] **Step 5: Verificar**

Run: `npx astro check`
Expected: `0 errors`

- [ ] **Step 6: Commit**

```bash
git add src/content.config.ts src/content/blog src/pages/blog/index.astro
git commit -m "feat: add blog content collection with placeholder seed posts and listing page"
```

---

### Task 8: Blog — template de post individual

**Files:**
- Create: `src/pages/blog/[slug].astro`

**Interfaces:**
- Consumes: collection `blog` (Task 7)

- [ ] **Step 1: Crear `src/pages/blog/[slug].astro`**

```astro
---
import Layout from "../../layouts/Layout.astro";
import { getCollection, render } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<Layout title={post.data.title} description={post.data.excerpt}>
  <article class="mx-auto max-w-2xl px-6 py-20">
    <div class="h-48 rounded-2xl bg-primary-light"></div>
    <h1 class="mt-8 text-4xl font-black text-ink">{post.data.title}</h1>
    <time class="mt-2 block text-sm uppercase tracking-widest text-ink/40">
      {post.data.date.toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
    </time>
    <div class="prose prose-neutral mt-8 max-w-none">
      <Content />
    </div>
    <a
      href="/blog"
      class="mt-12 inline-block font-semibold text-primary underline underline-offset-4 hover:text-primary-dark"
    >
      ← Volver al blog
    </a>
  </article>
</Layout>
```

- [ ] **Step 2: Verificar**

Run: `npx astro check`
Expected: `0 errors`

Run: `npm run dev`, abrir `http://localhost:4321/blog`, click en cada post y confirmar que el contenido en Markdown se renderiza (títulos, bullets, blockquote). Cortar el server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/\[slug\].astro
git commit -m "feat: add blog post template page"
```

---

### Task 9: Home — FoundersTeaser, BlogTeaser, FinalCta, y ensamblado de index.astro

**Files:**
- Create: `src/components/home/FoundersTeaser.astro`
- Create: `src/components/home/BlogTeaser.astro`
- Create: `src/components/home/FinalCta.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: todos los componentes de `src/components/home/` (Tasks 4, 5, 6 y este), `DownloadButtons` (Task 2), collection `blog` (Task 7)

- [ ] **Step 1: Crear `FoundersTeaser.astro`**

```astro
---
---

<section class="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-20 text-center">
  <p class="text-sm font-semibold uppercase tracking-widest text-primary">El equipo</p>
  <h2 class="max-w-xl text-2xl font-black text-ink md:text-3xl">
    Conocemos Hermosillo porque somos de acá.
  </h2>
  <a href="/founders" class="font-semibold text-primary underline underline-offset-4 hover:text-primary-dark">
    Conocer a los founders →
  </a>
</section>
```

- [ ] **Step 2: Crear `BlogTeaser.astro`**

```astro
---
import { getCollection } from "astro:content";

const posts = (await getCollection("blog"))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 2);
---

<section class="border-y border-primary-light/40 bg-primary-light/20 py-20">
  <div class="mx-auto max-w-6xl px-6">
    <p class="text-sm font-semibold uppercase tracking-widest text-primary-dark">Del blog</p>
    <div class="mt-8 grid gap-6 md:grid-cols-2">
      {
        posts.map((post) => (
          <a href={`/blog/${post.id}`} class="rounded-2xl bg-white p-6 transition hover:-translate-y-1">
            <h3 class="text-lg font-bold text-ink">{post.data.title}</h3>
            <p class="mt-2 text-ink/70">{post.data.excerpt}</p>
          </a>
        ))
      }
    </div>
    <a href="/blog" class="mt-8 inline-block font-semibold text-primary underline underline-offset-4 hover:text-primary-dark">
      Ver todo el blog →
    </a>
  </div>
</section>
```

- [ ] **Step 3: Crear `FinalCta.astro`**

```astro
---
import DownloadButtons from "../layout/DownloadButtons.astro";
---

<section class="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-24 text-center">
  <h2 class="max-w-2xl text-3xl font-black text-ink md:text-4xl">
    Donde la calidad se ve.
  </h2>
  <p class="max-w-xl text-ink/70">
    Descarga Dondii y descubre por qué Hermosillo ya está comiendo distinto.
  </p>
  <DownloadButtons />
</section>
```

- [ ] **Step 4: Ensamblar `index.astro`**

Reemplazar el contenido completo de `src/pages/index.astro`:

```astro
---
import Layout from "../layouts/Layout.astro";
import Hero from "../components/home/Hero.astro";
import Hook from "../components/home/Hook.astro";
import ForDiners from "../components/home/ForDiners.astro";
import ForBusinesses from "../components/home/ForBusinesses.astro";
import Differentiators from "../components/home/Differentiators.astro";
import Testimonials from "../components/home/Testimonials.astro";
import FoundersTeaser from "../components/home/FoundersTeaser.astro";
import BlogTeaser from "../components/home/BlogTeaser.astro";
import FinalCta from "../components/home/FinalCta.astro";
---

<Layout
  title="Inicio"
  description="Dondii es la app de descubrimiento gastronómico donde la calidad se ve. Descubre, saborea y comparte la mejor comida de tu ciudad."
>
  <Hero />
  <Hook />
  <ForDiners />
  <ForBusinesses />
  <Differentiators />
  <Testimonials />
  <FoundersTeaser />
  <BlogTeaser />
  <FinalCta />
</Layout>
```

- [ ] **Step 5: Verificar**

Run: `npx astro check`
Expected: `0 errors`

- [ ] **Step 6: Commit**

```bash
git add src/components/home/FoundersTeaser.astro src/components/home/BlogTeaser.astro src/components/home/FinalCta.astro src/pages/index.astro
git commit -m "feat: assemble Home page from all sections"
```

---

### Task 10: Features — data de segmentos + AudienceTabs + página

**Files:**
- Create: `src/data/segments.ts`
- Create: `src/components/features/AudienceTabs.astro`
- Create: `src/pages/features.astro`

**Interfaces:**
- Consumes: `revealOnScroll` de `../../scripts/motion` (Task 3)
- Produces: `export interface Segment { id: string; label: string; badge?: string; tagline: string; features: { title: string; body: string }[]; cta: { label: string; href: string } }` y `export const segments: Segment[]` en `src/data/segments.ts`.

- [ ] **Step 1: Crear `src/data/segments.ts`**

```typescript
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
    tagline: "Del boca a boca de tu colonia a todo Hermosillo.",
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
    tagline: "Cocinas en casa. Ahora también podés vender sin registrarte como negocio.",
    features: [
      { title: "Perfil sin negocio formal", body: "Solo subes tu comida, tu historia, y empiezas." },
      { title: "Audiencia pre-calificada", body: "Alta conversión de 'me gusta' a '¿me lo vendes?'." },
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
      { title: "Pedidos al mayoreo simplificados", body: "Compará precios y solicitá directo desde la app." },
      { title: "Pricing escalonado por volumen", body: "Configurá tus propios tramos de descuento por cantidad." },
      { title: "Proveedores verificados", body: "Reseñas de calidad, puntualidad y atención al cliente." },
      { title: "Catálogo especializado para eventos", body: "Piñatas, posadas, bodas, XV años — todo curado." },
    ],
    cta: { label: "Sumar mi negocio", href: "#" },
  },
];
```

- [ ] **Step 2: Crear `AudienceTabs.astro`**

```astro
---
import { segments } from "../../data/segments";
---

<div class="mx-auto max-w-6xl px-6">
  <div class="flex flex-wrap gap-2" role="tablist" aria-label="Segmentos de Dondii">
    {
      segments.map((segment, index) => (
        <button
          type="button"
          role="tab"
          id={`tab-${segment.id}`}
          aria-controls={`panel-${segment.id}`}
          aria-selected={index === 0 ? "true" : "false"}
          data-tab-trigger={segment.id}
          class="tab-trigger rounded-full border-2 border-primary-light px-4 py-2 text-sm font-semibold text-ink transition data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-paper"
          data-active={index === 0 ? "true" : "false"}
        >
          {segment.label}
          {segment.badge && <span class="ml-2 rounded-full bg-tomato px-2 py-0.5 text-xs text-paper">{segment.badge}</span>}
        </button>
      ))
    }
  </div>

  <div class="mt-10">
    {
      segments.map((segment, index) => (
        <div
          role="tabpanel"
          id={`panel-${segment.id}`}
          aria-labelledby={`tab-${segment.id}`}
          data-tab-panel={segment.id}
          class="tab-panel"
          hidden={index !== 0}
        >
          <p class="text-xl font-bold text-ink">{segment.tagline}</p>
          <div class="mt-6 grid gap-6 sm:grid-cols-2">
            {segment.features.map((feature) => (
              <div class="rounded-2xl border border-primary-light/60 bg-white p-6">
                <h3 class="font-bold text-ink">{feature.title}</h3>
                <p class="mt-2 text-ink/70">{feature.body}</p>
              </div>
            ))}
          </div>
          <!-- TODO: reemplazar href del CTA con el link real (waitlist de negocio, descarga, etc.) -->
          <a
            href={segment.cta.href}
            class="mt-8 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-paper transition hover:bg-primary-dark"
          >
            {segment.cta.label}
          </a>
        </div>
      ))
    }
  </div>
</div>

<script>
  import { revealOnScroll } from "../../scripts/motion";

  const triggers = document.querySelectorAll<HTMLButtonElement>("[data-tab-trigger]");
  const panels = document.querySelectorAll<HTMLElement>("[data-tab-panel]");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const target = trigger.dataset.tabTrigger;

      triggers.forEach((t) => {
        const isActive = t.dataset.tabTrigger === target;
        t.dataset.active = String(isActive);
        t.setAttribute("aria-selected", String(isActive));
      });

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.tabPanel !== target;
      });
    });
  });

  revealOnScroll(".tab-panel:not([hidden])");
</script>
```

- [ ] **Step 3: Crear `src/pages/features.astro`**

```astro
---
import Layout from "../layouts/Layout.astro";
import AudienceTabs from "../components/features/AudienceTabs.astro";
---

<Layout
  title="Features"
  description="Una plataforma, siete formas de ganar. Descubre qué le ofrece Dondii a cada tipo de usuario y negocio."
>
  <section class="mx-auto max-w-6xl px-6 pt-20 text-center">
    <h1 class="text-4xl font-black text-ink md:text-5xl">
      Una plataforma, siete formas de ganar.
    </h1>
    <p class="mx-auto mt-4 max-w-2xl text-ink/70">
      Ningún público es de segunda clase en Dondii. Elegí el tuyo y mirá qué te ofrece.
    </p>
  </section>
  <section class="py-16">
    <AudienceTabs />
  </section>
  <section class="mx-auto max-w-3xl px-6 pb-24 text-center text-sm text-ink/60">
    <p>
      Los negocios pueden pagar por visibilidad extra en el feed, con tiers
      balanceados para que un presupuesto grande no ahogue a un negocio chico.
      <!-- TODO: agregar cifras de pricing cuando estén definidas -->
    </p>
  </section>
</Layout>
```

- [ ] **Step 4: Verificar**

Run: `npx astro check`
Expected: `0 errors`

Run: `npm run dev`, abrir `http://localhost:4321/features`, click en cada tab y confirmar que el panel cambia y el botón "Creadores de Comida" muestra el badge "Categoría nueva". Cortar el server.

- [ ] **Step 5: Commit**

```bash
git add src/data/segments.ts src/components/features/AudienceTabs.astro src/pages/features.astro
git commit -m "feat: add Features page with audience tabs for the 7 segments"
```

---

### Task 11: Founders — data + FounderCard + página

**Files:**
- Create: `src/data/founders.ts`
- Create: `src/components/founders/FounderCard.astro`
- Create: `src/pages/founders.astro`

**Interfaces:**
- Produces: `export interface Founder { name: string; role: string; bio: string; initials: string }` y `export const founders: Founder[]` en `src/data/founders.ts`.

- [ ] **Step 1: Crear `src/data/founders.ts`**

```typescript
export interface Founder {
  name: string;
  role: string;
  bio: string;
  initials: string;
}

// TODO: reemplazar con nombres, roles, bios e iniciales reales de los founders
export const founders: Founder[] = [
  {
    name: "Nombre Apellido",
    role: "Cofundador/a — CEO",
    bio: "Bio de placeholder: reemplazar con la historia real de este founder y su rol en Dondii.",
    initials: "NA",
  },
  {
    name: "Nombre Apellido",
    role: "Cofundador/a — CTO",
    bio: "Bio de placeholder: reemplazar con la historia real de este founder y su rol en Dondii.",
    initials: "NA",
  },
];
```

- [ ] **Step 2: Crear `FounderCard.astro`**

```astro
---
import type { Founder } from "../../data/founders";

interface Props {
  founder: Founder;
}
const { founder } = Astro.props;
---

<div class="rounded-2xl border border-primary-light/60 bg-white p-6 text-center">
  <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-black text-paper">
    {founder.initials}
  </div>
  <h3 class="mt-4 text-lg font-bold text-ink">{founder.name}</h3>
  <p class="text-sm font-semibold text-primary">{founder.role}</p>
  <p class="mt-3 text-sm text-ink/70">{founder.bio}</p>
</div>
```

- [ ] **Step 3: Crear `src/pages/founders.astro`**

```astro
---
import Layout from "../layouts/Layout.astro";
import FounderCard from "../components/founders/FounderCard.astro";
import { founders } from "../data/founders";
---

<Layout
  title="Founders"
  description="Conocé al equipo detrás de Dondii — conocemos Hermosillo porque somos de acá."
>
  <section class="mx-auto max-w-4xl px-6 pt-20 text-center">
    <h1 class="text-4xl font-black text-ink md:text-5xl">El equipo</h1>
    <p class="mx-auto mt-4 max-w-2xl text-ink/70">
      Conocemos la ciudad, la gente y la escena gastronómica de Hermosillo
      porque somos de acá. Una app de descubrimiento gastronómico hecha por
      quienes ya saben dónde se come bien tiene una autenticidad que no se compra.
    </p>
  </section>

  <section class="mx-auto max-w-4xl px-6 py-16">
    <div class="grid gap-6 sm:grid-cols-2">
      {founders.map((founder) => <FounderCard founder={founder} />)}
    </div>
  </section>

  <section class="mx-auto max-w-2xl px-6 pb-24 text-center">
    <p class="text-ink/70">
      ¿Querés sumarte al equipo o conversar sobre Dondii?
    </p>
    <!-- TODO: reemplazar href con el mail o link de contacto real -->
    <a href="#" class="mt-4 inline-block font-semibold text-primary underline underline-offset-4 hover:text-primary-dark">
      Escribinos →
    </a>
  </section>
</Layout>
```

- [ ] **Step 4: Verificar**

Run: `npx astro check`
Expected: `0 errors`

- [ ] **Step 5: Commit**

```bash
git add src/data/founders.ts src/components/founders/FounderCard.astro src/pages/founders.astro
git commit -m "feat: add Founders page with placeholder team data"
```

---

### Task 12: Páginas legales placeholder y 404

**Files:**
- Create: `src/pages/privacidad.astro`
- Create: `src/pages/terminos.astro`
- Create: `src/pages/404.astro`

- [ ] **Step 1: Crear `src/pages/privacidad.astro`**

```astro
---
import Layout from "../layouts/Layout.astro";
---

<Layout title="Privacidad" description="Política de privacidad de Dondii.">
  <section class="mx-auto max-w-2xl px-6 py-24">
    <h1 class="text-3xl font-black text-ink">Política de privacidad</h1>
    <!-- TODO: reemplazar con el texto legal real de la política de privacidad -->
    <p class="mt-6 text-ink/70">
      Este es un texto de placeholder. La política de privacidad definitiva
      de Dondii se va a publicar acá antes del lanzamiento.
    </p>
  </section>
</Layout>
```

- [ ] **Step 2: Crear `src/pages/terminos.astro`**

```astro
---
import Layout from "../layouts/Layout.astro";
---

<Layout title="Términos" description="Términos y condiciones de Dondii.">
  <section class="mx-auto max-w-2xl px-6 py-24">
    <h1 class="text-3xl font-black text-ink">Términos y condiciones</h1>
    <!-- TODO: reemplazar con el texto legal real de términos y condiciones -->
    <p class="mt-6 text-ink/70">
      Este es un texto de placeholder. Los términos y condiciones definitivos
      de Dondii se van a publicar acá antes del lanzamiento.
    </p>
  </section>
</Layout>
```

- [ ] **Step 3: Crear `src/pages/404.astro`**

```astro
---
import Layout from "../layouts/Layout.astro";
---

<Layout title="Página no encontrada" description="Esta página no existe.">
  <section class="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-32 text-center">
    <p class="text-6xl font-black text-primary">404</p>
    <h1 class="text-2xl font-black text-ink">Esta página se perdió, como cuando no encontrás dónde comer.</h1>
    <a href="/" class="font-semibold text-primary underline underline-offset-4 hover:text-primary-dark">
      Volver al inicio
    </a>
  </section>
</Layout>
```

- [ ] **Step 4: Verificar**

Run: `npx astro check`
Expected: `0 errors`

- [ ] **Step 5: Commit**

```bash
git add src/pages/privacidad.astro src/pages/terminos.astro src/pages/404.astro
git commit -m "feat: add placeholder legal pages and 404"
```

---

### Task 13: Integración final

**Files:**
- No crea archivos nuevos — solo verificación end-to-end.

- [ ] **Step 1: Type-check completo**

Run: `npx astro check`
Expected: `0 errors`

- [ ] **Step 2: Build de producción (única vez, al final del plan)**

Run: `npx astro build`
Expected: build exitoso, genera `dist/index.html`, `dist/features/index.html`, `dist/founders/index.html`, `dist/blog/index.html`, `dist/blog/bienvenidos-a-dondii/index.html`, `dist/blog/programa-negocios-fundadores/index.html`, `dist/privacidad/index.html`, `dist/terminos/index.html`, `dist/404.html`.

Run: `rm -rf dist` (no se commitea el build de producción)

- [ ] **Step 3: Recorrido visual manual**

Run: `npm run dev`, y en el navegador recorrer en orden: `/` (scroll completo, confirmar que Hook y ForBusinesses animan al entrar en viewport), `/features` (probar los 7 tabs), `/founders`, `/blog`, un post individual, `/privacidad`, `/terminos`, y una URL inexistente para confirmar que cae en `/404`. Cortar el server al terminar.

- [ ] **Step 4: Commit final (si hubo ajustes del recorrido)**

Si el Step 3 no generó cambios, este paso se omite. Si generó ajustes menores:

```bash
git add -A
git commit -m "fix: adjustments from end-to-end visual review"
```

---

## Spec Coverage Checklist

- Sitemap completo (`/`, `/features`, `/founders`, `/blog`, `/blog/[slug]`, legales) → Tasks 2, 7, 8, 9, 10, 11, 12
- Home, las 9 secciones en orden → Tasks 4, 5, 6, 9
- Features con 7 segmentos vía tabs y datos estructurados → Task 10
- Founders placeholder-ready → Task 11
- Blog vía Content Collections, sin posts reales, con seeds → Tasks 7, 8
- Layout compartido (Nav/Footer) → Task 2
- Flujo de datos estructurado (no HTML repetido) → Tasks 6, 10, 11 (`src/data/*.ts`)
- Anclaje estructural de GSAP en Hook, pivot de audiencia y tabs → Tasks 3, 4, 5, 10
- Testing liviano (`astro check` + build único + revisión visual) → Global Constraints, Task 13
- Contenido pendiente de terceros marcado explícitamente → Tasks 2, 6, 10, 11, 12 (comentarios `TODO`)
