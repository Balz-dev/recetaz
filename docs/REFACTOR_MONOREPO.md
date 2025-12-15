# Refactorización Monorepo y Arquitectura (Route Groups)

## Resumen de Cambios

Se ha reestructurado la aplicación `web-recetaz` para seguir un patrón de arquitectura limpia usando **Next.js Route Groups**, separando claramente las responsabilidades de Marketing, Plataforma y Demo.

### Estructura de Carpetas

```
apps/web-recetaz/src/app/
├── (marketing)/           # Landing Page y páginas públicas
│   ├── layout.tsx         # Layout ligero (sin sidebar, SEO optimizado)
│   └── page.tsx           # Homepage (/)
│
├── (platform)/            # Aplicación SaaS (Requiere Auth)
│   ├── layout.tsx         # Layout con Sidebar, Header y Auth Check
│   ├── dashboard/         # Dashboard principal (/dashboard)
│   ├── recetas/           # Módulo de Recetas
│   └── ...otros módulos
│
└── demo/                  # Entorno de Demo
    ├── layout.tsx         # Layout minimalista
    └── page.tsx           # Script de inicialización de datos
```

## Guía de Uso

### 1. Desarrollo (Marketing)
Todo lo relacionado con la página web pública debe ir en `(marketing)`.
- **Ruta**: `/`
- **Componentes**: Usar componentes de UI ligeros, ubicados idealmente en un paquete compartido `packages/ui/marketing` (pendiente de crear).

### 2. Desarrollo (Plataforma)
La lógica de negocio reside en `(platform)`.
- **Ruta Base**: `/dashboard`
- **Layout**: Incluye automáticamente la Sidebar y valida la sesión del médico.
- **Nuevas Páginas**: Al crear una nueva ruta dentro de `(platform)`, automáticamente hereda el shell de la aplicación.

### 3. Demo
La ruta `/demo` está diseñada para inicializar una base de datos local (IndexedDB) con datos de prueba.
- **Flujo**: El usuario entra a `/demo` -> Se cargan fixtures -> Redirección a `/dashboard`.

## Próximos Pasos (Pendientes de Acceso Root)

Para completar la migración a Monorepo real, se requiere acceso al directorio raíz `/mnt/HOME/Proyectos/recetaz` para:
1. Crear la carpeta `packages/` al mismo nivel que `apps/`.
2. Mover `ui`, `database`, y `fixtures` a paquetes compartidos.
3. Configurar `turbo.json` para orquestar las tareas de compilación.
