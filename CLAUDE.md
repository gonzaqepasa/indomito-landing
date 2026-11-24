# CLAUDE.md: Web de Indómito Training

Contexto para Claude Code. Leé este archivo entero antes de crear o modificar cualquier cosa en esta carpeta.

## Qué estamos haciendo

Una web **simple, estática y de una sola página** (one-page con secciones) para **Indómito Training**, gimnasio de barrio en Del Viso, Pilar (Buenos Aires).

- La arma Gonzalo, coach y coordinador del gimnasio. No es programador: explicale los cambios en criollo y sin jerga.
- **Objetivo principal:** que la persona que llega desde Instagram o Google **reserve su clase de prueba gratis por WhatsApp**. Todo el diseño empuja a ese botón.
- **Objetivos secundarios:** mostrar el lugar real, la comunidad y las reseñas; dar la grilla de horarios y los planes; aparecer en Google (la ficha de Google hoy no tiene sitio web).
- El negocio apunta a pasar de unos 215 socios activos a 300.

## Stack y reglas técnicas

- **Solo HTML, CSS y JavaScript puro.** Sin frameworks, sin build, sin npm, sin librerías externas (nada de GSAP, jQuery, Bootstrap, Tailwind por CDN, etc.).
- Se sube a mano a un **hosting compartido de DonWeb**, dentro de `public_html`. Todo tiene que funcionar abriendo `index.html` desde ese hosting, sin servidor ni base de datos.
- Las rutas son siempre **relativas** (`assets/img/...`), nunca absolutas ni a `localhost`.
- Las fuentes vienen de Google Fonts (Anton, Archivo Black, Inter). Es la única dependencia externa permitida, junto con el iframe del mapa de Google.
- **El celular es lo primero.** La mayoría de las visitas vienen de Instagram. Diseñá para 375 px de ancho y después agrandá.
- Código ordenado y comentado en español, para que Gonzalo pueda cambiar un texto o un precio sin romper nada.

### Estructura de carpetas

```
/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── logo/        (logo principal, versión fondo claro, ícono)
│   ├── img/         (fotos del gimnasio, coaches, clases)
│   ├── resenas/     (capturas de reseñas)
│   └── video/       (videos cortos para la portada)
├── favicon.ico (+ favicon PNG 32 y 180 para Apple)
├── robots.txt
└── sitemap.xml
```

Si hace falta una página extra (por ejemplo la del Reto), va como `reto.html` en la raíz, con el mismo CSS y JS.

## Identidad de marca (del Manual de Marca 2026)

### Concepto
- **"Indómito no es para todos. Es para los que buscan más."** y **"Si sentís el llamado, esta es tu casa."**
- Conviven dos ideas: **exigencia** ("no es para todos") y **pertenencia** ("esta es tu casa"). Es un lugar que te desafía, pero donde nadie entrena solo.
- Personalidad: aguerrida, directa, auténtica y de barrio. Más "equipo" que "cadena".
- Símbolo: el **dinosaurio rugiendo** dentro de un hexágono (instinto, fuerza, algo que no se domestica).
- Al gimnasio también le dicen **"el Búnker"**.

### Colores

| Nombre | HEX | Uso |
|---|---|---|
| Negro Búnker | `#0B0B0B` | Fondo principal |
| Gris Acero | `#2A2A2A` | Fondos secundarios, tarjetas, detrás del logo |
| Blanco | `#FFFFFF` | Texto, fondos claros puntuales |
| Rojo Indómito | `#D0111A` | **Solo acento:** botones, palabras clave, líneas |
| Dorado | `#C9A44C` | **Solo eventos especiales** (Fiesta de Fin de Año, premios del reto). No usar en la web general. |

- Proporción: más o menos 60% negro, 25% blanco y 15% rojo. El rojo nunca va de fondo de secciones enteras.
- Definí los colores como variables CSS en `:root` y no escribas los HEX sueltos en el resto del código.
- Revisá el contraste: el texto rojo chico sobre negro puede quedar justo. Para texto de lectura usá blanco o gris claro.

### Tipografías
- **Anton**: titulares en MAYÚSCULAS, condensados y de impacto (hero, títulos de sección, precios).
- **Archivo Black**: etiquetas, subtítulos cortos y horarios, con letter-spacing amplio, como "TRAINING" en el logo.
- **Inter** (400, 600 y 700): todo el texto de lectura.
- Usá `font-display: swap`.

### Logo
- La versión principal es para fondo oscuro. **Sobre negro puro el hexágono se pierde:** ponela sobre Gris Acero, una foto o una textura oscura.
- La versión de fondo claro solo va sobre blanco.
- El ícono solo (dinosaurio) es para el favicon y los lugares chicos.
- No estirar, no rotar, no cambiar los colores, no ponerle sombras ni efectos, no apoyarlo sobre rojo.
- Tamaño mínimo: 120 px de ancho el logo completo y 48 px el ícono. Dejá aire alrededor (más o menos la mitad del ancho del rombo blanco).

### Tono de voz
- **Como un coach del barrio:** directo, desafiante y cercano. Frases cortas, **de vos**, en español argentino. Primero la idea, después el detalle.
- ✅ "No es solo boxeo. Es preparación." · "Un circuito. Un desafío. Tu versión más fuerte." · "¿Primera vez? La clase de prueba es gratis. Vení."
- ❌ Nada de "¡¡¡SUPER PROMO IMPERDIBLE!!!", nada de burlarse del físico ni de usar la culpa para vender, nada de "Estimado cliente".
- No inventes testimonios, números ni logros. Si falta un dato, dejá un `<!-- TODO: ... -->` visible en el código y avisale a Gonzalo.

## Datos del negocio

- **Nombre:** Indómito Training
- **Dirección:** Francisco Pizarro 1244, B1669 Del Viso, Pilar, Buenos Aires. En ese lugar desde 2017.
- **Teléfono / WhatsApp:** 11 4970-2957, en formato internacional `5491149702957` → `https://wa.me/5491149702957`. *(TODO: confirmar que sea el número de WhatsApp que atiende las consultas.)*
- **Horario:** lunes a viernes de 7 a 22 h; sábados de 9 a 17 h.
- **Instagram:** [@indomito.training](https://instagram.com/indomito.training), unos 7.800 seguidores.
- **Marca hermana:** [@suplementos.indomito](https://instagram.com/suplementos.indomito).
- **Google:** 4,9 ★ con más de 100 opiniones. Lo que más repiten las reseñas: te sentís como en casa, hay gente de todas las edades, te ayudan a sostener el hábito, los horarios son cómodos y el acompañamiento es bueno.
- **El lugar:** unos 10 x 70 m, con patio. Planta baja: sala de musculación. Primer piso: salón de clases. Hay ring de boxeo.
- **Diferencial:** rutinas 100% personalizadas, la mejor atención de los coaches y un sistema de entrenamiento propio que se va mejorando.

### Equipo
- **Florencia**: dueña y coach, turno mañana.
- **Agustina**: coach. *(TODO: turno.)*
- **Gonzalo**: coach / personal trainer y coordinador, turno tarde (16 a 22 h).

### Propuesta 2026: "Subimos el nivel"
Todos los planes incluyen rutinas 100% personalizadas, seguimiento constante, acompañamiento nutricional *(TODO: definir quién lo da antes de destacarlo)* y un equipo que empuja a dar más.
Lema: **"Rendirse no es una opción."** Cierre: **"En Indómito no venís a pasar el tiempo. Venís a transformarte."**

### Planes de musculación (mensuales)
| Plan | Frecuencia | Precio |
|---|---|---|
| Plan Impulso | 2 veces por semana | $30.000 |
| Plan Progreso | 3 veces por semana | $38.000 |
| Plan Evolución | Pase libre | $45.000 |

- Inscripción: $5.000 (solo el primer mes).
- Opciones flexibles: Day Pass $6.000 · Semanal $18.000 · Quincenal $28.000.
- **Clase de prueba: GRATIS en todas las actividades** (es el CTA principal).

> ⚠️ **Precios: decisión pendiente.** El gimnasio planea subirlos, así que todavía no está decidido si se publican. Armá la sección de planes de forma que los precios estén todos juntos en un solo lugar del HTML y sea fácil cambiarlos u ocultarlos (por ejemplo, reemplazarlos por "Consultá por WhatsApp"). Destacá el Plan Evolución como el recomendado.

### Clases y horarios
| Actividad | Días | Horario | Mensual |
|---|---|---|---|
| Funcional | Martes y jueves | 9:00 | $40.000 |
| Power Box | Lunes, miércoles y viernes | 14:00 | $48.000 |
| Cross Circuit | Martes y jueves | 18:00 | $30.000 |
| Jumping (Power Jump) | Martes y jueves | 19:00 | $30.000 |
| Yoga | Martes y jueves / sábados | 10:30 y 15:00 / 10:00 | $30.000 |
| Kung Fu | Martes y jueves | 20:00 | $30.000 |
| Taekwondo infantil | Lunes, miércoles y jueves | 18:00 a 20:00 | $20.000 |
| Boxeo 3x | Lunes a viernes | 18:00–19:30 / 19:30–21:00 | $40.000 |
| Boxeo 5x | Lunes a viernes | 18:00–19:30 / 19:30–21:00 | $50.000 |
| Musculación | Lunes a viernes 7 a 22 h · sábados 9 a 17 h | — | ver planes |

*(TODO: el horario de boxeo no coincide en todos lados; en el flyer de Instagram dice 19:00 a 20:30. Confirmar.)*

### Reto Indómito Elite: 30 días (producto destacado)
- 30 días de acompañamiento personal: plan de alimentación personalizado, entrenamiento adaptado al objetivo (presencial o virtual), rutinas nuevas en cada entrenamiento, acceso libre al gimnasio, seguimiento diario por WhatsApp, ajustes semanales y apoyo con los hábitos.
- Precio: $70.000 el programa completo.
- Gancho: "¿Cuántas veces arrancaste un plan y lo dejaste a mitad de camino? La diferencia esta vez es que no vas a hacerlo solo/a."
- CTA: WhatsApp con el mensaje **"QUIERO EMPEZAR"**.
- Todavía es una versión inicial y puede cambiar. **La web no tiene que pedir datos de salud, peso ni fotos:** el formulario de inicio se maneja por WhatsApp.

### Eventos (opcional, como banner o sección chica)
- **La Velada Indómito**: boxeo amateur con peleas y exhibiciones.
- **Fiesta de Fin de Año**: viernes 18/12/2026. Es el único lugar donde se puede usar el dorado.
- Los eventos vencen: ponelos en un bloque fácil de sacar o de cambiar.

## Secciones de la página (orden sugerido)

1. **Header fijo**: logo, menú ancla (Clases, Planes, Reto, Reseñas, Contacto) y botón "Clase gratis". En el celular, menú hamburguesa.
2. **Hero**: video de fondo silenciado y en loop (o foto si no hay video), con un titular tipo "NO ES PARA TODOS." en Anton, un subtítulo y el CTA de WhatsApp.
3. **Contadores**: "Desde 2017", "4,9 ★ en Google", "+200 socios", "9 disciplinas", animados al entrar en pantalla.
4. **Por qué Indómito**: los tres pilares (rutinas personalizadas, coaches que te acompañan, sistema propio) y el tono "esta es tu casa".
5. **Disciplinas**: una tarjeta por actividad con foto, una línea de descripción, días y horario.
6. **El lugar / el Búnker**: galería de la sala, el salón, el ring y el patio.
7. **Planes**: las tarjetas de musculación y las opciones flexibles (ver la nota de precios).
8. **Reto Indómito Elite**: bloque destacado con su propio CTA.
9. **Coaches**: foto y una línea de cada uno.
10. **Reseñas**: cinta horizontal que se desliza sola (marquee) con tarjetas de texto, más algunas capturas reales.
11. **Preguntas frecuentes**: acordeón. *(TODO: contenido.)*
12. **Ubicación y contacto**: mapa de Google embebido, dirección, horarios, Instagram y WhatsApp.
13. **Footer**: "SI SENTÍS EL LLAMADO, ESTA ES TU CASA.", redes, @suplementos.indomito y año.
14. **Botón flotante de WhatsApp**, siempre visible, con el mensaje armado: "Hola! Quiero reservar mi clase de prueba gratis en Indómito 💪".

Todos los links de WhatsApp usan `https://wa.me/5491149702957?text=` más el mensaje codificado con `encodeURIComponent`.

## Movimiento y animaciones

Se busca una página **dinámica, con movimiento al scrollear**, pero que no se vuelva lenta ni maree.

- Elementos que aparecen al entrar en pantalla (fade + desplazamiento corto) usando **`IntersectionObserver`**. No escuches el evento `scroll` para esto.
- **Parallax** suave en las fotos grandes, con `transform` (nunca animando `top` o `margin`).
- **Contadores** que suben de 0 al número cuando entran en pantalla.
- **Marquee de reseñas** infinito hecho con CSS, que se pausa al pasar el mouse.
- Header que cambia de fondo (transparente → negro) al bajar.
- Animá solo `transform` y `opacity`.
- **Respetá `prefers-reduced-motion`:** si el usuario lo tiene activado, se desactivan el parallax, el marquee y los reveals, y el contenido se muestra directo.
- Sin JavaScript, el contenido se tiene que ver igual. Nada queda oculto por depender del JS.

## Imágenes y rendimiento

- Las imágenes se alojan **en el mismo hosting**, dentro de `assets/`. Nunca enlazarlas desde Drive, Instagram ni WhatsApp.
- Formato **WebP**, comprimido y redimensionado. Como referencia: hero de 1920 px y unos 250 KB como máximo; tarjetas de 800 px y unos 80 KB. Usá `srcset` cuando valga la pena.
- `loading="lazy"` en todo lo que esté debajo del hero. Poné `width` y `height` siempre, así la página no salta mientras carga.
- Video del hero: MP4 (H.264) silenciado, unos 10 a 15 segundos, de menos de 3 MB, con `muted autoplay loop playsinline` y `poster`. En el celular podés mostrar solo el poster.
- Si tenés las herramientas a mano (`cwebp`, `ffmpeg`, ImageMagick), optimizá vos los archivos originales que deje Gonzalo. Guardá los originales aparte, en una carpeta `_originales/` que **no** se sube.
- La meta es un Lighthouse de más de 90 en Performance y Accesibilidad desde el celular.

### Reseñas: privacidad
- De las reseñas de Google se transcribe el texto a tarjetas HTML (nombre de pila e inicial, estrellas y texto) y se suman algunas capturas reales.
- **En las capturas de WhatsApp hay que tapar o difuminar el número, la foto de perfil y el apellido.** Nunca publiques datos personales de los socios.
- No inventes reseñas ni cambies lo que dicen.

## SEO local y accesibilidad

- `<html lang="es-AR">`, un `<title>` y una meta description con palabras clave locales ("gimnasio en Del Viso", "boxeo en Del Viso, Pilar", "musculación").
- Open Graph y Twitter Card con una imagen de 1200x630, para que se vea bien cuando se comparte por WhatsApp o Instagram.
- **JSON-LD `ExerciseGym`** con nombre, dirección, teléfono, horarios (`openingHoursSpecification`), la URL de Instagram en `sameAs` y el rating de Google.
- Un solo `<h1>` y jerarquía de títulos correcta. `alt` descriptivo en todas las imágenes.
- Foco visible, menú usable con teclado, contraste AA y botones de al menos 44 px de alto.
- `robots.txt` y `sitemap.xml` con el dominio definitivo. *(TODO: dominio.)*

## Cosas que NO hacer

- **No mencionar al inversor ni a terceros ajenos al equipo.** La marca se cuenta desde el gimnasio, el equipo y los socios, sin nombres propios fuera de los tres coaches.
- No hablar de la competencia (Brutal Force, Olympus, Nano Gym, etc.) ni compararse con ella en la web.
- No agregar formularios que pidan datos de salud ni nada que necesite un backend. Todo se canaliza por WhatsApp.
- No sumar cookies, trackers ni pop-ups. Analytics o Meta Pixel se agregan solo si Gonzalo pasa los IDs.
- No usar fotos de stock de "gimnasio genérico" como si fueran del lugar. Si falta una foto, usá un placeholder claramente marcado (`<!-- TODO: foto -->`).

## Pendientes (completar a medida que lleguen)

- [ ] Archivos del logo (principal, fondo claro, ícono) en `assets/logo/`
- [ ] Fotos y videos reales del gimnasio, las clases y los coaches
- [ ] Capturas de reseñas (Google y WhatsApp)
- [ ] Confirmar el número de WhatsApp
- [ ] Decidir si se publican los precios
- [ ] Turno y bio de Agustina; bios cortas de los coaches
- [ ] Confirmar el horario de boxeo
- [ ] Quién da el acompañamiento nutricional
- [ ] Preguntas frecuentes (qué llevar, edad mínima, medios de pago, estacionamiento, si se puede ir sin experiencia)
- [ ] Dominio definitivo
- [ ] IDs de Analytics o Meta Pixel (opcional)

## Cómo trabajar con Gonzalo

- Antes de un cambio grande, mostrá el plan en 3 o 4 líneas.
- Después de cada cambio, decí qué archivo tocaste y cómo verlo (abrir `index.html` en el navegador).
- Para subir a DonWeb: se suben **el contenido** de esta carpeta (sin `_originales/` ni este `CLAUDE.md`) a `public_html` desde el Administrador de archivos o por FTP. Si hace falta, recordale ese paso.
