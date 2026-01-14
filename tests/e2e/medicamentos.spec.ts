/**
 * @fileoverview Pruebas E2E para la página de medicamentos
 */

import { test, expect } from '@playwright/test'

test.describe('Página de Medicamentos', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/medicamentos')
    })

    test('navega a la página de medicamentos', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Catálogo de Medicamentos' })).toBeVisible()
    })

    test('muestra las estadísticas', async ({ page }) => {
        await expect(page.getByText('Total Medicamentos')).toBeVisible()
        await expect(page.getByText('Del Catálogo')).toBeVisible()
        await expect(page.getByText('Personalizados')).toBeVisible()
    })

    test('busca medicamentos por nombre', async ({ page }) => {
        const searchInput = page.getByPlaceholder('Buscar medicamento...')
        await searchInput.fill('Paracetamol')

        // Esperar a que se carguen los resultados
        await page.waitForTimeout(600)

        // Verificar que se muestren resultados
        await expect(page.getByRole('table')).toBeVisible()
    })

    test('filtra medicamentos por categoría', async ({ page }) => {
        const categorySelect = page.locator('select').first()
        await categorySelect.selectOption({ label: 'Todas las categorías' })

        await expect(page.getByRole('table')).toBeVisible()
    })

    test('ordena por más usados', async ({ page }) => {
        const sortSelect = page.getByRole('combobox').last()
        await sortSelect.click()
        await page.getByText('Más usados').click()

        await expect(page.getByRole('table')).toBeVisible()
    })

    test('abre el diálogo para crear un nuevo medicamento', async ({ page }) => {
        await page.getByRole('button', { name: 'Nuevo Medicamento' }).click()

        await expect(page.getByRole('dialog')).toBeVisible()
        await expect(page.getByText('Nuevo Medicamento')).toBeVisible()
    })

    test('muestra botones de importar y exportar', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Exportar' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Importar' })).toBeVisible()
    })

    test('navega entre páginas', async ({ page }) => {
        const nextButton = page.getByRole('button', { name: 'Siguiente' })
        const prevButton = page.getByRole('button', { name: 'Anterior' })

        await expect(prevButton).toBeDisabled()

        // Si hay más de 20 medicamentos, el botón siguiente debería estar habilitado
        const isNextEnabled = await nextButton.isEnabled()
        if (isNextEnabled) {
            await nextButton.click()
            await expect(prevButton).toBeEnabled()
        }
    })
})
