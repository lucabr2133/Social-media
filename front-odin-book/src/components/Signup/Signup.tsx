import { Link } from 'react-router-dom'
import styles from '../Login/login.module.scss'
import { useForm, SubmitHandler } from 'react-hook-form'
import onHandleSubmitSign from '../../../services/onHandleSign';

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

  const onSubmit: SubmitHandler<Inputs> = async (data,  e?: React.BaseSyntheticEvent) => {
    // Aquí llamas a tu API
    await onHandleSubmitSign(data,setError)
  }
  const onError = (errors: any) => {
};

  return (
    <div className={styles.Loginbody}>
      <form className={styles.Loginform} onSubmit={handleSubmit(onSubmit,onError)}>
        <h2>Sign up</h2>

        <label htmlFor='username'>Username</label>
        <input
        id='username'
        aria-label='userinput'
          type="text"
          {...register("username", {
            required: "Username is required",
            minLength: { value: 8, message: "Minimum 8 characters" },
            maxLength: { value: 16, message: "Maximum 16 characters" }
          })}
        />
        {errors.username && (
         <span role='alert' style={{ color: "red" }}>
  {errors.username?.message}
</span>

        )}

        <label htmlFor="password">Password</label>
        <input
        aria-label='passwordinput'

          type="password"
          id="password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Minimum 8 characters" },
            maxLength: { value: 16, message: "Maximum 16 characters" }
          })}
        />
        {errors.password && (
          <span aria-label='errorPassword' style={{ color: "red" }}>{errors.password.message}</span>
        )}

        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Sending..." : "Send"}
        </button>

        <Link to="/">login</Link>
      </form>
    </div>
  )
}

export default Signup
