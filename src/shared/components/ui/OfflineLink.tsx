/**
 * Link optimizado para navegación offline en rutas dinámicas.
 * 
 * Usa window.location.href en lugar de Next.js router para evitar
 * intentos de fetch de RSC payload que fallan offline.
 * 
 * @param props - Propiedades del link
 * @param props.href - URL de destino
 * @param props.children - Contenido del link
 * @param props.className - Clases CSS opcionales
 * @param props.onClick - Handler de click opcional
 */

import { ReactNode } from 'react';

interface OfflineLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function OfflineLink({ href, children, className, onClick }: OfflineLinkProps) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Si hay un onClick personalizado, ejecutarlo primero
        if (onClick) {
            onClick(e);
            // Si el onClick hizo preventDefault, no navegamos
            if (e.defaultPrevented) {
                return;
            }
        }

        e.preventDefault();
        window.location.href = href;
    };

    return (
        <a href={href} onClick={handleClick} className={className}>
            {children}
        </a>
    );
}
