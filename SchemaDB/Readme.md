
# 📘 README — Connexion à la base MySQL (Aiven)

Ce guide explique **pas à pas** comment :

1. Installer et se connecter à **Aiven CLI**
2. Vérifier la présence de **MySQL**
3. Installer / configurer MySQL si nécessaire
4. Se connecter à la base de données MySQL Aiven

---

## 1️⃣ Installer Aiven CLI et se connecter à son compte

### 📦 Installation de Aiven CLI

Aiven CLI s’installe via Python (pip).

```bat
pip install aiven-client
```

Vérifier l’installation :

```bat
avn --version
```

---

### 🔐 Connexion à Aiven

#### Option A — Connexion avec token (recommandé)

```bat
avn user login --token
```

* Entrer votre **email**
* Coller votre **Aiven access token**
* Les credentials sont stockés localement

#### Option B — Connexion avec mot de passe

```bat
avn user login
```

---

### ✅ Vérifier que la connexion fonctionne

```bat
avn project list
avn service list --project <nom-du-projet>
```

> ⚠️ Aiven CLI sert à **gérer les services**, pas à exécuter des requêtes SQL.

---

## 2️⃣ Vérifier si MySQL est déjà installé

Dans un terminal (cmd ou PowerShell) :

```bat
mysql --version
```

OU :

```bat
where mysql
```

### Résultat :

* ✅ MySQL reconnu → passer directement au **point 4**
* ❌ Commande non reconnue → passer au **point 3**

---

## 3️⃣ Installer et configurer MySQL (Windows)

### 📦 Installation de MySQL Client

Installer **MySQL 8.x** (le client suffit, le serveur est optionnel).

Après installation, MySQL se trouve généralement ici :

```
C:\Program Files\MySQL\MySQL Server 8.0\bin
```

---

### 🔧 Ajouter MySQL au PATH

1. **Win + R** → `sysdm.cpl`
2. Onglet **Advanced**
3. **Environment Variables**
4. Dans **System variables** → `Path` → **Edit**
5. **New** → ajouter :

```
C:\Program Files\MySQL\MySQL Server 8.0\bin
```

6. Valider et **redémarrer le terminal**

---

### ✅ Vérification finale

```bat
mysql --version
where mysql
```

---

## 4️⃣ Se connecter à la base MySQL Aiven

### 🔑 Informations de connexion

À récupérer dans **Aiven → Service MySQL → Connection Information** :

* Host
* Port
* User
* Password
* Database

---

### 🔐 Connexion (mode DEV, sans certificat CA)

> ⚠️ SSL chiffré mais sans vérification de certificat
> ✔ Autorisé en développement
> ❌ Non recommandé en production

```bat
mysql ^
  --host=YOUR_HOST ^
  --port=YOUR_PORT ^
  --user=YOUR_USER ^
  --password ^
  --ssl-mode=REQUIRED ^
  YOUR_DATABASE
```

➡️ Le mot de passe est demandé de façon sécurisée.

---

### 🧪 Vérifier que la connexion est OK

```sql
SELECT DATABASE();
SHOW TABLES;
SELECT VERSION();
```


