const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

app.set("trust proxy", 1);

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MongoDB URI is missing!");
  process.exit(1);
}

// CORS Configuration
const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/", apiLimiter);

// MongoDB connection
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => res.send("API is running..."));

// Routes
const vehicleRoutes = require("./routes/vehicleRoutes");
app.use("/api/vehicles", vehicleRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
