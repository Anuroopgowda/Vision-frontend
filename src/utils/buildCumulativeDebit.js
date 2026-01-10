// utils/buildCumulativeDebit.js
export function buildCumulativeDebit(debits) {
  let total = 0

  return debits
    .sort((a, b) => new Date(a.ts) - new Date(b.ts))
    .map((d) => {
      total += d.amount
      return {
        time: new Date(d.ts).toLocaleTimeString(),
        spent: total
      }
    })
}
