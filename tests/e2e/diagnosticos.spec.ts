/**
 * @fileoverview Pruebas E2E para la página de diagnósticos
 */

import { test, expect } from '@playwright/test'

test.describe('Página de Diagnósticos', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/diagnosticos')
    })

    test('navega a la página de diagnósticos', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Catálogo de Diagnósticos' })).toBeVisible()
    })

    test('muestra las estadísticas', async ({ page }) => {
        await expect(page.getByText('Total Diagnósticos')).toBeVisible()
        await expect(page.getByText('Especialidades')).toBeVisible()
        await expect(page.getByText('Más Usados')).toBeVisible()
    })

    test('busca diagnósticos por código o nombre', async ({ page }) => {
        const searchInput = page.getByPlaceholder('Buscar por código, nombre o especialidad...')
        await searchInput.fill('MG')

        // Esperar a que se carguen los resultados
        await page.waitForTimeout(600)

        // Verificar que se muestren resultados
        await expect(page.getByRole('table')).toBeVisible()
    })

    test('ordena por más usados', async ({ page }) => {
        const sortSelect = page.getByRole('combobox').first()
        await sortSelect.click()
        await page.getByText('Más usados').click()

        await expect(page.getByRole('table')).toBeVisible()
    })

    test('ordena por nombre', async ({ page }) => {
        const sortSelect = page.getByRole('combobox').first()
        await sortSelect.click()
        await page.getByText('Nombre').click()

        await expect(page.getByRole('table')).toBeVisible()
    })

    test('abre el diálogo para crear un nuevo diagnóstico', async ({ page }) => {
        await page.getByRole('button', { name: 'Nuevo Diagnóstico' }).click()

        await expect(page.getByRole('dialog')).toBeVisible()
    })

    test('muestra botones de importar y exportar', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Exportar' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Importar' })).toBeVisible()
    })

    test('muestra la columna de usos en la tabla', async ({ page }) => {
        await expect(page.getByRole('columnheader', { name: 'Usos' })).toBeVisible()
    })

    test('muestra códigos CIE-11 en la tabla', async ({ page }) => {
        const table = page.getByRole('table')
        await expect(table).toBeVisible()

        // Verificar que hay una columna de código
        await expect(page.getByRole('columnheader', { name: 'Código' })).toBeVisible()
    })

    test('muestra especialidades en la tabla', async ({ page }) => {
        const table = page.getByRole('table')
        await expect(table).toBeVisible()

        // Verificar que hay una columna de especialidad
        await expect(page.getByRole('columnheader', { name: 'Especialidad' })).toBeVisible()
    })
})
