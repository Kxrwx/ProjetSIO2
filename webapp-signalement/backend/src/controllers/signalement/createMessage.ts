import type { Request, Response } from "express";
import { chiffrement } from "../../lib/bib";
import { createMessage } from "../../models/message";

export default async function createMessageNoAdmin(req:Request, res : Response) {
    try {
        const {bodymessage, idSignalement} = req.body
        if(!bodymessage || !idSignalement) return res.status(400).json({error : "Données manquantes"})
        const messageCrypt = chiffrement(bodymessage)
        const response = await createMessage(idSignalement, messageCrypt, null)
        if(!response) return res.status(400).json({error : "Erreur lors de la création"})
        return res.status(200).json({success : true})
    }
    catch (error : any) {
    res.status(500).json({ error: error.message || "Erreur"});
  }
}