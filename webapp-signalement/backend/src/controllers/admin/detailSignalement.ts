import { AuthRequest } from "../../middleware/auth.middleware";
import type { Response } from "express";
import { getDetailSignalement } from "../../models/signalement";
import { dechiffrement, chiffrement } from "../../lib/bib";
import { createLog } from "../../models/autid";

export default async function detailSignalement(req : AuthRequest, res : Response){
    try {
        const forwarded = req.headers['x-forwarded-for'];
        const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress || null;
        const userId = req.user?.id
        if(!userId) return res.status(401).json({error : "Unauthorize"})
        const {idSignalement} = req.body
        if(!idSignalement) return res.status(400).json({error : "Aucun signalement trouvé pour cette id"})
        const detailSignalement = await getDetailSignalement(idSignalement)
        if(!detailSignalement) return res.status(400).json(`Aucun signalement trouvé pour l'id ${idSignalement}`) 
    const { 
    victimContactEncrypted, 
    victimNameEncrypted, 
    descriptionEncrypted, 
    lieuEncrypted,
    trackingPasswordHash, 
    ...rest               
} = detailSignalement;

const detailDechiffre = {
    ...rest, 
    victimContact: victimContactEncrypted ? dechiffrement(victimContactEncrypted) : null,
    victimName: victimNameEncrypted ? dechiffrement(victimNameEncrypted) : null,
    description: descriptionEncrypted ? dechiffrement(descriptionEncrypted) : null,
    lieu: lieuEncrypted ? dechiffrement(lieuEncrypted) : null
};
        await createLog(userId, idSignalement , "detail signalement", chiffrement(`getDetail signalement par ${userId} sur signalement ${idSignalement}`), ip)

        return res.status(200).json(detailDechiffre)
    }
    catch (error) {
        return res.status(500).json({error : "Erreur serveur"})
    }
}