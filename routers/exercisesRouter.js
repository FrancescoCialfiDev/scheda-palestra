import express from "express";
const exercisesRouter = express.Router();
import {
  index,
  show,
  store,
  update,
  patch,
  destroy,
} from "../controllers/exercisesController.js";

// READ - INDEX: Show all the exercises available
exercisesRouter.get("/", index);

// READ - (SHOW): Show specific exercise with an ID
exercisesRouter.get("/:id", show);
// CREATE - (STORE): It allows you to add a new exercise in the DB Data
exercisesRouter.post("/", store);
// UPDATE - (UPDATE): It allows you to replace
exercisesRouter.put("/:id", update);
// PATCH - (MODIFY): it It allows you to update a specific exercise but not to replace it
exercisesRouter.patch("/:id", patch);
// DELETE - (DESTROY): It allows you to delete an exercise with specific ID
exercisesRouter.delete("/:id", destroy);

export default exercisesRouter;
