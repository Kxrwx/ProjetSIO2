import express from "express"
import cors from "cors";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import helmet from "helmet"
import rateLimit from "express-rate-limit";
import type { CorsOptions } from "cors";


//import fonction metier
import SignalementRouter from "./routes/signalement.route"
import AuthRouter from "./routes/auth.route"
import AdminRouter from "./routes/admin.route"
import {prisma} from './db/prisma'
import { initLogJobs } from "./routes/jobLogBatch";


//config index
dotenv.config();

const app = express();
app.use(morgan("dev"));
app.use(helmet());

const normalizeOrigin = (value: string) => value.trim().replace(/\/+$/, "");
const envOrigins = (process.env.FRONT_URLS || process.env.FRONT_URL || "http://localhost:5173")
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

console.log("Allowed CORS origins:", envOrigins);

const allowedOrigins = new Set<string>([
  ...envOrigins,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

const corsOptions: CorsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const cleanOrigin = normalizeOrigin(origin);
    if (allowedOrigins.has(cleanOrigin)) return callback(null, true);

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());

const PORT = process.env.PORT || 5000;

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 12225,
  message: { error: "Trop de tentatives, réessayez plus tard" },
  standardHeaders: true, 
  legacyHeaders: false,  
});



app.use("/api/signalements", SignalementRouter)
app.use("/api/auth", authLimiter);
app.use('/api/auth', AuthRouter)


app.use("/api/admin", AdminRouter)


app.get('/health', (req, res) => { 
  res.json({ status: 'healthy' });
});

app.get('/api/testdb', async (req, res) => {
  try {
    const [categories, priorites, statuts, signalements] = await Promise.all([
      prisma.categorie.findMany(),
      prisma.priorite.findMany(),
      prisma.statut.findMany(),
      prisma.signalement.count(),
    ]);

    res.json({
      status: 'Connecté à la base de données',
      counts: {
        signalements,
        categories: categories.length,
        priorites: priorites.length,
        statuts: statuts.length,
      },
      data: { categories, priorites, statuts },
    });
  } catch (error : any) {
    console.error('Erreur testdb:', error);
    res.status(500).json({ 
      status: 'Déconnecté',
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur Prêt sur http://localhost:${PORT}`);
  //initLogJobs()
});


