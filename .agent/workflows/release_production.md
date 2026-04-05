---
description: Empaquetar el trabajo de integración en la rama estale de Producción para generar un Snapshot y un Release seguro.
---

1. Validar que estemos operando con un repositorio limpio. Pide confirmación al usuario de no haber ramas bloqueadas.
2. Posicionarse en la rama origen `dev` e hidratar base.
// turbo
3. Run git checkout dev && git pull origin dev
4. Asegurar la compilación limpia del entorno de producción simulado (Fail-fast before merge).
// turbo
5. Run npm run build
6. Posicionarse en `main`.
// turbo
7. Run git checkout main && git pull origin main
8. Fusionar la rama estabilizada `dev` en `main`.
// turbo
9. Run git merge dev -m "chore(release): merge dev to main for production rollout"
10. Confirmar con el usuario el tag de Versionado (SemVer, ejemplo: v1.0.5).
11. Generar la etiqueta de versión local.
// turbo
12. Run git tag [tag-version-pedido]
13. Hacer el push atómico de `main` y de los tags.
// turbo
14. Run git push origin main && git push --tags
15. Ejecutar mensaje final para el desarrollador recomendando ir al dashboard de alojamiento (ej: Vercel) para validar la subida limpia.
