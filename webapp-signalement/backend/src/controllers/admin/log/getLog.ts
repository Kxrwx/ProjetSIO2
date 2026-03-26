import { AuthRequest } from "../../../middleware/auth.middleware";
import type { Response } from "express";
import {getLog} from "../../../models/autid"

export default async function getLogController(req : AuthRequest, res : Response) {
    try {
        const response = await getLog()
        if(!response) return res.status(404).json({error : "Aucun log"})
        return res.status(200).json(response)
    }
    catch(error) {
        return res.status(500).json({error : "Erreur serveur"})
    }

}