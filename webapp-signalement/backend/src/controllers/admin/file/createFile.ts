import { AuthRequest } from "../../../middleware/auth.middleware";
import type { Response } from "express";
import { createPieceJointe, uploadToS3 } from "../../../models/file";

export default async function createFileAdmin(req: AuthRequest, res: Response) {
  try {
    const { idSignalement } = req.body;
    const file = req.file;

    if (!idSignalement || !file) {
      return res.status(400).json({ error: "idSignalement et fichier requis" });
    }

    const idSigo = Number(idSignalement);
    if (isNaN(idSigo)) {
      return res.status(400).json({ error: "idSignalement invalide" });
    }

    const fileKey = await uploadToS3(file, idSigo);

    await createPieceJointe(
      idSigo, 
      fileKey,
      file.size,
      file.originalname
    );

    return res.status(200).json({ message: "Fichier ajouté avec succès", fileKey });
  } catch (error: any) {
    console.error("Upload Error:", error); 
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}