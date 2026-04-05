# Reglas UI, Shadcn y Tailwind — RecetaZ

Aplica estrictamente estos estándares al construir o modificar interfaces gráficas. La accesibilidad (a11y) y la consistencia del diseño no son opcionales.

## 1. Composición de Componentes UI
- ❌ **PROHIBIDO** crear componentes base (Buttons, Modals, Inputs) directamente en las features. 
- ✅ **OBLIGATORIO** verificar si el componente existe en `src/shared/components/ui`. Si falta un componente atómico, créalo allí usando la arquitectura Radix UI / Shadcn.

## 2. Gestión de Variantes y Estilos
- ❌ **PROHIBIDO** concatenación manual condicional de strings (ej: `` `btn ${isActive ? 'bg-red' : ''}` ``).
- ✅ **OBLIGATORIO** usar `class-variance-authority` (cva) acoplado con `clsx` y `tailwind-merge` (típicamente a través de una función `cn()` expuesta en shared/utils).
- Los estilos en línea (`style={{...}}`) están prohibidos, salvo para transformaciones matemáticas calculadas dinámicamente o variables CSS (CSS custom properties).

## 3. Tailwind CSS
- **Colores:** Utiliza exclusivamente el pool semántico de Tailwind inyectado en la configuración (ej: `bg-primary`, `text-muted-foreground`). Prohibido usar escalares arbitrarios que rompan el Design System (ej: `bg-[#ecf0f1]`).
- **Responsive:** Mantén el enfoque mobile-first. Inicia por el layout base y utiliza breakpoints (`sm:`, `md:`, `lg:`) progresivamente.
- **Glassmorphism:** Mantén la coherencia de opacidades y blur según los tokens globales del proyecto preestablecidos en Tailwind.

## 4. Accesibilidad (A11y)
- Las etiquetas semánticas HTML5 (`<main>`, `<article>`, `<nav>`, `<aside>`) deben respetarse.
- Elementos interactivos *custom* (Clickable divs) REQUIEREN soporte de teclado (`tabIndex={0}`, `onKeyDown`) y roles (`role="button"`).
- Atributos `aria-*` deben agregarse para indicar estados dinámicos (`aria-expanded`, `aria-invalid`, `aria-describedby` para validaciones de formulario).
