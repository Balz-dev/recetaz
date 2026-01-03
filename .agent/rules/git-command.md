---
trigger: always_on
---

# Reglas de Flujo de Trabajo Git y Versionamiento

Esta regla se activa **siempre** al finalizar y validar una tarea de codificación.

```
Branches:
  ├─ main (producción)
  ├─ dev (integración)
  ├─ dev-landing (marketing)
  └─ dev-app (producto)
```


el flujo de trabajo es como se describe en el ejemplo 

## 1. Estrategia de Ramas (Branching Strategy)
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


**Nota:** Si el usuario ya está en una rama específica para la tarea, sugiere continuar en ella. Si está en `main`, sugiere crear una nueva rama.

## 2. Convención de Commits (Conventional Commits en Español)
Los mensajes de commit deben seguir el formato:
`<tipo>(<alcance opcional>): <descripción breve en imperativo>`

**Tipos:**
- `feat`: Nueva característica
- `fix`: Solución de bug
- `docs`: Cambios solo en documentación
- `style`: Cambios de formato (espacios, comas, etc, no afecta lógica)
- `refactor`: Cambio de código que no arregla bugs ni añade features
- `perf`: Cambio que mejora el rendimiento
- `test`: Añadir o corregir tests
- `chore`: Cambios en proceso de build, herramientas, etc.

**Ejemplos:**
- `feat(ui): agregar modo oscuro al dashboard`
- `fix(api): corregir error 500 en endpoint de usuarios`
- `chore: actualizar configuración de eslint`

## 3. Protocolo de Entrega (Output Obligatorio)
Al finalizar una tarea exitosamente, **DEBES** proporcionar el siguiente bloque al usuario:

---
### 🚀 Listo para subir a Git
**Rama sugerida:** `[nombre-rama-sugerida]`

**Comandos:**
```bash
# Crear/Cambiar a la rama
git checkout -b [nombre-rama-sugerida] 
# (O 'git checkout [nombre]' si ya existe)

# Agregar cambios
git add .

# Commit semántico
git commit -m "[tipo]: [descripción corta en español]"

# Subir cambios
git push origin [nombre-rama-sugerida]
```

### 📝 Sugerencia para Pull Request
**Título:** `[Mismo que el commit]`

**Descripción:**
```markdown
## Resumen
[Explicación breve de qué se hizo y por qué]

## Cambios
- [Lista de cambios específicos]
- [Lista de cambios específicos]

## Tipo de cambio
- [ ] Nueva funcionalidad
- [ ] Corrección de error
- [ ] Refactorización
- [ ] Documentación

## Checklist
- [ ] El código compila correctamente
- [ ] Se han realizado pruebas locales
```
---

## 4. Activación Obligatoria
**CRÍTICO:** Esta sugerencia de Git debe generarse **INMEDIATAMENTE** después de que el usuario apruebe los cambios (ej. "LGTM", "Acepto", "Funciona bien"). No esperes a que el usuario la pida.