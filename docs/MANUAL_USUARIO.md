# Manual de Usuario - Sistema de Recetas Médicas RecetaZ

## Introducción

RecetaZ es una aplicación web progresiva (PWA) diseñada para gestionar pacientes y crear recetas médicas de manera eficiente, segura y offline-first.

## Acceso Inicial

Al abrir la aplicación por primera vez, se le redirigirá a la pantalla de **Configuración del Médico** si aún no ha configurado sus datos.

## Guía Paso a Paso

### 1. Configuración del Médico

Esta sección es crucial para que las recetas se generen correctamente.

- Navegue a la sección **Configuración** desde el menú lateral.
- Complete sus datos profesionales:
  - Nombre completo
  - Especialidad
  - Cédula Profesional
  - Teléfono de contacto
  - Dirección del consultorio
  - Logo institucional (opcional)
- Guarde los cambios. Estos datos aparecerán en el encabezado de todas las recetas.

### 2. Gestión de Pacientes

Para emitir una receta, primero debe registrar al paciente.

#### Registrar Nuevo Paciente

- Vaya a la sección **Pacientes**.
- Haga clic en el botón **"Nuevo Paciente"**.
- Complete el formulario. Los campos marcados con \* son obligatorios.
  - Nombre (Obligatorio)
  - Edad
  - Alergias (Importante)
- Guarde el paciente.

#### Buscar y Editar Pacientes

- En la lista de pacientes, use el buscador para encontrar por nombre.
- Haga clic en un paciente para ver su historial o editar sus datos.

### 3. Creación de Recetas

Puede crear una receta desde el detalle del paciente o desde la sección Recetas.

- Vaya a **Recetas** > **Nueva Receta**.
- **Paso 1: Selección de Paciente**: Busque y seleccione el paciente. Si no existe, puede crearlo rápidamente desde el mismo selector (+).
- **Paso 2: Diagnóstico**: Ingrese el diagnóstico médico.
- **Paso 3: Medicamentos**:
  - Agregue cada medicamento indicando dosis, frecuencia y duración.
  - Use el botón "Agregar Medicamento" para añadir más ítems.
  - Ajuste instrucciones específicas si es necesario.
- **Paso 4: Indicaciones Generales**: Agregue recomendaciones de dieta, reposo, etc.
- **Guardar**: Finalice la receta. Se le asignará un folio automáticamente.

### 4. Impresión y Compartir

Una vez guardada la receta:

- Verá el detalle completo.
- Haga clic en **"Imprimir PDF"** para generar el documento oficial.
- Puede guardar el PDF o imprimirlo directamente.

### 5. Módulo de Finanzas (NUEVO)

El dashboard principal ahora incluye un panel de finanzas que le permite monitorear sus ingresos.

#### Configurar Costo de Consulta

- En el panel de **"Ingresos por Consultas"** del dashboard, encontrará un campo para configurar el costo de su consulta.
- El valor predeterminado es $500.00 MXN.
- Puede modificarlo en cualquier momento haciendo clic en el botón de guardar.

#### Visualizar Ganancias

- El gráfico de barras muestra las ganancias estimadas de los últimos 7 días.
- Las ganancias se calculan automáticamente: **Número de recetas del día × Costo de consulta**.
- El total acumulado se muestra en la parte superior del panel.
- Los datos se actualizan automáticamente al cambiar el costo de consulta.

**Nota**: Este módulo está diseñado para un seguimiento básico de ingresos. En futuras versiones se agregará un módulo contable completo con gastos operativos y otros ingresos.

## Funcionalidad Offline

RecetaZ funciona sin conexión a internet.

- Puede acceder a la aplicación aunque no tenga señal.
- Puede crear pacientes y recetas offline.
- Los datos se guardan localmente en su dispositivo.
- **Nota**: El sistema de backup en la nube (si se contrata) sincronizará cuando recupere la conexión. Por ahora, es 100% local.

## Preguntas Frecuentes

**¿Puedo instalar la App en mi celular?**
Sí. En Android (Chrome) o iOS (Safari), seleccione "Agregar a pantalla de inicio" en el menú del navegador.

**¿Dónde se guardan mis datos?**
Todos los datos se almacenan de forma segura en la base de datos interna de su navegador (IndexedDB). No se comparten con terceros.

**¿Qué pasa si borro el historial del navegador?**
⚠️ **ADVERTENCIA**: Si borra los "Datos de sitio" o "Almacenamiento de aplicaciones" de su navegador, perderá toda la información. Se recomienda hacer copias de seguridad de sus datos regularmente (función próximamente disponible).
