import { Link } from 'react-router'
import AuthCard from '../components/AuthCard.jsx'
import ErrorDialog from '../components/ErrorDialog.jsx'
import FormField from '../components/FormField.jsx'
import { useAuth } from '../context/AuthContext.js'
import { useAuthForm } from '../hooks/useAuthForm.js'
import { validateLogin } from '../utils/validation.js'

export default function LoginPage() {
  const { login } = useAuth()
  const { fieldErrors, formError, clearFormError, submitting, handleSubmit } =
    useAuthForm({
      validate: validateLogin,
      submit: login,
    })

  return (
    <AuthCard
      title="Log in"
      subtitle="Enter your details to continue."
      footer={
        <>
          New here? <Link to="/register">Create an account</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
