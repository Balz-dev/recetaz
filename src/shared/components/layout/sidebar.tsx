'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
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
    FileType
} from 'lucide-react';
import { PremiumModal } from '@/shared/components/modals/PremiumModal';

/**
 * Definición de las rutas de navegación del sidebar.
 */
const routes = [
    {
        href: '/',
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
        <div className="flex flex-col h-full bg-slate-900 text-white w-64 border-r border-slate-800">
            {/* Header del Sidebar */}
            <div className="p-3">
                <h1 className="p-0 text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    <Image src="/fenotipo.png" alt="Logo" width={200} height={200} />
                </h1>
                <p className=" pt-0 text-xs text-slate-400 mt-1 text-[10px] color-cyan-400">Tu aliado en la creación de recetas médicas</p>
            </div>

            {/* Navegación Principal */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                {routes.map((route) => {
                    const Icon = route.icon;
                    const isActive = pathname === route.href;

                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            onClick={(e) => handleNavigation(e, route)}
                        >
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3 mb-1 relative group",
                                    isActive
                                        ? "bg-slate-800 text-blue-400 hover:bg-slate-800 hover:text-blue-400"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                )}
                            >
                                <Icon size={20} />
                                <span className={cn(route.premium && "mr-auto")}>{route.label}</span>

                                {route.premium && (
                                    <div className="flex items-center">
                                        <div className="bg-amber-500/10 text-amber-500 text-[10px] px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                                            <Lock size={10} />
                                            <span>PRO</span>
                                        </div>
                                    </div>
                                )}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            {/* Acciones Rápidas */}
            <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
                <Link href="/recetas/nueva">
                    <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                        <PlusCircle size={20} />
                        Nueva Receta
                    </Button>
                </Link>
                <Link href="/recetas/plantillas/nueva">
                    <Button variant="outline" className="w-full gap-2 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800/50">
                        <FileType size={20} />
                        Plantilla Receta
                    </Button>
                </Link>
                <Link href="/configuracion">
                    <Button variant="ghost" className="w-full gap-2 text-slate-400 hover:text-white hover:bg-slate-800/50 mt-2">
                        <Settings size={20} />
                        Configuración
                    </Button>
                </Link>
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
