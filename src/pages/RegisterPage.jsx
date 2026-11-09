import { useState } from 'react'
import { Link } from 'react-router'
import AuthCard from '../components/AuthCard.jsx'
import FormField from '../components/FormField.jsx'
import OtpForm from '../components/OtpForm.jsx'
import { useAuth } from '../context/AuthContext.js'
import { useAuthForm } from '../hooks/useAuthForm.js'
import { validateRegister } from '../utils/validation.js'

export default function RegisterPage() {
  const { register, verifyRegistration, resendCode } = useAuth()
  const [challenge, setChallenge] = useState(null)
  const { fieldErrors, formError, showFormError, submitting, handleSubmit } =
    useAuthForm({
      validate: validateRegister,
      submit: async (details) => setChallenge(await register(details)),
    })

  function restart(message) {
    setChallenge(null)
    if (message) showFormError(message)
  }

  return (
    <AuthCard
      title={challenge ? 'Check your email' : 'Create account'}
      subtitle={
        challenge
          ? 'Enter the code to finish creating your account.'
          : 'Sign up to get started.'
      }
      footer={
        <>
          Already have an account? <Link to="/login">Log in</Link>
        </>
      }
    >
      {/* Hidden rather than removed during the code step, so going back keeps what was typed. */}
      <form
        className="auth-form"
        onSubmit={handleSubmit}
        noValidate
        hidden={challenge !== null}
      >
        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}
        <FormField
          label="Name"
          name="name"
          type="text"
          autoComplete="name"
          error={fieldErrors.name}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          error={fieldErrors.email}
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          error={fieldErrors.password}
        />
        <FormField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
        />
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Sending code…' : 'Create account'}
        </button>
      </form>
      {challenge && (
        <OtpForm
          challenge={challenge}
          submitLabel="Create account"
          onVerify={verifyRegistration}
          onResend={resendCode}
          onRestart={restart}
        />
      )}
    </AuthCard>
  )
}
