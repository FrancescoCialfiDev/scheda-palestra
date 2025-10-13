import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SheetsContext } from "../context/SheetsContext";

const makeExerciseId = () =>
  typeof crypto?.randomUUID === "function"
    ? crypto.randomUUID()
    : `exercise-${Date.now()}-${Math.random()}`;

const getNumberOrUndefined = (value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const parseFormValues = ({ reps, weightKg, restSec }) => {
  const repsValue = parseInt(reps, 10);
  if (Number.isNaN(repsValue) || repsValue <= 0) {
    return { error: "Le ripetizioni devono essere maggiori di zero." };
  }

  const weightValue = getNumberOrUndefined(weightKg);
  if (weightValue !== undefined && weightValue < 0) {
    return { error: "Il peso non puo' essere negativo." };
  }

  const restValue = getNumberOrUndefined(restSec);
  if (restValue !== undefined && restValue < 0) {
    return { error: "Il recupero non puo' essere negativo." };
  }

  return {
    reps: repsValue,
    weightKg: weightValue,
    restSec: restValue,
  };
};

const buildProgress = (current, previous = null) => ({
  last: {
    reps: current.reps,
    weightKg: current.weightKg,
  },
  previous,
});

export const SheetDetail = () => {
  const { id } = useParams();
  const { state, createExercise, updateExercise, deleteExercise, updateSheet } =
    useContext(SheetsContext);

  const sheet = state.sheets.find((item) => item.id === id);
  const exercises = state.exercises.filter((item) => item.sheetId === id);

  const [form, setForm] = useState({
    name: "",
    targetMuscle: "",
    reps: "",
    weightKg: "",
    restSec: "",
  });

  if (!sheet) {
    return (
      <main className="sheet-detail">
        <p>Questa scheda non esiste.</p>
        <Link to="/">Torna alla Home</Link>
      </main>
    );
  }

  const refreshSheetTime = () => {
    updateSheet(sheet.id, { updatedAt: new Date().toISOString() });
  };

  const resetForm = () => {
    setForm({
      name: "",
      targetMuscle: "",
      reps: "",
      weightKg: "",
      restSec: "",
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddExercise = (event) => {
    event.preventDefault();

    const trimmedName = form.name.trim();
    if (!trimmedName) {
      window.alert("Il nome dell'esercizio e' obbligatorio.");
      return;
    }

    const parsed = parseFormValues(form);
    if ("error" in parsed) {
      window.alert(parsed.error);
      return;
    }

    const newExercise = {
      id: makeExerciseId(),
      sheetId: sheet.id,
      name: trimmedName,
      targetMuscle: form.targetMuscle.trim(),
      sets: [parsed],
      order: exercises.length,
      progress: buildProgress(parsed),
    };

    createExercise(newExercise);
    refreshSheetTime();
    resetForm();
  };

  const handleEditExercise = (exercise) => {
    const nextName = window.prompt("Nome esercizio", exercise.name);
    if (!nextName) {
      return;
    }

    const trimmedName = nextName.trim();
    if (!trimmedName) {
      window.alert("Il nome non puo' essere vuoto.");
      return;
    }

    const nextTarget = window.prompt(
      "Muscolo target (facoltativo)",
      exercise.targetMuscle ?? ""
    );

    updateExercise(exercise.id, {
      name: trimmedName,
      targetMuscle: nextTarget?.trim() ?? "",
    });
    refreshSheetTime();
  };

  const handleEditSet = (exercise) => {
    const currentSet = exercise.sets[0] ?? { reps: 0, weightKg: 0, restSec: 0 };

    const repsPrompt = window.prompt(
      "Ripetizioni",
      currentSet.reps ? String(currentSet.reps) : ""
    );
    if (!repsPrompt) {
      return;
    }

    const weightPrompt = window.prompt(
      "Peso (kg, facoltativo)",
      currentSet.weightKg !== undefined ? String(currentSet.weightKg) : ""
    );
    const restPrompt = window.prompt(
      "Recupero (sec, facoltativo)",
      currentSet.restSec !== undefined ? String(currentSet.restSec) : ""
    );

    const parsed = parseFormValues({
      reps: repsPrompt,
      weightKg: weightPrompt,
      restSec: restPrompt,
    });

    if ("error" in parsed) {
      window.alert(parsed.error);
      return;
    }

    const previousLast = exercise.progress?.last ?? null;

    updateExercise(exercise.id, {
      sets: [parsed],
      progress: buildProgress(parsed, previousLast),
    });
    refreshSheetTime();
  };

  const handleDeleteExercise = (exercise) => {
    const ok = window.confirm(
      `Vuoi eliminare l'esercizio "${exercise.name}"?`
    );
    if (!ok) {
      return;
    }

    deleteExercise(exercise.id);
    refreshSheetTime();
  };

  return (
    <main className="sheet-detail">
      <header>
        <Link to="/">&lt;- Indietro</Link>
        <h1>{sheet.name}</h1>
        {sheet.notes && <p>{sheet.notes}</p>}
      </header>

      <section>
        <h2>Aggiungi esercizio</h2>
        <form className="exercise-form" onSubmit={handleAddExercise}>
          <label>
            Nome*
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              required
            />
          </label>

          <label>
            Muscolo target
            <input
              type="text"
              name="targetMuscle"
              value={form.targetMuscle}
              onChange={handleFormChange}
            />
          </label>

          <label>
            Ripetizioni*
            <input
              type="number"
              name="reps"
              value={form.reps}
              onChange={handleFormChange}
              min={1}
              required
            />
          </label>

          <label>
            Peso (kg)
            <input
              type="number"
              name="weightKg"
              value={form.weightKg}
              onChange={handleFormChange}
              min={0}
              step="0.5"
            />
          </label>

          <label>
            Recupero (secondi)
            <input
              type="number"
              name="restSec"
              value={form.restSec}
              onChange={handleFormChange}
              min={0}
            />
          </label>

          <button type="submit">Salva esercizio</button>
        </form>
      </section>

      <section>
        <h2>Esercizi</h2>
        {exercises.length === 0 ? (
          <p>Nessun esercizio inserito.</p>
        ) : (
          <ul className="exercise-list">
            {exercises.map((exercise) => {
              const firstSet = exercise.sets[0];
              return (
                <li key={exercise.id} className="exercise-card">
                  <h3>{exercise.name}</h3>
                  {exercise.targetMuscle && (
                    <p>Muscolo: {exercise.targetMuscle}</p>
                  )}

                  {firstSet ? (
                    <div className="exercise-set">
                      <p>Ripetizioni: {firstSet.reps}</p>
                      <p>
                        Peso:{" "}
                        {firstSet.weightKg !== undefined
                          ? `${firstSet.weightKg} kg`
                          : "libero"}
                      </p>
                      <p>
                        Recupero:{" "}
                        {firstSet.restSec !== undefined
                          ? `${firstSet.restSec} sec`
                          : "n.d."}
                      </p>
                    </div>
                  ) : (
                    <p>Nessun set salvato.</p>
                  )}

                  <ProgressInfo progress={exercise.progress} />

                  <div className="exercise-actions">
                    <button type="button" onClick={() => handleEditExercise(exercise)}>
                      Modifica esercizio
                    </button>
                    <button type="button" onClick={() => handleEditSet(exercise)}>
                      Modifica set
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteExercise(exercise)}
                    >
                      Elimina
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
};

const ProgressInfo = ({ progress }) => {
  if (!progress?.last) {
    return null;
  }

  const { last, previous } = progress;

  let weightTrend = "Peso: nessun dato precedente.";
  if (last.weightKg !== undefined && previous?.weightKg !== undefined) {
    const diff = last.weightKg - previous.weightKg;
    if (diff > 0) {
      weightTrend = `Peso: ▲ +${diff} kg rispetto all'ultima volta.`;
    } else if (diff < 0) {
      weightTrend = `Peso: ▼ ${diff} kg rispetto all'ultima volta.`;
    } else {
      weightTrend = "Peso: invariato.";
    }
  } else if (last.weightKg !== undefined) {
    weightTrend = "Peso: primo valore registrato.";
  }

  let repsTrend = "Ripetizioni: nessun dato precedente.";
  if (previous?.reps !== undefined) {
    const diff = last.reps - previous.reps;
    if (diff > 0) {
      repsTrend = `Ripetizioni: ▲ +${diff} rispetto all'ultima volta.`;
    } else if (diff < 0) {
      repsTrend = `Ripetizioni: ▼ ${diff} rispetto all'ultima volta.`;
    } else {
      repsTrend = "Ripetizioni: invariate.";
    }
  } else {
    repsTrend = "Ripetizioni: primo valore registrato.";
  }

  return (
    <div className="exercise-progress">
      <p>{weightTrend}</p>
      <p>{repsTrend}</p>
    </div>
  );
};
