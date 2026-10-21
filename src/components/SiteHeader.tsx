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
  const shell = useRef<HTMLElement>(null);
  const [floating, setFloating] = useState(false);
  const menu = useRef<HTMLDetailsElement>(null);
  const toggle = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = shell.current;
    const placeholder = slot.current;
    const mobileMenu = menu.current;
    if (!header || !placeholder) return;

    let frame = 0;
    let isFloating = false;
    const scrollPosition = () =>
      Math.max(
        0,
        Math.min(
          window.scrollY,
          Math.max(
            0,
            document.documentElement.scrollHeight - window.innerHeight,
          ),
        ),
      );
    let previousY = scrollPosition();
    let height = placeholder.offsetHeight;
    let offset = -Math.min(previousY, height);

    const update = () => {
      frame = 0;
      const y = scrollPosition();
      const delta = y - previousY;
      previousY = y;
      // One pixel of scroll moves the header by one pixel, in either direction.
      // Until it is fully revealed, content and header travel together.
      offset = Math.max(-height, Math.min(0, offset - delta));
      offset = Math.max(offset, -y);
      if (mobileMenu?.open || header.querySelector(':focus-visible'))
        offset = 0;
      header.style.setProperty('--header-offset', `${offset}px`);
      if (isFloating !== y > 0) {
        isFloating = y > 0;
        setFloating(isFloating);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      const nextHeight = placeholder.offsetHeight;
      // Preserve the revealed proportion when changing between mobile and desktop.
      offset = height > 0 ? (offset / height) * nextHeight : 0;
      height = nextHeight;
      previousY = scrollPosition();
      schedule();
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize);
    header.addEventListener('focusin', schedule);
    header.addEventListener('focusout', schedule);
    mobileMenu?.addEventListener('toggle', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      header.removeEventListener('focusin', schedule);
      header.removeEventListener('focusout', schedule);
      mobileMenu?.removeEventListener('toggle', schedule);
      header.style.removeProperty('--header-offset');
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
        ref={shell}
        className={`site-header-shell${floating ? ' is-floating' : ''}`}
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
