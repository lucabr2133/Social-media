import {test,expect} from '@playwright/test'
test('my first playwright test',async({page})=>{
   await page.goto('http://localhost:5173/')
  await expect( page.getByText('Login',{exact:true})).toBeVisible()
})
