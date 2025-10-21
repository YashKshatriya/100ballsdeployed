import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import tournamentRoutes from "./routes/tournamentRoutes.js";
import { errorHandler, notFound } from "./middleware/validation.js";

dotenv.config();
const app = express();

// Connect to database
connectDB();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // For development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, allow specific origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://one00ballsdeployed-11.onrender.com',
      'https://cricket-tournament-frontend.vercel.app',
      'https://cricket-tournament-frontend.vercel.app',
      'https://cricket-tournament-frontend.vercel.app/*',
      'https://cricket-tournament-frontend-*.vercel.app',
      process.env.FRONTEND_URL,
      'https://cricket-tournament-frontend-*.vercel.app/*'
    ].filter(Boolean);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'x-auth-token'],
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
