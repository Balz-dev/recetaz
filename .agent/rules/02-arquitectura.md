# Arquitectura del Código — RecetaZ

## Feature-Sliced Design (Obligatorio)

Cada funcionalidad de negocio se organiza como una feature independiente:

```
src/features/<nombre>/
├── components/      # Componentes UI específicos de la feature
├── services/        # Lógica de negocio y acceso a datos
│   └── <nombre>.service.ts
├── hooks/           # Hooks de aplicación (orquestan services)
│   └── use<Nombre>.ts
└── types/           # Tipos específicos (opcional)
    └── index.ts
```

### Reglas de ubicación

- ✅ Código específico de una feature → `src/features/<nombre>/`
- ✅ Código compartido entre features → `src/shared/`
- ✅ Componentes UI genéricos (shadcn) → `src/shared/components/ui/`
- ✅ Páginas delgadas → `src/app/<ruta>/page.tsx` (solo composición)
- ❌ NUNCA poner lógica de negocio en `src/app/`

## Clean Architecture (Flujo de datos)

```
Componente (UI) → Hook de aplicación → Service → Dexie (IndexedDB)
```

- **Componentes**: solo presentación, llaman hooks
- **Hooks** (`use<Nombre>`): orquestan services, manejan loading/error
- **Services**: CRUD, validaciones, lógica de negocio
- **DB**: Dexie.js, acceso solo desde services

### Prohibiciones

- ❌ NUNCA importar `db` o Dexie directamente desde componentes
- ❌ NUNCA importar services directamente desde componentes (usar hooks)
- ❌ NUNCA colocar `fetch()` o acceso a datos en páginas

## Imports

- SIEMPRE usar alias `@/*` → `./src/*`
- NUNCA usar rutas relativas largas (`../../../`)

## Al crear features nuevas

Ejecutar la skill `nueva-feature` para scaffold completo y validado.
