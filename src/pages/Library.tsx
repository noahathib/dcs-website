import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { MARKET_LABEL, PROJECTS, type Market } from "@/data/content";
import { DOCS, type DocType } from "@/data/site";
import { Link } from "@/lib/router";
import { CtaBand, DocCard, DocRow, PageHero, PullQuote } from "@/components/Bits";
import { Masonry } from "@/components/Gallery";

export function Projects({ route }: { route: string }) {
  const filters: ("all" | Market)[] = ["all", "precast", "cast-stone", "msv"];
  const [f, setF] = useState<(typeof filters)[number]>("all");
  const items = f === "all" ? PROJECTS : PROJECTS.filter((p) => p.market === f);
  return (
    <>
      <PageHero
        route={route}
        eyebrow="Projects"
        title={
          <>
            Architecture <strong>in DCS color.</strong>
          </>
        }
        lead="Precast, cast stone and manufactured stone veneer projects colored with DCS pigment, from hospital campuses to fireplaces."
      />
      <section className="section--tight">
        <div className="frame">
          <div className="chips mb-10" role="group" aria-label="Filter projects by market">
            {filters.map((k) => (
              <button key={k} type="button" className="chip" aria-pressed={f === k} onClick={() => setF(k)}>
                {k === "all" ? "All projects" : MARKET_LABEL[k]}
                <span className="count">{k === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.market === k).length}</span>
              </button>
            ))}
          </div>
          <Masonry key={f} items={items} />
          <div className="spec mt-20">
            <div className="spec__label" />
            <div className="spec__body spec__body--narrow">
              <p className="eyebrow mb-4">In the case studies</p>
              <p className="d-4" style={{ fontWeight: 450 }}>
                DCS color was found in projects winning 23 awards from PCI, APA and CSI in 2021.
              </p>
              <Link to="resource-library" className="arrow-link mt-6">
                Read the case studies
              </Link>
            </div>
          </div>
        </div>
      </section>
      <CtaBand title={<>Matching a building? Start with the lab.</>} />
    </>
  );
}

const TYPES: ("All" | DocType)[] = ["All", "White paper", "Product flyer", "Case study", "Color guide", "Safety data sheet"];
const PLURAL: Record<string, string> = { All: "All", "White paper": "White papers", "Product flyer": "Product flyers", "Case study": "Case studies", "Color guide": "Color guide", "Safety data sheet": "Safety data sheets" };

export function Resources({ route }: { route: string }) {
  const [type, setType] = useState<(typeof TYPES)[number]>("All");
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return DOCS.filter((d) => (type === "All" || d.type === type) && (!needle || `${d.title} ${d.summary} ${d.type}`.toLowerCase().includes(needle)));
  }, [type, q]);
  const covers = list.filter((d) => d.cover);
  const plain = list.filter((d) => !d.cover);

  return (
    <>
      <PageHero
        route={route}
        eyebrow="DCS Resource Library"
        title={
          <>
            Discover. Create. <strong>Succeed.</strong>
          </>
        }
        lead="A hub for insights, inspiration and expertise in pigments and construction, drawn from DCS experience since 1890."
      />
      <section className="section--tight">
        <div className="frame">
          <div className="flex flex-wrap items-center justify-between gap-5 mb-12">
            <div className="chips" role="group" aria-label="Filter by document type">
              {TYPES.map((t) => (
                <button key={t} type="button" className="chip" aria-pressed={type === t} onClick={() => setType(t)}>
                  {PLURAL[t]}
                  <span className="count">{t === "All" ? DOCS.length : DOCS.filter((d) => d.type === t).length}</span>
                </button>
              ))}
            </div>
            <div className="search">
              <Search aria-hidden />
              <label htmlFor="doc-search" className="sr-only">
                Search documents
              </label>
              <input id="doc-search" type="search" placeholder="Search, e.g. buff, dispenser, black" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>
          <h2 className="sr-only">Documents</h2>
          <p className="mono text-ink-3 mb-6" aria-live="polite">
            {list.length} {list.length === 1 ? "document" : "documents"}
            {q && ` matching “${q}”`}
          </p>
          {covers.length > 0 && (
            <div className="docs">
              {covers.map((d) => (
                <DocCard key={d.id} doc={d} />
              ))}
            </div>
          )}
          {plain.length > 0 && (
            <div className="spec mt-16">
              <h3 className="eyebrow spec__label">Safety data sheets</h3>
              <div className="spec__body">
                {plain.map((d) => (
                  <DocRow key={d.id} doc={d} meta="SDS · revised 2023" />
                ))}
              </div>
            </div>
          )}
          {list.length === 0 && (
            <div className="py-16 border-t border-[var(--rule)]">
              <p className="d-4">No documents match “{q}”.</p>
              <p className="text-ink-2 mt-2">Try a broader word, or clear the search and pick a document type.</p>
              <button type="button" className="btn btn--ghost mt-6" onClick={() => { setQ(""); setType("All"); }}>
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>
      <section className="section band--panel">
        <div className="frame">
          <div className="spec">
            <p className="eyebrow spec__label">The case for DCS</p>
            <div className="spec__body spec__body--narrow">
              <PullQuote id="wolf" />
            </div>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export function SDS({ route }: { route: string }) {
  const sheets = DOCS.filter((d) => d.type === "Safety data sheet");
  return (
    <>
      <PageHero
        route={route}
        eyebrow="Safety Data Sheets"
        title={
          <>
            Safety Data Sheets, <strong>revised 2023.</strong>
          </>
        }
        lead="These Safety Data Sheets provide detailed information about the safe use of DCS products."
        img="prosper-th"
        imgAlt="Civic building with cast stone details lit at night"
      />
      <section className="section">
        <div className="frame">
          <div className="spec">
            <p className="eyebrow spec__label">{sheets.length} sheets · revised 2023</p>
            <div className="spec__body">
              {sheets.map((d) => (
                <DocRow key={d.id} doc={d} meta="Safety Data Sheet · PDF" />
              ))}
              <p className="mt-8 text-ink-2">
                Need documentation that isn't listed? The <Link to="laboratory-color-sample-services" className="text-link">DCS lab</Link>{" "}
                provides ASTM documentation on all DCS pigments.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
