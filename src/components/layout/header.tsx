'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './sidebar';
import { useState, useEffect } from 'react';

/**
 * Componente Header que aparece en la parte superior.
 * En móvil muestra el botón de menú para abrir el sidebar.
 */
export function Header() {
    const [isMounted, setIsMounted] = useState(false);

    // Evitar hidratación incorrecta
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <header className="flex items-center p-4 border-b bg-white dark:bg-slate-950 md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 bg-slate-900 w-64 border-r-slate-800 text-white">
                    <Sidebar />
                </SheetContent>
            </Sheet>
            <h1 className="ml-4 font-bold text-lg">Receta-Z</h1>
        </header>
    );
}
