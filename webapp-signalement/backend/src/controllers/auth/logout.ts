import type { Response } from "express";
import { deleteSession } from "../../models/session"
import { AuthRequest } from "../../middleware/auth.middleware";
import { createLog } from "../../models/autid";
import { chiffrement } from "../../lib/bib";


export default async function logout(req : AuthRequest, res : Response) {
    try {
        const forwarded = req.headers['x-forwarded-for'];
        const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress || null;
        const userId = req.user?.id
        if(!userId) return res.status(401).json({error : "Unauthentified"})
        const reponse = await deleteSession(userId)
        if(!reponse) return res.status(404).json({error : "Aucune session"})
        res.clearCookie("session_token", {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            domain : process.env.NODE_ENV === "production" ? process.env.FRONT : undefined
        })
        await createLog(userId, null , "logout user", chiffrement(`logout de ${userId}`), ip)
        return res.status(200).json({message : "Deconnexion reussi"})
    }
    catch(error) {
        return res.status(500).json({error : "Erreur serveur"})
    }
}