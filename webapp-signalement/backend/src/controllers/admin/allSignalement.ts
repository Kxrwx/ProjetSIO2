import { AuthRequest } from "../../middleware/auth.middleware";
import type { Response } from "express";
import { getAllSignalement } from "../../models/signalement";

export default async function allSignalement(req : AuthRequest, res : Response) {
    try {
        const userId = req
        const signalement = await getAllSignalement()
        return res.status(200).json(signalement)
    }
    catch(error) {
        return res.status(500).json({error : "Erreur serveur"})
    }
}