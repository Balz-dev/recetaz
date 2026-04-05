---
name: nueva-plantilla-pdf
description: Añadir nuevos esquemas de documentación clínica o recetas médicas para exportar como un PDF compatible Client-side render (vía react-pdf).
---

# Skill: React PDF Renderer Templates

## Contexto
El Feature de Exportar/Imprimir recetas usa `@react-pdf/renderer` para construir blobs codificados al vuelo en el cliente sin requerimiento backend. 

## Reglas de la Librería
1. **Componentes Restringidos:** Solo se permite renderizar primitivos inyectados de react-pdf (`<Document>`, `<Page>`, `<View>`, `<Text>`, `<Image>`). NUNCA integrar divs de HTML estándar.
2. **Estilizado (StyleSheet):** Los estilos solo operan como objetos JSON inyectables construidos con `StyleSheet.create({})`. Soporta Flexbox parcial, pero **NO soporta** variables tailwind complejas en tiempo de ejecución. Debes mapear colores brutos (ej `color: "#334155"`).
3. **Fuentes (Fonts):** Solo usa el set matricial si requieres bold/light. Emplea `Font.registerAsync` manejado fuera del renderizado del Document.

## Pasos para Crear Plantilla

1.  **Definir Capa Visual:**
    Crea un subarchivo en la Feature (Por ejemplo `src/features/recetas/components/pdf/RecetaPlantilla.tsx`).
2.  **Exportación Componente:** 
    Es de inyección pura, NO acepta hooks de React como useEffect a largo término dentro de él para Fetch de datos. Los datos le deben llegar ya listos bajo `props`.
    ```tsx
    export const RecetaPlantilla = ({ data }: { data: MedicaDataType }) => (
       <Document> <Page style={styles.page}> <View>...</View> </Page> </Document>
    );
    ```
3.  **Visualizador de PDF (Wrapper Ui)**
    En la página contenedora debes invocar a `PDFViewer` (para web), empaquetándolo detrás de una comprobación si el código reaviva en Hydration SSG. Usa un componente Client-Only o usa validación de runtime `typeof window !== 'undefined'` dado que React-Pdf depende de APIs del browser.
