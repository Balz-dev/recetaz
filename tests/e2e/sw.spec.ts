import { test, expect } from '@playwright/test';

// Verifies that service worker is registered and offline fallback works
test.describe('Service Worker and offline', () => {
  test('service worker is registered at /sw.js', async ({ page }) => {
    await page.goto('/');

    // Wait a bit for potential registration logs
    await page.waitForTimeout(500);

    const reg = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return null;
      try {
        const r = await navigator.serviceWorker.getRegistration('/sw.js');
        return !!r;
      } catch (e) {
        return false;
      }
    });

    expect(reg).toBeTruthy();
  });

  test('offline fallback serves app shell (dashboard) for navigations', async ({ page }) => {
    // Ensure page and assets are loaded at least once to allow SW caching strategies to populate
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);

    // Go offline and navigate to a route that doesn't exist to force navigation fallback
    await page.context().setOffline(true);

    // Try to navigate to a random path which should trigger offline fallback to /dashboard (App Shell)
    const response = await page.goto('/some-non-existent-route-offline');

    // If the SW serves the App Shell, the response should be OK and body contains dashboard marker
    const body = await page.content();

    expect(response && response.status()).toBeGreaterThanOrEqual(200);
    // Verificamos que se cargó el App Shell buscando elementos del layout o dashboard
    // 'Dashboard' es el título h2 en la página de dashboard
    expect(body).toContain('Dashboard');

    // Restore online state
    await page.context().setOffline(false);
  });
});
