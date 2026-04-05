import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/shared/db/db.config";

/**
 * Hook para obtener la lista de especialidades médicas desde IndexedDB.
 */
export function useEspecialidades() {
    const data = useLiveQuery(
        async () => await db.especialidades.toArray(),
        []
    );

    return {
        data: data || [],
        isLoading: data === undefined
    };
}
