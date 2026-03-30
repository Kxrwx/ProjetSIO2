import type { Response } from "express";
import { getFile, setUrlViewFile } from "../../../models/file";
import { AuthRequest } from "../../../middleware/auth.middleware";

export default async function getFileAdmin(req: AuthRequest, res: Response) {
  try {
    const { idSignalement } = req.body;
    if (!idSignalement) return res.status(400).json({ error: "id requis" });

    const files = await getFile(Number(idSignalement));

    const filesWithUrls = await Promise.all(
      files.map(async (file) => {
        const url = await setUrlViewFile(file.encryptedPath);
        
        // CONVERSION DU BUFFER EN STRING ICI
        const fileName = file.originalFilenameEncrypted 
          ? Buffer.from(file.originalFilenameEncrypted).toString('utf-8')
          : `Fichier-${file.id}`;

        return {
          id: file.id,
          url: url,
          name: fileName, // On ajoute le nom converti
          createdAt: file.createdAt,
          fileSize: file.fileSize?.toString(), 
        };
      })
    );

    return res.status(200).json({ data: filesWithUrls });
  } catch (error: any) {
    console.error("Preview Error:", error);
    return res.status(500).json({ error: "Erreur lors de la génération de la preview" });
  }
}