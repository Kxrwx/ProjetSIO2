import crypto from "crypto"

// Utilitaire : hasher un mot de passe en SHA-256
export function hashPassword(password : string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}