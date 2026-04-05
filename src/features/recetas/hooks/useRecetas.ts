import { useLiveQuery } from "dexie-react-hooks";
import { recetaService } from "../services/receta.service";

/**
 * Hook para gestionar las recetas de forma reactiva y abstracta de la UI.
 * 
 * @param pacienteId Opcional. Si se provee, filtrará y escuchará las recetas por paciente.
 * @returns Datos de recetas, estado de carga, y métodos de eliminación/búsqueda.
 */
export function useRecetas(pacienteId?: string) {
    const data = useLiveQuery(
        () => pacienteId ? recetaService.getByPacienteId(pacienteId) : recetaService.getAll(),
        [pacienteId]
    );

    const isLoading = data === undefined;

    /**
     * Elimina una receta por ID de forma permanente
     */
    const remove = async (id: string) => {
        return await recetaService.delete(id);
    };

    /**
     * Busca recetas de forma imperativa (sin reactividad del hook principal)
     */
    const search = async (query: string, pId?: string) => {
        return await recetaService.search(query, pId);
    };

    return {
        data,
        isLoading,
        remove,
        search
    };
}
