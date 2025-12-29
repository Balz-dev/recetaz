---
trigger: always_on
---

# Reglas de Flujo de Trabajo Git y Versionamiento

Esta regla se activa **siempre** al finalizar y validar una tarea de codificación.

## 1. Estrategia de Ramas (Branching Strategy)
Recomendamos un flujo basado en **Feature Branches**. Nunca trabajes directamente en `main`.

### Selección de Rama
Antes de sugerir comandos, analiza el tipo de cambio y sugiere la rama adecuada:

| Tipo de Trabajo | Rama Sugerida (Prefijo) | Ejemplo |
|-----------------|-------------------------|---------|
| Nueva funcionalidad | `feature/` | `feature/nueva-galeria` |
| Corrección de error | `fix/` | `fix/error-login` |
| Mejoras de SEO/Marketing | `feature/seo-` o `landingpage` | `feature/seo-meta-tags` |
| Refactorización | `refactor/` | `refactor/limpieza-codigo` |
| Configuración/Mantenimiento | `chore/` | `chore/actualizar-dependencias` |

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
