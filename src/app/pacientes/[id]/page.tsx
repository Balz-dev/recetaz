"use client"

import { useEffect, useState } from "react";
import { PacienteForm } from "@/components/pacientes/paciente-form";
import { Card, CardContent } from "@/components/ui/card";
import { pacienteService } from "@/lib/db/pacientes";
import { Paciente } from "@/types";
import { Loader2, Calendar, ExternalLink } from "lucide-react";
import { useParams } from "next/navigation";
import { recetaService } from "@/lib/db/recetas";
import { Receta } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { RecetaForm } from "@/components/recetas/receta-form";

export default function EditarPacientePage() {
    const params = useParams();
    const [paciente, setPaciente] = useState<Paciente | undefined>(undefined);
    const [historialRecetas, setHistorialRecetas] = useState<Receta[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRecetaModalOpen, setIsRecetaModalOpen] = useState(false);

    useEffect(() => {
        const loadPaciente = async () => {
            if (params.id) {
                try {
                    const data = await pacienteService.getById(params.id as string);
                    setPaciente(data);
                    // Load history
                    const recetas = await recetaService.getByPacienteId(params.id as string);
                    setHistorialRecetas(recetas);
                } catch (error) {
                    console.error("Error cargando paciente:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadPaciente();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!paciente) {
        return (
            <div className="text-center py-10">
                <h3 className="text-lg font-semibold text-red-600">Paciente no encontrado</h3>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Editar Paciente</h2>
                    <p className="text-muted-foreground">
                        Actualiza la información personal y médica del paciente.
                    </p>
                </div>
                <Dialog open={isRecetaModalOpen} onOpenChange={setIsRecetaModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Nueva Receta
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Nueva Receta para {paciente?.nombre}</DialogTitle>
                            <DialogDescription>
                                Complete el formulario para generar una nueva receta.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <RecetaForm
                                preSelectedPacienteId={paciente?.id}
                                onCancel={() => setIsRecetaModalOpen(false)}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <PacienteForm initialData={paciente} isEditing={true} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Historial de Recetas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {historialRecetas.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No hay recetas previas.
                            </p>
                        ) : (
                            historialRecetas.map((receta) => (
                                <div key={receta.id} className="flex justify-between items-start border-b pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 font-mono">
                                                #{receta.numeroReceta}
                                            </span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {receta.fechaEmision ? format(new Date(receta.fechaEmision), "d 'de' MMMM, yyyy", { locale: es }) : "N/D"}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium mt-1">{receta.diagnostico}</p>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                            {receta.medicamentos.map(m => m.nombre).join(", ")}
                                        </p>
                                    </div>
                                    <Link href={`/recetas/${receta.id}`} target="_blank">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <ExternalLink className="h-4 w-4" />
                                            Ver Receta
                                        </Button>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div >
    );
}
