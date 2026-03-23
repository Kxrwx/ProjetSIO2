import { AuthRequest } from "../../middleware/auth.middleware";
import type { Response } from "express";



export default async function isAuth(req : AuthRequest, res : Response){
    try {
        const userId = req.user?.id
        if(!userId) return res.status(404).json({error : "Aucun User"})
        const sessionId = req.session?.id
        if(!sessionId) return res.status(404).json(`Aucune session`) 
        return res.status(200).json({authentified : true})
    }
    catch (error) {
        return res.status(500).json({error : "Erreur serveur"})
    }
}