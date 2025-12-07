# Guía de Funcionalidad Offline - RecetaZ PWA

## Introducción

RecetaZ es una **Progressive Web App (PWA)** diseñada para funcionar completamente **offline-first**. Esto significa que todas las funcionalidades principales están disponibles sin conexión a internet.

## ¿Cómo funciona?

### Tecnologías Utilizadas

1. **IndexedDB con Dexie.js**: Base de datos local en el navegador
2. **Service Worker**: Caché de recursos y manejo offline
3. **Next.js PWA**: Framework con soporte PWA integrado

### Primera Instalación

> [!IMPORTANT]
> Para que la aplicación funcione offline, debe visitarse **al menos una vez con conexión a internet**. Esto permite que el Service Worker descargue y cachee todos los recursos necesarios.

**Pasos de instalación**:

1. Visita la aplicación con conexión a internet
2. El Service Worker se registra automáticamente
3. Todos los recursos se cachean en segundo plano
4. La aplicación está lista para funcionar offline

### Indicador de Estado

La aplicación muestra un **indicador visual** cuando está offline:

- **Badge amarillo** en la esquina inferior derecha
- **Notificación toast** al perder/recuperar conexión
- Mensajes informativos sobre el estado

## Funcionalidades Disponibles Offline

### ✅ Gestión de Pacientes

**Registro de nuevos pacientes**:

- Navega a `/pacientes/nuevo`
- Completa el formulario
- Los datos se guardan en IndexedDB local
- Disponibles inmediatamente en la lista

**Búsqueda de pacientes**:

- Usa la barra de búsqueda en `/pacientes`
- Búsqueda instantánea en datos locales
- Filtrado por nombre

**Actualización de datos**:

- Edita información de pacientes existentes
- Cambios guardados localmente

### ✅ Generación de Recetas

**Crear nueva receta**:

- Navega a `/recetas/nueva`
- Selecciona paciente del dropdown
- Completa diagnóstico, indicaciones y medicamentos
- **Numeración consecutiva automática** (0001, 0002, etc.)
- Guardado instantáneo en IndexedDB

**Características**:

- Múltiples medicamentos por receta
- Datos del paciente incluidos en la receta
- Fecha de emisión automática
- Historial completo disponible

### ✅ Búsqueda de Recetas

**Búsqueda avanzada**:

- Por número de receta (folio)
- Por nombre de paciente
- Búsqueda instantánea sin conexión

### ✅ Impresión de Recetas

**Generar PDF**:

- Abre cualquier receta desde `/recetas`
- Clic en "Imprimir / Ver PDF"
- PDF generado localmente con @react-pdf/renderer
- Listo para imprimir sin internet

**Reimpresión**:

- Acceso a recetas históricas
- Reimpresión ilimitada
- Datos inmutables (no cambian si se actualiza el paciente)

### ✅ Dashboard y Finanzas

**Panel de ganancias**:

- Visualización de ingresos semanales
- Cálculo basado en recetas generadas
- Gráficos generados localmente

## Limitaciones

> [!WARNING]
> **No hay sincronización con servidor externo**

Todos los datos permanecen **exclusivamente en el dispositivo local**:

- Los datos NO se sincronizan entre dispositivos
- Si se borra el caché del navegador, se pierden los datos
- No hay backup automático en la nube

> [!CAUTION]
> **Importante para producción**

- **Exportar datos regularmente** (función a implementar)
- **No usar en múltiples dispositivos** sin sincronización
- **Hacer backup manual** de IndexedDB si es crítico

### Limitaciones Técnicas

| Aspecto           | Limitación                                            |
| ----------------- | ----------------------------------------------------- |
| Almacenamiento    | Limitado por cuota del navegador (~50MB-100MB típico) |
| Sincronización    | No disponible (solo local)                            |
| Multi-dispositivo | No soportado                                          |
| Backup            | Manual (no automático)                                |
| Fuentes externas  | Requieren caché previo                                |

## Uso Recomendado

### Escenario Ideal

RecetaZ es ideal para:

- **Consultorios médicos individuales**
- **Uso en un solo dispositivo/computadora**
- **Zonas con conectividad limitada**
- **Privacidad total** (datos nunca salen del dispositivo)

### Mejores Prácticas

1. **Primera carga con internet**: Asegúrate de cargar la app con conexión al menos una vez
2. **Mantener el navegador actualizado**: Para mejor soporte de PWA
3. **No borrar caché del navegador**: Contiene todos tus datos
4. **Instalar como PWA**: Mejor experiencia (ventana independiente)

## Instalación como PWA

### En Desktop (Chrome/Edge)

1. Visita la aplicación
2. Busca el ícono de instalación en la barra de direcciones
3. Clic en "Instalar RecetaZ"
4. La app se abre en ventana independiente

### En Móvil (Android)

1. Abre en Chrome
2. Menú (⋮) > "Agregar a pantalla de inicio"
3. Confirma instalación
4. Ícono aparece en tu pantalla de inicio

### En iOS (Safari)

1. Abre en Safari
2. Botón compartir (⬆️)
3. "Agregar a pantalla de inicio"
4. Confirma

## Verificación de Estado Offline

### Probar Funcionalidad Offline

**Método 1: DevTools**

1. Abre DevTools (F12)
2. Pestaña "Network"
3. Activa checkbox "Offline"
4. Prueba todas las funcionalidades

**Método 2: Modo Avión**

1. Activa modo avión en tu dispositivo
2. Usa la aplicación normalmente
3. Todo debe funcionar sin errores

### Verificar Service Worker

1. DevTools > Application > Service Workers
2. Debe aparecer "Activated and running"
3. Scope: `http://localhost:3000/` (o tu dominio)

### Verificar Caché

1. DevTools > Application > Cache Storage
2. Deben aparecer varios cachés:
   - `workbox-precache-v2-...`
   - `pages`
   - `static-js-assets`
   - `static-style-assets`
   - etc.

### Verificar IndexedDB

1. DevTools > Application > IndexedDB
2. Base de datos: `RecetasMedicasDB`
3. Tablas:
   - `medico`
   - `pacientes`
   - `recetas`
   - `finanzas`
   - `configuracionFinanciera`

## Solución de Problemas

### La app no funciona offline

**Solución**:

1. Visita la app con conexión a internet
2. Espera a que el Service Worker se registre
3. Recarga la página (Ctrl+R)
4. Verifica en DevTools que el SW está activo

### Los datos no se guardan

**Solución**:

1. Verifica que IndexedDB no esté deshabilitado
2. Revisa la consola por errores
3. Asegúrate de tener espacio de almacenamiento

### El Service Worker no se registra

**Solución**:

1. Verifica que estés en HTTPS o localhost
2. Limpia caché del navegador
3. Recarga la página con Ctrl+Shift+R
4. Revisa consola por errores

## Soporte de Navegadores

| Navegador | Versión Mínima | Soporte     |
| --------- | -------------- | ----------- |
| Chrome    | 67+            | ✅ Completo |
| Edge      | 79+            | ✅ Completo |
| Firefox   | 63+            | ✅ Completo |
| Safari    | 11.1+          | ⚠️ Limitado |
| Opera     | 54+            | ✅ Completo |

> [!NOTE]
> Safari tiene limitaciones en Service Workers y puede requerir reinstalación periódica.

## Preguntas Frecuentes

**¿Puedo usar la app en múltiples dispositivos?**
No, los datos son locales a cada dispositivo. No hay sincronización.

**¿Qué pasa si borro el caché del navegador?**
Se perderán todos los datos. Usa con precaución.

**¿Puedo exportar mis datos?**
Actualmente no hay función de exportación (feature a implementar).

**¿La app funciona en móviles?**
Sí, es completamente responsive y funciona en móviles como PWA.

**¿Necesito internet para imprimir?**
No, la generación de PDF es completamente local.

**¿Los datos están seguros?**
Sí, nunca salen de tu dispositivo. Total privacidad.

## Conclusión

RecetaZ es una PWA completamente funcional offline que permite gestionar pacientes y recetas médicas sin conexión a internet. Ideal para consultorios individuales que valoran la privacidad y necesitan funcionar en zonas con conectividad limitada.

**Ventajas**:

- ✅ 100% funcional offline
- ✅ Privacidad total (datos locales)
- ✅ Sin costos de servidor
- ✅ Rápido y responsive

**Consideraciones**:

- ⚠️ Sin sincronización multi-dispositivo
- ⚠️ Requiere backup manual
- ⚠️ Limitado por cuota del navegador
