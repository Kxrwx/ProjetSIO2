import { AuthRequest } from "../../middleware/auth.middleware";
import type { Response } from "express";
import { getDetailSignalement } from "../../models/signalement";


export default async function detailSignalement(req : AuthRequest, res : Response){
    try {
        const {idSignalement} = req.body
        if(!idSignalement) return res.status(404).json({error : "Aucun signalement trouvé pour cette id"})
        const detailSignalement = await getDetailSignalement(idSignalement)
        if(!detailSignalement) return res.status(404).json(`Aucun signalement trouvé pour l'id ${idSignalement}`) 
        return res.status(200).json(detailSignalement)
    }
    catch (error) {
        return res.status(500).json({error : "Erreur serveur"})
    }
}