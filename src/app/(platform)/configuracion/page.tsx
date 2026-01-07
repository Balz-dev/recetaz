import { ConfiguracionContent } from "@/features/config-medico/components/ConfiguracionContent";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>

      <ConfiguracionContent />
    </div>
  );
}
