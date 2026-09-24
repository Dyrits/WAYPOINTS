# Dylan J. Gerrits · CV interactif

Site statique, zéro dépendance, zéro build. Ouvrir `index.html` suffit.

## Mettre à jour

Tout le contenu est dans `data.js`.

- Nouvelle expérience : ajouter un objet dans `stops` (ordre chronologique). `coords` = `[longitude, latitude]`. Plusieurs postes au même endroit : plusieurs `entries` dans un même stop.
- `summary`, `bullets`, `tags` sont optionnels.
- Compétences, langues, formations, certifications, stats : sections dédiées du même fichier.

`land.js` (carte) est généré une fois par `node tools/build-land.mjs [pas_en_degrés]`, inutile d'y toucher.

## Déployer

- GitHub Pages : pousser le dossier, Settings > Pages > Deploy from branch > `/ (root)`.
- Cloudflare Pages : connecter le repo, build command vide, output directory `/`.
- Netlify, Vercel, S3 : glisser-déposer le dossier.

## Fichiers

- `index.html` structure
- `style.css` styles et animations CSS
- `app.js` rendu du contenu, globe canvas, animations au scroll
- `data.js` contenu
- `land.js` masque des continents (Natural Earth 110m, domaine public)
