import fs from "fs";
const carsDb = "./cars.json";
// Get cars handler
export const getAllOrFilteredCars = (req, res) => {
  const { make } = req.query;
  // Konverterar data från json
  const cars = JSON.parse(req.data);
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
};
// Get cars by id handler
export const getCarsById = (req, res) => {
  const carId = parseInt(req.params.id);
  const cars = JSON.parse(req.data);
  const car = cars.find((car) => car.id === carId);
  if (!car) {
    return res.status(404).json({
      error: "No car with that ID",
    });
  }
  res.json(car);
};
// POST add new car
export const addNewCar = (req, res) => {
  const { make, model, year, color, price, available } = req.body;
  const cars = JSON.parse(req.data);
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
};

// PUT update a car
export const updateACarWithId = (req, res) => {
  const carId = parseInt(req.params.id);
  const { make, model, year, color, price, available } = req.body;

  const cars = JSON.parse(req.data);
  const carIndex = cars.findIndex((car) => car.id === carId);

  if (carIndex === -1) {
    return res.status(404).json({
      error: "Car not found",
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
};

// Deleta a car
export const deleteACarWithId = (req, res) => {
  const carId = parseInt(req.params.id);

  const cars = JSON.parse(req.data);
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
};
