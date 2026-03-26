import {prisma} from "../db/prisma"
import { s3 } from "../db/s3"
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import type { Multer } from "multer";

export async function getFile(idSignalement:number) {
    const req = await prisma.pieceJointe.findMany({
        where : {idSignalement},
        orderBy: { createdAt: 'desc' }
    })
    return req
}

export async function setUrlViewFile(fileKey : string, contentType?: string){
    const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME || "nom-de-ton-bucket",
    Key: fileKey,
    ResponseContentType: contentType, 
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 900 });

    return url
}



export async function uploadToS3(file: Express.Multer.File, idSignalement: number) {
    const uniqueSuffix = crypto.randomBytes(4).toString('hex');
    const fileKey = `signalements/${idSignalement}/${Date.now()}-${uniqueSuffix}-${file.originalname}`;

    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer, 
        ContentType: file.mimetype, 
    });

    await s3.send(command);
    return fileKey;
}

export async function uploadToS3Log(file : Express.Multer.File, userId: string) {
    const uniqueSuffix = crypto.randomBytes(4).toString('hex');
    const folder = Date.now()
    const fileKey = `log/${folder}/${Date.now()}-${uniqueSuffix}-${userId}`;

    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer, 
        ContentType: file.mimetype, 
    });

    await s3.send(command);
    return fileKey;
}

export async function createPieceJointe(idSignalement: number, fileKey: string, fileSize: number) {
    return await prisma.pieceJointe.create({
        data: {
            idSignalement: idSignalement,
            encryptedPath: fileKey,
            fileSize: BigInt(fileSize), 
        }
    });
}