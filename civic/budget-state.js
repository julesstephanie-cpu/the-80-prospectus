(() => {
  const memory = new Map();
  window.organizingBudgetStorage = {
    getItem(key) { try { return sessionStorage.getItem(key); } catch (_) { return memory.get(key) ?? null; } },
    setItem(key, value) { memory.set(key, String(value)); try { sessionStorage.setItem(key, String(value)); } catch (_) {} }
  };
})();
