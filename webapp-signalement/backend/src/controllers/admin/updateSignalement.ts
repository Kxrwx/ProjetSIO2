import { AuthRequest } from "../../middleware/auth.middleware";
import type { Response } from "express";
import { updateSignalementAdmin } from "../../models/signalement";


export default async function updateSignalement(req:AuthRequest, res: Response) {
    try {
        const perm = req.permissions?.map(p => p.nameRole)
        if(!perm) return res.status(401).json({error : "Non autorisé"})
        const hasWriteAccess = perm.includes("ecriture");
        if(!hasWriteAccess) return res.status(401).json({error : "Non autorisé"})
        const {signalementId, idStatut} = req.body
        const response = await updateSignalementAdmin(signalementId, idStatut)
        if(!response) return res.status(400).json({error : "Erreur lors de la modification"})
        return res.status(200).json({success : true})
    }
    catch (error) {
        return res.status(500).json({error : "Erreur serveur"})
    }
}