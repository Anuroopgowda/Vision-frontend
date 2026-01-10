// components/SpendLimitChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer
} from "recharts"

import { buildCumulativeDebit } from "../utils/buildCumulativeDebit"

const LIMIT = 6000

export default function SpendLimitChart({ debits }) {
  const data = buildCumulativeDebit(debits)
  const totalSpent = data.length ? data[data.length - 1].spent : 0

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="spent"
            stroke={totalSpent > LIMIT ? "red" : "#2563eb"}
            strokeWidth={2}
            dot={false}
          />

          <ReferenceLine
            y={LIMIT}
            stroke="red"
            strokeDasharray="5 5"
            label="Limit ₹6000"
          />
        </LineChart>
      </ResponsiveContainer>

      {totalSpent > LIMIT && (
        <p style={{ color: "red", fontWeight: "bold", marginTop: 8 }}>
          ⚠️ Spending limit crossed
        </p>
      )}
    </>
  )
}
