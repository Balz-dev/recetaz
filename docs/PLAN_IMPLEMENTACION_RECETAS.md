# Plan de Implementación - Sistema de Recetas Médicas

## Fase 1: Setup Inicial del Proyecto

### Objetivo

Crear la base del proyecto Next.js 15 con todas las dependencias necesarias.

### Tareas

1. **Verificar entorno actual**
   - Revisar si ya existe un proyecto Next.js
   - Verificar versión de Node.js

2. **Inicializar proyecto o limpiar existente**
   - Crear nuevo proyecto Next.js 15 con App Router
   - Configurar TypeScript

3. **Instalar dependencias principales**

   ```bash
   # Core
   npm install next@latest react@latest react-dom@latest

   # UI y Estilos
   npx shadcn-ui@latest init

   # Base de datos local
   npm install dexie dexie-react-hooks

   # Formularios y validación
   npm install react-hook-form @hookform/resolvers zod

   # PDF
   npm install @react-pdf/renderer

   # PWA
   npm install next-pwa

   # Utilidades
   npm install date-fns uuid
   npm install -D @types/uuid

   # Icons
   npm install lucide-react
   ```

4. **Configurar shadcn/ui**
   - Instalar componentes base: button, input, form, card, dialog, table, select, textarea, label

5. **Configurar PWA**
   - Actualizar next.config.js
   - Crear manifest.json

### Criterios de Aceptación

- ✅ Proyecto Next.js 15 funcionando
- ✅ shadcn/ui configurado correctamente
- ✅ TypeScript sin errores
- ✅ Servidor de desarrollo corriendo

### Pruebas

- Ejecutar `npm run dev` sin errores
- Verificar que la página inicial carga

---

## Fase 2: Base de Datos IndexedDB

### Objetivo

Configurar Dexie.js y crear la estructura de base de datos local.

### Tareas

1. **Crear tipos TypeScript**
   - Definir interfaces en `src/types/index.ts`

2. **Configurar Dexie**
   - Crear `src/lib/db/index.ts`
   - Definir schemas de tablas
   - Configurar versiones de DB

3. **Crear servicios de datos**
   - `src/lib/db/medico.ts`: CRUD para configuración médico
   - `src/lib/db/pacientes.ts`: CRUD para pacientes
   - `src/lib/db/recetas.ts`: CRUD para recetas

4. **Implementar funciones auxiliares**
   - Generador de IDs únicos
   - Generador de número de receta
   - Funciones de búsqueda y filtrado

### Criterios de Aceptación

- ✅ IndexedDB creada correctamente
- ✅ Funciones CRUD funcionando
- ✅ Datos persisten después de recargar

### Pruebas

- Crear datos de prueba
- Verificar en DevTools > Application > IndexedDB
- Probar operaciones CRUD

---

## Fase 3: Layout y Navegación

### Objetivo

Crear el layout principal con sidebar y navegación.

### Tareas

1. **Crear componentes de layout**
   - `src/components/layout/sidebar.tsx`
   - `src/components/layout/header.tsx`
   - `src/app/layout.tsx`

2. **Configurar rutas**
   - `/` - Dashboard
   - `/configuracion` - Configuración del médico
   - `/pacientes` - Lista de pacientes
   - `/pacientes/nuevo` - Nuevo paciente
   - `/recetas` - Lista de recetas
   - `/recetas/nueva` - Nueva receta

3. **Instalar componentes shadcn necesarios**
   - Sheet (para sidebar móvil)
   - Avatar
   - Badge
   - Separator

### Criterios de Aceptación

- ✅ Navegación funcional entre páginas
- ✅ Sidebar responsive
- ✅ UI moderna y profesional

### Pruebas

- Navegar entre todas las rutas
- Probar en móvil y desktop
- Verificar responsive

---

## Fase 4: Configuración del Médico

### Objetivo

Permitir al médico configurar sus datos por primera vez.

### Tareas

1. **Crear formulario de configuración**
   - `src/components/forms/medico-config-form.tsx`
   - Campos: nombre, especialidad, cédula, teléfono, dirección
   - Validación con Zod

2. **Crear página de configuración**
   - `src/app/configuracion/page.tsx`
   - Cargar datos existentes
   - Permitir edición

3. **Implementar lógica de primer uso**
   - Detectar si no hay configuración
   - Redirigir a configuración inicial
   - Guardar en IndexedDB

### Criterios de Aceptación

- ✅ Formulario valida correctamente
- ✅ Datos se guardan en IndexedDB
- ✅ Datos persisten después de recargar
- ✅ Se puede editar configuración

### Pruebas

- Completar formulario con datos válidos
- Intentar enviar con datos inválidos
- Verificar persistencia
- Editar y guardar cambios

---

## Fase 5: Gestión de Pacientes

### Objetivo

CRUD completo de pacientes con búsqueda.

### Tareas

1. **Crear formulario de paciente**
   - `src/components/forms/paciente-form.tsx`
   - Campos: nombre, edad, cédula, teléfono, dirección
   - Validación con Zod

2. **Crear lista de pacientes**
   - `src/app/pacientes/page.tsx`
   - Tabla con datos
   - Búsqueda por nombre o cédula
   - Acciones: ver, editar, eliminar

3. **Crear página de nuevo paciente**
   - `src/app/pacientes/nuevo/page.tsx`
   - Formulario de creación

4. **Crear página de detalle/edición**
   - `src/app/pacientes/[id]/page.tsx`
   - Mostrar datos del paciente
   - Historial de recetas
   - Opción de editar

### Criterios de Aceptación

- ✅ Se pueden crear pacientes
- ✅ Se pueden listar pacientes
- ✅ Se pueden buscar pacientes
- ✅ Se pueden editar pacientes
- ✅ Se pueden eliminar pacientes

### Pruebas

- Crear 5 pacientes de prueba
- Buscar por nombre
- Editar un paciente
- Eliminar un paciente
- Verificar persistencia

---

## Fase 6: Sistema de Recetas

### Objetivo

Crear y gestionar recetas médicas.

### Tareas

1. **Crear formulario de receta**
   - `src/components/forms/receta-form.tsx`
   - Paso 1: Seleccionar/crear paciente
   - Paso 2: Diagnóstico
   - Paso 3: Medicamentos (array dinámico)
   - Paso 4: Instrucciones
   - Validación completa

2. **Componente de medicamentos**
   - Campos: nombre, dosis, frecuencia, duración
   - Agregar/eliminar medicamentos
   - Mínimo 1 medicamento

3. **Crear página de nueva receta**
   - `src/app/recetas/nueva/page.tsx`
   - Formulario multi-paso
   - Vista previa

4. **Crear lista de recetas**
   - `src/app/recetas/page.tsx`
   - Tabla con recetas
   - Filtros: por paciente, por fecha
   - Búsqueda por número de receta

5. **Crear página de detalle de receta**
   - `src/app/recetas/[id]/page.tsx`
   - Mostrar receta completa
   - Botón para generar PDF

### Criterios de Aceptación

- ✅ Se pueden crear recetas
- ✅ Se asigna número automático
- ✅ Se pueden agregar múltiples medicamentos
- ✅ Se listan todas las recetas
- ✅ Se puede buscar y filtrar

### Pruebas

- Crear receta con 1 medicamento
- Crear receta con 3 medicamentos
- Verificar numeración automática
- Buscar recetas
- Filtrar por paciente

---

## Fase 7: Generación de PDF

### Objetivo

Generar PDF profesional de la receta para imprimir.

### Tareas

1. **Crear template de PDF**
   - `src/components/pdf/receta-template.tsx`
   - Encabezado con datos del médico
   - Número de receta y fecha
   - Datos del paciente
   - Diagnóstico
   - Tabla de medicamentos
   - Instrucciones
   - Pie con firma

2. **Implementar generación**
   - Función para generar PDF
   - Función para descargar
   - Función para imprimir directamente

3. **Integrar en UI**
   - Botón "Generar PDF" en detalle de receta
   - Botón "Imprimir" en detalle de receta
   - Vista previa opcional

### Criterios de Aceptación

- ✅ PDF se genera correctamente
- ✅ Todos los datos aparecen
- ✅ Formato profesional
- ✅ Se puede imprimir
- ✅ Se puede descargar

### Pruebas

- Generar PDF de receta
- Verificar todos los datos
- Imprimir en impresora PDF
- Verificar formato en diferentes tamaños

---

## Fase 8: Dashboard

### Objetivo

Crear dashboard con resumen y accesos rápidos.

### Tareas

1. **Crear página de dashboard**
   - `src/app/page.tsx`
   - Tarjetas con estadísticas:
     - Total de pacientes
     - Total de recetas
     - Recetas del mes
     - Recetas de hoy
   - Lista de recetas recientes
   - Accesos rápidos

2. **Implementar estadísticas**
   - Funciones para calcular totales
   - Funciones para filtrar por fecha

### Criterios de Aceptación

- ✅ Dashboard muestra estadísticas correctas
- ✅ Recetas recientes se listan
- ✅ Accesos rápidos funcionan
- ✅ UI atractiva y útil

### Pruebas

- Verificar números de estadísticas
- Probar accesos rápidos
- Verificar actualización en tiempo real

---

## Fase 9: PWA y Funcionalidad Offline

### Objetivo

Convertir la aplicación en PWA completamente funcional offline.

### Tareas

1. **Configurar Service Worker**
   - Actualizar `next.config.js`
   - Configurar estrategias de cache
   - Cache de páginas y assets

2. **Actualizar manifest.json**
   - Nombre de la app
   - Iconos (generar en diferentes tamaños)
   - Colores del tema
   - Configuración de display

3. **Crear iconos**
   - Generar iconos 192x192 y 512x512
   - Favicon

4. **Probar instalación**
   - En Chrome desktop
   - En Chrome móvil
   - Verificar funcionamiento offline

### Criterios de Aceptación

- [x] App se puede instalar
- [x] Funciona completamente offline
- [x] Assets se cachean correctamente
- [x] UI muestra estado offline

### Pruebas

- Instalar app en desktop
- Instalar app en móvil
- Desconectar internet
- Probar todas las funcionalidades offline
- Verificar que datos persisten

---

## Fase 10: Pruebas Finales y Optimización

### Objetivo

Asegurar calidad y rendimiento óptimo.

### Tareas

1. **Pruebas de funcionalidad**
   - Flujo completo: configuración → paciente → receta → PDF
   - Casos edge: campos vacíos, datos largos, etc.
   - Validaciones

2. **Pruebas de rendimiento**
   - Lighthouse audit
   - Optimizar imágenes
   - Code splitting

3. **Pruebas de accesibilidad**
   - Navegación por teclado
   - Screen readers
   - Contraste de colores

4. **Documentación final**
   - Manual de usuario
   - Guía de instalación
   - Troubleshooting

### Criterios de Aceptación

- [x] Lighthouse score > 90
- [ ] Sin errores en consola
- [ ] Funciona en Chrome, Firefox, Safari
- [x] Documentación completa

### Pruebas

- Ejecutar Lighthouse
- Probar en diferentes navegadores
- Probar en diferentes dispositivos
- Revisar documentación

---

## Notas Importantes

- Cada fase debe completarse y probarse antes de continuar
- Documentar cualquier problema encontrado
- Hacer commits frecuentes con mensajes descriptivos
- Probar en modo desarrollo y producción
