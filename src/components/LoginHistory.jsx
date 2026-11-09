const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'medium',
})

const OUTCOMES = {
  SUCCESS: { label: 'Successful', className: 'status-success' },
  WRONG_PASSWORD: { label: 'Wrong password', className: 'status-failed' },
  WRONG_CODE: { label: 'Wrong code', className: 'status-failed' },
}

function describe(attempt) {
  return (
    OUTCOMES[attempt.outcome] ?? {
      label: attempt.outcome,
      className: 'status-failed',
    }
  )
}

export default function LoginHistory({ attempts }) {
  return (
    <section className="history" aria-labelledby="history-title">
      <h2 id="history-title">Login attempts</h2>
      <p className="history-subtitle">
        Attempts to log in with your email, newest first.
      </p>
      {attempts.length === 0 ? (
        <p className="history-empty">
          No login attempts yet. They will appear here after you log in.
        </p>
      ) : (
        <div className="table-wrap">
          <table className="history-table">
            <thead>
              <tr>
                <th scope="col">Date and time</th>
                <th scope="col">Result</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => {
                const outcome = describe(attempt)
                return (
                  <tr key={attempt.id}>
                    <td>
                      <time dateTime={attempt.attemptedAt}>
                        {dateTimeFormat.format(new Date(attempt.attemptedAt))}
                      </time>
                    </td>
                    <td>
                      <span className={`status ${outcome.className}`}>
                        {outcome.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
