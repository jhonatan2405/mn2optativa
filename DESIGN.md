---
name: TecnoMarket
description: Espacio de operaciones de inventario claro, preciso y confiable.
colors:
  primary-cobalt: "#1a56db"
  primary-cobalt-hover: "#1648bb"
  primary-cobalt-soft: "#eaf1ff"
  canvas-paper: "#f4f7fb"
  surface-white: "#ffffff"
  surface-soft: "#f7f9fc"
  sidebar-navy: "#0d1b2f"
  sidebar-navy-soft: "#152640"
  ink-blue: "#152238"
  text-muted: "#5f6f85"
  text-faint: "#66758a"
  divider-cool: "#e2e8f0"
  divider-strong: "#cbd5e1"
  success-mint: "#087f5b"
  success-mint-soft: "#e6f8f1"
  warning-amber: "#9a4b00"
  warning-amber-soft: "#fff5dc"
  danger-red: "#b4233f"
  danger-red-soft: "#fff0f2"
  analytic-violet: "#7c4dce"
  analytic-violet-soft: "#f1ecff"
  dark-canvas: "#0b1320"
  dark-surface: "#121e2e"
  dark-surface-raised: "#172538"
  dark-surface-soft: "#0f1a29"
  dark-sidebar: "#07111f"
  dark-sidebar-soft: "#102037"
  dark-text: "#ecf2fb"
  dark-text-muted: "#a4b2c6"
  dark-text-faint: "#93a4ba"
  dark-divider: "#26364b"
  dark-divider-strong: "#394b62"
  dark-primary: "#6a96ff"
  dark-primary-hover: "#86aaff"
  dark-primary-soft: "#162c52"
  dark-success: "#4fd1a5"
  dark-success-soft: "#11362e"
  dark-warning: "#f2b24d"
  dark-warning-soft: "#3a2b14"
  dark-danger: "#ff7a8e"
  dark-danger-soft: "#3b1c25"
  dark-violet: "#b99aff"
  dark-violet-soft: "#2d2345"
typography:
  display:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "clamp(2.75rem, 5.5vw, 5.4rem)"
    fontWeight: 800
    lineHeight: 0.99
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "1.65rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.5
rounded:
  xs: "5px"
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "14px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "20px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary-cobalt}"
    textColor: "{colors.surface-white}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
    height: "42px"
  button-primary-hover:
    backgroundColor: "{colors.primary-cobalt-hover}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink-blue}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
    height: "42px"
  field:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink-blue}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "46px"
  panel:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink-blue}"
    rounded: "{rounded.xl}"
    padding: "20px"
  chip-status:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.text-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "5px 8px"
---

# Design System: TecnoMarket

## Overview

**Creative North Star: "El Escritorio de Operaciones Preciso"**

TecnoMarket se comporta como un escritorio comercial limpio: la información es densa pero ordenada, las acciones son inequívocas y cada cambio de estado se vuelve visible sin distraer del inventario. El campo de trabajo claro, la tinta azul y la barra lateral navy dan estructura estable; el cobalto aparece solo donde guía una acción o selección.

La estética combina disciplina empresarial con una suavidad medida. Los bordes fríos, las esquinas de 8–14 px, los números tabulares y los iconos lineales mantienen la lectura técnica; sombras ambientales ligeras y fondos semánticos comunican jerarquía y estado sin convertir el panel en una colección de tarjetas decorativas.

**Key Characteristics:**

- Light-first con tema oscuro equivalente y persistente.
- Densidad compacta, números tabulares y etiquetas operativas legibles.
- Sidebar navy como ancla y cobalto reservado para acción, selección y foco.
- Estados de carga, éxito, advertencia y error siempre visibles.
- Responsive por reducción progresiva, no por simple encogimiento.

## Colors

La paleta enfrenta un campo de papel frío con tinta azul, un cobalto funcional y colores semánticos sobrios; el modo oscuro conserva los mismos roles elevando luminosidad y contraste.

### Primary

- **Cobalto Operativo:** acciona botones principales, foco, enlaces, navegación contextual y datos destacados.
- **Cobalto Profundo:** confirma el hover de acciones primarias.
- **Cobalto de Apoyo:** crea fondos informativos y estados activos de baja intensidad.

### Secondary

- **Menta de Inventario:** identifica éxito, conexión disponible y stock saludable.
- **Ámbar de Atención:** marca espera, stock bajo y advertencias sin competir con los errores.

### Tertiary

- **Violeta Analítico:** diferencia una métrica o segmento de visualización sin abrir un segundo sistema de acento.
- **Rojo de Riesgo:** se reserva para errores y acciones destructivas.

### Neutral

- **Papel Frío:** fondo general del área de trabajo.
- **Superficie Blanca:** tarjetas, formularios, topbar y controles elevados.
- **Tinta Azul:** texto principal y cifras decisivas.
- **Texto Atenuado:** metadatos, ayudas y texto secundario.
- **Divisor Frío:** límites de tabla, panel, campo y sección.
- **Navy de Navegación:** barra lateral, marca y contraste estructural.

### Named Rules

**The Cobalt Means Action Rule.** El cobalto señala interacción, selección o información accionable; no se usa como relleno ornamental de grandes superficies.

**The Semantic Pair Rule.** Cada color de estado usa su tinta y su fondo suave como pareja; no se comunica éxito, advertencia o error solo mediante color.

## Typography

**Display Font:** Manrope (con Segoe UI y sans-serif como respaldo)  
**Body Font:** Manrope (con Segoe UI y sans-serif como respaldo)

**Character:** Una sola familia geométrica mantiene continuidad entre narrativa, datos y controles. El contraste nace del peso, la escala y el espaciado, no de mezclar voces tipográficas.

### Hierarchy

- **Display** (800, escala fluida, 0.99): frase principal del acceso; compacta y contundente.
- **Headline** (800, 2rem, 1.2): encabezados de autenticación y mensajes excepcionales.
- **Title** (800, 1.65rem, 1.25): título de vista y orientación primaria del panel.
- **Body** (400, 1rem, 1.5): contenido base y explicaciones breves; los textos extensos del acceso elevan el interlineado a 1.75.
- **Label** (700, 0.72rem, 1.5): campos, controles, estados y metadatos operativos; puede usar mayúsculas con tracking positivo en rótulos de navegación o marca.

### Named Rules

**The Tabular Data Rule.** Precios, cantidades, porcentajes y conteos usan cifras tabulares para que columnas y cambios de valor permanezcan estables.

**The Compact, Never Tiny Rule.** El tamaño operativo mínimo consolidado es 0.72rem; la jerarquía se consigue con peso y color antes de reducir más.

## Layout

En escritorio, el dashboard reserva 252 px para una sidebar fija y entrega el resto a una columna fluida con ancho máximo de 1600 px. La topbar permanece fija al borde superior y el contenido usa padding horizontal fluido entre 16 y 36 px. Los paneles se organizan con separaciones de 16–18 px y padding interior dominante de 20 px.

La grilla de catálogo muestra cuatro columnas, baja a tres en 1200 px, a dos en 980 px y a una en 540 px. En 980 px la sidebar se convierte en drawer; en 760 px se compactan topbar, tabla, footer y acciones; en 540 px formularios, métricas y auxiliares pasan a una sola columna. La experiencia parte de 320 px como ancho mínimo.

**The Operational Continuity Rule.** Al cambiar de vista, el marcador activo de navegación y el encabezado de contenido deben actualizarse como un único estado; la composición cambia en sitio, no mediante páginas visualmente desconectadas.

## Elevation & Depth

La profundidad es híbrida y contenida: bordes finos definen la mayoría de superficies; una sombra ambiental baja eleva grupos importantes, tarjetas en hover y métricas, mientras una sombra profunda se reserva para la previsualización del acceso. La topbar usa transparencia y desenfoque para permanecer legible durante el desplazamiento.

### Shadow Vocabulary

- **Ambient:** sombra amplia y tenue para paneles importantes y hover de tarjetas.
- **Deep:** sombra de mayor alcance para la tarjeta oscura de previsualización en el acceso.
- **Action:** sombra corta bajo el botón primario para reforzar su condición interactiva.
- **Focus:** anillo cobalto translúcido de 3 px, separado 2 px cuando corresponde, para navegación por teclado.

### Named Rules

**The Border Before Shadow Rule.** Toda superficie se separa primero mediante borde o contraste tonal; la sombra solo refuerza jerarquía, interacción o superposición.

## Shapes

La geometría es cuadrada-suave. Los contenedores principales y diálogos usan esquinas de 14 px; bloques secundarios, avisos y ayudas usan 12 px; botones, campos y navegación usan 10 px; acciones pequeñas usan 8 px. Chips, estados y barras de progreso son píldoras completas. Los iconos son lineales, de extremos redondos y grosor 1.8.

**The Radius Ladder Rule.** Cuanto mayor y más estructural sea la superficie, mayor es el radio: 8 px para microacciones, 10 px para controles, 12 px para bloques secundarios y 14 px para paneles.

## Components

### Buttons

- **Shape:** rectángulos suaves de 10 px, altura mínima de 42 px y peso 700.
- **Primary:** cobalto con texto blanco, padding compacto y sombra corta.
- **Hover / Focus:** oscurece el cobalto y eleva 1 px; el foco conserva el anillo global visible.
- **Secondary:** superficie blanca, texto tinta y borde frío; el hover usa fondo suave y borde más firme.
- **Icon:** caja de 40 px con el mismo borde y radio de los controles; el hover usa cobalto suave.

### Chips

- **Style:** píldora compacta con punto de estado, texto fuerte y fondo tonal suave.
- **State:** neutro, éxito, carga o error; siempre combina etiqueta textual con color.

### Cards / Containers

- **Corner Style:** esquinas amplias de 14 px.
- **Background:** superficie blanca en tema claro y superficie azul-negra en tema oscuro.
- **Shadow Strategy:** ambiental en métricas, paneles principales y hover; las tarjetas de producto permanecen planas en reposo.
- **Border:** regla fría de 1 px.
- **Internal Padding:** normalmente 20 px; tarjetas de producto usan 14–15 px para conservar densidad.

### Inputs / Fields

- **Style:** altura de 46 px, borde frío de 1 px, superficie limpia y radio de 10 px.
- **Focus:** borde cobalto y halo cobalto translúcido de 3 px.
- **Error / Disabled:** el error aparece en bloque rojo suave; controles deshabilitados conservan forma, bajan opacidad y muestran espera.

### Navigation

La sidebar usa navy profundo, iconos lineales y etiquetas compactas. El estado activo combina texto blanco, fondo azul medio y una regla cobalto clara de 3 px en el borde izquierdo. Bajo 980 px se convierte en drawer con backdrop y cierre explícito.

### Product Card

La tarjeta combina imagen contenida sobre gris frío, categoría en píldora, marca cobalto en mayúsculas, precio tabular y dos acciones simétricas. En hover se eleva 3 px, activa borde cobalto tenue y amplía la imagen apenas 1.035×.

### Operational Feedback

Los banners, esqueletos, chips y SweetAlert2 comparten los mismos tokens. Carga usa animación breve, éxito y error conservan texto explícito, y `prefers-reduced-motion` reduce toda animación y transición a una duración casi nula.

## Do's and Don'ts

### Do:

- **Do** mantener el tema claro como predeterminado y mapear cada rol semántico a su equivalente oscuro.
- **Do** usar el radio de 14 px en paneles y la escala 8/10/12/14 px según jerarquía.
- **Do** conservar foco visible, etiquetas explícitas y respuestas textuales para estados operativos.
- **Do** simplificar columnas y controles por breakpoint manteniendo accesibles búsqueda, alta y navegación.
- **Do** conservar el footer con la marca y los perfiles de los creadores.

### Don't:

- **Don't** convertir la cabecera en un hero de marketing ni inflar la tipografía dentro del dashboard.
- **Don't** presentar todas las métricas como tarjetas idénticas aisladas; el strip compartido es parte de la firma visual.
- **Don't** usar cobalto, verde, ámbar, rojo o violeta como decoración sin significado operativo.
- **Don't** depender únicamente del color para comunicar carga, éxito, advertencia, error o selección.
- **Don't** introducir radios, sombras o familias tipográficas fuera del vocabulario documentado.
