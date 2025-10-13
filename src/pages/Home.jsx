import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { SheetsContext } from "../context/SheetsContext";

const makeId = () =>
  typeof crypto?.randomUUID === "function"
    ? crypto.randomUUID()
    : `sheet-${Date.now()}-${Math.random()}`;

console.log(`sheet-${Date.now()}-${Math.random()}`);

export const Home = () => {
  const { state, createSheet, updateSheet, deleteSheet } =
    useContext(SheetsContext);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length < 3) {
      return;
    }

    const timestamp = new Date().toISOString();
    createSheet({
      id: makeId(),
      name: trimmedName,
      notes: notes.trim(),
      theme: { mode: "light", color: "blue" },
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    setName("");
    setNotes("");
  };

  const handleRename = (sheet) => {
    const nextName = window.prompt("Nuovo nome scheda", sheet.name);
    if (!nextName) return;

    const trimmedName = nextName.trim();
    if (trimmedName.length < 3 || trimmedName.length > 40) {
      window.alert("Il nome deve avere tra 3 e 40 caratteri.");
      return;
    }

    const nextNotes = window.prompt("Note (facoltative)", sheet.notes ?? "");

    updateSheet(sheet.id, {
      name: trimmedName,
      notes: nextNotes?.trim() ?? "",
    });
  };

  const handleDelete = (sheet) => {
    const ok = window.confirm(
      `Sicuro di voler eliminare la scheda "${sheet.name}"?`
    );
    if (ok) {
      deleteSheet(sheet.id);
    }
  };

  return (
    <main className="home">
      <h1>Le tue schede</h1>

      <section>
        <h2>Crea scheda</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Nome scheda
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Es. Workout A"
                minLength={3}
                maxLength={40}
                required
              />
            </label>
          </div>

          <div>
            <label>
              Note
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Annotazioni facoltative"
                rows={3}
              />
            </label>
          </div>

          <button type="submit">Aggiungi</button>
        </form>
      </section>

      <section>
        <h2>Lista schede</h2>
        {state.sheets.length === 0 ? (
          <p>Nessuna scheda creata. Usa il form qui sopra.</p>
        ) : (
          <ul>
            {state.sheets.map((sheet) => (
              <li key={sheet.id}>
                <Link to={`/sheet/${sheet.id}`}>{sheet.name}</Link>
                {sheet.notes && <p>{sheet.notes}</p>}
                <small>
                  Ultimo aggiornamento:{" "}
                  {new Date(sheet.updatedAt).toLocaleDateString("it-IT")}
                </small>
                <div>
                  <button type="button" onClick={() => handleRename(sheet)}>
                    Rinomina
                  </button>
                  <button type="button" onClick={() => handleDelete(sheet)}>
                    Elimina
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};
