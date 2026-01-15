import React from 'react'
export default function PublicationSkeleton () {
  return (
    <div className='h-[90vh] w-full flex flex-col items-center gap-10'>
      <div className='p-4 animate-pulse h-full w-1/2  rounded-2xl '>
        <div className='flex items-center gap-2'>
          <div className='h-8 w-8 bg-neutral-700 rounded-full' />
          <div className='h-4 w-52 bg-neutral-700 rounded-full' />

        </div>
        <p className='h-full m-5 w-10/12 bg-neutral-700 rounded-2xl' />

      </div>

    </div>
  )
}
