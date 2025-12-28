const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Récupère les IDs depuis les noms
async function getRelationIds(categorieName, prioriteName) {
  console.log("Recherche IDs pour:", { categorie: categorieName, priorite: prioriteName });
  
  const [cat, pri, stat] = await Promise.all([
    prisma.categorie.findFirst({ where: { nameCategorie: categorieName } }),
    prisma.priorite.findFirst({ where: { namePriorite: prioriteName } }),
    prisma.statut.findFirst({ where: { nameStatut: 'Nouveau' } })
  ]);
  
  console.log("IDs trouvés:", { cat: cat?.idCategorie, pri: pri?.idPriorite, stat: stat?.idStatut });
  return { cat, pri, stat };
}

app.post('/api/signalements', async (req, res) => {
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
      console.log("❌ Relations non trouvées:", { cat, pri, stat });
      return res.status(400).json({ error: 'Catégorie, priorité ou statut invalide' });
    }

    // MAPPING vers le schéma Prisma
    const signalementData = {
      title: titre,
      trackingCode: trackingCode,
      trackingPasswordHash: password, // Déjà hashé par le frontend
      victimNameEncrypted: nom || null,
      victimContactEncrypted: contact || null,
      descriptionEncrypted: description,
      lieuEncrypted: lieu || null,
      dateEncrypted: date ? new Date(date) : null,
      idCategorie: cat.idCategorie,
      idPriorite: pri.idPriorite,
      idStatut: stat.idStatut,
    };

    console.log("📊 DONNÉES PRÊTES POUR PRISMA:", signalementData);

    const signalement = await prisma.signalement.create({ data: signalementData });

    console.log("✅ SIGNEMENT CRÉÉ:", signalement);
    res.status(201).json({ 
      trackingCode: signalement.trackingCode,
      id: signalement.idSignalement
    });
    
  } catch (error) {
    console.error("❌ ERREUR PRISMA:", error.message);
    console.error("❌ ERREUR COMPLÈTE:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur Prêt sur http://localhost:${PORT}`);
});