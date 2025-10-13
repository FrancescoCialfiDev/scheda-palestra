import { createContext, useState, useEffect, useCallback } from "react";
import { loadState, saveState } from "../lib/storage";

const SheetsContext = createContext();

const SheetsProvider = ({ children }) => {
  const [state, setState] = useState(() => loadState());

  useEffect(() => {
    const timer = setTimeout(() => {
      saveState(state);
    }, 200);

    return () => clearTimeout(timer);
  }, [state]);

  // CREATE - UPDATE - DELETE FUNCTION FOR SHEETS
  const createSheet = useCallback((sheet) => {
    setState((prev) => ({
      ...prev,
      sheets: [...prev.sheets, sheet],
    }));
  }, []);

  const updateSheet = useCallback((id, updates) => {
    setState((prev) => ({
      ...prev,
      sheets: prev.sheets.map((sheet) =>
        sheet.id === id
          ? { ...sheet, ...updates, updatedAt: new Date().toISOString() }
          : sheet
      ),
    }));
  }, []);

  const deleteSheet = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      sheets: prev.sheets.filter((sheet) => sheet.id !== id),
      exercises: prev.exercises.filter((exercise) => exercise.sheetId !== id),
    }));
  }, []);

  // CREATE - UPDATE - DELETE FUNCTION FOR EXERCISES
  const createExercise = useCallback((exercise) => {
    setState((prev) => ({
      ...prev,
      exercises: [...prev.exercises, exercise],
    }));
  }, []);

  const updateExercise = useCallback((id, updates) => {
    setState((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) =>
        exercise.id === id ? { ...exercise, ...updates } : exercise
      ),
    }));
  }, []);

  const deleteExercise = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((exercise) => exercise.id !== id),
    }));
  }, []);

  return (
    <SheetsContext.Provider
      value={{
        createSheet,
        updateSheet,
        deleteSheet,
        createExercise,
        updateExercise,
        deleteExercise,
        state,
      }}
    >
      {children}
    </SheetsContext.Provider>
  );
};

export { SheetsProvider, SheetsContext };
