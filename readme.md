# API Dokumentation - Användarhantering

## Installation

För att installera projektets beroenden, kör följande kommando:

```bash
npm install
```

För att starta

```bash
npm start
```

## BASE URL

```
http://localhost:3000
```

## BESKRIVNING

Detta REST API tillhandahåller CRUD-funktionalitet för att hantera bilar.
API:t använder **Express**, **Node.js** och **JSON-baserad lagring**.

---

## ENDPOINTS

### 1. Root - API information

**GET /**

Returnerar grundläggande information om API:t.

**Exempel:**

```
GET http://localhost:3000/
```

---

### 2. Hämta alla bilar

**GET /cars**

Denna endpoint hämtar alla bilar eller filtrerar efter märke.

**Query parameter:**

- `make` _(valfri)_ - Filtrerar bilar baserat på märket (case-insensitive).

**Svar:**

- `200 OK` - Returnerar en lista med bilar.
- `404 Not Found` - Om ingen bil matchar filtreringen.

**Exempel på filtrering:**

```
GET http://localhost:3000/cars?make=Volvo
```

---

### 3. Hämta en specifik bil

**GET /cars/:id**

Denna endpoint hämtar en specifik bil baserat på id.

**Parameter:**

- `id` _(obligatorisk)_ - ID för bilen som du vill hämta.

**Svar:**

- `200 OK` - Returnerar bilen som matchar id.
- `404 Not Found` - Om bilen inte hittas.

**Exempel:**

```
GET http://localhost:3000/cars/1
```

---

### 4. Lägg till en ny bil

**POST /cars**

Denna endpoint skapar en ny bil med följande egenskaper:

**Request body (JSON, obligatoriska fält):**

- `make` _(sträng)_ -
- `model` _(sträng)_ -
- `year` _(nummer)_ -
- `color` _(sträng)_ -
- `price` _(nummer)_ -
- `available` _(boolean)_ -

```json
{
  "make": "Volvo",
  "model": "XC60",
  "year": 2022,
  "color": "Blå",
  "price": 450000,
  "available": true
}
```

**Svar:**

- `201 Created` - Bilen har lagts till.
- `400 Bad Request` - Om obligatoriska fält saknas eller är felaktigt ifyllda.

**Exempel:**

```
POST http://localhost:3000/cars
```

---

### 5. Uppdatera en specifik bil

**PUT /cars/:id**

Denna endpoint uppdaterar en bil baserat på dess id.

**Parameter:**

- `id` _(obligatorisk)_ - ID för bilen som ska uppdateras.

**Request body (minst ett av dessa fält är obligatoriska):**

```json
{
  "make": "Tesla",
  "model": "Model 3",
  "year": 2023,
  "color": "Röd",
  "price": 500000,
  "available": false
}
```

**Svar:**

- `200 OK` - Bilen har uppdaterats.
- `400 Bad Request` - Om inga uppgifter anges.
- `404 Not Found` - Om bilen med angivet id inte finns.

**Exempel:**

```
PUT http://localhost:3000/cars/1
```

---

### 6. Ta bort en bil

**DELETE /cars/:id**

Denna endpoint tar bort en bil baserat på dess id.

**Parameter:**

- `id` _(obligatorisk)_ - ID för bilen som ska tas bort.

**Svar:**

- `204 No Content` - Bilen har tagits bort.
- `404 Not Found` - Om ingen bil matchar id.

**Exempel:**

```
DELETE http://localhost:3000/cars/1
```

---
