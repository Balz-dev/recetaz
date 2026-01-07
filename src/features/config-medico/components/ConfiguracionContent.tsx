
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { MedicoConfigForm } from "@/features/config-medico/components/MedicoConfigForm";
import { PlantillaList } from "@/features/recetas/components/PlantillaList";

interface ConfiguracionContentProps {
    onConfigSaved?: () => void;
}

export function ConfiguracionContent({ onConfigSaved }: ConfiguracionContentProps) {
    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Columna Izquierda: Datos del Médico */}
            <div className="w-full lg:w-1/3">
                <Card>
                    <CardHeader>
                        <CardTitle>Datos del Médico</CardTitle>
                        <CardDescription>
                            Configura tus datos personales y profesionales. Estos aparecerán en todas las recetas que generes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MedicoConfigForm onSuccess={onConfigSaved} />
                    </CardContent>
                </Card>
            </div>

            {/* Columna Derecha: Plantillas */}
            <div className="w-full lg:w-2/3">
                <Card>
                    <CardHeader>
                        <CardTitle>Plantillas de Recetas</CardTitle>
                        <CardDescription>
                            Gestiona el diseño de impresión de tus recetas. Puedes elegir entre el diseño predeterminado del sistema o crear el tuyo propio para papel membretado.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PlantillaList />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
