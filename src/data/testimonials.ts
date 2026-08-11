export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

// TODO: reemplazar con testimonios reales de usuarios y negocios
export const testimonials: Testimonial[] = [
  {
    quote:
      "Testimonio de placeholder: reemplazar con una cita real de un usuario de Dondii.",
    author: "Nombre Apellido",
    role: "Usuaria de Dondii",
  },
  {
    quote:
      "Testimonio de placeholder: reemplazar con una cita real de un negocio en Dondii.",
    author: "Nombre Apellido",
    role: "Dueño de negocio en Dondii",
  },
  {
    quote:
      "Testimonio de placeholder: reemplazar con una cita real de un Creador de Comida.",
    author: "Nombre Apellido",
    role: "Creador de Comida en Dondii",
  },
];
