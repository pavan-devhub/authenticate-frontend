// Talks to authenticate-backend, which stores accounts in MySQL, checks
// credentials and emails one-time codes. This browser only remembers who is
// logged in and the login history the backend sent with that login, never a
// password or a code.
// The rest of the app only reaches auth through this file.

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
const SESSION_KEY = 'authenticate.session'

async function post(path, body) {
  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('Could not reach the server. Please try again.')
  }

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error(
      data?.detail ?? 'Something went wrong. Please try again.',
    )
    // 410 Gone means the code can't be used any more, so the user starts again.
    error.status = response.status
    throw error
  }
  return data
}

function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

// Returns { user, loginAttempts }, or null when logged out.
export function getSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY))
    return session?.user ? session : null
  } catch {
    return null
  }
}

// Registering and logging in each take two steps. The first emails a code and
// returns a challenge: { challengeId, email, expiresAt, resendAvailableAt }.
// The second sends the code back with the challengeId.

export function register({ name, email, password }) {
  return post('/api/auth/register', { name, email, password })
}

export async function verifyRegistration({ challengeId, code }) {
  const user = await post('/api/auth/register/verify', { challengeId, code })
  // Registering logs the user in without a login attempt, so there is no history yet.
  return saveSession({ user, loginAttempts: [] })
}

export function login({ email, password }) {
  return post('/api/auth/login', { email, password })
}

export async function verifyLogin({ challengeId, code }) {
  return saveSession(
    await post('/api/auth/login/verify', { challengeId, code }),
  )
}

export function resendCode(challengeId) {
  return post('/api/auth/otp/resend', { challengeId })
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}
