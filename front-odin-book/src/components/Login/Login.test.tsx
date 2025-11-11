import { cleanup, render,screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { describe,vi,afterEach,it } from "vitest"
import Login from "./Login"
import { errorMesagges, User } from "../../types"
import userEvent from "@testing-library/user-event"
const userMockSession:User={
    id:'2',
    password:'',
    create_at:new Date().toString(),
    username:'pepito',
    profileImg:'',
    description:''
}
globalThis.fetch=vi.fn().mockResolvedValue(userMockSession)

// vi.mock("../../../hooks/getUserSession",()=>({
//     default:vi.fn()
// }))
describe('Render login',()=>{
    it('should render login correctly',()=>{
        Render()
    })
    it('should display the error username required ',async()=>{
        Render()
        const usernameInput=screen.getByLabelText('username')
        await userEvent.click(screen.getByLabelText('send'))
         expect( await screen.findByText('Username is required')).toBeInTheDocument()
    })
      it('should display the error username min lenght ',async()=>{
        Render()
        const usernameInput=screen.getByLabelText('username')
        const passwordinput=screen.getByLabelText('password')

        await userEvent.type(usernameInput,'aa')
        await userEvent.type(passwordinput,'aaaaaaaa')

        await userEvent.click(screen.getByLabelText('send'))
         expect( await screen.findByText("Minimum 8 characters")).toBeInTheDocument()
    })
        it('should display the error password required ',async()=>{
        Render()
        const usernameInput=screen.getByLabelText('username')

        await userEvent.type(usernameInput,'aa')

        await userEvent.click(screen.getByLabelText('send'))
         expect( await screen.findByText("Password is required")).toBeInTheDocument()
    })
      it('should display the error password min lenght ',async()=>{
   Render();
  
  const userInput = screen.getByLabelText('username') as HTMLInputElement;
  const passwordinput = screen.getByLabelText('password') as HTMLInputElement;
  const buttonSend = screen.getByRole('button', { name: 'send' });

  await userEvent.type(userInput, 'validuser');
  await userEvent.type(passwordinput, 'a');

  await userEvent.click(buttonSend);

  // Usa solo esta línea para encontrar el error
const errorMessage = await screen.findByText("Minimum 8 characters");


  expect(errorMessage).toBeInTheDocument();
    })
})
function Render(){
    return render(
        <MemoryRouter>
            <Login>

            </Login>
        </MemoryRouter>
    )
}
afterEach(()=>{
    cleanup()
})