# Plan de Refactorización: Arquitectura Modular Basada en Características

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
