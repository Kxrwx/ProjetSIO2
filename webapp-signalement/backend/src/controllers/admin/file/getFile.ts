import type { Response } from "express";
import { getFile, setUrlViewFile } from "../../../models/file";
import { AuthRequest } from "../../../middleware/auth.middleware";

export default async function getFileNoAdmin(req: AuthRequest, res: Response) {
  try {
    const { idSignalement} = req.body;
    if (!idSignalement) {
      return res.status(400).json({ error: "Données manquantes : id, numéro de suivi et mot de passe requis" });
    }
    const files = await getFile(idSignalement);
    if (!files || files.length === 0) {
      return res.status(404).json({ error: "Aucun fichier pour ce signalement" });
    }
    const filesWithUrls = await Promise.all(
      files.map(async (file) => {
        const url = await setUrlViewFile(file.encryptedPath);
        return {
          id: file.id,
          url: url,
          createdAt: file.createdAt,
          fileSize: file.fileSize?.toString(), 
        };
      })
    );

    return res.status(200).json({
      data: filesWithUrls
    });

  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Erreur interne du serveur" });
  }
}