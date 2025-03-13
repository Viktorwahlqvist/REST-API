import express from "express";
import fs from "fs";

const app = express();
const PORT = 3000;
const carsDb = "./cars.json";
app.use(express.json());

// Root API Information
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Car Management API",
  });
});
// endpoint för att hämta all eller en specifik bil, om inte bil märket man söker på finns, så skrivs message ut och alla bilar visas.
app.get("/cars", (req, res) => {
  const { make } = req.query;
  fs.readFile(carsDb, "utf8", (error, data) => {
    if (error) {
      return res.status(500).json({
        error: "Failed to read database",
      });
    }
    // Konverterar data från json
    const cars = JSON.parse(data);
    // Kollar om det är ett specifikt märke i URI
    if (make) {
      const filteredmake = cars.filter(
        (car) => car.make.toLowerCase() === make.toLowerCase()
      );
      if (!filteredmake.length) {
        return res.status(404).json({
          message: "No available cars for that search term",
        });
      }
      return res.json(filteredmake);
    }
    res.json(cars);
  });
});

// endpoint för att hämta en bil med specifikt id. om id:et inte finns skrivs det ut med status 400
app.get("/cars/:id", (req, res) => {
  const carId = parseInt(req.params.id);

  // Hämtar cars.json
  fs.readFile(carsDb, "utf8", (error, data) => {
    if (error) {
      return res.status(500).json({
        error: "Failed to read databas",
      });
    }
    const cars = JSON.parse(data);
    const car = cars.find((car) => car.id === carId);

    if (!car) {
      return res.status(404).json({
        error: "No car with that ID",
      });
    }
    res.json(car);
  });
});
// Lägga till ny bil
app.post("/cars", (req, res) => {
  const { make, model, year, color, price, available } = req.body;
  console.log(
    typeof make,
    typeof model,
    typeof year,
    typeof color,
    typeof price,
    typeof available
  );
  // Validering
  if (
    !make ||
    typeof make !== "string" ||
    make.trim() === "" ||
    !model ||
    typeof model !== "string" ||
    model.trim() === "" ||
    !color ||
    typeof color !== "string" ||
    color.trim() === "" ||
    typeof available !== "boolean" ||
    typeof price !== "number" ||
    typeof year !== "number"
  ) {
    return res.status(400).json({
      error: "All fields must be filled in correctly",
    });
  }
  // läser bil carDb
  fs.readFile(carsDb, "utf8", (error, data) => {
    if (error) {
      return res.status(500).json({
        error: "Failed to read databas",
      });
    }
    const cars = JSON.parse(data);
    const newCar = {
      id: cars.length > 0 ? Math.max(...cars.map((cars) => cars.id)) + 1 : 1,
      make,
      model,
      year,
      color,
      price,
      available,
    };
    if (newCar) {
      cars.push(newCar);
      fs.writeFile(carsDb, JSON.stringify(cars, null, 2), "utf8", (error) => {
        if (error) {
          return res.status(500).json({
            error: "Couldn't update databas",
          });
        }
        res.status(201).json({
          message: `${make} was successfully added`,

          newCar,
        });
      });
    }
  });
});
// Updatera en bil
app.put("/cars/:id", (req, res) => {
  const carId = parseInt(req.params.id);
  const { make, model, year, color, price, available } = req.body;
  console.log("Car id:", carId);

  if (!make && !model && !year && !color && !price && !available) {
    return res.status(400).json({
      error:
        "At least one field (make, model, year, color, price, available) is required to update the car.",
    });
  }

  fs.readFile(carsDb, "utf8", (error, data) => {
    if (error) {
      return res.status(500).json({
        error: "Failed to read database",
      });
    }
    const cars = JSON.parse(data);
    const carIndex = cars.findIndex((car) => car.id === carId);
    console.log("Car index", cars[carIndex]);

    if (carIndex === -1) {
      return res.status(404).json({
        error: "Car not found",
      });
    }
    // Validering
    if (make && typeof make !== "string") {
      return res.status(400).json({
        error: "make must be a string.",
      });
    }
    if (model && typeof model !== "string") {
      return res.status(400).json({
        error: "model must be a string.",
      });
    }
    if (year && typeof year !== "number") {
      return res.status(400).json({
        error: "year must be a number.",
      });
    }
    if (color && typeof color !== "string") {
      return res.status(400).json({
        error: "color must be a string.",
      });
    }
    if (price && typeof price !== "number") {
      return res.status(400).json({
        error: "price must be a number.",
      });
    }
    if (available && typeof available !== "boolean") {
      return res.status(400).json({
        error: "available must be a boolean.",
      });
    }

    const updatedCar = {
      ...cars[carIndex],
      // behåller samma id
      id: cars[carIndex].id,
      // Vi kollar om bodyn innehåller ny t.ex make, annars är den gammla kvar.
      make: make || cars[carIndex].make,
      model: model || cars[carIndex].model,
      year: year || cars[carIndex].year,
      color: color || cars[carIndex].color,
      price: price || cars[carIndex].price,
      // Blir annorlunda med boolean,
      available: available ?? cars[carIndex].available,
    };
    // Updaterar den gammla med det nya
    cars[carIndex] = updatedCar;

    fs.writeFile(carsDb, JSON.stringify(cars, null, 2), (error) => {
      if (error) {
        return res.status(500).json({
          error: "Failed to update database",
        });
      }
      res.json({
        message: `Car with ID ${carId} updated successfully`,
        updatedCar: cars[carIndex],
      });
    });
  });
});

// Ta bort en bil
app.delete("/cars/:id", (req, res) => {
  const carId = parseInt(req.params.id);
  fs.readFile(carsDb, "utf8", (error, data) => {
    if (error) {
      return res.status(500).json({
        error: "Failed to read databas",
      });
    }
    const cars = JSON.parse(data);
    const carIndex = cars.findIndex((car) => car.id === carId);
    if (carIndex === -1) {
      return res.status(404).json({
        error: `Car with ID ${carId} Not found.`,
      });
    }
    const filteredCars = cars.filter((car) => car.id !== carId);

    fs.writeFile(carsDb, JSON.stringify(filteredCars, null, 2), (error) => {
      if (error) {
        return res.status(500).json({
          error: "Failed to update databas.",
        });
      }
      res.status(204).end();
    });
  });
});
// ogiltiga  URL:er
app.use((req, res) => {
  res.status(404).json({
    error: "Invalid URL",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
