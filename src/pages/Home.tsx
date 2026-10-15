import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { MARKETS, PROJECTS, SWATCHES } from "@/data/content";
import { docById, pdf } from "@/data/site";
import { Link } from "@/lib/router";
import { Img, Strip } from "@/components/Img";
import { CtaBand, DocCard, ExternalLink } from "@/components/Bits";
import { RingSet, SwatchDetail } from "@/components/RingSet";
import { BaseColorSystem } from "@/components/Systems";
import { Rail, Voices } from "@/components/Gallery";
import { BurstHero, FeaturedProjects, Ledger } from "@/components/BurstHero";

/** A real-concrete chip of one burst plume. The next five section labels carry them in plume order, red to charcoal,
    so reading down the page reads the burst left to right. */
const PlumeChip = ({ img }: { img: string }) => <Strip img={img} className="plume-chip" />;

function Markets() {
  const [active, setActive] = useState(0);
  return (
    <section className="section" aria-labelledby="markets-h">
      <div className="frame">
        <div className="spec rv">
          <div className="spec__label">
            <PlumeChip img="sw-9" />
            <p className="eyebrow">Who we serve</p>
          </div>
          <div className="spec__body">
            <h2 id="markets-h" className="d-2" style={{ maxWidth: "18ch" }}>
              Color for the people who make <strong>concrete products.</strong>
            </h2>
          </div>
        </div>
        <div className="markets mt-12">
          <div className="markets__list">
            {MARKETS.map((m, n) => (
              <Link
                key={m.to}
                to={m.to}
                className="market-row"
                data-active={n === active}
                onPointerEnter={() => setActive(n)}
                onFocus={() => setActive(n)}
              >
                <h3>{m.name}</h3>
                <span className="mono" aria-hidden>
                  View →
                </span>
                <p>{m.short}</p>
                <span className="market-row__img">
                  <Img name={m.img} alt="" />
                </span>
              </Link>
            ))}
          </div>
          <div className="markets__view" aria-hidden>
            <div className="ph-frame">
              {MARKETS.map((m, n) => (
                <Img key={m.img} name={m.img} alt="" className={n === active ? "is-active" : ""} />
              ))}
            </div>
            <p className="ph-caption mono">
              <span>{MARKETS[active].name}</span>
              <span>
                {String(active + 1).padStart(2, "0")} / {String(MARKETS.length).padStart(2, "0")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const FORMS = [
  {
    to: "dry-pigment", name: "Dry pigment", img: "everything-dry", alt: "DCS dry pigment in paper bags, small bags and pails",
    rows: [
      ["Form", "Pure mineral pigment with unlimited shelf life"],
      ["Packaging", "50-lb bags, Custom Small Bags from 50 g to 49 lb, soluble bags, private label"],
      ["Dosing", "Weighed by a trained operator, or add the whole pre-measured bag"],
    ],
  },
  {
    to: "liquid-color", name: "Liquid color", img: "tote-drums", alt: "DCS liquid color in a tote and drums",
    rows: [
      ["Form", "Dry pigment suspended in a water-based slurry"],
      ["Benefit", "Excellent dispersion and faster color development"],
      ["Dosing", "Ready for fully automated DCS liquid dispensing"],
    ],
  },
  {
    to: "granular", name: "Granular", img: "granular-spill", alt: "Piles of red, yellow, black and buff DCS granular pigment",
    rows: [
      ["Form", "Encapsulated pellets that break down to powder in the mix"],
      ["Base colors", "Red, yellow, black and the industry's only buff granule"],
      ["Dosing", "Automated with a DCS-approved dispenser and saved recipes"],
    ],
  },
  {
    to: "dry-pigment", name: "Dynamicast color hardener", img: "hardener-bucket", alt: "A pallet of DCS Dynamicast color hardener pails",
    rows: [
      ["Form", "Ready-to-use blend of pigment, cement, sand and more"],
      ["Use", "Dry-shake into MSV molds, or mix with water and brush on"],
      ["Range", "10 standard colors plus custom, in 60-lb pails"],
    ],
  },
];

function Forms() {
  return (
    <section className="section band--panel" aria-labelledby="forms-h">
      <div className="frame">
        <div className="spec rv">
          <div className="spec__label">
            <PlumeChip img="sw-71" />
            <p className="eyebrow">Products</p>
          </div>
          <div className="spec__body">
            <h2 id="forms-h" className="d-2" style={{ maxWidth: "20ch" }}>
              Color for every plant. <strong>Three ways into the mix, one for the surface.</strong>
            </h2>
            <p className="prose mt-6">
              Choose the form that fits your plant: bags weighed by a skilled hand, pre-measured bags that remove weighing, or
              liquid and granular color dosed by machine. For manufactured stone veneer, Dynamicast color hardener adds color
              to the surface.
            </p>
          </div>
        </div>
        <div className="forms mt-12">
          {FORMS.map((f) => (
            <article key={f.name} className="form-col rv">
              <div className="form-col__img">
                <Img name={f.img} alt={f.alt} style={f.img === "granular-spill" ? undefined : { mixBlendMode: "multiply", objectFit: "contain", padding: "6%" }} />
              </div>
              <h3 className="d-4">{f.name}</h3>
              <dl>
                {f.rows.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <Link to={f.to} className="arrow-link">
                {f.name === "Dynamicast color hardener" ? "Color hardener details" : `Explore ${f.name.toLowerCase()}`} <ArrowRight aria-hidden />
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 rv">
          <Link to="products" className="arrow-link">
            Compare every product side by side <ArrowRight aria-hidden />
          </Link>
          <Link to="automation" className="arrow-link">
            Automated dispensing systems <ArrowRight aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ColorTeaser() {
  const [sel, setSel] = useState(3);
  return (
    <section className="section" aria-labelledby="color-h">
      <div className="frame">
        <div className="spec rv">
          <div className="spec__label">
            <PlumeChip img="sw-615" />
            <p className="eyebrow">Color Selection Guide</p>
          </div>
          <div className="spec__body">
            <h2 id="color-h" className="d-2" style={{ maxWidth: "19ch" }}>
              Every card is a photograph of <strong>real concrete.</strong>
            </h2>
            <p className="prose mt-6">
              Fan through featured colors from the DCS Color Selection Guide. Each card shows a sample made with grey cement, the
              way a DCS ring set shows color on the bench.
            </p>
          </div>
        </div>
        <div className="ringset-wrap mt-12">
          <RingSet swatches={SWATCHES} selected={sel} onSelect={setSel} />
          <div className="swatch-detail rv">
            <SwatchDetail s={SWATCHES[sel]} headingLevel={3} />
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <Link to="color-guide" className="arrow-link">
                Open the full color guide <ArrowRight aria-hidden />
              </Link>
              <ExternalLink href={pdf("DCS-Inc-Color-Selection-Guide.pdf")}>Download the guide (PDF)</ExternalLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const APART = [
  { t: "We helped write the standards for color in precast concrete.", tag: "Precast", to: "precast" },
  { t: "A color lab that matches existing buildings and builds custom colors with your own sand and aggregate.", tag: "Laboratory", to: "laboratory-color-sample-services" },
  { t: "Liquid and granular dispensers specified, built and serviced by DCS, a leader in plant automation since the mid-1990s.", tag: "Automation", to: "automation" },
  { t: "The industry's only buff granule, in a four-color granular base system.", tag: "Granular", to: "granular" },
  { t: "A strict quality control program, so the pigment you receive is the same time after time.", tag: "Quality", to: "cast-stone" },
  { t: "A fourth-generation family business with an average employee tenure of 16 years.", tag: "Company", to: "our-business" },
];

function Apart() {
  return (
    <section className="section band--deep" aria-labelledby="apart-h">
      <div className="frame grid12 gap-y-12">
        <div className="col-span-12 lg:col-span-5 rv">
          <PlumeChip img="sw-620" />
          <p className="eyebrow">Why DCS</p>
          <h2 id="apart-h" className="d-2 mt-4">
            More than pigment in a bag.
          </h2>
          <figure className="mt-10">
            <div className="ph-frame" style={{ aspectRatio: "432 / 310", maxWidth: 520 }}>
              <Img name="history-1" alt="Historic photo of the Ricketson Color Corp. building beside a rail yard" />
            </div>
            <figcaption className="ph-caption mono">
              <span>Ricketson Color Corp., historic photo</span>
            </figcaption>
          </figure>
        </div>
        <ul className="col-span-12 lg:col-start-7 lg:col-span-6 rv" style={{ listStyle: "none", padding: 0 }}>
          {APART.map((a) => (
            <li key={a.t}>
              <Link to={a.to} className="related-line">
                <span className="mono">{a.tag}</span>
                <span className="d-5" style={{ fontWeight: 520 }}>
                  {a.t}
                </span>
                <ArrowRight aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Home() {
  const featured = ["uw-eastpark-42", "texas-health-frisco", "unt-frisco-05", "nordstrom-8", "trufit-fireplace", "galen-66", "prosper-hs-12", "drphillips", "ledgestone-glacier", "tamiami"].map(
    (k) => PROJECTS.find((p) => p.img === k)!,
  );
  return (
    <>
      <BurstHero />
      <Ledger />
      <FeaturedProjects />
      <Markets />
      <Forms />
      <section className="section" aria-label="Base Color System">
        <div className="frame">
          <BaseColorSystem chip={<PlumeChip img="sw-25" />} />
        </div>
      </section>
      <div className="frame">
        <div className="strip-bar" aria-hidden style={{ height: 6 }}>
          {SWATCHES.map((s) => (
            <Strip key={s.no} img={s.img} />
          ))}
        </div>
      </div>
      <ColorTeaser />
      <Apart />
      <section className="section" aria-labelledby="voices-h">
        <div className="frame">
          <div className="spec rv">
            <p className="eyebrow spec__label">From our customers</p>
            <div className="spec__body">
              <h2 id="voices-h" className="d-2" style={{ maxWidth: "18ch" }}>
                Producers who count on DCS color.
              </h2>
            </div>
          </div>
          <div className="mt-12 rv">
            <Voices />
          </div>
        </div>
      </section>
      <section className="section--tight band--panel" aria-labelledby="projects-h">
        <div className="frame">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-8 rv">
            <div>
              <p className="eyebrow">Projects</p>
              <h2 id="projects-h" className="d-3 mt-3">
                Built in DCS color
              </h2>
            </div>
            <Link to="projects" className="arrow-link">
              See all projects <ArrowRight aria-hidden />
            </Link>
          </div>
          <Rail items={featured} />
        </div>
      </section>
      <section className="section" aria-labelledby="library-h">
        <div className="frame">
          <div className="spec rv">
            <p className="eyebrow spec__label">Technical library</p>
            <div className="spec__body">
              <h2 id="library-h" className="d-2" style={{ maxWidth: "20ch" }}>
                The engineering behind consistent color.
              </h2>
              <p className="prose mt-6">
                White papers, product flyers, case studies and safety data sheets. Everything opens as a PDF.
              </p>
            </div>
          </div>
          <div className="spec mt-12">
            <div className="spec__label" />
            <div className="spec__body">
              <div className="docs rv">
                {["wp-integral", "wp-quality", "cs-awards"].map((id) => (
                  <DocCard key={id} doc={docById(id)} />
                ))}
              </div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                <Link to="resource-library" className="arrow-link">
                  Browse the resource library <ArrowRight aria-hidden />
                </Link>
                <Link to="safety-data-sheets" className="arrow-link">
                  Safety data sheets <ArrowRight aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CtaBand titleClassName="d-hero" />
    </>
  );
}
