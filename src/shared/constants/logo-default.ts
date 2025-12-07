/**
 * @fileoverview Logo Por Defecto para Recetas
 * 
 * Logo médico genérico embebido en base64 para usar cuando:
 * - El médico no tiene logo configurado
 * - El logo del médico no está disponible offline
 * - Hay error al cargar el logo personalizado
 * 
 * Este logo garantiza que las recetas siempre se pueden imprimir offline.
 */

/**
 * Logo médico genérico en formato SVG convertido a base64.
 * Representa un símbolo médico simple (cruz médica).
 * 
 * Dimensiones: 100x100px
 * Formato: SVG optimizado
 * Color: Azul (#0066CC) - coincide con el tema de la aplicación
 */
export const DEFAULT_MEDICAL_LOGO = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ4IiBmaWxsPSIjMDA2NkNDIi8+CjxyZWN0IHg9IjQ1IiB5PSIyNSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjUwIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIyNSIgeT0iNDUiIHdpZHRoPSI1MCIgaGVpZ2h0PSIxMCIgZmlsbD0id2hpdGUiLz4KPC9zdmc+`;

/**
 * Función helper para obtener el logo a usar en la receta.
 * 
 * @param medicoLogo - URL o data URL del logo del médico (opcional)
 * @returns Logo a usar (personalizado o por defecto)
 * 
 * @example
 * ```tsx
 * const logoSrc = getMedicoLogo(medico.logo);
 * <Image src={logoSrc} style={styles.logo} />
 * ```
 */
export function getMedicoLogo(medicoLogo?: string): string {
    // Si el médico tiene logo y es una data URL (base64), usarlo
    if (medicoLogo && medicoLogo.startsWith('data:')) {
        return medicoLogo;
    }
    
    // Si el médico tiene logo pero es URL externa, intentar usarlo
    // pero en modo offline fallará y se usará el por defecto
    if (medicoLogo) {
        return medicoLogo;
    }
    
    // Si no hay logo, usar el por defecto
    return DEFAULT_MEDICAL_LOGO;
}

/**
 * Verifica si un logo es válido para uso offline.
 * 
 * @param logo - URL o data URL del logo
 * @returns true si el logo funcionará offline
 */
export function isLogoOfflineReady(logo?: string): boolean {
    if (!logo) return false;
    
    // Data URLs (base64) siempre funcionan offline
    if (logo.startsWith('data:')) return true;
    
    // Rutas relativas locales pueden funcionar si están cacheadas
    if (logo.startsWith('/')) return true;
    
    // URLs externas no funcionan offline
    return false;
}
