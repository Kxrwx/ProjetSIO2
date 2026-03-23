import type { Response} from "express"
import type { AuthRequest } from "../../middleware/auth.middleware"

export default async function getUser(req:AuthRequest, res:Response) {
    try {
        const user = req.user
        const role = req.role
        const session = req.session
        const permission = req.permissions
        if(!user||!role||!session||!permission) return res.status(404).json({error : "Les datas n'ont pas été récupéré"})
        return res.status(200).json({user, role, session, permission})
    }
    catch (error) {
        return res.status(500).json({error : "Erreur serveur"})
    }
}