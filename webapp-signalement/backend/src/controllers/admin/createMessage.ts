import { AuthRequest } from "../../middleware/auth.middleware";
import type { Response } from "express";
import { createMessage } from "../../models/message"
import { chiffrement } from "../../lib/bib";
import { createLog } from "../../models/autid";

export default async function createMessageAdmin(req:AuthRequest, res : Response) {
    try{
        const forwarded = req.headers['x-forwarded-for'];
        const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress || null;
        const {bodymessage, idSignalement} = req.body
        const userId = req.user?.id
        if(!userId) return res.status(401).json({error : "Unauthorize"})
        if(!bodymessage || !idSignalement) return res.status(404).json({error : "Donnée manquante"})
        const messageCrypt = chiffrement(bodymessage)
        if(!messageCrypt) return res.status(400).json({erreur : "Erreur de chiffrement"})
        const response = await createMessage(idSignalement, messageCrypt, userId)
        if(!response) return res.status(400).json({error : "Erreur à la création"})
        await createLog(userId, idSignalement , "create message admin", chiffrement(`create message par ${userId} sur signalement ${idSignalement}, message : ${bodymessage}`), ip)
        return res.status(200).json({success : true})
        }
    catch (error) {
        return res.status(500).json({error : "Erreur serveur"})
    }
}