import { useLiveQuery } from "dexie-react-hooks";
import { pacienteService } from "../services/paciente.service";
import { PacienteFormData } from "@/types";

/**
 * Hook para gestionar los pacientes de forma reactiva y abstracta de la UI.
 * 
 * @returns Datos de pacientes, estado de carga y funciones del servicio.
 */
export function usePacientes() {
    const data = useLiveQuery(() => pacienteService.getAll(), []);
    const isLoading = data === undefined;

    const create = async (formData: PacienteFormData) => {
        return await pacienteService.create(formData);
    };

    const update = async (id: string, formData: Partial<PacienteFormData>) => {
        return await pacienteService.update(id, formData);
    };

    const remove = async (id: string) => {
        return await pacienteService.delete(id);
    };

    const search = async (query: string) => {
        return await pacienteService.search(query);
    };

    return {
        data,
        isLoading,
        create,
        update,
        remove,
        search
    };
}
