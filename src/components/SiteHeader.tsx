import { useEffect, useRef } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const links = [
  ['#expertises', 'Expertises'],
  ['#parcours', 'Parcours'],
  ['#apropos', 'Profil'],
  ['#contact', 'Contact'],
];

export default function SiteHeader() {
  const menu = useRef<HTMLDetailsElement>(null);
  const toggle = useRef<HTMLElement>(null);

  useEffect(() => {
    const desktop = matchMedia('(min-width: 761px)');
    const closeOnDesktop = () => {
      if (desktop.matches && menu.current) menu.current.open = false;
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (
        event.key === 'Escape' &&
        menu.current?.open &&
        event.target instanceof Node &&
        menu.current.contains(event.target)
      ) {
        event.preventDefault();
        menu.current.open = false;
        toggle.current?.focus();
      }
    };
    desktop.addEventListener('change', closeOnDesktop);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      desktop.removeEventListener('change', closeOnDesktop);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const goToSection = (hash: string) => {
    if (menu.current) menu.current.open = false;
    // Keep keyboard focus on the selected destination, outside the closed menu.
    document.querySelector<HTMLElement>(hash)?.focus({ preventScroll: true });
  };

  return (
    <header className="site-header wrap">
      <a className="brand" href="#contenu" aria-label="Jordan Lacroix, accueil">
        JL
        <span className="brand-dot" />
      </a>
      <span className="header-role">
        Data Team Lead
        <br />
        RM & BI / DPO
      </span>
      <nav className="desktop-nav" aria-label="Navigation principale">
        {links.slice(0, 3).map(([href, label]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
      <a
        className="header-mail hover-link"
        href="mailto:contact@jordanlacroix.fr"
      >
        Me contacter <ArrowUpRight size={16} aria-hidden="true" />
      </a>
      <details className="mobile-menu" ref={menu}>
        <summary ref={toggle} aria-controls="mobile-navigation">
          <span>Menu</span>
          <Menu className="menu-open-icon" size={20} aria-hidden="true" />
          <X className="menu-close-icon" size={20} aria-hidden="true" />
        </summary>
        <nav id="mobile-navigation" aria-label="Navigation mobile">
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => goToSection(href)}>
              {label}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          ))}
        </nav>
      </details>
    </header>
  );
}
