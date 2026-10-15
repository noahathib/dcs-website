import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { CONTACT, docById } from "@/data/site";
import { PEOPLE } from "@/data/content";
import { Link } from "@/lib/router";
import { Img } from "@/components/Img";
import { CopyButton, CtaBand, DocRow, PageHero, PullQuote, Related, SectionHead } from "@/components/Bits";
import { BaseColorSystem, PackagingScale } from "@/components/Systems";

type SplitProps = { img: string; alt: string; caption?: string; product?: boolean; flip?: boolean; wide?: boolean; ratio?: string; children: ReactNode };
export function Split({ img, alt, caption, product, flip, wide, ratio, children }: SplitProps) {
  return (
    <div className={`split rv ${flip ? "split--flip" : ""} ${wide ? "split--wide" : ""}`}>
      <figure className="split__media">
        {product ? (
          <div className="product-shot">
            <Img name={img} alt={alt} />
          </div>
        ) : (
          <div className="ph-frame" style={{ aspectRatio: ratio ?? "4 / 3" }}>
            <Img name={img} alt={alt} />
          </div>
        )}
        {caption && (
          <figcaption className="ph-caption mono">
            <span>{caption}</span>
          </figcaption>
        )}
      </figure>
      <div className="split__text min-w-0">{children}</div>
    </div>
  );
}

export function Downloads({ ids, title = "Downloads" }: { ids: string[]; title?: string }) {
  return (
    <div className="spec rv">
      <p className="eyebrow spec__label">{title}</p>
      <div className="spec__body">
        {ids.map((id) => (
          <DocRow key={id} doc={docById(id)} />
        ))}
      </div>
    </div>
  );
}

const LEARN_MORE = [
  { to: "automation", title: "Automation", note: "Liquid and granular dispensers that weigh every batch." },
  { to: "laboratory-color-sample-services", title: "Laboratory & matching", note: "Custom matches, mix design analysis, free samples." },
  { to: "resource-library", title: "Resource library", note: "White papers, flyers and case studies." },
  { to: "color-guide", title: "Color guide", note: "Featured colors on real concrete samples." },
];

/* ------------------------------------------------------------------ */

export function ProductsOverview({ route }: { route: string }) {
  const cols = [
    { to: "dry-pigment", name: "Dry pigment" },
    { to: "dry-pigment", name: "Dynamicast color hardener" },
    { to: "liquid-color", name: "Liquid color" },
    { to: "granular", name: "Granular" },
  ];
  const rows: [string, string[]][] = [
    ["What it is", ["Pure mineral pigment powder with unlimited shelf life.", "Ready-to-use, surface-applied accent color: a proprietary blend of pigment, cement, sand and other ingredients.", "Slurry of DCS dry pigment suspended in a water-based medium.", "Encapsulated pellets of powder pigment that break down in the mix to dry powder pigment."]],
    ["Packaging", ["Standard 50-lb bags; Custom Small Bags from 50 g to 49 lb; soluble bags up to 15 lb; bulk; private label.", "60-lb pails.", "Liquid containers, including totes and drums.", "Supersacks for automated dispensers."]],
    ["How it's dosed", ["Weighed by a trained operator, or added as a whole pre-measured bag.", "Dry-shaken into molds, or mixed with water and brushed on.", "Fully automated with a DCS liquid dispenser (pump rack and weigh vessel discharge into the mixer, then a clean water rinse), or supplied in convenient liquid container sizes.", "Fully automated when paired with a DCS-approved granular dispenser: accurate weighing and hundreds of saved recipes."]],
    ["Color range", ["4,000+ standard colors, plus custom matches.", "10 standard colors, plus custom colors.", "Five-pigment Liquid Base Color System makes thousands of colors; preblended colors too.", "Four-color base system, including the industry's only buff granule."]],
    ["Used in", ["Precast, cast stone, manufactured stone veneer and masonry.", "Manufactured stone veneer and other products.", "Ready-mixed concrete, precast wall panels, manufactured stone veneer, cast stone and more.", "Precast, manufactured stone veneer and cast stone."]],
  ];
  return (
    <>
      <PageHero
        route={route}
        eyebrow="Products"
        title={
          <>
            Iron oxide color, <strong>in the form your plant runs best.</strong>
          </>
        }
        lead="Every DCS product starts with the finest iron oxide and other minerals. Pick the form that fits your mix, your labor and your level of automation."
      />
      <section className="section">
        <div className="frame">
          <div className="table-wrap rv" role="region" aria-label="Product comparison" tabIndex={0}>
            <table className="cmp">
              <thead>
                <tr>
                  <td />
                  {cols.map((c) => (
                    <th key={c.name} scope="col">
                      <Link to={c.to} className="hover:text-[var(--oxide-ink)]">
                        {c.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([k, vals]) => (
                  <tr key={k}>
                    <th scope="row">{k}</th>
                    {vals.map((v, i) => (
                      <td key={i}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mono text-ink-3 mt-4">Compiled from DCS product pages. Ask DCS to confirm packaging for your order.</p>
        </div>
      </section>
      <section className="section band--panel">
        <div className="frame">
          <Related
            items={[
              { to: "dry-pigment", title: "Dry pigment & color hardener", note: "Bags, small bags, soluble bags, private label and Dynamicast." },
              { to: "liquid-color", title: "Liquid color", note: "Slurries and the Liquid Base Color System." },
              { to: "granular", title: "Granular", note: "All the benefits of dry powder, none of the mess." },
              { to: "automation", title: "Automated dispensing", note: "Liquid and granular dispensers." },
            ]}
          />
        </div>
      </section>
      <CtaBand />
    </>
  );
}

/* ------------------------------------------------------------------ */

export function DryPigment({ route }: { route: string }) {
  return (
    <>
      <PageHero
        route={route}
        eyebrow="Dry pigment & Dynamicast color hardener"
        title={
          <>
            Dry pigment and color hardener offer producers <strong>unlimited flexibility.</strong>
          </>
        }
        lead="DCS has offered dry pigment since 1890. Every dry color formulation is a pure mineral pigment with unlimited shelf life."
        img="everything-dry"
        imgAlt="DCS dry pigment packaging: 50-lb paper bags, small plastic bags and color hardener pails"
        caption={
          <>
            <span>50-lb bags · Custom Small Bags · soluble bags · Dynamicast pails</span>
            <span>Private label available</span>
          </>
        }
      />
      <section className="section">
        <div className="frame">
          <SectionHead eyebrow="Packaging" title={<>From a 50-gram bag to a 60-pound pail.</>}>
            <p>
              Dry pigment comes in standard 50-pound bags and a variety of other packaging, including Custom Small Bags and
              soluble bags. Private label packaging is also available.
            </p>
          </SectionHead>
          <div className="spec mt-10">
            <div className="spec__label" />
            <div className="spec__body">
              <PackagingScale />
            </div>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="frame">
          <Split img="small-bags-plastic" alt="Custom Small Bags of DCS dry pigment" product>
            <p className="eyebrow eyebrow--oxide">Custom Small Bags</p>
            <h3 className="d-3 mt-3">Custom Small Bags help eliminate weighing.</h3>
            <div className="prose">
              <p>
                Many DCS customers love our 50-pound bags of dry pigment. They have someone trained to precisely weigh the pigment
                and add just the right amount to the mix. Others reduce the chance of a mistake with Custom Small Bags: no weighing,
                just add the whole bag.
              </p>
              <p>
                Custom Small Bags range from 50 grams to 49 pounds. Pre-measured bags can help improve color accuracy and consistency
                and reduce the need for skilled labor, which makes life easier for manufacturers and mason contractors alike.
              </p>
              <p>
                Small bags can more than pay for themselves by saving time and headaches and preventing mistakes. Many customers,
                even those who used 50-pound bags for years, wind up loving them.
              </p>
            </div>
          </Split>
          <div className="spec mt-16">
            <div className="spec__label" />
            <div className="spec__body spec__body--narrow">
              <PullQuote id="berkhouse" />
            </div>
          </div>
          <Split img="soluble-bags" alt="DCS dry pigment in soluble bags" product flip>
            <p className="eyebrow eyebrow--oxide">Soluble bags</p>
            <h3 className="d-3 mt-3">Soluble bags make things even easier.</h3>
            <div className="prose">
              <p>
                DCS also offers dry pigment in custom-sized soluble bags up to 15 pounds. The bags are made of a material similar
                to laundry detergent pods: toss the whole bag of pigment into the mixer.
              </p>
              <p>No weighing, no opening bags.</p>
            </div>
          </Split>
          <Split img="hardener-bucket" alt="Pallet of DCS Dynamicast color hardener pails" product>
            <p className="eyebrow eyebrow--oxide">Dynamicast color hardener</p>
            <h3 className="d-3 mt-3">Dynamicast adds color variation to manufactured stone.</h3>
            <div className="prose">
              <p>
                Dynamicast Color Hardener is a line of ready-to-use, surface-applied accent colors for manufactured stone veneer and
                other products. It is a proprietary blend of pigment, cement, sand and other ingredients that is versatile and easy
                to work with.
              </p>
              <p>
                Dry-shake it into molds, or mix it with water and brush it on. Dynamicast hardeners produce denser concrete and varied,
                natural-looking surface color that helps give the appearance of authentic stone.
              </p>
              <ul>
                <li>10 standard colors in stock, custom colors available</li>
                <li>60-lb pails</li>
              </ul>
            </div>
          </Split>
        </div>
      </section>
      <section className="section band--panel">
        <div className="frame">
          <Downloads ids={["small-bag", "wp-integral", "color-guide", "black", "buff"]} />
        </div>
      </section>
      <section className="section">
        <div className="frame">
          <p className="eyebrow mb-6 rv">Learn more</p>
          <Related items={LEARN_MORE} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}

/* ------------------------------------------------------------------ */

export function LiquidColor({ route }: { route: string }) {
  return (
    <>
      <PageHero
        route={route}
        eyebrow="Liquid color"
        title={
          <>
            Let the color flow with DCS liquid color and <strong>automated dispensing.</strong>
          </>
        }
        lead="DCS liquid pigments are slurries of our dry pigment suspended in a water-based medium. They make automated pigment addition possible and disperse well for faster color development."
        img="liquid-system"
        imgAlt="DCS liquid color dispensing system with pumps and a weigh vessel"
        imgPos="center 60%"
        caption={<span>DCS liquid color dispensing system</span>}
      />
      <section className="section">
        <div className="frame">
          <div className="spec">
            <div className="spec__label" />
            <div className="spec__body spec__body--narrow">
              <PullQuote id="everding" />
            </div>
          </div>
        </div>
      </section>
      <section className="section--tight">
        <div className="frame">
          <Split img="tote-rack" alt="Liquid color totes on a rack beside dispensing equipment" ratio="1 / 1" wide>
            <p className="eyebrow eyebrow--oxide">Automated liquid dispensing</p>
            <h2 className="d-3 mt-3">Exactly what each batch needs, weighed for you.</h2>
            <div className="prose">
              <p>
                DCS liquid color dispensing equipment automates pigment addition at your plant, saving labor and reducing the
                possibility of error. Whether you produce ready-mixed concrete, precast wall panels, manufactured stone veneer, cast
                stone or another concrete product, the dispenser accurately weighs exactly what you need for each batch.
              </p>
              <p>
                Every DCS dispenser is built around a pump rack and a weigh vessel. The pump rack moves material from storage to
                the vessel; the vessel weighs the proper amount of each material and discharges it into your mixer,
                followed by a clean water rinse. Gravity discharge ensures everything weighed reaches the mixer.
              </p>
            </div>
          </Split>
        </div>
      </section>
      <section className="section band--panel">
        <div className="frame">
          <BaseColorSystem initial="liquid" showPhoto={false} />
          <p className="prose mt-10 rv" style={{ maxWidth: "62ch" }}>
            The Liquid Base Color System offers the ultimate in in-house customization, inventory management and automation. It
            includes synthetic red, yellow and black iron oxides plus natural red iron oxide and ochre. From these five pigments you
            can create thousands of colors, dispensed automatically with DCS liquid color and proprietary dispensing equipment.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="frame grid12 gap-y-6">
          <figure className="col-span-12 md:col-span-7 rv">
            <div className="ph-frame" style={{ aspectRatio: "16 / 9" }}>
              <Img name="plant-1522" alt="Yellow color spreading across a concrete form on a production floor" />
            </div>
            <figcaption className="ph-caption mono">
              <span>On the production floor</span>
            </figcaption>
          </figure>
          <figure className="col-span-12 md:col-span-5 rv">
            <div className="product-shot" style={{ aspectRatio: "939 / 600" }}>
              <Img name="drum-55" alt="A drum of DCS liquid color" />
            </div>
            <figcaption className="ph-caption mono">
              <span>Liquid color by the drum</span>
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="section--tight band--panel">
        <div className="frame">
          <Downloads ids={["liquid", "base", "cs-enterprise"]} />
        </div>
      </section>
      <section className="section">
        <div className="frame">
          <p className="eyebrow mb-6 rv">Learn more</p>
          <Related items={LEARN_MORE} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}

/* ------------------------------------------------------------------ */

export function Granular({ route }: { route: string }) {
  return (
    <>
      <PageHero
        route={route}
        eyebrow="Granular pigment"
        title={
          <>
            All the benefits of dry powder, <strong>none of the mess.</strong>
          </>
        }
        lead="DCS granular pigments are encapsulated pellets of powder pigment. Mixed into concrete, they break down until only dry powder pigment remains."
        img="granular-spill"
        imgAlt="Four piles of DCS granular pigment: red, yellow, buff and black"
        caption={
          <>
            <span>Synthetic red · synthetic yellow · natural buff · synthetic black</span>
            <span>Four-color base system</span>
          </>
        }
      />
      <section className="section">
        <div className="frame">
          <SectionHead eyebrow="Granular Base Color System" title={<>Four granules, thousands of colors, and the industry's only buff granule.</>}>
            <p>
              The DCS Granular Color System offers great flexibility in inventory management and customization. It includes red,
              yellow, black and buff granules; from these four you can create thousands of colors. Add a DCS-approved granular
              dispensing system for fully automated color addition.
            </p>
          </SectionHead>
          <div className="spec mt-14">
            <div className="spec__label" />
            <div className="spec__body spec__body--narrow">
              <PullQuote id="hoxter" />
            </div>
          </div>
        </div>
      </section>
      <section className="section--tight">
        <div className="frame">
          <Split img="granular-dispenser" alt="DCS granular dispenser with four supersacks labeled #2 Yellow, #9 Red, #25 Dark Buff and #620 Charcoal" product wide>
            <p className="eyebrow eyebrow--oxide">Automated granular dispensing</p>
            <h3 className="d-3 mt-3">Four supersacks. Hundreds of saved recipes.</h3>
            <div className="prose">
              <p>
                Each machine holds four supersacks of DCS granular color, synthetic red, yellow and black plus natural buff, for the
                widest range of end colors on the market.
              </p>
              <p>Highly accurate weighing equipment and hundreds of saved recipes are included in the standard control package.</p>
            </div>
          </Split>
          <figure className="mt-16 rv">
            <div className="ph-frame" style={{ aspectRatio: "1400 / 931" }}>
              <Img name="granular-dsc" alt="Multi-story precast concrete building" />
            </div>
          </figure>
        </div>
      </section>
      <section className="section band--panel">
        <div className="frame">
          <Downloads ids={["granular", "granular-dispenser"]} />
        </div>
      </section>
      <section className="section">
        <div className="frame">
          <p className="eyebrow mb-6 rv">Learn more</p>
          <Related items={LEARN_MORE} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}

/* ------------------------------------------------------------------ */

export function Automation({ route }: { route: string }) {
  const builders = PEOPLE.filter((p) => p.name === "Jim Crawford" || p.name === "Adam Peliska");
  return (
    <>
      <PageHero
        route={route}
        eyebrow="Automated dispensing systems"
        title={
          <>
            Tired of hand-dosing pigment? <strong>Install a DCS dispenser.</strong>
          </>
        }
        lead="DCS has been a leading provider of automation equipment in construction since the mid-1990s. Over 30 years, DCS systems have proven to increase efficiency, cleanliness and batch-to-batch consistency."
        img="automation-banner"
        imgAlt="DCS liquid and granular dispensing systems side by side"
        caption={<span>Liquid and granular dispensing systems</span>}
      />
      <section className="section">
        <div className="frame">
          <BaseColorSystem initial="liquid" />
        </div>
      </section>
      <section className="section band--panel">
        <div className="frame">
          <div className="spec">
            <p className="eyebrow spec__label">From the plant floor</p>
            <div className="spec__body grid gap-14 lg:grid-cols-2">
              <PullQuote id="everding" />
              <PullQuote id="hoxter" />
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="frame">
          <Split img="plant-1551" alt="Concrete discharging from a red mixer chute into a form" ratio="1 / 1">
            <p className="eyebrow eyebrow--oxide">Liquid dispensing systems</p>
            <h3 className="d-3 mt-3">Pump rack, weigh vessel, gravity discharge.</h3>
            <div className="prose">
              <p>
                DCS liquid dispensers automate pigment addition, saving labor and reducing the possibility of error, for ready-mixed
                concrete, precast wall panels, manufactured stone veneer, cast stone and other concrete products.
              </p>
              <p>
                The pump rack moves material from storage to the weigh vessel, which weighs each material and discharges it into your
                mixer, followed by a clean water rinse.
              </p>
            </div>
          </Split>
          <Split img="granular-system" alt="DCS granular dispensing system with four supersacks" product flip>
            <p className="eyebrow eyebrow--oxide">Granular dispensing systems</p>
            <h3 className="d-3 mt-3">Four colors, the widest range on the market.</h3>
            <div className="prose">
              <p>
                Each machine is equipped with four supersacks of DCS granular color: synthetic red, yellow and black, plus natural buff.
              </p>
              <p>Highly accurate weighing equipment and hundreds of saved recipes come in the standard control package.</p>
            </div>
          </Split>
        </div>
      </section>
      <section className="section band--deep">
        <div className="frame">
          <div className="spec rv">
            <p className="eyebrow spec__label">Talk to the builders</p>
            <div className="spec__body">
              <h2 className="d-2" style={{ maxWidth: "20ch" }}>
                The people who design, build and install DCS systems.
              </h2>
              <div className="grid gap-10 md:grid-cols-2 mt-12">
                {builders.map((p) => (
                  <div key={p.name} className="grid grid-cols-[96px_minmax(0,1fr)] gap-5">
                    <div className="ph-frame" style={{ aspectRatio: "1" }}>
                      <Img name={p.img} alt={`Portrait of ${p.name}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="d-5">{p.name}</h3>
                      <p className="mono text-ink-3">{p.role}</p>
                      <p className="mt-3 text-[0.95rem] text-ink-2">{p.bio[0]}</p>
                      <p className="mt-3 flex flex-wrap items-center gap-3">
                        <a className="mono text-[var(--oxide-ink)] break-all" href={`mailto:${p.email}`}>
                          {p.email}
                        </a>
                        <CopyButton text={p.email} srLabel={`${p.name.split(" ")[0]}'s email address`} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section--tight band--panel">
        <div className="frame">
          <Downloads ids={["base", "liquid", "granular-dispenser", "cs-enterprise"]} />
        </div>
      </section>
      <section className="section">
        <div className="frame">
          <p className="eyebrow mb-6 rv">Learn more</p>
          <Related
            items={[
              { to: "liquid-color", title: "Liquid color", note: "Slurries for automated dispensing." },
              { to: "granular", title: "Granular", note: "Four-color granular base system." },
              { to: "laboratory-color-sample-services", title: "Laboratory & samples", note: "Matching and mix design support." },
            ]}
          />
        </div>
      </section>
      <CtaBand title={<>Plan a dispenser for your plant.</>} text={<>Tell us about your mixers, batch plant controls and color program. DCS will help specify, build and install the right liquid or granular system.</>} img="liquid-system-totes" imgAlt="DCS liquid color dispensing system with pump rack, weigh vessel, totes and drums" />
    </>
  );
}

/* ------------------------------------------------------------------ */

export function Lab({ route }: { route: string }) {
  const samples = [
    { img: "ring-set", t: "Precast ring sets", d: "Laminated color cards showing pigments in grey, half & half, and white cement." },
    { img: "strip-kit-50", t: "50-piece strip kits", d: "Show a variety of colors in concrete." },
    { img: "sample-strip", t: "Strip channels", d: "Show how different pigments look when used in concrete." },
    { img: "sample-quart", t: "Quarts of dry pigment", d: "For experimenting and creating mockups." },
  ];
  return (
    <>
      <PageHero
        route={route}
        eyebrow="Laboratory & color sample services"
        title={
          <>
            The most knowledgeable color lab in <strong>concrete construction.</strong>
          </>
        }
        lead="With over 100 years of experience, DCS can answer a technical question, match a color for a job you're bidding, or send a free sample ring set."
        img="lab-6557"
        imgAlt="A DCS lab technician preparing a concrete color sample"
        caption={<span>DCS color laboratory</span>}
      />
      <section className="section">
        <div className="frame">
          <SectionHead eyebrow="Laboratory services" title={<>Match any existing building, or create a custom color with your sand and aggregate.</>}>
            <p>
              Lab services can shorten turnaround time, cut upfront costs by reducing sample pours, and save on ultimate cost with
              initial mix design assistance.
            </p>
          </SectionHead>
          <div className="spec mt-12">
            <div className="spec__label" />
            <div className="spec__body">
              <ul className="grid md:grid-cols-2 gap-x-10" style={{ listStyle: "none", padding: 0 }}>
                {[
                  ["Custom matching", "Using a customer's own materials."],
                  ["Personalized samples", "Company-specific strip kits and ring sets."],
                  ["Mix design analysis", "To maximize cost savings on mix design."],
                  ["Technical support", "For every industry DCS sells to."],
                  ["ASTM documentation", "On all DCS pigments."],
                ].map(([t, d]) => (
                  <li key={t} className="py-5 border-t border-[var(--rule)] rv">
                    <b className="d-5 block">{t}</b>
                    <span className="text-ink-2">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="spec mt-16">
            <div className="spec__label" />
            <div className="spec__body spec__body--narrow">
              <PullQuote id="stephens" />
            </div>
          </div>
        </div>
      </section>
      <section className="section band--panel">
        <div className="frame">
          <SectionHead eyebrow="Color samples" title={<>Made in-house, and true to the pigment.</>}>
            <p>
              We pride ourselves on accurately representing DCS pigments on sample materials manufactured in-house. Physical
              swatches, color strips and small samples of dry pigment are free of charge, so you can decide which color fits your
              project.
            </p>
          </SectionHead>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 mt-14">
            {samples.map((s) => (
              <figure key={s.img} className="rv">
                <div className="product-shot" style={{ aspectRatio: "939 / 600", padding: 0 }}>
                  <Img name={s.img} alt={s.t} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <figcaption className="mt-4">
                  <b className="d-5 block">{s.t}</b>
                  <span className="text-ink-2 text-[0.95rem]">{s.d}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="spec mt-14 rv">
            <div className="spec__label" />
            <div className="spec__body">
              <p className="d-4" style={{ maxWidth: "36ch" }}>
                Call <a href={CONTACT.phoneTollFreeHref} className="text-link">{CONTACT.phoneTollFree}</a> or email{" "}
                <a href={`mailto:${CONTACT.email}`} className="text-link break-all">
                  {CONTACT.email}
                </a>{" "}
                and we'll send your samples right away.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="contact" className="btn btn--solid">
                  Request samples <ArrowRight aria-hidden />
                </Link>
                <CopyButton text={CONTACT.email} label="Copy email" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="frame">
          <Downloads ids={["lab", "wp-integral", "wp-quality"]} />
          <div className="mt-16">
            <p className="eyebrow mb-6 rv">Products</p>
            <Related
              items={[
                { to: "dry-pigment", title: "Dry pigment & Dynamicast", note: "Bags, small bags and color hardener." },
                { to: "liquid-color", title: "Liquid color & dispensing", note: "Slurries and automated systems." },
                { to: "granular", title: "Granular", note: "Four-color granular base system." },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
