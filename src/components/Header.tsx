import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, Menu, X } from "lucide-react";
import { NAV, CONTACT, ROUTES } from "@/data/site";
import { Link, isKnownRoute } from "@/lib/router";
import { Img } from "./Img";

function Logo() {
  return (
    <Link to="" className="brand">
      <Img name="logo" alt="DCS Inc. home" className="logo-dark" priority />
      <Img name="logo-light" alt="DCS Inc. home" className="logo-light" priority />
      <span className="brand__meta hidden sm:block">
        Pigments for concrete <br />
        Since 1890
      </span>
    </Link>
  );
}

function sectionOf(route: string) {
  const parent = isKnownRoute(route) ? ROUTES[route].parent?.to : undefined;
  for (const item of NAV) {
    if (item.to === route || item.to === parent) return item.label;
    if (item.groups.some((g) => g.links.some((l) => l.to === route))) return item.label;
  }
  return null;
}

const withGroups = NAV.filter((n) => n.groups.length > 0);
const firstMenu = withGroups[0]?.label;
const lastMenu = withGroups[withGroups.length - 1]?.label;

export function Header({ route, nav }: { route: string; nav: number }) {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const hoverOpened = useRef(false);
  const navigatedFromMobile = useRef(false);
  const current = sectionOf(route);

  // Every navigation (including a click on the page already shown) closes the menus.
  useEffect(() => {
    setOpen(null);
    setMobile((m) => {
      if (m) navigatedFromMobile.current = true;
      return false;
    });
  }, [nav]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const btn = navRef.current?.querySelector<HTMLButtonElement>(`[data-menu="${open}"]`);
        setOpen(null);
        btn?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const hoverOpen = (label: string | null) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      hoverOpened.current = !!label;
      setOpen(label);
    }, label ? 80 : 220);
  };

  return (
    <header className="site-header">
      <div className="frame site-header__row">
        <Logo />
        <nav ref={navRef} className="nav" aria-label="Main">
          {NAV.map((item) =>
            item.groups.length === 0 ? (
              <Link key={item.label} to={item.to} className="nav__trigger" aria-current={current === item.label ? "page" : undefined}>
                {item.label}
              </Link>
            ) : (
              <div
                key={item.label}
                className="nav__item"
                onPointerEnter={hoverOpen(item.label)}
                onPointerLeave={hoverOpen(null)}
                onBlur={(e) => {
                  // Close when keyboard focus moves somewhere outside this menu.
                  const next = e.relatedTarget as Node | null;
                  if (next && !e.currentTarget.contains(next)) setOpen((cur) => (cur === item.label ? null : cur));
                }}
              >
                <button
                  type="button"
                  className="nav__trigger"
                  data-menu={item.label}
                  aria-expanded={open === item.label}
                  aria-controls={open === item.label ? `mega-${item.label}` : undefined}
                  aria-current={current === item.label ? "page" : undefined}
                  onClick={(e) => {
                    window.clearTimeout(hoverTimer.current);
                    // A mouse click right after hover-open keeps the menu open instead of toggling it shut.
                    // e.detail === 0 means Enter or Space, which always toggles.
                    if (e.detail > 0 && open === item.label && hoverOpened.current) {
                      hoverOpened.current = false;
                      return;
                    }
                    hoverOpened.current = false;
                    setOpen(open === item.label ? null : item.label);
                  }}
                >
                  {item.label}
                  <ChevronDown aria-hidden />
                </button>
                {open === item.label && (
                  <div
                    id={`mega-${item.label}`}
                    className={[
                      "mega",
                      item.groups.length === 1 ? "mega--narrow" : "",
                      item.label === firstMenu ? "mega--start" : "",
                      item.label === lastMenu ? "mega--end" : "",
                    ].join(" ")}
                  >
                    {item.groups.map((g, i) => {
                      const gid = `mega-${item.label}-${i}`;
                      return (
                        <div key={g.heading} className="mega__group">
                          <p className="eyebrow mega__heading" id={gid}>
                            {g.heading}
                          </p>
                          <ul aria-labelledby={gid}>
                            {g.links.map((l) => (
                              <li key={l.to + l.label}>
                                <Link to={l.to} className="mega__link" aria-current={route === l.to ? "page" : undefined}>
                                  <b>{l.label}</b>
                                  {l.note && <span>{l.note}</span>}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                    {item.feature && (
                      <figure className="mega__feature">
                        <Img name={item.feature.img} alt="" />
                        <figcaption>{item.feature.caption}</figcaption>
                      </figure>
                    )}
                  </div>
                )}
              </div>
            ),
          )}
          <Link to="contact" className="btn btn--solid nav__cta">
            Request samples
          </Link>
        </nav>

        {/* Home only: shown at tablet widths once the hero's own CTAs have scrolled away (see BurstHero) */}
        <Link to="contact" className="btn btn--solid header-cta">
          Request samples
        </Link>
        <Dialog.Root open={mobile} onOpenChange={setMobile}>
          <Dialog.Trigger asChild>
            <button type="button" className="menu-btn">
              <Menu aria-hidden /> Menu
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content
              className="mobile-menu"
              aria-describedby={undefined}
              onCloseAutoFocus={(e) => {
                // After choosing a page, land on its heading rather than back on the Menu button.
                if (!navigatedFromMobile.current) return;
                navigatedFromMobile.current = false;
                e.preventDefault();
                document.getElementById("page-title")?.focus({ preventScroll: true });
              }}
            >
              <div className="frame">
                <div className="mobile-menu__head">
                  <Dialog.Title className="eyebrow">Menu</Dialog.Title>
                  <Dialog.Close className="icon-btn icon-btn--ink" aria-label="Close menu">
                    <X aria-hidden />
                  </Dialog.Close>
                </div>
                {NAV.map((item) => (
                  <div key={item.label} className="mobile-menu__group">
                    {item.groups.length === 0 ? (
                      <Link to={item.to}>{item.label}</Link>
                    ) : (
                      <>
                        <p className="eyebrow mb-2">{item.label}</p>
                        {item.groups.flatMap((g) => g.links).map((l) => (
                          <Link key={l.to + l.label} to={l.to}>
                            {l.label}
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                ))}
                <div className="mobile-menu__group">
                  <Link to="contact" className="btn btn--solid btn--block">
                    Request samples
                  </Link>
                  <p className="mono mt-4 text-ink-2">
                    {CONTACT.phoneTollFree} · {CONTACT.email}
                  </p>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
