import type { Request, Response } from "express";
import { hashPassword } from "../../../lib/bib";
import { signalementExist } from "../../../models/signalement";
import { getFile, setUrlViewFile } from "../../../models/file";

export default async function getFileNoAdmin(req: Request, res: Response) {
  try {
    const { idSignalement, trackingCode, password } = req.body;
    if (!trackingCode || !password || !idSignalement) {
      return res.status(400).json({ error: "Données manquantes : id, numéro de suivi et mot de passe requis" });
    }
    const passwordHash = hashPassword(password);
    const exists = await signalementExist(idSignalement, trackingCode, passwordHash);
    if (!exists) {
      return res.status(401).json({ error: "Non autorisé : Aucun signalement correspondant trouvé" });
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