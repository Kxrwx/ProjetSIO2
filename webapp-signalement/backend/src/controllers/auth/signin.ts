import type { Request, Response } from "express";
import bcrypt from "bcrypt"
import { getUser } from "../../models/user";
import crypto from "crypto"
import {createSession, deleteSession} from "../../models/session"
import { createLog } from "../../models/autid";
import { chiffrement } from "../../lib/bib";




export default async function signin(req:Request, res : Response) {
    try {
        const forwarded = req.headers['x-forwarded-for'];
        const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress || null;
        const {email, password} = req.body
        const user = await getUser(email)
        if(!user) return res.status(401).json({error : "Erreur login"})
        const valid = await bcrypt.compare(password, user.passwordHash)
        if(!valid) return res.status(401).json({error : "Erreur login"})
        await deleteSession(user.id)
        const token = crypto.randomBytes(32).toString("hex")
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
        await createSession(user.id, tokenHash)
        res.cookie("session_token", token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 2 * 60 * 60 * 1000, 
            domain : process.env.NODE_ENV === "production" ? process.env.FRONT : undefined
        })
        const {passwordHash, ...safeUser} = user 
        await createLog(user.id, null , "signin user", chiffrement(`signin de ${user.id}`), ip)
        res.status(200).json(safeUser)
    }
    catch (error){
        res.status(500).json({error : "Erreur serveur"})
    }
}