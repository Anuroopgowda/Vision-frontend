const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

function MonthYearSelector({ month, year, onChange }) {

  function handleMonthChange(e) {
    onChange(Number(e.target.value), year)
  }

  function handleYearChange(e) {
    onChange(month, Number(e.target.value))
  }

  return (
    <div className="month-year-selector">
      <select value={month} onChange={handleMonthChange}>
        {months.map((m, i) => (
          <option key={i} value={i + 1}>
            {m}
          </option>
        ))}
      </select>

      <select value={year} onChange={handleYearChange}>
        {[2024, 2025, 2026].map(y => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  )
}

export default MonthYearSelector
