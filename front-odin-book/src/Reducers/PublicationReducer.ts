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
        publications: [...state.publications, action.publication] // ✅ Correcto
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
      { console.log("Reducer recibió:", action.publications)
      const newState = { ...state, publications: action.publications }
      console.log("Reducer devuelve:", newState)
      return newState }

    default:
      return state
  }
}
export { reducer }
