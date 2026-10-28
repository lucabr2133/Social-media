import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import onHandleSubmitSign from '../../../services/onHandleSign'
import { Inputs } from '../Login/Login'
import { useNavigate, Link } from 'react-router'
import { ArrowRight, Lock, User as UserIcon } from 'lucide-react'

function Signup() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>()
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await onHandleSubmitSign(data, setError, navigate)
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
            Create your account
          </h1>
          <p className="text-sm text-zinc-400 mt-1.5">
            Join Odin Book and connect with the community
          </p>
        </div>

        {/* Signup Card */}
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
                  aria-label="userinput"
                  type="text"
                  autoComplete="username"
                  placeholder="At least 4 characters"
                  {...register('username', {
                    required: 'Username is required',
                    minLength: {
                      value: 4,
                      message: 'Username must be at least 4 characters',
                    },
                  })}
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
                  aria-label="passwordinput"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                  className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-[#09090b] border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              aria-label="send"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 mt-2 rounded-xl bg-white text-zinc-950 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-zinc-400 mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-white font-medium hover:underline underline-offset-4 ml-1"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
