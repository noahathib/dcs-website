import { useEffect, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { ALIASES, ROUTES } from "@/data/site";

// Hash routing with the existing site's slugs (#dry-pigment, #precast ...). In the artifact
// only a bare #token survives in the URL, so each page is one token. Production can swap this
// for real paths with the same slugs.

const own = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);
const RENAV = "dcs:renav";

function resolve(token: string): string {
  if (token === "" || token === "home" || token === "top") return "";
  return own(ALIASES, token) ? ALIASES[token] : token;
}

export function readRoute(): string {
  const h = window.location.hash.replace(/^#\/?/, "");
  let raw: string;
  try {
    raw = decodeURIComponent(h);
  } catch {
    raw = h; // a malformed %-escape becomes an unknown route, not a crash
  }
  return resolve(raw.trim());
}

/** Current route plus a counter that ticks on every navigation, including re-clicks of the current page. */
export function useRoute() {
  const [state, setState] = useState(() => ({ route: readRoute(), n: 0 }));
  useEffect(() => {
    const on = () => setState((p) => ({ route: readRoute(), n: p.n + 1 }));
    window.addEventListener("hashchange", on);
    window.addEventListener(RENAV, on);
    return () => {
      window.removeEventListener("hashchange", on);
      window.removeEventListener(RENAV, on);
    };
  }, []);
  return state;
}

export const isKnownRoute = (r: string) => own(ROUTES, r);

export const href = (to: string) => (to === "" ? "#home" : `#${to}`);

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; children: ReactNode };
export function Link({ to, children, onClick, ...rest }: LinkProps) {
  const onLinkClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    // Same hash means no hashchange event; announce the navigation so the page scrolls to the top.
    if (window.location.hash === href(to)) {
      e.preventDefault();
      window.dispatchEvent(new Event(RENAV));
    }
  };
  return (
    <a href={href(to)} {...rest} onClick={onLinkClick}>
      {children}
    </a>
  );
}
