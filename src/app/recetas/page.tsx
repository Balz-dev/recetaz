import { RecetaList } from "@/features/recetas/components/RecetaList";

export default function RecetasPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Recetas Médicas</h2>
                <p className="text-muted-foreground">
                    Historial de recetas emitidas y creación de nuevos documentos.
                </p>
            </div>

            <RecetaList />
        </div>
    );
}
