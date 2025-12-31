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
│  🔵 develop (Integración)                                    │
│     • Combina landing + app                                  │
│     • Base para testing conjunto                             │
│     • Deploy a staging/preview                               │
│                                                               │
└─────────┬──────────────────────────┬─────────────────────────┘
          │                          │
          ▼                          ▼
┌──────────────────────┐   ┌──────────────────────┐
│                      │   │                      │
│  🟡 develop-landing  │   │  🟣 develop-app      │
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

# Crear develop
git checkout -b develop
git push -u origin develop

# Crear develop-landing
git checkout develop
git checkout -b develop-landing
git push -u origin develop-landing

# Crear develop-app
git checkout develop
git checkout -b develop-app
git push -u origin develop-app
```

### Resultado en GitHub

```
Branches:
  ├─ main (producción)
  ├─ develop (integración)
  ├─ develop-landing (marketing)
  └─ develop-app (producto)
```

---

## 2️⃣ Trabajando en Landing Page

### Flujo completo

```
LUNES: Feature de Landing
═══════════════════════════════════════════════════════

git checkout develop-landing
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
git checkout develop-landing
git merge landing/hero-redesign
         │
         ▼
git push origin develop-landing
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
git checkout develop-landing
git checkout -b landing/hero-redesign

# 2. Trabajar y commitear
git add .
git commit -m "feat(landing): rediseña hero section"
git push origin landing/hero-redesign

# 3. Mergear cuando esté listo
git checkout develop-landing
git merge landing/hero-redesign
git push origin develop-landing

# 4. Limpiar
git branch -d landing/hero-redesign
git push origin --delete landing/hero-redesign
```

### Visualización

```
develop-landing  •────────────────•
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

git checkout develop-app
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
git checkout develop-app
git merge app/analytics-dashboard
         │
         ▼
git push origin develop-app
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
git checkout develop-app
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
git checkout develop-app
git merge app/analytics-dashboard
git push origin develop-app

# 4. Limpiar
git branch -d app/analytics-dashboard
git push origin --delete app/analytics-dashboard
```

### Visualización

```
develop-app     •─────────────────────────•
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

git checkout develop
git pull origin develop
         │
         ├────────────────────┐
         ▼                    ▼
git merge            git merge
develop-landing      develop-app
         │                    │
         └─────────┬──────────┘
                   ▼
            [ Resolver conflictos ]
            (raro, contextos separados)
                   │
                   ▼
            git push origin develop
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
            ✅ develop actualizado
```

### Comandos

```bash
# 1. Actualizar develop
git checkout develop
git pull origin develop

# 2. Integrar landing
git merge develop-landing

# 3. Integrar app
git merge develop-app

# 4. Subir integración
git push origin develop

# 5. Verificar en staging (automático con Vercel)
```

### Visualización

```
develop-landing  •────────────┐
                              │
                              ▼
develop         •─────────────•─────────────→
                              ▲
                              │
develop-app     •─────────────┘
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
git merge develop
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
git checkout develop-landing
git merge main
git push origin develop-landing
         │
git checkout develop-app
git merge main
git push origin develop-app
         │
         ▼
    ✅ Todo sincronizado
```

### Comandos

```bash
# 1. Mergear a main
git checkout main
git pull origin main
git merge develop

# 2. Crear tag de versión
git tag -a v0.2.0 -m "Release 0.2.0
- Rediseño hero landing
- Dashboard analytics
- Mejoras generales"

# 3. Push a producción
git push origin main --tags

# 4. Sincronizar branches (opcional pero recomendado)
git checkout develop-landing
git merge main
git push origin develop-landing

git checkout develop-app
git merge main
git push origin develop-app
```

### Visualización

```
main            •─────────────•  v0.2.0
                │             │
                │             ▲
                │             │
develop         •─────────────┘
```

---

## Ejemplo: Una Semana Completa

### Lunes

```
9:00 AM  │  git checkout develop-landing
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
3:00 PM  │  git checkout develop-landing
         │  git merge landing/pricing-update
         │  git push origin develop-landing
         │  git push origin --delete landing/pricing-update
         │
         └─→ ✅ Landing actualizado
```

### Martes - Jueves

```
MAR 9:00 │  git checkout develop-app
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
JUE 3:00 │  git checkout develop-app
         │  git merge app/export-feature
         │  git push origin develop-app
         │  git push origin --delete app/export-feature
         │
         └─→ ✅ App actualizada
```

### Viernes

```
10:00 AM │  git checkout develop
         │  git pull origin develop
         │
         │  git merge develop-landing
         │  git merge develop-app
         │  git push origin develop
         │
11:00 AM │  • Testing en staging
         │  ✓ Landing: pricing funciona
         │  ✓ App: export funciona
         │  ✓ No hay conflictos
         │
2:00 PM  │  git checkout main
         │  git merge develop
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

develop-landing  •──┬──┬──→
                    │  │
                    │  └─ landing/pricing (3 commits)
                    └─ landing/hero (2 commits)

develop-app      •──┬──→
                    └─ app/auth (4 commits)


Semana 2:
─────────────────────────────────────────────────────

develop-landing  •──┬──→
                    └─ landing/testimonials (2 commits)

develop-app      •──┬──┬──→
                    │  └─ app/notifications (5 commits)
                    └─ app/dashboard (3 commits)

develop          •─────→ (merge semanal)


Semana 3:
─────────────────────────────────────────────────────

develop-landing  •──┬──→
                    └─ landing/blog (6 commits)

develop-app      •──┬──→
                    └─ app/export (4 commits)

develop          •─────→ (merge semanal)


Semana 4:
─────────────────────────────────────────────────────

develop-landing  •──→ (solo fixes menores)

develop-app      •──┬──→
                    └─ app/analytics (7 commits)

develop          •─────→ (merge final)

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
develop-landing   develop-app       develop
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
   develop-         develop-         develop ]
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
                        git merge develop
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
git checkout develop-landing
git checkout -b landing/nueva-feature
# ... trabajas ...
git add .
git commit -m "feat(landing): descripción"
git push origin landing/nueva-feature
git checkout develop-landing
git merge landing/nueva-feature
git push origin develop-landing
git push origin --delete landing/nueva-feature

# Trabajar en app
git checkout develop-app
git checkout -b app/nueva-feature
# ... trabajas ...
git add .
git commit -m "feat(app): descripción"
git push origin app/nueva-feature
git checkout develop-app
git merge app/nueva-feature
git push origin develop-app
git push origin --delete app/nueva-feature
```

### Semanales

```bash
# Integrar todo
git checkout develop
git pull origin develop
git merge develop-landing
git merge develop-app
git push origin develop
```

### Release

```bash
# Deploy a producción
git checkout main
git pull origin main
git merge develop
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
git diff develop-landing develop-app

# Limpiar branches locales mergeadas
git branch --merged develop | grep -v "main\|develop\|*" | xargs git branch -d

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
    landing = checkout develop-landing
    app = checkout develop-app
    dev = checkout develop
    prod = checkout main
    
    # Limpieza
    cleanup = "!git branch --merged develop | grep -v 'main\\|develop\\|*' | xargs -r git branch -d"
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
git checkout develop
git merge develop-landing
# CONFLICT en archivo X

# Resolver manualmente o con editor
# Luego:
git add .
git commit -m "merge: integra develop-landing"

git merge develop-app
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

Antes de hacer `git merge develop` en `main`:

- [ ] ✅ Todas las features mergeadas a `develop`
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
   - `develop`, `develop-landing`, `develop-app`: Sin restricciones

2. **Default branch**: Cambiar a `develop`

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