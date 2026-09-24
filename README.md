# Dylan J. Gerrits · CV interactif

Site statique, zéro dépendance, zéro build. Ouvrir `index.html` suffit : il redirige vers la version en ligne (`V1/` pour l'instant).

Trois versions partagent le même contenu :

- `V1/` globe et timeline
- `V2/` Carnet de route, prototype figé comme référence
- `V3/` Carnet de route en développement (spécification dans `.refinement/v3-carnet-de-route/`)

## Mettre à jour

Tout le contenu est dans `shared/data.js`.

- Nouvelle expérience : ajouter un objet dans `stops` (ordre chronologique). `coords` = `[longitude, latitude]`. Plusieurs postes au même endroit : plusieurs `entries` dans un même stop.
- `summary`, `bullets`, `tags` sont optionnels.
- Compétences, langues, formations, certifications, stats : sections dédiées du même fichier.

`V1/land.js` (carte) est généré une fois par `node tools/build-land.mjs [pas_en_degrés]`, inutile d'y toucher.

## Déployer

- GitHub Pages : pousser le dossier, Settings > Pages > Deploy from branch > `/ (root)`.
- Cloudflare Pages : connecter le repo, build command vide, output directory `/`.
- Netlify, Vercel, S3 : glisser-déposer le dossier.

## Fichiers

- `index.html` redirection vers la version en ligne
- `shared/data.js` contenu
- `V1/index.html` structure
- `V1/style.css` styles et animations CSS
- `V1/app.js` rendu du contenu, globe canvas, animations au scroll
- `V1/land.js` masque des continents (Natural Earth 110m, domaine public)

## V2 et V3 · Carnet de route (`V2/`, `V3/`)

Une autre identité : une silhouette marche sur une planète en papier découpé ; le scroll fait tourner le monde, chaque escale fait lever sa skyline. Ouvrir `V2/index.html` ou `V3/index.html`. Même `shared/data.js` que la V1. Les deux dossiers ont la même structure ; la V3 part d'une copie de la V2.

- Narration : champ `story` de chaque stop, plus `prologue` et `epilogue` dans `shared/data.js`.
- Décors : `skylines.js`, une scène par lieu (clé = `place`, `online` pour les formations sans coordonnées), trois plans (far, mid, near) et une palette par région.
- Moteur : `app.js` (SVG, sans dépendance). Les décors se replient en quittant une escale et se déplient à l'arrivée (pop-up). Flèches gauche / droite pour passer d'une escale à l'autre.
- Personnage : `walker.js`, stickman dont l'allure suit la vitesse (arrêt, marche, course, sprint). Banc d'essai : `lab.html`.
