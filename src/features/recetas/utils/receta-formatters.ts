export const obtenerVerbo = (via?: string): string => {
    if (!via) return "Administrar";
    const v = via.toLowerCase();
    if (v.includes("oral") || v.includes("sublingual") || v.includes("boca")) return "Tomar";
    if (v.includes("tópica") || v.includes("cutánea") || v.includes("piel") || v.includes("oftálmica") || v.includes("ótica") || v.includes("nasal") || v.includes("vaginal") || v.includes("rectal")) return "Aplicar";
    if (v.includes("inhal")) return "Inhalar";
    if (v.includes("intravenosa") || v.includes("intramuscular") || v.includes("subcutánea") || v.includes("parenteral")) return "Administrar";
    return "Administrar";
};

export const limpiarNumero = (str: string): number | null => {
    const match = str.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : null;
};

export const calcularCantidad = (med: any): string => {
    // Si ya viene calculada o manual, respetarla si no es nula
    if (med.cantidadSurtir) return med.cantidadSurtir;

    const dosis = limpiarNumero(med.dosis || '');
    const duracionStr = med.duracion?.toLowerCase() || '';
    const frecuenciaStr = med.frecuencia?.toLowerCase() || '';

    if (!dosis) return "Según indicaciones";

    // Calcular duración en días
    let dias = 0;
    if (duracionStr.includes("semana")) dias = (limpiarNumero(duracionStr) || 0) * 7;
    else if (duracionStr.includes("mes")) dias = (limpiarNumero(duracionStr) || 0) * 30;
    else if (duracionStr.includes("dia") || duracionStr.includes("día")) dias = limpiarNumero(duracionStr) || 0;

    // Si es dosis única
    if (dosis && (!med.frecuencia || med.frecuencia.toLowerCase().includes("unica") || med.frecuencia.toLowerCase().includes("única"))) {
        // Determinamos unidad básica
        const unidad = med.formaFarmaceutica?.toLowerCase().includes("jarabe") || med.formaFarmaceutica?.toLowerCase().includes("susp") ? "ml" : (med.formaFarmaceutica || "unidades");
        return `${dosis} ${unidad}`;
    }

    // Calcular tomas por día
    let tomasDiarias = 0;
    if (frecuenciaStr.includes("cada")) {
        const horas = limpiarNumero(frecuenciaStr);
        if (horas) tomasDiarias = 24 / horas;
    } else if (frecuenciaStr.includes("veces")) {
        tomasDiarias = limpiarNumero(frecuenciaStr) || 0;
    } else if (frecuenciaStr.includes("horas")) {
        // Asumir que solo puso el número de horas "8 horas"
        const horas = limpiarNumero(frecuenciaStr);
        if (horas) tomasDiarias = 24 / horas;
    }

    if (dosis && dias && tomasDiarias) {
        const total = Math.ceil(dosis * tomasDiarias * dias);

        let unidad = "unidades";
        const forma = (med.formaFarmaceutica || '').toLowerCase();

        if (forma.includes("tab") || forma.includes("comp") || forma.includes("cap") || forma.includes("cáp") || forma.includes("gragea")) {
            unidad = med.formaFarmaceutica || "tabletas";
        } else if (forma.includes("jarabe") || forma.includes("susp") || forma.includes("sol")) {
            unidad = "ml"; // Díficil estimar frascos sin saber ml por frasco, devolvemos ml totales
        } else if (forma.includes("iny")) {
            unidad = "ampolletas/frascos";
        }

        return `${total} ${unidad}`;
    }

    return "1 caja / frasco (Suficiente para tratamiento)";
};
