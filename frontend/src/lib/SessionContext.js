import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SessionContext = createContext(null);

const STORAGE_KEYS = {
  alias: 'po_alias',
  store: 'po_store',
  session: 'po_session',
  tasks: 'po_tasks',
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function SessionProvider({ children }) {
  const [alias, setAliasState] = useState(() => localStorage.getItem(STORAGE_KEYS.alias) || '');
  const [store, setStoreState] = useState(() => readJSON(STORAGE_KEYS.store, null));
  const [session, setSessionState] = useState(() => readJSON(STORAGE_KEYS.session, null));
  const [tasks, setTasksState] = useState(() => readJSON(STORAGE_KEYS.tasks, []));

  useEffect(() => {
    if (alias) localStorage.setItem(STORAGE_KEYS.alias, alias);
  }, [alias]);
  useEffect(() => {
    if (store) localStorage.setItem(STORAGE_KEYS.store, JSON.stringify(store));
    else localStorage.removeItem(STORAGE_KEYS.store);
  }, [store]);
  useEffect(() => {
    if (session) localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEYS.session);
  }, [session]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
  }, [tasks]);

  const value = useMemo(
    () => ({
      alias,
      setAlias: setAliasState,
      store,
      setStore: setStoreState,
      session,
      setSession: setSessionState,
      tasks,
      setTasks: setTasksState,
      addTask: (task) => setTasksState((prev) => [task, ...prev]),
      endSession: () => {
        setSessionState(null);
        setStoreState(null);
        setTasksState([]);
      },
    }),
    [alias, store, session, tasks]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside SessionProvider');
  return ctx;
}
