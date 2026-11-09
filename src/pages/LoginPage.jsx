import { useState } from 'react'
import { Link } from 'react-router'
import AuthCard from '../components/AuthCard.jsx'
import ErrorDialog from '../components/ErrorDialog.jsx'
import FormField from '../components/FormField.jsx'
import OtpForm from '../components/OtpForm.jsx'
import { useAuth } from '../context/AuthContext.js'
import { useAuthForm } from '../hooks/useAuthForm.js'
import { validateLogin } from '../utils/validation.js'

export default function LoginPage() {
  const { login, verifyLogin, resendCode } = useAuth()
  const [challenge, setChallenge] = useState(null)
  const {
    fieldErrors,
    formError,
    showFormError,
    clearFormError,
    submitting,
    handleSubmit,
  } = useAuthForm({
    validate: validateLogin,
    submit: async (credentials) => setChallenge(await login(credentials)),
  })

  function restart(message) {
    setChallenge(null)
    if (message) showFormError(message)
  }

  return (
    <AuthCard
      title={challenge ? 'Check your email' : 'Log in'}
      subtitle={
        challenge
          ? 'Enter the code to finish logging in.'
          : 'Enter your details to continue.'
      }
      footer={
        <>
          New here? <Link to="/register">Create an account</Link>
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
          autoComplete="current-password"
          error={fieldErrors.password}
        />
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      {challenge && (
        <OtpForm
          challenge={challenge}
          submitLabel="Log in"
          onVerify={verifyLogin}
          onResend={resendCode}
          onRestart={restart}
        />
      )}
      {formError && (
        <ErrorDialog
          title="Login failed"
          message={formError}
          onClose={clearFormError}
        />
      )}
    </AuthCard>
  )
}
