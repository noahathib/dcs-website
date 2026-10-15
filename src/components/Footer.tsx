import { CONTACT, NAV } from "@/data/site";
import { SWATCHES } from "@/data/content";
import { Link } from "@/lib/router";
import { Img, Strip } from "./Img";
import { CopyButton, NewTab } from "./Bits";

export function Footer() {
  const cols = NAV.filter((n) => n.groups.length > 0);
  return (
    <footer className="site-footer band--deep">
      {/* A full strip kit: every featured DCS color, in order */}
      <div className="strip-bar" aria-hidden>
        {SWATCHES.map((s) => (
          <Strip key={s.no} img={s.img} />
        ))}
      </div>
      <div className="frame">
        <div className="footer-grid">
          <div className="footer-contact">
            <div className="flex items-center gap-4">
              <Img name="badge" alt="DCS, since 1890" className="h-[84px] w-auto" />
              <p className="d-4" style={{ maxWidth: "14ch" }}>
                The color of today's architecture.
              </p>
            </div>
            <address className="not-italic mt-8 grid gap-2 text-[0.95rem]">
              <span>
                {CONTACT.company}, {CONTACT.street}, {CONTACT.cityLine}
              </span>
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <a href={CONTACT.phoneTollFreeHref}>{CONTACT.phoneTollFree}</a>
                <span className="opacity-50">/</span>
                <a href={CONTACT.phoneMainHref}>{CONTACT.phoneMain}</a>
              </span>
              <span className="flex flex-wrap items-center gap-3">
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                <CopyButton text={CONTACT.email} label="Copy email" />
              </span>
            </address>
          </div>
          {cols.map((c) => (
            <nav key={c.label} aria-label={c.label}>
              <h2>{c.label}</h2>
              <ul>
                {c.groups
                  .flatMap((g) => g.links)
                  .filter((l, i, a) => a.findIndex((x) => x.to === l.to) === i)
                  .map((l) => (
                    <li key={l.to}>
                      <Link to={l.to}>{l.label}</Link>
                    </li>
                  ))}
                {c.label === "Resources" && (
                  <>
                    <li>
                      <Link to="color-guide">Color Guide</Link>
                    </li>
                    <li>
                      <Link to="projects">Projects</Link>
                    </li>
                  </>
                )}
                {c.label === "Company" && (
                  <>
                    <li>
                      <Link to="contact">Contact</Link>
                    </li>
                    <li>
                      <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">
                        LinkedIn <span aria-hidden>↗</span>
                        <NewTab />
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          ))}
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} DCS Inc., Milwaukee, Wisconsin. Family owned, with 100-plus years of experience.</span>
          <a href="https://caststone.org/" target="_blank" rel="noreferrer" className="hover:text-[var(--ochre)]">
            Proud member of the Cast Stone Institute <span aria-hidden>↗</span>
            <NewTab />
          </a>
        </div>
      </div>
    </footer>
  );
}
