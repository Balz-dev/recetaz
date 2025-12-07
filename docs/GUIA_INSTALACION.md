# Guía de Instalación y Despliegue - RecetaZ

## Requisitos Previos

- Node.js 18.17 o superior
- npm, yarn o pnpm
- Un navegador moderno (Chrome, Firefox, Safari, Edge)

## Instalación Local (Desarrollo)

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repo>
   cd receta-z
   ```

2. **Instalar dependencias**

   ```bash
   pnpm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   pnpm run dev
   ```
   Abra [http://localhost:3000](http://localhost:3000) en su navegador.

## Construcción para Producción

1. **Generar el build**
   Este paso crea una versión optimizada y los assets de la PWA.

   ```bash
   pnpm run build
   ```

   _Nota: El script de build fuerza el uso de Webpack para compatibilidad con PWA._

2. **Probar producción localmente**
   ```bash
   pnpm start
   ```

## Despliegue (Vercel/Netlify)

RecetaZ es una aplicación Next.js estática/dinámica que puede desplegarse fácilmente.

### Vercel (Recomendado)

1. Instale Vercel CLI: `npm i -g vercel`
2. Ejecute `vercel` en la raíz del proyecto.
3. Siga las instrucciones. La configuración se detectará automáticamente.

**Importante para PWA**: Asegúrese de que las variables de entorno no bloqueen la generación de assets durante el build.

## Verificación de PWA

Para verificar que la PWA está correctamente instalada:

1. Abra las herramientas de desarrollo de Chrome (F12).
2. Vaya a la pestaña **Application**.
3. En la sección **Service Workers**, verifique que el status sea "Activated" y "Running".
4. En **Manifest**, verifique que no haya errores y que los iconos se carguen.
5. Pruebe el modo offline en la pestaña **Network** (seleccione "Offline") y recargue la página.
