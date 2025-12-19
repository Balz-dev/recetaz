/**
 * @fileoverview Funciones de Seed para Base de Datos del Navegador
 * 
 * Este módulo proporciona funciones para poblar la base de datos IndexedDB
 * directamente desde el navegador. A diferencia del script de Node.js,
 * estas funciones operan en el IndexedDB real del navegador.
 */

import { db } from '@/shared/db/db.config';
import { v4 as uuidv4 } from 'uuid';
import type { MedicoConfig, Paciente, Receta, MovimientoFinanciero, ConfiguracionFinanciera, Medicamento, PlantillaReceta, MedicamentoCatalogo } from '@/types';

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

    return [
        {
            id: uuidv4(),
            nombre: 'María Elena Rodríguez López',
            edad: 45,
            direccion: 'Calle Morelos 45, Col. Centro',
            alergias: 'Penicilina',
            antecedentes: 'Hipertensión arterial controlada',
            peso: '72 kg',
            talla: '1.65 m',
            createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        },
        {
            id: uuidv4(),
            nombre: 'Carlos Alberto Martínez Sánchez',
            edad: 62,
            direccion: 'Av. Juárez 789, Col. Roma',
            alergias: '',
            antecedentes: 'Diabetes tipo 2, dislipidemia',
            createdAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000)
        },
        {
            id: uuidv4(),
            nombre: 'Ana Patricia Hernández Cruz',
            edad: 28,
            direccion: 'Calle Insurgentes 234, Col. Condesa',
            alergias: 'Aspirina',
            antecedentes: 'Ninguno',
            createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000)
        },
        {
            id: uuidv4(),
            nombre: 'José Luis García Ramírez',
            edad: 55,
            direccion: 'Av. Universidad 567, Col. Del Valle',
            alergias: '',
            antecedentes: 'Gastritis crónica',
            createdAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000)
        },
        {
            id: uuidv4(),
            nombre: 'Laura Sofía Mendoza Torres',
            edad: 8,
            direccion: 'Calle Hidalgo 12, Col. Centro',
            alergias: '',
            antecedentes: 'Asma leve',
            createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
        },
        {
            id: uuidv4(),
            nombre: 'Roberto Alejandro Flores Díaz',
            edad: 72,
            direccion: 'Av. Revolución 890, Col. San Ángel',
            alergias: 'Sulfonamidas',
            antecedentes: 'Hipertensión, arritmia cardiaca',
            createdAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000)
        },
        {
            id: uuidv4(),
            nombre: 'Diana Carolina Ruiz Morales',
            edad: 35,
            direccion: 'Calle Madero 345, Col. Polanco',
            alergias: '',
            antecedentes: 'Migraña crónica',
            createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
        },
        {
            id: uuidv4(),
            nombre: 'Miguel Ángel Ortiz Vargas',
            edad: 19,
            direccion: 'Av. Chapultepec 678, Col. Juárez',
            alergias: '',
            antecedentes: 'Ninguno',
            createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
        }
    ];
}

/**
 * Genera recetas de ejemplo para los pacientes
 */
function generarRecetas(pacientes: Paciente[]): Receta[] {
    const now = new Date();
    const recetas: Receta[] = [];

    // Receta 1: María Elena - Hipertensión
    recetas.push({
        id: uuidv4(),
        numeroReceta: '0001',
        pacienteId: pacientes[0].id,
        pacienteNombre: pacientes[0].nombre,
        pacienteEdad: pacientes[0].edad || 0,
        peso: '72 kg',
        talla: '1.65 m',
        diagnostico: 'Hipertensión arterial sistémica',
        medicamentos: [
            {
                id: uuidv4(),
                nombre: 'Losartán',
                dosis: '50 mg',
                frecuencia: 'Cada 24 horas',
                duracion: '30 días',
                indicaciones: 'Tomar en ayunas'
            }
        ],
        instrucciones: 'Control de presión arterial diario. Dieta baja en sodio.',
        fechaEmision: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    });

    // Receta 2: Carlos Alberto - Diabetes
    recetas.push({
        id: uuidv4(),
        numeroReceta: '0002',
        pacienteId: pacientes[1].id,
        pacienteNombre: pacientes[1].nombre,
        pacienteEdad: pacientes[1].edad || 0,
        peso: '85 kg',
        talla: '1.78 m',
        diagnostico: 'Diabetes mellitus tipo 2',
        medicamentos: [
            {
                id: uuidv4(),
                nombre: 'Metformina',
                dosis: '850 mg',
                frecuencia: 'Cada 12 horas',
                duracion: '30 días',
                indicaciones: 'Tomar con alimentos'
            },
            {
                id: uuidv4(),
                nombre: 'Glibenclamida',
                dosis: '5 mg',
                frecuencia: 'Cada 24 horas',
                duracion: '30 días',
                indicaciones: 'Tomar antes del desayuno'
            }
        ],
        instrucciones: 'Monitoreo de glucosa en ayunas. Dieta para diabético.',
        fechaEmision: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
    });

    // Receta 3: Ana Patricia - Infección respiratoria
    recetas.push({
        id: uuidv4(),
        numeroReceta: '0003',
        pacienteId: pacientes[2].id,
        pacienteNombre: pacientes[2].nombre,
        pacienteEdad: pacientes[2].edad || 0,
        diagnostico: 'Infección de vías respiratorias superiores',
        medicamentos: [
            {
                id: uuidv4(),
                nombre: 'Amoxicilina',
                dosis: '500 mg',
                frecuencia: 'Cada 8 horas',
                duracion: '7 días',
                indicaciones: 'Completar tratamiento'
            },
            {
                id: uuidv4(),
                nombre: 'Paracetamol',
                dosis: '500 mg',
                frecuencia: 'Cada 6 horas',
                duracion: '5 días',
                indicaciones: 'En caso de fiebre o dolor'
            }
        ],
        instrucciones: 'Reposo relativo. Abundantes líquidos.',
        fechaEmision: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
    });

    // Receta 4: José Luis - Gastritis
    recetas.push({
        id: uuidv4(),
        numeroReceta: '0004',
        pacienteId: pacientes[3].id,
        pacienteNombre: pacientes[3].nombre,
        pacienteEdad: pacientes[3].edad || 0,
        diagnostico: 'Gastritis aguda',
        medicamentos: [
            {
                id: uuidv4(),
                nombre: 'Omeprazol',
                dosis: '20 mg',
                frecuencia: 'Cada 24 horas',
                duracion: '14 días',
                indicaciones: 'Tomar en ayunas'
            }
        ],
        instrucciones: 'Evitar irritantes gástricos. Dieta blanda.',
        fechaEmision: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
    });

    // Receta 5: Laura Sofía - Asma
    recetas.push({
        id: uuidv4(),
        numeroReceta: '0005',
        pacienteId: pacientes[4].id,
        pacienteNombre: pacientes[4].nombre,
        pacienteEdad: pacientes[4].edad || 0,
        diagnostico: 'Crisis asmática leve',
        medicamentos: [
            {
                id: uuidv4(),
                nombre: 'Salbutamol (inhalador)',
                dosis: '2 disparos',
                frecuencia: 'Cada 6 horas',
                duracion: '7 días',
                indicaciones: 'Usar con cámara espaciadora'
            }
        ],
        instrucciones: 'Evitar exposición a alérgenos. Acudir a urgencias si empeora.',
        fechaEmision: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    });

    // Receta 6: Roberto Alejandro - Arritmia
    recetas.push({
        id: uuidv4(),
        numeroReceta: '0006',
        pacienteId: pacientes[5].id,
        pacienteNombre: pacientes[5].nombre,
        pacienteEdad: pacientes[5].edad || 0,
        diagnostico: 'Fibrilación auricular',
        medicamentos: [
            {
                id: uuidv4(),
                nombre: 'Warfarina',
                dosis: '5 mg',
                frecuencia: 'Cada 24 horas',
                duracion: '30 días',
                indicaciones: 'Tomar a la misma hora'
            },
            {
                id: uuidv4(),
                nombre: 'Bisoprolol',
                dosis: '2.5 mg',
                frecuencia: 'Cada 24 horas',
                duracion: '30 días',
                indicaciones: 'Control de frecuencia cardiaca'
            }
        ],
        instrucciones: 'Control de INR mensual. Evitar alimentos ricos en vitamina K.',
        fechaEmision: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
    });

    // Receta 7: Diana Carolina - Migraña
    recetas.push({
        id: uuidv4(),
        numeroReceta: '0007',
        pacienteId: pacientes[6].id,
        pacienteNombre: pacientes[6].nombre,
        pacienteEdad: pacientes[6].edad || 0,
        diagnostico: 'Migraña con aura',
        medicamentos: [
            {
                id: uuidv4(),
                nombre: 'Sumatriptán',
                dosis: '50 mg',
                frecuencia: 'Al inicio de la crisis',
                duracion: '10 tabletas',
                indicaciones: 'No exceder 2 dosis en 24 horas'
            },
            {
                id: uuidv4(),
                nombre: 'Propranolol',
                dosis: '40 mg',
                frecuencia: 'Cada 12 horas',
                duracion: '30 días',
                indicaciones: 'Profilaxis'
            }
        ],
        instrucciones: 'Identificar y evitar desencadenantes. Reposo en lugar oscuro.',
        fechaEmision: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
    });

    // Receta 8: Miguel Ángel - Faringitis
    recetas.push({
        id: uuidv4(),
        numeroReceta: '0008',
        pacienteId: pacientes[7].id,
        pacienteNombre: pacientes[7].nombre,
        pacienteEdad: pacientes[7].edad || 0,
        diagnostico: 'Faringitis aguda',
        medicamentos: [
            {
                id: uuidv4(),
                nombre: 'Azitromicina',
                dosis: '500 mg',
                frecuencia: 'Cada 24 horas',
                duracion: '3 días',
                indicaciones: 'Tomar con alimentos'
            },
            {
                id: uuidv4(),
                nombre: 'Ibuprofeno',
                dosis: '400 mg',
                frecuencia: 'Cada 8 horas',
                duracion: '5 días',
                indicaciones: 'Para dolor e inflamación'
            }
        ],
        instrucciones: 'Gárgaras con agua tibia y sal. Evitar bebidas frías.',
        fechaEmision: now,
        createdAt: now,
        updatedAt: now
    });

    // Recetas adicionales para tener más datos
    // Receta 9: María Elena - Control
    recetas.push({
        id: uuidv4(),
        numeroReceta: '0009',
        pacienteId: pacientes[0].id,
        pacienteNombre: pacientes[0].nombre,
        pacienteEdad: pacientes[0].edad || 0,
        diagnostico: 'Control de hipertensión arterial',
        medicamentos: [
            {
                id: uuidv4(),
                nombre: 'Losartán',
                dosis: '50 mg',
                frecuencia: 'Cada 24 horas',
                duracion: '30 días',
                indicaciones: 'Tomar en ayunas'
            },
            {
                id: uuidv4(),
                nombre: 'Hidroclorotiazida',
                dosis: '12.5 mg',
                frecuencia: 'Cada 24 horas',
                duracion: '30 días',
                indicaciones: 'Tomar junto con Losartán'
            }
        ],
        instrucciones: 'Continuar con dieta hiposódica. Control mensual.',
        fechaEmision: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
    });

    // Receta 10: Carlos Alberto - Control
    recetas.push({
        id: uuidv4(),
        numeroReceta: '0010',
        pacienteId: pacientes[1].id,
        pacienteNombre: pacientes[1].nombre,
        pacienteEdad: pacientes[1].edad || 0,
        diagnostico: 'Control de diabetes mellitus tipo 2',
        medicamentos: [
            {
                id: uuidv4(),
                nombre: 'Metformina',
                dosis: '850 mg',
                frecuencia: 'Cada 12 horas',
                duracion: '30 días',
                indicaciones: 'Tomar con alimentos'
            },
            {
                id: uuidv4(),
                nombre: 'Atorvastatina',
                dosis: '20 mg',
                frecuencia: 'Cada 24 horas',
                duracion: '30 días',
                indicaciones: 'Tomar por la noche'
            }
        ],
        instrucciones: 'Laboratorios de control en 3 meses. Ejercicio regular.',
        fechaEmision: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000)
    });

    // Receta 11: Ana Patricia - Gripe
    recetas.push({
        id: uuidv4(),
        numeroReceta: '0011',
        pacienteId: pacientes[2].id,
        pacienteNombre: pacientes[2].nombre,
        pacienteEdad: pacientes[2].edad || 0,
        diagnostico: 'Síndrome gripal',
        medicamentos: [
            {
                id: uuidv4(),
                nombre: 'Paracetamol',
                dosis: '500 mg',
                frecuencia: 'Cada 6 horas',
                duracion: '5 días',
                indicaciones: 'Para fiebre y malestar'
            },
            {
                id: uuidv4(),
                nombre: 'Loratadina',
                dosis: '10 mg',
                frecuencia: 'Cada 24 horas',
                duracion: '5 días',
                indicaciones: 'Para congestión nasal'
            }
        ],
        instrucciones: 'Reposo. Abundantes líquidos. Lavado nasal con solución salina.',
        fechaEmision: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
    });

    // Receta 12: José Luis - Control gastritis
    recetas.push({
        id: uuidv4(),
        numeroReceta: '0012',
        pacienteId: pacientes[3].id,
        pacienteNombre: pacientes[3].nombre,
        pacienteEdad: pacientes[3].edad || 0,
        diagnostico: 'Gastritis crónica en control',
        medicamentos: [
            {
                id: uuidv4(),
                nombre: 'Omeprazol',
                dosis: '20 mg',
                frecuencia: 'Cada 24 horas',
                duracion: '30 días',
                indicaciones: 'Tomar 30 minutos antes del desayuno'
            }
        ],
        instrucciones: 'Evitar café, alcohol y picante. Comidas pequeñas y frecuentes.',
        fechaEmision: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000)
    });

    return recetas;
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
 * Genera el catálogo inicial de medicamentos
 */
function generarMedicamentos(): MedicamentoCatalogo[] {
    const now = new Date();
    const listaBase = [
        { nombre: "Paracetamol", nombreComercial: "Tempra", presentacion: "Tabletas", concentracion: "500 mg", instruccionesDefault: "Tomar 1 tableta cada 6-8 horas por 3 a 5 días si hay dolor o fiebre." },
        { nombre: "Ibuprofeno", nombreComercial: "Advil", presentacion: "Cápsulas", concentracion: "400 mg", instruccionesDefault: "Tomar 1 cápsula cada 8 horas con alimentos por 3 a 5 días." },
        { nombre: "Amoxicilina", nombreComercial: "Amoxil", presentacion: "Cápsulas", concentracion: "500 mg", instruccionesDefault: "Tomar 1 cápsula cada 8 horas por 7 días. Completar esquema." },
        { nombre: "Omeprazol", nombreComercial: "Losec", presentacion: "Cápsulas", concentracion: "20 mg", instruccionesDefault: "Tomar 1 cápsula en ayunas por 14 días." },
        { nombre: "Losartán", nombreComercial: "Cozaar", presentacion: "Tabletas", concentracion: "50 mg", instruccionesDefault: "Tomar 1 tableta cada 24 horas. Tratamiento continuo." },
        { nombre: "Metformina", nombreComercial: "Dabex", presentacion: "Tabletas", concentracion: "850 mg", instruccionesDefault: "Tomar 1 tableta cada 12 horas con alimentos." },
        { nombre: "Atorvastatina", nombreComercial: "Lipitor", presentacion: "Tabletas", concentracion: "20 mg", instruccionesDefault: "Tomar 1 tableta cada 24 horas por la noche." },
        { nombre: "Salbutamol", nombreComercial: "Ventolin", presentacion: "Suspensión en aerosol", concentracion: "100 mcg", instruccionesDefault: "2 disparos cada 6 horas por 5 días. Usar cámara espaciadora." },
        { nombre: "Glibenclamida", nombreComercial: "Daonil", presentacion: "Tabletas", concentracion: "5 mg", instruccionesDefault: "Tomar 1 tableta cada 24 horas antes del desayuno." },
        { nombre: "Loratadina", nombreComercial: "Clarityne", presentacion: "Tabletas", concentracion: "10 mg", instruccionesDefault: "Tomar 1 tableta cada 24 horas por 5 días." },
        { nombre: "Naproxeno", nombreComercial: "Flanax", presentacion: "Tabletas", concentracion: "550 mg", instruccionesDefault: "Tomar 1 tableta cada 12 horas con alimentos por 3 días." },
        { nombre: "Ciprofloxacino", nombreComercial: "Ciproxina", presentacion: "Tabletas", concentracion: "500 mg", instruccionesDefault: "Tomar 1 tableta cada 12 horas por 7 días." },
        { nombre: "Ketorolaco", nombreComercial: "Dolac", presentacion: "Tabletas sublinguales", concentracion: "30 mg", instruccionesDefault: "Tomar 1 tableta sublingual en caso de dolor intenso (Máx 4 días)." },
        { nombre: "Ácido Acetilsalicílico", nombreComercial: "Aspirina Protect", presentacion: "Tabletas", concentracion: "100 mg", instruccionesDefault: "Tomar 1 tableta cada 24 horas con el desayuno." },
        { nombre: "Diclofenaco", nombreComercial: "Voltaren", presentacion: "Grageas", concentracion: "100 mg", instruccionesDefault: "Tomar 1 gragea cada 24 horas con alimentos por 3 días." },
        { nombre: "Azitromicina", nombreComercial: "Azitrocin", presentacion: "Tabletas", concentracion: "500 mg", instruccionesDefault: "Tomar 1 tableta cada 24 horas por 3 días." },
        { nombre: "Prednisona", nombreComercial: "Meticorten", presentacion: "Tabletas", concentracion: "20 mg", instruccionesDefault: "Tomar 1 tableta cada 24 horas por la mañana segun esquema de reducción." },
        { nombre: "Ambroxol", nombreComercial: "Mucosolvan", presentacion: "Jarabe", concentracion: "30 mg/5ml", instruccionesDefault: "Tomar 5 ml cada 8 horas por 5 días." },
        { nombre: "Butilhioscina", nombreComercial: "Buscapina", presentacion: "Grageas", concentracion: "10 mg", instruccionesDefault: "Tomar 1 gragea cada 8 horas si hay dolor tipo cólico." },
        { nombre: "Pantoprazol", nombreComercial: "Tecta", presentacion: "Tabletas", concentracion: "40 mg", instruccionesDefault: "Tomar 1 tableta en ayunas por 14 días." }
    ];

    return listaBase.map(m => {
        // Generar tokens de búsqueda (palabras clave del nombre y nombre comercial)
        const tokens = new Set<string>();
        m.nombre.toLowerCase().split(/\s+/).forEach(t => tokens.add(t));
        m.nombreComercial.toLowerCase().split(/\s+/).forEach(t => tokens.add(t));
        
        return {
            id: uuidv4(),
            nombre: m.nombre,
            nombreComercial: m.nombreComercial,
            presentacion: m.presentacion,
            concentracion: m.concentracion,
            instruccionesDefault: m.instruccionesDefault,
            busquedaTokens: Array.from(tokens).filter(t => t.length > 0),
            createdAt: now,
            updatedAt: now
        };
    });
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
        await db.medicamentos.clear();
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

        // Insertar catálogo de medicamentos
        console.log('💊 Insertando catálogo de medicamentos...');
        const medicamentos = generarMedicamentos();
        await db.medicamentos.bulkAdd(medicamentos);
        console.log(`✅ ${medicamentos.length} medicamentos insertados\n`);

        console.log(`   - ${plantillas.length} plantillas configuradas`);
        console.log(`   - ${medicamentos.length} medicamentos en catálogo`);
        console.log(`   - Configuración financiera establecida\n`);
        console.log('🔄 Recarga la página para ver los cambios');
    } catch (error) {
        console.error('❌ Error al poblar la base de datos:', error);
        throw error;
    }
}
