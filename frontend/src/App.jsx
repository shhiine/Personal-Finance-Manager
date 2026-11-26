import Transactions from './pages/Transactions.jsx'
import Analytics from './pages/Analytics.jsx'
import { useFinance } from './context/FinanceContext'
import { useState } from 'react'
import {
  LayoutDashboard, ArrowLeftRight, Wallet, ChartPie,
  Target, HandCoins, CalendarDays, Settings, Plus,
  Bell, Search, Sun, Moon, Menu, Landmark, ArrowUpRight,
  ArrowDownRight, CreditCard, CircleHelp, LogOut,
  ChevronDown, Filter, MoreHorizontal, CircleDollarSign
} from 'lucide-react'

import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, BarChart, Bar
} from 'recharts'

const navigation = [
  { name: 'Overview', icon: LayoutDashboard },
  { name: 'Transactions', icon: ArrowLeftRight },
  { name: 'Accounts', icon: Wallet },
  { name: 'Analytics', icon: ChartPie },
  { name: 'Budgets', icon: ChartPie },
  { name: 'Savings Goals', icon: Target },
  { name: 'Debts & EMIs', icon: HandCoins },
  { name: 'Calendar', icon: CalendarDays },
  
]

const chartData = [
  { month: 'Jun', income: 28000, expenses: 18000 },
  { month: 'Jul', income: 32000, expenses: 21000 },
  { month: 'Aug', income: 30000, expenses: 22000 },
  { month: 'Sep', income: 35000, expenses: 24000 },
  { month: 'Oct', income: 33000, expenses: 22000 },
  { month: 'Nov', income: 35000, expenses: 18500 },
]

const transactions = [
  { name: 'Salary credited', category: 'Income', date: 'Today, 10:30 AM', amount: 25000, icon: Landmark },
  { name: 'Grocery shopping', category: 'Food & Groceries', date: 'Today, 09:15 AM', amount: -850, icon: Wallet },
  { name: 'Electricity bill', category: 'Utilities', date: 'Yesterday', amount: -1200, icon: CircleDollarSign },
  { name: 'Freelance payment', category: 'Additional income', date: 'Nov 21', amount: 3500, icon: ArrowUpRight },
  { name: 'Shopping', category: 'Personal', date: 'Nov 20', amount: -1750, icon: CreditCard },
]

const accounts = [
  { name: 'Main Bank Account', type: 'Savings account', balance: 80000, icon: Landmark },
  { name: 'Cash Wallet', type: 'Physical cash', balance: 4500, icon: Wallet },
  { name: 'UPI Balance', type: 'Digital wallet', balance: 12000, icon: CircleDollarSign },
]

const money = value =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
  
const transactionCategories = {
  Expense: ['Food', 'Shopping','Groceries','Entertainment','Health', 'Travel'],
  Income: ['Salary','Gift','Freelance', 'Investment', 'Other'],
}

function App()
 { const {
  accounts: financeAccounts,
  transactions: financeTransactions,
  setTransactions,
} = useFinance()
  
  const [theme, setTheme] = useState(() =>
    localStorage.getItem('finora-theme') || 'light'
  )
  
  const [activePage, setActivePage] = useState('Overview')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [transactionType, setTransactionType] = useState('Expense')
  const [showBalance, setShowBalance] = useState(true)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dashboardTransactions, setDashboardTransactions] = useState(transactions)
  const [newTransaction, setNewTransaction] = useState({
     amount: '',
  description: '',
  category: '',
  accountId: '',
  })

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('finora-theme', next)
  }

  return (
    <div className={`app-shell ${theme}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <div className="finance-app">

        {/* Navigation rail */}
        <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
          <div className="brand">
            <div className="brand-icon"><Landmark size={21} /></div>
            <div>
              <h1>Finora</h1>
              <span>PERSONAL FINANCE</span>
            </div>
          </div>

          <div className="sidebar-label">WORKSPACE</div>

          <nav className="navigation">
            {navigation.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.name}
                  className={`nav-item ${activePage === item.name ? 'active' : ''}`}
                  onClick={() => {
                    setActivePage(item.name)
                    setMobileMenu(false)
                  }}
                  title={item.name}
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </button>
              )
            })}
          </nav>

          <div className="sidebar-bottom">
            <button className="nav-item" onClick={() => setActivePage('Settings')}>
              <Settings size={19} /><span>Settings</span>
            </button>
            <button className="nav-item">
              <CircleHelp size={19} /><span>Help & Support</span>
            </button>
          </div>

          <div className="sidebar-user">
            <div className="avatar">S</div>
            <div className="user-info">
              <strong>Personal Account</strong>
              <span>Free account</span>
            </div>
            <ChevronDown size={16} />
          </div>
        </aside>

        {/* Main dashboard */}
        <main className="main-content">

          <header className="topbar">
            <div className="topbar-left">
              <button className="icon-button mobile-menu-button"
                onClick={() => setMobileMenu(!mobileMenu)}>
                <Menu size={20} />
              </button>
              <div>
                <h2>{activePage}</h2>
                <p>Manage your finances with confidence</p>
              </div>
            </div>

            <div className="topbar-actions">
              <button className="icon-button search-button" aria-label="Search">
                <Search size={19} />
              </button>

              <button className="icon-button" aria-label="Notifications">
                <Bell size={19} />
                <span className="notification-dot" />
              </button>

              <button className="icon-button theme-button"
                onClick={toggleTheme}
                aria-label="Toggle colour theme"
                title="Toggle light and dark mode">
                {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
              </button>

              <div className="profile">
                <div className="avatar">S</div>
                <span>My Account</span>
                <ChevronDown size={15} />
              </div>
            </div>
          </header>

          {showSearch && (
            <div className="global-search">
              <Search size={17} />
              <input
                autoFocus
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                placeholder="Search transactions, accounts and categories..."
                aria-label="Search Finora"
              />
              <button className="search-close" onClick={() => { setShowSearch(false); setSearchQuery('') }}>Esc</button>
            </div>
          )}

         {activePage === 'Transactions' ? (
  <Transactions />
) : (
  <div className="dashboard-content">

            <section className="welcome-section">
              <div>
                <h2>Good morning Shine !</h2>
                <p>Here's your financial overview for November.</p>
              </div>
              <button className="primary-button" onClick={() => setShowAdd(true)}>
                <Plus size={18} /> Add Transaction
              </button>
            </section>

            {/* Top cards */}
            <section className="top-grid">

              <div className="balance-card">
                <div className="balance-top">
                  <span>Total Available Balance</span>
                  <button className="balance-visibility" type="button"
                    onClick={() => setShowBalance(value => !value)}
                    aria-label={showBalance ? 'Hide balance' : 'Show balance'}
                    title={showBalance ? 'Hide balance' : 'Show balance'}>
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                <h2>{showBalance ? money(96500) : "••••••"}</h2>

                <div className="balance-change">
                  <ArrowUpRight size={15} />
                  <span>8.4% this month</span>
                </div>

                <div className="balance-footer">
                  <button onClick={() => setActivePage('Accounts')}>
                    <ArrowLeftRight size={16} /> Transfer
                  </button>
                  <button onClick={() => setShowAdd(true)}>
                    <Plus size={16} /> Add Money
                  </button>
                </div>
              </div>

              <div className="metric-card">
                <div className="card-heading">
                  <span>Total Income</span>
                  <div className="metric-icon income-icon">
                    <ArrowDownRight size={18} />
                  </div>
                </div>
                <h2>{money(35000)}</h2>
                <span className="positive-label">↑ 12.5% vs last month</span>
                <div className="mini-bars">
                  {[35, 55, 42, 70, 58, 90, 75, 100, 65, 80, 58, 95].map((h, i) =>
                    <div key={i} style={{height: `${h}%`}} />
                  )}
                </div>
              </div>

              <div className="metric-card">
                <div className="card-heading">
                  <span>Total Expenses</span>
                  <div className="metric-icon expense-icon">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
                <h2>{money(18500)}</h2>
                <span className="positive-label">↓ 5.2% vs last month</span>
                <div className="mini-bars expense-bars">
                  {[65, 40, 80, 55, 90, 48, 72, 60, 85, 45, 68, 50].map((h, i) =>
                    <div key={i} style={{height: `${h}%`}} />
                  )}
                </div>
              </div>

            </section>

            {/* Middle dashboard */}
            <section className="middle-grid">

              <div className="panel cashflow-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Income & Expenses</h3>
                    <p>Your monthly cash flow</p>
                  </div>
                  <select defaultValue="6 months" aria-label="Chart period">
                    <option>6 months</option>
                    <option>12 months</option>
                  </select>
                </div>

                <div className="chart-legend">
                  <span><i className="legend-income" /> Income</span>
                  <span><i className="legend-expense" /> Expenses</span>
                </div>

                <div className="cashflow-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2457D6" stopOpacity={0.2}/>
                          <stop offset="100%" stopColor="#2457D6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#E59B50" stopOpacity={0.15}/>
                          <stop offset="100%" stopColor="#E59B50" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="month" tickLine={false} axisLine={false}
                        tick={{fill:'var(--muted)',fontSize:11}} />
                      <YAxis hide />
                      <Tooltip formatter={value => money(value)} />
                      <Area type="monotone" dataKey="income"
                        stroke="#2457D6" fill="url(#incomeGradient)" strokeWidth={2.5}/>
                      <Area type="monotone" dataKey="expenses"
                        stroke="#E59B50" fill="url(#expenseGradient)" strokeWidth={2.5}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="panel budget-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Monthly Budget</h3>
                    <p>November spending limit</p>
                  </div>
                  <ChartPie size={20} className="muted-icon" />
                </div>

                <div className="budget-number">
                  <h2>{money(18500)}</h2>
                  <span>of {money(30000)}</span>
                </div>

                <div className="progress-track">
                  <div className="progress-fill" style={{width:'61.7%'}} />
                </div>

                <div className="budget-details">
                  <span>61.7% used</span>
                  <strong>{money(11500)} left</strong>
                </div>

                <div className="budget-separator" />

                <div className="budget-summary">
                  <div><span className="dot blue-dot" /> Food & groceries</div>
                  <strong>₹6,500</strong>
                </div>
                <div className="budget-summary">
                  <div><span className="dot orange-dot" /> Shopping</div>
                  <strong>₹4,000</strong>
                </div>
                <div className="budget-summary">
                  <div><span className="dot green-dot" /> Utilities</div>
                  <strong>₹3,000</strong>
                </div>
              </div>

            </section>

            {/* Bottom dashboard */}
            <section className="bottom-grid">

              <div className="panel accounts-panel">
                <div className="panel-heading">
                  <div>
                    <h3>My Accounts</h3>
                    <p>Your financial accounts</p>
                  </div>
                  <button className="text-button" onClick={() => setActivePage('Accounts')}>
                    View all
                  </button>
                </div>

                {accounts.map(account => {
                  const Icon = account.icon
                  return (
                    <div className="account-row" key={account.name}>
                      <div className="account-icon"><Icon size={19}/></div>
                      <div className="account-info">
                        <strong>{account.name}</strong>
                        <span>{account.type}</span>
                      </div>
                      <strong>{money(account.balance)}</strong>
                    </div>
                  )
                })}

                <button className="add-account" onClick={() => setActivePage('Accounts')}>
                  <Plus size={16}/> Add new account
                </button>
              </div>

              <div className="panel transactions-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Recent Transactions</h3>
                    <p>Your latest financial activity</p>
                  </div>
                  <button className="filter-button" onClick={() => setActivePage('Transactions')}>
                    <Filter size={15}/> Filter
                  </button>
                </div>

                <div className="transaction-list">
                  {dashboardTransactions.filter(transaction => `${transaction.name} ${transaction.category}`.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5).map((transaction, i) => {
                    const Icon = transaction.icon
                    return (
                      <div className="transaction-row" key={i}>
                        <div className="transaction-icon"><Icon size={17}/></div>
                        <div className="transaction-info">
                          <strong>{transaction.name}</strong>
                          <span>{transaction.category} · {transaction.date}</span>
                        </div>
                        <strong className={transaction.amount > 0 ? 'amount-income' : 'amount-expense'}>
                          {transaction.amount > 0 ? '+' : '−'} {money(Math.abs(transaction.amount))}
                        </strong>
                      </div>
                    )
                  })}
                </div>
              </div>

            </section>

            <footer className="dashboard-footer">
              Finora Personal Finance Manager · Your money, organized.
            </footer>
          </div>
)}
        </main>
      </div>

      {/* Add transaction dialog */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="transaction-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-heading">
              <h3>Add Transaction</h3>
              <button className="icon-button" onClick={() => setShowAdd(false)}>×</button>
            </div>
            <div className="transaction-tabs">
              {['Expense', 'Income'].map(type => (
                <button key={type}
                  className={transactionType === type ? 'selected' : ''}
                  onClick={() => setTransactionType(type)}>
                  {type}
                </button>
              ))}
            </div>
            <label>Amount (₹)</label>
            <input
              type="number"
              min="1"
              value={newTransaction.amount}
              onChange={event => setNewTransaction({ ...newTransaction, amount: event.target.value })}
              placeholder="Enter amount"
            />
            <label>Description</label>
            <input
              type="text"
              value={newTransaction.description}
              onChange={event => setNewTransaction({ ...newTransaction, description: event.target.value })}
              placeholder="What was this transaction for?"
            />
            <label>Category</label>
            <select
              value={newTransaction.category}
              onChange={event => setNewTransaction({ ...newTransaction, category: event.target.value })}
            >
             <option value="" disabled>Select category</option>

{transactionCategories[transactionType].map(category => (
  <option key={category} value={category}>
    {category}
  </option>
))}
            </select>
            <label>Account</label>
<select
  value={newTransaction.accountId}
  onChange={event =>
    setNewTransaction({
      ...newTransaction,
      accountId: event.target.value,
    })
  }
>
  <option value="" disabled>
    Select account
  </option>

  {financeAccounts.map(account => (
    <option key={account.id} value={account.id}>
      {account.name}
    </option>
  ))}
</select>
            <p className="modal-note">Saved locally for this session. Database sync will be added later.</p>
            <button
              className="primary-button modal-submit"
            
onClick={() => {
  const amount = Number(newTransaction.amount)
  const description = newTransaction.description.trim()

  if (
    !amount ||
    amount <= 0 ||
    !description ||
    !newTransaction.category ||
    !newTransaction.accountId
  ) return

  const isIncome = transactionType === 'Income'

  const transaction = {
    id: `transaction-${Date.now()}`,
    type: transactionType,
    amount,
    description,
    category: newTransaction.category,
    accountId: newTransaction.accountId,
    date: new Date().toISOString(),
  }

  // Save to FinanceContext
  setTransactions(current => [transaction, ...current])

  // Update the dashboard's recent transaction display
  setDashboardTransactions(current => [{
    name: description,
    category: newTransaction.category,
    date: 'Just now',
    amount: isIncome ? amount : -amount,
    icon: isIncome ? ArrowUpRight : Wallet,
  }, ...current])

  setNewTransaction({
    amount: '',
    description: '',
    category: '',
    accountId: '',
  })

  setShowAdd(false)
}}

            >
              Save transaction
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
