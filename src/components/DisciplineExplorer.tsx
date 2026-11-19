import { useState, type ReactNode } from 'react';
import { Pause, Play } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Button } from './ui/button';
import DataSculpture, { type Discipline } from '../data-sculpture';
import { useHydrated } from '../lib/useHydrated';

const disciplines = [
  {
    key: 'data',
    title: 'Data management',
    short: 'Data',
    points: [
      {
        title: 'Revenue Management & BI',
        text: 'Relier les priorités de l’équipe data aux besoins des métiers.',
      },
      {
        title: 'Gestion des données',
        text: 'Organiser les sujets et clarifier les besoins avec les équipes concernées.',
      },
      {
        title: 'Culture de la gouvernance',
        text: 'Partager des responsabilités et des règles de gestion claires autour des données.',
      },
    ],
  },
  {
    key: 'bi',
    title: 'Business Intelligence, l’aide à la décision',
    short: 'BI',
    points: [
      {
        title: 'Tableaux de bord',
        text: 'Construire des analyses lisibles avec Tableau et GoogleSQL / BigQuery.',
      },
      {
        title: 'Usages & rationalisation',
        text: 'Comprendre quels contenus sont utilisés et quels besoins ils couvrent.',
      },
      {
        title: 'Lecture métier',
        text: 'Expliquer les indicateurs et donner du contexte aux résultats.',
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
        text: 'Vérifier avec les équipes juridiques et métiers que les traitements respectent le règlement général sur la protection des données (RGPD).',
      },
      {
        title: 'Registre & gouvernance',
        text: 'Documenter les activités qui impliquent des données personnelles.',
      },
      {
        title: 'Veille européenne',
        text: 'Suivre la réglementation européenne et ses implications pour les métiers.',
      },
    ],
  },
];

function DisciplinePoints({
  points,
}: {
  points: { title: string; text: string }[];
}) {
  return (
    <ul className="discipline-points">
      {points.map((point) => (
        <li key={point.title}>
          <h3>{point.title}</h3>
          <p>{point.text}</p>
        </li>
      ))}
    </ul>
  );
}

type Props = {
  children: ReactNode;
  paused: boolean;
  reducedMotion: boolean;
  onTogglePause: () => void;
};

export default function DisciplineExplorer({
  children,
  paused,
  reducedMotion,
  onTogglePause,
}: Props) {
  const interactive = useHydrated();
  const [discipline, setDiscipline] = useState<Discipline>('data');

  return (
    <Tabs
      value={discipline}
      onValueChange={(value) => {
        if (value === 'data' || value === 'bi' || value === 'privacy')
          setDiscipline(value);
      }}
      className="hero-stage"
    >
      {children}
      {interactive && (
        <TabsList
          className="discipline-list"
          aria-label="Mes domaines d’activité"
        >
          {disciplines.map((d) => (
            <TabsTrigger key={d.key} value={d.key} className="discipline-tab">
              <span>{d.short}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      )}
      <div className="sculpture-stage">
        <DataSculpture mode={discipline} paused={paused || reducedMotion} />
        {interactive && (
          <Button
            className="motion-button"
            variant="ghost"
            onClick={onTogglePause}
            disabled={reducedMotion}
            aria-label={
              reducedMotion
                ? 'Mouvement réduit selon vos préférences système'
                : paused
                  ? 'Reprendre les animations'
                  : 'Mettre les animations en pause'
            }
            aria-pressed={paused || reducedMotion}
          >
            {paused || reducedMotion ? <Play size={14} /> : <Pause size={14} />}
            <span>
              {reducedMotion
                ? 'Mouvement réduit'
                : paused
                  ? 'Reprendre'
                  : 'Pause'}
            </span>
          </Button>
        )}
      </div>
      {interactive ? (
        <div className="discipline-description">
          {disciplines.map((d) => (
            <TabsContent key={d.key} value={d.key} className="discipline-panel">
              <h2 className="discipline-panel-title">{d.title}</h2>
              <DisciplinePoints points={d.points} />
            </TabsContent>
          ))}
        </div>
      ) : (
        <div className="discipline-fallback">
          {disciplines.map((d) => (
            <details key={d.key} name="disciplines" open={d.key === 'data'}>
              <summary>
                <h2>{d.title}</h2>
              </summary>
              <DisciplinePoints points={d.points} />
            </details>
          ))}
        </div>
      )}
    </Tabs>
  );
}
