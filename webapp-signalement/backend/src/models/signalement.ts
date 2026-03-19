import {prisma} from "../db/prisma"
import { Prisma } from "@prisma/client"

export type SignalementData = Prisma.SignalementUncheckedCreateInput;


export async function createSignalementDB(data : SignalementData) {
    const req = await prisma.signalement.create({ data : data});
    return req
}

export async function selectSignalementDB(trackingCode : string, trackingPasswordHash : string){
    const req = await prisma.signalement.findFirst({
        where : {trackingCode, trackingPasswordHash},
        include: {
        statut: true,
        priorite: true,
        categorie: true,
        messages: { orderBy: { createdAt: 'asc' } },
      },
    })
    return req
}