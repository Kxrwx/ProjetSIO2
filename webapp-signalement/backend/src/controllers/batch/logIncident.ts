import { getLog, clearAuditLogs, createLogEntry } from "../../models/autid";
import { uploadToS3Log } from "../../models/file";

export default async function logSystemIncident(event: string) {
    try {
        console.log(`⚠️ Préparation du backup d'urgence : ${event}`);

        const logs = await getLog();
        
        let content = `--- INCIDENT SYSTEME DETECTE ---\n`;
        content += `EVENEMENT : ${event}\n`;
        content += `DATE : ${new Date().toISOString()}\n`;
        content += `--------------------------------\n\n`;

        if (logs.length > 0) {
            const logsTexte = logs.map(l => 
                `[${l.createdAt.toISOString()}] ${l.action} | IP: ${l.ipAddress || 'N/A'} | Hash: ${l.currentHash}`
            ).join('\n');
            content += logsTexte;
        } else {
            content += "Aucun log d'audit présent en base au moment de l'incident.";
        }

        const buffer = Buffer.from(content);
        const fileName = `emergency-log-${Date.now()}.txt`;

        const fileKey = await uploadToS3Log(buffer, fileName);

        await createLogEntry(fileKey, buffer.length, null);

        if (logs.length > 0) {
            await clearAuditLogs();
        }
        
        console.log(`✅ Incident et logs sauvegardés sur R2 : ${fileKey}`);
    } catch (err) {
        console.error("❌ ERREUR CRITIQUE lors du logging d'incident:", err);
    }
}