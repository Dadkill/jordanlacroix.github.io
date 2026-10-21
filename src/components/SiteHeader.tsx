import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const links = [
  ['#expertises', 'Expertises'],
  ['#parcours', 'Parcours'],
  ['#apropos', 'Profil'],
  ['#contact', 'Contact'],
];

export default function SiteHeader() {
  const slot = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<'flow' | 'hidden' | 'visible'>(
    'flow',
  );
  const menu = useRef<HTMLDetailsElement>(null);
  const toggle = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    let mode: 'flow' | 'hidden' | 'visible' = 'flow';
    let previousY = window.scrollY;
    let travel = 0;
    const update = () => {
      frame = 0;
      if (!slot.current) return;
      // Clamp overscroll so the bounce at either end is not a change of intent.
      const maxY = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const y = Math.max(0, Math.min(window.scrollY, maxY));
      const delta = y - previousY;
      previousY = y;
      if (delta !== 0) {
        travel =
          Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
      }

      let next = mode;
      if (y === 0) {
        next = 'flow';
        travel = 0;
      } else if (delta < 0) {
        // Cover the content as soon as scrolling reverses, without an entry delay.
        next = 'visible';
      } else if (mode === 'flow') {
        // The initial header scrolls naturally out of view before becoming fixed.
        if (y >= slot.current.offsetHeight) next = 'hidden';
      } else if (travel >= 10) {
        next = 'hidden';
      }
      if (next !== mode) {
        mode = next;
        setPosition(next);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      // A viewport resize is not a deliberate upward or downward scroll.
      previousY = window.scrollY;
      travel = 0;
      schedule();
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
    };
  }, []);

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
    <div className="site-header-slot" ref={slot}>
      <header
        className={`site-header-shell${position !== 'flow' ? ' is-floating' : ''}${position === 'visible' ? ' is-visible' : ''}`}
      >
        <div className="site-header wrap">
          <a
            className="brand"
            href="#haut"
            aria-label="Jordan Lacroix, retour en haut"
            onClick={() => {
              if (menu.current) menu.current.open = false;
            }}
          >
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
        </div>
      </header>
    </div>
  );
}
