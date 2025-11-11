import { describe, it, vi } from "vitest";



globalThis.fetch=vi.fn()
vi.mock('../../../hooks/useMessages', () => {
 
  const messages:messageType[] = [{
    create_at: new Date(),
    content:"hola papus",
    receptor_id:'1',
    sender_id:'2',
    id: ''
  }];

  // Devuelve el mock de la función por defecto del hook
  return {
    default: vi.fn().mockReturnValue({messages})
  };
});

import { MemoryRouter } from "react-router";
import { Following, Messages as messageType, Publications, User } from "../../types";
import { UserSession ,UserContext, PublicationContext} from "../../contex/context";
import { cleanup, render,screen } from "@testing-library/react";
import CreatePublication from "../CreatePublication/CreatePublication";
import userEvent from "@testing-library/user-event";
import { Messages } from "./Messages";

const userMock:User[]=[{
    id:'1',
    password:'asd',
    create_at:new Date().toString(),
    username:'pepitos',
    profileImg:'',
    description:''
}]
const userMockSession:User={
    id:'2',
    password:'',
    create_at:new Date().toString(),
    username:'pepito',
    profileImg:'',
    description:''
}
const publicationMock:Publications[]=[
    {
        content:"",
        create_at:new Date,
        id:'',
        image_url:'',
        user_id:''
    }
]
const mockDispatch = vi.fn();

    // 2. Define el valor que el proveedor de contexto devolverá.
    //    Debe tener la forma que espera el componente (un objeto con 'dispatch').
   
describe('User component',()=>{
    it('should render the user component',()=>{
          RenderElement()
      expect (screen.queryByText('loading...') ).toBe(null)
      expect(screen.queryByText('pepitos')).toBeInTheDocument()

})
it('should display a message correctly',async()=>{
    RenderElement()
    const buttonDiv=screen.getByText('send')
    await userEvent.click(buttonDiv)
    expect(await screen.findByText('hola papus')).toBeInTheDocument()
})

})
afterEach(()=>{
    cleanup()
})
function RenderElement(){
    return render(
          <MemoryRouter>
                <UserContext.Provider value={userMock}>
                    <UserSession.Provider value={{user:userMockSession,loading:false}}>
                     
                        <PublicationContext.Provider value={{state:{publications:publicationMock},dispatch:mockDispatch}} >
                         <Messages>
                         </Messages>
                        </PublicationContext.Provider>
                    </UserSession.Provider>
                </UserContext.Provider>
            </MemoryRouter>)
    
}