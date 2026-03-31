import crypto from "crypto"
import fs from 'fs/promises';
import path from 'path';

const algorithm = 'aes-256-cbc';
const key = crypto.createHash('sha256')
  .update(process.env.ENCRYPTION_KEY || 'fallback')
  .digest();

export function hashPassword(password : string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}


export function chiffrement(text: string) {
    if (!text) throw new Error("No text to encrypt");
    
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ":" + encrypted;
}

export function dechiffrement(hash : string) {
  if (!hash) return null;
    const [ivHex, encryptedText] = hash.split(':');
    const ivBuffer = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}




export async function generateLogFile(ligne: string | string[]) {
    const dirPath = './logs';
    const filePath = path.join(dirPath, 'audit-backup.txt');
    
    await fs.mkdir(dirPath, { recursive: true });

    const entete = `--- RAPPORT D'AUDIT DU ${new Date().toLocaleString()} ---\n\n`;
    await fs.writeFile(filePath, entete);

    if (Array.isArray(ligne)) {
        const blocTexte = ligne.map(l => `${l}\n`).join('');
        await fs.appendFile(filePath, blocTexte);
    } else {
        await fs.appendFile(filePath, `${ligne}\n`);
    }
    await fs.appendFile(filePath, "\n--- FIN DU RAPPORT ---\n");

    return filePath;
}