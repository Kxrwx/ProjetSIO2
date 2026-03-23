import {prisma} from "../db/prisma"

export async function getUser(email : string) {
    const req = await prisma.user.findUnique(
        {
            where : {email}
        }
    )
    return req
}

export async function getUserAll(id:string) {
    const req = await prisma.user.findUnique({
        where : {id},
        include : {role : true}
    })
    return req
}

export async function getPermissionByRole(idRole:number) {
    const req = await prisma.rolePermission.findMany({
        where : {idRole},
        include : {permission : true}
    })
    return req.map(rp => rp.permission);
}