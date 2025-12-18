# Reglas de Implementación con IA - RecetaZ

Este documento establece las reglas y mejores prácticas para trabajar con agentes de IA en el desarrollo de RecetaZ.

## 🤖 Reglas Generales de Trabajo con IA

### 0. Idioma y Localización

> [!IMPORTANT]
> **Regla de Idioma**
> - **Planes y Documentación**: Todos los planes de implementación, walkthroughs, y documentación generada deben redactarse estrictamente en **ESPAÑOL**.
> - **Comunicación**: Las explicaciones y respuestas en el chat deben ser en español.
> - **Código**: Los comentarios en el código deben ser descriptivos y en español.

### 1. Gestión de Puertos y Procesos

> [!IMPORTANT]
> **Regla de Liberación de Puertos**

Después de completar pruebas con el browser agent, **SIEMPRE** liberar el puerto 3000:

```bash
# Detener el servidor de desarrollo
# Si conoces el PID del proceso:
kill -9 <PID>

# O usar el comando de npm/pnpm:
# Ctrl+C en la terminal donde corre el servidor

# Verificar que el puerto esté libre:
lsof -ti:3000

# Si hay procesos, matarlos:
pkill -f "next dev"
```

**Razón**: Evitar conflictos de puerto cuando se inicia el servidor de producción o nuevas sesiones de desarrollo.

### 2. Workflow de Desarrollo con IA

#### Fase 1: Planificación

1. Crear `implementation_plan.md` con cambios propuestos
2. Solicitar aprobación del usuario si hay decisiones críticas
3. Documentar arquitectura y estrategia

#### Fase 2: Implementación

1. Implementar cambios según el plan
2. Documentar código con comentarios descriptivos
3. Seguir convenciones del proyecto

#### Fase 3: Verificación

1. Ejecutar pruebas con browser agent
2. Capturar evidencias (screenshots, grabaciones)
3. Validar funcionalidad offline si aplica
4. **LIBERAR PUERTO 3000** al finalizar pruebas

#### Fase 4: Documentación

1. Crear `walkthrough.md` con evidencias
2. Actualizar documentación relevante
3. Generar comandos Git/GitHub

#### Fase 5: Integración

1. Crear rama con nombre descriptivo
2. Commit con mensaje detallado
3. Push y crear Pull Request

## 📋 Comandos Git/GitHub - Workflow Completo

### Paso 1: Crear Rama de Feature

```bash
# Asegurarse de estar en main/master actualizado
git checkout main
git pull origin main

# Crear rama descriptiva (usar convención)
git checkout -b feat/nombre-descriptivo-del-feature
# Ejemplos:
# - feat/pwa-offline-first
# - fix/patient-search-bug
# - refactor/database-structure
# - docs/user-manual-update
```

### Paso 2: Realizar Cambios y Commits

```bash
# Ver estado de archivos modificados
git status

# Agregar archivos específicos
git add src/path/to/file1.ts
git add src/path/to/file2.tsx
git add docs/DOCUMENTATION.md

# O agregar todos los cambios (usar con precaución)
git add .

# Commit con mensaje descriptivo siguiendo convención
git commit -m "feat: Descripción breve del cambio

- Detalle 1 del cambio
- Detalle 2 del cambio
- Detalle 3 del cambio

Verificaciones realizadas:
✅ Prueba 1
✅ Prueba 2
✅ Prueba 3

Notas adicionales si son necesarias."
```

### Paso 3: Push a GitHub

```bash
# Primera vez (crear rama remota)
git push -u origin feat/nombre-descriptivo-del-feature

# Pushes subsecuentes
git push origin feat/nombre-descriptivo-del-feature

# Si necesitas forzar (usar con MUCHO cuidado)
git push --force-with-lease origin feat/nombre-descriptivo-del-feature
```

### Paso 4: Crear Pull Request en GitHub

**Opción A: Desde la terminal con GitHub CLI**

```bash
# Instalar GitHub CLI si no está instalado
# https://cli.github.com/

# Crear PR
gh pr create --title "feat: Título del PR" \
  --body "## Descripción

Descripción detallada de los cambios realizados.

## Cambios
- Cambio 1
- Cambio 2
- Cambio 3

## Pruebas
- ✅ Prueba 1
- ✅ Prueba 2

## Screenshots
(Agregar si aplica)

## Checklist
- [x] Código probado localmente
- [x] Documentación actualizada
- [x] Sin conflictos con main
- [x] Pruebas pasando"

# Ver PRs abiertos
gh pr list

# Ver detalles de un PR
gh pr view <número>

# Mergear PR (si tienes permisos)
gh pr merge <número> --squash
```

**Opción B: Desde la interfaz web de GitHub**

1. Ve a tu repositorio en GitHub
2. Verás un banner "Compare & pull request" después del push
3. Clic en "Compare & pull request"
4. Completa:
   - **Title**: Título descriptivo (ej: "feat: Implementar PWA offline-first")
   - **Description**: Descripción detallada con checklist
5. Asigna reviewers si aplica
6. Clic en "Create pull request"

### Paso 5: Merge y Limpieza

```bash
# Después de que el PR sea aprobado y mergeado:

# Volver a main
git checkout main

# Actualizar main con los cambios mergeados
git pull origin main

# Eliminar rama local (ya no necesaria)
git branch -d feat/nombre-descriptivo-del-feature

# Eliminar rama remota (opcional, GitHub lo hace automáticamente)
git push origin --delete feat/nombre-descriptivo-del-feature
```

## 🎯 Convenciones de Commits

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

### Tipos de Commits

- **feat**: Nueva funcionalidad
- **fix**: Corrección de bug
- **docs**: Cambios en documentación
- **style**: Cambios de formato (no afectan código)
- **refactor**: Refactorización de código
- **test**: Agregar o modificar tests
- **chore**: Tareas de mantenimiento
- **perf**: Mejoras de performance

### Formato del Mensaje

```
<tipo>(<scope>): <descripción breve>

<descripción detallada>

<footer con referencias>
```

### Ejemplos

```bash
# Feature simple
git commit -m "feat: agregar búsqueda de pacientes por cédula"

# Feature complejo
git commit -m "feat(pacientes): implementar búsqueda avanzada

- Búsqueda por nombre, cédula y teléfono
- Filtrado en tiempo real
- Destacado de resultados

Closes #123"

# Fix
git commit -m "fix(recetas): corregir numeración consecutiva

La numeración se reiniciaba después de eliminar recetas.
Ahora usa el índice createdAt para garantizar secuencia.

Fixes #456"

# Documentación
git commit -m "docs: actualizar guía de instalación PWA"

# Refactor
git commit -m "refactor(db): migrar a Dexie v4

- Actualizar esquema de base de datos
- Mejorar tipado TypeScript
- Optimizar queries

BREAKING CHANGE: Requiere migración de datos"
```

## 🔄 Workflow de Hotfix

Para correcciones urgentes en producción:

```bash
# Crear rama de hotfix desde main
git checkout main
git pull origin main
git checkout -b hotfix/descripcion-del-fix

# Realizar cambios y commit
git add .
git commit -m "fix: descripción urgente del fix"

# Push y crear PR de emergencia
git push -u origin hotfix/descripcion-del-fix

# Después del merge, actualizar también develop si existe
git checkout develop
git pull origin develop
git merge main
git push origin develop
```

## 📊 Checklist Pre-Commit

Antes de hacer commit, verificar:

- [ ] **Código funciona**: Probado localmente sin errores
- [ ] **Tests pasan**: Si hay tests automatizados
- [ ] **Linting**: Sin errores de ESLint/Prettier
- [ ] **TypeScript**: Sin errores de tipo
- [ ] **Documentación**: Actualizada si aplica
- [ ] **Comentarios**: Código complejo está comentado
- [ ] **Console.logs**: Removidos (excepto los necesarios)
- [ ] **Archivos innecesarios**: No incluir node_modules, .env, etc.
- [ ] **Puerto 3000**: Liberado después de pruebas

## 🚀 Comandos Útiles

### Verificación de Estado

```bash
# Ver estado actual
git status

# Ver diferencias
git diff

# Ver diferencias staged
git diff --staged

# Ver historial
git log --oneline -10

# Ver ramas
git branch -a
```

### Correcciones Rápidas

```bash
# Modificar último commit (antes de push)
git commit --amend -m "nuevo mensaje"

# Agregar archivos olvidados al último commit
git add archivo-olvidado.ts
git commit --amend --no-edit

# Deshacer cambios no staged
git restore archivo.ts

# Deshacer cambios staged
git restore --staged archivo.ts

# Deshacer último commit (mantener cambios)
git reset --soft HEAD~1

# Deshacer último commit (eliminar cambios)
git reset --hard HEAD~1
```

### Sincronización

```bash
# Actualizar main sin cambiar de rama
git fetch origin main:main

# Ver cambios remotos sin merge
git fetch origin
git log HEAD..origin/main

# Rebase en lugar de merge (mantener historial limpio)
git pull --rebase origin main
```

## 🛡️ Reglas de Seguridad

> [!CAUTION]
> **NUNCA commitear información sensible**

- ❌ No incluir archivos `.env`
- ❌ No incluir API keys o tokens
- ❌ No incluir contraseñas
- ❌ No incluir datos personales de usuarios reales

**Si accidentalmente commiteaste información sensible**:

```bash
# Remover archivo del historial (usar con cuidado)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/sensitive/file" \
  --prune-empty --tag-name-filter cat -- --all

# Forzar push (PELIGROSO - coordinar con equipo)
git push origin --force --all

# Mejor opción: rotar credenciales comprometidas
```

## 📝 Template de Pull Request

Usar este template para PRs:

```markdown
## 📋 Descripción

Breve descripción de los cambios realizados.

## 🎯 Tipo de Cambio

- [ ] 🐛 Bug fix
- [ ] ✨ Nueva funcionalidad
- [ ] 💥 Breaking change
- [ ] 📝 Documentación
- [ ] ♻️ Refactorización
- [ ] ⚡ Mejora de performance

## 🧪 Pruebas Realizadas

- [ ] Prueba 1
- [ ] Prueba 2
- [ ] Prueba 3

## 📸 Screenshots/Grabaciones

(Agregar evidencias visuales si aplica)

## ✅ Checklist

- [ ] Código probado localmente
- [ ] Tests pasando
- [ ] Documentación actualizada
- [ ] Sin conflictos con main
- [ ] Puerto 3000 liberado después de pruebas
- [ ] Commits siguen convención
- [ ] Sin información sensible

## 📚 Documentación Relacionada

- Link a issue relacionado
- Link a documentación técnica
- Link a diseños (si aplica)

## 🔗 Referencias

Closes #<issue_number>
```

## 🎓 Recursos Adicionales

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Git Best Practices](https://git-scm.com/book/en/v2)
- [Semantic Versioning](https://semver.org/)

---

**Última actualización**: 7 de diciembre de 2025  
**Versión**: 1.0.0
