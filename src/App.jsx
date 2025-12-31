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
  const [totalAmount, setTotalAmount] = useState(0)
  const [investmentAmount, setInvestmentAmount] = useState(0)

  // const BASE_URL = "http://localhost:8000/vision"
  const BASE_URL = import.meta.env.VITE_API_URL

  // 🔹 Fetch activity + totals from backend
  async function fetchActivity(m = month, y = year) {
    try {
      const res = await fetch(`${BASE_URL}?month=${m}&year=${y}`)
      if (!res.ok) throw new Error("Failed to load activity")

      const data = await res.json()

      // ✅ Totals
      setTotalAmount(data.total_amount || 0)
      setInvestmentAmount(data.investment_amount || 0)

      const activity = data.activity || {}

      // 🔁 Convert { credited:[], debited:[] } → flat list
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
      setTotalAmount(0)
      setInvestmentAmount(0)
    }
  }

  // 🔹 Reload when month/year changes
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
        body: JSON.stringify(payload)
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

            {/* Month + totals */}
            <div className="month-header">
              <h2>{months[month - 1]} {year}</h2>

              <div className="amount-summary">
                <span className="total">
                  Total: ₹{totalAmount}
                </span>
                <span className="invested">
                    Invested: ₹{investmentAmount}
                </span>
              </div>
            </div>

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
