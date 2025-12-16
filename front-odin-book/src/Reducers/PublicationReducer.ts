import { Publications } from "../types"
interface onAdd{
  type:'add',
  publication:Publications
}
interface onDelete{
  type:'delete'
  publicationId:string

}
interface onUpdate{
  type:'update',
  publication:Publications
}
interface onSet{
  type:'set',
  publications:Publications[]
}
export interface myState{
  publications:Publications[]
}

export type myAction= onAdd|onDelete|onUpdate|onSet
function reducer (state:myState, action:myAction) {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        publications: [...state.publications, action.publication] 
      }

    case 'delete':
      return {
        ...state,
        publications: state.publications.filter(
          (publication) => publication.id !== action.publicationId
        )
      }

    case 'update':
      return {
        ...state,
        publications: state.publications.map((publication) =>
          publication.id === action.publication.id
            ? { ...publication, ...action.publication }
            : publication
        )
      }
 case "set":
      { 
      const newState = { ...state, publications: action.publications }

      return newState }

    default:
      return state
  }
}
export { reducer }
