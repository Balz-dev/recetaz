---
description: Prepara una feature finalizada para ser enviada, realizando chequeos de seguridad.
---

1. Comprobar que la rama actual no es `main`, `dev`, `dev-app` ni `dev-landing`.
2. Validar que la aplicación compila TypeScript correctamente:
// turbo
3. Run npx tsc --noEmit
4. Mostrar errores si la compilación falla. Detener el flujo si hay errores.
5. Pedir un tipo y descripción (Conventional Commits) al usuario. Generar un commit message si la compilación fue exitosa.
6. Ejecutar:
// turbo
7. Run git add .
8. Ejecutar el paso de confirmación y commit:
// turbo
9. Run git commit -m "[mensaje generado]"
10. Hacer push de la rama
// turbo
11. Run git push origin [rama-actual]
12. Entregar sugerencia de título y descripción para Pull Request al usuario.
