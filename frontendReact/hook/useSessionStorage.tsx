import { useState } from "react";

function useSessionStorage(key: string, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Erro ao ler o sessionStorage:", error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Erro ao salvar no sessionStorage:", error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useSessionStorage;
