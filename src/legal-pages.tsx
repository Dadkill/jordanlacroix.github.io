import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

const email = (
  <a href="mailto:contact@jordanlacroix.fr">contact@jordanlacroix.fr</a>
);

export const legalPages = [
  {
    file: 'mentions-legales.html',
    title: 'Mentions légales',
    description:
      'Édition, hébergement et crédits du site personnel de Jordan Lacroix.',
  },
  {
    file: 'confidentialite.html',
    title: 'Confidentialité',
    description: 'Informations sur la navigation et l’hébergement du site.',
  },
];

function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function LegalPage({ file }: { file: string }) {
  const privacy = file === 'confidentialite.html';
  const page = legalPages.find((item) => item.file === file);
  if (!page) throw new Error('Unknown legal page');
  return (
    <>
      <a className="skip-link" href="#informations">
        Aller au contenu
      </a>
      <header className="legal-header wrap">
        <a className="brand" href="/" aria-label="Jordan Lacroix, accueil">
          JL
          <span className="brand-dot" />
        </a>
        <a className="legal-back" href="/">
          <ArrowLeft size={18} aria-hidden="true" />
          Retour au portfolio
        </a>
      </header>
      <main className="legal-main wrap" id="informations" tabIndex={-1}>
        <div className="legal-intro">
          <p className="legal-eyebrow">Jordan Lacroix · jordanlacroix.fr</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <p className="legal-date">
            Mise à jour : <time dateTime="2026-09-20">20 septembre 2026</time>
          </p>
        </div>
        <div className="legal-content">
          {privacy ? (
            <>
              <LegalSection title="Navigation et hébergement">
                <p>
                  Aucun outil de mesure d’audience, pixel publicitaire ou
                  formulaire de collecte n’est intégré au site. Les polices et
                  les images sont servies avec ses fichiers. Le site ne dépose
                  pas de cookie de suivi.
                </p>
                <p>
                  GitHub Pages enregistre les adresses IP des visiteurs à des
                  fins de sécurité. Ces journaux sont gérés par GitHub et ne
                  constituent pas un tableau de suivi des visiteurs mis à ma
                  disposition par le site.
                </p>
                <p>
                  GitHub peut traiter des données en dehors de l’Espace
                  économique européen. Les finalités, règles de conservation,
                  mécanismes de transfert et modalités d’exercice de vos droits
                  auprès de GitHub sont décrits dans sa{' '}
                  <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">
                    politique de confidentialité
                  </a>
                  . La{' '}
                  <a href="https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages">
                    documentation GitHub Pages
                  </a>{' '}
                  précise le traitement des adresses IP.
                </p>
              </LegalSection>
              <LegalSection title="Liens vers d’autres sites">
                <p>
                  Le lien LinkedIn et les références externes vous dirigent vers
                  des services disposant de leurs propres règles de
                  confidentialité. Aucune intégration LinkedIn ne se charge
                  automatiquement sur ce portfolio.
                </p>
              </LegalSection>
            </>
          ) : (
            <>
              <LegalSection title="Édition du site">
                <p>
                  Ce site est édité par Jordan Lacroix pour présenter son
                  parcours professionnel, ses compétences et son CV. Il s’agit
                  d’un portfolio strictement personnel, sans vente ni
                  proposition de prestations indépendantes.
                </p>
                <p>
                  Responsable de la publication : Jordan Lacroix.
                  <br />
                  Contact : {email}.
                </p>
                <p>
                  Les contenus sont publiés à titre personnel et n’engagent pas
                  les employeurs mentionnés. Ce site n’est pas un service
                  officiel d’ECG, d’Airbus Helicopters ou de HighCo.
                </p>
              </LegalSection>
              <LegalSection title="Hébergement">
                <p>
                  Le site est hébergé par GitHub Pages, un service de GitHub,
                  Inc.
                </p>
                <address>
                  GitHub, Inc.
                  <br />
                  88 Colin P. Kelly Jr. Street
                  <br />
                  San Francisco, CA 94107
                  <br />
                  États-Unis
                </address>
                <p>
                  <a href="https://support.github.com/">
                    Contacter l’hébergeur
                  </a>{' '}
                  ·{' '}
                  <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">
                    Informations sur GitHub et ses coordonnées
                  </a>
                </p>
              </LegalSection>
              <LegalSection title="Contenus et crédits">
                <p>
                  Le portrait, le CV et les textes présentent le parcours de
                  Jordan Lacroix. Pour une demande de réutilisation de ces
                  éléments, merci de prendre contact à l’adresse indiquée
                  ci-dessus.
                </p>
                <p>
                  Les noms et logos d’ECG, Airbus et HighCo sont utilisés pour
                  identifier les expériences professionnelles. Ils appartiennent
                  à leurs titulaires et leur présence ne constitue pas une
                  affiliation officielle du site.
                </p>
                <p>
                  Les typographies Manrope et Syne sont distribuées sous licence
                  SIL Open Font License. Les icônes proviennent de Lucide. Les
                  licences des polices et les sources des logos sont disponibles
                  dans le{' '}
                  <a href="https://github.com/Dadkill/jordanlacroix.github.io">
                    dépôt du site
                  </a>
                  .
                </p>
              </LegalSection>
              <LegalSection title="Données personnelles">
                <p>
                  Les informations relatives à la navigation et à l’hébergement
                  sont présentées sur la page{' '}
                  <a href="/confidentialite.html">Confidentialité</a>.
                </p>
              </LegalSection>
              <LegalSection title="Signaler une erreur">
                <p>
                  Pour signaler une information inexacte, un lien défectueux ou
                  une difficulté d’accès, vous pouvez écrire à {email} en
                  indiquant la page concernée.
                </p>
              </LegalSection>
            </>
          )}
        </div>
      </main>
      <footer className="legal-footer wrap">
        <a href="/">Retour au portfolio</a>
        <nav aria-label="Informations légales">
          {legalPages.map((item) => (
            <a
              key={item.file}
              href={'/' + item.file}
              aria-current={item.file === file ? 'page' : undefined}
            >
              {item.title}
            </a>
          ))}
        </nav>
      </footer>
    </>
  );
}
