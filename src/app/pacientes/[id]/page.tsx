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
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {historialRecetas.map((receta) => (
                                    <Card key={receta.id} className="overflow-hidden h-full hover:shadow-md transition-shadow">
                                        <CardContent className="p-4 flex flex-col h-full gap-4">
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground font-mono">
                                                        #{receta.numeroReceta}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0">
                                                        <Calendar className="h-3 w-3" />
                                                        {receta.fechaEmision ? format(new Date(receta.fechaEmision), "dd/MM/yy", { locale: es }) : "N/D"}
                                                    </span>
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold text-xs uppercase text-muted-foreground mb-1">Diagnóstico</h4>
                                                    <p className="text-sm font-medium leading-tight line-clamp-2" title={receta.diagnostico}>
                                                        {receta.diagnostico}
                                                    </p>
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold text-xs uppercase text-muted-foreground mb-1">Medicamentos</h4>
                                                    <p className="text-xs text-muted-foreground line-clamp-3">
                                                        {receta.medicamentos.map(m => m.nombre).join(", ")}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="w-full mt-auto pt-2 border-t">
                                                <Link href={`/recetas/${receta.id}`} target="_blank" className="w-full">
                                                    <Button variant="ghost" size="sm" className="w-full h-8 text-xs gap-2">
                                                        <ExternalLink className="h-3 w-3" />
                                                        Ver Receta
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div >
    );
}
