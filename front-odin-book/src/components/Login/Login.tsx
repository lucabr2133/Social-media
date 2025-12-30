import { Link , useNavigate } from 'react-router'
import onHandleSubmitLogin from '../../../services/onHandleLogin'
import { useContext, useState } from 'react'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Inputs } from '../Signup/Signup'
import { UserSession } from '../../contex/context'
import { SpinnerComponnet } from '../ui/spinner'
const apiUrl = import.meta.env.VITE_API_URL;

function Login () {
  
  const {register,setError,handleSubmit,formState:{errors,isSubmitting}} =useForm<Inputs>()
  const navigate=useNavigate()
  const contex=useContext(UserSession)
  
  if(!contex){
    throw new Error('component outside provider ')
  }
    const [loading,setLoading]=useState(false)

  const {setUser}=contex
  const  onSubmit:SubmitHandler<Inputs>=async data=>{
  const success = await onHandleSubmitLogin(data,setUser, setError);
  if (success) {
    
     navigate('/',{replace:true})
  }
  }

  return (
 <>
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-neutral-900 via-neutral-800 to-black px-4">
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        w-full max-w-md
        rounded-3xl
        bg-white/4
        backdrop-blur-md
    
        shadow-2xl
        p-8
        flex flex-col gap-4
      "
      style={{
        padding:'32px'
      }}
    >
      <h2 className="text-4xl font-mono text-center text-white mb-4">
        Login
      </h2>

      {/* USERNAME */}
      <label className="text-sm text-neutral-300">Username</label>
      <input
        type="text"
        className="
          rounded-xl
          bg-neutral-900/70
          text-white
          outline-none
          border border-neutral-700
          focus:border-white
          transition
        "
        style={{
               borderRadius:'20px',
          padding:'8px 16px'
        }}
        {...register("username", {
          required: "Username is required",
          minLength: { value: 8, message: "Minimum 8 characters" },
          maxLength: { value: 16, message: "Maximum 16 characters" },
        })}
        aria-label="username"
      />
      {errors.username && (
        <span className="text-red-500!  font-extrabold">
          {errors.username.message}
        </span>
      )}

      {/* PASSWORD */}
      <label className="text-sm text-neutral-300">Password</label>
      <input
        type="password"
        className="
          rounded-xl
          bg-neutral-900/70
          text-white
          outline-none
          border border-neutral-700
          focus:border-white
          transition
          
        "
            style={{
              borderRadius:'20px',
          padding:'8px 16px'
        }}
        {...register("password", {
          required: "Password is required",
          minLength: { value: 8, message: "Minimum 8 characters" },
          maxLength: { value: 16, message: "Maximum 16 characters" },
        })}
        aria-label="password"
      />
      {errors.password && (
        <span className="  text-red-500! font-extrabold">
          {errors.password.message}
        </span>
      )}

      <div className="flex flex-col gap-3 mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          aria-label="send"
          className="
            rounded-xl
            bg-white text-black
            py-2
            font-semibold
            hover:bg-neutral-200
            transition
            disabled:opacity-50
          "
        >
          {isSubmitting ? "Sending..." : "Login"}
        </button>

        <button
          disabled={loading}
          type="button"
          aria-label="send-guest"
          onClick={() =>{
            setLoading(true)
            onSubmit({ username: "guestUser", password: "12345678" })
          }
       
          }
          className="
            rounded-xl
            border border-white/30
            text-white
            py-2
            hover:bg-white/10
            transition
          "
        >
          {loading? "Loading...":"Enter as Guest"}
        </button>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between mt-6">
        <Link
          to="/Signup"
          className="text-sm text-neutral-300 hover:text-white transition"
        >
          Create account
        </Link>

        <Link to={`${apiUrl}/auth/github`} className='flex justify-center'>
          <img
            src="/github.jpg"
            alt="GitHub login"
            className="w-10 h-10 flex rounded-full hover:scale-110 transition"
          />
        </Link>
      </div>
    </form>
  </div>
</>

  )
}
export default Login
