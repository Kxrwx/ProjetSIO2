import {prisma} from "../db/prisma"
import { s3 } from "../db/s3"
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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