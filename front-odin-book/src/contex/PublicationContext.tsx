import { createContext, ReactNode, useContext, useReducer } from 'react';
import { myState , reducer} from '../Reducers/PublicationReducer'
import React from 'react';
import { Publications } from '../types';
interface PublicationContextI{
  state:myState,
  setAction:(publications:Publications[])=>void,
  deleteAction:(publicationId:string)=>void,
  updateAction:(publication:Publications)=>void,
  addAction:(publication:Publications)=>void
}
const PublicationContext = createContext<PublicationContextI|undefined>(undefined)

export function PublicationProvider({children}:{children:ReactNode}) {
    const [state,dispatch]=useReducer(reducer,{publications:[]})
    const setAction=(publications:Publications[])=>{
        dispatch({type:'set',publications})
    }
    const deleteAction=(publicationId:string)=>{
        dispatch({type:'delete',publicationId})
    }
    const updateAction=(publication:Publications)=>{
        dispatch({type:'update',publication})
    }
    const addAction=(publication:Publications)=>{
        dispatch({type:'add',publication})
    }
    return  <PublicationContext.Provider value={{addAction,deleteAction,state,updateAction,setAction}}>
        {children}
    </PublicationContext.Provider>
    
}

export function usePublicationContext(){
    const contex=useContext(PublicationContext)
    if(!contex) throw new Error('you must have a valid Provider')
    const {addAction,deleteAction,setAction,updateAction,state}=contex
    return {addAction,deleteAction,setAction,updateAction,state}

}