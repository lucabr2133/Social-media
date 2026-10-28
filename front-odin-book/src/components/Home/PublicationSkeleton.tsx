import React from 'react'

export default function PublicationSkeleton() {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6 py-6">
      <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-4 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 bg-white/10 rounded-full" />
          <div className="h-3.5 w-32 bg-white/10 rounded-md" />
        </div>
        <div className="h-72 w-full bg-white/[0.05] rounded-xl mb-4" />
        <div className="h-3.5 w-2/3 bg-white/10 rounded-md" />
      </div>
    </div>
  )
}
