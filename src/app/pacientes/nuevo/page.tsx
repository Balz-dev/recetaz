import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PacienteForm } from "@/components/pacientes/paciente-form";

export default function NuevoPacientePage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Registrar Paciente</h2>
                <p className="text-muted-foreground">
                    Ingresa los datos del nuevo paciente para comenzar su historial.
                </p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <PacienteForm />
                </CardContent>
            </Card>
        </div>
    );
}
