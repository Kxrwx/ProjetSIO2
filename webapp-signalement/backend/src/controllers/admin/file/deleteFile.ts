import type { Response } from "express";
import { getFile, setUrlViewFile, deleteFromS3, deletePieceJointeDB } from "../../../models/file";
import { AuthRequest } from "../../../middleware/auth.middleware";

export default async function deleteFileAdmin(req: AuthRequest, res: Response) {
  try {
    const { idSignalement, idFile, fileKey } = req.body;

    if (!idSignalement || !idFile || !fileKey) {
      return res.status(400).json({ error: "idSignalement, idFile et fileKey requis" });
    }

    await deleteFromS3(fileKey);

    await deletePieceJointeDB(Number(idFile));

    const updatedFiles = await getFile(Number(idSignalement));

    const filesWithUrls = await Promise.all(
      updatedFiles.map(async (file) => {
        const url = await setUrlViewFile(file.encryptedPath);
        
        const fileName = file.originalFilenameEncrypted 
          ? Buffer.from(file.originalFilenameEncrypted).toString('utf-8')
          : `Fichier-${file.id}`;

        return {
          id: file.id,
          url: url,
          name: fileName,
          fileKey: file.encryptedPath, // On renvoie la clé pour la prochaine suppression
          createdAt: file.createdAt,
          fileSize: file.fileSize?.toString(), 
        };
      })
    );

    return res.status(200).json({ 
      message: "Fichier supprimé avec succès",
      data: filesWithUrls 
    });

  } catch (error: any) {
    console.error("Delete Error:", error);
    return res.status(500).json({ error: "Erreur lors de la suppression du fichier" });
  }
}