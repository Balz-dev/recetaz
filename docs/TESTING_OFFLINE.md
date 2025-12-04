# INSTRUCCIONES CRÍTICAS PARA PROBAR OFFLINE

## ⚠️ IMPORTANTE: Debes seguir TODOS estos pasos en orden

### Paso 1: Detener el servidor actual
```bash
# En la terminal donde corre npm start, presiona:
Ctrl + C
```

### Paso 2: Iniciar el servidor con el nuevo build
```bash
npm start
```

### Paso 3: Abrir la aplicación EN UNA NUEVA VENTANA DE INCÓGNITO
**MUY IMPORTANTE:** Usa modo incógnito para evitar cachés antiguos del navegador.

1. Abre una ventana de incógnito (Ctrl+Shift+N en Chrome)
2. Navega a `http://localhost:3000`
3. **ESPERA** a que la página cargue completamente

### Paso 4: Verificar que el Service Worker se registró
1. Presiona F12 para abrir DevTools
2. Ve a la pestaña **Console**
3. Deberías ver logs como:
   - 🚀 ServiceWorkerRegister component mounted
   - ✓ Service Worker API available
   - ✓ Window loaded, registering SW...
   - ✅ Service Worker registered successfully

4. Ve a la pestaña **Application**
5. En el menú izquierdo, selecciona **Service Workers**
6. Deberías ver `sw.js` con estado **activated and is running**

### Paso 5: Usar la calculadora para generar caché
**CRÍTICO:** Debes usar la calculadora ANTES de ir offline para que se cachee.

1. Haz algunos cálculos: 2+2, 5*3, etc.
2. Espera 5 segundos
3. Ve a **Application > Cache Storage** en DevTools
4. Deberías ver varios cachés:
   - `start-url`
   - `localhost-cache`
   - `precache-v2-...`

### Paso 6: Probar modo offline
1. En DevTools, ve a la pestaña **Network**
2. En el dropdown que dice "No throttling", selecciona **Offline**
3. **RECARGA LA PÁGINA** (F5 o Ctrl+R)
4. La calculadora debería aparecer y funcionar normalmente

### Paso 7: Si NO funciona
Si ves una página en blanco o error:

1. Ve a **Application > Service Workers**
2. Haz clic en "Unregister" para desregistrar el SW
3. Ve a **Application > Cache Storage**
4. Borra todos los cachés (clic derecho > Delete)
5. Cierra la ventana de incógnito
6. Repite desde el Paso 3

## ¿Qué debería pasar?

✅ **CORRECTO:** La calculadora aparece y funciona offline
❌ **INCORRECTO:** Página en blanco, error de red, o "offline.html"

## Debugging adicional

Si sigue sin funcionar, captura:
1. Screenshot de **Application > Service Workers**
2. Screenshot de **Application > Cache Storage**
3. Screenshot de **Console** con todos los logs
4. Screenshot de lo que ves cuando estás offline
