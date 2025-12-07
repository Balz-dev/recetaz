# Arquitectura del Sistema RecetaZ

## Visión General

RecetaZ está construido siguiendo una **arquitectura modular basada en características** (Feature-Sliced Design), que organiza el código por funcionalidad de negocio en lugar de por tipo técnico. Esta decisión arquitectónica mejora la escalabilidad, mantenibilidad y facilita el trabajo en equipo.

## Principios Arquitectónicos

### 1. Separación por Características (Feature-Based)

En lugar de agrupar todo el código por tipo técnico (components, services, hooks), lo agrupamos por característica de negocio:

- ✅ **Correcto**: `features/pacientes/components/PacienteForm.tsx`
- ❌ **Evitar**: `components/forms/PacienteForm.tsx`

**Ventajas**:

- Todo el código relacionado con una característica está junto
- Fácil de encontrar y modificar
- Reduce el acoplamiento entre módulos
- Facilita la eliminación o adición de características completas

### 2. Colocación de Código (Colocation)

El código que cambia junto debe vivir junto. Si un componente solo se usa en una característica, debe vivir dentro de esa característica, no en una carpeta compartida.

### 3. Documentación Explícita

Cada archivo incluye documentación JSDoc en español que explica:

- **Qué hace** el archivo
- **Por qué existe** (propósito de negocio)
- **Cómo se usa** (ejemplos cuando es relevante)

## Estructura de Directorios

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Layout raíz con providers
│   ├── page.tsx                  # Dashboard principal
│   ├── configuracion/            # Ruta de configuración
│   ├── pacientes/                # Rutas de pacientes
│   └── recetas/                  # Rutas de recetas
│
├── features/                     # Características de negocio
│   ├── config-medico/            # Configuración del médico
│   │   ├── components/           # Componentes específicos
│   │   ├── services/             # Lógica de negocio
│   │   └── types/                # Tipos específicos (opcional)
│   │
│   ├── pacientes/                # Gestión de pacientes
│   │   ├── components/
│   │   ├── services/
│   │   └── hooks/                # Hooks específicos
│   │
│   ├── recetas/                  # Gestión de recetas
│   │   ├── components/
│   │   └── services/
│   │
│   └── finanzas/                 # Módulo de finanzas
│       ├── components/
│       └── services/
│
├── shared/                       # Código compartido
│   ├── components/
│   │   ├── layout/               # Layout global (Sidebar, Header)
│   │   └── ui/                   # Componentes UI genéricos (shadcn)
│   ├── db/
│   │   └── db.config.ts          # Configuración de IndexedDB
│   └── utils/                    # Utilidades generales
│
└── types/                        # Tipos globales compartidos
    └── index.ts
```

## Capas de la Aplicación

### 1. Capa de Presentación (App Router)

**Ubicación**: `src/app/`

**Responsabilidad**:

- Definir rutas y páginas
- Manejar navegación
- Layouts y metadata
- Server Components (cuando sea necesario)

**Regla**: Las páginas deben ser delgadas. La lógica de negocio vive en `features/`.

```tsx
// src/app/page.tsx
export default function HomePage() {
  // Mínima lógica, principalmente composición de componentes
  return <Dashboard />;
}
```

### 2. Capa de Características (Features)

**Ubicación**: `src/features/`

**Responsabilidad**:

- Lógica de negocio específica de la característica
- Componentes que solo se usan en esa característica
- Servicios de acceso a datos
- Hooks personalizados
- Tipos específicos

**Estructura de una Feature**:

```
features/pacientes/
├── components/           # Componentes UI de pacientes
│   ├── PacienteForm.tsx
│   ├── PacienteList.tsx
│   └── PatientRegistrationModal.tsx
├── services/            # Lógica de negocio
│   └── paciente.service.ts
├── hooks/               # Hooks personalizados (opcional)
│   └── usePacientes.ts
└── types/               # Tipos específicos (opcional)
    └── index.ts
```

### 3. Capa Compartida (Shared)

**Ubicación**: `src/shared/`

**Responsabilidad**:

- Componentes UI genéricos reutilizables
- Utilidades generales
- Configuración de infraestructura (DB, APIs)
- Layout global de la aplicación

**Regla**: Solo debe contener código verdaderamente compartido entre múltiples features.

### 4. Capa de Datos (Database)

**Ubicación**: `src/shared/db/`

**Responsabilidad**:

- Configuración de IndexedDB con Dexie
- Definición de esquemas
- Migraciones de versiones

**Patrón**: Los servicios en `features/*/services/` importan `db` y ejecutan operaciones.

```typescript
// features/pacientes/services/paciente.service.ts
import { db } from "@/shared/db/db.config";

export const pacienteService = {
  async getAll() {
    return await db.pacientes.toArray();
  },
};
```

## Flujo de Datos

```
Usuario → Página (app/) → Componente (features/*/components/)
                              ↓
                         Servicio (features/*/services/)
                              ↓
                         Base de Datos (shared/db/)
```

### Ejemplo: Crear un Paciente

1. **Usuario** completa el formulario en `PacienteForm.tsx`
2. **Componente** llama a `pacienteService.create(data)`
3. **Servicio** valida y guarda en `db.pacientes.add()`
4. **Base de Datos** persiste en IndexedDB
5. **Componente** actualiza la UI con el nuevo paciente

## Patrones de Diseño Utilizados

### 1. Service Layer Pattern

Cada feature tiene un servicio que encapsula toda la lógica de acceso a datos:

```typescript
export const pacienteService = {
  async getAll(): Promise<Paciente[]> {},
  async getById(id: string): Promise<Paciente | undefined> {},
  async create(data: PacienteFormData): Promise<string> {},
  async update(id: string, data: Partial<PacienteFormData>): Promise<number> {},
  async delete(id: string): Promise<void> {},
};
```

**Ventajas**:

- Centraliza la lógica de negocio
- Facilita testing
- Permite cambiar la implementación sin afectar componentes

### 2. Repository Pattern (Implícito)

Dexie actúa como nuestro repository, proporcionando una API consistente para acceso a datos.

### 3. Singleton Pattern

La base de datos es una instancia única compartida:

```typescript
export const db = new RecetasDatabase();
```

### 4. Composition over Inheritance

Los componentes se componen de componentes más pequeños en lugar de usar herencia.

## Convenciones de Código

### Nomenclatura

- **Archivos de Componentes**: PascalCase (ej: `PacienteForm.tsx`)
- **Archivos de Servicios**: camelCase.service.ts (ej: `paciente.service.ts`)
- **Carpetas**: kebab-case (ej: `config-medico/`)
- **Tipos**: PascalCase (ej: `Paciente`, `RecetaFormData`)

### Imports

Usar alias de path para imports limpios:

```typescript
// ✅ Correcto
import { db } from "@/shared/db/db.config";
import { Button } from "@/shared/components/ui/button";

// ❌ Evitar
import { db } from "../../../shared/db/db.config";
```

### Documentación

Cada archivo debe tener un comentario JSDoc al inicio:

```typescript
/**
 * @fileoverview Servicio de Gestión de Pacientes
 *
 * Este servicio gestiona toda la lógica de negocio relacionada con los pacientes.
 * Incluye operaciones CRUD completas y búsqueda por nombre.
 */
```

## Tecnologías y Librerías

### Core

- **Next.js 15**: Framework React con App Router
- **React 18**: Librería UI
- **TypeScript**: Tipado estático

### UI

- **shadcn/ui**: Componentes UI basados en Radix UI
- **Tailwind CSS**: Estilos utilitarios
- **Lucide React**: Iconos

### Base de Datos

- **Dexie.js**: Wrapper sobre IndexedDB
- **IndexedDB**: Base de datos del navegador

### Utilidades

- **date-fns**: Manipulación de fechas
- **uuid**: Generación de IDs únicos
- **recharts**: Gráficos (para módulo de finanzas)

### PWA

- **next-pwa**: Service Worker y manifest

## Decisiones Arquitectónicas

### ¿Por qué IndexedDB en lugar de una API backend?

**Decisión**: Usar IndexedDB como almacenamiento principal.

**Razones**:

1. **Offline-First**: El sistema funciona sin conexión a internet
2. **Privacidad**: Los datos nunca salen del dispositivo del médico
3. **Simplicidad**: No requiere servidor ni mantenimiento de infraestructura
4. **Rendimiento**: Acceso instantáneo a datos locales

**Trade-offs**:

- ❌ No hay sincronización entre dispositivos (por ahora)
- ❌ Los datos se pierden si se borra el almacenamiento del navegador
- ✅ Privacidad total
- ✅ Cero costos de servidor

### ¿Por qué Feature-Sliced Design?

**Decisión**: Organizar código por características de negocio.

**Razones**:

1. **Escalabilidad**: Fácil agregar nuevas características sin afectar las existentes
2. **Mantenibilidad**: Todo el código relacionado está junto
3. **Trabajo en equipo**: Diferentes desarrolladores pueden trabajar en diferentes features
4. **Claridad**: La estructura refleja el dominio del negocio

### ¿Por qué Next.js App Router?

**Decisión**: Usar App Router en lugar de Pages Router.

**Razones**:

1. **Futuro de Next.js**: App Router es el camino recomendado
2. **Server Components**: Aunque no los usamos mucho, están disponibles
3. **Layouts**: Sistema de layouts más flexible
4. **Mejor DX**: Mejor experiencia de desarrollo

## Roadmap Arquitectónico

### Corto Plazo (Completado)

- ✅ Migración a arquitectura modular
- ✅ Documentación JSDoc en español
- ✅ Módulo de finanzas básico

### Mediano Plazo (Planeado)

- [ ] Módulo de autenticación (`features/auth/`)
- [ ] Módulo de licenciamiento (`features/licensing/`)
- [ ] Sistema de backup/export de datos
- [ ] Módulo contable completo (gastos, otros ingresos)

### Largo Plazo (Futuro)

- [ ] Sincronización opcional en la nube
- [ ] Multi-consultorio
- [ ] Reportes avanzados
- [ ] Integración con sistemas de facturación

## Guía para Agregar Nuevas Características

### Paso 1: Crear la estructura de la feature

```bash
mkdir -p src/features/nueva-feature/{components,services}
```

### Paso 2: Crear el servicio

```typescript
// src/features/nueva-feature/services/nueva-feature.service.ts
import { db } from "@/shared/db/db.config";

export const nuevaFeatureService = {
  // Métodos del servicio
};
```

### Paso 3: Crear componentes

```tsx
// src/features/nueva-feature/components/NuevaFeatureForm.tsx
export function NuevaFeatureForm() {
  // Implementación
}
```

### Paso 4: Agregar rutas si es necesario

```tsx
// src/app/nueva-feature/page.tsx
import { NuevaFeatureForm } from "@/features/nueva-feature/components/NuevaFeatureForm";

export default function NuevaFeaturePage() {
  return <NuevaFeatureForm />;
}
```

### Paso 5: Actualizar base de datos si es necesario

```typescript
// src/shared/db/db.config.ts
this.version(4).stores({
  // ... tablas existentes
  nuevaFeature: "id, campo1, campo2",
});
```

## Conclusión

Esta arquitectura está diseñada para:

- **Crecer** con el proyecto sin volverse inmanejable
- **Facilitar** el mantenimiento y debugging
- **Documentar** el propósito de cada pieza de código
- **Permitir** que nuevos desarrolladores entiendan rápidamente el sistema

La clave está en mantener la disciplina de colocar el código en el lugar correcto y documentar las decisiones importantes.
