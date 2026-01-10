import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

const BASE_URL = "https://vision-yw22.onrender.com/vision"

export default function DebitLimitChart() {
  const [category, setCategory] = useState("Recharge")
  const [data, setData] = useState([])

  useEffect(() => {
    fetch(`${BASE_URL}/debit-trend?category=${category}`)
      .then(res => res.json())
      .then(setData)
  }, [category])

  return (
    <div className="card">
      <h3>📊 Last 5 Months Spending</h3>

      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        <option>Recharge</option>
        <option>Bus</option>
        <option>Metro</option>
        <option>Loan</option>
        <option>Daily products</option>
        <option>Others</option>
      </select>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#0d6efd" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
