import { useMedico } from "@/features/config-medico/hooks/useMedico";
import { useRecetas } from "@/features/recetas/hooks/useRecetas";
import { usePacientes } from "@/features/pacientes/hooks/usePacientes";

/**
 * Hook compuesto para agrupar la carga de datos necesaria en el Dashboard.
 * Abstrae la lógica de llamadas múltiples en un solo punto, limpiando la vista.
 * 
 * @returns Datos combinados (conteo, config) y un estado de carga global.
 */
export function useDashboardData() {
    const { data: config, isLoading: isMedicoLoading } = useMedico();
    const { data: recetas, isLoading: isRecetasLoading } = useRecetas();
    const { data: pacientes, isLoading: isPacientesLoading } = usePacientes();

    const isLoading = isMedicoLoading || isRecetasLoading || isPacientesLoading;

    return {
        medicoNombre: config?.nombre || "",
        totalRecetas: recetas?.length || 0,
        totalPacientes: pacientes?.length || 0,
        isLoading
    };
}
