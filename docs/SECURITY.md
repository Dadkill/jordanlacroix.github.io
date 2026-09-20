# Sécurité

## Périmètre

Le site est publié sur GitHub Pages à l’adresse https://jordanlacroix.fr/. Il contient du HTML pré-rendu, du CSS, du JavaScript et des ressources publiques. Il n’expose ni serveur applicatif, ni authentification, ni formulaire de collecte.

Le CV, le portrait, les textes et le dépôt GitHub sont publics. Les échanges adressés par email sont traités séparément du site. GitHub conserve des journaux techniques, dont les adresses IP des visiteurs, à des fins de sécurité : l’absence d’analytics ne signifie pas l’absence de traitements chez l’hébergeur.

## Mesures dans le dépôt

- Versions exactes des dépendances, verrouillage pnpm et installation CI avec `--frozen-lockfile`.
- Actions GitHub épinglées par SHA complet.
- Compilation avec droits de lecture ; permissions Pages et OIDC limitées au job de publication.
- Contrôles sur les pull requests ; déploiement réservé à `main`, sans `pull_request_target`.
- Audit des dépendances dans la CI et propositions de mise à jour hebdomadaires via Dependabot.
- CSP de production : scripts locaux, sans JavaScript en ligne ni `eval` ; objets et formulaires bloqués ; ressources et connexions locales.
- Polices et images hébergées avec le site, sans source maps de production.
- Liens ouvrant un nouvel onglet protégés par `noopener noreferrer`.
- Vérification des liens locaux et des fichiers publiés ; exclusion des sources, secrets et artefacts de travail.
- Le CV publié fait l’objet d’un contrôle de présence et de nombre de pages.

## Limites de GitHub Pages

La CSP est fournie par une balise HTML `meta`. Les directives qui exigent un en-tête HTTP, dont `frame-ancestors`, ne peuvent pas être imposées ainsi. GitHub Pages n’applique pas de fichier `_headers` personnalisé. HTTPS est géré par la plateforme.

Les styles en ligne restent autorisés pour les interactions visuelles. Les protections des branches, les droits des comptes et la vérification de propriété du domaine doivent être contrôlés dans les réglages GitHub : leur activation ne peut pas être déduite de ce dépôt.

## Maintenance et signalement

`pnpm check` vérifie le projet et les fichiers compilés. `pnpm audit` interroge les avis de sécurité disponibles au moment de son exécution ; un résultat sans alerte n’est pas une garantie d’absence de vulnérabilité.

Signaler un problème à **contact@jordanlacroix.fr**, avec la page concernée et les étapes de reproduction. Ne pas publier de secret ni de donnée personnelle dans une issue publique.

Les contrôles du projet ne constituent pas un audit d’intrusion de GitHub, du DNS, de la messagerie ou du poste utilisateur.

## Références

- [Sécurité des workflows GitHub](https://docs.github.com/en/actions/reference/security/secure-use)
- [Traitement des adresses IP par GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
