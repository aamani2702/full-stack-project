import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((text, icon = '✓') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, icon }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast"><span>{t.icon}</span> {t.text}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
