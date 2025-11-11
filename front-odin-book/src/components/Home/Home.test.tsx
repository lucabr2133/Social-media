import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe,it, vi } from "vitest";
import Home from "./Home";
import { Likes, Publications, User } from "../../types";
import { PublicationContext, UserContext, UserSession } from "../../contex/context";
import useLikesPublication from "../../../hooks/useLikes";
globalThis.fetch=vi.fn()
vi.mock('../../../hooks/useLikes',()=>{
    const likesMock:Likes[]=[{
id:'1',
user_id:'2',
post_id:'1'
    }]
    return  (
       { default:vi.fn().mockReturnValue({publicationLikes:likesMock})}
    )
})
vi.mock('../../../hooks/getPublications',()=>{
    const publicationMock:Publications[]=[{
id:'1',
user_id:'2',
content:'',
create_at:new Date(),
image_url:''
    }]
    return  (
       { default:vi.fn().mockReturnValue({publication:publicationMock})}
    )
})

const userMockSession:User={
    id:'2',
    password:'',
    create_at:new Date().toString(),
    username:'pepito',
    profileImg:'',
    description:''
}
const userMock:User[]=[{
    id:'1',
    password:'asd',
    create_at:new Date().toString(),
    username:'pepitos',
    profileImg:'',
    description:''
}]
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
describe('Home ',()=>{
    it('should not render the load text if all data is ready',()=>{
            Render()
            expect(screen.queryByText('Loading')).toBe(null)
    })
})
function Render(){
    return(
        render(
            <MemoryRouter>
                <UserSession.Provider value={{user:userMockSession,loading:false}}>
                    <UserContext.Provider value={userMock} >

                        <PublicationContext.Provider value={ {state:{publications:publicationMock},dispatch:mockDispatch}}>
                            <Home></Home>

                        </PublicationContext.Provider>
                    </UserContext.Provider>

                </UserSession.Provider>
            </MemoryRouter>
        )
    )
}