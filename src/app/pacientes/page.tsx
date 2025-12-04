import { PacienteList } from "@/components/pacientes/paciente-list";

export default function PacientesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Pacientes</h2>
                <p className="text-muted-foreground">
                    Gestiona el directorio de pacientes y sus historiales médicos.
                </p>
            </div>

            <PacienteList />
        </div>
    );
}
