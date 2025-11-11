import { render,screen ,waitFor} from "@testing-library/react";
import Profile from "./Profile";
import { MemoryRouter, Route, Routes } from "react-router";
import { PublicationContext, UserContext, UserSession } from "../../contex/context";
import { Following, Publications, User } from "../../types";
import { vi } from "vitest";

globalThis.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      create_at: '',
      description: '',
      id: '1',
      password: 'a',
      profileImg: '/profile.svg',
      username: 'pepitos',
    }),
  })
) as unknown as typeof fetch;
vi.mock('../../../hooks/useUsers',()=>{
    const userMock:User={
        create_at:'',
        description:'',
        id:'1',
        password:"a",
        profileImg:'',
        username:'pepitos'
    }
    return(
        {
            default:vi.fn().mockReturnValue({user:userMock})
        }
    )
})
vi.mock("../../../hooks/useFollowing",()=>{
    const followingMock:Following[]=[{
        create_at:new Date(),
        follower_id:'1',
        following_id:'2',
        id:'1'
    }]
    return(
       { 
        default:vi.fn().mockReturnValue({following:followingMock})
    }
    )
})
vi.mock("../../../hooks/getUserPublicattion",()=>{
    const publicationUserMock:Publications[]=[{
        content:"",
        create_at:new Date(),
        id:'1',
        image_url:'/profile.svg',
        user_id:'1'

    }]  
      return(
        {
            default:vi.fn().mockReturnValue({publications:publicationUserMock})
        }
    )
})
const userMockSession:User={
    id:'2',
    password:'',
    create_at:new Date().toString(),
    username:'pepito',
    profileImg:'/profile.svg',
    description:''
}
const userMock:User[]=[{
    id:'1',
    password:'asd',
    create_at:new Date().toString(),
    username:'pepitos',
    profileImg:'/profile.svg',
    description:''
}]
const publicationMock:Publications[]=[
    {
        content:"",
        create_at:new Date,
        id:'',
        image_url:'/profile.svg',
        user_id:''
    }
]
const mockDispatch = vi.fn();
it('should not display the loading text',async()=>{
    Render()
    await waitFor( ()=>{
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
    })
})
function Render(){
    return render(

       <MemoryRouter initialEntries={["/profile/pepitos"]}>
                <UserSession.Provider value={{user:userMockSession,loading:false}}>
                    <UserContext.Provider value={userMock} >

                        <PublicationContext.Provider value={ {state:{publications:publicationMock},dispatch:mockDispatch}}>
                             <Routes>
                                  <Route path="/profile/:username" element={<Profile />} />
                             </Routes>

                        </PublicationContext.Provider>
                    </UserContext.Provider>

                </UserSession.Provider>
            </MemoryRouter>
    )
}