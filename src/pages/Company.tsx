import { useEffect, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { CAREERS, HISTORY, PEOPLE, SWATCHES } from "@/data/content";
import { CONTACT } from "@/data/site";
import { Link } from "@/lib/router";
import { sampleRequest, usePicked } from "@/lib/sampleRequest";
import { Img } from "@/components/Img";
import { CopyButton, CtaBand, NewTab, PageHero, Related, SectionHead } from "@/components/Bits";
import { Masonry } from "@/components/Gallery";

export function OurBusiness({ route }: { route: string }) {
  return (
    <>
      <PageHero
        route={route}
        eyebrow="Our business"
        title={
          <>
            Family owned, with <strong>100-plus years</strong> of experience.
          </>
        }
        lead="DCS Inc. manufactures a full range of iron oxide pigments used all over the world to color concrete and masonry products. We specialize in the architectural precast concrete industry."
        img="dcs-building"
        imgAlt="The DCS building with its tan and charcoal striped facade and DCS lettering"
        caption={<span>DCS Inc., 2024 S Lenox St, Milwaukee</span>}
      />
      <section className="section">
        <div className="frame">
          <SectionHead eyebrow="Who we are" title={<>A fourth-generation family business in Southeastern Wisconsin.</>}>
            <p>Our success is based on dedication to customer service.</p>
            <p>
              We start with the finest iron oxide and other minerals to produce vibrant, consistent pigments for concrete products
              ranging from precast concrete to manufactured stone veneer, cast stone and more. High-quality raw materials are the
              foundation of our products and services, but our people are what set us apart. <strong>The average DCS employee has a
              tenure of 16 years.</strong>
            </p>
            <p>
              Whether you're selecting from our palette of more than 4,000 standard colors or need to match the existing color on a
              project, DCS cares. We've helped many customers develop proprietary colors for their product lines, and we can help
              your company integrate color into production more efficiently.
            </p>
            <p>
              When you buy from DCS, you get more than pigment. You get dedication to customer service and the technical and
              production expertise of a team that has been in the game for many years, and will be there for many more to come.
            </p>
          </SectionHead>
        </div>
      </section>
      <section className="section band--panel" aria-labelledby="history-h">
        <div className="frame grid12 gap-y-12">
          <div className="col-span-12 lg:col-span-4 rv">
            <p className="eyebrow">Our history</p>
            <h2 id="history-h" className="d-2 mt-4">
              From barn paint to <strong>architecture.</strong>
            </h2>
            <div className="grid grid-cols-2 gap-3 mt-10" style={{ maxWidth: 440 }}>
              <figure>
                <div className="ph-frame" style={{ aspectRatio: "432 / 605" }}>
                  <Img name="history-2" alt="Historic brick industrial building beside rail tracks" />
                </div>
              </figure>
              <figure>
                <div className="ph-frame" style={{ aspectRatio: "432 / 310" }}>
                  <Img name="history-1" alt="Historic photo of the Ricketson Color Corp. building beside a rail yard" />
                </div>
                <figcaption className="mono text-ink-3 mt-2">Ricketson Color Corp. (historic photo)</figcaption>
              </figure>
            </div>
          </div>
          <ol className="timeline col-span-12 lg:col-start-6 lg:col-span-7 rv">
            {HISTORY.map((h) => (
              <li key={h.year}>
                <time>{h.year}</time>
                <p>{h.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section">
        <div className="frame">
          <Related
            items={[
              { to: "our-people", title: "Our people", note: "Meet the team and find a direct email." },
              { to: "careers", title: "Careers", note: "Join a stable, growing family business." },
              { to: "contact", title: "Contact", note: "Samples, orders and technical questions." },
            ]}
          />
        </div>
      </section>
    </>
  );
}

export function People({ route }: { route: string }) {
  const team = [
    { img: "team-1", name: "In the office", alt: "Four members of the DCS team in the office" },
    { img: "team-2", name: "At a trade show", alt: "DCS team members at a trade show booth" },
    { img: "team-4", name: "At the signing table", alt: "Three people signing documents at a long table" },
    { img: "team-6", name: "2022 PCI Convention", alt: "Two people at the 2022 PCI Convention" },
    { img: "team-3", name: "Game day", alt: "Four people outside a football stadium" },
    { img: "team-5", name: "The DCS office", alt: "The DCS office with staff at their desks" },
  ].map((t) => ({ ...t, market: "featured" as const, label: "Around DCS" }));
  return (
    <>
      <PageHero
        route={route}
        eyebrow="Our people"
        title={
          <>
            Our people make <strong>the difference.</strong>
          </>
        }
        lead="It's that simple. Collectively, the DCS team has hundreds of years of experience getting color right in concrete."
        aside={
          <p className="mt-6 text-ink-2">
            All kinds of concrete: precast, manufactured stone veneer, cast stone, segmental retaining wall units, concrete pavers,
            concrete masonry units, concrete roof tile and more.
          </p>
        }
      />
      <section className="section">
        <div className="frame">
          <div className="people">
            {PEOPLE.map((p) => (
              <article key={p.name} className="person rv">
                <div className="person__img">
                  <Img name={p.img} alt={`Portrait of ${p.name}`} style={p.img === "p-jimmy" ? { objectPosition: "center 20%" } : undefined} />
                </div>
                <h2 className="d-5" style={{ fontWeight: 650 }}>
                  {p.name}
                </h2>
                <p className="mono">{p.role}</p>
                {p.bio.map((b, i) => (
                  <p key={i}>{b}</p>
                ))}
                <a className="person__mail" href={`mailto:${p.email}`}>
                  {p.email}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section band--panel">
        <div className="frame">
          <p className="eyebrow mb-3 rv">Around DCS</p>
          <h2 className="d-3 mb-10 rv">Trade shows, signings and game days.</h2>
          <Masonry items={team} showMarket={false} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export function Careers({ route }: { route: string }) {
  return (
    <>
      <PageHero
        route={route}
        eyebrow="Employment opportunities"
        title={
          <>
            Join <strong>our team.</strong>
          </>
        }
        lead="DCS is a stable, growing family-owned business in Milwaukee, committed to a safe and vibrant workplace."
        img="careers"
        imgAlt="The DCS team in matching company shirts outside the plant's loading door"
        imgPos="center 40%"
      />
      <section className="section">
        <div className="frame">
          <div className="spec">
            <p className="eyebrow spec__label">Open roles</p>
            <div className="spec__body">
              {CAREERS.map((c) => {
                const subject = `Employment Opportunity // ${c.role}`;
                return (
                  <article key={c.role} className="grid gap-4 py-8 border-t border-[var(--rule)] md:grid-cols-[minmax(0,1fr)_auto] md:gap-10 rv">
                    <div className="min-w-0">
                      <h2 className="d-3">{c.role}</h2>
                      <p className="mt-3 text-ink-2" style={{ maxWidth: "60ch" }}>
                        {c.text}
                      </p>
                      <p className="mt-4 flex flex-wrap items-center gap-3 mono text-ink-3">
                        Subject line: <span className="text-ink">{subject}</span>
                        <CopyButton text={subject} label="Copy subject" />
                      </p>
                    </div>
                    <div className="md:pt-2">
                      <a className="btn btn--solid" href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}`}>
                        <Mail aria-hidden /> Apply by email
                      </a>
                    </div>
                  </article>
                );
              })}
              <p className="mt-6 text-ink-2 border-t border-[var(--rule)] pt-6">
                Send applications to <b className="text-ink">{CONTACT.email}</b>. Top candidates will be contacted to schedule an
                interview.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */

const ROLES = ["Precast producer", "Manufactured stone veneer producer", "Cast stone producer", "Building supply / dealer", "Ready-mix or other concrete producer", "Architect or designer", "Contractor or mason", "Other"];
const NEEDS = ["Free color samples", "Color match", "Pricing or an order", "Dispensing equipment", "Technical question"];

type Errors = Partial<Record<"name" | "email" | "company" | "message", string>>;

export function Contact({ route }: { route: string }) {
  const picked = usePicked();
  const pickedText = picked
    .map((no) => SWATCHES.find((s) => s.no === no))
    .filter(Boolean)
    .map((s) => `#${s!.no} ${s!.name}`)
    .join(", ");
  const [colors, setColors] = useState(pickedText);
  const [needs, setNeeds] = useState<string[]>(picked.length ? ["Free color samples"] : []);
  const [errors, setErrors] = useState<Errors>({});
  const [composed, setComposed] = useState<{ body: string; subject: string } | null>(null);

  useEffect(() => {
    if (pickedText) setColors(pickedText);
  }, [pickedText]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    const errs: Errors = {};
    if (!v("name")) errs.name = "Enter your name so DCS knows who to reply to.";
    if (!v("company")) errs.company = "Enter your company, or “Independent”.";
    if (!/^\S+@\S+\.\S+$/.test(v("email"))) errs.email = "Enter an email address like name@company.com.";
    if (!v("message") && needs.length === 0 && !colors) errs.message = "Tell DCS what you need, or pick at least one option above.";
    flushSync(() => setErrors(errs));
    const keys = Object.keys(errs);
    if (keys.length) {
      setComposed(null);
      document.getElementById(`f-${keys[0]}`)?.focus();
      return;
    }
    const fields: [string, string][] = [
      ["Name", v("name")],
      ["Company", v("company")],
      ["Email", v("email")],
      ["Phone", v("phone")],
      ["I am a", v("role")],
      ["I need", needs.join(", ")],
      ["Colors of interest", colors.trim()],
      ["Ship samples to", v("ship")],
    ];
    const head = fields.filter(([, val]) => val).map(([k, val]) => `${k}: ${val}`);
    const body = v("message");
    flushSync(() =>
      setComposed({
        body: [...head, ...(body ? ["", body] : [])].join("\n"),
        subject: needs.includes("Free color samples") ? "Sample request" : "Information Request",
      }),
    );
    document.getElementById("composed-h")?.focus();
  };

  const errorCount = Object.keys(errors).length;

  return (
    <>
      <PageHero
        route={route}
        eyebrow="Contact"
        title={
          <>
            Getting <strong>in touch.</strong>
          </>
        }
        lead="For samples, ordering or other general inquiries, call DCS or send an email. If you know the person you're looking for, use the company directory."
      />
      <section className="section--tight">
        <div className="frame grid12 gap-y-16">
          <div className="col-span-12 lg:col-span-4">
            <div className="contact-card">
              <span className="mono text-ink-3">Toll free</span>
              <a className="big" href={CONTACT.phoneTollFreeHref}>
                {CONTACT.phoneTollFree}
              </a>
            </div>
            <div className="contact-card">
              <span className="mono text-ink-3">Main</span>
              <a className="big" href={CONTACT.phoneMainHref}>
                {CONTACT.phoneMain}
              </a>
            </div>
            <div className="contact-card">
              <span className="mono text-ink-3">Email</span>
              <span className="flex flex-wrap items-center gap-3">
                <a className="big" style={{ fontSize: "1.2rem" }} href={`mailto:${CONTACT.email}`}>
                  {CONTACT.email}
                </a>
                <CopyButton text={CONTACT.email} />
              </span>
            </div>
            <div className="contact-card">
              <span className="mono text-ink-3">Visit or ship to</span>
              <address className="not-italic text-[1.1rem] leading-snug">
                {CONTACT.company}
                <br />
                {CONTACT.street}
                <br />
                {CONTACT.cityLine}
              </address>
              <a className="arrow-link mt-3 self-start" href={CONTACT.maps} target="_blank" rel="noreferrer">
                Open in Google Maps <ArrowUpRight aria-hidden />
                <NewTab />
              </a>
            </div>
            <div className="contact-card">
              <span className="mono text-ink-3">Directory</span>
              <Link to="our-people" className="arrow-link self-start">
                Email someone directly <ArrowRight aria-hidden />
              </Link>
              <a className="arrow-link self-start mt-3" href={CONTACT.linkedin} target="_blank" rel="noreferrer">
                DCS on LinkedIn <ArrowUpRight aria-hidden />
                <NewTab />
              </a>
            </div>
          </div>

          <div className="col-span-12 lg:col-start-6 lg:col-span-7">
            <h2 className="d-3">Request samples or information</h2>
            <p className="text-ink-2 mt-3" style={{ maxWidth: "58ch" }}>
              Fill this in and we'll format a request you can send to {CONTACT.email}. Ring sets, color strips and small
              samples of dry pigment are free.
            </p>
            <form className="grid gap-6 mt-8" noValidate onSubmit={onSubmit} onChange={() => setComposed(null)}>
              <p className="text-[0.85rem] text-ink-3">Fields marked (required) must be filled in.</p>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="field">
                  <label htmlFor="f-name">Name (required)</label>
                  <input id="f-name" name="name" required autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-name" : undefined} />
                  {errors.name && <span id="e-name" className="field__err">{errors.name}</span>}
                </div>
                <div className="field">
                  <label htmlFor="f-company">Company (required)</label>
                  <input id="f-company" name="company" required autoComplete="organization" aria-invalid={!!errors.company} aria-describedby={errors.company ? "e-company" : undefined} />
                  {errors.company && <span id="e-company" className="field__err">{errors.company}</span>}
                </div>
                <div className="field">
                  <label htmlFor="f-email">Email (required)</label>
                  <input id="f-email" name="email" required type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "e-email" : undefined} />
                  {errors.email && <span id="e-email" className="field__err">{errors.email}</span>}
                </div>
                <div className="field">
                  <label htmlFor="f-phone">Phone</label>
                  <input id="f-phone" name="phone" type="tel" autoComplete="tel" />
                </div>
              </div>
              <div className="field">
                <label htmlFor="f-role">I am a</label>
                <select id="f-role" name="role" defaultValue="">
                  <option value="">Choose one</option>
                  {ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <fieldset className="field">
                <legend className="font-mono text-[0.72rem] tracking-[0.08em] uppercase text-ink-3 mb-2">I need</legend>
                <div className="check-list">
                  {NEEDS.map((n) => (
                    <label key={n}>
                      <input type="checkbox" id={`f-need-${n.replace(/\W+/g, "-").toLowerCase()}`} checked={needs.includes(n)} onChange={() => setNeeds((x) => (x.includes(n) ? x.filter((y) => y !== n) : [...x, n]))} />
                      {n}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="field">
                <label htmlFor="f-colors">Colors of interest</label>
                <input id="f-colors" name="colors" value={colors} onChange={(e) => setColors(e.target.value)} aria-describedby="h-colors" placeholder="e.g. #25 Dark Buff, or “match the attached photo”" />
                {picked.length > 0 ? (
                  <span id="h-colors" className="text-[0.85rem] text-ink-3">
                    Added from the color guide.{" "}
                    <button type="button" className="text-link" onClick={() => { sampleRequest.clear(); setColors(""); }}>
                      Clear
                    </button>
                  </span>
                ) : (
                  <span id="h-colors" className="text-[0.85rem] text-ink-3">
                    Pick colors in the <Link to="color-guide" className="text-link">color guide</Link> and they'll appear here.
                  </span>
                )}
              </div>
              <div className="field">
                <label htmlFor="f-ship">Ship samples to</label>
                <input id="f-ship" name="ship" autoComplete="street-address" />
              </div>
              <div className="field">
                <label htmlFor="f-message">Project details</label>
                <textarea id="f-message" name="message" placeholder="What are you making? Cement type, product, quantities, deadlines…" aria-invalid={!!errors.message} aria-describedby={errors.message ? "e-message" : undefined} />
                {errors.message && <span id="e-message" className="field__err">{errors.message}</span>}
              </div>
              <p role="alert" className="field__err">
                {errorCount ? `${errorCount} ${errorCount === 1 ? "field needs" : "fields need"} attention.` : ""}
              </p>
              <div>
                <button type="submit" className="btn btn--solid">
                  Prepare my request <ArrowRight aria-hidden />
                </button>
              </div>
            </form>

            {composed && (
              <section className="mt-10" aria-labelledby="composed-h">
                <h3 id="composed-h" tabIndex={-1} aria-describedby="composed-note" className="d-4">
                  Your request is ready to send
                </h3>
                <p id="composed-note" className="text-ink-2 mt-2" style={{ maxWidth: "60ch" }}>
                  Nothing has been sent yet. Copy it into an email to <b className="text-ink">{CONTACT.email}</b> with the subject
                  “{composed.subject}”, or call {CONTACT.phoneTollFree}.
                </p>
                <pre id="composed" className="composed mt-5">
                  {composed.body}
                </pre>
                <div className="mt-4 flex flex-wrap gap-3">
                  <CopyButton text={composed.body} label="Copy request" />
                  <a className="copy-btn" href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(composed.subject)}&body=${encodeURIComponent(composed.body)}`}>
                    <Mail aria-hidden /> Open in my email app
                  </a>
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
      <section className="section band--panel">
        <div className="frame">
          <p className="eyebrow mb-6">While you're here</p>
          <Related
            items={[
              { to: "color-guide", title: "Color guide", note: "Pick colors to add to your request." },
              { to: "laboratory-color-sample-services", title: "Lab & samples", note: "What the DCS lab can do for your project." },
              { to: "resource-library", title: "Resource library", note: "White papers, flyers and case studies." },
            ]}
          />
        </div>
      </section>
    </>
  );
}

export function NotFound() {
  return (
    <section className="section">
      <div className="frame">
        <p className="eyebrow eyebrow--oxide">Page not found</p>
        <h1 id="page-title" tabIndex={-1} className="d-1 mt-4">
          That page has <strong>moved.</strong>
        </h1>
        <p className="lead mt-6">The DCS site was reorganized. Try one of these, or start from the home page.</p>
        <div className="mt-10">
          <Related
            items={[
              { to: "", title: "Home", note: "Start from the top." },
              { to: "products", title: "Products", note: "Dry, liquid, granular and color hardener." },
              { to: "color-guide", title: "Color guide", note: "Featured DCS colors." },
              { to: "contact", title: "Contact", note: "Call (800) 657-0737." },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
