'use client';

import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  ArrowUpRight,
  ArrowDown,
  Download,
  Pause,
  Play,
  ArrowRight,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import DataSculpture, { type Discipline } from './data-sculpture';

const disciplines = [
  {
    key: 'data',
    title: 'Data management',
    short: 'Data',
    points: [
      {
        title: 'Pilotage RM & BI',
        text: 'Piloter le périmètre Data Revenue Management et BI chez ECG, en reliant les priorités de l’équipe aux besoins des métiers.',
      },
      {
        title: 'Gestion des données',
        text: 'Organiser les sujets data avec les équipes concernées, clarifier les besoins et faire avancer les projets dans leur contexte métier.',
      },
      {
        title: 'Culture de la gouvernance',
        text: 'Clarifier les responsabilités, les règles de gestion et les usages pour que les équipes partagent une compréhension commune des données.',
      },
    ],
  },
  {
    key: 'bi',
    title: 'Business Intelligence',
    short: 'BI',
    points: [
      {
        title: 'Tableaux de bord',
        text: 'Concevoir des analyses et des visualisations lisibles avec Tableau et GoogleSQL / BigQuery, à partir des besoins des équipes métier.',
      },
      {
        title: 'Usages & rationalisation',
        text: 'Analyser les usages des contenus BI, identifier les redondances et faire évoluer les reportings selon les besoins des équipes.',
      },
      {
        title: 'Lecture métier',
        text: 'Présenter les résultats et expliquer la lecture des indicateurs pour aider les équipes à comprendre ce que montrent les analyses.',
      },
    ],
  },
  {
    key: 'privacy',
    title: 'Protection des données',
    short: 'DPO',
    points: [
      {
        title: 'Audits des traitements',
        text: 'Coordonner les audits des traitements de données personnelles avec les équipes juridiques et métiers, dans mon rôle de DPO Groupe.',
      },
      {
        title: 'Registre & gouvernance',
        text: 'Structurer le registre des traitements pour documenter les activités concernées et soutenir la gouvernance des données personnelles.',
      },
      {
        title: 'Veille européenne',
        text: 'Suivre les évolutions réglementaires européennes et accompagner les métiers dans la prise en compte opérationnelle des enjeux RGPD.',
      },
    ],
  },
];

export default function Home() {
  const [discipline, setDiscipline] = useState<Discipline>('data');
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(preference.matches);
    sync();
    preference.addEventListener('change', sync);
    return () => preference.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('.reveal'),
    );
    const show = (element: HTMLElement) => {
      element.classList.remove('reveal-pending');
      element.classList.add('reveal-visible');
      element.dataset.revealed = 'true';
    };
    if (
      paused ||
      reducedMotion ||
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      elements.forEach((element) => element.classList.remove('reveal-pending'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.04, rootMargin: '0px 0px -7% 0px' },
    );
    elements.forEach((element) => {
      if (
        element.dataset.revealed === 'true' ||
        element.getBoundingClientRect().top < window.innerHeight * 0.93
      ) {
        show(element);
      } else {
        element.classList.add('reveal-pending');
        observer.observe(element);
      }
    });
    const revealFocused = (event: FocusEvent) => {
      const element = (event.target as Element).closest<HTMLElement>('.reveal');
      if (element) {
        show(element);
        observer.unobserve(element);
      }
    };
    document.addEventListener('focusin', revealFocused);
    return () => {
      observer.disconnect();
      document.removeEventListener('focusin', revealFocused);
      elements.forEach((element) => element.classList.remove('reveal-pending'));
    };
  }, [paused, reducedMotion]);
  const tilt = (event: ReactPointerEvent<HTMLElement>) => {
    if (reducedMotion || paused || event.pointerType === 'touch') return;
    const card = event.currentTarget,
      rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width,
      y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty('--rx', `${(y - 0.5) * -4}deg`);
    card.style.setProperty('--ry', `${(x - 0.5) * 4}deg`);
    card.style.setProperty('--shine-x', `${x * 100}%`);
    card.style.setProperty('--shine-y', `${y * 100}%`);
  };
  const resetTilt = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--rx', '0deg');
    event.currentTarget.style.setProperty('--ry', '0deg');
  };
  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <div className="portfolio" data-paused={paused || reducedMotion}>
        <header className="site-header wrap">
          <a
            className="brand"
            href="#contenu"
            aria-label="Jordan Lacroix, accueil"
          >
            JL
            <span className="brand-dot" />
          </a>
          <span className="header-role">
            Data Team Lead
            <br />
            RM & BI / DPO
          </span>
          <nav aria-label="Navigation principale">
            <a href="#expertises">Expertises</a>
            <a href="#parcours">Parcours</a>
            <a href="#apropos">Profil</a>
          </nav>
          <a
            className="header-mail hover-link"
            href="mailto:contact@jordanlacroix.fr"
          >
            Me contacter <ArrowUpRight size={16} />
          </a>
        </header>
        <main id="contenu">
          <section className="hero wrap" aria-labelledby="hero-title">
            <div className="hero-topline">
              <p>Data, Business Intelligence & protection des données</p>
              <span>Marseille, France</span>
            </div>
            <div className="hero-stage">
              <div className="identity">
                <h1 id="hero-title">
                  <span>JORDAN</span>
                  <span className="name-last">
                    LACROIX<span className="name-period">.</span>
                  </span>
                </h1>
                <div className="intro-line">
                  <span className="intro-rule" />
                  <p>
                    Chez ECG, je pilote le périmètre Data RM & BI. En tant que
                    DPO Groupe, j’accompagne les différents départements dans
                    leur mise en conformité avec le RGPD.
                  </p>
                </div>
                <div className="hero-cta">
                  <a className="round-link" href="#parcours">
                    <span className="circle-arrow">
                      <ArrowDown size={23} />
                    </span>
                    <span>Mon parcours</span>
                  </a>
                  <a
                    className="cv-link hover-link"
                    href="/CV-Jordan-Lacroix.pdf"
                    download
                  >
                    CV <Download size={16} />
                  </a>
                </div>
              </div>
              <div className="sculpture-stage">
                <DataSculpture
                  mode={discipline}
                  paused={paused || reducedMotion}
                />
                <Button
                  className="motion-button"
                  variant="ghost"
                  onClick={() => setPaused((v) => !v)}
                  disabled={reducedMotion}
                  aria-label={
                    paused
                      ? 'Reprendre les animations'
                      : 'Mettre les animations en pause'
                  }
                  aria-pressed={paused || reducedMotion}
                >
                  {paused || reducedMotion ? (
                    <Play size={14} />
                  ) : (
                    <Pause size={14} />
                  )}
                  <span>
                    {reducedMotion
                      ? 'Mouvement réduit'
                      : paused
                        ? 'Reprendre'
                        : 'Pause'}
                  </span>
                </Button>
              </div>
            </div>
            <Tabs
              value={discipline}
              onValueChange={(value) => {
                if (value === 'data' || value === 'bi' || value === 'privacy')
                  setDiscipline(value);
              }}
              className="discipline-tabs"
            >
              <TabsList
                className="discipline-list"
                aria-label="Mes domaines d’activité"
              >
                {disciplines.map((d) => (
                  <TabsTrigger
                    key={d.key}
                    value={d.key}
                    className="discipline-tab"
                  >
                    <span>{d.short}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="discipline-description">
                {disciplines.map((d) => (
                  <TabsContent
                    key={d.key}
                    value={d.key}
                    className="discipline-panel"
                  >
                    <h2 className="discipline-panel-title">{d.title}</h2>
                    <ul className="discipline-points">
                      {d.points.map((point) => (
                        <li key={point.title}>
                          <h3>{point.title}</h3>
                          <p>{point.text}</p>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </section>
          <section
            className="expertise-section wrap"
            id="expertises"
            aria-labelledby="expertise-title"
          >
            <div className="section-heading reveal">
              <span className="section-label">Mon travail</span>
              <h2 id="expertise-title">
                Mon périmètre
                <br />
                chez ECG<span className="accent">.</span>
              </h2>
            </div>
            <div className="expertise-lines">
              <article className="reveal">
                <div>
                  <h3>Leadership data</h3>
                  <span className="skill-detail">Revenue Management / BI</span>
                </div>
                <p>
                  Je pilote le périmètre data RM & BI. Mon rôle est de faire
                  avancer les sujets avec les équipes et de garder les besoins
                  métier au centre du travail.
                </p>
              </article>
              <article className="reveal">
                <div>
                  <h3>Analyse des usages BI</h3>
                  <span className="skill-detail">
                    Tableau / GoogleSQL / BigQuery
                  </span>
                </div>
                <p>
                  J’analyse les usages des contenus BI avec les équipes métier
                  pour identifier les besoins, rationaliser les reportings et
                  faire évoluer les analyses utiles à leur activité.
                </p>
              </article>
              <article className="reveal">
                <div>
                  <h3>Protection des données</h3>
                  <span className="skill-detail">DPO Groupe / RGPD</span>
                </div>
                <p>
                  J’accompagne les différents départements dans leur conformité
                  au RGPD, avec les équipes juridiques et métiers : audits des
                  traitements, structuration du registre et veille
                  réglementaire.
                </p>
              </article>
            </div>
          </section>
          <section
            id="parcours"
            className="career-section"
            aria-labelledby="career-title"
          >
            <div className="wrap">
              <div className="career-section-head reveal">
                <h2 id="career-title">
                  PARCOURS<span>.</span>
                </h2>
                <p>
                  Développement mobile, gouvernance
                  <br />
                  des données, puis leadership data.
                </p>
              </div>
              <div className="company-grid">
                <article
                  className="company-card ecg-card reveal"
                  onPointerMove={tilt}
                  onPointerLeave={resetTilt}
                >
                  <div className="company-top">
                    <div className="ecg-logo">
                      <img
                        src="/logos/ecg.png"
                        alt="ECG"
                        width="48"
                        height="54"
                      />
                    </div>
                    <span>European Camping Group</span>
                    <span className="current-role">Aujourd’hui</span>
                  </div>
                  <div className="ecg-body">
                    <div>
                      <h3>
                        Data Team Lead
                        <br />
                        RM & BI / DPO
                      </h3>
                      <p className="company-context">
                        Aix-en-Provence
                        <br />
                        Data, Revenue Management & protection des données
                      </p>
                    </div>
                    <div className="role-progression">
                      <div>
                        <span className="date-label">
                          Depuis septembre 2025
                        </span>
                        <strong>Data Team Lead RM & BI / DPO</strong>
                      </div>
                      <div>
                        <span className="date-label">
                          Janvier 2023 à août 2025
                        </span>
                        <strong>Data Manager / DPO</strong>
                      </div>
                    </div>
                  </div>
                  <div className="company-bottom">
                    <span>Management</span>
                    <span>Business Intelligence</span>
                    <span>Gouvernance</span>
                    <span className="company-date">
                      2023 <ArrowRight size={16} /> En poste
                    </span>
                  </div>
                </article>
                <article
                  className="company-card airbus-card reveal"
                  onPointerMove={tilt}
                  onPointerLeave={resetTilt}
                >
                  <div className="company-top">
                    <img
                      className="airbus-logo"
                      src="/logos/airbus.svg"
                      alt="Airbus"
                      width="150"
                      height="27"
                    />
                    <span className="company-years">2019 / 2021</span>
                  </div>
                  <h3>
                    Gouvernance
                    <br />à l’échelle industrielle.
                  </h3>
                  <div className="past-roles">
                    <div>
                      <strong>Consultant à la gouvernance des données</strong>
                      <span>Sept. 2019 à sept. 2021 · Alternance</span>
                      <p>
                        Contribution aux processus de data governance et à la
                        transformation numérique du Digital Office.
                      </p>
                    </div>
                    <div>
                      <strong>Architecte des systèmes d’information</strong>
                      <span>Avr. à août 2019 · Stage</span>
                      <p>
                        Gestion de projet et développement de modules de
                        l’application web EDGE.
                      </p>
                    </div>
                  </div>
                  <div className="company-bottom">
                    <span>Airbus Helicopters</span>
                    <span>Marignane</span>
                  </div>
                </article>
                <article
                  className="company-card highco-card reveal"
                  onPointerMove={tilt}
                  onPointerLeave={resetTilt}
                >
                  <div className="company-top">
                    <img
                      className="highco-logo"
                      src="/logos/highco.svg"
                      alt="HighCo"
                      width="66"
                      height="66"
                    />
                    <span className="company-years">2017 / 2018</span>
                  </div>
                  <h3>
                    Les premiers
                    <br />
                    produits, sur mobile.
                  </h3>
                  <div className="past-roles">
                    <div>
                      <strong>Développeur Android</strong>
                      <span>Deux stages et un CDD</span>
                      <p>
                        Développement d’applications pour un réseau de clubs de
                        football et la radio Rouge. Prototypage en réalité
                        augmentée et évolutions fonctionnelles pour la RTM.
                      </p>
                    </div>
                  </div>
                  <div className="company-bottom">
                    <span>HighCo / HighConnexion</span>
                    <span>Aix-en-Provence</span>
                  </div>
                </article>
              </div>
            </div>
          </section>
          <section
            id="apropos"
            className="about-section wrap"
            aria-labelledby="about-title"
          >
            <div className="about-heading reveal">
              <span className="section-label">Le profil</span>
              <h2 id="about-title">
                À PROPOS<span className="accent">.</span>
              </h2>
            </div>
            <div className="about-grid">
              <figure className="portrait-card reveal">
                <div className="photo-frame">
                  <img
                    src="/jordan-lacroix.png"
                    alt="Jordan Lacroix"
                    width="400"
                    height="400"
                    loading="lazy"
                  />
                </div>
                <figcaption>
                  <span>JORDAN LACROIX</span>
                  <span>Marseille</span>
                </figcaption>
              </figure>
              <div className="about-text reveal">
                <p className="about-lead">
                  J’aime comprendre un système.
                  <br />
                  Et savoir l’expliquer.
                </p>
                <p>
                  Mon parcours en MIAGE m’a donné un socle technique que
                  j’utilise aujourd’hui dans un rôle à la fois data et métier.
                  Je m’intéresse aussi à la réglementation numérique européenne
                  et à la façon dont elle change nos pratiques.
                </p>
                <p>
                  La radio et la gestion de communautés font partie de mon
                  parcours. Le contact, l’écoute et la pédagogie comptent dans
                  ma manière de travailler avec les équipes.
                </p>
                <div className="education-row">
                  <span className="education-date">2019 / 2021</span>
                  <div>
                    <strong>Master MIAGE</strong>
                    <span>
                      Ingénierie des données et décisions
                      <br />
                      Aix-Marseille Université
                    </span>
                  </div>
                </div>
                <div className="education-row">
                  <span className="education-date">2016 / 2018</span>
                  <div>
                    <strong>BTS SIO</strong>
                    <span>Major académique Aix-Marseille</span>
                  </div>
                </div>
                <p className="certifications">
                  PRINCE2 Foundation · 2021
                  <br />
                  TOEIC Listening & Reading · 900/990 obtenu en 2021
                </p>
              </div>
            </div>
            <a
              className="cv-banner reveal"
              href="/CV-Jordan-Lacroix.pdf"
              download
            >
              <span className="cv-banner-title">Télécharger mon CV</span>
              <span className="cv-banner-end">
                <span className="cv-download">
                  <Download size={26} />
                </span>
              </span>
            </a>
          </section>
          <section
            id="contact"
            className="contact-section"
            aria-labelledby="contact-title"
          >
            <div className="wrap">
              <div className="contact-top reveal">
                <h2 id="contact-title">CONTACT</h2>
                <p>
                  Pour parler data, gouvernance
                  <br />
                  ou parcours professionnel.
                </p>
              </div>
              <a
                className="contact-email reveal"
                href="mailto:contact@jordanlacroix.fr"
              >
                <span className="email-prefix">contact@</span>
                <span className="email-domain">
                  jordanlacroix.fr
                  <ArrowUpRight className="email-arrow" strokeWidth={1.2} />
                </span>
                <span className="sr-only">Écrire à Jordan Lacroix</span>
              </a>
              <div className="contact-bottom reveal">
                <span>Marseille & Aix-en-Provence</span>
                <a
                  className="hover-link"
                  href="https://www.linkedin.com/in/jordan-lacroix/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Retrouvez-moi sur LinkedIn <ArrowUpRight size={17} />
                </a>
              </div>
            </div>
          </section>
        </main>
        <footer className="wrap footer">
          <a className="brand" href="#contenu" aria-label="Retour en haut">
            JL
            <span className="brand-dot" />
          </a>
          <span>JORDAN LACROIX · 2026</span>
          <details>
            <summary>Informations du site</summary>
            <div>
              <p>
                Site personnel de Jordan Lacroix. Les contenus décrivent mon
                parcours et n’engagent pas mes employeurs. Les marques et logos
                présentés appartiennent à leurs titulaires.
              </p>
              <p>
                Contact :{' '}
                <a href="mailto:contact@jordanlacroix.fr">
                  contact@jordanlacroix.fr
                </a>
                . Aucun formulaire de collecte ni outil de mesure d’audience
                n’est intégré au site.
              </p>
              <p>Hébergement : GitHub Pages, un service de GitHub, Inc.</p>
            </div>
          </details>
          <a href="#contenu" className="hover-link">
            En haut <ArrowUpRight size={15} />
          </a>
        </footer>
      </div>
    </>
  );
}
