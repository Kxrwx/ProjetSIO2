import type { Request, Response } from "express";
import { getMessage } from "../../models/message";
import { hashPassword } from "../../lib/bib";
import { signalementExist } from "../../models/signalement";

export default async function getMessageNoAdmin(req:Request, res: Response) {
    try {
        const {idSignalement, trackingCode, password} = req.body
        if (!trackingCode || !password) return res.status(400).json({ error: 'Numéro de suivi et mot de passe requis' });
        const passwordHash = hashPassword(password)
        if(!idSignalement)return res.status(400).json({error : "Donnée manquant"})
        const signlamentExist = await signalementExist(idSignalement, trackingCode,passwordHash)
        if(!signlamentExist) return res.status(401).json({error : "Non autorisée Aucun signalement trouvé"})
        const response = await getMessage(idSignalement)
        if(!response) return res.status(400).json({error : "Aucun message récupéré"})
        return res.status(200).json(response)
    }
    catch (error : any) {
    res.status(500).json({ error: error.message || "Erreur"});
  }
}