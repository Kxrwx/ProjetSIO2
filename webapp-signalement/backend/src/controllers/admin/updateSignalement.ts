import { AuthRequest } from "../../middleware/auth.middleware";
import type { Response } from "express";
import { updateSignalementAdmin } from "../../models/signalement";
import { createLog } from "../../models/autid";
import { chiffrement } from "../../lib/bib";

export default async function updateSignalement(req:AuthRequest, res: Response) {
    try {
        const forwarded = req.headers['x-forwarded-for'];
        const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress || null;
        const userId = req.user?.id
        const perm = req.permissions?.map(p => p.nameRole)
        if(!perm || !userId) return res.status(401).json({error : "Non autorisé"})
        const hasWriteAccess = perm.includes("ecriture");
        if(!hasWriteAccess) return res.status(401).json({error : "Non autorisé"})
        const {signalementId, idStatut} = req.body
        const response = await updateSignalementAdmin(signalementId, idStatut)
        if(!response) return res.status(400).json({error : "Erreur lors de la modification"})
        await createLog(userId, signalementId , "update signalement", chiffrement(`update signalement par ${userId}, changement effectue => ${idStatut} sur signalement ${signalementId}`), ip)
        return res.status(200).json({success : true})
    }
    catch (error) {
        return res.status(500).json({error : "Erreur serveur"})
    }
}