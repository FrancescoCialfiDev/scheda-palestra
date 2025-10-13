const STORAGE_KEY = "scheda-palestra:v1";
const EMPTY_STATE = { sheets: [], exercises: [] };

const loadState = () => {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return EMPTY_STATE;
    } else {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === null) {
        return EMPTY_STATE;
      } else {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          return parsed;
        } else {
          return EMPTY_STATE;
        }
      }
    }
  } catch (error) {
    console.warn("[storage] load failed", error);
    return EMPTY_STATE;
  }
};

const saveState = (state) => {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }

    const serialized = JSON.stringify(state);
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.warn("[storage] save failed", error);
  }
};

export { loadState, saveState };
