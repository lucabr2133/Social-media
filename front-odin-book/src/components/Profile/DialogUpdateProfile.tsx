import onHandleSubmitProfile from '../../../services/onHandleSubmitProfile'
import React, { SetStateAction } from 'react'
import { User } from '../../types'

interface Props {
  setUserData: React.Dispatch<SetStateAction<User | null>>
  openDialgo: boolean | undefined
  setOpenDialog: React.Dispatch<SetStateAction<boolean>>
  user: User
  userParams: string
}

function DialogUpdateProfile({ setUserData, openDialgo, setOpenDialog, user, userParams }: Props) {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '100vw',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: openDialgo ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: 20,
          boxSizing: 'border-box',
        }}
      >
        <dialog
          open={openDialgo}
          style={{
            border: 'none',
            borderRadius: 12,
            backgroundColor: '#121212',
            color: '#e0e0e0',
            padding: '30px 40px',
            maxWidth: 400,
            width: '100%',
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.9)',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            margin:'auto'
          }}
        >
          <form
            encType="multipart/form-data"
            method="POST"
            onSubmit={async (e) => {
              e.preventDefault()
              const profile = await onHandleSubmitProfile(e, userParams)
              setUserData(profile)
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 15,
            }}
          >
            <label
              htmlFor="file"
              style={{
                cursor: 'pointer',
                alignSelf: 'center',
                width: 150,
                height: 150,
                overflow: 'hidden',
                borderRadius: '50%',
                boxShadow: '0 0 10px #222',
                display: 'inline-block',
                marginBottom: 10,
                transition: 'box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLLabelElement).style.boxShadow = '0 0 20px #4a90e2'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLLabelElement).style.boxShadow = '0 0 10px #222'
              }}
            >
              <img
                src={user.profileImg ? user.profileImg : '/profile2.svg'}
                alt="Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  borderRadius: '50%',
                }}
              />
            </label>
            <input hidden type="file" id="file" name="profile" />

            <label
              htmlFor="name"
              style={{
                fontWeight: 600,
                color: '#bbb',
                marginBottom: 5,
              }}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              style={{
                padding: 10,
                border: '1.8px solid #444',
                borderRadius: 8,
                fontSize: '1rem',
                backgroundColor: '#1e1e1e',
                color: '#ddd',
                outline: 'none',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#4a90e2')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#444')}
            />

            <label
              htmlFor="surname"
              style={{
                fontWeight: 600,
                color: '#bbb',
                marginBottom: 5,
              }}
            >
              Surname
            </label>
            <input
              type="text"
              name="surname"
              style={{
                padding: 10,
                border: '1.8px solid #444',
                borderRadius: 8,
                fontSize: '1rem',
                backgroundColor: '#1e1e1e',
                color: '#ddd',
                outline: 'none',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#4a90e2')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#444')}
            />

            <label
              htmlFor="description"
              style={{
                fontWeight: 600,
                color: '#bbb',
                marginBottom: 5,
              }}
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              style={{
                padding: 10,
                border: '1.8px solid #444',
                borderRadius: 8,
                fontSize: '1rem',
                backgroundColor: '#1e1e1e',
                color: '#ddd',
                outline: 'none',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#4a90e2')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#444')}
            />

            <button
              type="submit"
              style={{
                padding: '12px 18px',
                backgroundColor: '#4a90e2',
                color: 'white',
                fontWeight: 700,
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'background-color 0.25s ease',
                fontSize: '1.1rem',
                marginTop: 10,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#357abd')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4a90e2')}
            >
              Send
            </button>
          </form>

          <button
            onClick={() => setOpenDialog(false)}
            style={{
              marginTop: 15,
              padding: '10px 16px',
              backgroundColor: '#333',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              color: '#eee',
              transition: 'background-color 0.3s ease',
              width: '100%',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#555'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#333'
              e.currentTarget.style.color = '#eee'
            }}
          >
            Close
          </button>
        </dialog>
      </div>
    </>
  )
}

export default DialogUpdateProfile
