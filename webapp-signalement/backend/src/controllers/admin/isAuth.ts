import { AuthRequest } from "../../middleware/auth.middleware";
import type { Response } from "express";



export default async function isAuth(req : AuthRequest, res : Response){
    try {
        const userId = req.user?.id
        if(!userId) return res.status(404).json({error : "Aucun User"})
        const sessionId = req.session?.id
        if(!sessionId) return res.status(404).json(`Aucune session`) 
        const idRole = req.role?.idRole
        const nameRole = req.role?.nameRole
        const idPermissions = req.permissions?.map(p => p.idPermission)
        const namePermission = req.permissions?.map(p => p.nameRole)
        const body = {idRole, nameRole, idPermissions, namePermission}
        return res.status(200).json(body)
    }
    catch (error) {
        return res.status(500).json({error : "Erreur serveur"})
    }
}