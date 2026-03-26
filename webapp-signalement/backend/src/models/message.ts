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
        select: {
            id: true,
            idSignalement: true,
            userId: true,
            isRead: true,
            createdAt: true,
            contenuEncrypted: true, 
            user: {
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    role: {
                        select: {
                            idRole: true,
                            nameRole: true
                        }
                    }
                }
            }
        },
        orderBy : {createdAt : "asc"}
    }
    )
    return req
}