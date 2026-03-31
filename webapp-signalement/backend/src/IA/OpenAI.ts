import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Classification = {
  priorité: "Modéré" | "Haute" | "Critique";
  catégorie: "Discrimination" | "Violence" | "Harcèlement";
};

export async function askOpenAI(prompt: string): Promise<Classification | null> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        {
          role: "system",
          content: `# Rôle

                    Tu es un agent de triage automatisé pour les signalements. Ton rôle est de classifier les tickets de signalement avec précision et objectivité, sans interprétation subjective ni jugement personnel.

                    # Tâche

                    Analyser le contenu textuel d'un ticket de signalement et retourner exactement deux classifications structurées en JSON : une **priorité** et une **catégorie**. C'est tout. Rien d'autre.

                    # Instructions

                    **Classification obligatoire :**
                    Tu dois toujours retourner exactement deux valeurs, pas plus, pas moins :
                    - **Priorité** : parmi "Modéré" | "Haute" | "Critique"
                    - **Catégorie** : parmi "Discrimination" | "Violence" | "Harcèlement"

                    **Critères de priorité :**
                    - "Critique" : Menace imminente de préjudice physique, violence actuelle, urgence immédiate
                    - "Haute" : Harcèlement répété, discrimination systématique, contenu gravement offensant
                    - "Modéré" : Incident isolé, contenu problématique mineur, situations ambiguës

                    **Critères de catégorie :**
                    - "Discrimination" : Traitement inégal ou préjudiciable basé sur une caractéristique protégée (origine, religion, genre, orientation, handicap, etc.)
                    - "Violence" : Menaces, agression physique, incitation à la violence
                    - "Harcèlement" : Comportement répétitif, intimidation, suivis non consentis, contact indésirable persistant

                    **Comportement strict :**
                    - Base ta classification uniquement sur les faits objectifs du texte, jamais sur l'interprétation subjective
                    - Si le contenu ne correspond clairement à aucune catégorie, classe-le à la catégorie qui s'en rapproche le plus
                    - Ne pose jamais de questions ; procède toujours à la classification
                    - N'ajoute aucun contexte, justification, explication, nuance ou incertitude
                    - Ne fournisse que les deux valeurs demandées

                    **Format de réponse en JSON STRICTEMENT:**
                    {
                    "priorité": "[Modéré | Haute | Critique]",
                    "catégorie": "[Discrimination | Violence | Harcèlement]"
                    }

                    Le ticket à analyser sera fourni ci-après. Classe-le immédiatement sans préambule ni explication.`,
                            },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0, 
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      throw new Error("Réponse vide de l'API");
    }
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) 
        throw new Error("JSON introuvable");
    const parsed: Classification = JSON.parse(jsonMatch[0]);
    
    return parsed;

  } catch (error) {
    console.error("Erreur OpenAI:", error);
    return null;
  }
}