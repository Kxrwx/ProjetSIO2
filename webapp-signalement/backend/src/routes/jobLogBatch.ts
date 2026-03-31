// src/jobs/logBatch.ts
import cron from 'node-cron';
import backupLogsToR2 from '../controllers/batch/log1H'; 
import logSystemIncident from '../controllers/batch/logIncident';

export const initLogJobs = () => {
    cron.schedule('0 * * * *', async () => {
        console.log("🕒 [CRON] Début du backup horaire...");
        await backupLogsToR2();
    });
    process.on('SIGINT', async () => {
        await logSystemIncident("MANUAL_SHUTDOWN_SIGINT");
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        await logSystemIncident("SERVER_TERMINATED_SIGTERM");
        process.exit(0);
    });

    process.on('uncaughtException', async (err) => {
        await logSystemIncident(`CRASH_ERROR: ${err.message}`);
        process.exit(1);
    });

    console.log("🛡️  Système de monitoring des logs activé.");
};