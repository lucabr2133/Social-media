import { describe, it,expect ,vi,afterEach,} from "vitest";
// 
globalThis.fetch = vi.fn()
import {cleanup, render, screen} from '@testing-library/react'
import React from "react";
import { MemoryRouter } from "react-router";
// src/setupTests.ts (o donde esté tu setup de test)
import '@testing-library/jest-dom';
import { errorMesagges } from "../../types";
import userEvent from "@testing-library/user-event"


import Signup from "./Signup";
describe('Signup.tsx',async()=>{
     it('should display the error div when user is missing',async()=>{
      
        render(<MemoryRouter>
         <Signup></Signup>
        </MemoryRouter>)
        const buttonSend=screen.getByRole('button')
        await userEvent.click(buttonSend)
       const errorUserDiv = screen.getByRole('alert')

    expect(errorUserDiv.textContent).toBe("Username is required")
     })
     it('should display the error user lenght',async()=>{
      
        render(<MemoryRouter>
         <Signup></Signup>
        </MemoryRouter>)
        const buttonSend=screen.getByRole('button')
        const userInput= screen.getByLabelText('userinput') as HTMLInputElement
        const passwordinput=screen.getByLabelText('passwordinput') as HTMLInputElement
        await userEvent.type(userInput,'a')
        await userEvent.type(passwordinput,'VALIDpassword')

        await userEvent.click(buttonSend)
       const errorUserDiv = await screen.findByRole('alert')
         
    expect(errorUserDiv.textContent).toBe("Minimum 8 characters")
     })
     it('should display the error password is missing',async()=>{
      
        render(<MemoryRouter>
         <Signup></Signup>
        </MemoryRouter>)
        const buttonSend=screen.getByRole('button')
        const userInput= screen.getByLabelText('userinput') as HTMLInputElement
        await userEvent.type(userInput,'ValidUser')

        await userEvent.click(buttonSend)
       const errorUserDiv = await screen.findByLabelText('errorPassword')
         
    expect(errorUserDiv.textContent).toBe("Password is required")
     })
     it('should display the error user lenght',async()=>{
      
        render(<MemoryRouter>
         <Signup></Signup>
        </MemoryRouter>)
        const buttonSend=screen.getByRole('button')
        const userInput= screen.getByLabelText('userinput') as HTMLInputElement
        const passwordinput=screen.getByLabelText('passwordinput') as HTMLInputElement
        await userEvent.type(userInput,'validuser')
        await userEvent.type(passwordinput,'a')

        await userEvent.click(buttonSend)
       const errorUserDiv = await screen.findByLabelText('errorPassword')
         
    expect(errorUserDiv.textContent).toBe("Minimum 8 characters")
     })
// it('should call onHandleSubmitSign when form is submitted', async () => {
//   // Paso 1: mockear antes del import
//   vi.doMock('../../../services/onHandleSign.ts', () => ({
//     default: vi.fn().mockResolvedValue({ user: 'testUser' })
//   }))

//   // Paso 2: importar dinámicamente
//   const { default: Signup } = await import('./Signup')
//   const { default: onHandleSubmitSign } = await import('../../../services/onHandleSign')

//   // Paso 3: renderizar y simular evento
//   render(
//     <MemoryRouter>
//       <Signup />
//     </MemoryRouter>
//   )

//   await userEvent.click(screen.getByRole('button'))

//   // Paso 4: verificar si fue llamado
//   expect(onHandleSubmitSign).toHaveBeenCalled()
// })
 
     afterEach(()=>{
      cleanup()
      vi.resetModules()
  vi.clearAllMocks()
     })
      
})