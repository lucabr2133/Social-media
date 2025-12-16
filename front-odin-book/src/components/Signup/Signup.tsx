import { Link } from 'react-router-dom'
import styles from '../Login/login.module.scss'
import { useForm, SubmitHandler } from 'react-hook-form'
import onHandleSubmitSign from '../../../services/onHandleSign';
import React from 'react';
export interface Inputs {
  username: string;
  password: string;
}

function Signup() {
  const {
    register,
    handleSubmit, 
    setError,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await onHandleSubmitSign(data,setError)
  }


  return (
  <div className={styles.Loginbody}>
      <form
        className={styles.Loginform}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2>Sign up</h2>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          aria-label="userinput"
          type="text"
          {...register("username", {
            required: "Username is required",
            minLength: { value: 8, message: "Minimum 8 characters" },
            maxLength: { value: 16, message: "Maximum 16 characters" }
          })}
        />
        {errors.username && (
          <span className={styles.error}>
            {errors.username.message}
          </span>
        )}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          aria-label="passwordinput"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Minimum 8 characters" },
            maxLength: { value: 16, message: "Maximum 16 characters" }
          })}
        />
        {errors.password && (
          <span className={styles.error}>
            {errors.password.message}
          </span>
        )}

        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Sending..." : "Create account"}
        </button>

        <Link to="/" className={styles.link}>
          Already have an account? Login
        </Link>
      </form>
    </div>
  )
}

export default Signup
