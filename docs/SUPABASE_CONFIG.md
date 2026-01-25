# Guía de Configuración: Google Auth en Supabase

Sigue estos pasos para habilitar el inicio de sesión con Google en tu proyecto de Supabase.

## Paso 1: Configuración en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un nuevo proyecto o selecciona uno existente.
3. En el menú lateral, ve a **APIs & Services > OAuth consent screen**.
4. Selecciona **External** y completa los datos mínimos (Nombre de la app, correo de soporte).
5. Ve a **APIs & Services > Credentials**.
6. Haz clic en **Create Credentials > OAuth client ID**.
7. Selecciona **Web application** como tipo de aplicación.
8. En **Authorized redirect URIs**, deberás pegar la URL que te proporciona Supabase (la encontrarás en el Paso 2).

## Paso 2: Configuración en Supabase

1. Entra a tu [Panel de Supabase](https://app.supabase.com/).
2. Selecciona tu proyecto (**Recetaz**).
3. En el menú lateral, ve a **Authentication > Providers**.
4. Busca **Google** y actívalo (Enable).
5. Copia la **Callback URL** que aparece allí y pégala en los *Authorized redirect URIs* de Google Cloud Console (Paso 1.8).
6. Copia el **Client ID** y el **Client Secret** des de Google Cloud Console y pégalos en Supabase.
7. Haz clic en **Save**.

## Paso 3: Configurar URLs de Redirección

1. En Supabase, ve a **Authentication > URL Configuration**.
2. En el campo **Site URL**, asegúrate de que sea `http://localhost:3000`.
3. En **Redirect URLs**, añade:
   - `http://localhost:3000/dashboard`
   - `http://localhost:3000/`
4. Haz clic en **Save**.

## Paso 4: Probar en la Aplicación

1. Refresca tu aplicación en el navegador.
2. Abre el **Onboarding Wizard** y llega al paso de **Cuenta**.
3. Haz clic en **Continuar con Google**.
4. Ahora debería abrirse la ventana de selección de cuenta de Google sin el error 400.

---
> [!TIP]
> Si después de estos pasos sigues sin ver el Perfil de Usuario en el Sidebar, intenta limpiar el caché del navegador o abrir la app en una ventana de incógnito para forzar la actualización del Service Worker.
