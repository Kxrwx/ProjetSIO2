import cron from 'node-cron';
import fs from 'fs/promises';
import { getLog, clearAuditLogs } from '../../models/autid';
import { uploadToS3Log } from '../../models/file';
import { createLogEntry } from '../../models/autid';

export default async function backupLogsToR2() {
    try {
        const logs = await getLog();
        if (logs.length === 0) return console.log("Logs vides");

        const texte = logs.map(l => `[${l.createdAt.toISOString()}] ${l.action} | ${l.ipAddress}`).join('\n');
        const buffer = Buffer.from(texte);
        const fileName = `hourly-backup-${Date.now()}.txt`;

        const fileKey = await uploadToS3Log(buffer, fileName);

        await createLogEntry(fileKey, buffer.length, null);

        await clearAuditLogs(); 
        
        console.log("✅ Backup horaire réussi et DB nettoyée.");
    } catch (error) {
        console.error("❌ Erreur lors du batch horaire:", error);
    }
}