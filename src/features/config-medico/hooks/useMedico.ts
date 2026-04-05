import { useLiveQuery } from "dexie-react-hooks";
import { medicoService } from "../services/medico.service";
import { MedicoConfigFormData } from "@/types";

/**
 * Hook para gestionar la configuración del médico.
 * Encapsula la reactividad con IndexedDB y la capa de servicios.
 * 
 * @returns Objeto con los datos del médico, estado de carga y funciones de guardado.
 */
export function useMedico() {
    const data = useLiveQuery(() => medicoService.get(), []);

    // useLiveQuery devuelve undefined mientras la promesa está en vuelo.
    const isLoading = data === undefined;

    /**
     * Guarda o actualiza la configuración del médico
     * @param formData Datos a guardar
     */
    const save = async (formData: MedicoConfigFormData) => {
        return await medicoService.save(formData);
    };

    /**
     * Revisa de forma asincrónica si ya existe una configuración guardada
     */
    const exists = async () => {
        return await medicoService.exists();
    };

    return {
        data,
        isLoading,
        save,
        exists
    };
}
