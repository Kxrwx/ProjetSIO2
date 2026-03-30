import { AuthRequest } from "../../../middleware/auth.middleware";
import type { Response } from "express";
import { uploadToS3Log } from "../../../models/file";
import { createLogEntry, getLog } from "../../../models/autid";
import { generateLogFile } from "../../../lib/bib";
import fs from 'fs/promises';

export default async function createLogFile(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const logs = await getLog();
        const lignesTexte = logs.map(log => 
            `[${log.createdAt.toISOString()}] ID:${log.id} | Action:${log.action} | IP:${log.ipAddress || 'N/A'}`
        );

        const filePath = await generateLogFile(lignesTexte);

        const stats = await fs.stat(filePath);
        const fileContent = await fs.readFile(filePath); 

        const fileKey = await uploadToS3Log(fileContent);

        await createLogEntry(fileKey, stats.size, null);

        await fs.unlink(filePath);

        return res.status(200).json({ message: "Backup R2 réussi", path: fileKey });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
}