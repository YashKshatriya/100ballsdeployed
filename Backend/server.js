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
    // For development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      console.log('Allowing all origins in development');
      return callback(null, true);
    }
    
    // In production, allow specific origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://cricket-tournament-6w9k.onrender.com',
      'https://cricket-tournament-frontend.onrender.com',
      process.env.FRONTEND_URL
    ].filter(Boolean); // Remove any undefined values
    
    // Log the origin for debugging
    console.log('Request origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      console.log('Origin allowed:', origin);
      return callback(null, true);
    }
    
    const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
    console.log('Origin not allowed:', msg);
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200
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
