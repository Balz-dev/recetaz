"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { medicoService } from "@/lib/db/medico";
import { recetaService } from "@/lib/db/recetas";
import { pacienteService } from "@/lib/db/pacientes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Activity, Plus } from "lucide-react";
import Link from "next/link";
import { ConfiguracionModal } from "@/components/configuracion/configuracion-modal";

export default function HomePage() {
    const router = useRouter();
    const [stats, setStats] = useState({
        totalRecetas: 0,
        totalPacientes: 0,
        loading: true
    });
    const [showConfigModal, setShowConfigModal] = useState(false);

    useEffect(() => {
        const checkConfig = async () => {
            const hasConfig = await medicoService.exists();
            if (!hasConfig) {
                setShowConfigModal(true);
                // Don't simplify return here, we still want to load stats if possible (might be empty)
                // But usually if no config, stats are 0.
            }

            // Cargar estadísticas
            try {
                const [recetas, pacientes] = await Promise.all([
                    recetaService.getAll(),
                    pacienteService.getAll()
                ]);

                setStats({
                    totalRecetas: recetas.length,
                    totalPacientes: pacientes.length,
                    loading: false
                });
            } catch (error) {
                console.error("Error cargando estadísticas:", error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };
        checkConfig();
    }, [router]);

    const handleConfigSuccess = () => {
        setShowConfigModal(false);
        // Could trigger a reload or just let them continue
    };

    if (stats.loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Activity className="h-8 w-8 animate-pulse text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <ConfiguracionModal
                open={showConfigModal}
                onOpenChange={setShowConfigModal}
                onSuccess={handleConfigSuccess}
                preventClose={true}
            />

            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Bienvenido al sistema de gestión de recetas médicas
                </p>
            </div>

            {/* Estadísticas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Total Recetas */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total de Recetas
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalRecetas}</div>
                        <p className="text-xs text-muted-foreground">
                            Recetas generadas en el sistema
                        </p>
                    </CardContent>
                </Card>

                {/* Total Pacientes */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pacientes Atendidos
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalPacientes}</div>
                        <p className="text-xs text-muted-foreground">
                            Pacientes registrados
                        </p>
                    </CardContent>
                </Card>

                {/* Acción Rápida */}
                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Acción Rápida
                        </CardTitle>
                        <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <Link href="/recetas/nueva">
                            <Button className="w-full" size="sm">
                                Nueva Receta
                            </Button>
                        </Link>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                            Crear una receta médica
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Secciones Principales */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/pacientes">
                    <Card className="hover:bg-accent transition-colors cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                Pacientes
                            </CardTitle>
                            <CardDescription>
                                Gestiona el directorio de pacientes
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/recetas">
                    <Card className="hover:bg-accent transition-colors cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                                Recetas
                            </CardTitle>
                            <CardDescription>
                                Crea y administra recetas médicas
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/configuracion">
                    <Card className="hover:bg-accent transition-colors cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-blue-600" />
                                Configuración
                            </CardTitle>
                            <CardDescription>
                                Ajusta tus datos profesionales
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
