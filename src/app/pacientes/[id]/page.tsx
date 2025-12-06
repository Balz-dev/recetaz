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
import { RecetaCard } from "@/components/recetas/receta-card";

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
                                    <RecetaCard key={receta.id} receta={receta} patientName={paciente?.nombre} />
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div >
    );
}
