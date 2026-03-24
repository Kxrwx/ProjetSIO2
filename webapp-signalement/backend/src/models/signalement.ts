import {prisma} from "../db/prisma"
import { Prisma, Statut } from "@prisma/client"

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

export async function getAllSignalement() {
    const signalements = await prisma.signalement.findMany(
        {
            select : {idSignalement : true, title : true, statut : true, categorie : true, dateEncrypted : true, priorite : true}
        }
    );
    return signalements; 
}

export async function  getDetailSignalement(idSignalement: number) {
    const req = await prisma.signalement.findUnique(
        {
            where : {idSignalement}
        }
    )
    return req
}


export async function updateSignalementAdmin(idSignalement:number, idStatut : number, ) {
    const req = await prisma.signalement.update({
        where : {idSignalement}, 
        data : {idStatut, updatedAt : new Date()}
    })
    return req
}