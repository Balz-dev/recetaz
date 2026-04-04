import { test, expect } from '@playwright/test';

test.describe('Pruebas de Seguridad y Vulnerabilidades', () => {

    test('Las cabeceras de seguridad deben estar presentes (CSP, X-Frame-Options, etc)', async ({ request }) => {
        const response = await request.get('/');
        const headers = response.headers();

        expect(headers['content-security-policy']).toBeDefined();
        // Verificar políticas principales en CSP
        expect(headers['content-security-policy']).toContain("default-src 'self'");
        expect(headers['content-security-policy']).toContain("frame-src 'none'");

        // Verificar X-Frame-Options para evitar Clickjacking
        expect(headers['x-frame-options']).toBe('DENY');

        // Verificar MIME Sniffing protection
        expect(headers['x-content-type-options']).toBe('nosniff');

        // Verificar Referrer limit
        expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    });

    // En el futuro, agregar pruebas de XSS para la base de datos de plantillas
    // test('Previene ejecución de scripts en Renderizado de Plantilla (XSS)', async ({ page }) => {
    //  // ...
    // });

});
