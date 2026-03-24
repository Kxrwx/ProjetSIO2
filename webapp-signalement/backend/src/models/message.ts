import { prisma } from "../db/prisma";


export async function createMessage(idSignalement:number, message : string, userId : string | null) {
    const req = await prisma.message.create({
        data : {idSignalement, contenuEncrypted : message, userId : userId || null}
    })
    return req
}


export async function getMessage(idSignalement:number) {
    const req = await prisma.message.findMany({
        where : {idSignalement},
        orderBy : {createdAt : "asc"}
    }
    )
    return req
}