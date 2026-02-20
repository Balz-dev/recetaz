"use client"

import { useParams } from "next/navigation";
import { DetallePacienteView } from "@/features/pacientes/components/DetallePacienteView";

/**
 * Página de edición de paciente.
 * Wrapper ligero que usa DetallePacienteView para permitir hidratación local y soporte offline.
 * 
 * @returns Componente de la página de paciente.
 */
export default function EditarPacientePage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    if (!id) return null;

    return <DetallePacienteView pacienteId={id} />;
}
