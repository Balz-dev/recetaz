'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    PlusCircle,
    Pill,
    Calendar,
    FolderOpen,
    DollarSign,
    Lock,
    FileType,
    Activity,
    ChevronLeft,
    Menu
} from 'lucide-react';
import { PremiumModal } from '@/shared/components/modals/PremiumModal';
import { Tooltip } from '@/shared/components/ui/tooltip';
import { UserProfile } from '@/shared/components/layout/UserProfile';

/**
 * Definición de las rutas de navegación del sidebar.
 */
const routes = [
    {
        href: '/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        premium: false,
    },
    {
        href: '/pacientes',
        label: 'Pacientes',
        icon: Users,
        premium: false,
    },
    {
        href: '/recetas',
        label: 'Recetas',
        icon: FileText,
        premium: false,
    },
    {
        href: '/medicamentos',
        label: 'Medicamentos',
        icon: Pill,
        premium: false,
    },
    {
        href: '/diagnosticos',
        label: 'Diagnósticos',
        icon: Activity,
        premium: false,
    },
    {
        href: '/agenda',
        label: 'Agenda',
        icon: Calendar,
        premium: true,
        description: 'Gestiona tus citas médicas y recordatorios de manera eficiente.',
        landingUrl: 'https://ejemplo.com/agenda-premium' // TODO: Actualizar con URL real
    },
    {
        href: '/expedientes',
        label: 'Expedientes',
        icon: FolderOpen,
        premium: true,
        description: 'Lleva un control detallado del historial clínico de tus pacientes.',
        landingUrl: 'https://ejemplo.com/expedientes-premium' // TODO: Actualizar con URL real
    },
    {
        href: '/finanzas',
        label: 'Finanzas',
        icon: DollarSign,
        premium: true,
        description: 'Controla tus ingresos y gastos de tu consultorio.',
        landingUrl: 'https://ejemplo.com/finanzas-premium' // TODO: Actualizar con URL real
    },
];


/**
 * Componente Sidebar para la navegación principal.
 * Se adapta a móvil y escritorio.
 */
export function Sidebar() {
    const pathname = usePathname();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState<{ title: string, desc: string, url: string } | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleNavigation = (e: React.MouseEvent, route: any) => {
        if (route.premium) {
            e.preventDefault();
            setSelectedFeature({
                title: route.label,
                desc: route.description,
                url: route.landingUrl
            });
            setModalOpen(true);
        }
    };

    return (
        <div className={cn(
            "flex flex-col h-full bg-slate-900 text-white border-r border-slate-800 transition-all duration-300 ease-in-out relative",
            isCollapsed ? "w-20" : "w-64"
        )}>
            {/* Perfil del Médico - PRIORIDAD SUPERIOR */}
            <div className={cn("p-4 transition-all duration-300", isCollapsed ? "px-2" : "px-4")}>
                <UserProfile isCollapsed={isCollapsed} className="mb-2" />
            </div>

            {/* Separador sutil opcional */}
            <div className="px-6 mb-2">
                <div className="h-px bg-slate-800/50 w-full" />
            </div>

            {/* Botón de Toggle */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 z-20 h-6 w-6 rounded-full border border-slate-700 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all shadow-md items-center justify-center p-0 hidden md:flex"
            >
                {isCollapsed ? <Menu size={14} /> : <ChevronLeft size={14} />}
            </Button>

            {/* Navegación Principal */}
            <nav className={cn("flex-1 px-4 space-y-1 overflow-y-auto overflow-x-hidden", isCollapsed && "px-2")}>
                {routes.map((route) => {
                    const Icon = route.icon;
                    const isActive = pathname === route.href;

                    return (
                        <Tooltip key={route.href} content={route.label} disabled={!isCollapsed}>
                            <Link
                                href={route.href}
                                onClick={(e) => handleNavigation(e, route)}
                                className="w-full block"
                                prefetch={route.premium ? false : undefined}
                            >
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full mb-0.5 relative group transition-all duration-300 h-10",
                                        isCollapsed ? "justify-center px-0" : "justify-start gap-3",
                                        isActive
                                            ? "bg-slate-800 text-blue-400 hover:bg-slate-800 hover:text-blue-400"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    )}
                                >
                                    <Icon size={18} className={cn("shrink-0", isCollapsed ? "" : "")} />
                                    {!isCollapsed && <span className={cn(route.premium && "mr-auto", "text-sm truncate animate-in slide-in-from-left-2 duration-300")}>{route.label}</span>}

                                    {route.premium && !isCollapsed && (
                                        <div className="flex items-center shrink-0">
                                            <div className="bg-blue-500/10 text-blue-400 text-[9px] px-1.5 py-0.5 rounded border border-blue-500/20 flex items-center gap-1">
                                                <span>FUTURO</span>
                                            </div>
                                        </div>
                                    )}
                                </Button>
                            </Link>
                        </Tooltip>
                    );
                })}
            </nav>

            {/* Acciones Rápidas - Empujadas hacia arriba */}
            <div className={cn("p-4 flex flex-col gap-2 transition-all duration-300", isCollapsed && "p-2 items-center")}>
                <Tooltip content="Nueva Receta" disabled={!isCollapsed}>
                    <Link href="/recetas?create=true" className="w-full">
                        <Button className={cn(
                            "gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all duration-300 border-b-4 border-blue-800 h-11",
                            isCollapsed ? "w-10 h-10 p-0 justify-center rounded-lg" : "w-full"
                        )}>
                            <PlusCircle size={18} />
                            {!isCollapsed && <span className="text-sm font-bold animate-in fade-in duration-300">Nueva Receta</span>}
                        </Button>
                    </Link>
                </Tooltip>

                <div className="grid grid-cols-1 gap-2">
                    <Tooltip content="Plantilla" disabled={!isCollapsed}>
                        <Link href="/recetas/plantillas/nueva" className="w-full">
                            <Button variant="outline" className={cn(
                                "gap-2 border-slate-700/50 bg-slate-800/20 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all duration-300 group h-10",
                                isCollapsed ? "w-10 h-10 p-0 justify-center rounded-lg" : "w-full justify-start"
                            )}>
                                <FileType size={18} className="group-hover:scale-110 transition-transform duration-100" />
                                {!isCollapsed && <span className="text-xs animate-in fade-in duration-300">Plantillas</span>}
                            </Button>
                        </Link>
                    </Tooltip>

                    <Tooltip content="Ajustes" disabled={!isCollapsed}>
                        <Link href="/configuracion" className="w-full">
                            <Button variant="ghost" className={cn(
                                "gap-2 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300 h-10",
                                isCollapsed ? "w-10 h-10 p-0 justify-center rounded-lg" : "w-full justify-start"
                            )}>
                                <Settings size={18} />
                                {!isCollapsed && <span className="text-xs animate-in fade-in duration-300">Configuración</span>}
                            </Button>
                        </Link>
                    </Tooltip>
                </div>
            </div>


            {/* Logo al final con separación del bottom */}
            <div className="mt-8 mb-12 p-4 flex justify-center items-center">
                <div className={cn(
                    "flex items-center justify-center bg-slate-800/30 border border-slate-700/50 rounded-2xl transition-all duration-300",
                    isCollapsed ? "w-12 h-12" : "w-32 h-14"
                )}>
                    <Link href="/dashboard" className="opacity-80 hover:opacity-100 transition-opacity">
                        {isCollapsed ? (
                            <Image src="/favicon.ico" alt="Logo mini" width={24} height={24} />
                        ) : (
                            <Image
                                src="/fenotipo.svg"
                                alt="Logo"
                                width={80}
                                height={18}
                                style={{ width: 'auto', height: '18px', filter: 'brightness(0) invert(1)' }}
                                priority
                            />
                        )}
                    </Link>
                </div>
            </div>

            {/* Modal Premium */}
            {selectedFeature && (
                <PremiumModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    featureTitle={selectedFeature.title}
                    featureDescription={selectedFeature.desc}
                    landingPageUrl={selectedFeature.url}
                />
            )}
        </div>
    );
}
