import React from 'react'

export function CommentSkeleton() {
  return (
    <div className="w-full flex flex-col gap-2.5 py-2">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="p-3 animate-pulse rounded-xl bg-white/[0.03] flex items-center gap-3"
        >
          <div className="h-7 w-7 bg-white/10 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 w-24 bg-white/10 rounded" />
            <div className="h-2.5 w-3/4 bg-white/[0.06] rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
