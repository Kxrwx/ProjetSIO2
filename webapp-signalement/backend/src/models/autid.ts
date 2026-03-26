import {prisma} from "../db/prisma"
import crypto from 'crypto'

export async function createLog(userId : string | null, idSignalement : number |null, action : string, detailsEncrypted : string | null, ipAddress : string | null) {
    const lastLog = await prisma.auditLog.findFirst({
    orderBy: { createdAt: "desc" },
    });

    const previousHash = lastLog ? lastLog.currentHash : "00000000000000000000000000000000";
    const timestamp = new Date().toISOString();
    const dataToHash = `${previousHash}|${action}|${detailsEncrypted}|${userId}|${timestamp}`;
    const currentHash = crypto.createHash("sha256").update(dataToHash).digest("hex");
    const req = await prisma.auditLog.create({
        data : {userId, idSignalement, action, detailsEncrypted,ipAddress, previousHash, currentHash }
    })
    return req
}

export async function getLog() {
    const req = await prisma.auditLog.findMany({
        orderBy : {createdAt : "desc"}
    })
    return req
}

export async function createLogEntry(fileKey: string, size: number, name: Buffer | null = null) {
  return await prisma.logFile.create({
    data: {
      path: fileKey,
      fileSize: BigInt(size),
      filename: name
    }
  });
}

export async function clearAuditLogs() {
    const req = await prisma.auditLog.deleteMany()
    return req
}