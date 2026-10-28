import { onHandleSubmitProfile } from '../../../services/onHandleSubmitProfile'
import React, { SetStateAction, useState } from 'react'
import { User } from '../../types'
import toast, { Toaster } from 'react-hot-toast'
import { Camera, X } from 'lucide-react'

interface Props {
  setUserData: React.Dispatch<SetStateAction<User | null>>
  openDialgo: boolean | undefined
  setOpenDialog: React.Dispatch<SetStateAction<boolean>>
  user: User
  userParams: string
}

function DialogUpdateProfile({
  setUserData,
  openDialgo,
  setOpenDialog,
  user,
  userParams,
}: Props) {
  const [preview, setPreview] = useState<string | null>(null)

  if (!openDialgo) return null

  return (
    <>
      <Toaster containerStyle={{ zIndex: 10000 }} position="bottom-right" />

      <div
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={() => setOpenDialog(false)}
      >
        <dialog
          open={openDialgo}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-[#121215] border border-white/10 rounded-2xl p-6 text-[#fafafa] shadow-2xl m-0"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <h2 className="text-base font-semibold text-white">Edit Profile</h2>
            <button
              type="button"
              onClick={() => setOpenDialog(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form
            encType="multipart/form-data"
            method="POST"
            onSubmit={async (e) => {
              e.preventDefault()
              const profile = await onHandleSubmitProfile(e, userParams)
              if (profile) {
                setOpenDialog(false)
                setUserData(profile.user)
                toast.success('Profile updated', {
                  style: {
                    background: '#18181b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fafafa',
                    fontSize: '13px',
                    borderRadius: '12px',
                  },
                })
              }
            }}
            className="mt-5 flex flex-col gap-4"
          >
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="file"
                className="group relative w-24 h-24 rounded-full overflow-hidden border border-white/15 cursor-pointer bg-[#09090b]"
              >
                <img
                  src={preview || user.profileImg || '/profile2.svg'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </label>
              <span className="text-[11px] text-zinc-500">
                Click avatar to upload a new photo
              </span>
              <input
                hidden
                type="file"
                id="file"
                name="profile"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setPreview(URL.createObjectURL(file))
                }}
              />
            </div>

            {[
              { id: 'name', label: 'First Name', placeholder: 'Your first name' },
              { id: 'surname', label: 'Last Name', placeholder: 'Your last name' },
              {
                id: 'description',
                label: 'Bio',
                placeholder: 'Tell the community about yourself',
              },
            ].map(({ id, label, placeholder }) => (
              <div key={id} className="flex flex-col gap-1.5">
                <label
                  htmlFor={id}
                  className="text-xs font-medium text-zinc-400"
                >
                  {label}
                </label>
                <input
                  type="text"
                  id={id}
                  name={id}
                  defaultValue={
                    id === 'description' ? user.description || '' : ''
                  }
                  placeholder={placeholder}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#09090b] border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all"
                />
              </div>
            ))}

            <div className="flex items-center justify-end gap-2.5 pt-3">
              <button
                type="button"
                onClick={() => setOpenDialog(false)}
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
        </dialog>
      </div>
    </>
  )
}

export default DialogUpdateProfile
