import { useState } from "react"
import "./TransactionInput.css"

const TYPES = ["credited", "debited", "invested","savings"]
const CATEGORIES = ["stocks", "Bus", "TV", "Metro", "Family", "Daily products", "Salary", "Recharge", "Electricity bill", "fashion", "Loan", "Others"]

function TransactionInput({ onAdd }) {
  const [type, setType] = useState("credited")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("others")

  function handleAdd() {
    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount")
      return
    }

    onAdd({
      type,
      amount: Number(amount),
      category
    })

    setAmount("")
  }

  return (
    <div className="transaction-input">
      <select value={type} onChange={e => setType(e.target.value)}>
        {TYPES.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />

      <select value={category} onChange={e => setCategory(e.target.value)}>
        {CATEGORIES.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <button className="btn-add" onClick={handleAdd}>
        Add
      </button>
    </div>
  )
}

export default TransactionInput
