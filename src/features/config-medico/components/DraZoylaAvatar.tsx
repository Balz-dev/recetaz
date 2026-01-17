import React from 'react';
import { cn } from '@/shared/lib/utils';

interface DraZoylaAvatarProps {
    /** 
     * Pose del avatar (1-10) 
     * 1: Saluda
     * 2: Apunta Izquierda
     * 3: Apunta Izquierda (Sutil)
     * 4: Apunta Derecha
     * 5: Apunta Derecha (Sutil)
     * 6: Apunta Abajo
     * 7: Apunta Arriba
     * 8: Apunta Arriba-Derecha
     * 9: Entusiasmo (OK)
     * 10: Extra
     */
    pose: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    className?: string;
}

/**
 * Componente que renderiza a la Dra. Zoyla usando un sprite sheet.
 * Cada frame tiene 300px de ancho.
 */
export function DraZoylaAvatar({ pose, className }: DraZoylaAvatarProps) {
    // Calculamos la posición del background.
    // El sprite es horizontal, cada frame mide 300px.
    // Restamos 1 al pose porque es 1-indexed pero el cálculo es 0-indexed.
    const backgroundPositionX = -(pose - 1) * 300;

    return (
        <div
            className={cn("overflow-hidden relative", className)}
            style={{
                width: '300px',
                height: '300px' // Asumiendo altura cuadrada o ajustada por contenedor, pero fijamos base
            }}
            aria-hidden="true"
        >
            <div
                className="absolute top-0 left-0 h-full"
                style={{
                    width: '3000px', // 10 frames * 300px
                    backgroundImage: 'url(/dra-zoyla/sprite.png)',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: `${backgroundPositionX}px 0`,
                    backgroundSize: '3000px auto' // Asegura que el sprite mantenga su escala
                }}
            />
        </div>
    );
}
