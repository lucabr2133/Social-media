import React from 'react'
export default function GlobalLoading () {
  return (
    <div className='min-h-screen flex items-center justify-center flex-col gap-5'>
      <h2>Loading...</h2>
      <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin' />
    </div>
  )
}
