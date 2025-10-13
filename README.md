# Scheda Palestra (frontend)

App React (Vite) per creare e gestire schede di allenamento senza backend. I dati restano nel browser tramite `localStorage`.

## Funzioni principali

- CRUD schede e CRUD esercizi con set base.
- Progressi rapidi: mostra l'ultimo peso/rep confrontato con il valore precedente.
- Layout semplice, mobile-first, con navigazione tramite React Router.
- Stato centralizzato in `SheetsContext`, sincronizzato sullo storage.

## Avvio veloce

```bash
npm install
npm run dev
```

Visita `http://localhost:5173/`.

Per la build di produzione:

```bash
npm run build
npm run preview
```

## Struttura rapida

- `src/pages/Home.jsx`: lista schede + form di creazione.
- `src/pages/SheetDetail.jsx`: dettaglio scheda, gestione esercizi e progressi.
- `src/context/SheetsContext.jsx`: stato globale e persistenza.
- `src/lib/storage.js`: helper `loadState`/`saveState` su `localStorage`.
- `src/style/globals.css`: stile base mobile-first.

## Idee future

- Validazione più ricca e messaggi inline.
- Miglior gestione errori e fallback storage.
- Timer recupero, temi e log avanzato dei workout.
