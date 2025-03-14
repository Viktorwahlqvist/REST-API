import fs from "fs";
const carsDb = "./cars.json";

// Middleware för att hämta data från cars.json
export const readData = (req, res, next) => {
  // Hämtar cars.json
  fs.readFile(carsDb, "utf8", (error, data) => {
    if (error) {
      return res.status(500).json({
        error: "Failed to read databas",
      });
    }
    req.data = data;
    next();
  });
};

// Validate ny bil
export const validateNewCar = (req, res, next) => {
  const { make, model, year, color, price, available } = req.body;

  /* Validerar alla strängar, om make, model, color är en sträng och inte är en tom sträng 
så blir isStringValid true, annars blir den false.*/
  const stringFields = [make, model, color];
  const isStringValid = stringFields.every(
    (every) => typeof every === "string" && every.trim() !== ""
  );

  if (
    !isStringValid ||
    typeof year !== "number" ||
    typeof price !== "number" ||
    typeof available !== "boolean"
  ) {
    return res.status(400).json({
      error: "All fields must be filled in correctly",
    });
  }

  next();
};

// Validate updated car
export const validateUpdatedCar = (req, res, next) => {
  const { make, model, year, color, price, available } = req.body;

  if (!make && !model && !year && !color && !price && !available) {
    return res.status(400).json({
      error:
        "At least one field (make, model, year, color, price, available) is required to update the car.",
    });
  }
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
  next();
};
