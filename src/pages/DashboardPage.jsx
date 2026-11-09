import LoginHistory from '../components/LoginHistory.jsx'
import { useAuth } from '../context/AuthContext.js'

export default function DashboardPage() {
  const { user, loginAttempts, logout } = useAuth()

  return (
    <>
      <title>Dashboard · Authenticate</title>
      <header className="topbar">
        <p className="brand">Authenticate</p>
        <button
          type="button"
          className="button button-secondary"
          onClick={logout}
        >
          Log out
        </button>
      </header>
      <main className="dashboard">
        <h1>Welcome, {user.name}</h1>
        <LoginHistory attempts={loginAttempts} />
      </main>
    </>
  )
}
