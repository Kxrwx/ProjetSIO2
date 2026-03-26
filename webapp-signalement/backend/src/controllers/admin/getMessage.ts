import { AuthRequest } from "../../middleware/auth.middleware";
import type { Response } from "express";
import { getMessage } from "../../models/message";
import { createLog } from "../../models/autid";
import { chiffrement, dechiffrement } from "../../lib/bib";

export default async function getMessageAdmin(req:AuthRequest, res: Response) {
    try{
        const forwarded = req.headers['x-forwarded-for'];
        const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress || null;
        const userId = req.user?.id
        if(!userId) return res.status(401).json({error : "Unauthorize"})
        const {idSignalement} = req.body
        if(!idSignalement)return res.status(400).json({error : "Donnée manquant"})
        const messages = await getMessage(idSignalement)
        if(!messages) return res.status(400).json({error : "Aucun message récupéré"})
        await createLog(userId, idSignalement , "getMessage signalement", chiffrement(`getMessage signalement par ${userId} sur signalemrnt ${idSignalement}`), ip)
        const messagesDechiffres = messages.map(msg => {
            const { contenuEncrypted, ...reste } = msg;
            return {
                ...reste,
                contenu: dechiffrement(contenuEncrypted)
            };
});
        return res.status(200).json(messagesDechiffres)
    }
    catch (error) {
        return res.status(500).json({error : "Erreur serveur"})
    }
}