# GitHub Pages et jordanlacroix.fr

## Dépôt

L’adresse demandée `jordanlacroix.github.io` exige le compte GitHub `jordanlacroix` et un dépôt de ce même nom. Le projet est prêt pour cette racine et pour le domaine personnalisé, avec `base: '/'`. Si le compte est différent, l’adresse par défaut sera différente ; le domaine personnalisé reste utilisable. [Documentation Vite](https://vite.dev/guide/static-deploy)

Le workflow `.github/workflows/pages.yml` utilise le jeton temporaire fourni par GitHub ; aucune clé personnelle n’est à placer dans les sources. Il teste les pull requests mais ne les déploie pas. La publication est réservée à `main`.

Dans GitHub : **Settings → Pages → Source : GitHub Actions**. Après le premier envoi, surveiller l’onglet Actions. Le workflow publie `dist`, et non les sources. Le fichier d’entrée final est `dist/index.html`. [Création d’un site Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

## Domaine

1. Vérifier la propriété du domaine dans les réglages Pages du compte GitHub, avec l’enregistrement TXT fourni par GitHub.
2. Dans **Settings → Pages → Custom domain**, saisir `jordanlacroix.fr` et enregistrer **avant** de faire pointer le DNS.
3. Chez le fournisseur DNS, utiliser un **ALIAS/ANAME** pour `@` vers `jordanlacroix.github.io`, si disponible. Sinon utiliser les quatre enregistrements **A** ci-dessous.

| Type | Nom | Valeur |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | jordanlacroix.github.io |

Remplacer seulement les anciens enregistrements web qui entrent en conflit. Conserver les enregistrements de messagerie **MX, SPF, DKIM et DMARC**, nécessaires à `contact@jordanlacroix.fr`. Un simple transfert d’URL chez le registrar ne remplace pas cette configuration.

Après validation DNS et émission du certificat, activer **Enforce HTTPS**. GitHub peut prendre jusqu’à 24 heures pour constater les changements DNS. Le fichier `public/CNAME` est fourni pour les hébergements par branche ; avec GitHub Actions, le domaine doit être déclaré dans les réglages Pages et ce fichier ne suffit pas. [Configuration officielle du domaine](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

Ne pas créer d’enregistrement DNS générique `*`. La vérification de propriété protège contre l’utilisation du domaine par un autre compte. [Vérification du domaine](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)

## Alternative : fichiers déjà compilés

Le contenu de `dist/` est autonome. Il peut être placé à la racine d’une branche destinée à Pages, avec `index.html`, les ressources, `.nojekyll` et `CNAME`. Dans ce cas, sélectionner la publication depuis cette branche. Cette méthode nécessite de recopier la compilation à chaque modification ; le workflow automatique est préférable pour maintenir le site.

## Vérification après mise en ligne

Ouvrir le domaine en HTTPS, tester Data / BI / DPO, le lien de contact et le téléchargement du CV. Vérifier également `www.jordanlacroix.fr`. En cas de 404 sur les ressources, vérifier que Pages publie bien le contenu compilé de `dist/`.
