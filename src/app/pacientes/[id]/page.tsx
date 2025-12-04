"use client"

import { useEffect, useState } from "react";
import { PacienteForm } from "@/components/pacientes/paciente-form";
import { Card, CardContent } from "@/components/ui/card";
import { pacienteService } from "@/lib/db/pacientes";
import { Paciente } from "@/types";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function EditarPacientePage() {
    const params = useParams();
    const [paciente, setPaciente] = useState<Paciente | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPaciente = async () => {
            if (params.id) {
                try {
                    const data = await pacienteService.getById(params.id as string);
                    setPaciente(data);
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
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Editar Paciente</h2>
                <p className="text-muted-foreground">
                    Actualiza la información personal y médica del paciente.
                </p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <PacienteForm initialData={paciente} isEditing={true} />
                </CardContent>
            </Card>
        </div>
    );
}
