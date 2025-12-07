# Proyecto: Sistema de Recetas Médicas PWA

## Descripción General

Aplicación web progresiva (PWA) offline-first para la creación y gestión de recetas médicas, desarrollada con Next.js 15, shadcn/ui, e IndexedDB para almacenamiento local.

## Decisiones Técnicas

### Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Base de Datos Local**: IndexedDB (usando Dexie.js para mejor DX)
- **PWA**: next-pwa para service worker y manifest
- **Generación PDF**: react-pdf (@react-pdf/renderer)
- **Validación**: Zod + React Hook Form
- **Idioma**: Español

### Arquitectura de Datos

#### Configuración del Médico (única vez)

```typescript
interface MedicoConfig {
  id: string;
  nombre: string;
  especialidad: string;
  cedula: string;
  telefono: string;
  direccion?: string;
  logo?: string; // Base64 o URL
  createdAt: Date;
  updatedAt: Date;
}
```

#### Paciente

```typescript
interface Paciente {
  id: string;
  nombre: string;
  edad: number;
  cedula: string;
  telefono?: string;
  direccion?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Receta Médica

```typescript
interface Receta {
  id: string;
  numeroReceta: string; // Auto-generado
  pacienteId: string;
  paciente: Paciente; // Denormalizado para PDF
  diagnostico: string;
  medicamentos: Medicamento[];
  instrucciones: string;
  fechaEmision: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Medicamento {
  id: string;
  nombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  indicaciones?: string;
}
```

### Estructura del Proyecto (Actualizada - Arquitectura Modular)

```
recetaz/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard principal
│   │   ├── configuracion/
│   │   │   └── page.tsx
│   │   ├── pacientes/
│   │   │   ├── page.tsx
│   │   │   ├── nuevo/page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── recetas/
│   │       ├── page.tsx
│   │       ├── nueva/page.tsx
│   │       └── [id]/page.tsx
│   ├── features/                 # Lógica de negocio por característica
│   │   ├── config-medico/        # Configuración del médico
│   │   │   ├── components/
│   │   │   │   ├── MedicoConfigForm.tsx
│   │   │   │   └── ConfiguracionModal.tsx
│   │   │   └── services/
│   │   │       └── medico.service.ts
│   │   ├── pacientes/            # Gestión de pacientes
│   │   │   ├── components/
│   │   │   │   ├── PacienteForm.tsx
│   │   │   │   ├── PacienteList.tsx
│   │   │   │   └── PatientRegistrationModal.tsx
│   │   │   └── services/
│   │   │       └── paciente.service.ts
│   │   ├── recetas/              # Gestión de recetas
│   │   │   ├── components/
│   │   │   │   ├── RecetaForm.tsx
│   │   │   │   ├── RecetaList.tsx
│   │   │   │   ├── RecetaCard.tsx
│   │   │   │   └── RecetaPdfTemplate.tsx
│   │   │   └── services/
│   │   │       └── receta.service.ts
│   │   └── finanzas/             # Módulo de finanzas (NUEVO)
│   │       ├── components/
│   │       │   └── PanelGanancias.tsx
│   │       └── services/
│   │           └── finanzas.service.ts
│   ├── shared/                   # Componentes y utilidades compartidas
│   │   ├── components/
│   │   │   ├── layout/           # Sidebar, Header
│   │   │   └── ui/               # shadcn components
│   │   ├── db/
│   │   │   └── db.config.ts      # Configuración de Dexie/IndexedDB
│   │   └── utils/
│   └── types/
│       └── index.ts              # Tipos globales
├── public/
│   ├── manifest.json
│   ├── icons/
│   └── sw.js
└── docs/
    ├── PROYECTO_RECETAS_MEDICAS.md
    ├── PLAN_IMPLEMENTACION_RECETAS.md
    ├── REFACTORING_PLAN.md
    ├── MANUAL_USUARIO.md
    └── GUIA_INSTALACION.md
```

## Características Principales

### 1. Configuración Inicial

- Formulario único para configurar datos del médico
- Guardado en IndexedDB
- Editable desde panel de configuración

### 2. Gestión de Pacientes

- CRUD completo de pacientes
- Búsqueda y filtrado
- Historial de recetas por paciente

### 3. Creación de Recetas

- Formulario multi-paso:
  1. Selección/creación de paciente
  2. Diagnóstico
  3. Medicamentos (agregar múltiples)
  4. Instrucciones generales
- Vista previa antes de guardar
- Numeración automática de recetas

### 4. Generación de PDF

- Formato profesional con:
  - Encabezado con datos del médico
  - Número de receta y fecha
  - Datos del paciente
  - Diagnóstico
  - Tabla de medicamentos
  - Instrucciones
  - Espacio para firma
- Impresión directa desde navegador

### 5. PWA Offline-First

- Service Worker para cache de assets
- Funcionamiento completo sin internet
- Sincronización automática cuando hay conexión
- Instalable en dispositivos móviles y desktop

### 6. Dashboard

- Resumen de estadísticas
- Recetas recientes
- Acceso rápido a funciones principales

### 7. Módulo de Finanzas (NUEVO)

- Panel de ganancias de los últimos 7 días
- Configuración de costo de consulta
- Gráfico de barras con ingresos diarios
- Cálculo automático basado en recetas emitidas
- Almacenamiento de configuración financiera en IndexedDB

## Plan de Implementación por Fases

### Fase 1: Setup y Configuración Base ✓

- [ ] Crear proyecto Next.js 15
- [ ] Instalar y configurar shadcn/ui
- [ ] Configurar Tailwind CSS
- [ ] Setup de TypeScript
- [ ] Estructura de carpetas

### Fase 2: Base de Datos Local

- [ ] Configurar Dexie.js
- [ ] Crear schemas de IndexedDB
- [ ] Implementar funciones CRUD
- [ ] Pruebas de persistencia

### Fase 3: Configuración del Médico

- [ ] Formulario de configuración
- [ ] Validación con Zod
- [ ] Guardado en IndexedDB
- [ ] Página de configuración

### Fase 4: Gestión de Pacientes

- [ ] Formulario de pacientes
- [ ] Lista de pacientes
- [ ] Búsqueda y filtrado
- [ ] Edición y eliminación

### Fase 5: Sistema de Recetas

- [ ] Formulario de recetas
- [ ] Gestión de medicamentos dinámicos
- [ ] Guardado de recetas
- [ ] Lista de recetas

### Fase 6: Generación de PDF

- [ ] Template de receta en PDF
- [ ] Integración con react-pdf
- [ ] Función de impresión
- [ ] Vista previa

### Fase 7: Dashboard y UI

- [ ] Layout principal
- [ ] Sidebar de navegación
- [ ] Dashboard con estadísticas
- [ ] Diseño responsive

### Fase 8: PWA

- [ ] Configurar next-pwa
- [ ] Service Worker
- [ ] Manifest.json
- [ ] Pruebas offline

### Fase 9: Pruebas Finales

- [ ] Pruebas de funcionalidad
- [ ] Pruebas offline
- [ ] Pruebas de impresión
- [ ] Optimización de rendimiento

## Formato de Fecha

- DD/MM/YYYY para visualización
- ISO para almacenamiento

## Diseño UI/UX

- Tema: Moderno, limpio, profesional
- Colores: Azul médico (#0066CC) como primario
- Tipografía: Inter para UI, sistema para PDF
- Responsive: Mobile-first
- Accesibilidad: WCAG 2.1 AA

## Próximos Pasos

1. Crear proyecto Next.js
2. Configurar dependencias
3. Implementar fase por fase con pruebas
