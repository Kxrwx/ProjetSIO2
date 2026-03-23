import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { User, Session, Role, Permission } from "@prisma/client";
import {getSession} from "../models/session"
import { getPermissionByRole, getUserAll } from "../models/user";
export interface AuthRequest extends Request
{
    user?: User,
    session? : Session
    role?: Role,
    permissions?: Permission[];
  }

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.cookies?.session_token;
    
    if (!token) {
        return res.status(401).json({ error: "Non autorisé : session manquante" });
    }

    try {
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const session = await getSession(tokenHash)

        if (!session || !session.expiresAt || session.expiresAt < new Date()) {
            return res.status(401).json({ error: "Session invalide ou expirée" });
        }
        if(!session.userId) return res.status(401).json({error : "Unauthorize"})
        
        const user = await getUserAll(session.userId)

        if(!user) return res.status(401).json({error : "Aucune permission"})
        if(!user.role) return res.status(401).json({error : "Aucun role"})
        const permission = await getPermissionByRole(user.roleId)
        if(!permission) return res.status(401).json({error : "Aucune permission"})
        req.session = session;
        req.user = user;
        req.role = user.role
        req.permissions = permission
        next(); 
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'authentification" });
    }
}