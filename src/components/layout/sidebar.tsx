'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    PlusCircle
} from 'lucide-react';

/**
 * Definición de las rutas de navegación del sidebar.
 * Cada objeto contiene:
 * - href: La ruta URL
 * - label: El texto a mostrar
 * - icon: El icono de Lucide React
 */
const routes = [
    {
        href: '/',
        label: 'Dashboard',
        icon: LayoutDashboard,
    },
    {
        href: '/pacientes',
        label: 'Pacientes',
        icon: Users,
    },
    {
        href: '/recetas',
        label: 'Recetas',
        icon: FileText,
    },
];

/**
 * Componente Sidebar para la navegación principal.
 * Se adapta a móvil y escritorio.
 */
export function Sidebar() {
    const pathname = usePathname();

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
            <nav className="flex-1 px-4 space-y-2">
                {routes.map((route) => {
                    const Icon = route.icon;
                    const isActive = pathname === route.href;

                    return (
                        <Link key={route.href} href={route.href}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3 mb-1",
                                    isActive
                                        ? "bg-slate-800 text-blue-400 hover:bg-slate-800 hover:text-blue-400"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                )}
                            >
                                <Icon size={20} />
                                {route.label}
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
                <Link href="/configuracion">
                    <Button variant="ghost" className="w-full gap-2 text-slate-400 hover:text-white hover:bg-slate-800/50 mt-2">
                        <Settings size={20} />
                        Configuración
                    </Button>
                </Link>
            </div>
        </div>
    );
}
