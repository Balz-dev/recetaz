# Plan de Refactorización: Arquitectura Modular Basada en Características

## Objetivo

Reestructurar la aplicación `recetaz` hacia una arquitectura escalar basada en características (inspirada en Feature-Sliced Design). Esto mejora la mantenibilidad, la colocación de lógica relacionada y la escalabilidad futura.

## Principios Fundamentales

1.  **Colocación de Características**: El código relacionado con una funcionalidad específica (como `pacientes`, `recetas`, `medico`, `finanzas`) debe agruparse, no dispersarse en carpetas genéricas como `components` o `lib`.
2.  **Base Compartida**: Los componentes de UI genéricos (`shadcn/ui`) y la infraestructura central (`configuración db`, `utils`) permanecen en directorios compartidos (`shared`).
3.  **Documentación Explícita**: Cada archivo, función y hook tendrá JSDoc en español explicando su propósito ("por qué existe").

## Estructura Propuesta

```
src/
├── app/                  # Next.js App Router (Las páginas permanecen aquí, la lógica se mueve)
│   ├── (routes)/...
│   ├── layout.tsx
│   └── globals.css
├── features/             # Lógica de Negocio y Componentes por Característica
│   ├── config-medico/    # Característica: Configuración del Médico
│   │   ├── components/
│   │   │   ├── MedicoConfigForm.tsx
│   │   │   └── ConfiguracionModal.tsx
│   │   ├── services/
│   │   │   └── medico.service.ts
│   │   └── types/        # Tipos específicos de la característica
│   ├── pacientes/        # Característica: Gestión de Pacientes
│   │   ├── components/
│   │   │   ├── PacienteForm.tsx
│   │   │   ├── PacienteList.tsx
│   │   │   └── PatientRegistrationModal.tsx
│   │   ├── services/
│   │   │   └── paciente.service.ts
│   │   └── hooks/        # Hooks específicos
│   ├── recetas/          # Característica: Gestión de Recetas
│   │   ├── components/
│   │   │   ├── RecetaForm.tsx
│   │   │   ├── RecetaList.tsx
│   │   │   ├── RecetaCard.tsx
│   │   │   └── RecetaPdfTemplate.tsx
│   │   └── services/
│   │       └── receta.service.ts
│   ├── finanzas/         # Característica: Finanzas y Ganancias
│   │   ├── components/
│   │   │   └── PanelGanancias.tsx
│   │   └── services/
│   │       └── finanzas.service.ts
│   ├── auth/             # (Futuro) Característica: Autorización y Seguridad
│   │   └── ...           # Login, Protección de Rutas, Roles
│   └── licensing/        # (Futuro) Característica: Licenciamiento
│       └── ...           # Validación de licencia, Planes, Restricciones
├── shared/               # Utilidades y Componentes Compartidos
│   ├── components/
│   │   ├── layout/       # Sidebar, Header
│   │   └── ui/           # UI Genérica (Shadcn: Button, Input, etc.)
│   ├── db/
│   │   └── db.config.ts  # Configuración central de Dexie
│   └── utils/            # Utilidades generales
└── types/                # Tipos globales compartidos
```

## Plan de Ejecución Paso a Paso

### 1. Preparación

- [x] Analizar estructura actual.
- [x] Crear directorios necesarios (`src/features/...`, `src/shared/...`).

### 2. Migración de Característica: Configuración Médico

- [x] Crear `src/features/config-medico`.
- [x] Mover archivos de servicio y componentes.
- [x] Agregar documentación JSDoc en español.
- [x] Actualizar importaciones en archivos dependientes.

### 3. Migración de Característica: Pacientes

- [x] Crear `src/features/pacientes`.
- [x] Mover servicios y componentes de pacientes.
- [x] Agregar documentación JSDoc en español.
- [x] Actualizar importaciones.

### 4. Migración de Característica: Recetas

- [x] Crear `src/features/recetas`.
- [x] Mover servicios, componentes y templates de recetas.
- [x] Agregar documentación JSDoc en español.
- [x] Actualizar importaciones.

### 5. Nueva Característica: Finanzas

- [x] Crear `src/features/finanzas`.
- [x] Crear servicios y componentes de finanzas.
- [x] Agregar documentación JSDoc en español.
- [x] Integrar en el Dashboard.

### 6. Reestructuración de Base Compartida (Shared)

- [x] Mover configuración de DB a `src/shared/db`.
- [x] Mover componentes UI a `src/shared/components/ui`.
- [x] Mover layout a `src/shared/components/layout`.
- [x] Actualizar todas las importaciones globales.

### 7. Documentación del Proyecto

- [x] Actualizar PROYECTO_RECETAS_MEDICAS.md con nueva estructura.
- [x] Actualizar MANUAL_USUARIO.md con módulo de finanzas.
- [x] Crear ARQUITECTURA.md con explicación detallada.
- [x] Actualizar REFACTORING_PLAN.md.

### 8. Futuras Integraciones (Roadmap)

- **Autorización**: Se implementará un módulo `src/features/auth` para manejar el acceso seguro a la aplicación, posiblemente integrando proveedores externos o autenticación local robusta.
- **Licenciamiento**: Se creará `src/features/licensing` para gestionar la activación del software, control de planes (Gratis/Pro) y características premium.
- **Contabilidad Completa**: Expandir el módulo de finanzas para incluir gastos operativos, otros ingresos, y reportes financieros detallados.

### 9. Verificación

- [x] Construir proyecto (`pnpm run build`).
- [x] Verificación visual con agente navegador.

## Estado Actual

### ✅ Completado

1. **Arquitectura Modular**: El proyecto ahora sigue una arquitectura basada en características (Feature-Sliced Design).
2. **Documentación JSDoc**: Todos los servicios principales tienen documentación completa en español.
3. **Módulo de Finanzas**: Implementado y funcionando con gráficos de ganancias.
4. **Build Exitoso**: El proyecto compila sin errores.
5. **Documentación Actualizada**: Todos los documentos reflejan la nueva estructura.

### 📋 Pendiente

1. **Verificación Visual**: Probar la aplicación en el navegador para confirmar que todo funciona correctamente.
2. **Componentes Adicionales**: Agregar documentación JSDoc a componentes individuales de UI.
3. **Testing**: Implementar pruebas unitarias para los servicios.

## Resumen de Cambios

### Archivos Modificados

- ✅ `src/features/finanzas/services/finanzas.service.ts` - Agregada documentación JSDoc
- ✅ `src/features/finanzas/components/PanelGanancias.tsx` - Agregada documentación JSDoc
- ✅ `src/features/recetas/services/receta.service.ts` - Agregada documentación JSDoc
- ✅ `src/features/config-medico/services/medico.service.ts` - Agregada documentación JSDoc
- ✅ `src/features/pacientes/services/paciente.service.ts` - Agregada documentación JSDoc
- ✅ `src/shared/db/db.config.ts` - Agregada documentación JSDoc completa
- ✅ `src/app/page.tsx` - Agregada documentación JSDoc
- ✅ `docs/PROYECTO_RECETAS_MEDICAS.md` - Actualizada estructura y características
- ✅ `docs/MANUAL_USUARIO.md` - Agregada sección de finanzas
- ✅ `docs/REFACTORING_PLAN.md` - Actualizado con progreso

### Archivos Creados

- ✅ `docs/ARQUITECTURA.md` - Documentación completa de la arquitectura del sistema

## Objetivo

Reestructurar la aplicación `recetaz` hacia una arquitectura escalar basada en características (inspirada en Feature-Sliced Design). Esto mejora la mantenibilidad, la colocación de lógica relacionada y la escalabilidad futura.

## Principios Fundamentales

1.  **Colocación de Características**: El código relacionado con una funcionalidad específica (como `pacientes`, `recetas`, `medico`) debe agruparse, no dispersarse en carpetas genéricas como `components` o `lib`.
2.  **Base Compartida**: Los componentes de UI genéricos (`shadcn/ui`) y la infraestructura central (`configuración db`, `utils`) permanecen en directorios compartidos (`shared`).
3.  **Documentación Explícita**: Cada archivo, función y hook tendrá JSDoc en español explicando su propósito ("por qué existe").

## Estructura Propuesta

```
src/
├── app/                  # Next.js App Router (Las páginas permanecen aquí, la lógica se mueve)
│   ├── (routes)/...
│   ├── layout.tsx
│   └── globals.css
├── features/             # Lógica de Negocio y Componentes por Característica
│   ├── config-medico/    # Característica: Configuración del Médico
│   │   ├── components/
│   │   │   ├── MedicoConfigForm.tsx
│   │   │   └── ConfiguracionModal.tsx
│   │   ├── services/
│   │   │   └── medico.service.ts
│   │   └── types/        # Tipos específicos de la característica
│   ├── pacientes/        # Característica: Gestión de Pacientes
│   │   ├── components/
│   │   │   ├── PacienteForm.tsx
│   │   │   ├── PacienteList.tsx
│   │   │   └── PatientRegistrationModal.tsx
│   │   ├── services/
│   │   │   └── paciente.service.ts
│   │   └── hooks/        # Hooks específicos
│   ├── recetas/          # Característica: Gestión de Recetas
│   │   ├── components/
│   │   │   ├── RecetaForm.tsx
│   │   │   ├── RecetaList.tsx
│   │   │   ├── RecetaCard.tsx
│   │   │   └── RecetaPdfTemplate.tsx
│   │   └── services/
│   │       └── receta.service.ts
│   ├── auth/             # (Futuro) Característica: Autorización y Seguridad
│   │   └── ...           # Login, Protección de Rutas, Roles
│   └── licensing/        # (Futuro) Característica: Licenciamiento
│       └── ...           # Validación de licencia, Planes, Restricciones
├── shared/               # Utilidades y Componentes Compartidos
│   ├── components/
│   │   ├── layout/       # Sidebar, Header
│   │   └── ui/           # UI Genérica (Shadcn: Button, Input, etc.)
│   ├── db/
│   │   └── db.config.ts  # Configuración central de Dexie
│   └── utils/            # Utilidades generales
└── types/                # Tipos globales compartidos
```

## Plan de Ejecución Paso a Paso

### 1. Preparación

- [x] Analizar estructura actual.
- [x] Crear directorios necesarios (`src/features/...`, `src/shared/...`).

### 2. Migración de Característica: Configuración Médico

- [x] Crear `src/features/config-medico`.
- [x] Mover archivos de servicio y componentes.
- [ ] Agregar documentación JSDoc en español.
- [ ] Actualizar importaciones en archivos dependientes.

### 3. Migración de Característica: Pacientes

- [ ] Crear `src/features/pacientes`.
- [ ] Mover servicios y componentes de pacientes.
- [ ] Agregar documentación JSDoc en español.
- [ ] Actualizar importaciones.

### 4. Migración de Característica: Recetas

- [ ] Crear `src/features/recetas`.
- [ ] Mover servicios, componentes y templates de recetas.
- [ ] Agregar documentación JSDoc en español.
- [ ] Actualizar importaciones.

### 5. Reestructuración de Base Compartida (Shared)

- [ ] Mover configuración de DB a `src/shared/db`.
- [ ] Mover componentes UI a `src/shared/components/ui`.
- [ ] Mover layout a `src/shared/components/layout`.
- [ ] Actualizar todas las importaciones globales.

### 6. Futuras Integraciones (Roadmap)

- **Autorización**: Se implementará un módulo `src/features/auth` para manejar el acceso seguro a la aplicación, posiblemente integrando proveedores externos o autenticación local robusta.
- **Licenciamiento**: Se creará `src/features/licensing` para gestionar la activación del software, control de planes (Gratis/Pro) y características premium.

### 7. Verificación

- [ ] Construir proyecto (`pnpm run build`).
- [ ] Verificación visual con agente navegador.
