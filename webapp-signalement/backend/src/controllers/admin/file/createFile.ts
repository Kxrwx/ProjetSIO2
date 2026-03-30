import { AuthRequest } from "../../../middleware/auth.middleware";
import type { Response } from "express";
import { createPieceJointe, uploadToS3 } from "../../../models/file";

export default async function createFileAdmin(req:AuthRequest, res : Response) {
    try {
        const { idSignalement, file } = req.body;
        if (!idSignalement || !file) {
            return res.status(400).json({ error: "Données manquantes : idSignalement et fichier requis" });
        }
        await createPieceJointe(idSignalement, file.path, file.size)
        await uploadToS3(file, idSignalement);
        return res.status(200).json({ message: "Fichier ajouté avec succès" });
        
    }
    catch (error: any) {
    return res.status(500).json({ error: error.message || "Erreur interne du serveur" });
  }


}