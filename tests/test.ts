import { expect, test } from '@playwright/test';

test.describe('Weather App', () => {
    test('index page has expected title', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { name: 'Weather' })).toBeVisible();
    });
    
    test('index page has weather adding form', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByPlaceholder('Add Weather')).toBeVisible();
        await expect(page.getByLabel('Add')).toBeVisible();
    })
    
    test('index page has weather table', async ({page}) => {
        await page.goto('/');
        await expect(page.getByRole('table')).toBeVisible();
        await expect(page.getByRole('row', {name: 'London'})).toBeVisible();
    })
    
    test('index page can add new weather', async ({page}) => {
        await page.goto('/');
        
        // Check enter key works
        await expect(page.getByPlaceholder('Add Weather').fill('Mumbai')).resolves.toBeFalsy();
        await expect(page.getByPlaceholder('Add Weather').press('Enter')).resolves.toBeFalsy();
        await expect(page.getByRole('row', {name: 'Mumbai'})).toBeVisible();

        // Check add button works
        await expect(page.getByPlaceholder('Add Weather').fill('Sydney')).resolves.toBeFalsy();
        await expect(page.getByRole('button', {name: 'Add'}).click()).resolves.toBeFalsy();
        await expect(page.getByRole('row', {name: 'Sydney'})).toBeVisible();
    });
})
