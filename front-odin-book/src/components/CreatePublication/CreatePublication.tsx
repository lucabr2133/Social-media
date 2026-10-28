import React, { useContext, useState } from 'react'
import onHandleSubmitCreatePublication from '../../../services/onHandelSubmitCreatePublication'
import { UserSession } from '../../contex/context'
import { User } from '../../types'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ImagePlus, X } from 'lucide-react'
import { usePublicationContext } from '../../contex/PublicationContext'

interface props {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
  opendialog: boolean
  userActive?: User
}

export interface Inputs {
  publicationImg: FileList
  description: string
}

function CreatePublication({ setOpenDialog, opendialog }: props) {
  const userContex = useContext(UserSession)
  const contex = usePublicationContext()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  if (!contex || !userContex) {
    throw new Error('The context must be a valid provider')
  }

  const { user } = userContex
  const { addAction } = contex

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>()

  if (!user) return null

  const imageRegistration = register('publicationImg', {
    required: 'An image is required',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setPreviewUrl(URL.createObjectURL(file))
      }
    },
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const publicaciones = await onHandleSubmitCreatePublication(
        data,
        user,
        setError
      )

      if (!publicaciones) return

      reset()
      setPreviewUrl(null)
      setOpenDialog(false)
      addAction(publicaciones.publication)
    } catch (error) {
      console.error('Error creating publication:', error)
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 transition-opacity duration-200 ${
        opendialog ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setOpenDialog(false)}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-md bg-[#121215] border border-white/10 rounded-2xl p-6 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <h2 className="text-base font-semibold text-white">
            Create New Post
          </h2>
          <button
            type="button"
            onClick={() => setOpenDialog(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-5 flex flex-col gap-4"
          method="post"
          encType="multipart/form-data"
        >
          <div>
            <label
              htmlFor="publicationImg"
              className="group relative flex h-52 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-[#09090b] text-zinc-400 hover:border-white/30 hover:bg-white/[0.02] transition-all overflow-hidden"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <ImagePlus className="h-8 w-8 mb-2 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                  <span className="text-xs font-medium text-zinc-300">
                    Click to upload an image
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1">
                    PNG, JPG or WEBP
                  </span>
                </>
              )}
            </label>
            <input
              hidden
              type="file"
              {...imageRegistration}
              id="publicationImg"
              accept="image/*"
            />
            {errors.publicationImg && (
              <p className="mt-1.5 text-xs text-rose-400">
                {errors.publicationImg.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-xs font-medium text-zinc-400"
            >
              Caption
            </label>
            <input
              type="text"
              {...register('description', {
                required: 'Description is required',
              })}
              id="description"
              placeholder="Write a caption for your post..."
              className="w-full h-10 px-3.5 rounded-xl bg-[#09090b] border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all"
            />
            {errors.description && (
              <p className="mt-1.5 text-xs text-rose-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setOpenDialog(false)}
              className="h-9 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-zinc-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePublication
