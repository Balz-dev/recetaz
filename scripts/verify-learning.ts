
import { db } from "@/shared/db/db.config";
import { treatmentLearningService } from "@/features/recetas/services/treatment-learning.service";
import { catalogSyncService } from "@/shared/services/catalog-sync.service";

async function verifyLearningSystem() {
    console.log("🧪 Iniciando prueba del Sistema de Aprendizaje...");

    // 1. Forzar sincronización (simular inicio de app)
    console.log("\n📡 Ejecutando sincronización de catálogos...");
    await catalogSyncService.syncAll();

    // 2. Verificar carga de tratamientos iniciales
    const count = await db.tratamientosHabituales.count();
    console.log(`\n📊 Total de tratamientos en DB: ${count}`);

    if (count === 0) {
        console.error("❌ ERROR: No se cargaron los tratamientos iniciales.");
        return;
    } else {
        console.log("✅ Tratamientos iniciales cargados correctamente.");
    }

    // 3. Probar sugerencia para un diagnóstico conocido (Faringitis - CA02)
    console.log("\n🔍 Buscando sugerencias para diagnóstico 'CA02' (Faringitis)...");
    const suggestions = await treatmentLearningService.getSuggestions("CA02", "Medicina General");

    if (suggestions.length > 0) {
        console.log("✅ Sugerencias encontradas:");
        suggestions.forEach(t => {
            console.log(`   - ${t.nombreTratamiento} (${t.medicamentos.length} medicamentos) | Uso: ${t.usoCount}`);
        });
    } else {
        console.error("❌ ERROR: No se encontraron sugerencias para un diagnóstico que debería tenerlas.");
    }

    // 4. Probar aprendizaje (simular guardado de receta)
    console.log("\n🧠 Simulando aprendizaje de nuevo tratamiento para 'CA02'...");

    // Simular un tratamiento diferente
    const medsMock = [
        { nombre: "Azitromicina", dosis: "500mg", frecuencia: "24h", duracion: "3d" }
    ];

    await treatmentLearningService.learn("CA02", medsMock as any, "Reposo relativo", "Medicina General");

    console.log("   Tratamiento aprendido enviado.");

    // Verificar que ahora aparece
    const suggestionsAfter = await treatmentLearningService.getSuggestions("CA02", "Medicina General");
    const foundNew = suggestionsAfter.find(t => t.nombreTratamiento.includes("Azitromicina"));

    if (foundNew) {
        console.log("✅ El sistema aprendió el nuevo tratamiento exitosamente.");
    } else {
        console.error("❌ ERROR: El sistema no aprendió el nuevo tratamiento.");
    }

    console.log("\n🎉 Prueba finalizada.");
}

// Ejecutar si se llama directamente (hack para entornos de script)
// En un entorno real de Next, esto se ejecutaría diferente, pero para verificación manual sirve
export default verifyLearningSystem;
