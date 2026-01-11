import { useState } from "react"

export default function HideableAmount({ label, amount }) {
  const [show, setShow] = useState(false)

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span>
        {label}: {show ? `₹${amount}` : "₹•••••"}
      </span>

      <span
        onClick={() => setShow(!show)}
        style={{ cursor: "pointer", userSelect: "none" }}
        title={show ? "Hide" : "Show"}
      >
        {show ? "🙈" : "👁️"}
      </span>
    </div>
  )
}
