/**
 * @fileoverview Página Principal - Dashboard
 * 
 * Esta es la página de inicio del sistema de gestión de recetas médicas.
 * Muestra un dashboard con estadísticas generales, accesos rápidos a las
 * principales funcionalidades y el panel de finanzas.
 * 
 * Funcionalidades:
 * - Verificación de configuración inicial del médico
 * - Estadísticas de recetas y pacientes
 * - Accesos rápidos a módulos principales
 * - Panel de ganancias de los últimos 7 días
 * - Modal de configuración inicial (si no existe configuración)
 */

"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { medicoService } from "@/features/config-medico/services/medico.service";
import { recetaService } from "@/features/recetas/services/receta.service";
import { pacienteService } from "@/features/pacientes/services/paciente.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { FileText, Users, Activity, Plus, ArrowRight, ClipboardList, Settings } from "lucide-react";
import Link from "next/link";
import { PanelGanancias } from "@/features/finanzas/components/PanelGanancias";
import { RecetaDialog } from "@/features/recetas/components/RecetaDialog";
import { motion } from "framer-motion";

/**
 * Componente de la página principal del sistema.
 * 
 * Muestra un dashboard rediseñado con:
 * - Saludo personalizado al médico
 * - Estadísticas tipo KPI con diseño minimalista
 * - Tarjetas de navegación interactivas con gradientes y animaciones
 * - Panel de finanzas integrado
 * 
 * @returns Página de dashboard con experiencia de usuario mejorada
 */
export default function HomePage() {
    const router = useRouter();
    const [medicoNombre, setMedicoNombre] = useState<string>("");
    const [stats, setStats] = useState({
        totalRecetas: 0,
        totalPacientes: 0,
        loading: true
    });
    const [showRecetaDialog, setShowRecetaDialog] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Cargar datos del médico y estadísticas en paralelo
                const [medico, recetas, pacientes] = await Promise.all([
                    medicoService.get(),
                    recetaService.getAll(),
                    pacienteService.getAll()
                ]);

                if (medico) {
                    setMedicoNombre(medico.nombre);
                }

                setStats({
                    totalRecetas: recetas.length,
                    totalPacientes: pacientes.length,
                    loading: false
                });
            } catch (error) {
                console.error("Error cargando datos del dashboard:", error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };
        loadInitialData();
    }, [router]);

    const handleRecetaSuccess = () => {
        setStats(prev => ({ ...prev, totalRecetas: prev.totalRecetas + 1 }))
        setShowRecetaDialog(false)
    }

    if (stats.loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                >
                    <Activity className="h-12 w-12 text-blue-600" />
                </motion.div>
            </div>
        );
    }

    // Variantes para animaciones de entrada
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <motion.div
            className="space-y-6 pb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <RecetaDialog
                open={showRecetaDialog}
                onOpenChange={setShowRecetaDialog}
                onSuccess={handleRecetaSuccess}
            />

            {/* Header Rediseñado: Equilibrio entre Impacto y Espacio */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 border-2 border-white dark:border-slate-800 shadow-xl shadow-blue-200/20 transition-transform hover:scale-105">
                        <img
                            src="/dra-zoyla/saluda.png"
                            alt="Dra. Zoyla Avatar"
                            className="h-full w-full object-cover object-top scale-110 translate-y-1"
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            {medicoNombre ? `¡Hola, Dr. ${medicoNombre.split(' ')[0]}!` : '¡Bienvenido!'}
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground">
                            Esto es lo que está pasando en su consultorio hoy.
                        </p>
                    </div>
                </div>
                <Button
                    size="lg"
                    onClick={() => setShowRecetaDialog(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 dark:shadow-none transition-all hover:scale-105 active:scale-95 group px-8 py-4 rounded-2xl h-auto"
                >
                    <Plus className="mr-2 h-5 w-5" /> <span className="font-bold">Nueva Receta</span>
                </Button>
            </motion.div>

            {/* Estadísticas KPI (Diseño Limpio y Elegante) */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Recetas</p>
                        <h3 className="text-xl font-bold">{stats.totalRecetas}</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Pacientes</p>
                        <h3 className="text-xl font-bold">{stats.totalPacientes}</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                        <Activity className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Estatus</p>
                        <h3 className="text-xl font-bold text-green-600 dark:text-green-400">Online</h3>
                    </div>
                </div>

                <div className="hidden lg:flex bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <Plus className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Demostración</p>
                        <h3 className="text-xl font-bold text-blue-500">Activa</h3>
                    </div>
                </div>
            </motion.div>

            {/* Navegación Principal (Tarjetas Premium Balanceadas) */}
            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/pacientes" className="group">
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="relative overflow-hidden h-full bg-white dark:bg-slate-900 py-4 px-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all group-hover:border-blue-200 dark:group-hover:border-blue-800"
                    >
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                                    <Users className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-bold mb-1">Pacientes</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Gestión completa de su base de datos de pacientes de forma eficiente.
                                </p>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                                Ir a Pacientes <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                        </div>
                    </motion.div>
                </Link>

                <Link href="/recetas" className="group">
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="relative overflow-hidden h-full bg-white dark:bg-slate-900 py-4 px-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all group-hover:border-indigo-200 dark:group-hover:border-indigo-800"
                    >
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-bold mb-1">Recetas</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Administre sus prescripciones, plantillas y archivos históricos.
                                </p>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform">
                                Ver Recetas <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                        </div>
                    </motion.div>
                </Link>

                <Link href="/configuracion" className="group">
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="relative overflow-hidden h-full bg-white dark:bg-slate-900 py-4 px-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all group-hover:border-slate-300 dark:group-hover:border-slate-700"
                    >
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 mb-3 group-hover:scale-110 transition-transform">
                                    <Settings className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-bold mb-1">Configuración</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Ajuste sus datos profesionales, firmas, logotipos y preferencias.
                                </p>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-slate-600 font-semibold group-hover:translate-x-2 transition-transform">
                                Configurar <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                        </div>
                    </motion.div>
                </Link>
            </div>

            {/* Panel de Finanzas (Con espacio superior reducido) */}
            <motion.div variants={itemVariants} className="pt-2">
                <PanelGanancias />
            </motion.div>
        </motion.div>
    );
}
