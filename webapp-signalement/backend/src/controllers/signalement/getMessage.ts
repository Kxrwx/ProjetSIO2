import type { Request, Response } from "express";
import { getMessage } from "../../models/message";
import { hashPassword, chiffrement } from "../../lib/bib";
import { signalementExist } from "../../models/signalement";
import { createLog } from "../../models/autid";


export default async function getMessageNoAdmin(req:Request, res: Response) {
    try {
        const forwarded = req.headers['x-forwarded-for'];
        const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress || null;
        const {idSignalement, trackingCode, password} = req.body
        if (!trackingCode || !password) return res.status(400).json({ error: 'Numéro de suivi et mot de passe requis' });
        const passwordHash = hashPassword(password)
        if(!idSignalement)return res.status(400).json({error : "Donnée manquant"})
        const signlamentExist = await signalementExist(idSignalement, trackingCode,passwordHash)
        if(!signlamentExist) return res.status(401).json({error : "Non autorisée Aucun signalement trouvé"})
        const response = await getMessage(idSignalement)
        if(!response) return res.status(400).json({error : "Aucun message récupéré"})
        await createLog(null, idSignalement , "consultation message", chiffrement("consult message par une victime"), ip)
        return res.status(200).json(response)
    }
    catch (error : any) {
    res.status(500).json({ error: error.message || "Erreur"});
  }
}