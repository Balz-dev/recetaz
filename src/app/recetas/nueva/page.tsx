import { Card, CardContent } from "@/shared/components/ui/card";
import { RecetaForm } from "@/features/recetas/components/RecetaForm";

export default function NuevaRecetaPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Nueva Receta</h2>
                <p className="text-muted-foreground">
                    Complete los datos para generar una nueva receta médica.
                </p>
            </div>

            <RecetaForm />
        </div>
    );
}
