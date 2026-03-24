import { AuthRequest } from "../../middleware/auth.middleware";
import type { Response } from "express";
import { getDetailSignalement } from "../../models/signalement";
import { dechiffrement } from "../../lib/bib";


export default async function detailSignalement(req : AuthRequest, res : Response){
    try {
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

        return res.status(200).json(detailDechiffre)
    }
    catch (error) {
        return res.status(500).json({error : "Erreur serveur"})
    }
}