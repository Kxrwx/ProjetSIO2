import {prisma} from "../db/prisma"
import { s3 } from "../db/s3"
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { chiffrement } from "../lib/bib";

export async function getFile(idSignalement:number) {
    const req = await prisma.pieceJointe.findMany({
        where : {idSignalement},
        orderBy: { createdAt: 'desc' }
    })
    return req
}

export async function setUrlViewFile(fileKey: string) {
    const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 900 });
    return url;
}


export async function uploadToS3Log(fileBuffer: Buffer) {
    const fileKey = `logs/audit-${Date.now()}.txt`;

    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey,
        Body: fileBuffer, 
        ContentType: "text/plain",
    });

    await s3.send(command);
    return fileKey;
}

export async function uploadToS3(file: Express.Multer.File, idSignalement: number) {
  const uniqueSuffix = crypto.randomBytes(4).toString('hex');
  const safeName = file.originalname.replace(/\s+/g, '-');
  const fileKey = `signalements/${idSignalement}/${Date.now()}-${uniqueSuffix}-${safeName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(command);
  return fileKey;
}

export async function createPieceJointe(
  idSignalement: number,
  fileKey: string,
  fileSize: number,
  fileName: string | Buffer 
) {
  return prisma.pieceJointe.create({
    data: {
      idSignalement: idSignalement,
      encryptedPath: fileKey,
      fileSize: BigInt(fileSize),
      originalFilenameEncrypted: Buffer.isBuffer(fileName) 
        ? fileName 
        : Buffer.from(fileName, 'utf-8'),
    },
  });
}