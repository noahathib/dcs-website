import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SWATCHES, type Swatch } from "@/data/content";
import { pdf } from "@/data/site";
import { Link } from "@/lib/router";
import { usePicked } from "@/lib/sampleRequest";
import { Strip } from "@/components/Img";
import { Crumbs, CtaBand, NewTab, Related } from "@/components/Bits";
import { RingSet, SwatchDetail } from "@/components/RingSet";

const FAMILIES: ("All" | Swatch["family"])[] = ["All", "Reds", "Yellows & buffs", "Browns & taupes", "Greys & black"];

export default function ColorGuide({ route }: { route: string }) {
  const [family, setFamily] = useState<(typeof FAMILIES)[number]>("All");
  const list = useMemo(() => (family === "All" ? SWATCHES : SWATCHES.filter((s) => s.family === family)), [family]);
  const [selNo, setSelNo] = useState("25");
  const selIdx = Math.max(0, list.findIndex((s) => s.no === selNo));
  const sel = list[selIdx] ?? list[0];
  const picked = usePicked();

  return (
    <>
      <section className="phero">
        <div className="frame">
          <Crumbs route={route} />
          <div className="phero__grid mt-8">
            <div className="phero__text">
              <p className="eyebrow eyebrow--oxide load-1">DCS Concrete Color Selection Guide</p>
              <h1 id="page-title" tabIndex={-1} className="d-1 mt-4 load-2">
                Discover the <strong>perfect shade.</strong>
              </h1>
            </div>
            <div className="phero__aside load-3">
              <p className="text-ink-2">
                DCS iron oxide pigments cover a vibrant, versatile range of rich, durable hues, from bold, eye-catching tones to
                subtle, natural shades. Below are featured colors from the guide, each photographed on a sample made with grey cement.
              </p>
              <a className="btn btn--solid mt-6" href={pdf("DCS-Inc-Color-Selection-Guide.pdf")} target="_blank" rel="noreferrer">
                Download the full guide <ArrowUpRight aria-hidden />
                <NewTab />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="frame">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <div className="chips" role="group" aria-label="Filter by color family">
              {FAMILIES.map((f) => (
                <button
                  key={f}
                  type="button"
                  className="chip"
                  aria-pressed={family === f}
                  onClick={() => {
                    setFamily(f);
                    const first = f === "All" ? SWATCHES : SWATCHES.filter((s) => s.family === f);
                    if (!first.some((s) => s.no === selNo)) setSelNo(first[0].no);
                  }}
                >
                  {f}
                  <span className="count">{f === "All" ? SWATCHES.length : SWATCHES.filter((s) => s.family === f).length}</span>
                </button>
              ))}
            </div>
            {picked.length > 0 && (
              <Link to="contact" className="btn btn--ghost">
                Request {picked.length} {picked.length === 1 ? "sample" : "samples"} <ArrowRight aria-hidden />
              </Link>
            )}
          </div>
          <div className="ringset-wrap">
            <RingSet key={family} swatches={list} selected={selIdx} onSelect={(i) => setSelNo(list[i].no)} />
            <SwatchDetail s={sel} />
          </div>
          <p className="mono text-ink-3 mt-6">Tip: use the arrow keys to fan through the cards.</p>
        </div>
      </section>

      <section className="section band--panel" aria-labelledby="all-colors">
        <div className="frame">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <h2 id="all-colors" className="d-3">
              All featured colors
            </h2>
            <p className="mono text-ink-3">All samples made with grey cement</p>
          </div>
          <div className="swatch-grid">
            {SWATCHES.map((s) => (
              <button
                key={s.no}
                type="button"
                className="swatch-tile"
                aria-pressed={s.no === sel.no}
                onClick={() => {
                  if (!list.some((x) => x.no === s.no)) setFamily("All");
                  setSelNo(s.no);
                  requestAnimationFrame(() => {
                    const card = document.querySelector<HTMLElement>('.ringcard[aria-checked="true"]');
                    card?.closest(".ringset-wrap")?.scrollIntoView({ block: "start" });
                    card?.focus({ preventScroll: true });
                  });
                }}
              >
                <Strip img={s.img} style={{ backgroundColor: s.hex }} />
                <span className="swatch-tile__label">
                  <b>#{s.no}</b>
                  <span>{s.name}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="spec mt-14">
            <p className="eyebrow spec__label">Color disclaimer</p>
            <div className="spec__body prose">
              <p>
                Screens and printers cannot reproduce concrete color exactly. Finished color depends on cement, sand, aggregate, mix
                design, dosage, curing and finishing. Confirm every color with physical samples made with your materials. DCS ring
                sets, strip kits and pigment quarts are free.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="frame">
          <p className="eyebrow mb-6">Order color as</p>
          <Related
            items={[
              { to: "dry-pigment", title: "Dry pigment & small bags", note: "50-lb bags, bulk, private label, and pre-weighed bags from 50 g to 49 lb." },
              { to: "liquid-color", title: "Liquid color & dispensing", note: "Base colors, preblends and automation." },
              { to: "laboratory-color-sample-services", title: "Custom matching", note: "Match an existing building or create a custom color." },
            ]}
          />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
