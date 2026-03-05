/**
 * @fileoverview Funciones de Seed para Base de Datos del Navegador
 * 
 * Este módulo proporciona funciones para poblar la base de datos IndexedDB
 * directamente desde el navegador. A diferencia del script de Node.js,
 * estas funciones operan en el IndexedDB real del navegador.
 */

import { db } from '@/shared/db/db.config';
import { v4 as uuidv4 } from 'uuid';
import type { MedicoConfig, Paciente, Receta, MovimientoFinanciero, ConfiguracionFinanciera, Medicamento, PlantillaReceta } from '@/types';
import { catalogoMedicamentosInicial } from './seeds/medicamentos-data';
import type { MedicamentoCatalogo } from '@/types';

/**
 * Genera una fecha relativa para datos demo.
 * Distribuye los datos de forma que siempre haya actividad "hoy", "esta semana" y "este año".
 */
function generarFechaDemo(): Date {
    const ahora = new Date();
    const azar = Math.random();

    // Distribución equilibrada para que todas las vistas tengan datos interesantes
    if (azar > 0.9) {
        // 10% son de HOY o AYER (Vista Semanal/Día activa)
        return new Date(ahora.getTime() - Math.floor(Math.random() * 1.5 * 24 * 60 * 60 * 1000));
    } else if (azar > 0.7) {
        // 20% son de este MES (Vista Mensual activa)
        return new Date(ahora.getTime() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
    } else {
        // 70% son del resto del AÑO (Vista Anual activa y bien poblada)
        return new Date(ahora.getTime() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000));
    }
}

/**
 * Genera datos de ejemplo para el médico
 */
function generarMedicoConfig(): MedicoConfig {
    const now = new Date();
    return {
        id: 'default',
        nombre: 'Juan Carlos Pérez González',
        especialidad: 'Medicina General',
        especialidadKey: 'general',
        cedula: '1234567',
        telefono: '55-1234-5678',
        direccion: 'Av. Reforma 123, Col. Centro, CDMX, C.P. 06000',
        createdAt: now,
        updatedAt: now
    };
}

/**
 * Genera datos de ejemplo para pacientes
 */
function generarPacientes(): Paciente[] {
    const now = new Date();
    const pacientes: Paciente[] = [];

    const nombres = ['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Laura', 'Roberto', 'Diana', 'Miguel', 'Patricia', 'José', 'Sofía', 'Alejandro', 'Carolina', 'Ángel', 'Elena', 'Alberto', 'Teresa', 'David', 'Gabriela', 'Fernando', 'Mónica', 'Jorge', 'Adriana', 'Ricardo', 'Verónica', 'Manuel', 'Silvia', 'Francisco', 'Elizabeth', 'Antonio', 'Martha', 'Daniel', 'Rosa', 'Pablo', 'Andrea', 'Jesús', 'Lucía', 'Pedro', 'Yolanda'];
    const apellidos = ['Pérez', 'González', 'Rodríguez', 'López', 'Martínez', 'Sánchez', 'Hernández', 'Cruz', 'García', 'Ramírez', 'Mendoza', 'Torres', 'Flores', 'Díaz', 'Ruiz', 'Morales', 'Ortiz', 'Vargas', 'Castillo', 'Romero', 'Álvarez', 'Castro', 'Méndez', 'Guzmán', 'Herrera', 'Aguilar', 'Delgado', 'Jiménez', 'Moreno', 'Chávez', 'Ramos', 'Rivera', 'Juárez', 'Reyes'];
    const antecedentesOpts = ['Ninguno', 'Hipertensión', 'Diabetes', 'Asma', 'Gastritis', 'Ninguno', 'Ninguno', 'Alergia estacional'];

    const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

    for (let i = 0; i < 100; i++) {
        const primerNombre = getRandomItem(nombres);
        const segundoNombre = Math.random() > 0.5 ? getRandomItem(nombres) : '';
        const apellidoPaterno = getRandomItem(apellidos);
        const apellidoMaterno = getRandomItem(apellidos);
        const nombreCompleto = [primerNombre, segundoNombre, apellidoPaterno, apellidoMaterno].filter(Boolean).join(' ');

        const edad = Math.floor(Math.random() * 80) + 5;
        const diasAntiguedad = Math.floor(Math.random() * 365);
        const fechaRegistro = new Date(now.getTime() - diasAntiguedad * 24 * 60 * 60 * 1000);

        pacientes.push({
            id: uuidv4(),
            nombre: nombreCompleto,
            edad: edad,
            alergias: Math.random() > 0.7 ? 'Penicilina' : '',
            antecedentes: getRandomItem(antecedentesOpts),
            peso: `${Math.floor(Math.random() * 40) + 50} kg`,
            talla: `1.${Math.floor(Math.random() * 40) + 50} m`,
            createdAt: fechaRegistro,
            updatedAt: fechaRegistro
        });
    }

    return pacientes;
}

/**
 * Genera recetas de ejemplo para los pacientes
 */
/**
 * Genera recetas de ejemplo para los pacientes
 */
function generarRecetas(pacientes: Paciente[], especialidad: string = 'general'): Receta[] {
    const recetas: Receta[] = [];

    const diagnosticos = [
        { dx: 'Hipertensión arterial sistémica', med1: 'Losartán', med2: 'Hidroclorotiazida', ind: 'Control diario de PA. Dieta baja en sodio.', esp: 'cardiologia' },
        { dx: 'Insuficiencia cardíaca congestiva', med1: 'Enalapril', med2: 'Furosemida', ind: 'Restricción de líquidos. Vigilancia de edemas.', esp: 'cardiologia' },
        { dx: 'Arritmia cardíaca', med1: 'Amiodarona', med2: 'Aspirina', ind: 'Toma de pulso diaria. Reposo relativo.', esp: 'cardiologia' },
        { dx: 'Infarto agudo al miocardio (Seguimiento)', med1: 'Atorvastatina', med2: 'Clopidogrel', ind: 'Dieta cardioprotectora. No esfuerzos.', esp: 'cardiologia' },
        { dx: 'Diabetes mellitus tipo 2', med1: 'Metformina', med2: 'Glibenclamida', ind: 'Dieta baja en carbohidratos. Ejercicio regular.', esp: 'general' },
        { dx: 'Infección respiratoria aguda', med1: 'Amoxicilina', med2: 'Paracetamol', ind: 'Abundantes líquidos. Reposo.', esp: 'general' },
        { dx: 'Gastritis aguda', med1: 'Omeprazol', med2: 'Butilhioscina', ind: 'Evitar irritantes, café y alcohol.', esp: 'general' },
        { dx: 'Faringoamigdalitis', med1: 'Ceftriaxona', med2: 'Ibuprofeno', ind: 'Completar esquema de antibiótico.', esp: 'general' }
    ];

    const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

    let recetaCounter = 1;

    // Helper para buscar medicamento en la data semillada
    const buscarMedicamento = (nombre: string): typeof catalogoMedicamentosInicial[0] | undefined => {
        return catalogoMedicamentosInicial.find(m =>
            m.nombreGenerico?.toLowerCase().includes(nombre.toLowerCase()) ||
            m.nombre.toLowerCase().includes(nombre.toLowerCase())
        );
    };

    pacientes.forEach(paciente => {
        // Regla: Entre 3 y 10 recetas por paciente para una demo robusta
        const numRecetas = getRandomInt(3, 10);

        for (let i = 0; i < numRecetas; i++) {
            const fecha = generarFechaDemo();
            // Filtrar diagnósticos por especialidad con mayor peso
            const dxEspecializados = diagnosticos.filter(d => d.esp === especialidad);
            const dxGenerales = diagnosticos.filter(d => d.esp === 'general');

            // 100% probabilidad de especialidad si existe y no es general
            const usarEspecialidad = especialidad !== 'general' && dxEspecializados.length > 0;
            const dxData = getRandomItem(usarEspecialidad ? dxEspecializados : dxGenerales);

            const medicamentos: Medicamento[] = [];

            // Función interna para agregar medicamento procesado
            const agregarMed = (nombreBusqueda: string) => {
                if (!nombreBusqueda) return;

                const medData = buscarMedicamento(nombreBusqueda);

                if (medData) {
                    medicamentos.push({
                        id: uuidv4(),
                        nombre: medData.nombre,
                        nombreGenerico: medData.nombreGenerico,
                        concentracion: medData.concentracion,
                        presentacion: medData.presentacion,
                        formaFarmaceutica: medData.formaFarmaceutica,
                        cantidadSurtir: medData.cantidadSurtirDefault || '',
                        dosis: medData.dosisDefault || '',
                        frecuencia: medData.frecuenciaDefault || '',
                        viaAdministracion: medData.viaAdministracionDefault || '',
                        duracion: medData.duracionDefault || '',
                        indicaciones: medData.indicacionesDefault || ''
                    });
                } else {
                    // Fallback para medicamentos no encontrados en el catálogo nuevo
                    medicamentos.push({
                        id: uuidv4(),
                        nombre: nombreBusqueda,
                        dosis: '1 tableta', // Default
                        frecuencia: 'Cada 8 horas',
                        duracion: '5 días',
                        indicaciones: 'Oral'
                    });
                }
            };

            agregarMed(dxData.med1);
            if (dxData.med2) agregarMed(dxData.med2);

            recetas.push({
                id: uuidv4(),
                numeroReceta: recetaCounter.toString().padStart(4, '0'),
                pacienteId: paciente.id,
                pacienteNombre: paciente.nombre,
                pacienteEdad: paciente.edad || 0,
                peso: paciente.peso,
                talla: paciente.talla,
                // Datos dinámicos para cardiología
                datosEspecificos: especialidad === 'cardiologia' ? {
                    ta_brazo_der: `${getRandomInt(110, 140)}/${getRandomInt(70, 95)}`,
                    ta_brazo_izq: `${getRandomInt(110, 140)}/${getRandomInt(70, 95)}`,
                    fc: getRandomInt(60, 100),
                    fr: getRandomInt(12, 20),
                    saturacion: getRandomInt(95, 100)
                } : {},
                diagnostico: dxData.dx,
                medicamentos: medicamentos,
                instrucciones: dxData.ind,
                fechaEmision: fecha,
                createdAt: fecha,
                updatedAt: fecha
            });
            recetaCounter++;
        }
    });

    // Ordenar por fecha descendente
    return recetas.sort((a, b) => b.fechaEmision.getTime() - a.fechaEmision.getTime());
}

/**
 * Genera movimientos financieros basados en las recetas
 */
function generarMovimientosFinancieros(recetas: Receta[]): MovimientoFinanciero[] {
    const movimientos: MovimientoFinanciero[] = [];
    const costoConsulta = 500;

    // Generar ingresos por consultas (basados en las recetas de los últimos 7 días)
    const ahora = new Date();
    const hace7Dias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);

    recetas.forEach(receta => {
        // En Demo generamos movimientos para todas las recetas para poblar las gráficas anuales/mensuales
        movimientos.push({
            id: uuidv4(),
            tipo: 'ingreso',
            categoria: 'consulta',
            concepto: `Consulta - ${receta.pacienteNombre}`,
            monto: costoConsulta,
            fecha: receta.fechaEmision,
            createdAt: receta.fechaEmision
        });
    });

    // Agregar algunos gastos operativos de ejemplo
    movimientos.push({
        id: uuidv4(),
        tipo: 'gasto',
        categoria: 'operacion',
        concepto: 'Material de curación',
        monto: 350,
        fecha: new Date(ahora.getTime() - 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(ahora.getTime() - 5 * 24 * 60 * 60 * 1000)
    });

    movimientos.push({
        id: uuidv4(),
        tipo: 'gasto',
        categoria: 'operacion',
        concepto: 'Papelería y recetarios',
        monto: 200,
        fecha: new Date(ahora.getTime() - 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(ahora.getTime() - 3 * 24 * 60 * 60 * 1000)
    });

    movimientos.push({
        id: uuidv4(),
        tipo: 'gasto',
        categoria: 'operacion',
        concepto: 'Limpieza de consultorio',
        monto: 400,
        fecha: new Date(ahora.getTime() - 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(ahora.getTime() - 2 * 24 * 60 * 60 * 1000)
    });

    return movimientos;
}

/**
 * Genera plantillas de recetas predeterminadas
 */
function generarPlantillas(): PlantillaReceta[] {
    const now = new Date();

    // Imagen base64 simplificada para demo (usar URL relativa en producción real si se prefiere)
    // Para este caso, asumimos que obtendrá la imagen de /membrete-demo.png    // NOTA: En una implementación real de Dexie con imágenes de fondo, 
    // idealmente convertimos la imagen a Base64. 
    // Como esto es un seed síncrono/rápido, dejaremos el campo imagenFondo vacío
    // o con un placeholder, ya que la lógica de impresión suele requerir Base64.
    // Sin embargo, para cumplir con el requerimiento de "ya configurados",
    // simularemos que la imagen ya fue cargada.

    return [
        {
            id: uuidv4(),
            nombre: 'Carta Completa - Membretada',
            tamanoPapel: 'carta',
            activa: true,
            imprimirFondo: true,
            imagenFondo: '/membrete-demo.png', // Referencia a la imagen en public
            createdAt: now,
            updatedAt: now,
            campos: [
                { id: 'fecha', etiqueta: 'Fecha', x: 75, y: 15, ancho: 20, visible: true, tipo: 'fecha' },
                { id: 'paciente_nombre', etiqueta: 'Paciente', x: 10, y: 22, ancho: 60, visible: true, tipo: 'texto' },
                { id: 'paciente_edad', etiqueta: 'Edad', x: 75, y: 22, ancho: 10, visible: true, tipo: 'texto' },
                { id: 'diagnostico', etiqueta: 'Diagnóstico', x: 10, y: 28, ancho: 80, visible: true, tipo: 'texto' },
                { id: 'cuerpo_receta', etiqueta: 'Receta Médica', x: 10, y: 35, ancho: 80, alto: 40, visible: true, tipo: 'lista' }
            ]
        },
        {
            id: uuidv4(),
            nombre: 'Media Carta - Económica',
            tamanoPapel: 'media_carta',
            activa: false,
            imprimirFondo: true,
            imagenFondo: '/membrete-demo.png',
            createdAt: now,
            updatedAt: now,
            campos: [
                { id: 'fecha', etiqueta: 'Fecha', x: 70, y: 12, ancho: 25, visible: true, tipo: 'fecha' },
                { id: 'paciente_nombre', etiqueta: 'Paciente', x: 5, y: 18, ancho: 60, visible: true, tipo: 'texto' },
                { id: 'cuerpo_receta', etiqueta: 'Receta', x: 5, y: 25, ancho: 90, alto: 60, visible: true, tipo: 'lista' }
            ]
        }
    ];
}

/**
 * Genera la configuración financiera
 */
export function generarConfiguracionFinanciera(): ConfiguracionFinanciera {
    return {
        id: 'default',
        costoConsulta: 500,
        updatedAt: new Date()
    };
}

/**
 * Función principal que ejecuta el seed en el navegador
 * 
 * @param isDemo - Si es true, añade datos ficticios (pacientes, recetas, etc.).
 * @returns Promise que se resuelve cuando el seed se completa exitosamente
 */
export async function seedDatabase(isDemo: boolean = false, especialidad: string = 'general', extraData?: any): Promise<void> {
    try {
        console.log(`🌱 Iniciando población de base de datos (${isDemo ? 'MODO DEMO' : 'MODO REAL'})...\n`);

        // Limpiar datos existentes (Solo médico, pacientes y recetas para evitar pérdida de catálogos si ya existen)
        // En una instalación desde cero, todo estará vacío.
        console.log('🧹 Limpiando datos previo a inicialización...');
        await db.medico.clear();
        await db.pacientes.clear();
        await db.recetas.clear();
        await db.finanzas.clear();
        await db.configuracionFinanciera.clear();
        await db.plantillas.clear();
        await db.medicamentos.clear();
        await db.diagnosticos.clear();
        await db.especialidades.clear();
        await db.tratamientosHabituales.clear();
        console.log('✅ Tablas base limpiadas\n');

        if (isDemo) {
            // Insertar configuración del médico ficticio
            const medicoBase = generarMedicoConfig();
            // Extraer datos del doctor del preset de forma robusta
            const doctorData = extraData?.doctor || extraData;

            // Helper para obtener y capitalizar etiquetas correctamente (ej. cardiologia -> Cardiología)
            const obtenerEtiquetaEspecialidad = (key: string): string => {
                const etiquetas: Record<string, string> = {
                    'cardiologia': 'Cardiología',
                    'pediatria': 'Pediatría',
                    'ginecologia': 'Ginecología y Obstetricia',
                    'oftalmologia': 'Oftalmología',
                    'traumatologia': 'Traumatología y Ortopedia',
                    'saludMental': 'Psicología / Psiquiatría',
                    'general': 'Medicina General / Familiar'
                };

                // Si está en el mapeo, devolver tal cual
                if (key && etiquetas[key]) return etiquetas[key];

                if (!key) return 'Medicina General';

                // Si no, capitalizar y limpiar (reemplazar guiones por espacios)
                const label = key.replace(/([A-Z])/g, ' $1') // para saludMental -> Salud Mental
                    .replace(/[_-]/g, ' ')
                    .trim();
                return label.charAt(0).toUpperCase() + label.slice(1);
            };

            const especialidadKeyFinal = doctorData?.especialidadKey || (especialidad !== 'general' ? especialidad : medicoBase.especialidadKey);

            // Fundimentación de datos del médico con prioridad absoluta al JSON
            const medicoFinal: MedicoConfig = {
                id: 'default',
                nombre: String(doctorData?.nombre || medicoBase.nombre),
                cedula: String(doctorData?.cedula || medicoBase.cedula),
                telefono: String(doctorData?.telefono || medicoBase.telefono),
                direccion: String(doctorData?.direccion || medicoBase.direccion || ''),
                especialidadKey: String(especialidadKeyFinal),
                especialidad: String(doctorData?.especialidad || obtenerEtiquetaEspecialidad(especialidadKeyFinal)),
                createdAt: medicoBase.createdAt || new Date(),
                updatedAt: new Date()
            };

            console.log('👨‍⚕️ [DEMO] Guardando médico final en DB:', JSON.stringify(medicoFinal));
            try {
                await db.medico.put(medicoFinal);
                console.log('✅ Médico guardado exitosamente.');
            } catch (err) {
                console.error('❌ Error guardando médico:', err);
            }
            console.log(`✅ Médico: ${medicoFinal.nombre} (${medicoFinal.especialidadKey})\n`);

            // Insertar pacientes ficticios
            console.log('👥 [DEMO] Insertando pacientes...');
            const pacientes = generarPacientes();
            await db.pacientes.bulkAdd(pacientes);
            console.log(`✅ ${pacientes.length} pacientes insertados\n`);

            // Insertar recetas ficticias
            console.log(`📋 [DEMO] Insertando recetas para especialidad: ${especialidad}...`);
            const recetas = generarRecetas(pacientes, especialidad);
            await db.recetas.bulkAdd(recetas);
            console.log(`✅ ${recetas.length} recetas insertadas\n`);

            // Insertar movimientos financieros ficticios
            console.log('💰 [DEMO] Insertando movimientos financieros...');
            const movimientos = generarMovimientosFinancieros(recetas);
            await db.finanzas.bulkAdd(movimientos);
            console.log(`✅ ${movimientos.length} movimientos financieros insertados\n`);
        }

        // --- DATOS COMUNES Y CATÁLOGOS (DEMO Y REAL) ---
        // Delegamos la carga de catálogos base al servicio de sincronización
        console.log('🏥 Sincronizando catálogos base y operativos...');
        const { catalogSyncService } = await import('@/shared/services/catalog-sync.service');
        await catalogSyncService.syncAll();

        console.log('🎉 ¡Base de datos inicializada correctamente!\n');

        if (isDemo) {
            console.log('📊 Resumen Demo:');
            console.log(`   - 1 médico configurado`);
            console.log(`   - 50 pacientes`);
            console.log(`   - Historial de recetas y finanzas activo`);
        } else {
            console.log('🚀 Entorno operativo listo para su uso.');
        }

    } catch (error) {
        console.error('❌ Error al poblar la base de datos:', error);
        throw error;
    }
}
