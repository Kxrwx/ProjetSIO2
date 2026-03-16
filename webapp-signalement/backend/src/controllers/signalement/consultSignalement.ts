import type { Request, Response } from "express";
import { hashPassword } from "../../lib/bib";
import {selectSignalementDB} from "../../models/signalement"

export default async function getSignalement(req:Request, res: Response) {
    try {
    const { trackingCode, password } = req.body;
    if (!trackingCode || !password) {
      return res.status(400).json({ error: 'Numéro de suivi et mot de passe requis' });
    }

    const passwordHash = hashPassword(password); 

    const signalement = await selectSignalementDB(trackingCode.trim(), passwordHash)
    if (!signalement) {
      return res.status(404).json({ error: 'Aucun signalement trouvé pour ce numéro et ce mot de passe' });
    }

    const { trackingPasswordHash, ...safe } = signalement;
    res.json(safe);
  } catch (error : any) {
    res.status(500).json({ error: error.message });
  }
}