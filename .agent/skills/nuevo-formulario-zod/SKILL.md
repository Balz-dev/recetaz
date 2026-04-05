---
name: nuevo-formulario-zod
description: Creación estandarizada de un Formulario tipado con React-Hook-Form acoplado a esquemas de validación Zod y UI Components de la solución.
---

# Skill: Factory de Formulario Profesional

## Contexto
La creación individual de inputs, handlers y validaciones condicionales ensucia los componentes de App. Debemos delegar y normalizar la entrada de datos.

## Procedimiento

1. **Definir el Esquema Zod en Tipo (`schema.ts` o directo en el componente/hook)**
   ```typescript
   export const entitySchema = z.object({
     name: z.string().min(2, "Mensaje amigable en español"),
     email: z.string().email("Correo no válido").optional(),
   });
   export type EntityFormValues = z.infer<typeof entitySchema>;
   ```
2. **Setup principal del Hook**
   - Usar `useForm<EntityFormValues>({ resolver: zodResolver(entitySchema), defaultValues: {} })`.
3. **Componentes UI Envoltura (Shadcn/Radix)**
   - Utilizar el patrón Contexto de Formulario originado de `react-hook-form` si los componentes bases de Shadcn (Form, FormField, FormControl) están presentes en `@/shared/components/ui/form`.
   - Prohibido manipular eventos del DOM crudos `e.preventDefault()`. Todo enrutamiento pasa por `<form onSubmit={form.handleSubmit(onSubmit)}>`
4. **UX de Manejo de Estado (Loading)**
   - Incluir control de desactivado (disable state) dinámicamente: `<Button disabled={form.formState.isSubmitting}>Guardar</Button>`
5. **Composición**
   - Dividir secciones inmensas en sub-componentes pasándoles el "Control" de RHF o a través de un `FormProvider`.
