import { useState } from 'react'

const months = [
  'January','February','March','April','May','June','July','August','September','October','November','December'
]

function MonthYearSelector({ onChange }) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(currentYear)

  const years = []
  for (let y = currentYear - 10; y <= currentYear + 5; y++) years.push(y)

  function handleMonth(e) {
    const m = Number(e.target.value)
    setMonth(m)
    onChange?.(m, year)
  }

  function handleYear(e) {
    const y = Number(e.target.value)
    setYear(y)
    onChange?.(month, y)
  }

  return (
    <div className="month-year-selector">
      <select value={month} onChange={handleMonth} aria-label="Select month">
        {months.map((m, i) => (
          <option key={m} value={i}>{m}</option>
        ))}
      </select>
      <select value={year} onChange={handleYear} aria-label="Select year">
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  )
}

export default MonthYearSelector
