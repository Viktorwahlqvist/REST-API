import express from "express";
import {
  addNewCar,
  deleteACarWithId,
  getAllOrFilteredCars,
  getCarsById,
  replaceCarById,
  updateACarWithId,
} from "./controller.js";
import { readData, validateNewCar, validateUpdatedCar } from "./middleware.js";

export const carsRouter = express.Router();

// Middleware för att läsa all data från cars.json.
carsRouter.use(readData);

/* endpoint för att hämta all eller en specifik bil, om inte bil märket man söker på finns, 
så skrivs message ut och alla bilar visas. */
carsRouter.get("/", getAllOrFilteredCars);

// endpoint för att hämta en bil med specifikt id. om id:et inte finns skrivs det ut med status 400
carsRouter.get("/:id", getCarsById);

// Lägga till ny bil
carsRouter.post("/", validateNewCar, addNewCar);

// replace bil med id
carsRouter.put("/:id", validateNewCar, replaceCarById);

/* Updatera en bil med minst en av följande nycklar
make, model, year, color, price, available */
carsRouter.patch("/:id", validateUpdatedCar, updateACarWithId);

// Ta bort en bil
carsRouter.delete("/:id", deleteACarWithId);
