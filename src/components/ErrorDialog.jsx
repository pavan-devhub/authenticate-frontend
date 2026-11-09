import { useEffect, useId, useRef } from 'react'

// A popup built on the native <dialog>, which traps focus while open and
// closes on Esc. Render it only while there is an error to show.
export default function ErrorDialog({ title, message, onClose }) {
  const dialogRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      role="alertdialog"
      aria-labelledby={titleId}
      onClose={onClose}
    >
      <h2 id={titleId}>{title}</h2>
      <p>{message}</p>
      <button
        type="button"
        className="button"
        onClick={() => dialogRef.current.close()}
      >
        OK
      </button>
    </dialog>
  )
}
