"use client"

import { useEffect, useState } from "react";
import { PacienteForm } from "@/features/pacientes/components/PacienteForm";
import { Card, CardContent } from "@/shared/components/ui/card";
import { pacienteService } from "@/features/pacientes/services/paciente.service";
import { Paciente, Receta } from "@/types";
import { Loader2, PlusCircle } from "lucide-react";
import { recetaService } from "@/features/recetas/services/receta.service";
import { Button } from "@/shared/components/ui/button";
import { CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { RecetaForm } from "@/features/recetas/components/RecetaForm";
import { RecetaList } from "@/features/recetas/components/RecetaList";

/**
 * Componente que muestra el detalle de un paciente y su historial de recetas.
 * Diseñado para funcionar offline cargando datos de Dexie via pacienteId.
 * 
 * @param props - Propiedades del componente.
 * @param props.pacienteId - ID del paciente a cargar.
 * @returns Componente JSX con la ficha del paciente.
 */
export function DetallePacienteView({ pacienteId }: { pacienteId: string }) {
    const [paciente, setPaciente] = useState<Paciente | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (pacienteId) {
                try {
                    const data = await pacienteService.getById(pacienteId);
                    setPaciente(data);
                } catch (error) {
                    console.error("Error cargando paciente:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadData();
    }, [pacienteId]);

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
                <h3 className="text-lg font-semibold text-red-600">Paciente no encontrado (Offline)</h3>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Detalle del Paciente</h2>
                    <p className="text-muted-foreground">
                        Información personal y médica del paciente.
                    </p>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <PacienteForm initialData={paciente} isEditing={true} />
                </CardContent>
            </Card>

            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0">
                    <CardTitle className="text-2xl font-bold">Historial de Recetas</CardTitle>
                </CardHeader>
                <CardContent className="px-0 px-1 pb-10">
                    <RecetaList pacienteId={pacienteId} />
                </CardContent>
            </Card>
        </div >
    );
}
