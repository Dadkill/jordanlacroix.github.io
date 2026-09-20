# Hébergement et domaine

Le site public est **https://jordanlacroix.fr/**. Le dépôt est [Dadkill/jordanlacroix.github.io](https://github.com/Dadkill/jordanlacroix.github.io).

## Publication

Le workflow `.github/workflows/pages.yml` vérifie les pull requests et publie les changements de `main` avec GitHub Actions. Seul le contenu compilé de `dist/` est envoyé à GitHub Pages. Le point d’entrée servi est `dist/index.html`.

La configuration Pages du dépôt utilise **GitHub Actions**, le domaine personnalisé **jordanlacroix.fr** et **Enforce HTTPS**. Le workflow utilise le jeton temporaire GitHub ; aucune clé personnelle ne doit être ajoutée aux sources.

Le nom du dépôt n’impose pas un changement de compte : il s’agit d’un site de projet du compte **Dadkill**. Son adresse GitHub par défaut est `https://dadkill.github.io/jordanlacroix.github.io/`. Le site est compilé pour la racine du domaine personnalisé (`base: '/'`), qui reste son adresse de référence.

## Référence DNS pour le site web

| Type | Sous-domaine OVH | Cible |
| --- | --- | --- |
| A | vide (racine) | 185.199.108.153 |
| A | vide (racine) | 185.199.109.153 |
| A | vide (racine) | 185.199.110.153 |
| A | vide (racine) | 185.199.111.153 |
| CNAME | www | dadkill.github.io. |

Le point final du CNAME désigne un nom DNS absolu. La cible est celle du **compte GitHub**, sans nom de dépôt ni préfixe HTTPS.

Cette table sert de référence pour la configuration web ; elle ne remplace pas une sauvegarde de la zone DNS complète.

**Préserver la messagerie OVH MX Plan** : conserver les MX, SPF, DKIM, DMARC, les SRV et les entrées mail, smtp, pop3, imap, autoconfig et autodiscover. Ne pas réinitialiser la zone DNS ni changer les serveurs DNS pour publier une mise à jour du site.

## Domaine et HTTPS

Le domaine est déclaré dans les réglages Pages du dépôt. Avec GitHub Actions, `public/CNAME` ne remplace pas ce réglage. Le certificat HTTPS est géré par GitHub.

La vérification de propriété du domaine s’effectue dans les réglages Pages du compte, avec le TXT fourni par GitHub. Conserver ce TXT une fois la vérification effectuée. Éviter les entrées génériques `*`.

## Contrôles après publication

Vérifier l’accueil en HTTPS, la redirection de www, les liens du menu, les pages légales, le téléchargement du CV et les métadonnées de partage. Les messageries et réseaux sociaux peuvent conserver un aperçu en cache après une publication.

## Références

- [Configuration des domaines personnalisés GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Vérification de propriété du domaine](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [Déploiement statique avec Vite](https://vite.dev/guide/static-deploy)
