"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectAccount = useCallback((account) => {
    setActiveAccount(account);
  }, []);

  const clearAccount = useCallback(() => {
    setActiveAccount(null);
  }, []);

  const refreshAccounts = useCallback(async () => {
    setLoading(true);
    try {
      // API integration in a later phase
      return accounts;
    } finally {
      setLoading(false);
    }
  }, [accounts]);

  const value = useMemo(
    () => ({
      accounts,
      activeAccount,
      loading,
      setAccounts,
      selectAccount,
      clearAccount,
      refreshAccounts,
    }),
    [
      accounts,
      activeAccount,
      loading,
      selectAccount,
      clearAccount,
      refreshAccounts,
    ]
  );

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}

export default AccountContext;
