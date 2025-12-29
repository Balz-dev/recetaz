/**
 * @fileoverview Catálogo de Medicamentos Comunes con Datos Clínicos
 * 
 * Este archivo contiene los medicamentos más prescritos en México con sus
 * instrucciones predeterminadas más comunes. El médico puede modificar
 * estos valores en el formulario según el caso clínico específico.
 */

export interface MedicamentoSeed {
    nombre: string;
    presentacion: string;
    dosis?: string;
    frecuencia?: string;
    duracion?: string;
    indicaciones?: string;
}

export const commonMedications: MedicamentoSeed[] = [
    // Analgésicos y Antiinflamatorios
    {
        nombre: "Paracetamol",
        presentacion: "Tabletas 500mg",
        dosis: "1 tableta",
        frecuencia: "Cada 8 horas",
        duracion: "5 días",
        indicaciones: "Tomar con alimentos. En caso de fiebre o dolor"
    },
    {
        nombre: "Paracetamol",
        presentacion: "Jarabe 120mg/5ml",
        dosis: "5-10 ml",
        frecuencia: "Cada 6-8 horas",
        duracion: "3-5 días",
        indicaciones: "Administrar con jeringa dosificadora"
    },
    {
        nombre: "Ibuprofeno",
        presentacion: "Tabletas 400mg",
        dosis: "1 tableta",
        frecuencia: "Cada 8 horas",
        duracion: "5-7 días",
        indicaciones: "Tomar con alimentos para evitar irritación gástrica"
    },
    {
        nombre: "Ibuprofeno",
        presentacion: "Suspensión 100mg/5ml",
        dosis: "5-10 ml",
        frecuencia: "Cada 6-8 horas",
        duracion: "3-5 días",
        indicaciones: "Agitar antes de usar"
    },
    {
        nombre: "Naproxeno",
        presentacion: "Tabletas 250mg",
        dosis: "1 tableta",
        frecuencia: "Cada 12 horas",
        duracion: "5-7 días",
        indicaciones: "Tomar con alimentos"
    },
    {
        nombre: "Diclofenaco",
        presentacion: "Tabletas 100mg",
        dosis: "1 tableta",
        frecuencia: "Cada 12-24 horas",
        duracion: "5-7 días",
        indicaciones: "Tomar con alimentos"
    },

    // Antibióticos
    {
        nombre: "Amoxicilina",
        presentacion: "Cápsulas 500mg",
        dosis: "1 cápsula",
        frecuencia: "Cada 8 horas",
        duracion: "7-10 días",
        indicaciones: "Completar tratamiento completo aunque mejoren los síntomas"
    },
    {
        nombre: "Amoxicilina",
        presentacion: "Suspensión 250mg/5ml",
        dosis: "5-10 ml",
        frecuencia: "Cada 8 horas",
        duracion: "7-10 días",
        indicaciones: "Refrigerar después de reconstituir. Agitar antes de usar"
    },
    {
        nombre: "Amoxicilina + Ácido Clavulánico",
        presentacion: "Tabletas 875mg/125mg",
        dosis: "1 tableta",
        frecuencia: "Cada 12 horas",
        duracion: "7-10 días",
        indicaciones: "Tomar con alimentos. Completar tratamiento"
    },
    {
        nombre: "Azitromicina",
        presentacion: "Tabletas 500mg",
        dosis: "1 tableta",
        frecuencia: "Cada 24 horas",
        duracion: "3-5 días",
        indicaciones: "Tomar con el estómago vacío o con alimentos"
    },
    {
        nombre: "Ciprofloxacino",
        presentacion: "Tabletas 500mg",
        dosis: "1 tableta",
        frecuencia: "Cada 12 horas",
        duracion: "7-14 días",
        indicaciones: "Tomar con abundante agua. Evitar lácteos 2 horas antes/después"
    },

    // Gastrointestinales
    {
        nombre: "Omeprazol",
        presentacion: "Cápsulas 20mg",
        dosis: "1 cápsula",
        frecuencia: "Cada 24 horas",
        duracion: "14-30 días",
        indicaciones: "Tomar 30 minutos antes del desayuno"
    },
    {
        nombre: "Pantoprazol",
        presentacion: "Tabletas 40mg",
        dosis: "1 tableta",
        frecuencia: "Cada 24 horas",
        duracion: "14-30 días",
        indicaciones: "Tomar en ayunas"
    },
    {
        nombre: "Ranitidina",
        presentacion: "Tabletas 150mg",
        dosis: "1 tableta",
        frecuencia: "Cada 12 horas",
        duracion: "14 días",
        indicaciones: "Puede tomarse con o sin alimentos"
    },
    {
        nombre: "Butilhioscina",
        presentacion: "Tabletas 10mg",
        dosis: "1-2 tabletas",
        frecuencia: "Cada 8 horas",
        duracion: "3-5 días",
        indicaciones: "Para cólicos y dolor abdominal"
    },
    {
        nombre: "Metoclopramida",
        presentacion: "Tabletas 10mg",
        dosis: "1 tableta",
        frecuencia: "Cada 8 horas",
        duracion: "5-7 días",
        indicaciones: "Tomar 30 minutos antes de las comidas"
    },
    {
        nombre: "Loperamida",
        presentacion: "Tabletas 2mg",
        dosis: "2 tabletas inicialmente, luego 1 tableta",
        frecuencia: "Después de cada evacuación líquida",
        duracion: "Máximo 2 días",
        indicaciones: "No exceder 8 tabletas en 24 horas"
    },

    // Respiratorios
    {
        nombre: "Salbutamol",
        presentacion: "Aerosol 100mcg",
        dosis: "1-2 inhalaciones",
        frecuencia: "Cada 4-6 horas",
        duracion: "Según necesidad",
        indicaciones: "Usar con cámara espaciadora si es posible"
    },
    {
        nombre: "Ambroxol",
        presentacion: "Jarabe 30mg/5ml",
        dosis: "10 ml",
        frecuencia: "Cada 8 horas",
        duracion: "5-7 días",
        indicaciones: "Tomar con abundantes líquidos"
    },
    {
        nombre: "Loratadina",
        presentacion: "Tabletas 10mg",
        dosis: "1 tableta",
        frecuencia: "Cada 24 horas",
        duracion: "5-10 días",
        indicaciones: "Puede tomarse con o sin alimentos"
    },
    {
        nombre: "Montelukast",
        presentacion: "Tabletas 10mg",
        dosis: "1 tableta",
        frecuencia: "Cada 24 horas",
        duracion: "Uso prolongado",
        indicaciones: "Tomar por la noche"
    },

    // Cardiovasculares
    {
        nombre: "Losartán",
        presentacion: "Grageas 50mg",
        dosis: "1 gragea",
        frecuencia: "Cada 24 horas",
        duracion: "Uso prolongado",
        indicaciones: "Tomar en ayunas. Control de presión arterial"
    },
    {
        nombre: "Enalapril",
        presentacion: "Tabletas 10mg",
        dosis: "1 tableta",
        frecuencia: "Cada 12-24 horas",
        duracion: "Uso prolongado",
        indicaciones: "Tomar a la misma hora diariamente"
    },
    {
        nombre: "Amlodipino",
        presentacion: "Tabletas 5mg",
        dosis: "1 tableta",
        frecuencia: "Cada 24 horas",
        duracion: "Uso prolongado",
        indicaciones: "Puede tomarse con o sin alimentos"
    },
    {
        nombre: "Hidroclorotiazida",
        presentacion: "Tabletas 25mg",
        dosis: "1 tableta",
        frecuencia: "Cada 24 horas",
        duracion: "Uso prolongado",
        indicaciones: "Tomar por la mañana. Puede causar aumento de micción"
    },
    {
        nombre: "Atorvastatina",
        presentacion: "Tabletas 20mg",
        dosis: "1 tableta",
        frecuencia: "Cada 24 horas",
        duracion: "Uso prolongado",
        indicaciones: "Tomar por la noche"
    },
    {
        nombre: "Ácido Acetilsalicílico (Protect)",
        presentacion: "Tabletas 100mg",
        dosis: "1 tableta",
        frecuencia: "Cada 24 horas",
        duracion: "Uso prolongado",
        indicaciones: "Tomar con alimentos"
    },

    // Diabetes
    {
        nombre: "Metformina",
        presentacion: "Tabletas 850mg",
        dosis: "1 tableta",
        frecuencia: "Cada 12 horas",
        duracion: "Uso prolongado",
        indicaciones: "Tomar con alimentos. Control de glucosa"
    },
    {
        nombre: "Metformina",
        presentacion: "Tabletas 500mg",
        dosis: "1-2 tabletas",
        frecuencia: "Cada 12 horas",
        duracion: "Uso prolongado",
        indicaciones: "Tomar con alimentos"
    },
    {
        nombre: "Glibenclamida",
        presentacion: "Tabletas 5mg",
        dosis: "1 tableta",
        frecuencia: "Cada 24 horas",
        duracion: "Uso prolongado",
        indicaciones: "Tomar antes del desayuno"
    },

    // Vitaminas
    {
        nombre: "Complejo B",
        presentacion: "Tabletas",
        dosis: "1 tableta",
        frecuencia: "Cada 24 horas",
        duracion: "30 días",
        indicaciones: "Tomar con alimentos"
    },
    {
        nombre: "Vitamina C",
        presentacion: "Tabletas Efervescentes 1g",
        dosis: "1 tableta",
        frecuencia: "Cada 24 horas",
        duracion: "10-15 días",
        indicaciones: "Disolver en agua"
    },
    {
        nombre: "Ácido Fólico",
        presentacion: "Tabletas 4mg",
        dosis: "1 tableta",
        frecuencia: "Cada 24 horas",
        duracion: "Según indicación",
        indicaciones: "Importante en embarazo"
    }
];
