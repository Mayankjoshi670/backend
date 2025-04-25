# SmartRoute Backend API

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your environment variables.
3. Start MongoDB locally or provide a remote URI in `.env`.
4. Start the backend:
   ```sh
   node server.js
   # or
   npm start
   ```

## API Endpoints

### 1. Create Optimal Trip
**POST** `/api/optimal`

**Body:**
```
{
  "name": "Test User",
  "from": "haldwani",
  "to": "kainchi_dham",
  "date": "2025-04-25",
  "vehicleNo": "UP1234",
  "vehicleType": "4wheeler" // or "2wheeler", "heavy"
}
```

### 2. Assign Timeslot
**POST** `/api/timeslots`

**Body:**
```
{
  "vehicleType": "4wheeler",
  "vehicleId": "UP1234"
}
```

### 3. Get Optimal Path
**POST** `/api/optimalPath`

**Body:**
```
{
  "from": "haldwani",
  "to": "kainchi_dham"
}
```

### 4. Get Live Traffic Stats
**GET** `/api/traffic`

### 5. Get Map Embed
**GET** `/api/map?from=Haldwani`

---

## Notes
- Allowed values for `vehicleType`: `2wheeler`, `4wheeler`, `heavy`
- `vehicleId` should be the vehicle number (e.g. `UP1234`)
- All endpoints return JSON
- For errors, check the `message` or `details` field in the response

## Troubleshooting
- **400 Bad Request**: Check required fields and allowed values
- **500 Server Error**: See `details` in the response, and check server logs for more info

## Example cURL
```sh
curl -X POST http://localhost:5003/api/optimal \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","from":"haldwani","to":"kainchi_dham","date":"2025-04-25","vehicleNo":"UP1234","vehicleType":"4wheeler"}'
```
