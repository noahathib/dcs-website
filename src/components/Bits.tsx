import { useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Check, Copy, Download } from "lucide-react";
import { CONTACT, ROUTES, pdf, type Doc } from "@/data/site";
import { TESTIMONIALS, type Testimonial } from "@/data/content";
import { Link } from "@/lib/router";
import { IMAGE_SIZES } from "@/data/imageSizes";
import { Img } from "./Img";

/** Screen-reader note for links that open a new tab. */
export const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>;

export function CopyButton({ text, label = "Copy", srLabel }: { text: string; label?: string; srLabel?: string }) {
  const [done, setDone] = useState(false);
  const confirm = () => {
    setDone(true);
    window.setTimeout(() => setDone(false), 1800);
  };
  const fallback = (btn: HTMLButtonElement) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    ta.remove();
    btn.focus();
    if (ok) confirm();
  };
  return (
    <button
      type="button"
      className="copy-btn"
      onClick={(e) => {
        const btn = e.currentTarget;
        try {
          navigator.clipboard.writeText(text).then(confirm, () => fallback(btn));
        } catch {
          fallback(btn);
        }
      }}
    >
      {done ? <Check aria-hidden /> : <Copy aria-hidden />}
      <span aria-live="polite">{done ? "Copied" : label}</span>
      {srLabel && !done && <span className="sr-only"> {srLabel}</span>}
    </button>
  );
}

export function Crumbs({ route }: { route: string }) {
  const meta = ROUTES[route];
  const parent = meta?.parent;
  return (
    <nav aria-label="Breadcrumb" className="crumbs mono">
      <Link to="">Home</Link>
      {parent && parent.to !== route && (
        <>
          <span aria-hidden>/</span>
          <Link to={parent.to}>{parent.label}</Link>
        </>
      )}
    </nav>
  );
}

type HeroProps = {
  route: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
  img?: string;
  imgAlt?: string;
  imgPos?: string;
  caption?: ReactNode;
};

export function PageHero({ route, eyebrow, title, lead, aside, img, imgAlt = "", imgPos, caption }: HeroProps) {
  return (
    <section className="phero">
      <div className="frame">
        <Crumbs route={route} />
        <div className="phero__grid mt-8">
          <div className="phero__text">
            <p className="eyebrow eyebrow--oxide load-1">{eyebrow}</p>
            <h1 className="d-1 mt-4 load-2" id="page-title" tabIndex={-1}>
              {title}
            </h1>
          </div>
          {(lead || aside) && (
            <div className="phero__aside load-3">
              {lead && <p className="lead">{lead}</p>}
              {aside}
            </div>
          )}
        </div>
      </div>
      {img && (
        <div className="frame">
          <figure className="phero__media load-4">
            <Img name={img} alt={imgAlt} priority style={imgPos ? { objectPosition: imgPos } : undefined} />
            {caption && <figcaption className="phero__caption mono text-ink-3">{caption}</figcaption>}
          </figure>
        </div>
      )}
    </section>
  );
}

export function SectionHead({ eyebrow, title, children, className = "" }: { eyebrow: string; title: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div className={`spec rv ${className}`}>
      <p className="eyebrow spec__label">{eyebrow}</p>
      <div className="spec__body">
        <h2 className="d-2">{title}</h2>
        {children && <div className="mt-6 prose">{children}</div>}
      </div>
    </div>
  );
}

export function PullQuote({ id, className = "" }: { id: string; className?: string }) {
  const t: Testimonial = TESTIMONIALS[id];
  return (
    <figure className={`pull rv ${className}`}>
      <blockquote>
        <p>{t.quote}</p>
      </blockquote>
      <figcaption className="flex flex-wrap gap-x-3 gap-y-1 items-baseline">
        <b>{t.name}</b>
        <span className="mono text-ink-3">{t.company}</span>
      </figcaption>
    </figure>
  );
}

export function DocCard({ doc }: { doc: Doc }) {
  return (
    <a className="doc" href={pdf(doc.file)} target="_blank" rel="noreferrer">
      <div className="doc__cover">
        {doc.cover ? <Img name={doc.cover} alt="" /> : <div className="h-full grid place-items-center mono text-ink-3">PDF</div>}
        <span className="doc__type">{doc.type}</span>
      </div>
      <h3>{doc.title}</h3>
      <p>{doc.summary}</p>
      <span className="doc__get">
        <Download aria-hidden /> Open PDF
        <NewTab />
      </span>
    </a>
  );
}

export function DocRow({ doc, meta }: { doc: Doc; meta?: string }) {
  return (
    <a className="doc-row" href={pdf(doc.file)} target="_blank" rel="noreferrer">
      <span className="min-w-0">
        <b>{doc.title}</b>
        <span className="mono block mt-1">{meta ?? doc.type}</span>
      </span>
      <span className="doc-row__get">
        <Download aria-hidden /> PDF
        <NewTab />
      </span>
    </a>
  );
}

export function Related({ items }: { items: { to: string; title: string; note: string }[] }) {
  return (
    <div className="related rv">
      {items.map((i) => (
        <Link key={i.to} to={i.to}>
          <b>
            {i.title} <ArrowRight aria-hidden />
          </b>
          <span>{i.note}</span>
        </Link>
      ))}
    </div>
  );
}

export function CtaBand({
  title,
  text,
  img = "strip-kit-50",
  imgAlt = "A DCS 50-piece strip kit showing a range of concrete colors",
  titleClassName = "d-2",
}: {
  titleClassName?: string;
  title?: ReactNode;
  text?: ReactNode;
  img?: string;
  imgAlt?: string;
}) {
  const [w, h] = IMAGE_SIZES[img] ?? [939, 600];
  return (
    <section className="cta-band band--deep section">
      <div className="frame cta-band__grid">
        <div className="cta-band__text rv">
          <p className="eyebrow">Samples, matching and technical help</p>
          <h2 className={`${titleClassName} mt-4`}>{title ?? <>Start with a sample in your hand.</>}</h2>
          <p className="mt-6 prose" style={{ maxWidth: "52ch" }}>
            {text ?? (
              <>
                Ring sets, color strips and small samples of dry pigment are free. Tell us what you are making and the DCS lab
                will send samples, match an existing building, or build a custom color with your own sand and aggregate.
              </>
            )}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="contact" className="btn btn--solid">
              Request samples <ArrowRight aria-hidden />
            </Link>
            <Link to="laboratory-color-sample-services" className="btn btn--ghost">
              Lab & matching
            </Link>
          </div>
        </div>
        <div className="cta-band__aside rv">
          <div className="ph-frame" style={{ aspectRatio: `${w} / ${h}` }}>
            <Img name={img} alt={imgAlt} />
          </div>
          <dl className="mt-6 grid gap-3">
            <div className="flex flex-wrap justify-between gap-2 border-t border-[var(--rule)] pt-3">
              <dt className="mono text-ink-3">Toll free</dt>
              <dd>
                <a href={CONTACT.phoneTollFreeHref} className="d-5">
                  {CONTACT.phoneTollFree}
                </a>
              </dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 border-t border-[var(--rule)] pt-3">
              <dt className="mono text-ink-3">Email</dt>
              <dd className="flex flex-wrap items-center gap-3">
                <a href={`mailto:${CONTACT.email}`} className="break-all">
                  {CONTACT.email}
                </a>
                <CopyButton text={CONTACT.email} srLabel="DCS email address" />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export function ExternalLink({ href, children, className = "arrow-link" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children} <ArrowUpRight aria-hidden />
      <NewTab />
    </a>
  );
}
