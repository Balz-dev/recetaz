export interface MedicamentoSeed {
    nombreGenerico: string;
    nombreComercial?: string;
    concentracion: string;
    formaFarmaceutica: string;
    cantidadSurtir: string;
    dosis: string;
    viaAdministracion: string;
    frecuencia: string;
    duracion: string;
    indicaciones?: string;
}

export const commonMedications: MedicamentoSeed[] = [
    // Analgésicos y Antiinflamatorios
    {
        nombreGenerico: "Paracetamol",
        nombreComercial: "Tempra",
        concentracion: "500 mg",
        formaFarmaceutica: "Tabletas",
        cantidadSurtir: "1 caja (20 tabletas)",
        dosis: "1 tableta",
        viaAdministracion: "Oral",
        frecuencia: "Cada 8 horas",
        duracion: "Por 5 días",
        indicaciones: "Tomar con alimentos. No exceder dosis recomendada."
    },
    {
        nombreGenerico: "Paracetamol",
        concentracion: "120 mg/5 ml",
        formaFarmaceutica: "Jarabe",
        cantidadSurtir: "1 frasco (120 ml)",
        dosis: "10 ml",
        viaAdministracion: "Oral",
        frecuencia: "Cada 6 horas",
        duracion: "Por 3 días",
        indicaciones: "Agitar antes de usar. Usar jeringa dosificadora."
    },
    {
        nombreGenerico: "Ibuprofeno",
        nombreComercial: "Advil",
        concentracion: "400 mg",
        formaFarmaceutica: "Cápsulas",
        cantidadSurtir: "1 caja (10 cápsulas)",
        dosis: "1 cápsula",
        viaAdministracion: "Oral",
        frecuencia: "Cada 8 horas",
        duracion: "Por 5 días",
        indicaciones: "Tomar con alimentos para evitar irritación gástrica."
    },
    {
        nombreGenerico: "Naproxeno",
        nombreComercial: "Flanax",
        concentracion: "550 mg",
        formaFarmaceutica: "Tabletas",
        cantidadSurtir: "1 caja (12 tabletas)",
        dosis: "1 tableta",
        viaAdministracion: "Oral",
        frecuencia: "Cada 12 horas",
        duracion: "Por 5 días",
        indicaciones: "Tomar con abundante agua."
    },
    {
        nombreGenerico: "Diclofenaco",
        concentracion: "100 mg",
        formaFarmaceutica: "Tabletas de liberación prolongada",
        cantidadSurtir: "1 caja (20 tabletas)",
        dosis: "1 tableta",
        viaAdministracion: "Oral",
        frecuencia: "Cada 24 horas",
        duracion: "Por 7 días",
        indicaciones: "No masticar, tragar entero."
    },
    {
        nombreGenerico: "Ketorolaco",
        concentracion: "10 mg",
        formaFarmaceutica: "Tabletas sublinguales",
        cantidadSurtir: "1 caja (10 tabletas)",
        dosis: "1 tableta",
        viaAdministracion: "Sublingual",
        frecuencia: "Cada 6 horas",
        duracion: "Por 2 días",
        indicaciones: "Dejar disolver bajo la lengua. No usar por más de 5 días."
    },

    // Antibióticos
    {
        nombreGenerico: "Amoxicilina",
        concentracion: "500 mg",
        formaFarmaceutica: "Cápsulas",
        cantidadSurtir: "1 caja (21 cápsulas)",
        dosis: "1 cápsula",
        viaAdministracion: "Oral",
        frecuencia: "Cada 8 horas",
        duracion: "Por 7 días",
        indicaciones: "Completar todo el tratamiento aunque se sienta mejor."
    },
    {
        nombreGenerico: "Amoxicilina + Ácido Clavulánico",
        nombreComercial: "Augmentin",
        concentracion: "875 mg / 125 mg",
        formaFarmaceutica: "Tabletas",
        cantidadSurtir: "1 caja (14 tabletas)",
        dosis: "1 tableta",
        viaAdministracion: "Oral",
        frecuencia: "Cada 12 horas",
        duracion: "Por 7 días",
        indicaciones: "Tomar al inicio de las comidas para mejorar absorción."
    },
    {
        nombreGenerico: "Ceftriaxona",
        concentracion: "1 g",
        formaFarmaceutica: "Solución Inyectable",
        cantidadSurtir: "3 frascos ámpula",
        dosis: "1 g",
        viaAdministracion: "Intramuscular o Intravenosa",
        frecuencia: "Cada 24 horas",
        duracion: "Por 3 días",
        indicaciones: "Aplicación profunda en glúteo o vía IV lenta."
    },
    {
        nombreGenerico: "Azitromicina",
        concentracion: "500 mg",
        formaFarmaceutica: "Tabletas",
        cantidadSurtir: "1 caja (3 tabletas)",
        dosis: "1 tableta",
        viaAdministracion: "Oral",
        frecuencia: "Cada 24 horas",
        duracion: "Por 3 días",
        indicaciones: "Puede tomarse con o sin alimentos."
    },
    {
        nombreGenerico: "Ciprofloxacino",
        concentracion: "500 mg",
        formaFarmaceutica: "Tabletas",
        cantidadSurtir: "1 caja (14 tabletas)",
        dosis: "1 tableta",
        viaAdministracion: "Oral",
        frecuencia: "Cada 12 horas",
        duracion: "Por 7 días",
        indicaciones: "Evitar lácteos y antiácidos 2 horas antes y después."
    },

    // Gastrointestinales
    {
        nombreGenerico: "Omeprazol",
        concentracion: "20 mg",
        formaFarmaceutica: "Cápsulas",
        cantidadSurtir: "1 frasco (14 cápsulas)",
        dosis: "1 cápsula",
        viaAdministracion: "Oral",
        frecuencia: "Cada 24 horas",
        duracion: "Por 14 días",
        indicaciones: "Tomar en ayunas, 30 minutos antes del desayuno."
    },
    {
        nombreGenerico: "Pantoprazol",
        concentracion: "40 mg",
        formaFarmaceutica: "Tabletas",
        cantidadSurtir: "1 caja (14 tabletas)",
        dosis: "1 tableta",
        viaAdministracion: "Oral",
        frecuencia: "Cada 24 horas",
        duracion: "Por 14 días",
        indicaciones: "Tomar en ayunas de preferencia."
    },
    {
        nombreGenerico: "Butilhioscina",
        nombreComercial: "Buscapina",
        concentracion: "10 mg",
        formaFarmaceutica: "Grageas",
        cantidadSurtir: "1 caja (20 grageas)",
        dosis: "1 gragea",
        viaAdministracion: "Oral",
        frecuencia: "Cada 8 horas",
        duracion: "Por 3 días",
        indicaciones: "Tomar si hay dolor tipo cólico."
    },
    {
        nombreGenerico: "Loperamida",
        concentracion: "2 mg",
        formaFarmaceutica: "Tabletas",
        cantidadSurtir: "1 caja (12 tabletas)",
        dosis: "2 tabletas iniciales, luego 1 tras cada evacuación líquida",
        viaAdministracion: "Oral",
        frecuencia: "Según necesidad",
        duracion: "Máximo 2 días",
        indicaciones: "No exceder 8 tabletas en 24 horas."
    },
    {
        nombreGenerico: "Metoclopramida",
        concentracion: "10 mg",
        formaFarmaceutica: "Tabletas",
        cantidadSurtir: "1 caja (20 tabletas)",
        dosis: "1 tableta",
        viaAdministracion: "Oral",
        frecuencia: "Cada 8 horas",
        duracion: "Por 5 días",
        indicaciones: "Tomar 30 minutos antes del desayuno (con alimentos)."
    },

    // Respiratorios
    {
        nombreGenerico: "Salbutamol",
        concentracion: "100 mcg/dosis",
        formaFarmaceutica: "Aerosol",
        cantidadSurtir: "1 dispositivo",
        dosis: "2 disparos",
        viaAdministracion: "Inhalada",
        frecuencia: "Cada 6 horas",
        duracion: "Por 5 días o razón necesaria",
        indicaciones: "Agitar bien antes de usar. Usar espaciador si es posible."
    },
    {
        nombreGenerico: "Loratadina",
        concentracion: "10 mg",
        formaFarmaceutica: "Tabletas",
        cantidadSurtir: "1 caja (10 tabletas)",
        dosis: "1 tableta",
        viaAdministracion: "Oral",
        frecuencia: "Cada 24 horas",
        duracion: "Por 7 días",
        indicaciones: "No causa sueño habitualmente."
    },
    {
        nombreGenerico: "Ambroxol",
        concentracion: "30 mg/5 ml",
        formaFarmaceutica: "Jarabe",
        cantidadSurtir: "1 frasco (120 ml)",
        dosis: "5 ml",
        viaAdministracion: "Oral",
        frecuencia: "Cada 8 horas",
        duracion: "Por 5 días",
        indicaciones: "Tomar después de los alimentos."
    },

    // Crónico-Degenerativos (Cardio/Endo)
    {
        nombreGenerico: "Losartán",
        concentracion: "50 mg",
        formaFarmaceutica: "Grageas",
        cantidadSurtir: "1 caja (30 grageas)",
        dosis: "1 gragea",
        viaAdministracion: "Oral",
        frecuencia: "Cada 12 horas",
        duracion: "Uso continuo",
        indicaciones: "Monitorear presión arterial regularmente."
    },
    {
        nombreGenerico: "Telmisartán",
        concentracion: "40 mg",
        formaFarmaceutica: "Tabletas",
        cantidadSurtir: "1 caja (14 tabletas)",
        dosis: "1 tableta",
        viaAdministracion: "Oral",
        frecuencia: "Cada 24 horas",
        duracion: "Uso continuo",
        indicaciones: ""
    },
    {
        nombreGenerico: "Metformina",
        concentracion: "850 mg",
        formaFarmaceutica: "Tabletas",
        cantidadSurtir: "1 caja (30 tabletas)",
        dosis: "1 tableta",
        viaAdministracion: "Oral",
        frecuencia: "Cada 12 horas",
        duracion: "Uso continuo",
        indicaciones: "Tomar junto con alimentos."
    },
    {
        nombreGenerico: "Glibenclamida",
        concentracion: "5 mg",
        formaFarmaceutica: "Tabletas",
        cantidadSurtir: "1 caja (50 tabletas)",
        dosis: "1 tableta",
        viaAdministracion: "Oral",
        frecuencia: "Cada 24 horas",
        duracion: "Uso continuo",
        indicaciones: "Tomar con el desayuno."
    },
    {
        nombreGenerico: "Atorvastatina",
        concentracion: "20 mg",
        formaFarmaceutica: "Tabletas",
        cantidadSurtir: "1 caja (10 tabletas)",
        dosis: "1 tableta",
        viaAdministracion: "Oral",
        frecuencia: "Cada 24 horas",
        duracion: "Uso continuo",
        indicaciones: "Tomar preferentemente por la noche."
    },

    // Vitaminas y Otros
    {
        nombreGenerico: "Complejo B",
        concentracion: "Tiamina 100mg, Piridoxina 100mg, Cianocobalamina 5mg",
        formaFarmaceutica: "Solución Inyectable",
        cantidadSurtir: "1 caja (5 ampolletas)",
        dosis: "1 ampolleta",
        viaAdministracion: "Intramuscular",
        frecuencia: "Cada 48 horas",
        duracion: "Por 5 dosis",
        indicaciones: "Aplicación profunda, puede arder al aplicar."
    },
    {
        nombreGenerico: "Ácido Fólico",
        concentracion: "4 mg",
        formaFarmaceutica: "Tabletas",
        cantidadSurtir: "1 caja (90 tabletas)",
        dosis: "1 tableta",
        viaAdministracion: "Oral",
        frecuencia: "Cada 24 horas",
        duracion: "Uso continuo",
        indicaciones: "Idealmente tomar siempre a la misma hora."
    }
];
