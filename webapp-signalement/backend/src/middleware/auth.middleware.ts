import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { prisma } from "../db/prisma";
import { User, Session } from "@prisma/client";
import {getSession} from "../models/session"

declare global {
  namespace Express {
    interface Request {
      user?: User; 
      session?: Session
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.session_token;

    if (!token) {
        return res.status(401).json({ error: "Non autorisé : session manquante" });
    }

    try {
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const session = await getSession(tokenHash)

        if (!session || !session.expiresAt || session.expiresAt < new Date()) {
            return res.status(401).json({ error: "Session invalide ou expirée" });
        }

        (req as any).user = session.user;
        

        if (session.user) {
        req.user = session.user; 
        }
        if (session) {
            req.session = session
        }

        next(); 
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'authentification" });
    }
}