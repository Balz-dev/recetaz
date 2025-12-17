import { RecetaList } from "@/features/recetas/components/RecetaList";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { Settings } from "lucide-react";
import { Suspense } from "react";

export default function RecetasPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Recetas Médicas</h2>
                    <p className="text-muted-foreground">
                        Historial de recetas emitidas y creación de nuevos documentos.
                    </p>
                </div>
                <Link href="/recetas/plantillas">
                    <Button variant="outline" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Configurar Plantillas
                    </Button>
                </Link>
            </div>

            <Suspense fallback={<div>Cargando listado...</div>}>
                <RecetaList />
            </Suspense>
        </div>
    );
}
