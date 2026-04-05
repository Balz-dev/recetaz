# Plan de Implementación: Diseñador de Plantillas de Recetas

Este documento describe el plan técnico para implementar la funcionalidad de plantillas personalizadas para recetas médicas.

## 1. Módulo de Gestión de Plantillas

### 1.1 Modelo de Datos (Types & DB)

Se actualizará `src/types/index.ts` y la configuración de Dexie en `src/shared/db/db.config.ts`.

**Nuevos Tipos:**

```typescript
export interface CampoPlantilla {
  id: string; // Identificador único del campo (ej: "paciente_nombre")
  etiqueta: string; // Nombre visible (ej: "Nombre del Paciente")
  x: number; // Posición X en mm o %
  y: number; // Posición Y en mm o %
  ancho: number; // Ancho disponible
  alto?: number; // Alto disponible
  visible: boolean; // Si se imprime o no
  tipo: "texto" | "fecha" | "lista"; // Tipo de dato
}

export interface PlantillaReceta {
  id: string;
  nombre: string;
  tamanoPapel: "carta" | "media_carta";
  orientacion: "vertical" | "horizontal";
  imagenFondo?: string; // Base64 de la imagen subida
  campos: CampoPlantilla[];
  activa: boolean; // Solo una puede estar activa por defecto
  imprimirFondo: boolean; // Si true, imprime la imagen. Si false, solo los datos (para hojas membretadas)
  createdAt: Date;
  updatedAt: Date;
}
```

**Esquema Base de Datos (Dexie):**
Se agregará la tabla `plantillas` con índices: `id, nombre, activa`.

### 1.2 Dependencias

Se instalarán las librerías necesarias para el diseño interactivo:

- `@dnd-kit/core`: Funcionalidad base de arrastrar y soltar.
- `@dnd-kit/modifiers`: Restricciones de movimiento (ej: mantener dentro de la hoja).
- `@dnd-kit/utilities`: Utilidades de coordenadas.

## 2. Componentes de UI (Diseñador)

### 2.1 Página de Lista de Plantillas (`/recetas/plantillas`)

- Tabla o Grid con tarjetas de plantillas existentes.
- Botón "Nueva Plantilla".
- Opciones: Editar, Eliminar, Establecer como Activa.

### 2.2 Diseñador Visual (`/recetas/plantillas/nueva` o `[id]`)

Este será el componente core.

- **Lienzo (Canvas)**: Representación visual del papel (Carta/Media Carta).
- **Subida de Imagen**: Drag & drop de imagen de fondo (escaneo de receta actual).
- **Caja de Herramientas**: Lista de campos disponibles (Nombre Paciente, Fecha, Diagnóstico, Medicamentos, Firma, etc.).
- **Interacción**:
  - Arrastrar campos desde la caja de herramientas al lienzo.
  - Mover campos sobre el lienzo para alinearlos con la imagen de fondo.
  - Configurar si la imagen de fondo se imprime o es solo guía.

## 3. Integración de Impresión

### 3.1 Actualización del PDF Generator

Actualmente `RecetaPDF` probablemente usa un layout estático. Se modificará para soportar:

- **Modo Dinámico**: Si hay una plantilla activa, usar posiciones absolutas basadas en las coordenadas `x, y` configuradas.
- **Fondo Opcional**: Renderizar la imagen de fondo en el PDF si `imprimirFondo` es true.

### 3.2 Flujo de Usuario

1. Al crear receta, el médico ve la vista previa estándar.
2. Opción "Cambiar Diseño" -> Abre modal o selector para elegir plantilla.
3. Botón "Imprimir" usa la plantilla seleccionada.

## 4. Plan de Trabajo

1.  **Infraestructura**: Actualizar DB y Tipos. Instalar dependencias.
2.  **Lógica**: Crear `TemplateService`.
3.  **UI Lista**: Página de gestión de plantillas.
4.  **UI Diseñador**: Implementar Drag & Drop con `@dnd-kit`.
5.  **Impresión**: Adaptar generación de PDF.
6.  **Pruebas**: Verificar alineación correcta imprimiendo en papel real.

## 5. Directivas de Diseño

- Estética "Premium": Uso de sombras suaves, bordes redondeados, feedback visual claro al arrastrar.
- Uso de Tailwind CSS y componentes Shadcn existente.
- Documentación completa en español.
