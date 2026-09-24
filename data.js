// All page content lives here: edit this file to update the site, no build step needed.
// Each stop of the journey is a location on the globe; stops are shown in the order listed (oldest first).
// story: '…' is the line narrated above the scene in the V2 walk (v2/).
// A stop with type: 'formation' is a diploma training; without coords it is online, and only the places in remoteFrom are shown, as yellow dots.
// An entry can add remote: true to be flagged as done remotely on the card, and context: '…' for a framing label that is not a skill (e.g. a visa).
// Remote missions add remoteFrom: ['Lieu', longitude, latitude], or a list of them, the places I worked from; add remoteRoute: true when the list is an itinerary in order; 'sur place' in the list marks time spent on site.
window.PROFILE = {
  name: 'Dylan J. Gerrits',
  title: 'Ingénieur polyvalent en architecture et développement de systèmes d’information et d’outillage IA',
  roles: ['Développeur', 'Architecte logiciel', 'Formateur', 'Tuteur'],
  location: 'Saint-Herblain, France',
  coords: [-1.65, 47.21], // Shown in the hero.
  tagline: 'Véritable couteau franco-suisse, plus de dix ans à concevoir, développer et mettre en production des solutions logicielles, de l’architecture au déploiement.',
  links: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/dyrits' },
    { label: 'Email', url: 'mailto:dylangerrits+linkedin@etik.com' },
  ],
  stats: [
    { value: 10, suffix: '+ ans', label: 'd’expérience' },
    { value: 36, suffix: '', label: 'pays visités ou habités' },
  ],

  about: [
    'Appétence égale pour le front-end et le back-end, avec une maîtrise solide d’un large éventail de technologies et de frameworks.',
    'Adaptabilité et formation continue comme principes : veille active, nouveaux frameworks, défis DevOps, architecture logicielle.',
    'Intégration de l’IA dans les pratiques de développement et l’outillage interne, pour accélérer la livraison et automatiser les tâches récurrentes.',
    'Passionné par la transmission : formation et mentorat pour faire monter en compétences équipes et apprentis.',
  ],


  // Narration for the V2 walk (v2/): the opening and closing pages; each stop also carries its own story line.
  prologue: { title: 'Carnet de route', text: 'Plus de dix ans de code, trente-six pays, un sac à dos. Voici le chemin, escale par escale.', hint: 'Faites défiler pour marcher' },
  epilogue: { title: 'Prochaine escale ?', text: 'Le carnet reste ouvert. La suite s’écrit peut-être avec vous.' },

  stops: [
    {
      from: '2011-03',
      story: 'Tout commence à Lyon, loin du code : démarchage, distribution, inventaires. Des premiers emplois pour apprendre à parler aux gens.', place: 'Lyon', country: 'France', coords: [4.84, 45.76], period: '2011 – 2012',
      entries: [
        { company: 'INTERVALLES', role: 'Démarcheur / Distributeur', dates: 'mars 2011 – juin 2012' },
        { company: 'RGIS', role: 'Inventoriste', dates: 'mars 2011 – avril 2011' },
      ],
    },
    {
      from: '2013-06',
      story: 'Nantes, Accenture. Trois ans de développement sur SAP pour des fournisseurs d’énergie, puis une équipe à coordonner. Le plus gros chantier : refacturer 30 millions de comptes.', place: 'Nantes', country: 'France', coords: [-1.55, 47.22], period: '2013 – 2016',
      entries: [{
        company: 'Accenture', role: 'Développeur | Chef d’équipe', dates: 'juin 2013 – août 2016',
        summary: 'Développement, maintenance applicative et coordination pour des fournisseurs d’énergie, en environnements SAP IS-U et CRM.',
        bullets: [
          'Pilotage d’un traitement de refacturation de 30 millions de comptes clients.',
          'Coordination de l’équipe, priorisation avec les clients, suivi des livrables.',
          'Maintenance des scripts et processus d’injection de données.',
          'Automatisation des rapports d’activité quotidiens.',
        ],
      }],
    },
    {
      from: '2016-11',
      story: 'Je range le costume. Visa vacances-travail en poche, direction l’Australie-Occidentale, à arpenter des champs à la recherche d’une mauvaise herbe.', place: 'Merredin', country: 'Australie', coords: [118.28, -31.48], period: '2016',
      entries: [{
        company: 'CWC Professional AG Contractors', role: 'Contractant agricole', dates: 'nov. 2016 – déc. 2016',
        summary: 'Détection de Chondrilla juncea dans les champs, dans le cadre d’un visa vacances-travail.',
        context: 'Visa vacances-travail',
      }],
    },
    {
      from: '2017-01',
      story: 'Perth, sept mois en cuisine. Le rythme d’un service, la brigade, les coups de feu.', place: 'Perth', country: 'Australie', coords: [115.86, -31.95], period: '2017',
      entries: [{
        company: 'Gramercy Bar & Kitchen', role: 'Commis de cuisine', dates: 'janv. 2017 – juil. 2017',
        context: 'Visa vacances-travail',
      }],
    },
    {
      from: '2017-09',
      story: 'Cap à l’est, jusqu’à Dubbo : marquage de bovins et d’ovins, au milieu des eucalyptus.', place: 'Dubbo', country: 'Australie', coords: [148.6, -32.25], period: '2017',
      entries: [{
        company: 'J.A. Long & L.A. Cameron', role: 'Contractant agricole', dates: 'sept. 2017 – nov. 2017',
        summary: 'Marquage bovin et ovin.',
        context: 'Visa vacances-travail',
      }],
    },
    {
      from: '2017-11',
      story: 'À Bali, le code revient. Premier client en freelance : le site d’un menuisier, avec sa galerie et son devis automatisé.', place: 'Ubud', country: 'Indonésie', coords: [115.26, -8.51], period: '2017',
      entries: [{
        company: 'Freelance', role: 'Développeur front-end', dates: 'nov. 2017 – déc. 2017',
        summary: 'Site vitrine pour un menuisier.',
        bullets: [
          'Galerie de réalisations filtrable par projet et matériau.',
          'Formulaire de devis avec estimation préliminaire automatisée.',
        ],
      }],
    },
    {
      from: '2018-02',
      story: 'Une plateforme de réservation pour une agence de Penang, codée sur la route, de Munich à Bangkok.', place: 'George Town', country: 'Malaisie', coords: [100.33, 5.41], remoteFrom: [
        ['Munich, Allemagne', 11.58, 48.14], ['Prague, Tchéquie', 14.42, 50.09], ['Vienne, Autriche', 16.37, 48.21], ['Bratislava, Slovaquie', 17.11, 48.15],
        ['Budapest, Hongrie', 19.04, 47.5], ['Sofia, Bulgarie', 23.32, 42.7], ['Bangkok, Thaïlande', 100.5, 13.75],
      ], remoteRoute: true, period: '2018',
      entries: [{
        company: 'Freelance', role: 'Développeur front-end', dates: 'fév. 2018 – avr. 2018',
        summary: 'Plateforme de réservation d’activités pour une agence touristique et deux prestataires.',
        bullets: [
          'Interfaces de réservation et paiement en ligne.',
          'Espace opérateurs pour gérer le catalogue d’activités.',
          'Interface bilingue anglais / malais.',
        ],
      }],
    },
    {
      from: '2018-05',
      story: 'Taïwan : le site d’un hôtel, son calendrier de disponibilités et son paiement en ligne.', place: 'Taichung', country: 'Taïwan', coords: [120.68, 24.15], period: '2018',
      entries: [{
        company: 'Freelance', role: 'Développeur front-end', dates: 'mai 2018 – juin 2018',
        summary: 'Site web d’un hôtel et son parcours de réservation.',
        bullets: [
          'Calendrier interactif des disponibilités.',
          'Parcours de paiement en ligne.',
          'Galerie photo filtrable par type de chambre.',
        ],
      }],
    },
    {
      from: '2018-09',
      story: 'Kuala Lumpur, et un projet qui compte : une API qui oriente les ambulances selon la spécialité, la distance et le trafic.', place: 'Kuala Lumpur', country: 'Malaisie', coords: [101.69, 3.14], remoteFrom: ['Langkawi, Malaisie', 99.73, 6.35], period: '2018',
      entries: [{
        company: 'Freelance', role: 'Développeur back-end', dates: 'sept. 2018 – déc. 2018',
        summary: 'API de géolocalisation et d’aide à l’orientation pour une société d’ambulances.',
        bullets: [
          'Calcul d’itinéraires selon spécialité médicale, distance et trafic.',
          'Priorisation des urgences selon la gravité.',
          'Intégration aux systèmes hospitaliers (lits, équipements).',
          'CI/CD avec GitLab, Docker et Amazon EC2.',
        ],
      }],
    },
    {
      from: '2019-01',
      story: 'Malacca, depuis la France cette fois : le front d’une application de gestion budgétaire, en serverless.', place: 'Malacca', country: 'Malaisie', coords: [102.25, 2.19], remoteFrom: [['Die, France', 5.37, 44.75], ['Lyon, France', 4.84, 45.76], ['Nantes, France', -1.55, 47.22]], period: '2019',
      entries: [{
        company: 'Freelance', role: '(Lead) Développeur front-end', dates: 'janv. 2019 – juin 2019',
        summary: 'Front-end d’une application serverless de gestion budgétaire pour un indépendant.',
        bullets: [
          'Tableaux de bord et visualisations revenus / dépenses.',
          'Catégories et dépenses récurrentes.',
          'Exports CSV filtrables et personnalisables.',
        ],
      }],
    },
    {
      from: '2019-11',
      story: 'Retour à Nantes, sur le tarmac : deux mois comme agent de trafic à l’aéroport.', place: 'Bouguenais', country: 'France', coords: [-1.62, 47.18], period: '2019',
      entries: [{ company: 'AviaPartner Nantes-Atlantique', role: 'Agent de trafic', dates: 'nov. 2019 – déc. 2019' }],
    },
    {
      from: '2020-02',
      story: 'Kuala Lumpur encore, à distance : un chatbot de support adossé à plus de 500 questions fréquentes.', place: 'Kuala Lumpur', country: 'Malaisie', coords: [101.69, 3.14], remoteFrom: ['Nantes, France', -1.55, 47.22], period: '2020',
      entries: [{
        company: 'Freelance', role: 'Développeur full-stack', dates: 'fév. 2020 – mai 2020',
        summary: 'Outil de support client automatisé pour une plateforme multiservice.',
        bullets: [
          'Chatbot adossé à une base de plus de 500 questions fréquentes.',
          'Interface d’administration pour faire vivre la base de connaissances.',
        ],
      }],
    },
    {
      type: 'formation', from: '2020-06',
      story: 'Je mets un titre sur la pratique : développeur web et web mobile, suivi en ligne entre Die, Londres et Istanbul.', place: 'En ligne', label: 'Formation', period: '2020',
      remoteFrom: [['Die, France', 5.37, 44.75], ['Londres, Royaume-Uni', -0.13, 51.51], ['Bucarest, Roumanie', 26.1, 44.43], ['Varna, Bulgarie', 27.91, 43.21], ['Bourgas, Bulgarie', 27.47, 42.51], ['Istanbul, Turquie', 28.98, 41.01], ['Die, France', 5.37, 44.75]], remoteRoute: true,
      entries: [{
        company: 'ENI École Informatique', role: 'Développeur web et web mobile', dates: 'juin 2020 – nov. 2020', remote: true,
        summary: 'Titre professionnel de niveau 5 (Bac+2) : Java, Java EE, PHP et Symfony, SQL Server, JavaScript, Android.',
      }],
    },
    {
      from: '2020-11',
      story: 'The Inspire Academy : une application de cours et de réservation, conçue et livrée en deux semaines.', place: 'Biarritz', country: 'France', coords: [-1.56, 43.48], remoteFrom: [['Istanbul, Turquie', 28.98, 41.01], ['Die, France', 5.37, 44.75]], remoteRoute: true, period: '2020 – 2021',
      entries: [{
        company: 'The Inspire Academy', role: 'Développeur full-stack', dates: 'nov. 2020 – janv. 2021',
        summary: 'Application de vente de cours et de réservation de cours particuliers, conçue et livrée en deux semaines.',
        bullets: [
          'Achats de modules et crédits de réservation.',
          'Gestion des utilisateurs et paiements en ligne.',
          'Blog avec administration et modération.',
          'Contenus interactifs pour l’anglais et l’espagnol.',
        ],
      }],
    },
    {
      from: '2021-02',
      story: 'Istanbul, en lead : une plateforme de vente d’œuvres pour un collectif d’artistes.', place: 'Istanbul', country: 'Turquie', coords: [28.98, 41.01], remoteFrom: [['Die, France', 5.37, 44.75], 'sur place', ['Charm el-Cheikh, Égypte', 34.33, 27.92]], remoteRoute: true, period: '2021',
      entries: [{
        company: 'Freelance', role: '(Lead) Développeur full-stack', dates: 'fév. 2021 – juin 2021',
        summary: 'Plateforme de vente d’œuvres d’art pour un collectif d’artistes.',
        bullets: [
          'Parcours d’achat direct et d’offre négociable.',
          'Impressions déclinées en formats et supports.',
          'Paiements multidevises, remboursements, paiements échelonnés.',
        ],
      }],
    },
    {
      type: 'formation', from: '2021-06',
      story: 'Un an pour passer architecte : le titre d’expert en architecture logicielle, suivi du Caire à Lima.', place: 'En ligne', label: 'Formation', period: '2021 – 2022',
      remoteFrom: [['Le Caire, Égypte', 31.24, 30.04], ['Nantes, France', -1.55, 47.22], ['Playa del Carmen, Mexique', -87.07, 20.63], ['Bogota, Colombie', -74.07, 4.71], ['Lima, Pérou', -77.04, -12.05]], remoteRoute: true,
      entries: [{
        company: 'OpenClassrooms', role: 'Expert en développement logiciel, architecture logicielle', dates: 'juin 2021 – juin 2022', remote: true,
        summary: 'Titre de niveau 7 (Bac+5) : analyse et conception d’architectures logicielles, validation de solutions, coordination d’équipe, relation client et parties prenantes.',
      }],
    },
    {
      from: '2022-05',
      story: 'Lima, premier cadrage d’architecte : le MVP d’un assureur, de l’architecture cible jusqu’au budget.', place: 'Lima', country: 'Pérou', coords: [-77.04, -12.05], period: '2022',
      entries: [{
        company: 'Freelance', role: 'Architecte logiciel', dates: 'mai 2022 – juil. 2022',
        summary: 'Cadrage technique d’un MVP pour une société d’assurance.',
        bullets: [
          'Architecture cible documentée, pensée performance et évolutivité.',
          'Spécifications techniques : flux, modèles de données, interfaces.',
          'Estimation des charges, planning et budget complet.',
        ],
      }],
    },
    {
      from: '2022-08',
      story: 'Retour à Lyon, dix ans après. Développeur full-stack sénior chez Rubrash : deux produits, du rendu serveur aux appels vidéo.', place: 'Lyon', country: 'France', coords: [4.84, 45.76], period: '2022 – 2023',
      entries: [{
        company: 'Rubrash · Working in Lyon', role: 'Développeur full-stack sénior', dates: 'août 2022 – mars 2023',
        summary: 'Deux produits : une plateforme de contenus pour une société de gestion de patrimoine et une application logistique pour la grande distribution.',
        bullets: [
          'Web app SSR, back-office de contenus et majeure partie de l’app mobile.',
          'Messagerie instantanée et appels vidéo web et mobile.',
          'API REST, modèles de données, types front générés depuis le back.',
          'Reprise de la coordination projet avec le client.',
        ],
      }],
    },
    {
      from: '2023-03',
      story: 'À mon tour de transmettre : mentorat, formation, jurys. Une dizaine d’apprenants menés jusqu’au titre.', place: 'Nantes', country: 'France', coords: [-1.55, 47.22], period: '2023 – aujourd’hui',
      label: 'Transmission',
      entries: [
        {
          company: 'OpenClassrooms', role: 'Mentor et évaluateur', dates: 'mars 2023 – aujourd’hui', remote: true,
          summary: 'Mentorat hebdomadaire et évaluation des parcours développement et intégration web. Une dizaine d’apprenants menés jusqu’au titre.',
        },
        {
          company: 'École O’clock', role: 'Formateur · Tuteur pédagogique', dates: 'mars 2023 – fév. 2025', remote: true,
          summary: 'Modules back, front, mobile, GraphQL, microservices, sécurité, conteneurisation, CI/CD et Docker avancé.',
        },
        {
          company: 'EPSI', role: 'Formateur · Tuteur · Jury', dates: 'janv. 2025 – juil. 2025',
          summary: 'Module CI/CD, tutorat de mémoires et jurys du titre Expert en informatique et SI (RNCP).',
        },
      ],
    },
    {
      from: '2025-03',
      story: 'HiPay, le paiement : APIs, encaissement sur mobile, clean architecture, et l’IA dans les outils de l’équipe.', place: 'Nantes', country: 'France', coords: [-1.55, 47.22], period: '2025 – aujourd’hui',
      label: 'Paiement',
      entries: [{
        company: 'HiPay', role: 'Ingénieur logiciel sénior', dates: 'mars 2025 – aujourd’hui',
        summary: 'APIs et application mobile dans le paiement, dont une solution SoftPOS d’encaissement sur terminaux mobiles.',
        bullets: [
          'Architecture logicielle selon la clean architecture.',
          'APIs et services serverless Node.js / Express sur Google Cloud.',
          'Infrastructure Terraform, livraisons GitLab CI.',
          'App React Native / Expo, notifications Firebase Cloud Messaging.',
          'Bibliothèque QA réutilisable pour les tests E2E.',
          'Intégration de l’IA dans les pratiques et outils internes.',
        ],
      }],
    },
    {
      from: '2026-01',
      story: 'En parallèle, tout le back-end d’une plateforme qui relie artistes et clients, en production pour 5 € par mois.', place: 'Paris', country: 'France', coords: [2.35, 48.86], remoteFrom: ['Saint-Herblain, France', -1.65, 47.21], period: '2026',
      label: 'Freelance',
      entries: [{
        company: 'Freelance', role: '(Lead) Architecte logiciel et développeur back-end', dates: 'janv. 2026 – juin 2026',
        summary: 'Tout le back-end d’une plateforme communautaire reliant artistes et clients, jusqu’à la production.',
        bullets: [
          'API Elysia + TypeScript sur Cloudflare Workers, client typé Eden Treaty.',
          'Supabase + réplique de lecture Cloudflare D1, resynchronisation toutes les 6 h.',
          'Supabase Auth, RLS, chat temps réel et notifications.',
          'Images sur R2, cartes Open Graph générées avec Satori + WebAssembly.',
          'En production pour 5 €/mois d’infrastructure.',
        ],
      }],
    },
  ],


  skills: {
    'Langages': ['TypeScript', 'Java', 'C#', 'Python', 'Go', 'Rust'],
    'Back-end': ['Node.js', 'Elysia', 'Express', 'REST', 'GraphQL', 'Microservices', 'Clean architecture'],
    'Cloud & DevOps': ['Cloudflare Workers', 'D1', 'R2', 'Google Cloud', 'AWS EC2', 'Terraform', 'Docker', 'GitLab CI'],
    'Data': ['Supabase', 'PostgreSQL', 'RLS', 'Realtime'],
    'Front & mobile': ['React', 'React Native', 'Expo', 'Vue.js', 'SSR', 'Firebase'],
    'IA & outillage': ['IA dans le cycle de développement', 'Outillage interne', 'Automatisation'],
    'Qualité': ['Tests E2E', 'Code review', 'Mentorat'],
  },

  languages: [
    { name: 'Français', level: 'Natif', value: 100 },
    { name: 'Anglais', level: 'Professionnel complet', value: 90 },
    { name: 'Espagnol', level: 'Notions professionnelles', value: 45 },
  ],

  // The last column lists the certificates or diplomas obtained.
  education: [
    { school: 'OpenClassrooms', what: 'Expert en développement logiciel, architecture logicielle', level: 'Niveau 7 · Bac+5', years: '2021 – 2022', certs: ['Expert en développement logiciel'] },
    { school: 'ENI École Informatique', what: 'Développement web et mobile', level: 'Niveau 5 · Bac+2', years: '2020', certs: ['Développeur web et web mobile'] },
    { school: 'Scrimba', what: 'Développement front-end, intelligence artificielle', years: '2021 – 2026', certs: ['The AI Engineer Path'] },
    { school: 'freeCodeCamp', what: 'Sciences informatiques, développement full-stack', years: '2020 – 2025', certs: ['Responsive Web Design', 'Back End Development and APIs', 'JavaScript Algorithms and Data Structures'] },
    { school: 'Codecademy', what: 'Sciences informatiques, développement full-stack', years: '2020 – 2024', certs: ['Full-Stack Engineer', 'Computer Science'] },
    { school: 'Coursera', what: 'Science des données, intelligence artificielle', years: '2020', certs: ['IBM AI Developer', 'IBM Data Science'] },
  ],
};
