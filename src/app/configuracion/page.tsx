import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { MedicoConfigForm } from "@/features/config-medico/components/MedicoConfigForm";
import { PlantillaList } from "@/features/recetas/components/PlantillaList";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
      
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
              <MedicoConfigForm />
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
              {/* This div seems to be a preview component that was intended to be added here */}
              {/* Note: 'plantilla' variable is not defined in this scope, it would need to be passed down or defined */}
              {/* For now, I'm placing it as a placeholder, assuming 'plantilla' would be available in a child component or context */}
              {/* <div className={`border rounded flex items-center justify-center mb-4 relative overflow-hidden group mx-auto text-center bg-slate-50
                                    ${plantilla.tamanoPapel === 'carta' ? 'aspect-[8.5/11]' : 'aspect-[8.5/5.5]'} w-full max-w-[280px] shadow-sm`}
                                ></div> */}
              <PlantillaList />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
