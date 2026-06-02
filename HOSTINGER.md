# Hostinger — dépannage 503 (Service Unavailable)

Un **503** sur `maker-atlas.com` avec en-tête `Server: LiteSpeed` signifie presque toujours : **l’application Node.js derrière le domaine ne tourne pas** (crash, build raté, ou app non redémarrée après un déploiement).

Ce projet est **Next.js 16** : il faut un **hébergement Node.js**, pas seulement des fichiers PHP/HTML statiques.

---

## Checklist rapide (hPanel)

1. **Websites** → ton site → **Node.js** (ou **Advanced** → **Node.js App**).
2. Vérifie que l’app est **Running** — sinon **Restart**.
3. Ouvre les **logs** (stderr) : erreur `ENOMEM`, `Cannot find module`, `EADDRINUSE`, etc.
4. **Version Node** : **20.x ou 22.x** (pas 18 si possible).
5. **Racine du projet** : dossier où il y a `package.json` (clone GitHub).

### Commandes recommandées

| Champ hPanel | Valeur |
|--------------|--------|
| Install | `npm ci` |
| Build | `npm run build` |
| Start | `npm run start` |
| Port | celui indiqué par Hostinger (souvent assigné auto) |

Variables d’environnement :

```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://maker-atlas.com
PORT=3000
```

*(Adapte `PORT` au port imposé par Hostinger.)*

### Build qui plante (mémoire)

Sur offres mutualisées, le build de ~375 pages peut manquer de RAM :

```bash
export NODE_OPTIONS=--max-old-space-size=4096
export NEXT_BUILD_WORKERS=1
npm run build
```

Si le build échoue sur le serveur : **build en local** (`npm run build`), puis envoie sur le serveur au minimum :

- `.next/`
- `node_modules/` (ou `npm ci --omit=dev` sur le serveur)
- `package.json`, `public/`, `content/`

---

## Mode `standalone` (recommandé)

Le repo est configuré avec `output: "standalone"` dans `next.config.ts`.

Après `npm run build` en local :

```bash
# Copier sur le serveur (exemple)
.next/standalone/
.next/static/   → .next/standalone/.next/static/
public/         → .next/standalone/public/
```

Démarrage :

```bash
cd .next/standalone
HOSTNAME=0.0.0.0 PORT=3000 node server.js
```

Dans hPanel, la commande de start peut être :

```bash
node .next/standalone/server.js
```

(avec `cwd` = racine du projet et variables `PORT` / `HOSTNAME`).

---

## Alternative fiable : Vercel (gratuit)

Next.js est fait pour Vercel. Voir `DEPLOY.md` :

1. Import GitHub `G-Hugo/makeratlas`
2. Domaine `maker-atlas.com` dans Vercel → DNS
3. Variable `NEXT_PUBLIC_SITE_URL=https://maker-atlas.com`

Pas de 503 lié à un Node mort sur mutualisé.

---

## Vérifier depuis ton PC

```bash
curl -I https://maker-atlas.com
```

- **307/308** vers `/en` → OK  
- **503** → Node down, suivre cette checklist  
- **Timeout** → DNS / firewall

---

## Domaine

Utilise toujours **maker-atlas.com** (avec tiret).  
`makeratlas.com` sans tiret est un **autre** domaine.
