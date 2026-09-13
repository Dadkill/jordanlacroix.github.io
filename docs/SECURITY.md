# Sécurité de la version GitHub Pages

La migration retire Vinext, React Server Components, Wrangler, le parseur `image-size`, les bindings Cloudflare et les fonctions d’authentification Sites. Le site déployé contient uniquement du HTML, CSS, JavaScript, des polices et des documents publics. Aucun serveur applicatif, secret, formulaire de collecte ou proxy d’images n’est nécessaire.

## Mesures intégrées

- Dépendances exactes et fichier de verrouillage pnpm ; installations CI avec `--frozen-lockfile`.
- Actions GitHub identifiées par leur SHA complet, droits de lecture pour la compilation, droits Pages/OIDC seulement pour le job de publication. Aucun déploiement de pull request ni `pull_request_target`.
- Audit des dépendances au niveau élevé et propositions de mise à jour hebdomadaires via Dependabot.
- CSP dans le HTML de production : scripts locaux uniquement, sans JavaScript en ligne ni `eval` ; objets et formulaires interdits, connexions et images locales. Les styles en ligne restent permis pour les interactions CSS.
- Aucune ressource active tierce nécessaire à l’affichage, polices hébergées localement, absence de source maps dans la compilation.
- Liens externes avec `noopener noreferrer`, pas de `dangerouslySetInnerHTML`, aucune donnée personnelle supplémentaire collectée.
- Vérification automatique des fichiers publiés : index complet, ressources présentes, une seule page PDF, pas de `.env`, dépôt Git, sources de serveur ou artefacts de travail.
- Anciennes versions stockées dans `.local-archive/`, exclu du dépôt et de la compilation. Le ZIP des sources n’embarque pas ce dossier.

## Différences avec l’ancienne version

GitHub Pages ne lance pas le proxy de sécurité de la version Sites. Les en-têtes personnalisés de ce proxy ne sont donc plus annoncés comme actifs. La CSP est déclarée par une balise `meta` ; les directives exclusivement HTTP, dont `frame-ancestors`, ne peuvent pas être imposées de cette manière. HTTPS et les en-têtes de la plateforme sont gérés par GitHub. Ne pas ajouter de pseudo-fichier `_headers` en supposant que Pages l’appliquera.

Le CV, le portrait et les textes seront publics lorsque ce site sera activé sur GitHub Pages. La protection privée de Sites n’est pas transférée à GitHub Pages. Aucun changement du DNS ni publication sur GitHub n’a été effectué par la préparation locale.

Les risques de dépendances doivent être réévalués au fil des mises à jour. Les contrôles du projet ne constituent pas un audit d’intrusion de GitHub, du DNS ou du poste utilisateur.

## Contrôle de livraison du 13 septembre 2026

L’audit pnpm ne signale aucune vulnérabilité connue dans le graphe de dépendances de cette version statique. Les types, l’analyse statique, les tests de mouvement, le pré-rendu et les contrôles des fichiers compilés passent. Dans le navigateur, le passage Data / BI / DPO et la pause fonctionnent ; aucune erreur ou alerte n’a été remontée lors de cette vérification. Le CV a été rendu et contrôlé sur une page A4. Le workflow GitHub sera exécuté pour la première fois après l’envoi du dépôt et l’activation de Pages ; il n’a pas encore été exécuté sur GitHub.

[Sécurité des workflows GitHub](https://docs.github.com/en/actions/reference/security/secure-use) · [GitHub Pages](https://docs.github.com/en/pages)
