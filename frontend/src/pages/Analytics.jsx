import { useMemo, useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  CalendarDays, Wallet, ArrowDownToLine, ArrowUpFromLine,
  Lightbulb, RotateCcw, Utensils, ShoppingBag, Car, House,
  HeartPulse, GraduationCap, MoreHorizontal, TrendingUp
} from 'lucide-react'
import './Analytics.css'

const CATEGORY_COLORS = {
  'Food & Groceries': '#3268df',
  Shopping: '#e6a34f',
  Transport: '#20a17b',
  Bills: '#8b75d6',
  Health: '#d66f86',
  Education: '#5b9bb8',
  Other: '#9aa7b8',
}

const CATEGORY_ICONS = {
  'Food & Groceries': Utensils,
  Shopping: ShoppingBag,
  Transport: Car,
  Bills: House,
  Health: HeartPulse,
  Education: GraduationCap,
  Other: MoreHorizontal,
}

const DEMO_TRANSACTIONS = [
  { id: '1', date: '2026-11-25', title: 'Salary credited', type: 'Income', category: 'Salary', amount: 35000 },
  { id: '2', date: '2026-11-25', title: 'Grocery shopping', type: 'Expense', category: 'Food & Groceries', amount: 850 },
  { id: '3', date: '2026-11-24', title: 'Electricity bill', type: 'Expense', category: 'Bills', amount: 1200 },
  { id: '4', date: '2026-11-21', title: 'Freelance payment', type: 'Income', category: 'Freelance', amount: 3500 },
  { id: '5', date: '2026-11-20', title: 'Shopping', type: 'Expense', category: 'Shopping', amount: 1750 },
  { id: '6', date: '2026-11-19', title: 'Monthly groceries', type: 'Expense', category: 'Food & Groceries', amount: 5650 },
  { id: '7', date: '2026-11-17', title: 'Fuel', type: 'Expense', category: 'Transport', amount: 1800 },
  { id: '8', date: '2026-11-15', title: 'Internet and mobile', type: 'Expense', category: 'Bills', amount: 1800 },
  { id: '9', date: '2026-11-12', title: 'Pharmacy', type: 'Expense', category: 'Health', amount: 900 },
  { id: '10', date: '2026-11-08', title: 'Course subscription', type: 'Expense', category: 'Education', amount: 1500 },
  { id: '11', date: '2026-11-04', title: 'Restaurant', type: 'Expense', category: 'Food & Groceries', amount: 2100 },
  { id: '12', date: '2026-11-02', title: 'Cab fare', type: 'Expense', category: 'Transport', amount: 950 },
  { id: '13', date: '2026-10-28', title: 'Salary credited', type: 'Income', category: 'Salary', amount: 35000 },
  { id: '14', date: '2026-10-20', title: 'Groceries', type: 'Expense', category: 'Food & Groceries', amount: 5200 },
  { id: '15', date: '2026-10-18', title: 'Shopping', type: 'Expense', category: 'Shopping', amount: 4800 },
  { id: '16', date: '2026-10-12', title: 'Rent and utilities', type: 'Expense', category: 'Bills', amount: 3400 },
  { id: '17', date: '2026-10-09', title: 'Transport', type: 'Expense', category: 'Transport', amount: 2100 },
  { id: '18', date: '2026-09-27', title: 'Salary credited', type: 'Income', category: 'Salary', amount: 35000 },
  { id: '19', date: '2026-09-20', title: 'Food and groceries', type: 'Expense', category: 'Food & Groceries', amount: 6100 },
  { id: '20', date: '2026-09-17', title: 'Shopping', type: 'Expense', category: 'Shopping', amount: 3900 },
  { id: '21', date: '2026-08-26', title: 'Salary credited', type: 'Income', category: 'Salary', amount: 33000 },
  { id: '22', date: '2026-08-19', title: 'Food and groceries', type: 'Expense', category: 'Food & Groceries', amount: 5700 },
  { id: '23', date: '2026-07-26', title: 'Salary credited', type: 'Income', category: 'Salary', amount: 32000 },
  { id: '24', date: '2026-07-18', title: 'Food and groceries', type: 'Expense', category: 'Food & Groceries', amount: 4900 },
]

const formatMoney = amount => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(amount || 0)

const toDate = value => new Date(`${value}T12:00:00`)

function getPeriodStart(period) {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  if (period === '3months') start.setMonth(start.getMonth() - 2)
  if (period === '6months') start.setMonth(start.getMonth() - 5)
  if (period === '12months') start.setMonth(start.getMonth() - 11)
  return start
}

/**
 * Analytics page.
 * Pass your real transaction array through the `transactions` prop when ready.
 * Expected record: { id, date: 'YYYY-MM-DD', title, type: 'Income'|'Expense', category, amount }
 */
export default function Analytics({ transactions = DEMO_TRANSACTIONS }) {
  const [period, setPeriod] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [showAll, setShowAll] = useState(false)

  const safeTransactions = Array.isArray(transactions) ? transactions : []

  const filtered = useMemo(() => {
    const start = getPeriodStart(period)
    const end = new Date()
    end.setHours(23, 59, 59, 999)
    return safeTransactions.filter(item => {
      if (!item?.date || !Number.isFinite(Number(item.amount))) return false
      const date = toDate(item.date)
      return date >= start && date <= end
    })
  }, [safeTransactions, period])

  const totals = useMemo(() => {
    const income = filtered.filter(t => t.type === 'Income').reduce((sum, t) => sum + Number(t.amount), 0)
    const expenses = filtered.filter(t => t.type === 'Expense').reduce((sum, t) => sum + Number(t.amount), 0)
    const now = new Date()
    const days = period === 'month'
      ? now.getDate()
      : Math.max(1, Math.ceil((now - getPeriodStart(period)) / 86400000) + 1)
    return {
      income,
      expenses,
      net: income - expenses,
      daily: expenses / days,
      savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
    }
  }, [filtered, period])

  const categories = useMemo(() => {
    const totalsByCategory = {}
    filtered.filter(t => t.type === 'Expense').forEach(t => {
      const category = t.category || 'Other'
      totalsByCategory[category] = (totalsByCategory[category] || 0) + Number(t.amount)
    })
    return Object.entries(totalsByCategory)
      .map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_COLORS[name] || CATEGORY_COLORS.Other,
        percent: totals.expenses ? (value / totals.expenses) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value)
  }, [filtered, totals.expenses])

  const monthlyData = useMemo(() => {
    const count = period === 'month' ? 1 : period === '3months' ? 3 : period === '6months' ? 6 : 12
    const now = new Date()
    return Array.from({ length: count }, (_, index) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - count + index + 1, 1)
      const key = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`
      const rows = filtered.filter(t => String(t.date).startsWith(key))
      return {
        month: monthDate.toLocaleDateString('en-IN', { month: 'short' }),
        income: rows.filter(t => t.type === 'Income').reduce((sum, t) => sum + Number(t.amount), 0),
        expenses: rows.filter(t => t.type === 'Expense').reduce((sum, t) => sum + Number(t.amount), 0),
      }
    })
  }, [filtered, period])

  const insights = useMemo(() => {
    if (!filtered.length) return ['No transactions found in this period. Add transactions to generate spending insights.']
    if (!categories.length) return ['There are no expense records in this period yet.']
    const top = categories[0]
    const expenseCount = filtered.filter(t => t.type === 'Expense').length
    const average = expenseCount ? totals.expenses / expenseCount : 0
    const messages = [
      `${top.name} is your highest spending category, making up ${top.percent.toFixed(1)}% of your recorded expenses.`,
      `Your average expense transaction is ${formatMoney(average)}.`,
    ]
    if (totals.net >= 0) messages.push(`Your recorded income is higher than expenses by ${formatMoney(totals.net)}.`)
    else messages.push(`Your recorded expenses are higher than income by ${formatMoney(Math.abs(totals.net))}.`)
    return messages
  }, [filtered, categories, totals])

  const tableRows = filtered
    .filter(t => selectedCategory === 'All' || t.category === selectedCategory)
    .filter(t => typeFilter === 'All' || t.type === typeFilter)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))

  const periodLabel = {
    month: 'This month',
    '3months': 'Last 3 months',
    '6months': 'Last 6 months',
    '12months': 'Last 12 months',
  }[period]

  return (
    <main className="analytics-page">
      <header className="analytics-page-header">
        <div>
          <span className="analytics-eyebrow">YOUR MONEY, UNDERSTOOD</span>
          <h1>Financial Analytics</h1>
          <p>Understand your income, spending habits and financial trends.</p>
        </div>
        <label className="analytics-period-select">
          <CalendarDays size={17} />
          <select value={period} onChange={event => { setPeriod(event.target.value); setSelectedCategory('All') }}>
            <option value="month">This month</option>
            <option value="3months">Last 3 months</option>
            <option value="6months">Last 6 months</option>
            <option value="12months">Last 12 months</option>
          </select>
        </label>
      </header>

      <section className="analytics-summary-grid">
        <article className="analytics-summary-card analytics-summary-primary">
          <div className="analytics-summary-label">Total income <span><ArrowDownToLine size={17}/></span></div>
          <strong>{formatMoney(totals.income)}</strong>
          <small>Money received · {periodLabel}</small>
        </article>
        <article className="analytics-summary-card">
          <div className="analytics-summary-label">Total expenses <span className="analytics-icon-orange"><ArrowUpFromLine size={17}/></span></div>
          <strong>{formatMoney(totals.expenses)}</strong>
          <small>Money spent · {periodLabel}</small>
        </article>
        <article className="analytics-summary-card">
          <div className="analytics-summary-label">Net cash flow <span className="analytics-icon-green"><Wallet size={17}/></span></div>
          <strong className={totals.net >= 0 ? 'analytics-good' : 'analytics-bad'}>{formatMoney(totals.net)}</strong>
          <small>Income minus expenses</small>
        </article>
        <article className="analytics-summary-card">
          <div className="analytics-summary-label">Average daily spend <span className="analytics-icon-purple"><CalendarDays size={17}/></span></div>
          <strong>{formatMoney(totals.daily)}</strong>
          <small>Based on selected period</small>
        </article>
      </section>

      <section className="analytics-primary-grid">
        <article className="analytics-panel analytics-cashflow-panel">
          <div className="analytics-panel-heading">
            <div><h2>Income vs expenses</h2><p>Cash flow across {periodLabel.toLowerCase()}</p></div>
            <div className="analytics-legend"><span><i className="analytics-legend-income"/>Income</span><span><i className="analytics-legend-expense"/>Expenses</span></div>
          </div>
          <div className="analytics-cashflow-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="finoraIncomeGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3268df" stopOpacity={0.2}/><stop offset="100%" stopColor="#3268df" stopOpacity={0}/></linearGradient>
                  <linearGradient id="finoraExpenseGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e6a34f" stopOpacity={0.18}/><stop offset="100%" stopColor="#e6a34f" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)"/>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }}/>
                <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--muted)', fontSize: 11 }} tickFormatter={value => `₹${Math.round(value / 1000)}k`} width={42}/>
                <Tooltip formatter={value => formatMoney(value)} contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}/>
                <Area type="monotone" dataKey="income" name="Income" stroke="#3268df" strokeWidth={2.5} fill="url(#finoraIncomeGradient)"/>
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#e6a34f" strokeWidth={2.5} fill="url(#finoraExpenseGradient)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="analytics-panel analytics-category-panel">
          <div className="analytics-panel-heading"><div><h2>Expense by category</h2><p>Where your money goes</p></div></div>
          {categories.length ? <>
            <div className="analytics-donut">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categories} dataKey="value" nameKey="name" innerRadius="66%" outerRadius="88%" paddingAngle={3} stroke="none">
                    {categories.map(item => <Cell key={item.name} fill={item.color}/>)}
                  </Pie>
                  <Tooltip formatter={value => formatMoney(value)} contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="analytics-donut-label"><strong>{formatMoney(totals.expenses)}</strong><span>Total spent</span></div>
            </div>
            <div className="analytics-category-list">
              {categories.slice(0, 6).map(item => {
                const Icon = CATEGORY_ICONS[item.name] || MoreHorizontal
                return <button key={item.name} className={`analytics-category-row ${selectedCategory === item.name ? 'is-selected' : ''}`} onClick={() => setSelectedCategory(selectedCategory === item.name ? 'All' : item.name)}>
                  <span className="analytics-category-symbol" style={{ color: item.color }}><Icon size={15}/></span>
                  <span className="analytics-category-title">{item.name}</span>
                  <span className="analytics-category-percent">{item.percent.toFixed(0)}%</span>
                  <strong>{formatMoney(item.value)}</strong>
                </button>
              })}
            </div>
          </> : <div className="analytics-empty-state">No expense transactions in this period.</div>}
        </article>
      </section>

      <section className="analytics-secondary-grid">
        <article className="analytics-panel">
          <div className="analytics-panel-heading"><div><h2>Spending breakdown</h2><p>Compare your spending by category</p></div></div>
          {categories.length ? <div className="analytics-breakdown">
            {categories.map(item => <button key={item.name} className="analytics-breakdown-row" onClick={() => setSelectedCategory(selectedCategory === item.name ? 'All' : item.name)}>
              <span>{item.name}</span>
              <i><b style={{ width: `${item.percent}%`, background: item.color }}/></i>
              <strong>{formatMoney(item.value)}</strong>
            </button>)}
          </div> : <div className="analytics-empty-state">Your category breakdown will appear here.</div>}
        </article>

        <article className="analytics-panel">
          <div className="analytics-panel-heading"><div><h2>Spending insights</h2><p>Automatically generated from your records</p></div><span className="analytics-insight-icon"><Lightbulb size={19}/></span></div>
          <div className="analytics-insights">
            {insights.map((message, index) => <div className="analytics-insight-row" key={index}><span>{String(index + 1).padStart(2, '0')}</span><p>{message}</p></div>)}
          </div>
          <p className="analytics-disclaimer">Insights are based on recorded transactions and are not financial advice.</p>
        </article>
      </section>

      <section className="analytics-panel analytics-transactions-panel">
        <div className="analytics-panel-heading">
          <div><h2>Transaction analysis</h2><p>Explore transactions included in this report</p></div>
          <button className="analytics-reset-button" onClick={() => { setSelectedCategory('All'); setTypeFilter('All'); setShowAll(false) }}><RotateCcw size={14}/> Reset filters</button>
        </div>
        <div className="analytics-filter-row">
          <label>Type<select value={typeFilter} onChange={event => setTypeFilter(event.target.value)}><option value="All">All types</option><option value="Income">Income</option><option value="Expense">Expenses</option></select></label>
          <label>Category<select value={selectedCategory} onChange={event => setSelectedCategory(event.target.value)}><option value="All">All categories</option>{categories.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}</select></label>
          <span>{tableRows.length} records</span>
        </div>
        <div className="analytics-table-scroll">
          <table className="analytics-table">
            <thead><tr><th>Transaction</th><th>Category</th><th>Date</th><th>Type</th><th className="analytics-amount-cell">Amount</th></tr></thead>
            <tbody>
              {(showAll ? tableRows : tableRows.slice(0, 6)).map(item => <tr key={item.id}>
                <td className="analytics-transaction-name">{item.title || item.description || 'Transaction'}</td>
                <td>{item.category || 'Other'}</td>
                <td>{toDate(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td><span className={`analytics-type-tag ${String(item.type).toLowerCase()}`}>{item.type}</span></td>
                <td className={`analytics-amount-cell ${item.type === 'Income' ? 'analytics-good' : ''}`}>{item.type === 'Income' ? '+' : '−'} {formatMoney(item.amount)}</td>
              </tr>)}
              {!tableRows.length && <tr><td colSpan="5" className="analytics-empty-state">No transactions match the selected filters.</td></tr>}
            </tbody>
          </table>
        </div>
        {tableRows.length > 6 && <button className="analytics-show-more" onClick={() => setShowAll(value => !value)}>{showAll ? 'Show fewer transactions' : `Show all ${tableRows.length} transactions`}</button>}
      </section>

      <p className="analytics-data-note">The page currently uses built-in sample transactions. Pass your real transaction list through the <code>transactions</code> prop to analyse live app data.</p>
    </main>
  )
}
