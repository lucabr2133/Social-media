import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import onHandleSubmitLogin from '../../../services/onHandleLogin'
import { useNavigate, Link } from 'react-router'
import { Github, ArrowRight, UserCheck, Lock, User as UserIcon } from 'lucide-react'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface Inputs {
  username: string
  password: string
}

function Login() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await onHandleSubmitLogin(data, setError, navigate)
  }

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-[#fafafa] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Subtle ambient radial spotlight */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.05) 0%, transparent 60%)',
        }}
      />

      <div className="w-full max-w-[400px] relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-white/[0.05] border border-white/10 mb-4 shadow-inner">
            <span className="font-bold text-lg tracking-tight text-white">OB</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="text-sm text-zinc-400 mt-1.5">
            Sign in to your Odin Book account to continue
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium text-zinc-400 mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="username"
                  aria-label="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username"
                  {...register('username', { required: 'Username is required' })}
                  className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-[#09090b] border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all"
                />
              </div>
              {errors.username && (
                <p className="mt-1.5 text-xs text-rose-400">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-zinc-400 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="password"
                  aria-label="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-[#09090b] border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {errors.root && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 text-xs text-rose-300">
                {errors.root.message}
              </div>
            )}

            <button
              aria-label="send"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 mt-2 rounded-xl bg-white text-zinc-950 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#121215] px-3 text-zinc-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Secondary Login Options */}
          <div className="grid grid-cols-2 gap-3">
            <button
              aria-label="send-guest"
              type="button"
              disabled={isSubmitting}
              onClick={async () => {
                await onHandleSubmitLogin(
                  { username: 'guestUser', password: 'guestPassword' },
                  setError,
                  navigate
                )
              }}
              className="h-10 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-zinc-200 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4 text-zinc-400" />
              <span>Guest Access</span>
            </button>

            <a
              href={`${apiUrl}/logins/auth/github`}
              className="h-10 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-zinc-200 flex items-center justify-center gap-2 transition-all no-underline"
            >
              <Github className="w-4 h-4 text-zinc-400" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-zinc-400 mt-6">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="text-white font-medium hover:underline underline-offset-4 ml-1"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
