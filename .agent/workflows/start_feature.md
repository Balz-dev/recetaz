---
description: Inicia una nueva rama de feature sincronizada con la base correcta.
---

1. Preguntar al usuario qué tipo de feature es (App, Landing o Shared).
2. Determinar la rama base según:
   - App -> `dev-app`
   - Landing -> `dev-landing`
   - Shared -> `dev`
3. Preguntar el nombre en kebab-case en español de la feature.
4. Ejecutar validación para asegurar que no hay cambios no guardados.
// turbo
5. Run git status
6. Si el status es limpio, hacer checkout a la rama base.
// turbo
7. Run git checkout [rama-base]
8. Traer cambios más recientes.
// turbo
9. Run git pull origin [rama-base]
10. Crear y moverse a la nueva rama.
// turbo
11. Run git checkout -b [tipo-rama]/[nombre-feature]
