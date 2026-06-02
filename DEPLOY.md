# Déploiement Maker Atlas

Guide pour mettre le site en ligne sur **Vercel** avec le domaine **makeratlas.com** et une adresse e-mail pro.

## Prérequis

- Dépôt GitHub : https://github.com/G-Hugo/makeratlas
- Compte [Vercel](https://vercel.com) (gratuit pour un projet hobby)
- Accès au registrar du domaine (là où tu as acheté `makeratlas.com`)

---

## 1. GitHub (code source)

Le code est sur la branche `main`. Chaque push déclenche un déploiement si Vercel est connecté.

```bash
git clone https://github.com/G-Hugo/makeratlas.git
cd makeratlas
npm install
npm run build
```

---

## 2. Vercel (hébergement du site)

1. Va sur [vercel.com/new](https://vercel.com/new) et connecte ton compte GitHub.
2. **Import** le dépôt `G-Hugo/makeratlas`.
3. Framework : **Next.js** (détecté automatiquement).
4. **Build command** : `npm run build`
5. **Output** : laisser par défaut (Next.js App Router).
6. **Environment variables** (Settings → Environment Variables) :

| Variable | Exemple | Usage |
|----------|---------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://makeratlas.com` | URLs canoniques, sitemap |
| `NEXT_PUBLIC_LEGAL_EMAIL` | `contact@makeratlas.com` | Mentions légales, contact |
| `NEXT_PUBLIC_LEGAL_PUBLISHER` | `Maker Atlas` | Éditeur du site |
| `NEXT_PUBLIC_LEGAL_NAME` | `Ton nom ou raison sociale` | Mentions légales |
| `NEXT_PUBLIC_LEGAL_ADDRESS` | Adresse postale complète | Obligatoire LCEN |
| `NEXT_PUBLIC_LEGAL_COUNTRY` | `France` | Mentions légales |

7. Déploie. Tu obtiens une URL du type `makeratlas.vercel.app`.

---

## 3. Nom de domaine (makeratlas.com)

### Si le domaine est chez le même registrar que Vercel (ou transféré sur Vercel Domains)

1. Vercel → projet → **Settings** → **Domains** → **Add** → `makeratlas.com` et `www.makeratlas.com`.
2. Suis les instructions DNS proposées par Vercel.

### Si le domaine est ailleurs (OVH, Gandi, Cloudflare, Namecheap, etc.)

Dans Vercel, ajoute `makeratlas.com` et `www.makeratlas.com`. Vercel affiche les enregistrements à créer.

**Option recommandée (apex + www) :**

| Type | Nom | Valeur |
|------|-----|--------|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

*(Vérifie les valeurs exactes dans le panneau Vercel au moment de l’ajout du domaine.)*

**Redirection www :** dans Vercel, définis une redirection `www` → apex (ou l’inverse) pour n’avoir qu’une URL canonique.

**Délai :** propagation DNS souvent 5 min à 48 h.

**HTTPS :** certificat Let’s Encrypt automatique sur Vercel une fois le DNS OK.

---

## 4. E-mail (contact@makeratlas.com)

Le site n’envoie pas de mail tout seul ; il faut un **service mail** sur le domaine.

### Option A : Cloudflare Email Routing (gratuit, simple)

1. Transfère les DNS du domaine vers **Cloudflare** (nameservers).
2. **Email** → **Routing** → crée `contact@makeratlas.com` → redirection vers ta boîte Gmail perso.
3. Tu reçois les mails ; tu réponds depuis Gmail (alias « envoyer en tant que » possible).

### Option B : Google Workspace (~6 €/mois)

1. [workspace.google.com](https://workspace.google.com) → domaine `makeratlas.com`.
2. Ajoute les enregistrements **MX** indiqués par Google chez ton registrar.
3. Boîtes `contact@`, `hello@`, etc.

### Option C : Proton Mail / Zoho / OVH Mail

Même principe : achat ou offre gratuite limitée, puis enregistrements **MX** + parfois **TXT** (SPF, DKIM) pour éviter les spams.

**SPF (exemple si tu forward via un service) :** enregistrement TXT sur `@` :

```txt
v=spf1 include:_spf.google.com ~all
```

(Adapter selon le fournisseur choisi.)

---

## 5. Checklist avant mise en prod

- [ ] `npm run build` OK en local
- [ ] Variables `NEXT_PUBLIC_LEGAL_*` renseignées sur Vercel
- [ ] Pages `/fr/legal`, `/fr/privacy`, `/fr/cookies` relues avec ta vraie adresse
- [ ] Domaine pointé et HTTPS actif
- [ ] `robots.txt` et `sitemap.xml` accessibles (`https://makeratlas.com/sitemap.xml`)
- [ ] Soumettre le sitemap dans [Google Search Console](https://search.google.com/search-console)

---

## 6. Mises à jour du site

```bash
git add .
git commit -m "Description du changement"
git push origin main
```

Vercel rebuild et publie automatiquement (1–3 min).

---

## Support

- Vercel docs : https://vercel.com/docs
- Next.js sur Vercel : https://vercel.com/docs/frameworks/nextjs
