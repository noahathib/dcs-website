import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { MARKETS, PROJECTS, type Market } from "@/data/content";
import { docById, pdf } from "@/data/site";
import { Link } from "@/lib/router";
import { Img } from "@/components/Img";
import { CtaBand, NewTab, PageHero, PullQuote, Related, SectionHead } from "@/components/Bits";
import { Masonry } from "@/components/Gallery";
import { Downloads, Split } from "./Products";

type Shelf = { name: string; img: string; note: string; to?: string; doc?: string };
const SHELF: Shelf[] = [
  { name: "Dry pigment", img: "pallet-25", note: "50-lb bags, bulk and 4,000+ standard colors.", to: "dry-pigment" },
  { name: "Small bags", img: "dry-less-small", note: "Pre-weighed bags from 50 g to 49 lb.", doc: "small-bag" },
  { name: "Liquid color", img: "tote-drums", note: "Liquid base colors and automated dispensing.", doc: "liquid" },
  { name: "Granular", img: "granular-spill", note: "Four-color base system with buff granules.", to: "granular" },
];

function ProductShelf({ title }: { title: string }) {
  return (
    <section className="section band--panel">
      <div className="frame">
        <SectionHead eyebrow="Products" title={title} />
        <div className="forms mt-12">
          {SHELF.map((s) => {
            const inner = (
              <>
                <div className="form-col__img">
                  <Img name={s.img} alt="" style={s.img === "granular-spill" ? undefined : { mixBlendMode: "multiply" }} />
                </div>
                <h3 className="d-4">{s.name}</h3>
                <p className="mt-2 text-ink-2 text-[0.95rem]">{s.note}</p>
                <span className="arrow-link">
                  {s.doc ? "Open flyer (PDF)" : `Explore ${s.name.toLowerCase()}`} {s.doc ? <ArrowUpRight aria-hidden /> : <ArrowRight aria-hidden />}
                  {s.doc && <NewTab />}
                </span>
              </>
            );
            return s.doc ? (
              <a key={s.name} className="form-col rv" href={pdf(docById(s.doc).file)} target="_blank" rel="noreferrer">
                {inner}
              </a>
            ) : (
              <Link key={s.name} className="form-col rv" to={s.to!}>
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProjectWall({ market, title, exclude }: { market: Market; title: ReactNode; exclude?: string }) {
  const items = PROJECTS.filter((p) => p.market === market && p.img !== exclude);
  return (
    <section className="section">
      <div className="frame">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10 rv">
          <div>
            <p className="eyebrow">Projects</p>
            <h2 className="d-3 mt-3">{title}</h2>
          </div>
          <Link to="projects" className="arrow-link">
            All projects <ArrowRight aria-hidden />
          </Link>
        </div>
        <Masonry items={items} showMarket={false} />
      </div>
    </section>
  );
}

const OTHER = (current: string) =>
  MARKETS.filter((m) => m.to !== current).map((m) => ({ to: m.to, title: m.name, note: m.short.split(".")[0] + "." }));

/* ------------------------------------------------------------------ */

export function IndustriesOverview({ route }: { route: string }) {
  return (
    <>
      <PageHero
        route={route}
        eyebrow="Industries"
        title={
          <>
            Color for every concrete product <strong>we serve.</strong>
          </>
        }
        lead="Collectively, the DCS team has hundreds of years of experience getting color right in concrete, from precast to manufactured stone veneer, cast stone, segmental retaining wall units, pavers, concrete masonry units, roof tile and more."
      />
      <section className="section">
        <div className="frame grid gap-x-[var(--col-gap)] gap-y-14 md:grid-cols-2">
          {MARKETS.map((m) => (
            <Link key={m.to} to={m.to} className="group rv block">
              <div className="ph-frame" style={{ aspectRatio: "3 / 2" }}>
                <Img name={m.img} alt="" className="transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-[var(--rule)] pt-4">
                <h2 className="d-3">{m.name}</h2>
                <ArrowRight aria-hidden className="w-6 h-6 shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-3 text-ink-2" style={{ maxWidth: "52ch" }}>
                {m.short}
              </p>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}

/* ------------------------------------------------------------------ */

export function Precast({ route }: { route: string }) {
  return (
    <>
      <PageHero
        route={route}
        eyebrow="Architectural precast"
        title={
          <>
            The supplier of choice for <strong>architectural precast concrete.</strong>
          </>
        }
        lead="No matter the concrete application, DCS has your color solution. We literally helped write the standards for color in precast concrete."
        img="texas-health-frisco"
        imgAlt="Texas Health Frisco hospital campus with buff precast facades at sunrise"
        caption={<span>Texas Health Frisco</span>}
      />
      <section className="section">
        <div className="frame">
          <SectionHead eyebrow="Our offerings" title={<>More than a one-size-fits-all solution.</>}>
            <p>
              DCS specializes in enhancing the aesthetic and functional qualities of precast concrete with premium iron oxide
              pigments, tailored to the rigorous demands of the precast industry for consistent color performance.
            </p>
            <p>
              Blend your own color with our Base Color System or pick from 4,000 standard colors in our dry pigment line. Use our
              Small Bag program to get the right amount of perfect, preblended dry pigment every time. Or choose liquid color and our
              state-of-the-art automated dispensing system. We pride ourselves on helping customers choose a color solution that fits
              them like a glove.
            </p>
          </SectionHead>
          <div className="spec mt-14">
            <div className="spec__label" />
            <div className="spec__body">
              <div className="grid md:grid-cols-3 gap-x-8">
                {[
                  { t: "Iron oxide pigments", d: "A wide selection of standard and custom colors, engineered for durability and vibrant finishes in precast.", doc: "wp-integral", cta: "White paper: Coloring Concrete Using Integral Pigments" },
                  { t: "Custom color matching", d: "Precise formulations to bring your unique design visions to life.", to: "laboratory-color-sample-services", cta: "Color matching services" },
                  { t: "Technical expertise", d: "Dedicated support for pigment integration, mix design optimization and troubleshooting.", doc: "wp-quality", cta: "White paper: Quality and Production Control" },
                ].map((c) => (
                  <div key={c.t} className="py-6 border-t-2 border-[var(--ink)] rv flex flex-col">
                    <h3 className="d-5">{c.t}</h3>
                    <p className="mt-2 text-ink-2">{c.d}</p>
                    <div className="mt-5">
                      {c.doc ? (
                        <a className="arrow-link" href={pdf(docById(c.doc).file)} target="_blank" rel="noreferrer">
                          {c.cta} <ArrowUpRight aria-hidden />
                          <NewTab />
                        </a>
                      ) : (
                        <Link className="arrow-link" to={c.to!}>
                          {c.cta} <ArrowRight aria-hidden />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="spec mt-16">
            <div className="spec__label" />
            <div className="spec__body spec__body--narrow">
              <PullQuote id="bunkers" />
            </div>
          </div>
        </div>
      </section>
      <ProductShelf title="Products for precasters" />
      <ProjectWall market="precast" title="Precast in DCS color" exclude="texas-health-frisco" />
      <section className="section--tight">
        <div className="frame">
          <p className="eyebrow mb-6 rv">Other industries</p>
          <Related items={OTHER("precast")} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}

/* ------------------------------------------------------------------ */

export function MSV({ route }: { route: string }) {
  return (
    <>
      <PageHero
        route={route}
        eyebrow="Manufactured stone veneer"
        title={
          <>
            Pigments and color hardeners for <strong>beautiful stone veneer.</strong>
          </>
        }
        lead="Color is crucial to realistic manufactured stone veneer. Our MSV customers tell us DCS color sets their products apart from their competitors'."
        img="quarry-msv"
        imgAlt="Dark grey and charcoal Tru-Fit panelized stone veneer"
        caption={<span>Tru-Fit panelized MSV, Quarry Ridge Stone</span>}
      />
      <section className="section">
        <div className="frame">
          <div className="spec rv">
            <p className="eyebrow spec__label">The market</p>
            <div className="spec__body spec__body--narrow">
              <p className="d-4" style={{ fontWeight: 450 }}>
                MSV is taking off in both residential and commercial markets. It ranks number one in cost vs. value among 22
                remodeling products and projects in Remodeling magazine's Cost vs. Value Report.
              </p>
            </div>
          </div>
          <div className="mt-16">
            <Split img="trufit-mold" alt="Color hardener being brushed into a Tru-Fit stone mold" product>
              <p className="eyebrow eyebrow--oxide">Custom palettes</p>
              <h2 className="d-3 mt-3">A palette built for your line.</h2>
              <div className="prose">
                <p>
                  DCS has created custom color palettes for a number of MSV manufacturers, and we help each customer find the best
                  color solution among our many products and services.
                </p>
              </div>
            </Split>
            <Split img="hardener-pallet" alt="Pails of Dynamicast color hardener" product flip>
              <p className="eyebrow eyebrow--oxide">Dynamicast color hardener</p>
              <h2 className="d-3 mt-3">Surface color variability that closely emulates nature.</h2>
              <div className="prose">
                <p>
                  Dynamicast makes it easier for MSV producers to deliver the realistic colors the market demands. It is a blend of
                  pigment, cement, sand and other proprietary ingredients that is versatile and easy to work with.
                </p>
                <p>
                  These ready-to-use, surface-applied colors can be dry-shaken into MSV molds or mixed with water and painted in.
                  DCS stocks Dynamicast in 10 standard colors and creates custom colors to match the palette of any MSV line.
                </p>
                <p>
                  See <Link to="dry-pigment">Dry Pigment &amp; Color Hardener</Link> for the complete line, then give us a call to
                  talk about how DCS color can help you sell more MSV.
                </p>
              </div>
            </Split>
          </div>
          <div className="spec mt-16">
            <div className="spec__label" />
            <div className="spec__body spec__body--narrow">
              <PullQuote id="fox" />
            </div>
          </div>
        </div>
      </section>
      <ProductShelf title="Products for MSV producers" />
      <ProjectWall market="msv" title="Stone veneer in DCS color" exclude="quarry-msv" />
      <section className="section--tight band--panel">
        <div className="frame">
          <Downloads title="Case studies" ids={["cs-quarry", "cs-norse"]} />
        </div>
      </section>
      <section className="section--tight">
        <div className="frame">
          <p className="eyebrow mb-6 rv">Other industries</p>
          <Related items={OTHER("msv")} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}

/* ------------------------------------------------------------------ */

export function CastStone({ route }: { route: string }) {
  return (
    <>
      <PageHero
        route={route}
        eyebrow="Cast stone"
        title={
          <>
            DCS puts the color in <strong>cast stone.</strong>
          </>
        }
        lead="Cast stone, with strength that can exceed that of the natural product, is beautiful and durable. Control of the color palette is one reason architects specify cast stone instead of natural stone."
        img="unt-frisco-05"
        imgPos="center 35%"
        imgAlt="Cast stone arcade and columns at UNT Frisco"
        caption={<span>UNT Frisco</span>}
      />
      <section className="section">
        <div className="frame">
          <SectionHead eyebrow="The leading supplier" title={<>Get cast stone color right, batch after batch.</>}>
            <p>DCS is the leading supplier of pigment to the cast stone industry. We help cast stone manufacturers get color right.</p>
            <p>
              Choose from our full range of pigment options: bulk dry pigment, 50-pound bags or custom-weight small bags. Some
              producers choose DCS liquid pigment, either with our liquid base color system and dispensing equipment or in one of
              our convenient liquid container sizes.
            </p>
            <p>
              Our strict quality control program ensures the pigment you receive is the same time after time. Whether you produce
              wet cast or dry tamp cast stone, DCS can help you create mix designs that are easily repeatable and consistent.
            </p>
          </SectionHead>
          <div className="spec mt-14 rv">
            <div className="spec__label" />
            <div className="spec__body flex flex-wrap items-center gap-6">
              <a href="https://caststone.org/" target="_blank" rel="noreferrer" className="block bg-white p-3" style={{ width: 160 }}>
                <Img name="csi-logo" alt="Cast Stone Institute" />
                <NewTab />
              </a>
              <p className="d-5" style={{ maxWidth: "26ch" }}>
                DCS is a proud member of the Cast Stone Institute.
              </p>
            </div>
          </div>
          <div className="spec mt-16">
            <div className="spec__label" />
            <div className="spec__body spec__body--narrow">
              <PullQuote id="edwards" />
            </div>
          </div>
        </div>
      </section>
      <ProductShelf title="Products for cast stone producers" />
      <ProjectWall market="cast-stone" title="Cast stone in DCS color" exclude="unt-frisco-05" />
      <section className="section--tight">
        <div className="frame">
          <p className="eyebrow mb-6 rv">Other industries</p>
          <Related items={OTHER("cast-stone")} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}

/* ------------------------------------------------------------------ */

export function BuildingSupply({ route }: { route: string }) {
  const packs = [
    { img: "bag-master", t: "Bag Master cases", d: "Cases of small bags for the showroom shelf, normally 6 bags per case.", alt: "Bag Master case of DCS small bags" },
    { img: "pallet-box", t: "Pallet boxes", d: "Heat-sealed plastic small bags, up to 200 bags per container, for larger job sites.", alt: "Pallet box of heat-sealed DCS small bags" },
    { img: "masonry-smallbags", t: "Small bags", d: "Pre-weighed small bags, each labelled with color number, weight and lot number.", alt: "DCS-branded small bags of dry pigment" },
  ];
  return (
    <>
      <PageHero
        route={route}
        eyebrow="Building supply"
        title={
          <>
            Pre-weighed, sealed and ready to sell: <strong>DCS makes color easy.</strong>
          </>
        }
        lead="With today's emphasis on color in construction, contractors need to source what gets the job done. The last thing they want is inconsistent color."
        img="bs-capture"
        imgAlt="Bridge built of grey split-face concrete block, with light caps and metal railings, arching over water"
      />
      <section className="section">
        <div className="frame">
          <SectionHead eyebrow="Color sells" title={<>Keep contractors coming back to your yard.</>}>
            <p>
              DCS pigments make it easy to get color right. Stocking our color in convenient small bags and larger semi-bulk 50-lb
              bags keeps contractors happy and coming back for supplies. Display our samples on your counter to show customers what
              you offer. Small bag pigments make it easy for masons and others to get the right color, and keep it consistent
              throughout a project.
            </p>
          </SectionHead>
          <div className="spec mt-16">
            <div className="spec__label" />
            <div className="spec__body spec__body--narrow">
              <PullQuote id="wolf" />
            </div>
          </div>
        </div>
      </section>
      <section className="section band--panel">
        <div className="frame">
          <SectionHead eyebrow="Packaging options" title={<>Shelf, job site or your own brand.</>} />
          <div className="grid gap-x-6 gap-y-10 md:grid-cols-3 mt-12">
            {packs.map((p) => (
              <figure key={p.t} className="rv">
                <div className="product-shot" style={{ aspectRatio: "939 / 600" }}>
                  <Img name={p.img} alt={p.alt} />
                </div>
                <figcaption className="mt-4">
                  <b className="d-5 block">{p.t}</b>
                  <span className="text-ink-2 text-[0.95rem]">{p.d}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="spec mt-12 rv">
            <p className="eyebrow spec__label">Private label</p>
            <p className="spec__body spec__body--narrow d-5" style={{ fontWeight: 450 }}>
              Private branding gives you the ability to create your own line of color to bring to the marketplace. We'll customize
              our packaging with your logo and color numbers, so you have a completely unique product line.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 rv">
            <a className="arrow-link" href={pdf(docById("small-bag").file)} target="_blank" rel="noreferrer">
              Small Bag Program flyer (PDF) <ArrowUpRight aria-hidden />
              <NewTab />
            </a>
            <Link to="dry-pigment" className="arrow-link">
              The full dry pigment line <ArrowRight aria-hidden />
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="frame">
          <Split img="strip-kit-display" alt="A custom strip kit case displaying a line of concrete colors" ratio="4 / 3" wide>
            <p className="eyebrow eyebrow--oxide">Counter displays</p>
            <h3 className="d-3 mt-3">A strip kit with your line of colors.</h3>
            <div className="prose">
              <p>Contact DCS for a custom-designed strip kit displaying your line of colors, ready for the counter.</p>
            </div>
            <Link to="contact" className="btn btn--solid mt-6">
              Ask about a strip kit <ArrowRight aria-hidden />
            </Link>
          </Split>
          <Split img="mortar-holton" alt="Brick facade with colored mortar joints and a wall lantern" caption="Adding color to mortar helps create an elegant facade." ratio="660 / 422" flip>
            <p className="eyebrow eyebrow--oxide">Masonry</p>
            <h3 className="d-3 mt-3">Consistent mortar color, start to finish.</h3>
            <div className="prose">
              <p>
                Pre-measured small bags let masons add just the right amount of color to every batch of mortar. Henry Frerk Sons
                used a complete library of DCS color samples to launch its restoration business; read how in the case study.
              </p>
            </div>
            <a className="arrow-link mt-5" href={pdf(docById("cs-frerk").file)} target="_blank" rel="noreferrer">
              Henry Frerk Sons case study (PDF) <ArrowUpRight aria-hidden />
              <NewTab />
            </a>
          </Split>
        </div>
      </section>
      <section className="section--tight">
        <div className="frame">
          <p className="eyebrow mb-6 rv">Other industries</p>
          <Related items={OTHER("building-supply")} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
