require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Utilitaire : hasher un mot de passe en SHA-256
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

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
      console.log("Relations non trouvées:", { cat, pri, stat });
      return res.status(400).json({ error: 'Catégorie, priorité ou statut invalide' });
    }

    // MAPPING vers le schéma Prisma
    const signalementData = {
      title: titre,
      trackingCode: trackingCode,
      trackingPasswordHash: hashPassword(password), // Hashé côté serveur
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

    console.log("SIGNALEMENT CRÉÉ:", signalement);
    res.status(201).json({ 
      trackingCode: signalement.trackingCode,
      id: signalement.idSignalement
    });
    
  } catch (error) {
    console.error("ERREUR PRISMA:", error.message);
    console.error("ERREUR COMPLÈTE:", error);
    res.status(500).json({ error: error.message });
  }
});

// Consultation : retrouver un signalement par numéro de suivi + mot de passe
app.post('/api/signalements/consult', async (req, res) => {
  try {
    const { trackingCode, password } = req.body;
    if (!trackingCode || !password) {
      return res.status(400).json({ error: 'Numéro de suivi et mot de passe requis' });
    }

    const passwordHash = hashPassword(password); 

    const signalement = await prisma.signalement.findFirst({
      where: {
        trackingCode: trackingCode.trim(),
        trackingPasswordHash: passwordHash,
      },
      include: {
        statut: true,
        priorite: true,
        categorie: true,
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!signalement) {
      return res.status(404).json({ error: 'Aucun signalement trouvé pour ce numéro et ce mot de passe' });
    }

    const { trackingPasswordHash, ...safe } = signalement;
    res.json(safe);
  } catch (error) {
    console.error('Erreur consult:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur Prêt sur http://localhost:${PORT}`);
});

app.get('/health', (req, res) => { 
  res.json({ status: 'healthy' });
});

app.get('/api/testdb', async (req, res) => {
  try {
    const [categories, priorites, statuts, signalements] = await Promise.all([
      prisma.categorie.findMany(),
      prisma.priorite.findMany(),
      prisma.statut.findMany(),
      prisma.signalement.count(),
    ]);

    res.json({
      status: 'Connecté à la base de données',
      counts: {
        signalements,
        categories: categories.length,
        priorites: priorites.length,
        statuts: statuts.length,
      },
      data: { categories, priorites, statuts },
    });
  } catch (error) {
    console.error('Erreur testdb:', error);
    res.status(500).json({ 
      status: 'Déconnecté',
      error: error.message 
    });
  }
});