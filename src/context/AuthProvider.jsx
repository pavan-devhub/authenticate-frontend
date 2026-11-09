import { useMemo, useState } from 'react'
import { AuthContext } from './AuthContext.js'
import * as authService from '../services/authService.js'

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(authService.getSession)

  const auth = useMemo(
    () => ({
      user: session?.user ?? null,
      loginAttempts: session?.loginAttempts ?? [],
      // These three email a code and return the challenge, without logging in.
      login: authService.login,
      register: authService.register,
      resendCode: authService.resendCode,
      async verifyLogin(input) {
        setSession(await authService.verifyLogin(input))
      },
      async verifyRegistration(input) {
        setSession(await authService.verifyRegistration(input))
      },
      logout() {
        authService.logout()
        setSession(null)
      },
    }),
    [session],
  )

  return <AuthContext value={auth}>{children}</AuthContext>
}
