export default function AuthCard({ title, subtitle, footer, children }) {
  return (
    <main className="auth-page">
      <title>{`${title} · Authenticate`}</title>
      <div className="auth-card">
        <p className="brand">Authenticate</p>
        <h1>{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>
        {children}
        <p className="auth-footer">{footer}</p>
      </div>
    </main>
  )
}
