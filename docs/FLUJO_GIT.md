# Flujo Híbrido Git para Micro SaaS

Guía completa del flujo de trabajo Git optimizado para desarrollo individual de un micro SaaS con Next.js (Landing Page + App).

---

## Diagrama General del Flujo

```
                    🎯 TU FLUJO HÍBRIDO IDEAL
                    
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  🟢 main (Producción)                                        │
│     • Siempre estable                                        │
│     • Lo que ven los usuarios                                │
│     • Tags: v0.1.0, v0.2.0, v1.0.0                          │
│                                                               │
└──────────────────────┬────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  🔵 dev (Integración)                                    │
│     • Combina landing + app                                  │
│     • Base para testing conjunto                             │
│     • Deploy a staging/preview                               │
│                                                               │
└─────────┬──────────────────────────┬─────────────────────────┘
          │                          │
          ▼                          ▼
┌──────────────────────┐   ┌──────────────────────┐
│                      │   │                      │
│  🟡 dev-landing  │   │  🟣 dev-app      │
│                      │   │                      │
│  • Todo marketing    │   │  • Todo producto     │
│  • Landing page      │   │  • Dashboard         │
│  • Blog/Docs         │   │  • Features core     │
│  • Páginas públicas  │   │  • API/Backend       │
│                      │   │                      │
└─────────┬────────────┘   └─────────┬────────────┘
          │                          │
          ▼                          ▼
    ┌──────────┐              ┌──────────┐
    │landing/* │              │  app/*   │
    └──────────┘              └──────────┘
```

---

## 1️⃣ Setup Inicial (Una sola vez)

### Crear estructura base

```bash
# Inicializar repositorio
git init
git add .
git commit -m "initial commit"
git branch -M main
git push -u origin main

# Crear dev
git checkout -b dev
git push -u origin dev

# Crear dev-landing
git checkout dev
git checkout -b dev-landing
git push -u origin dev-landing

# Crear dev-app
git checkout dev
git checkout -b dev-app
git push -u origin dev-app
```

### Resultado en GitHub

```
Branches:
  ├─ main (producción)
  ├─ dev (integración)
  ├─ dev-landing (marketing)
  └─ dev-app (producto)
```

---

## 2️⃣ Trabajando en Landing Page

### Flujo completo

```
LUNES: Feature de Landing
═══════════════════════════════════════════════════════

git checkout dev-landing
         │
         ▼
git checkout -b landing/hero-redesign
         │
         ▼
    [ Trabajas ]
    • app/(marketing)/page.tsx
    • components/landing/Hero.tsx
    • styles/landing.css
         │
         ▼
git add .
git commit -m "feat(landing): rediseña hero section"
         │
         ▼
git push origin landing/hero-redesign
         │
         ▼
    [ Preview en Vercel ]
    ✓ Verificas que funciona
         │
         ▼
git checkout dev-landing
git merge landing/hero-redesign
         │
         ▼
git push origin dev-landing
         │
         ▼
git push origin --delete landing/hero-redesign
         │
         ▼
    ✅ Feature completada
```

### Comandos

```bash
# 1. Crear branch de feature
git checkout dev-landing
git checkout -b landing/hero-redesign

# 2. Trabajar y commitear
git add .
git commit -m "feat(landing): rediseña hero section"
git push origin landing/hero-redesign

# 3. Mergear cuando esté listo
git checkout dev-landing
git merge landing/hero-redesign
git push origin dev-landing

# 4. Limpiar
git branch -d landing/hero-redesign
git push origin --delete landing/hero-redesign
```

### Visualización

```
dev-landing  •────────────────•
                 │                │
                 │  landing/hero  │
                 │  │             │
                 │  • feat: nuevo diseño
                 │  │             │
                 │  • style: animaciones
                 │  │             │
                 └──┴─────────────┘
```

---

## 3️⃣ Trabajando en App

### Flujo completo

```
MARTES-JUEVES: Feature de App
═══════════════════════════════════════════════════════

git checkout dev-app
         │
         ▼
git checkout -b app/analytics-dashboard
         │
         ▼
    [ Trabajas 3 días ]
    
    Día 1:
    • app/(dashboard)/analytics/page.tsx
    • commit: "feat(app): estructura dashboard"
         │
    Día 2:
    • components/dashboard/Charts.tsx
    • commit: "feat(app): añade gráficos"
         │
    Día 3:
    • lib/analytics.ts
    • commit: "feat(app): integra API"
         │
         ▼
git push origin app/analytics-dashboard
         │
         ▼
    [ Testing + Preview ]
         │
         ▼
git checkout dev-app
git merge app/analytics-dashboard
         │
         ▼
git push origin dev-app
         │
         ▼
git push origin --delete app/analytics-dashboard
         │
         ▼
    ✅ Feature completada
```

### Comandos

```bash
# 1. Crear branch de feature
git checkout dev-app
git checkout -b app/analytics-dashboard

# 2. Trabajar varios días con commits incrementales
git add .
git commit -m "feat(app): estructura dashboard"
git push origin app/analytics-dashboard

git add .
git commit -m "feat(app): añade gráficos"
git push origin app/analytics-dashboard

git add .
git commit -m "feat(app): integra API"
git push origin app/analytics-dashboard

# 3. Mergear cuando esté listo
git checkout dev-app
git merge app/analytics-dashboard
git push origin dev-app

# 4. Limpiar
git branch -d app/analytics-dashboard
git push origin --delete app/analytics-dashboard
```

### Visualización

```
dev-app     •─────────────────────────•
                │                         │
                │  app/analytics          │
                │  │                      │
                │  • feat: estructura     │
                │  │                      │
                │  • feat: gráficos       │
                │  │                      │
                │  • feat: integra API    │
                │  │                      │
                └──┴──────────────────────┘
```

---

## 4️⃣ Integración Semanal

### Flujo completo

```
VIERNES: Integrar todo
═══════════════════════════════════════════════════════

git checkout dev
git pull origin dev
         │
         ├────────────────────┐
         ▼                    ▼
git merge            git merge
dev-landing      dev-app
         │                    │
         └─────────┬──────────┘
                   ▼
            [ Resolver conflictos ]
            (raro, contextos separados)
                   │
                   ▼
            git push origin dev
                   │
                   ▼
            [ Deploy a Staging ]
            Vercel: proyecto-staging.vercel.app
                   │
                   ▼
            [ Testing integral ]
            ✓ Landing funciona
            ✓ App funciona
            ✓ Integración funciona
                   │
                   ▼
            ✅ dev actualizado
```

### Comandos

```bash
# 1. Actualizar dev
git checkout dev
git pull origin dev

# 2. Integrar landing
git merge dev-landing

# 3. Integrar app
git merge dev-app

# 4. Subir integración
git push origin dev

# 5. Verificar en staging (automático con Vercel)
```

### Visualización

```
dev-landing  •────────────┐
                              │
                              ▼
dev         •─────────────•─────────────→
                              ▲
                              │
dev-app     •─────────────┘
```

---

## 5️⃣ Deploy a Producción

### Flujo completo

```
CUANDO ESTÉS LISTO (acumulas varias features)
═══════════════════════════════════════════════════════

git checkout main
git pull origin main
         │
         ▼
git merge dev
         │
         ▼
    [ Testing final ]
    ✓ Todo funciona en staging
         │
         ▼
git tag -a v0.2.0 -m "Release 0.2.0
- Rediseño hero landing
- Dashboard analytics
- Mejoras generales"
         │
         ▼
git push origin main --tags
         │
         ▼
    [ Deploy automático ]
    Vercel: proyecto.com
         │
         ▼
    🚀 EN PRODUCCIÓN
         │
         ▼
    [ Sincronizar de vuelta ]
git checkout dev-landing
git merge main
git push origin dev-landing
         │
git checkout dev-app
git merge main
git push origin dev-app
         │
         ▼
    ✅ Todo sincronizado
```

### Comandos

```bash
# 1. Mergear a main
git checkout main
git pull origin main
git merge dev

# 2. Crear tag de versión
git tag -a v0.2.0 -m "Release 0.2.0
- Rediseño hero landing
- Dashboard analytics
- Mejoras generales"

# 3. Push a producción
git push origin main --tags

# 4. Sincronizar branches (opcional pero recomendado)
git checkout dev-landing
git merge main
git push origin dev-landing

git checkout dev-app
git merge main
git push origin dev-app
```

### Visualización

```
main            •─────────────•  v0.2.0
                │             │
                │             ▲
                │             │
dev         •─────────────┘
```

---

## Ejemplo: Una Semana Completa

### Lunes

```
9:00 AM  │  git checkout dev-landing
         │  git checkout -b landing/pricing-update
         │
10:00 AM │  • Modifico pricing page
         │  git commit -m "feat(landing): nueva tabla precios"
         │
11:30 AM │  • Añado toggle anual/mensual
         │  git commit -m "feat(landing): toggle planes"
         │
1:00 PM  │  git push origin landing/pricing-update
         │
2:00 PM  │  • Reviso preview en Vercel
         │  ✓ Se ve bien
         │
3:00 PM  │  git checkout dev-landing
         │  git merge landing/pricing-update
         │  git push origin dev-landing
         │  git push origin --delete landing/pricing-update
         │
         └─→ ✅ Landing actualizado
```

### Martes - Jueves

```
MAR 9:00 │  git checkout dev-app
         │  git checkout -b app/export-feature
         │
MAR 10:00│  • Añado botón exportar
         │  git commit -m "feat(app): botón exportar"
         │  git push origin app/export-feature
         │
MAR 2:00 │  • Implemento export CSV
         │  git commit -m "feat(app): exporta CSV"
         │  git push origin app/export-feature
         │
MIE 10:00│  • Implemento export PDF
         │  git commit -m "feat(app): exporta PDF"
         │  git push origin app/export-feature
         │
JUE 11:00│  • Añado tests
         │  git commit -m "test(app): tests export"
         │  git push origin app/export-feature
         │
JUE 3:00 │  git checkout dev-app
         │  git merge app/export-feature
         │  git push origin dev-app
         │  git push origin --delete app/export-feature
         │
         └─→ ✅ App actualizada
```

### Viernes

```
10:00 AM │  git checkout dev
         │  git pull origin dev
         │
         │  git merge dev-landing
         │  git merge dev-app
         │  git push origin dev
         │
11:00 AM │  • Testing en staging
         │  ✓ Landing: pricing funciona
         │  ✓ App: export funciona
         │  ✓ No hay conflictos
         │
2:00 PM  │  git checkout main
         │  git merge dev
         │  git tag v0.3.0
         │  git push origin main --tags
         │
3:00 PM  │  🚀 Deploy a producción
         │
         └─→ ✅ Nueva versión en vivo
```

---

## Visualización de un Mes

```
Semana 1:
─────────────────────────────────────────────────────

dev-landing  •──┬──┬──→
                    │  │
                    │  └─ landing/pricing (3 commits)
                    └─ landing/hero (2 commits)

dev-app      •──┬──→
                    └─ app/auth (4 commits)


Semana 2:
─────────────────────────────────────────────────────

dev-landing  •──┬──→
                    └─ landing/testimonials (2 commits)

dev-app      •──┬──┬──→
                    │  └─ app/notifications (5 commits)
                    └─ app/dashboard (3 commits)

dev          •─────→ (merge semanal)


Semana 3:
─────────────────────────────────────────────────────

dev-landing  •──┬──→
                    └─ landing/blog (6 commits)

dev-app      •──┬──→
                    └─ app/export (4 commits)

dev          •─────→ (merge semanal)


Semana 4:
─────────────────────────────────────────────────────

dev-landing  •──→ (solo fixes menores)

dev-app      •──┬──→
                    └─ app/analytics (7 commits)

dev          •─────→ (merge final)

main             •─────→ (deploy v0.4.0)
```

---

## Diagrama de Decisión

```
                    ┌─────────────┐
                    │ Nuevo cambio│
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ ¿Qué parte? │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │ Landing  │     │   App    │     │  Ambos   │
   └────┬─────┘     └────┬─────┘     └────┬─────┘
        │                │                 │
        ▼                ▼                 ▼
git checkout      git checkout      git checkout
dev-landing   dev-app       dev
        │                │                 │
        ▼                ▼                 ▼
git checkout -b   git checkout -b   git checkout -b
landing/nombre    app/nombre        shared/nombre
        │                │                 │
        ▼                ▼                 ▼
   [ Trabajas ]     [ Trabajas ]     [ Trabajas ]
        │                │                 │
        ▼                ▼                 ▼
   [ Commits ]      [ Commits ]      [ Commits ]
        │                │                 │
        ▼                ▼                 ▼
   [ Push ]         [ Push ]         [ Push ]
        │                │                 │
        ▼                ▼                 ▼
   [ Merge a        [ Merge a        [ Merge a
   dev-         dev-         dev ]
   landing ]        app ]                │
        │                │                 │
        └────────────────┴─────────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ ¿Listo para  │
                  │ producción?  │
                  └──────┬───────┘
                         │
                    ┌────┴────┐
                    │         │
                   NO        SÍ
                    │         │
                    ▼         ▼
              [ Continúa  [ Deploy ]
              trabajando]     │
                              ▼
                        git checkout main
                        git merge dev
                        git tag vX.X.X
                              │
                              ▼
                        🚀 PRODUCCIÓN
```

---

## Convenciones de Nomenclatura

### Branches

```bash
# Landing Page (marketing)
landing/hero-section
landing/pricing-page
landing/testimonials-carousel
landing/blog-setup
landing/contact-form
landing/about-page
landing/features-grid

# App (dashboard/producto)
app/auth-system
app/dashboard-layout
app/analytics-reports
app/user-settings
app/payment-integration
app/notifications-system
app/export-functionality

# Compartido (ambos)
shared/button-component
shared/form-validation
shared/design-system
shared/auth-provider
shared/api-client
```

### Commits

```bash
# Landing
feat(landing): añade sección de testimonios
fix(landing): corrige responsive en hero
style(landing): mejora tipografía

# App
feat(app): implementa filtros en dashboard
fix(app): corrige bug en exportación
perf(app): optimiza queries de analytics

# Compartido
feat(shared): añade componente Toast
refactor(shared): mejora sistema de auth

# General
chore: actualiza dependencias
docs: actualiza README
test: añade tests E2E
```

---

## Comandos Esenciales

### Diarios

```bash
# Trabajar en landing
git checkout dev-landing
git checkout -b landing/nueva-feature
# ... trabajas ...
git add .
git commit -m "feat(landing): descripción"
git push origin landing/nueva-feature
git checkout dev-landing
git merge landing/nueva-feature
git push origin dev-landing
git push origin --delete landing/nueva-feature

# Trabajar en app
git checkout dev-app
git checkout -b app/nueva-feature
# ... trabajas ...
git add .
git commit -m "feat(app): descripción"
git push origin app/nueva-feature
git checkout dev-app
git merge app/nueva-feature
git push origin dev-app
git push origin --delete app/nueva-feature
```

### Semanales

```bash
# Integrar todo
git checkout dev
git pull origin dev
git merge dev-landing
git merge dev-app
git push origin dev
```

### Release

```bash
# Deploy a producción
git checkout main
git pull origin main
git merge dev
git tag -a v0.X.0 -m "Release vX.X.X
- Feature 1
- Feature 2
- Mejoras"
git push origin main --tags
```

### Utilidades

```bash
# Ver estado actual
git status
git branch

# Ver historial
git log --oneline --graph --all

# Ver diferencias
git diff dev-landing dev-app

# Limpiar branches locales mergeadas
git branch --merged dev | grep -v "main\|dev\|*" | xargs git branch -d

# Actualizar referencias remotas
git fetch --prune
```

---

## Aliases Útiles

Añade estos a tu `~/.gitconfig`:

```bash
[alias]
    # Visualización
    tree = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --all
    lg = log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr)' --abbrev-commit
    
    # Shortcuts
    co = checkout
    br = branch
    ci = commit
    st = status
    
    # Workflow específico
    landing = checkout dev-landing
    app = checkout dev-app
    dev = checkout dev
    prod = checkout main
    
    # Limpieza
    cleanup = "!git branch --merged dev | grep -v 'main\\|dev\\|*' | xargs -r git branch -d"
```

---

## Estructura de Directorios

```
tu-saas/
├── app/
│   ├── (marketing)/          ← 🟡 landing/*
│   │   ├── page.tsx
│   │   ├── pricing/
│   │   ├── blog/
│   │   └── about/
│   │
│   ├── (dashboard)/          ← 🟣 app/*
│   │   ├── dashboard/
│   │   ├── analytics/
│   │   ├── settings/
│   │   └── layout.tsx
│   │
│   └── api/                  ← 🟠 shared/*
│
├── components/
│   ├── landing/              ← 🟡 landing/*
│   │   ├── Hero.tsx
│   │   ├── Pricing.tsx
│   │   └── Testimonials.tsx
│   │
│   ├── dashboard/            ← 🟣 app/*
│   │   ├── Sidebar.tsx
│   │   ├── Charts.tsx
│   │   └── DataTable.tsx
│   │
│   └── shared/               ← 🟠 shared/*
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Modal.tsx
│
├── lib/
│   ├── landing/              ← 🟡 landing/*
│   ├── app/                  ← 🟣 app/*
│   └── shared/               ← 🟠 shared/*
│
├── styles/
│   ├── landing.css
│   └── dashboard.css
│
└── public/
    ├── landing-assets/
    └── app-assets/
```

---

## Ventajas de Este Flujo

```
┌─────────────────────────────────────────────────────┐
│                                                       │
│  ✅ BENEFICIOS                                        │
│                                                       │
│  1. 🎯 Contexto claro                                │
│     → Sabes si trabajas en landing o app             │
│                                                       │
│  2. 🛡️ Menos conflictos                              │
│     → Rara vez tocas mismos archivos                 │
│                                                       │
│  3. ⚡ Desarrollo rápido                             │
│     → Sin overhead innecesario                       │
│                                                       │
│  4. 🧹 Historial limpio                              │
│     → Fácil ver qué cambió dónde                     │
│                                                       │
│  5. 🚀 Deploy selectivo (opcional)                   │
│     → Puedes deployar solo una parte                 │
│                                                       │
│  6. 📈 Escalable                                     │
│     → Funciona solo y con equipo pequeño             │
│                                                       │
│  7. 🎓 Fácil de aprender                             │
│     → Lógica intuitiva                               │
│                                                       │
│  8. 💾 Backup continuo                               │
│     → Todo respaldado en GitHub                      │
│                                                       │
│  9. 🔄 Trabajo multi-dispositivo                     │
│     → Sincronización automática                      │
│                                                       │
│  10. 📊 Visualización clara                          │
│      → Historia del proyecto organizada              │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### Conflictos al mergear

```bash
# Si hay conflictos al integrar
git checkout dev
git merge dev-landing
# CONFLICT en archivo X

# Resolver manualmente o con editor
# Luego:
git add .
git commit -m "merge: integra dev-landing"

git merge dev-app
# Si hay más conflictos, repetir
```

### Olvidé en qué branch estoy

```bash
# Ver branch actual
git branch --show-current

# Ver todas las branches
git branch -a
```

### Quiero deshacer cambios locales

```bash
# Descartar cambios no commiteados
git restore .

# Volver al último commit
git reset --hard HEAD

# Volver a un commit específico
git log --oneline
git reset --hard <commit-hash>
```

### Commitée en la branch incorrecta

```bash
# Mover último commit a otra branch
git log --oneline -1  # Ver el commit
git reset HEAD~1      # Deshacer commit (mantiene cambios)
git stash            # Guardar cambios
git checkout branch-correcta
git stash pop        # Recuperar cambios
git add .
git commit -m "mensaje"
```

---

## Checklist Pre-Deploy

Antes de hacer `git merge dev` en `main`:

- [ ] ✅ Todas las features mergeadas a `dev`
- [ ] ✅ Testing en ambiente de staging
- [ ] ✅ Landing page funciona correctamente
- [ ] ✅ App funciona correctamente
- [ ] ✅ No hay console errors
- [ ] ✅ Tests pasando (si los tienes)
- [ ] ✅ Performance aceptable
- [ ] ✅ Responsive en móvil
- [ ] ✅ CHANGELOG.md actualizado
- [ ] ✅ Versión incrementada correctamente

---

## Recursos Adicionales

### Herramientas recomendadas

- **GitKraken**: Visualización gráfica del flujo
- **GitHub Desktop**: Cliente simple y visual
- **VS Code Git Graph**: Extensión para VS Code
- **Lazygit**: Cliente terminal interactivo

### Configuración recomendada en GitHub

1. **Branch protection rules** (Settings → Branches):
   - Proteger `main`: Require pull request (opcional)
   - `dev`, `dev-landing`, `dev-app`: Sin restricciones

2. **Default branch**: Cambiar a `dev`

3. **Auto-delete head branches**: Activar para limpiar automáticamente

---

## Versiones y Tags

### Semantic Versioning

```
v MAJOR . MINOR . PATCH

v0.1.0  → Primera versión funcional (pre-lanzamiento)
v0.2.0  → Nueva feature importante
v0.2.1  → Bug fix pequeño
v1.0.0  → Lanzamiento público 🚀
v1.1.0  → Nueva feature post-lanzamiento
v1.1.1  → Bug fix en producción
v2.0.0  → Breaking changes
```

### Crear tags

```bash
# Tag simple
git tag v0.1.0

# Tag anotado (recomendado)
git tag -a v0.1.0 -m "Release 0.1.0: MVP inicial
- Landing page completa
- Sistema de auth
- Dashboard básico"

# Ver tags
git tag

# Ver detalles de un tag
git show v0.1.0

# Push tags
git push origin --tags

# Eliminar tag
git tag -d v0.1.0
git push origin --delete v0.1.0
```

---

## Conclusión

Este flujo híbrido te da:

- ✅ **Simplicidad** de GitFlow sin el overhead
- ✅ **Separación clara** entre contextos
- ✅ **Velocidad** de desarrollo
- ✅ **Escalabilidad** cuando crezcas

**Empieza simple, mantén la consistencia, y ajusta según necesites.** 🚀

---

*Última actualización: Diciembre 2024*
*Versión: 1.0*

### Ver el historial bonito
- `git tree`

### Cambiar rápido entre ramas del proyecto
- `git landing`
- `git app`
- `git dev`

### Shortcuts cotidianos
- `git st`
- `git co feature/nueva-rama`
- `git br -a`


### Script para configurar alias de Git

```bash
- echo "Configurando alias de Git..."

### Visualización
- git config --global alias.tree "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --all"
- git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr)' --abbrev-commit"

### Shortcuts
- git config --global alias.co checkout
- git config --global alias.br branch
- git config --global alias.ci commit
git config --global alias.st status

### Workflow específico
- git config --global alias.landing "checkout dev-landing"
- git config --global alias.app "checkout dev-app"
- git config --global alias.dev "checkout dev"
- git config --global alias.prod "checkout main"

### Limpieza
- git config --global alias.cleanup "!git branch --merged dev | grep -v 'main\\|dev\\|*' | xargs -r git branch -d"

- echo ""
- echo "✅ Alias configurados exitosamente!"
- echo ""
- echo "Alias disponibles:"
- git config --global --get-regexp alias
