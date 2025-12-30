import { useEffect, useState } from "react"
import "./App.css"
import MonthYearSelector from "./components/MonthYearSelector"
import TransactionInput from "./components/TransactionInput"

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

function App() {
  const now = new Date()

  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [transactions, setTransactions] = useState([])

  console.log("API URL:", import.meta.env.VITE_API_BASE_URL)
  console.log("Current Month/Year:", month, year)
  const BASE_URL = import.meta.env.VITE_API_BASE_URL

  // 🔹 Fetch activity from backend
  async function fetchActivity(m = month, y = year) {
    try {
      const res = await fetch(`${BASE_URL}?month=${m}&year=${y}`)
      if (!res.ok) throw new Error("Failed to load activity")

      const data = await res.json()

      const activity = data.activity || {}

      // 🔁 Convert dict → flat list
      const flat = []
      Object.entries(activity).forEach(([type, items]) => {
        items.forEach(i => {
          flat.push({ type, ...i })
        })
      })

      setTransactions(flat)
    } catch (err) {
      console.error(err)
      setTransactions([])
    }
  }

  // 🔹 Load when month/year changes
  useEffect(() => {
    fetchActivity()
  }, [month, year])

  // 🔹 Add transaction
  async function handleAddTransaction(txn) {
    const payload = { month, year, txn }

    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Save failed")

      await fetchActivity()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="app">
      <header className="header-main">Vision</header>

      <div className="header-toolbar">
        <div className="toolbar-left">
          <MonthYearSelector
            onChange={(m, y) => {
              setMonth(m)
              setYear(y)
            }}
          />
        </div>
      </div>

      <main className="content">
        <section className="dashboard">

          <TransactionInput onAdd={handleAddTransaction} />

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
