import { AuthRequest } from "../../middleware/auth.middleware";
import type { Response } from "express";
import { getMessage } from "../../models/message";


export default async function getMessageAdmin(req:AuthRequest, res: Response) {
    try{
        const {idSignalement} = req.body
        if(!idSignalement)return res.status(400).json({error : "Donnée manquant"})
        const response = await getMessage(idSignalement)
        if(!response) return res.status(400).json({error : "Aucun message récupéré"})
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(500).json({error : "Erreur serveur"})
    }
}