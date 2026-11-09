import { useState } from 'react'

// Shared submit handling for the login and register forms.
export function useAuthForm({ validate, submit }) {
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const errors = validate(values)

    setFieldErrors(errors)
    setFormError('')
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      await submit(values)
    } catch (error) {
      setFormError(error.message)
    } finally {
      // Also after success: the page stays open to ask for the emailed code.
      setSubmitting(false)
    }
  }

  function clearFormError() {
    setFormError('')
  }

  return {
    fieldErrors,
    formError,
    showFormError: setFormError,
    clearFormError,
    submitting,
    handleSubmit,
  }
}
