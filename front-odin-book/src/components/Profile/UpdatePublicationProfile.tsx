import React, { useState } from 'react'
import { Publications } from '../../types'
import { dataUpdated } from 'services/onHandleSubmitUpdatePublication'
import { ImagePlus, X } from 'lucide-react'

interface Props {
  updateForm: string | null
  setUpdateForm: React.Dispatch<React.SetStateAction<string | null>>
  setPublication: React.Dispatch<React.SetStateAction<Publications[] | null>>
  updatePublication: (
    e: React.FormEvent<HTMLFormElement>,
    updateForm: string
  ) => Promise<dataUpdated>
}

function UpdatePublicationProfile({
  updateForm,
  setUpdateForm,
  updatePublication,
  setPublication,
}: Props) {
  const [preview, setPreview] = useState<string | null>(null)

  if (updateForm === null) return null

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          e.stopPropagation()
          setUpdateForm(null)
        }
      }}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <form
        onSubmit={async (e) => {
          setUpdateForm(null)
          const updatedPublication = await updatePublication(e, updateForm)
          setPreview(null)
          setPublication((prev) => {
            if (!prev) return null
            return prev.map((publication) =>
              publication.id === updatedPublication.publication.id
                ? updatedPublication.publication
                : publication
            )
          })
        }}
        encType="multipart/form-data"
        className="w-full max-w-md bg-[#121215] border border-white/10 rounded-2xl p-6 text-white shadow-2xl flex flex-col gap-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <h2 className="text-base font-semibold text-white">Edit Post</h2>
          <button
            type="button"
            onClick={() => setUpdateForm(null)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <label
          htmlFor="img-form"
          className="group relative flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-[#09090b] text-zinc-400 hover:border-white/30 hover:bg-white/[0.02] transition-all overflow-hidden"
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <ImagePlus className="h-7 w-7 mb-2 text-zinc-500 group-hover:text-zinc-300" />
              <span className="text-xs font-medium text-zinc-300">
                Click to replace image (optional)
              </span>
            </>
          )}
        </label>
        <input
          hidden
          id="img-form"
          name="img"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) setPreview(URL.createObjectURL(file))
          }}
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="description"
            className="text-xs font-medium text-zinc-400"
          >
            Caption
          </label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder="Write an updated caption..."
            className="w-full h-10 px-3.5 rounded-xl bg-[#09090b] border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => setUpdateForm(null)}
            className="h-9 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-zinc-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-9 px-5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdatePublicationProfile
