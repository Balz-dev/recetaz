---
description: Realiza la integración semanal estándar que mueve cambios entre ramas base.
---

1. Confirmar con el usuario el orden de integración semanal (Landing -> Dev, App -> Dev, o Dev -> Main).
2. Preguntar la rama origen y la rama destino según el mapa de integración.
3. Asegurar estado limpio:
// turbo
4. Run git status
5. Hacer checkout y actualizar rama destino:
// turbo
6. Run git checkout [rama-destino]
// turbo
7. Run git pull origin [rama-destino]
8. Actualizar localmente la rama origen (bajar si no la tenemos):
// turbo
9. Run git fetch origin [rama-origen]:[rama-origen]
10. Preparar merge normal de origen a destino.
// turbo
11. Run git merge [rama-origen]
12. Preguntar confirmación de éxito. Si hay conflictos, detener todo para resolución manual.
13. Subir rama de integración si fue exitoso y el usuario aprueba de nuevo:
// turbo
14. Run git push origin [rama-destino]
