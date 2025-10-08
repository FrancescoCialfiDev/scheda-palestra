const index = (req, res) => {
  res.send("Sono Tutti Gli Esercizi");
};
const show = (req, res) => {
  res.send("Sono un singolo esercizio");
};
const store = (req, res) => {
  res.status(200).send("Esercizio inserito con successo");
};
const update = (req, res) => {
  res.status(200).send("Esercizio aggiornato con successo");
};
const patch = (req, res) => {
  res.status(200).send("Esercizio modificato con successo");
};
const destroy = (req, res) => {
  res.status(200).send("Esercizio eliminato con successo");
};

export { index, show, store, update, patch, destroy };
