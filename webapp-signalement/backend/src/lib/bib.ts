import crypto from "crypto"

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

export function dechiffrement(hash : any) {
  if (!hash) return null;
    const [ivHex, encryptedText] = hash.split(':');
    const ivBuffer = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}