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

  // -----------------------------
  // STATE
  // -----------------------------
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const [transactions, setTransactions] = useState([])


  // Monthly numbers
  const [openingBalance, setOpeningBalance] = useState(0)
  const [closingBalance, setClosingBalance] = useState(0)
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [saving, setSaving] = useState(0)
  const [invested, setInvested] = useState(0)

  // const BASE_URL = "http://localhost:8000/vision"
  const BASE_URL = import.meta.env.VITE_API_URL


  const [isMonthClosed, setIsMonthClosed] = useState(false)

  // Lifetime summary
  const [currentBalance, setCurrentBalance] = useState(0)
  const [totalSavings, setTotalSavings] = useState(0)
  const [totalInvested, setTotalInvested] = useState(0)

  // const BASE_URL = "http://localhost:8000/vision"
  const BASE_URL = import.meta.env.VITE_API_URL

  // -----------------------------
  // FETCH MONTH DATA
  // -----------------------------
  async function fetchActivity(m = month, y = year) {
    try {
      const res = await fetch(`${BASE_URL}?month=${m}&year=${y}`)
      if (!res.ok) throw new Error("Failed to load activity")

      const data = await res.json()

      setOpeningBalance(data.opening_balance ?? 0)
      setClosingBalance(data.closing_balance ?? 0)
      setIncome(data.income_amount ?? 0)
      setExpense(data.expense_amount ?? 0)
      setSaving(data.saving_amount ?? 0)
      setInvested(data.investment_amount ?? 0)
      setIsMonthClosed(data.is_month_closed ?? false)

      const activity = data.activity || {}
      const flat = []

      Object.entries(activity).forEach(([type, items]) => {
        items.forEach(item => {
          flat.push({ type, ...item })
        })
      })

      setTransactions(flat)
    } catch (err) {
      console.error(err)
      setTransactions([])
    }
  }

  // -----------------------------
  // FETCH SUMMARY
  // -----------------------------
  async function fetchSummary() {
    try {
      const res = await fetch(`${BASE_URL}/summary`)
      if (!res.ok) return

      const data = await res.json()

      setCurrentBalance(data.current_balance ?? 0)
      setTotalSavings(data.total_savings ?? 0)
      setTotalInvested(data.total_invested ?? 0)
    } catch (err) {
      console.error(err)
    }
  }

  // Initial load
  useEffect(() => {
    fetchSummary()
  }, [])

  // Reload on month/year change
  useEffect(() => {
    fetchActivity(month, year)
  }, [month, year])

  // -----------------------------
  // ADD TRANSACTION
  // -----------------------------
  async function handleAddTransaction(txn) {
    if (isMonthClosed) {
      alert("This month is closed.")
      return
    }

    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, year, txn })
      })

      if (!res.ok) throw new Error("Save failed")

      fetchActivity(month, year)
      fetchSummary()
    } catch (err) {
      alert(err.message)
    }
  }

  // -----------------------------
  // CLOSE MONTH
  // -----------------------------
  async function handleCloseMonth() {
    if (!window.confirm("Close this month?")) return

    try {
      const res = await fetch(
        `${BASE_URL}/close_month?month=${month}&year=${year}`,
        { method: "POST" }
      )

      if (!res.ok) throw new Error("Close failed")

      fetchActivity(month, year)
      fetchSummary()

      alert("Month closed successfully")
    } catch (err) {
      alert(err.message)
    }
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="app">
      <header className="header-main">Vision</header>

      {/* Lifetime Summary */}
      <div className="lifetime-summary">
        <div>🏦 Current Balance: ₹{currentBalance}</div>
        <div>💰 Total Savings: ₹{totalSavings}</div>
        <div>📈 Total Invested: ₹{totalInvested}</div>
      </div>

      <MonthYearSelector
        month={month}
        year={year}
        onChange={(m, y) => {
          setMonth(m)
          setYear(y)
        }}
      />

      <main className="content">
        <section className="dashboard">

          {!isMonthClosed && (
            <TransactionInput onAdd={handleAddTransaction} />
          )}

          <div className="card">

            <div className="month-header">
              <h2>{months[month - 1]} {year}</h2>

              <div className="amount-summary">
                <div>Opening: ₹{openingBalance}</div>
                <div>Closing: ₹{closingBalance}</div>
              </div>
            </div>

            <div className="stats">
              <div>Income: ₹{income}</div>
              <div>Expense: ₹{expense}</div>
              <div>Savings: ₹{saving}</div>
              <div>Invested: ₹{invested}</div>
            </div>

            <div style={{ margin: "12px 0" }}>
              {isMonthClosed ? (
                <button className="btn-disabled" disabled>
                  🔒 Month Closed
                </button>
              ) : (
                <button className="btn-danger" onClick={handleCloseMonth}>
                  Close This Month
                </button>
              )}
            </div>

            <p className="muted">Transactions</p>

            {transactions.length === 0 ? (
  <p className="muted">No transactions added</p>
) : (
  <div className="table-wrapper">
    <table className="txn-table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Amount (₹)</th>
          <th>Category</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t, i) => (
          <tr key={i}>
            <td>{t.type}</td>
            <td>{t.amount}</td>
            <td>{t.category}</td>
            <td>
              {t.ts ? new Date(t.ts).toLocaleDateString() : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

          </div>

        </section>
      </main>
    </div>
  )
}

export default App
