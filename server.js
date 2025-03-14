import express from "express";
import { readData, validateNewCar, validateUpdatedCar } from "./middleware.js";
import {
  addNewCar,
  deleteACarWithId,
  getAllOrFilteredCars,
  getCarsById,
  updateACarWithId,
} from "./controller.js";

const app = express();
const PORT = 3000;
app.use(express.json());
// Middleware för att läsa all data från json.
app.use(readData);

// Root API Information
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Car Management API",
  });
});
// endpoint för att hämta all eller en specifik bil, om inte bil märket man söker på finns, så skrivs message ut och alla bilar visas.
app.get("/cars", getAllOrFilteredCars);

// endpoint för att hämta en bil med specifikt id. om id:et inte finns skrivs det ut med status 400
app.get("/cars/:id", getCarsById);
// Lägga till ny bil
app.post("/cars", validateNewCar, addNewCar);
// Updatera en bil
app.put("/cars/:id", validateUpdatedCar, updateACarWithId);

// Ta bort en bil
app.delete("/cars/:id", deleteACarWithId);
// ogiltiga  URL:er
app.use((req, res) => {
  res.status(404).json({
    error: "Invalid URL",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
