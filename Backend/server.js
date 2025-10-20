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

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',  // default React port
      'http://localhost:3001',  // your frontend port
      process.env.FRONTEND_URL  // production frontend URL
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Apply CORS with options
app.use(cors(corsOptions));
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
