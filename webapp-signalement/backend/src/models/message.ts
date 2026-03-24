import { prisma } from "../db/prisma";


export async function createMessage(idSignalement:number, message : string, userId : string | null) {
    const req = await prisma.message.create({
        data : {idSignalement, contenuEncrypted : message, userId : userId || null}
    })
    return req
}