# Script de Población de Base de Datos

## Descripción

Este documento describe las dos formas de poblar la base de datos con datos de ejemplo para el sistema de recetas médicas.

## Métodos de Población

### Método 1: Desde la Consola del Navegador (Recomendado)

La forma más directa de poblar la base de datos es usando la consola del navegador:

1. Abre la aplicación en `http://localhost:3000`
2. Abre las herramientas de desarrollo (F12)
3. Ve a la pestaña "Console"
4. Ejecuta el siguiente código:

```javascript
import("/src/shared/utils/seed.js").then((m) => m.seedDatabase());
```

Este método:

- ✅ Funciona directamente con el IndexedDB del navegador
- ✅ Los datos persisten inmediatamente
- ✅ No requiere reiniciar la aplicación
- ✅ Muestra el progreso en la consola

### Método 2: Script de Node.js (Solo para Referencia)

También existe un script de Node.js que puede ejecutarse con:

```bash
pnpm run datos
```

**Nota**: Este script usa `fake-indexeddb` y crea una base de datos temporal en memoria que NO persiste en el navegador. Es útil principalmente como referencia del código o para testing automatizado.

## Datos Generados

### Configuración del Médico

- **Nombre**: Dr. Juan Carlos Pérez González
- **Especialidad**: Medicina General
- **Cédula**: 1234567
- **Teléfono**: 55-1234-5678
- **Dirección**: Av. Reforma 123, Col. Centro, CDMX

### Pacientes (8 registros)

1. María Elena Rodríguez López (45 años) - Hipertensión
2. Carlos Alberto Martínez Sánchez (62 años) - Diabetes tipo 2
3. Ana Patricia Hernández Cruz (28 años) - Sin antecedentes
4. José Luis García Ramírez (55 años) - Gastritis crónica
5. Laura Sofía Mendoza Torres (8 años) - Asma leve
6. Roberto Alejandro Flores Díaz (72 años) - Hipertensión y arritmia
7. Diana Carolina Ruiz Morales (35 años) - Migraña crónica
8. Miguel Ángel Ortiz Vargas (19 años) - Sin antecedentes

### Recetas Médicas (12 registros)

Las recetas incluyen diagnósticos variados:

- Hipertensión arterial
- Diabetes mellitus tipo 2
- Infecciones respiratorias
- Gastritis
- Crisis asmática
- Fibrilación auricular
- Migraña
- Faringitis

Cada receta incluye:

- Medicamentos con dosis, frecuencia y duración
- Instrucciones específicas
- Fechas distribuidas en los últimos 30 días

### Movimientos Financieros (10 registros)

**Ingresos por consultas:**

- Generados automáticamente para cada receta de los últimos 7 días
- Monto: $500.00 MXN por consulta

**Gastos operativos:**

- Material de curación: $350.00
- Papelería y recetarios: $200.00
- Limpieza de consultorio: $400.00

### Configuración Financiera

- **Costo de consulta**: $500.00 MXN

## Implementación Técnica

### Dependencias

- **tsx**: Ejecutor de TypeScript para Node.js
- **fake-indexeddb**: Polyfill de IndexedDB para entorno Node.js
- **dexie**: Wrapper de IndexedDB
- **uuid**: Generación de identificadores únicos

### Estructura del Script

El script está organizado en funciones generadoras:

```typescript
generarMedicoConfig(); // Configuración del médico
generarPacientes(); // Array de 8 pacientes
generarRecetas(pacientes); // Array de 12 recetas
generarMovimientosFinancieros(recetas); // Movimientos financieros
generarConfiguracionFinanciera(); // Configuración financiera
```

### Proceso de Ejecución

1. **Limpieza**: Elimina todos los datos existentes
2. **Inserción**: Agrega datos en orden de dependencias
   - Médico
   - Pacientes
   - Recetas (requieren pacientes)
   - Movimientos financieros (requieren recetas)
   - Configuración financiera
3. **Confirmación**: Muestra resumen de datos insertados

## Notas Importantes

- ⚠️ **El script elimina todos los datos existentes** antes de insertar los nuevos
- Los datos son completamente ficticios y están diseñados para demostración
- Las fechas de las recetas están distribuidas en los últimos 30 días
- Los movimientos financieros cubren los últimos 7 días para el gráfico de ganancias
- Todos los IDs son generados con UUID v4

## Verificación

Después de ejecutar el script, puedes verificar los datos:

1. Inicia la aplicación: `pnpm run start`
2. Navega a `http://localhost:3000`
3. Verifica cada sección:
   - Dashboard: Nombre del médico y gráfico de ganancias
   - Pacientes: Lista de 8 pacientes
   - Recetas: Lista de 12 recetas
   - Configuración: Datos del médico

## Personalización

Para modificar los datos generados, edita las funciones generadoras en `scripts/seed-db.ts`:

- Cambia nombres, edades o datos de contacto en `generarPacientes()`
- Modifica diagnósticos y medicamentos en `generarRecetas()`
- Ajusta montos y conceptos en `generarMovimientosFinancieros()`
- Actualiza el costo de consulta en `generarConfiguracionFinanciera()`
