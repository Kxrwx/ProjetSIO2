import type { Request, Response } from "express";
import { getRelationIds } from "../../models/relation";
import { hashPassword, chiffrement } from "../../lib/bib";
import { createSignalementDB } from "../../models/signalement";
import { uploadToS3, createPieceJointe } from "../../models/file";
import { createLog } from "../../models/autid";
import { askOpenAI } from "../../IA/OpenAI";

export default async function createSignalement(req: Request, res: Response) {  
  try {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress || null;
    
    const { titre, nom, contact, lieu, date, description, password, trackingCode } = req.body;

    if (!titre || !description || !password || !trackingCode) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }
    
    // --- ÉTAPE 1 : APPEL IA ---
    console.log("--- DEBUG IA START ---");
    const aiResult = await askOpenAI(description);
    
    // Log pour voir l'objet complet retourné par ta fonction askOpenAI
    // console.log("Résultat brut de la fonction askOpenAI :", JSON.stringify(aiResult, null, 2));

    if (!aiResult) {
      console.error("ERREUR : L'IA a renvoyé null");
      return res.status(500).json({ error: "L'IA n'a pas pu classifier le signalement." });
    }

    // --- ÉTAPE 2 : EXTRACTION ---
    // On utilise les clés AVEC ACCENTS car c'est ce que tu as défini dans ton prompt et ton type
    const finalCat = aiResult.catégorie;
    const finalPri = aiResult.priorité;

    // console.log(`Valeurs extraites -> Catégorie: ${finalCat} (type: ${typeof finalCat}), Priorité: ${finalPri} (type: ${typeof finalPri})`);

    // --- ÉTAPE 3 : DATABASE RELATION ---
    // console.log("Appel de getRelationIds avec :", finalCat, finalPri);
    const { cat, pri, stat } = await getRelationIds(finalCat, finalPri);
    
    console.log("Résultat getRelationIds :", { cat, pri, stat });

    if (!cat || !pri || !stat) {
      console.error("ERREUR DB : Correspondance introuvable pour les IDs fournis par l'IA");
      return res.status(400).json({ error: 'Catégorie ou priorité invalide en base de données' });
    }
    
    console.log("--- DEBUG IA END ---");

    // --- ÉTAPE 4 : CRÉATION ---
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
      const fileNameBuffer = Buffer.from(file.originalname, 'utf-8');

      await createPieceJointe(
        signalement.idSignalement, 
        fileKey, 
        file.size, 
        fileNameBuffer 
      );
    })
  );
}
    await createLog(null, signalement.idSignalement , "creation signalement", chiffrement("creation signalement par une victime"), ip)

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