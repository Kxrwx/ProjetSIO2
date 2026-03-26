import { AuthRequest } from "../../../middleware/auth.middleware";
import type { Response } from "express";
import { uploadToS3Log } from "../../../models/file";

export default async function createLogFile(req:AuthRequest, res: Response) {
    try {
        const { file } = req.body
        const userId = req.user?.id
        if(!userId) return  res.status(401).json({error : "Unauthorized"})
        const link = uploadToS3Log(file, userId)
    }
    catch(error) {
        return res.status(500).json({error : "Erreur serveur"})
    }
}