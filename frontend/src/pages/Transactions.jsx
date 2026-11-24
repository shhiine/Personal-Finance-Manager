import './Transactions.css'
import { useMemo, useState } from 'react'
import {
  Search, Plus, ArrowDownLeft, ArrowUpRight,
  ArrowLeftRight, CalendarDays, Filter, Download,
  MoreHorizontal, X, Wallet, CreditCard, Landmark,
  ChevronLeft, ChevronRight, SlidersHorizontal
} from 'lucide-react'

const initialTransactions = [
  { id: 'TXN-001', date: '2026-11-24', description: 'Salary Credited', category: 'Salary', account: 'Main Bank Account', method: 'Bank Transfer', type: 'Income', amount: 25000 },
  { id: 'TXN-002', date: '2026-11-24', description: 'Grocery Shopping', category: 'Food & Groceries', account: 'UPI Balance', method: 'UPI', type: 'Expense', amount: 850 },
  { id: 'TXN-003', date: '2026-11-23', description: 'Electricity Bill', category: 'Utilities', account: 'Main Bank Account', method: 'UPI', type: 'Expense', amount: 1200 },
  { id: 'TXN-004', date: '2026-11-22', description: 'Freelance Payment', category: 'Additional Income', account: 'Main Bank Account', method: 'Bank Transfer', type: 'Income', amount: 3500 },
  { id: 'TXN-005', date: '2026-11-21', description: 'Shopping', category: 'Personal', account: 'UPI Balance', method: 'UPI', type: 'Expense', amount: 1750 },
  { id: 'TXN-006', date: '2026-11-20', description: 'Bank Transfer', category: 'Account Transfer', account: 'Main Bank Account', method: 'Internal Transfer', type: 'Transfer', amount: 5000 },
  { id: 'TXN-007', date: '2026-11-19', description: 'Restaurant', category: 'Food & Dining', account: 'Cash Wallet', method: 'Cash', type: 'Expense', amount: 650 },
  { id: 'TXN-008', date: '2026-11-18', description: 'Internet Bill', category: 'Utilities', account: 'Main Bank Account', method: 'UPI', type: 'Expense', amount: 799 },
]

const formatMoney = amount =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)

const formatDate = date =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

function Transactions() {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All')
  const [category, setCategory] = useState('All')
  const [account, setAccount] = useState('All')
  const [period, setPeriod] = useState('All time')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [formType, setFormType] = useState('Expense')
  const [page, setPage] = useState(1)

  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: '',
    account: 'Main Bank Account',
    destination: 'UPI Balance',
    method: 'UPI',
    date: '2026-11-24',
    notes: ''
  })

  const filteredTransactions = useMemo(() => {
    const now = new Date()
    const cutoff = new Date(now)

    if (period === 'This month') cutoff.setDate(1)
    if (period === 'Last 30 days') cutoff.setDate(now.getDate() - 30)
    if (period === 'Last 7 days') cutoff.setDate(now.getDate() - 7)

    return transactions.filter(tx => {
      const matchesSearch =
        `${tx.description} ${tx.category} ${tx.account} ${tx.id}`
          .toLowerCase().includes(search.toLowerCase())

      const matchesType = type === 'All' || tx.type === type
      const matchesCategory = category === 'All' || tx.category === category
      const matchesAccount = account === 'All' || tx.account === account

      const matchesPeriod =
        period === 'All time' || new Date(`${tx.date}T00:00:00`) >= cutoff

      return matchesSearch && matchesType &&
        matchesCategory && matchesAccount && matchesPeriod
    }).sort((a, b) => b.date.localeCompare(a.date))
  }, [transactions, search, type, category, account, period])

  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter(tx => tx.type === 'Income')
      .reduce((sum, tx) => sum + tx.amount, 0)

    const expenses = filteredTransactions
      .filter(tx => tx.type === 'Expense')
      .reduce((sum, tx) => sum + tx.amount, 0)

    const transfers = filteredTransactions
      .filter(tx => tx.type === 'Transfer')
      .reduce((sum, tx) => sum + tx.amount, 0)

    return { income, expenses, transfers, net: income - expenses }
  }, [filteredTransactions])

  const pageSize = 8
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visibleTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const openDrawer = () => {
    setFormType('Expense')
    setDrawerOpen(true)
  }

  const closeDrawer = () => setDrawerOpen(false)

  const handleSubmit = event => {
    event.preventDefault()

    const amount = Number(form.amount)
    if (!form.description.trim() || !Number.isFinite(amount) || amount <= 0) {
      return
    }

    const newTransaction = {
      id: `TXN-${Date.now()}`,
      date: form.date,
      description: form.description.trim(),
      category: formType === 'Transfer' ? 'Account Transfer' : form.category,
      account: form.account,
      destination: formType === 'Transfer' ? form.destination : undefined,
      method: formType === 'Transfer' ? 'Internal Transfer' : form.method,
      type: formType,
      amount
    }

    setTransactions(previous => [newTransaction, ...previous])
    setPage(1)
    setSearch('')
    setType('All')
    setCategory('All')
    setAccount('All')
    setPeriod('All time')
    setDrawerOpen(false)

    setForm({
      description: '',
      amount: '',
      category: '',
      account: 'Main Bank Account',
      destination: 'UPI Balance',
      method: 'UPI',
      date: '2026-11-24',
      notes: ''
    })
  }

  const categories = [...new Set(transactions
    .filter(tx => tx.type !== 'Transfer')
    .map(tx => tx.category))]

  const accounts = [...new Set(transactions.map(tx => tx.account))]

  const typeIcon = tx => {
    if (tx.type === 'Income') return <ArrowDownLeft size={17} />
    if (tx.type === 'Transfer') return <ArrowLeftRight size={17} />
    return <ArrowUpRight size={17} />
  }

  return (
    <div className="dashboard-content transactions-page">

      {/* Page heading */}
      <section className="transactions-heading">
        <div>
          <h2>Transaction History</h2>
          <p>Track, search and manage all your financial activities.</p>
        </div>

        <button className="primary-button" onClick={openDrawer}>
          <Plus size={17} /> Add Transaction
        </button>
      </section>

      {/* Summary cards */}
      <section className="transaction-summary">

        <div className="transaction-stat">
          <div className="stat-top">
            <span>Total Income</span>
            <span className="stat-icon income-icon"><ArrowDownLeft size={18}/></span>
          </div>
          <h3 className="amount-income">{formatMoney(summary.income)}</h3>
          <span className="stat-caption">Selected transactions</span>
        </div>

        <div className="transaction-stat">
          <div className="stat-top">
            <span>Total Expenses</span>
            <span className="stat-icon expense-icon"><ArrowUpRight size={18}/></span>
          </div>
          <h3>{formatMoney(summary.expenses)}</h3>
          <span className="stat-caption">Selected transactions</span>
        </div>

        <div className="transaction-stat">
          <div className="stat-top">
            <span>Total Transfers</span>
            <span className="stat-icon transfer-icon"><ArrowLeftRight size={18}/></span>
          </div>
          <h3>{formatMoney(summary.transfers)}</h3>
          <span className="stat-caption">Between your accounts</span>
        </div>

        <div className="transaction-stat">
          <div className="stat-top">
            <span>Net Cash Flow</span>
            <span className="stat-icon net-icon"><Wallet size={18}/></span>
          </div>
          <h3 className={summary.net >= 0 ? 'amount-income' : 'amount-expense'}>
            {summary.net < 0 ? '−' : ''}{formatMoney(Math.abs(summary.net))}
          </h3>
          <span className="stat-caption">Income minus expenses</span>
        </div>

      </section>

      {/* Filters */}
      <section className="panel transaction-management">
        <div className="transaction-filter-heading">
          <div>
            <h3>All Transactions</h3>
            <p>Search and filter your transaction history.</p>
          </div>
          <button className="filter-button" onClick={() => {
            setSearch('')
            setType('All')
            setCategory('All')
            setAccount('All')
            setPeriod('All time')
            setPage(1)
          }}>
            <SlidersHorizontal size={15}/> Clear filters
          </button>
        </div>

        <div className="transaction-search-row">
          <div className="transaction-search">
            <Search size={17}/>
            <input
              value={search}
              onChange={e => {setSearch(e.target.value); setPage(1)}}
              placeholder="Search by description, category or ID..."
            />
            {search && (
              <button onClick={() => setSearch('')} aria-label="Clear search">
                <X size={15}/>
              </button>
            )}
          </div>

          <select value={period} onChange={e => {setPeriod(e.target.value); setPage(1)}}>
            <option>All time</option>
            <option>This month</option>
            <option>Last 30 days</option>
            <option>Last 7 days</option>
          </select>

          <select value={category} onChange={e => {setCategory(e.target.value); setPage(1)}}>
            <option value="All">All categories</option>
            {categories.map(item => <option key={item}>{item}</option>)}
          </select>

          <select value={account} onChange={e => {setAccount(e.target.value); setPage(1)}}>
            <option value="All">All accounts</option>
            {accounts.map(item => <option key={item}>{item}</option>)}
          </select>
        </div>

        <div className="transaction-type-tabs">
          {['All', 'Income', 'Expense', 'Transfer'].map(item => (
            <button
              key={item}
              className={type === item ? 'selected' : ''}
              onClick={() => {setType(item); setPage(1)}}
            >
              {item}
              {item === 'All' && <span>{transactions.length}</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Transaction table */}
      <section className="panel transaction-table-panel">
        <div className="transaction-table-heading">
          <div>
            <h3>Transaction Records</h3>
            <p>All your recorded financial activities</p>
          </div>

          <button className="filter-button" onClick={() => {
            const rows = [
              ['ID','Date','Description','Category','Account','Method','Type','Amount'],
              ...filteredTransactions.map(tx => [
                tx.id, tx.date, tx.description, tx.category,
                tx.account, tx.method, tx.type, tx.amount
              ])
            ]
            const csv = rows.map(row =>
              row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')
            ).join('\n')

            const url = URL.createObjectURL(
              new Blob([csv], { type: 'text/csv;charset=utf-8;' })
            )
            const link = document.createElement('a')
            link.href = url
            link.download = 'finora-transactions.csv'
            link.click()
            URL.revokeObjectURL(url)
          }}>
            <Download size={15}/> Export CSV
          </button>
        </div>

        <div className="transaction-table-scroll">
          <table className="finance-transactions-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Date</th>
                <th>Category</th>
                <th>Account</th>
                <th>Payment Method</th>
                <th>Type</th>
                <th className="text-right">Amount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {visibleTransactions.map(tx => (
                <tr key={tx.id}>
                  <td>
                    <div className="table-transaction-name">
                      <div className={`transaction-type-icon ${tx.type.toLowerCase()}`}>
                        {typeIcon(tx)}
                      </div>
                      <div>
                        <strong>{tx.description}</strong>
                        <span>{tx.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>{formatDate(tx.date)}</td>
                  <td>{tx.category}</td>
                  <td>{tx.account}</td>
                  <td>{tx.method}</td>
                  <td>
                    <span className={`type-badge ${tx.type.toLowerCase()}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`text-right transaction-amount ${
                    tx.type === 'Income' ? 'amount-income' :
                    tx.type === 'Expense' ? 'amount-expense' : ''
                  }`}>
                    {tx.type === 'Income' ? '+' : tx.type === 'Expense' ? '−' : ''}
                    {formatMoney(tx.amount)}
                  </td>
                  <td>
                    <button className="table-action" title="More actions">
                      <MoreHorizontal size={18}/>
                    </button>
                  </td>
                </tr>
              ))}

              {visibleTransactions.length === 0 && (
                <tr>
                  <td colSpan="8" className="transaction-empty">
                    <Search size={25}/>
                    <strong>No transactions found</strong>
                    <span>Try changing your search or filters.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="transaction-pagination">
          <span>
            Showing {filteredTransactions.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            {' '}– {Math.min(currentPage * pageSize, filteredTransactions.length)}
            {' '}of {filteredTransactions.length} transactions
          </span>

          <div>
            <button disabled={currentPage === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}>
              <ChevronLeft size={17}/>
            </button>
            <span>{currentPage} / {totalPages}</span>
            <button disabled={currentPage === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
              <ChevronRight size={17}/>
            </button>
          </div>
        </div>
      </section>

      {/* Right-side drawer */}
      {drawerOpen && (
        <div className="transaction-drawer-overlay" onClick={closeDrawer}>
          <aside className="transaction-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-heading">
              <div>
                <h3>Add Transaction</h3>
                <p>Record a new financial activity</p>
              </div>
              <button className="icon-button" onClick={closeDrawer}>
                <X size={19}/>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Transaction Type</label>

              <div className="drawer-type-tabs">
                {['Expense', 'Income', 'Transfer'].map(item => (
                  <button
                    type="button"
                    key={item}
                    className={formType === item ? `selected ${item.toLowerCase()}` : ''}
                    onClick={() => setFormType(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <label htmlFor="tx-amount">Amount (₹)</label>
              <input
                id="tx-amount"
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="0.00"
                value={form.amount}
                onChange={e => setForm({...form, amount:e.target.value})}
              />

              <label htmlFor="tx-description">Description</label>
              <input
                id="tx-description"
                required
                placeholder="Enter transaction description"
                value={form.description}
                onChange={e => setForm({...form, description:e.target.value})}
              />

              {formType !== 'Transfer' ? (
                <>
                  <label htmlFor="tx-category">Category</label>
                  <select id="tx-category" required value={form.category}
                    onChange={e => setForm({...form, category:e.target.value})}>
                    <option value="">Select category</option>
                    {(formType === 'Income'
                      ? ['Salary','Business','Freelance','Investment','Gift','Other Income']
                      : ['Food & Groceries','Food & Dining','Shopping','Transport','Utilities','Health','Entertainment','Education','Other Expenses']
                    ).map(item => <option key={item}>{item}</option>)}
                  </select>
                </>
              ) : (
                <>
                  <label htmlFor="tx-account">From Account</label>
                  <select id="tx-account" value={form.account}
                    onChange={e => setForm({...form, account:e.target.value})}>
                    <option>Main Bank Account</option>
                    <option>Cash Wallet</option>
                    <option>UPI Balance</option>
                  </select>

                  <label htmlFor="tx-destination">To Account</label>
                  <select id="tx-destination" value={form.destination}
                    onChange={e => setForm({...form, destination:e.target.value})}>
                    <option>Main Bank Account</option>
                    <option>Cash Wallet</option>
                    <option>UPI Balance</option>
                  </select>
                </>
              )}

              <label htmlFor="tx-account">Account</label>
              {formType !== 'Transfer' && (
                <select id="tx-account" value={form.account}
                  onChange={e => setForm({...form, account:e.target.value})}>
                  <option>Main Bank Account</option>
                  <option>Cash Wallet</option>
                  <option>UPI Balance</option>
                </select>
              )}

              {formType !== 'Transfer' && (
                <>
                  <label htmlFor="tx-method">Payment Method</label>
                  <select id="tx-method" value={form.method}
                    onChange={e => setForm({...form, method:e.target.value})}>
                    <option>UPI</option>
                    <option>Cash</option>
                    <option>Debit Card</option>
                    <option>Credit Card</option>
                    <option>Bank Transfer</option>
                  </select>
                </>
              )}

              <label htmlFor="tx-date">Transaction Date</label>
              <input
                id="tx-date"
                type="date"
                required
                value={form.date}
                onChange={e => setForm({...form, date:e.target.value})}
              />

              <label htmlFor="tx-notes">Notes (optional)</label>
              <textarea
                id="tx-notes"
                rows="3"
                placeholder="Add any additional information..."
                value={form.notes}
                onChange={e => setForm({...form, notes:e.target.value})}
              />

              <div className="drawer-footer">
                <button type="button" className="filter-button" onClick={closeDrawer}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  <Plus size={16}/> Save Transaction
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}

    </div>
  )
}

export default Transactions
