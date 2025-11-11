import { test, expect } from '@playwright/test';

test('should be login succesfully', async ({ page }) => {
await page.goto('http://localhost:5173/');
await page.getByRole('textbox', { name: 'username' }).click();
await page.getByRole('textbox', { name: 'username' }).fill('volcarona');
await page.getByRole('textbox', { name: 'password' }).click({
    modifiers: ['ControlOrMeta']
  });
await page.getByRole('textbox', { name: 'password' }).fill('12345678');
await page.getByRole('textbox', { name: 'password' }).click();
await page.getByRole('button', { name: 'send' }).click();
expect(page.getByText('Inicio',{exact:true}))
});