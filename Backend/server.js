import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import tournamentRoutes from "./routes/tournamentRoutes.js";
import { validateRegistration, errorHandler, notFound } from "./middleware/validation.js";

dotenv.config();
const app = express();

// connect to db
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// routes
app.use("/api", registrationRoutes);
app.use("/api/tournaments", tournamentRoutes);

// health
app.get("/", (req, res) => res.send("Cricket Tournament API is running..."));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
