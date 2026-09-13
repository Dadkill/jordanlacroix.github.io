# Jordan Lacroix

Portfolio professionnel statique, prêt pour **GitHub Pages** : `jordanlacroix.github.io`, puis `jordanlacroix.fr`.

La racine de ce dossier est celle du dépôt Git. L’ancien projet Sites, les versions précédentes et les fichiers de travail sont conservés dans `.local-archive/`, exclu de Git.

## Publier

1. Créer le dépôt GitHub **`jordanlacroix.github.io`** sur le compte **`jordanlacroix`**. Ce nom de compte doit correspondre à l’adresse souhaitée.
2. Envoyer le contenu de ce dépôt, avec les dossiers cachés `.github/` et le fichier `pnpm-lock.yaml`, sur sa branche `main`.
3. Dans **Settings → Pages → Build and deployment**, choisir **GitHub Actions**.
4. Le workflow contrôle les types, le code, les animations, la compilation et les dépendances, puis publie **uniquement `dist/`**.
5. Suivre [la configuration du domaine et du DNS](docs/DEPLOYMENT.md).

Le dépôt GitHub distant et le DNS ne sont pas modifiés par ces fichiers. L’ancienne adresse Sites conserve sa précédente version.

Une fois le dépôt distant créé vide, sans README ajouté par GitHub :

```sh
git remote add origin https://github.com/jordanlacroix/jordanlacroix.github.io.git
git push -u origin main
```

Ces commandes supposent que le dépôt appartient bien au compte `jordanlacroix` et que Git est authentifié avec ce compte.

## Deux fichiers index, deux usages

- **`index.html`** à la racine : point d’entrée source de Vite.
- **`dist/index.html`** après compilation : véritable page HTML complète, avec le contenu pré-rendu, les liens et les ressources. C’est le fichier servi par GitHub Pages.

Le site ne dépend d’aucun serveur Node, Worker Cloudflare, service Sites ou compte OpenAI pour fonctionner. Le pré-rendu React s’exécute seulement pendant la compilation. La page demeure lisible sans JavaScript ; les animations et les changements d’onglet sont activés ensuite dans le navigateur.

## Travailler en local

Node.js 24 et pnpm 11.19.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm check
pnpm preview
```

`pnpm check` vérifie les types, l’analyse statique, les tests de mouvement, la compilation et les fichiers publiables. `pnpm preview` sert le résultat compilé à l’adresse indiquée dans le terminal. Ne pas ouvrir le fichier source par double-clic : les modules JavaScript nécessitent un serveur HTTP.

## Organisation

```text
.github/         Publication GitHub Pages et mises à jour proposées
src/             Portfolio React, animations, styles et composants
public/          CV PDF, portrait, logos, polices, CNAME, robots et sitemap
scripts/         Pré-rendu et contrôles automatiques
cv/internal/     Générateur du CV et polices intégrées
docs/            Guide GitHub/DNS, sécurité et sources des logos
index.html       Point d’entrée du site
dist/            Résultat compilé, ignoré par Git
```

Modifier les textes dans `src/App.tsx`, les couleurs dans `src/index.css`, et le mouvement dans `src/data-sculpture.tsx` / `src/particle-motion.ts`. Le CV publié est `public/CV-Jordan-Lacroix.pdf`.

Le CV est fourni sur une page. Pour le régénérer, Python avec `reportlab` et `pypdf` suffit : `python cv/internal/build_cv_reference.py`. Le générateur contrôle le nombre de pages et les contenus essentiels ; un rendu visuel reste nécessaire après un changement de mise en page. Python n’est pas requis pour construire ou publier le site.

Les polices Manrope et Syne sont locales ; leurs licences accompagnent les fichiers. Les noms et logos d’entreprises restent la propriété de leurs titulaires. Aucun résultat professionnel chiffré n’a été inventé.

Les décisions et limites de sécurité figurent dans [docs/SECURITY.md](docs/SECURITY.md).
