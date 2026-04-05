/**
 * Utilidades de navegación para manejar redirecciones y recargas
 * que requieren interacción directa con window.location,
 * permitiendo un mockeo sencillo en entornos de prueba (JSDOM/Jest).
 */

export const navigation = {
    /**
     * Redirige a una URL específica usando window.location.href.
     * @param url - La URL de destino.
     */
    redirect: (url: string): void => {
        if (typeof window !== "undefined") {
            window.location.href = url;
        }
    },

    /**
     * Recarga la página actual usando window.location.reload().
     */
    reload: (): void => {
        if (typeof window !== "undefined") {
            window.location.reload();
        }
    }
};
