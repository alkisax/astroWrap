import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import path from "path";
import astroRoutes from "./astro/astro.routes";
import astroInterpretationRoutes from "./openAI/astroInterpretation.routes"
import authSqliteRoutes from './login/routes/auth.routes.sql'
import userSqliteRoutes from './login/routes/user.routes.sql'


export const app = express();

console.log("=== APP START ===");

app.use(express.json({ limit: '100kb' }));

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT"],
}));

app.get("/api/ping", (_req: Request, res: Response) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.get("/health", (_req, res) => {
  res.send("ok");
});

app.use('/api/sqlite/auth', authSqliteRoutes)
app.use('/api/sqlite/users', userSqliteRoutes)
app.use("/api/astro", astroRoutes);
app.use('/api/astro-interpretation', astroInterpretationRoutes);
console.log("Registered /api/astro routes");

const publicPath = path.join(__dirname, '../dist');
app.use(express.static(publicPath));

app.get('/privacy', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/privacy.html'));
});

//αυτο είναι για να σερβίρει το index.html του front όταν ο χρήστης επισκέπτεται το root path ή οποιοδήποτε άλλο path που δεν είναι api ή api-docs
app.get(/^\/(?!api|api-docs).*/, (_req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

export default app;
