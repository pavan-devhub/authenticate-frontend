import { useEffect, useState } from 'react'
import FormField from './FormField.jsx'

const timeFormat = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' })

// Second step of logging in or registering: the user types the code that was
// emailed to them. onRestart(message) takes them back to the first step.
export default function OtpForm({
  challenge,
  submitLabel,
  onVerify,
  onResend,
  onRestart,
}) {
  const [current, setCurrent] = useState(challenge)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)
  const now = useNow()

  const resendInSeconds = Math.max(
    0,
    Math.ceil((Date.parse(current.resendAvailableAt) - now) / 1000),
  )

  async function handleSubmit(event) {
    event.preventDefault()
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code.')
      return
    }

    setError('')
    setNotice('')
    setSubmitting(true)
    try {
      // On success the auth state changes and GuestRoute redirects.
      await onVerify({ challengeId: current.challengeId, code })
    } catch (verifyError) {
      if (verifyError.status === 410) {
        onRestart(verifyError.message)
        return
      }
      setError(verifyError.message)
      setCode('')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResend() {
    setError('')
    setNotice('')
    setResending(true)
    try {
      setCurrent(await onResend(current.challengeId))
      setCode('')
      setNotice('We sent you a new code.')
    } catch (resendError) {
      if (resendError.status === 410) {
        onRestart(resendError.message)
        return
      }
      setError(resendError.message)
    } finally {
      setResending(false)
    }
  }

  let resendLabel = 'Resend code'
  if (resending) resendLabel = 'Sending…'
  else if (resendInSeconds > 0) resendLabel = `Resend code in ${resendInSeconds}s`

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <p>
        We sent a 6-digit code to <strong>{current.email}</strong>. It expires
        at {timeFormat.format(new Date(current.expiresAt))}.
      </p>
      {notice && (
        <p className="form-notice" role="status">
          {notice}
        </p>
      )}
      <FormField
        label="Verification code"
        name="code"
        className="code-input"
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        value={code}
        onChange={(event) =>
          setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
        }
        error={error}
      />
      <button type="submit" className="button" disabled={submitting}>
        {submitting ? 'Checking…' : submitLabel}
      </button>
      <div className="otp-actions">
        <button
          type="button"
          className="link-button"
          onClick={handleResend}
          disabled={resending || resendInSeconds > 0}
        >
          {resendLabel}
        </button>
        <button
          type="button"
          className="link-button"
          onClick={() => onRestart('')}
        >
          Go back
        </button>
      </div>
    </form>
  )
}

// The current time, updated every second, for the resend countdown.
function useNow() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])
  return now
}
