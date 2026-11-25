import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'finora-finance-data-v1'

const emptyFinanceData = {
  accounts: [],
  transactions: [],
  budgets: [],
}

function readStoredFinanceData() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return emptyFinanceData

    const parsed = JSON.parse(saved)

    return {
      accounts: Array.isArray(parsed.accounts) ? parsed.accounts : [],
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
      budgets: Array.isArray(parsed.budgets) ? parsed.budgets : [],
    }
  } catch {
    return emptyFinanceData
  }
}

function isInCurrentMonth(dateValue, referenceDate = new Date()) {
  if (!dateValue) return false

  const date = new Date(dateValue)
  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === referenceDate.getFullYear() &&
    date.getMonth() === referenceDate.getMonth()
  )
}

function calculateAccountBalances(accounts, transactions) {
  return accounts.map(account => {
    const openingBalance = Number(account.openingBalance) || 0

    const transactionBalance = transactions.reduce((balance, transaction) => {
      const amount = Number(transaction.amount) || 0

      if (transaction.type === 'Income' && transaction.accountId === account.id) {
        return balance + amount
      }

      if (transaction.type === 'Expense' && transaction.accountId === account.id) {
        return balance - amount
      }

      if (transaction.type === 'Transfer') {
        if (transaction.accountId === account.id) return balance - amount
        if (transaction.destinationAccountId === account.id) return balance + amount
      }

      return balance
    }, 0)

    return {
      ...account,
      currentBalance: openingBalance + transactionBalance,
    }
  })
}

function calculateFinanceSummary(accounts, transactions, budgets, referenceDate = new Date()) {
  const accountBalances = calculateAccountBalances(accounts, transactions)
  const monthlyTransactions = transactions.filter(transaction =>
    isInCurrentMonth(transaction.date, referenceDate)
  )

  const income = monthlyTransactions
    .filter(transaction => transaction.type === 'Income')
    .reduce((total, transaction) => total + (Number(transaction.amount) || 0), 0)

  const expenses = monthlyTransactions
    .filter(transaction => transaction.type === 'Expense')
    .reduce((total, transaction) => total + (Number(transaction.amount) || 0), 0)

  const budgetLimit = budgets
    .filter(budget => !budget.period || budget.period === 'monthly')
    .reduce((total, budget) => total + (Number(budget.limit) || 0), 0)

  return {
    accountBalances,
    totalBalance: accountBalances
      .filter(account => account.isActive !== false)
      .reduce((total, account) => total + account.currentBalance, 0),
    income,
    expenses,
    netCashFlow: income - expenses,
    transactionCount: monthlyTransactions.length,
    budgetLimit,
    budgetUsed: expenses,
    budgetRemaining: Math.max(budgetLimit - expenses, 0),
    budgetUsagePercent: budgetLimit > 0
      ? Math.min((expenses / budgetLimit) * 100, 100)
      : 0,
  }
}

const FinanceContext = createContext(null)

export function FinanceProvider({ children }) {
  const [financeData, setFinanceData] = useState(readStoredFinanceData)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(financeData))
  }, [financeData])

  const summary = useMemo(
    () => calculateFinanceSummary(
      financeData.accounts,
      financeData.transactions,
      financeData.budgets
    ),
    [financeData]
  )

  const value = useMemo(() => ({
    accounts: financeData.accounts,
    transactions: financeData.transactions,
    budgets: financeData.budgets,
    accountBalances: summary.accountBalances,
    summary,
    setAccounts: updater => setFinanceData(current => ({
      ...current,
      accounts: typeof updater === 'function' ? updater(current.accounts) : updater,
    })),
    setTransactions: updater => setFinanceData(current => ({
      ...current,
      transactions: typeof updater === 'function' ? updater(current.transactions) : updater,
    })),
    setBudgets: updater => setFinanceData(current => ({
      ...current,
      budgets: typeof updater === 'function' ? updater(current.budgets) : updater,
    })),
  }), [financeData, summary])

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)

  if (!context) {
    throw new Error('useFinance must be used inside a FinanceProvider')
  }

  return context
}
