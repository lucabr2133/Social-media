import path from 'path';
import { fileURLToPath } from 'url';
import { test, expect } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('test', async ({ page }) => {
  const filePath = path.resolve(__dirname, 'assets', 'pixel-template.png');
  console.log('Ruta usada para el archivo:', filePath);

  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'username' }).fill('volcarona');
  await page.getByRole('textbox', { name: 'password' }).fill('12345678');
  await page.getByRole('button', { name: 'send' }).click();

  await page.getByRole('button').click();
  const inputFile = page.locator('input[type="file"]');
  await inputFile.setInputFiles(filePath);

  await page.getByRole('textbox', { name: 'Description' }).fill('lolerosss');
  await page.getByRole('button', { name: 'Create' }).click();

  await page.reload();
  await page.getByRole('link', { name: 'Profile' }).click();
  await page.waitForLoadState('networkidle');

  await expect(page.getByText('lolerosss').first()).toBeVisible({ timeout: 7000 });
});
