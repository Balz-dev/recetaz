# Plan de Pruebas - Sistema de Recetas Médicas

## Registro de Pruebas por Fase

Este documento registrará todas las pruebas realizadas en cada fase del desarrollo.

---

## Fase 1: Setup Inicial ⏳

### Fecha: _Pendiente_

#### Pruebas Realizadas
- [ ] Servidor de desarrollo inicia sin errores
- [ ] Página inicial carga correctamente
- [ ] TypeScript compila sin errores
- [ ] shadcn/ui componentes se importan correctamente

#### Resultados
```
Pendiente de ejecución
```

#### Problemas Encontrados
```
Ninguno aún
```

---

## Fase 2: Base de Datos IndexedDB ⏳

### Fecha: _Pendiente_

#### Pruebas Realizadas
- [ ] IndexedDB se crea correctamente
- [ ] Tablas se crean con schemas correctos
- [ ] Operación CREATE funciona
- [ ] Operación READ funciona
- [ ] Operación UPDATE funciona
- [ ] Operación DELETE funciona
- [ ] Datos persisten después de recargar página
- [ ] Búsqueda y filtrado funcionan

#### Datos de Prueba
```typescript
// Médico de prueba
{
  nombre: "Dr. Juan Pérez",
  especialidad: "Medicina General",
  cedula: "001-123456-7",
  telefono: "+505 8888-8888",
  direccion: "Managua, Nicaragua"
}

// Pacientes de prueba
[
  {
    nombre: "María González",
    edad: 45,
    cedula: "001-234567-8",
    telefono: "+505 7777-7777",
    direccion: "Managua"
  },
  {
    nombre: "Carlos Martínez",
    edad: 32,
    cedula: "001-345678-9",
    telefono: "+505 6666-6666",
    direccion: "León"
  }
]
```

#### Resultados
```
Pendiente de ejecución
```

#### Problemas Encontrados
```
Ninguno aún
```

---

## Fase 3: Layout y Navegación ⏳

### Fecha: _Pendiente_

#### Pruebas Realizadas
- [ ] Sidebar se muestra correctamente
- [ ] Navegación entre páginas funciona
- [ ] Sidebar responsive en móvil
- [ ] Links activos se destacan
- [ ] Header muestra información correcta

#### Dispositivos Probados
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Móvil (375x667)

#### Resultados
```
Pendiente de ejecución
```

#### Problemas Encontrados
```
Ninguno aún
```

---

## Fase 4: Configuración del Médico ⏳

### Fecha: _Pendiente_

#### Pruebas Realizadas
- [ ] Formulario se renderiza correctamente
- [ ] Validación de campos requeridos funciona
- [ ] Validación de formato de cédula
- [ ] Validación de formato de teléfono
- [ ] Datos se guardan en IndexedDB
- [ ] Datos persisten después de recargar
- [ ] Edición de configuración funciona
- [ ] Redirección en primer uso funciona

#### Casos de Prueba

**Caso 1: Primer uso**
- Acción: Acceder a la app por primera vez
- Esperado: Redirige a configuración
- Resultado: _Pendiente_

**Caso 2: Guardar configuración válida**
- Acción: Completar formulario con datos válidos
- Esperado: Guarda y redirige al dashboard
- Resultado: _Pendiente_

**Caso 3: Validación de campos**
- Acción: Intentar guardar con campos vacíos
- Esperado: Muestra errores de validación
- Resultado: _Pendiente_

#### Resultados
```
Pendiente de ejecución
```

#### Problemas Encontrados
```
Ninguno aún
```

---

## Fase 5: Gestión de Pacientes ⏳

### Fecha: _Pendiente_

#### Pruebas Realizadas
- [ ] Crear nuevo paciente
- [ ] Listar todos los pacientes
- [ ] Buscar paciente por nombre
- [ ] Buscar paciente por cédula
- [ ] Editar paciente existente
- [ ] Eliminar paciente
- [ ] Validación de formulario

#### Casos de Prueba

**Caso 1: Crear paciente**
- Datos: María González, 45 años, 001-234567-8
- Esperado: Paciente se crea y aparece en lista
- Resultado: _Pendiente_

**Caso 2: Búsqueda**
- Acción: Buscar "María"
- Esperado: Muestra pacientes con "María" en el nombre
- Resultado: _Pendiente_

**Caso 3: Editar paciente**
- Acción: Cambiar teléfono de paciente
- Esperado: Cambios se guardan correctamente
- Resultado: _Pendiente_

**Caso 4: Eliminar paciente**
- Acción: Eliminar paciente sin recetas
- Esperado: Paciente se elimina
- Resultado: _Pendiente_

**Caso 5: Eliminar paciente con recetas**
- Acción: Intentar eliminar paciente con recetas
- Esperado: Muestra advertencia o previene eliminación
- Resultado: _Pendiente_

#### Resultados
```
Pendiente de ejecución
```

#### Problemas Encontrados
```
Ninguno aún
```

---

## Fase 6: Sistema de Recetas ⏳

### Fecha: _Pendiente_

#### Pruebas Realizadas
- [ ] Crear receta con 1 medicamento
- [ ] Crear receta con múltiples medicamentos
- [ ] Numeración automática funciona
- [ ] Seleccionar paciente existente
- [ ] Crear paciente desde formulario de receta
- [ ] Agregar medicamento
- [ ] Eliminar medicamento
- [ ] Validación de campos
- [ ] Listar recetas
- [ ] Buscar receta por número
- [ ] Filtrar recetas por paciente
- [ ] Ver detalle de receta

#### Casos de Prueba

**Caso 1: Primera receta**
- Acción: Crear primera receta
- Esperado: Número de receta = 001
- Resultado: _Pendiente_

**Caso 2: Receta con 3 medicamentos**
```
Paciente: María González
Diagnóstico: Hipertensión arterial
Medicamentos:
  1. Losartán 50mg - 1 tableta cada 12 horas - 30 días
  2. Hidroclorotiazida 25mg - 1 tableta al día - 30 días
  3. Ácido acetilsalicílico 100mg - 1 tableta al día - 30 días
Instrucciones: Tomar con alimentos. Control en 30 días.
```
- Esperado: Receta se crea con todos los medicamentos
- Resultado: _Pendiente_

**Caso 3: Validación de medicamentos**
- Acción: Intentar guardar sin medicamentos
- Esperado: Muestra error de validación
- Resultado: _Pendiente_

#### Resultados
```
Pendiente de ejecución
```

#### Problemas Encontrados
```
Ninguno aún
```

---

## Fase 7: Generación de PDF ⏳

### Fecha: _Pendiente_

#### Pruebas Realizadas
- [ ] PDF se genera correctamente
- [ ] Encabezado muestra datos del médico
- [ ] Datos del paciente son correctos
- [ ] Diagnóstico se muestra completo
- [ ] Tabla de medicamentos formateada
- [ ] Instrucciones se muestran completas
- [ ] Fecha es correcta
- [ ] Número de receta es correcto
- [ ] Descargar PDF funciona
- [ ] Imprimir PDF funciona
- [ ] Formato es profesional

#### Casos de Prueba

**Caso 1: PDF simple**
- Acción: Generar PDF de receta con 1 medicamento
- Esperado: PDF se genera con formato correcto
- Resultado: _Pendiente_

**Caso 2: PDF complejo**
- Acción: Generar PDF de receta con 5 medicamentos
- Esperado: Todos los medicamentos caben en la página
- Resultado: _Pendiente_

**Caso 3: Texto largo**
- Acción: Receta con diagnóstico e instrucciones largas
- Esperado: Texto se ajusta correctamente
- Resultado: _Pendiente_

**Caso 4: Impresión**
- Acción: Imprimir PDF en impresora física/PDF
- Esperado: Formato se mantiene en papel
- Resultado: _Pendiente_

#### Resultados
```
Pendiente de ejecución
```

#### Problemas Encontrados
```
Ninguno aún
```

---

## Fase 8: Dashboard ⏳

### Fecha: _Pendiente_

#### Pruebas Realizadas
- [ ] Estadísticas se calculan correctamente
- [ ] Total de pacientes correcto
- [ ] Total de recetas correcto
- [ ] Recetas del mes correcto
- [ ] Recetas de hoy correcto
- [ ] Lista de recetas recientes
- [ ] Accesos rápidos funcionan

#### Casos de Prueba

**Caso 1: Dashboard vacío**
- Acción: Ver dashboard sin datos
- Esperado: Muestra ceros y mensaje de bienvenida
- Resultado: _Pendiente_

**Caso 2: Dashboard con datos**
- Acción: Ver dashboard con 10 pacientes y 25 recetas
- Esperado: Estadísticas correctas
- Resultado: _Pendiente_

#### Resultados
```
Pendiente de ejecución
```

#### Problemas Encontrados
```
Ninguno aún
```

---

## Fase 9: PWA y Funcionalidad Offline ⏳

### Fecha: _Pendiente_

#### Pruebas Realizadas
- [ ] App se puede instalar en desktop
- [ ] App se puede instalar en móvil
- [ ] Service Worker se registra
- [ ] Assets se cachean
- [ ] Funciona offline completamente
- [ ] Crear paciente offline
- [ ] Crear receta offline
- [ ] Generar PDF offline
- [ ] Datos persisten offline
- [ ] Manifest.json correcto
- [ ] Iconos se muestran correctamente

#### Casos de Prueba

**Caso 1: Instalación desktop**
- Navegador: Chrome
- Acción: Instalar PWA
- Esperado: App se instala y abre en ventana independiente
- Resultado: _Pendiente_

**Caso 2: Instalación móvil**
- Dispositivo: Android/iOS
- Acción: Instalar PWA desde navegador
- Esperado: Icono aparece en pantalla de inicio
- Resultado: _Pendiente_

**Caso 3: Funcionamiento offline completo**
- Acción: 
  1. Desconectar internet
  2. Crear paciente
  3. Crear receta
  4. Generar PDF
- Esperado: Todo funciona sin internet
- Resultado: _Pendiente_

**Caso 4: Persistencia offline**
- Acción:
  1. Crear datos offline
  2. Cerrar app
  3. Abrir app (aún offline)
- Esperado: Datos siguen disponibles
- Resultado: _Pendiente_

#### Resultados
```
Pendiente de ejecución
```

#### Problemas Encontrados
```
Ninguno aún
```

---

## Fase 10: Pruebas Finales ⏳

### Fecha: _Pendiente_

#### Lighthouse Audit
```
Performance: _Pendiente_
Accessibility: _Pendiente_
Best Practices: _Pendiente_
SEO: _Pendiente_
PWA: _Pendiente_
```

#### Navegadores Probados
- [ ] Chrome (versión: ___)
- [ ] Firefox (versión: ___)
- [ ] Safari (versión: ___)
- [ ] Edge (versión: ___)

#### Dispositivos Probados
- [ ] Desktop Windows
- [ ] Desktop Mac
- [ ] Android (modelo: ___)
- [ ] iOS (modelo: ___)

#### Flujo Completo End-to-End

**Escenario: Médico nuevo usando la app por primera vez**

1. [ ] Abrir app por primera vez
2. [ ] Configurar datos del médico
3. [ ] Crear 3 pacientes
4. [ ] Crear receta para paciente 1 (1 medicamento)
5. [ ] Crear receta para paciente 2 (3 medicamentos)
6. [ ] Generar PDF de receta 1
7. [ ] Imprimir receta 2
8. [ ] Buscar paciente
9. [ ] Editar paciente
10. [ ] Ver historial de paciente
11. [ ] Ver dashboard
12. [ ] Desconectar internet
13. [ ] Crear nueva receta offline
14. [ ] Generar PDF offline
15. [ ] Reconectar internet
16. [ ] Verificar que todo sigue funcionando

**Resultado**: _Pendiente_

#### Problemas Encontrados
```
Ninguno aún
```

---

## Resumen de Pruebas

### Estadísticas
- Total de fases: 10
- Fases completadas: 0
- Fases en progreso: 0
- Fases pendientes: 10

### Problemas Críticos
```
Ninguno aún
```

### Problemas Menores
```
Ninguno aún
```

### Mejoras Sugeridas
```
Pendiente de pruebas
```

---

## Notas

- Este documento se actualizará después de cada fase
- Cada prueba debe documentarse con fecha y resultados
- Los problemas deben reportarse inmediatamente
- Las capturas de pantalla se guardarán en `/docs/screenshots/`
