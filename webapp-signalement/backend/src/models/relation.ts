import { prisma } from "../db/prisma"

// Récupère les IDs depuis les noms
export async function getRelationIds(categorieName : string, prioriteName : string) {
  const [cat, pri, stat] = await Promise.all([
    prisma.categorie.findFirst({ where: { nameCategorie: categorieName } }),
    prisma.priorite.findFirst({ where: { namePriorite: prioriteName } }),
    prisma.statut.findFirst({ where: { nameStatut: 'Nouveau' } })
  ]);
  
  return { cat, pri, stat };
}
