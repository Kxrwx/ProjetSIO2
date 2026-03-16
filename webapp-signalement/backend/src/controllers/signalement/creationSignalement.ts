import type { Request, Response } from "express";
import {getRelationIds} from "../../models/relation"
import {hashPassword} from "../../lib/bib"
import {createSignalementDB} from "../../models/signalement"

export default async function createSignalement(req:Request, res : Response) {
    console.log("REQUÊTE COMPLETE :", JSON.stringify(req.body, null, 2));
  
  try {
    const { titre, nom, contact, lieu, date, categorie, priorite, description, password, trackingCode } = req.body;

    // VALIDATION
    if (!titre || !categorie || !priorite || !description || !password || !trackingCode) {
      console.log("Champs manquants:", { titre, categorie, priorite, description, password, trackingCode });
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }

    const { cat, pri, stat } = await getRelationIds(categorie, priorite);
    
    if (!cat || !pri || !stat) {
      console.log("Relations non trouvées:", { cat, pri, stat });
      return res.status(400).json({ error: 'Catégorie, priorité ou statut invalide' });
    }

    // MAPPING vers le schéma Prisma
    const signalementData = {
      title: titre,
      trackingCode: trackingCode,
      trackingPasswordHash: hashPassword(password),
      victimNameEncrypted: nom || null,
      victimContactEncrypted: contact || null,
      descriptionEncrypted: description,
      lieuEncrypted: lieu || null,
      dateEncrypted: (date && date !== "") ? new Date(date) : null,
      idCategorie: cat.idCategorie,
      idPriorite: pri.idPriorite,
      idStatut: stat.idStatut,
    };

    console.log("📊 DONNÉES PRÊTES POUR PRISMA:", signalementData);

    const signalement = await createSignalementDB(signalementData)

    console.log("SIGNALEMENT CRÉÉ:", signalement);
    res.status(201).json({ 
      trackingCode: signalement.trackingCode,
      id: signalement.idSignalement
    });
    
  } catch (error : any) {

    res.status(500).json({ error: error.message || "Erreur"});
  }
}
