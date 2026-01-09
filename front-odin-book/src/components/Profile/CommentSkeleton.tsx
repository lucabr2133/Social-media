import React from 'react'
export function CommentSkeleton () {
  return (
    <div
      className=' w-full h-[98vh] flex flex-col '
    >
      <div className='p-4 animate-pulse h-full w-full  rounded-2xl '>
        <div className='flex items-center gap-2'>
          <div className='h-8 w-8 bg-neutral-700 rounded-full' />
          <div className='h-4 w-52 bg-neutral-700 rounded-full' />

        </div>
        <p className='h-20 m-5 w-10/12 bg-neutral-700 rounded-2xl' />

      </div>
      <div />
      <div className='p-4 animate-pulse h-full w-full  rounded-2xl '>
        <div className='flex items-center gap-2'>
          <div className='h-8 w-8 bg-neutral-700 rounded-full' />
          <div className='h-4 w-52 bg-neutral-700 rounded-full' />

        </div>
        <p className='h-20 m-5 w-10/12 bg-neutral-700 rounded-2xl' />

      </div>
      <div className='p-4 animate-pulse h-full w-full  rounded-2xl '>
        <div className='flex items-center gap-2'>
          <div className='h-8 w-8 bg-neutral-700 rounded-full' />
          <div className='h-4 w-52 bg-neutral-700 rounded-full' />

        </div>
        <p className='h-20 m-5 w-10/12 bg-neutral-700 rounded-2xl' />

      </div>
      <div className='p-4 animate-pulse h-full w-full  rounded-2xl '>
        <div className='flex items-center gap-2'>
          <div className='h-8 w-8 bg-neutral-700 rounded-full' />
          <div className='h-4 w-52 bg-neutral-700 rounded-full' />

        </div>
        <p className='h-20 m-5 w-10/12 bg-neutral-700 rounded-2xl' />

      </div>
      <div className='p-4 animate-pulse h-full w-full  rounded-2xl '>
        <div className='flex items-center gap-2'>
          <div className='h-8 w-8 bg-neutral-700 rounded-full' />
          <div className='h-4 w-52 bg-neutral-700 rounded-full' />

        </div>
        <p className='h-20 m-5 w-10/12 bg-neutral-700 rounded-2xl' />

      </div>
    </div>
  )
}
