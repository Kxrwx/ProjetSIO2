import { AuthRequest } from "../../middleware/auth.middleware";
import type { Response } from "express";
import { createMessage } from "../../models/message"
import { chiffrement } from "../../lib/bib";

export default async function createMessageAdmin(req:AuthRequest, res : Response) {
    try{
        const {bodymessage, idSignalement, userId} = req.body
        if(!bodymessage || !idSignalement) return res.status(404).json({error : "Donnée manquante"})
        const messageCrypt = chiffrement(bodymessage)
        const response = await createMessage(idSignalement, messageCrypt, userId || null)
        if(!response) return res.status(400).json({error : "Erreur à la création"})
        return res.status(200).json({success : true})
        }
    catch (error) {
        return res.status(500).json({error : "Erreur serveur"})
    }
}