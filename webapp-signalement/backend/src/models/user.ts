import {prisma} from "../db/prisma"

export async function getUser(email : string) {
    const req = await prisma.user.findUnique(
        {
            where : {email}
        }
    )
    return req
}