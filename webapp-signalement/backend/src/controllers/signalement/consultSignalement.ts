import type { Request, Response } from "express";
import { hashPassword, dechiffrement } from "../../lib/bib";
import {selectSignalementDB} from "../../models/signalement"


export default async function getSignalement(req:Request, res: Response) {
    try {
    const { trackingCode, password } = req.body;
    if (!trackingCode || !password) {
      return res.status(400).json({ error: 'Numéro de suivi et mot de passe requis' });
    }

    const passwordHash = hashPassword(password); 

    const signalement = await selectSignalementDB(trackingCode.trim(), passwordHash)
    if (!signalement) return res.status(404).json({ error: 'Aucun signalement trouvé pour ce numéro et ce mot de passe' });

        const { 
        victimContactEncrypted, 
        victimNameEncrypted, 
        descriptionEncrypted, 
        lieuEncrypted,
        trackingPasswordHash, 
        ...rest               
    } = signalement;
    
    const detailDechiffre = {
        ...rest, 
        victimContact: victimContactEncrypted ? dechiffrement(victimContactEncrypted) : null,
        victimName: victimNameEncrypted ? dechiffrement(victimNameEncrypted) : null,
        description: descriptionEncrypted ? dechiffrement(descriptionEncrypted) : null,
        lieu: lieuEncrypted ? dechiffrement(lieuEncrypted) : null
    };

    return res.status(200).json(detailDechiffre);
  } catch (error : any) {
    res.status(500).json({ error: error.message });
  }
}