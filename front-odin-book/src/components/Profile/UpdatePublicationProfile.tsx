import React from 'react'
import { Publications } from '../../types'
import { myAction } from '../../Reducers/PublicationReducer'

interface Props {
  updateForm: string | null
  setUpdateForm: React.Dispatch<React.SetStateAction<string | null>>
  styles: Record<string, string>
  updatePublication: (
    e: React.FormEvent<HTMLFormElement>,
    updateForm: string
  ) => Promise<Publications>
  dispatch: React.Dispatch<myAction>
}

function UpdatePublicationProfile({
  updateForm,
  setUpdateForm,
  styles,
  updatePublication,
  dispatch,
}: Props) {
  if (updateForm === null) return null

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          e.stopPropagation()
          setUpdateForm(null)
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <form
        onSubmit={async (e) => {
          setUpdateForm(null)
          const publications = await updatePublication(e, updateForm)
          dispatch({ type: 'update', publication: publications })
        }}
        encType="multipart/form-data"
        style={{
          backgroundColor: '#1e1e20',
          borderRadius: '12px',
          padding: '25px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          color: '#fff',
        }}
      >
        <h2 style={{ marginBottom: '5px', textAlign: 'center' }}>
          Editar Publicación
        </h2>

        {/* Imagen */}
        <label
          htmlFor="img-form"
          style={{
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            border: '2px dashed #555',
            borderRadius: '8px',
            padding: '10px',
          }}
        >
          <img
            width="100"
            src="/publication.svg"
            alt="Seleccionar imagen"
            style={{ opacity: 0.8 }}
          />
        </label>
        <input hidden id="img-form" name="img" type="file" />

        {/* Descripción */}
        <label htmlFor="description">Descripción</label>
        <input
          id="description"
          name="description"
          type="text"
          placeholder="Escribe una descripción..."
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #444',
            backgroundColor: '#2a2a2c',
            color: '#fff',
          }}
        />

        {/* Botones */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setUpdateForm(null)}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#555',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#4cafef',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdatePublicationProfile
