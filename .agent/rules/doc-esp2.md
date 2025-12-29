---
trigger: always_on
---

Regla de Codificación para IA
Next.js + TypeScript
🧠 Regla General

Toda función, componente, hook, servicio, API Route o utilidad implementada en Next.js con TypeScript DEBE estar documentada dentro del código, siguiendo buenas prácticas de desarrollo.
Toda la documentación, comentarios, artefactos y explicaciones deben generarse únicamente en español.

✅ Reglas Obligatorias
1️⃣ Documentación de Código

Cada uno de los siguientes elementos DEBE tener documentación:

Funciones

Componentes React

Hooks personalizados

API Routes (route.ts / api)

Servicios y utilidades

Tipos e interfaces complejas

Se debe usar comentarios tipo JSDoc / TSDoc en español.

La documentación debe incluir:

Descripción clara del propósito

Parámetros (@param)

Valor de retorno (@returns)

Posibles errores o comportamientos especiales (@throws cuando aplique)

2️⃣ Componentes React (Next.js)

Los componentes deben:

Tener una sola responsabilidad

Usar nombres descriptivos

Estar tipados con TypeScript

Documentarse con un bloque JSDoc

Ejemplo:
/\*\*

- Componente que muestra la información básica de un usuario.
-
- @param props - Propiedades del componente.
- @param props.nombre - Nombre del usuario.
- @param props.email - Correo electrónico del usuario.
- @returns Componente JSX con la información del usuario.
  \*/
  export function TarjetaUsuario({
  nombre,
  email,
  }: {
  nombre: string;
  email: string;
  }) {
  return (
  <div>
  <h2>{nombre}</h2>
  <p>{email}</p>
  </div>
  );
  }

3️⃣ Hooks Personalizados

Todo hook personalizado debe:

Comenzar con use

Estar completamente documentado

Explicar su estado interno y efectos secundarios

/\*\*

- Hook personalizado para manejar el estado de carga.
-
- @returns Objeto con el estado de carga y funciones para actualizarlo.
  \*/
  export function useCarga() {
  const [cargando, setCargando] = useState(false);

return {
cargando,
iniciarCarga: () => setCargando(true),
finalizarCarga: () => setCargando(false),
};
}

4️⃣ API Routes (Next.js App Router)

Todas las rutas de API deben:

Manejar errores correctamente

Tipar las respuestas

Estar documentadas

/\*\*

- Maneja la obtención de usuarios.
-
- @returns Respuesta JSON con la lista de usuarios.
  \*/
  export async function GET() {
  try {
  return Response.json({ usuarios: [] });
  } catch (error) {
  return Response.json(
  { mensaje: "Error al obtener los usuarios" },
  { status: 500 }
  );
  }
  }

5️⃣ Buenas Prácticas Obligatorias

Usar TypeScript estricto

Evitar any

Separar lógica de presentación

No duplicar código (DRY)

Mantener funciones pequeñas

Manejo explícito de errores

Uso correcto de async/await

Estructura de carpetas clara

6️⃣ Comentarios

Solo agregar comentarios cuando la lógica no sea obvia

Nunca comentar lo evidente

Todos los comentarios deben estar en español

7️⃣ Artefactos y Salidas

Todo lo generado por la IA:

Código

Documentación

Explicaciones

Ejemplos

Diagramas

DEBE estar 100% en español

8️⃣ Documentación Solicitada

Toda explicación, guía técnica o documentación solicitada por el usuario DEBE generarse únicamente en español, sin mezclar idiomas.