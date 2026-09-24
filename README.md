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

## V2 · Carnet de route (`v2/`)

Prototype d'une autre identité : une silhouette marche sur une planète en papier découpé ; le scroll fait tourner le monde, chaque escale fait lever sa skyline. Ouvrir `v2/index.html`. Même `data.js` que la V1.

- Narration : champ `story` de chaque stop, plus `prologue` et `epilogue` dans `data.js`.
- Décors : `v2/skylines.js`, une scène par lieu (clé = `place`, `online` pour les formations sans coordonnées), trois plans (far, mid, near) et une palette par région.
- Moteur : `v2/app.js` (SVG, sans dépendance). Les décors se replient en quittant une escale et se déplient à l'arrivée (pop-up). Flèches gauche / droite pour passer d'une escale à l'autre.
- Personnage : `v2/walker.js`, stickman dont l'allure suit la vitesse (arrêt, marche, course, sprint). Banc d'essai : `v2/lab.html`.
