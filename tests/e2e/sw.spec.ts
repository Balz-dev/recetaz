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

  test('offline fallback serves offline.html for navigations', async ({ page }) => {
    // Ensure page and assets are loaded at least once to allow SW caching strategies to populate
    await page.goto('/');
    await page.waitForTimeout(500);

    // Go offline and navigate to a route that doesn't exist to force navigation fallback
    await page.context().setOffline(true);

    // Try to navigate to a random path which should trigger offline fallback to offline.html
    const response = await page.goto('/some-non-existent-route');

    // If the SW serves offline.html, the response should be OK and body contains 'offline' marker
    // We check the page content for the presence of the word 'offline' (offline.html in this project)
    const body = await page.content();

    expect(response && response.status()).toBeGreaterThanOrEqual(200);
    expect(body.toLowerCase()).toContain('offline');

    // Restore online state
    await page.context().setOffline(false);
  });
});
