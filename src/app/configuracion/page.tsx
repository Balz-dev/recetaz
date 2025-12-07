import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { MedicoConfigForm } from "@/features/config-medico/components/MedicoConfigForm";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
      <Card>
        <CardHeader>
          <CardTitle>Datos del Médico</CardTitle>
          <CardDescription>
            Configura tus datos personales y profesionales. Estos aparecerán en todas las recetas que generes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MedicoConfigForm />
        </CardContent>
      </Card>
    </div>
  );
}
