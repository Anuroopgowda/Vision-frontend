import { useState } from "react"
import "./App.css"
import MonthYearSelector from "./components/MonthYearSelector"
import TransactionInput from "./components/TransactionInput"

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

function App() {
  const now = new Date()

  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())
  const [transactions, setTransactions] = useState([])

  const SAVE_URL = "http://127.0.0.1:8000/vision"

  function handleAddTransaction(txn) {
    setTransactions(prev => [...prev, txn])
  }

  async function handleSave() {
   

    const payload = {
      month,
      year
    }

    console.log("Sending payload:", payload)

    try {
      const res = await fetch(SAVE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || res.statusText)
      }

      alert("Saved successfully")
      setTransactions([])
    } catch (err) {
      alert("Save failed: " + err.message)
    }
  }

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header-main">Vision</header>

      {/* TOOLBAR */}
      <div className="header-toolbar">
        <div className="toolbar-left">
          <MonthYearSelector
            onChange={(m, y) => {
              setMonth(m)
              setYear(y)
            }}
          />

          <TransactionInput onAdd={handleAddTransaction} />
        </div>

        <div className="toolbar-right">
          <div style={{ color: "#9ca3af", fontSize: 14 }}>
            Welcome back — data ready
          </div>
          <button className="btn-save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <main className="content">
        <section className="dashboard">
          <div className="card">
            <h2>{months[month]} {year}</h2>
            <p className="muted">Transactions</p>

            {transactions.length === 0 ? (
              <p className="muted">No transactions added</p>
            ) : (
              <ul className="txn-list">
                {transactions.map((t, i) => (
                  <li key={i}>
                    <strong>{t.type}</strong> | ₹{t.amount} | {t.category}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
