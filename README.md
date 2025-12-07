# Receta-Z 💊

Sistema de Gestión de Recetas Médicas - PWA Offline-First

## 📋 Descripción

Aplicación web progresiva (PWA) offline-first para la creación y gestión de recetas médicas, desarrollada con Next.js, shadcn/ui, e IndexedDB para almacenamiento local.

## ✨ Características Principales

- 🏥 **Gestión Completa de Pacientes** - CRUD completo con búsqueda y filtrado
- 📝 **Creación de Recetas** - Formulario intuitivo con múltiples medicamentos
- 📄 **Generación de PDF** - Recetas profesionales listas para imprimir
- 💰 **Módulo de Finanzas** - Seguimiento de ingresos y ganancias
- 📱 **PWA Offline** - Funciona completamente sin internet
- 🎨 **UI Moderna** - Interfaz limpia y profesional con shadcn/ui
- 🌙 **Modo Oscuro** - Soporte para tema claro y oscuro

## 🚀 Inicio Rápido

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Balz-dev/recetaz.git
cd recetaz/recetaz

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Poblar con Datos de Ejemplo

Para probar la aplicación con datos de ejemplo:

1. Navega a `http://localhost:3000/dev-utils`
2. Haz clic en "🌱 Poblar Base de Datos"
3. Confirma la acción

Esto generará:

- 1 configuración de médico
- 8 pacientes con datos variados
- 12 recetas médicas
- Movimientos financieros de ejemplo

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Base de Datos**: IndexedDB (Dexie.js)
- **PWA**: next-pwa
- **PDF**: @react-pdf/renderer
- **Validación**: Zod + React Hook Form
- **Idioma**: Español

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Dashboard
│   ├── configuracion/     # Configuración del médico
│   ├── pacientes/         # Gestión de pacientes
│   ├── recetas/           # Gestión de recetas
│   └── dev-utils/         # Herramientas de desarrollo
├── features/              # Lógica de negocio por característica
│   ├── config-medico/
│   ├── pacientes/
│   ├── recetas/
│   └── finanzas/
├── shared/                # Componentes y utilidades compartidas
│   ├── components/
│   ├── db/
│   └── utils/
└── types/                 # Tipos globales
```

## 📚 Documentación

- [Proyecto Completo](docs/PROYECTO_RECETAS_MEDICAS.md) - Descripción técnica detallada
- [Manual de Usuario](docs/MANUAL_USUARIO.md) - Guía de uso
- [Arquitectura](docs/ARQUITECTURA.md) - Diseño del sistema
- [Seeding de Datos](docs/SEED_DATABASE.md) - Cómo poblar datos de ejemplo

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm run dev          # Iniciar servidor de desarrollo

# Producción
pnpm run build        # Construir para producción
pnpm run start        # Iniciar servidor de producción

# Utilidades
pnpm run datos        # Poblar base de datos (Node.js)
pnpm run test         # Ejecutar pruebas
pnpm run test:e2e     # Pruebas end-to-end
```

## 🗑️ Antes de Producción

Eliminar herramientas de desarrollo:

```bash
rm -rf src/app/dev-utils
```

## 📄 Licencia

Este proyecto es privado y está en desarrollo.

## 👨‍💻 Autor

Desarrollado por Balz-dev
