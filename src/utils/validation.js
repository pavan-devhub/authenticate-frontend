const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8

function validateEmail(email) {
  if (!email.trim()) return 'Enter your email.'
  if (!EMAIL_PATTERN.test(email.trim())) return 'Enter a valid email address.'
  return null
}

function withoutEmptyErrors(errors) {
  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => message),
  )
}

export function validateLogin({ email, password }) {
  return withoutEmptyErrors({
    email: validateEmail(email),
    password: password ? null : 'Enter your password.',
  })
}

export function validateRegister({ name, email, password, confirmPassword }) {
  let passwordError = null
  if (!password) {
    passwordError = 'Enter a password.'
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    passwordError = `Use at least ${MIN_PASSWORD_LENGTH} characters.`
  }

  return withoutEmptyErrors({
    name: name.trim() ? null : 'Enter your name.',
    email: validateEmail(email),
    password: passwordError,
    confirmPassword:
      password === confirmPassword ? null : 'Passwords do not match.',
  })
}
