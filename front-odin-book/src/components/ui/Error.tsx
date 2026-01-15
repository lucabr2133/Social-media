import React from "react"

type ErrorMessageProps = {
  message?: string|null
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
      <span className="text-red-400 text-sm font-semibold">
        {message || 'Something went wrong'}
      </span>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-xs font-semibold rounded-full
                     bg-red-500 text-white hover:bg-red-600 transition"
        >
          Retry
        </button>
      )}
    </div>
  )
}
