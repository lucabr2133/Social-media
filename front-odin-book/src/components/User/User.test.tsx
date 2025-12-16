/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-undef */
import { describe, it, vi } from "vitest";




globalThis.fetch=vi.fn()
vi.mock('../../../hooks/useFollowing', () => {
 
  const followingMock = [{
    create_at: new Date(),
    follower_id: '1',
    following_id: '2',
    id: ''
  }];

  // Devuelve el mock de la función por defecto del hook
  return {
    default: vi.fn().mockReturnValue({following:followingMock})
  };
});

import { Users } from "./User";
import { MemoryRouter } from "react-router";
import { Following, Publications, User } from "../../types";
import { UserSession ,UserContext, PublicationContext} from "../../contex/context";
import { cleanup, render,screen } from "@testing-library/react";
import CreatePublication from "../CreatePublication/CreatePublication";
import userEvent from "@testing-library/user-event";

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
})
it('should display the Users correctly',()=>{
    RenderElement()
    expect(screen.getByText('pepitos')).toBeInTheDocument()
})
it('should the following text work correctly',async()=>{
    RenderElement()
    expect(screen.getByText('Unfollow')).toBeInTheDocument()

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
                         <Users>
                         </Users>
                        </PublicationContext.Provider>
                    </UserSession.Provider>
                </UserContext.Provider>
            </MemoryRouter>)
    
}