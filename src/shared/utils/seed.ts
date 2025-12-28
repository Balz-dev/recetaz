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

/**
 * Genera datos de ejemplo para el médico
 */
function generarMedicoConfig(): MedicoConfig {
    const now = new Date();
    return {
        id: 'default',
        nombre: 'Dr. Juan Carlos Pérez González',
        especialidad: 'Medicina General',
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
    const calles = ['Av. Reforma', 'Calle Morelos', 'Av. Juárez', 'Calle Insurgentes', 'Av. Universidad', 'Calle Hidalgo', 'Av. Revolución', 'Calle Madero'];
    const colonias = ['Centro', 'Roma', 'Condesa', 'Del Valle', 'San Ángel', 'Polanco', 'Juárez', 'Narvarte', 'Coyoacán', 'Pedregal'];
    const antecedentesOpts = ['Ninguno', 'Hipertensión', 'Diabetes', 'Asma', 'Gastritis', 'Ninguno', 'Ninguno', 'Alergia estacional'];

    const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

    for (let i = 0; i < 50; i++) {
        const primerNombre = getRandomItem(nombres);
        const segundoNombre = Math.random() > 0.5 ? getRandomItem(nombres) : '';
        const apellidoPaterno = getRandomItem(apellidos);
        const apellidoMaterno = getRandomItem(apellidos);
        const nombreCompleto = [primerNombre, segundoNombre, apellidoPaterno, apellidoMaterno].filter(Boolean).join(' ');

        const edad = Math.floor(Math.random() * 80) + 5;
        const direccion = `${getRandomItem(calles)} ${Math.floor(Math.random() * 900) + 1}, Col. ${getRandomItem(colonias)}`;
        const diasAntiguedad = Math.floor(Math.random() * 365);
        const fechaRegistro = new Date(now.getTime() - diasAntiguedad * 24 * 60 * 60 * 1000);

        pacientes.push({
            id: uuidv4(),
            nombre: nombreCompleto,
            edad: edad,
            direccion: direccion,
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
function generarRecetas(pacientes: Paciente[]): Receta[] {
    const now = new Date();
    const recetas: Receta[] = [];

    const diagnosticos = [
        { dx: 'Hipertensión arterial sistémica', med1: 'Losartán 50mg', med2: 'Hidroclorotiazida 12.5mg', ind: 'Control diario de PA. Dieta baja en sodio.' },
        { dx: 'Diabetes mellitus tipo 2', med1: 'Metformina 850mg', med2: 'Glibenclamida 5mg', ind: 'Dieta baja en carbohidratos. Ejercicio regular.' },
        { dx: 'Infección respiratoria aguda', med1: 'Amoxicilina 500mg', med2: 'Paracetamol 500mg', ind: 'Abundantes líquidos. Reposo.' },
        { dx: 'Gastritis aguda', med1: 'Omeprazol 20mg', med2: 'Melox 10ml', ind: 'Evitar irritantes, café y alcohol.' },
        { dx: 'Colitis nerviosa', med1: 'Bromuro de Pinaverio 100mg', med2: 'Simeticona 40mg', ind: 'Reducir estrés. Comer despacio.' },
        { dx: 'Cefalea tensional', med1: 'Ibuprofeno 400mg', med2: '', ind: 'Reposo en lugar oscuro y silencioso.' },
        { dx: 'Dermatitis atópica', med1: 'Loratadina 10mg', med2: 'Betametasona crema', ind: 'No rascar. Usar ropa de algodón.' },
        { dx: 'Control de Niño Sano', med1: 'Multivitamínico Pediátrico', med2: '', ind: 'Alimentación balanceada. Vacunación al día.' },
        { dx: 'Lumbalgia mecánica', med1: 'Naproxeno 500mg', med2: 'Complejo B', ind: 'Evitar cargar objetos pesados. Higiene de columna.' },
        { dx: 'Faringoamigdalitis', med1: 'Penicilina Procainica 800,000 UI', med2: 'Ibuprofeno 400mg', ind: 'Completar esquema de antibiótico.' }
    ];

    const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

    let recetaCounter = 1;

    pacientes.forEach(paciente => {
        // Regla: Entre 1 y 5 recetas por paciente
        const numRecetas = getRandomInt(1, 5);

        for (let i = 0; i < numRecetas; i++) {
            // Fechas entre el 21 y 27 de Diciembre de 2025
            const dia = getRandomInt(21, 27);
            // Horario aleatorio de consulta (9:00 - 19:59)
            const hora = getRandomInt(9, 19);
            const minuto = getRandomInt(0, 59);

            // Nota: Mes 11 es Diciembre en Javascript
            const fecha = new Date(2025, 11, dia, hora, minuto);
            const dxData = getRandomItem(diagnosticos);

            const medicamentos = [];

            // Primer medicamento
            medicamentos.push({
                id: uuidv4(),
                nombre: dxData.med1.split(' ')[0],
                dosis: dxData.med1.split(' ').slice(1).join(' '),
                frecuencia: 'Cada ' + getRandomItem(['8', '12', '24']) + ' horas',
                duracion: getRandomItem(['3', '5', '7', '15', '30']) + ' días',
                indicaciones: 'Oral'
            });

            // Segundo medicamento (opcional)
            if (dxData.med2) {
                medicamentos.push({
                    id: uuidv4(),
                    nombre: dxData.med2.split(' ')[0],
                    dosis: dxData.med2.split(' ').slice(1).join(' '),
                    frecuencia: 'Cada ' + getRandomItem(['8', '12', '24']) + ' horas',
                    duracion: getRandomItem(['3', '5', '7', '15', '30']) + ' días',
                    indicaciones: 'Oral'
                });
            }

            recetas.push({
                id: uuidv4(),
                numeroReceta: recetaCounter.toString().padStart(4, '0'),
                pacienteId: paciente.id,
                pacienteNombre: paciente.nombre,
                pacienteEdad: paciente.edad || 0,
                peso: paciente.peso,
                talla: paciente.talla,
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
        if (receta.fechaEmision >= hace7Dias) {
            movimientos.push({
                id: uuidv4(),
                tipo: 'ingreso',
                categoria: 'consulta',
                concepto: `Consulta - ${receta.pacienteNombre}`,
                monto: costoConsulta,
                fecha: receta.fechaEmision,
                createdAt: receta.fechaEmision
            });
        }
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
function generarConfiguracionFinanciera(): ConfiguracionFinanciera {
    return {
        id: 'default',
        costoConsulta: 500,
        updatedAt: new Date()
    };
}

/**
 * Función principal que ejecuta el seed en el navegador
 * 
 * @returns Promise que se resuelve cuando el seed se completa exitosamente
 */
export async function seedDatabase(): Promise<void> {
    try {
        console.log('🌱 Iniciando población de base de datos...\n');

        // Limpiar datos existentes
        console.log('🧹 Limpiando datos existentes...');
        await db.medico.clear();
        await db.pacientes.clear();
        await db.recetas.clear();
        await db.finanzas.clear();
        await db.configuracionFinanciera.clear();
        console.log('✅ Datos limpiados\n');

        // Insertar configuración del médico
        console.log('👨‍⚕️ Insertando configuración del médico...');
        const medico = generarMedicoConfig();
        await db.medico.add(medico);
        console.log(`✅ Médico: ${medico.nombre}\n`);

        // Insertar pacientes
        console.log('👥 Insertando pacientes...');
        const pacientes = generarPacientes();
        await db.pacientes.bulkAdd(pacientes);
        console.log(`✅ ${pacientes.length} pacientes insertados\n`);

        // Insertar recetas
        console.log('📋 Insertando recetas...');
        const recetas = generarRecetas(pacientes);
        await db.recetas.bulkAdd(recetas);
        console.log(`✅ ${recetas.length} recetas insertadas\n`);

        // Insertar movimientos financieros
        console.log('💰 Insertando movimientos financieros...');
        const movimientos = generarMovimientosFinancieros(recetas);
        await db.finanzas.bulkAdd(movimientos);
        console.log(`✅ ${movimientos.length} movimientos financieros insertados\n`);

        // Insertar configuración financiera
        console.log('⚙️ Insertando configuración financiera...');
        const configFinanciera = generarConfiguracionFinanciera();
        await db.configuracionFinanciera.add(configFinanciera);
        console.log(`✅ Costo de consulta: $${configFinanciera.costoConsulta}.00 MXN\n`);

        console.log('🎉 ¡Base de datos poblada exitosamente!\n');
        console.log('📊 Resumen:');
        console.log(`   - 1 médico configurado`);
        console.log(`   - ${pacientes.length} pacientes`);
        console.log(`   - ${recetas.length} recetas`);
        console.log(`   - ${movimientos.length} movimientos financieros`);

        // Insertar plantillas predeterminadas
        console.log('📄 Insertando plantillas...');
        const plantillas = generarPlantillas();
        await db.plantillas.bulkAdd(plantillas);
        console.log(`✅ ${plantillas.length} plantillas insertadas\n`);

        console.log(`   - ${plantillas.length} plantillas configuradas`);
        console.log(`   - Configuración financiera establecida\n`);
        console.log('🔄 Recarga la página para ver los cambios');
    } catch (error) {
        console.error('❌ Error al poblar la base de datos:', error);
        throw error;
    }
}
