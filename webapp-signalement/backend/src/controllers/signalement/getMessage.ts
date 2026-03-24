import type { Request, Response } from "express";
import { getMessage } from "../../models/message";

export default async function getMessageNoAdmin(req:Request, res: Response) {
    try {
        const idSignalement = req.body
        if(!idSignalement)return res.status(400).json({error : "Donnée manquant"})
        const response = await getMessage(idSignalement)
        if(!response) return res.status(400).json({error : "Aucun message récupéré"})
        return res.status(200).json(response)
    }
    catch (error : any) {
    res.status(500).json({ error: error.message || "Erreur"});
  }
}