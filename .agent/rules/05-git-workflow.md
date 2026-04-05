# Flujo Git y Versionamiento — RecetaZ

## Estructura de Ramas

```
main          ← producción (siempre estable)
├── dev       ← integración (merge semanal)
├── dev-landing ← marketing / landing page
└── dev-app   ← producto / dashboard
```

## Convenciones de Nombres

### Ramas de feature

- Landing: `landing/<nombre>` (desde `dev-landing`)
- App: `app/<nombre>` (desde `dev-app`)
- Compartido: `shared/<nombre>` (desde `dev`)

### Commits (Conventional Commits en español)

Formato: `<tipo>(<alcance>): <descripción en imperativo>`

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Ejemplos:
- `feat(app): implementar exportación de recetas a PDF`
- `fix(landing): corregir responsive en hero section`
- `refactor(shared): mejorar sistema de autenticación`

## Protocolo de Trabajo con IA

### Al iniciar una funcionalidad
1. Determinar rama base según el diagrama de decisión
2. Crear rama con nombre descriptivo
3. Commits incrementales por cada bloque lógico completado
4. Validar con `npx tsc --noEmit` antes de cada commit

### Al completar la funcionalidad
Generar el bloque de entrega:

```
### 🚀 Listo para subir a Git
**Rama sugerida:** `[nombre-rama]`

**Comandos:**
git checkout -b [nombre-rama]
git add .
git commit -m "[tipo]([alcance]): [descripción]"
git push origin [nombre-rama]

### 📝 Sugerencia para Pull Request
**Título:** `[Mismo que el commit]`
**Descripción:** Resumen + lista de cambios + checklist
```

> **CRÍTICO**: Generar este bloque INMEDIATAMENTE después de que el usuario apruebe los cambios.

## Referencia Completa

Para diagramas, ejemplos semanales y comandos detallados:
→ `docs/guias/GUIA_GIT_COMPLETA.md`
