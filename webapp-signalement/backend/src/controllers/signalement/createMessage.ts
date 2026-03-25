import type { Request, Response } from "express";
import { chiffrement } from "../../lib/bib";
import { createMessage } from "../../models/message";
import { createLog } from "../../models/autid";

export default async function createMessageNoAdmin(req:Request, res : Response) {
    try {
        const forwarded = req.headers['x-forwarded-for'];
        const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress || null;
        const {bodymessage, idSignalement} = req.body
        if(!bodymessage || !idSignalement) return res.status(400).json({error : "Données manquantes"})
        const messageCrypt = chiffrement(bodymessage)
        if(!messageCrypt) return res.status(400).json({erreur : "Erreur de chiffrement"})
        const response = await createMessage(idSignalement, messageCrypt, null)
        if(!response) return res.status(400).json({error : "Erreur lors de la création"})
        await createLog("victim", idSignalement , "creation message", chiffrement("creation message par une victime"), ip)
        return res.status(200).json({success : true})
    }
    catch (error : any) {
    res.status(500).json({ error: error.message || "Erreur"});
  }
}