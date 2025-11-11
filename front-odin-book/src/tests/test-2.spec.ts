import { test, expect } from '@playwright/test';

test('crear nueva publicación', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await expect(page.getByRole('textbox', { name: 'username' })).toBeVisible();
  await page.getByRole('textbox', { name: 'username' }).fill('volcarona');

  await page.getByRole('textbox', { name: 'password' }).fill('12345678');

  await page.getByRole('button', { name: 'send' }).click();

  await page.getByRole('dialog').locator('img').click();
  await page.locator('body').setInputFiles('pixel template.png');

  // Esperar a que la vista previa aparezca
  await expect(page.locator('img[alt="preview"]')).toBeVisible();

  await page.getByRole('textbox', { name: 'Description' }).fill('este es mi nueva publicacion');
  await page.getByRole('button', { name: 'send' }).click();

  await page.reload();

  await expect(page.getByText('este es mi nueva publicacion')).toBeVisible();
});
