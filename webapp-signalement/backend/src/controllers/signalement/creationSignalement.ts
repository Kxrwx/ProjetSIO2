import type { Request, Response } from "express";
import { getRelationIds } from "../../models/relation";
import { hashPassword, chiffrement } from "../../lib/bib";
import { createSignalementDB } from "../../models/signalement";
import { uploadToS3, createPieceJointe } from "../../models/file";
import { createLog } from "../../models/autid";

export default async function createSignalement(req: Request, res: Response) {
  try {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress || null;
    const { titre, nom, contact, lieu, date, categorie, priorite, description, password, trackingCode } = req.body;

    if (!titre || !categorie || !priorite || !description || !password || !trackingCode) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }

    const { cat, pri, stat } = await getRelationIds(categorie, priorite);
    if (!cat || !pri || !stat) {
      return res.status(400).json({ error: 'Catégorie, priorité ou statut invalide' });
    }

    const signalementData = {
      title: titre,
      trackingCode: trackingCode,
      trackingPasswordHash: hashPassword(password),
      descriptionEncrypted: chiffrement(description),
      victimNameEncrypted: nom ? chiffrement(nom) : null,
      victimContactEncrypted: contact ? chiffrement(contact) : null,
      lieuEncrypted: lieu ? chiffrement(lieu) : null,
      dateEncrypted: date ? new Date(date) : null,
      idCategorie: cat.idCategorie,
      idPriorite: pri.idPriorite,
      idStatut: stat.idStatut,
    };

    const signalement = await createSignalementDB(signalementData);

    if(!signalement) return res.status(400).json({error : "Erreur creation signalement"})

    const files = req.files as any[]; 
    
    if (files && files.length > 0) {
      await Promise.all(
        files.map(async (file) => {
          const fileKey = await uploadToS3(file, signalement.idSignalement);
          await createPieceJointe(signalement.idSignalement, fileKey, file.size);
        })
      );
    }
    await createLog("victim", signalement.idSignalement , "creation signalement", chiffrement("creation signalement par une victime"), ip)

    res.status(200).json({ 
      trackingCode: signalement.trackingCode,
      id: signalement.idSignalement,
      message: files ? `${files.length} fichiers uploadés.` : "Aucun fichier joint."
    });
    
  } catch (error: any) {
    console.error("ERREUR CREATE:", error);
    res.status(500).json({ error: error.message || "Erreur" });
  }
}