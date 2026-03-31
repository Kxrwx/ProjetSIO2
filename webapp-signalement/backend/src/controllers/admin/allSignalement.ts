import { AuthRequest } from "../../middleware/auth.middleware";
import type { Response } from "express";
import { getAllSignalement } from "../../models/signalement";
import { createLog } from "../../models/autid";
import { chiffrement } from "../../lib/bib";

export default async function allSignalement(req : AuthRequest, res : Response) {
    try {
        const forwarded = req.headers['x-forwarded-for'];
        const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress || null;
        const userId = req.user?.id
        if(!userId) return res.status(401).json({error : "Unauthorize"})
        const signalement = await getAllSignalement()
        await createLog(userId, null , "get all signalement", chiffrement(`get all signlement par ${userId}`), ip)
        return res.status(200).json(signalement)
    }
    catch(error) {
        return res.status(500).json({error : "Erreur serveur"})
    }
}