import { prisma } from "../db/prisma";


export async function createSession(userId : string, sessionToken : string) {
    const req = await prisma.session.create({
        data : {userId, sessionToken, expiresAt : new Date(Date.now() + 1000 * 60 * 60 * 2)}
    })
    return req
}

export async function deleteSession(userId:string) {
    const req = await prisma.session.deleteMany({
        where : {userId}
    })
    return req
}

export async function getSession(sessionToken:string) {
    const req = await prisma.session.findUnique({
            where: { sessionToken },
            include: { user: true }
        });
    return req
}