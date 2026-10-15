// Company facts, documents and navigation. All values come from dynamiccolorsolutions.com (crawled 2026-10-12).

export const LIVE = "https://www.dynamiccolorsolutions.com";
export const pdf = (file: string) => `${LIVE}/s/${file}`;

export const CONTACT = {
  company: "DCS Inc.",
  street: "2024 S Lenox St",
  cityLine: "Milwaukee, WI 53207",
  phoneMain: "(414) 769-2580",
  phoneMainHref: "tel:+14147692580",
  phoneTollFree: "(800) 657-0737",
  phoneTollFreeHref: "tel:+18006570737",
  email: "info@dynamiccolorsolutions.com",
  linkedin: "https://www.linkedin.com/company/dynamic-color-solutions",
  maps: "https://www.google.com/maps/search/?api=1&query=2024+S+Lenox+St+Milwaukee+WI+53207",
};

export type DocType = "White paper" | "Product flyer" | "Case study" | "Color guide" | "Safety data sheet";

export type Doc = {
  id: string;
  title: string;
  type: DocType;
  summary: string;
  file: string;
  cover?: string;
};

export const DOCS: Doc[] = [
  { id: "wp-integral", type: "White paper", title: "Coloring Concrete Using Integral Pigments", summary: "A 10,000-foot view of iron oxide pigments and how to use them.", file: "DCS-Inc-White-Paper-Coloring-Concrete-Using-Integral-Pigment.pdf", cover: "doc-wp1" },
  { id: "wp-quality", type: "White paper", title: "Quality and Production Control for Color Consistency in Concrete", summary: "White Paper 2.0 reviews the other raw materials and production factors that influence the finished color of architectural precast concrete.", file: "DCS-Inc-White-Paper-20-Quality-and-Production-Control-for-Color-Consistency-in-Concrete.pdf", cover: "doc-wp2" },
  { id: "color-guide", type: "Color guide", title: "DCS Color Selection Guide", summary: "The full DCS concrete color selection guide, made with grey cement.", file: "DCS-Inc-Color-Selection-Guide.pdf", cover: "color-collage" },
  { id: "black", type: "Product flyer", title: "Producing Black Concrete", summary: "Do's and don'ts when considering the process.", file: "DCS-Inc-Black-Concrete-Flyer.pdf", cover: "doc-black-concrete" },
  { id: "buff", type: "Product flyer", title: "Producing Buff with #25 Dark Buff", summary: "Need to make buff concrete? Use DCS #25.", file: "DCS-Inc-25-Dark-Buff-Flyer.pdf", cover: "doc-25-buff" },
  { id: "base", type: "Product flyer", title: "Base Color System", summary: "Five iron oxides blended together to produce the desired end color across a wide range of concrete colors.", file: "DCS-Inc-Base-Color-System-Flyer.pdf", cover: "doc-base-color" },
  { id: "liquid", type: "Product flyer", title: "Liquid Color Dispensing System", summary: "Automates pigment addition at your plant, saving labor and reducing the possibility of error.", file: "DCS-Inc-Liquid-Color-Dispensing-System-Flyer.pdf", cover: "doc-liquid" },
  { id: "granular", type: "Product flyer", title: "Granular Color", summary: "Four granular colors that blend together to produce the desired end color.", file: "DCS-Inc-Granular-Color-Flyer.pdf", cover: "doc-granular-color" },
  { id: "granular-dispenser", type: "Product flyer", title: "Granular Color Dispenser", summary: "State-of-the-art granular dispensing equipment that automates pigment addition at your plant.", file: "DCS-Inc-Granular-Color-Dispenser-Flyer.pdf", cover: "doc-granular-dispenser" },
  { id: "small-bag", type: "Product flyer", title: "Small Bag Program", summary: "Dry pigment in pre-weighed bags, including custom small bags and private labeling.", file: "DCS-Inc-Small-Bag-Program-Flyer.pdf", cover: "doc-small-bag" },
  { id: "lab", type: "Product flyer", title: "Laboratory Services", summary: "Technical questions, color matching for jobs you're bidding, and free sample ring sets.", file: "DCS-Inc-Laboratory-Services-Flyer.pdf", cover: "doc-lab" },
  { id: "cs-awards", type: "Case study", title: "DCS Color Found in Projects Winning 23 Awards from PCI, APA and CSI in 2021", summary: "Award-winning architectural projects colored with DCS pigment.", file: "DCS-Inc-Award-Winners-Case-Study.pdf", cover: "cs-award" },
  { id: "cs-enterprise", type: "Case study", title: "DCS and Enterprise Pull Off the First Remote Install of an Automated Liquid Color Dispensing System", summary: "A remote install, without a hitch.", file: "DCS-Inc-Enterprise-Precast-Case-Study.pdf", cover: "cs-enterprise" },
  { id: "cs-quarry", type: "Case study", title: "DCS Helps Quarry Ridge Stone Hit a Home Run with Its Tru-Fit Panelized MSV System", summary: "A custom color palette for a new panelized manufactured stone veneer system.", file: "DCS-Inc-Quarry-Ridge-Case-Study.pdf", cover: "cs-quarry" },
  { id: "cs-norse", type: "Case study", title: "Norse Says Color Helps Set Its Manufactured Stone Veneer Apart", summary: "How color differentiates an MSV line from the competition.", file: "DCS-Inc-Norse-Case-Study.pdf", cover: "cs-norse" },
  { id: "cs-frerk", type: "Case study", title: "Partnership with DCS Helps Henry Frerk Sons Develop Its Restoration Business", summary: "A building supplier launches a restoration business with DCS color and samples.", file: "DCS-Inc-Henry-Frerk-Case-Study.pdf", cover: "cs-henry-frerk" },
  { id: "sds-concrete", type: "Safety data sheet", title: "Concrete Colors", summary: "Safety Data Sheet, revised 2023.", file: "DCS-Inc-Concrete-Colors-Revised-2023-SDS.pdf" },
  { id: "sds-black", type: "Safety data sheet", title: "Black Iron Oxide", summary: "Safety Data Sheet, revised 2023.", file: "DCS-Inc-Black-Iron-Oxide-Revised-2023-SDS.pdf" },
  { id: "sds-red", type: "Safety data sheet", title: "Red Iron Oxide", summary: "Safety Data Sheet, revised 2023.", file: "DCS-Inc-Red-Iron-Oxide-Revised-2023-SDS.pdf" },
  { id: "sds-hardener", type: "Safety data sheet", title: "Color Hardener", summary: "Safety Data Sheet, revised 2023.", file: "DCS-Inc-Color-Hardener-Revised-2023-SDS.pdf" },
  { id: "sds-mortar", type: "Safety data sheet", title: "Custom Colored Mortar", summary: "Safety Data Sheet, revised 2023.", file: "DCS-Inc-Custom-Color-Mortar-Revised-2023-SDS.pdf" },
  { id: "sds-liquid", type: "Safety data sheet", title: "Liquid Color", summary: "Safety Data Sheet, revised 2023.", file: "DCS-Inc-Liquid-Concrete-Colors-Revised-2023-SDS.pdf" },
];

export const docById = (id: string) => {
  const d = DOCS.find((x) => x.id === id);
  if (!d) throw new Error(`Unknown doc ${id}`);
  return d;
};

// Routes keep the existing site's slugs so production URLs can map 1:1 (see README).
export type RouteMeta = { title: string; description: string; parent?: { label: string; to: string } };

export const ROUTES: Record<string, RouteMeta> = {
  "": { title: "DCS Inc. | The Color of Today's Architecture", description: "Iron oxide pigments, liquid and granular color systems, and automated dispensing for architectural precast, cast stone, manufactured stone veneer and masonry. Founded 1890, based in Milwaukee." },
  products: { title: "Products — DCS Inc", description: "Dry pigment, Dynamicast color hardener, liquid color and granular pigment, compared side by side." },
  "dry-pigment": { title: "Dry Pigment & Dynamicast Color Hardener — DCS Inc", description: "Pure mineral dry pigments with unlimited shelf life in 50-lb bags, Custom Small Bags from 50 g to 49 lb, soluble bags and private label, plus Dynamicast color hardener.", parent: { label: "Products", to: "products" } },
  "liquid-color": { title: "Liquid Color — DCS Inc", description: "Liquid pigment slurries and the five-pigment Liquid Base Color System for fully automated color dispensing.", parent: { label: "Products", to: "products" } },
  granular: { title: "Granular Pigment & Granular Color Dispensing Systems — DCS Inc", description: "Encapsulated granular pigment with a four-color base system, including the industry's only buff granule, and automated granular dispensers.", parent: { label: "Products", to: "products" } },
  automation: { title: "Liquid & Granular Automated Dispensing Systems — DCS Inc", description: "DCS liquid and granular color dispensers, both running on the DCS Base Color System, from a leading provider of construction automation equipment since the mid-1990s.", parent: { label: "Products", to: "products" } },
  "laboratory-color-sample-services": { title: "Laboratory & Color Sample Services — DCS Inc", description: "Custom color matching with your own materials, mix design analysis, technical support, ASTM documentation and free color samples.", parent: { label: "Products", to: "products" } },
  industries: { title: "Industries — DCS Inc", description: "Color for architectural precast, manufactured stone veneer, cast stone and building supply." },
  precast: { title: "Precast — DCS Inc", description: "The supplier of choice for architectural precast concrete color: base color systems, 4,000 standard colors, small bags, liquid and granular dispensing.", parent: { label: "Industries", to: "industries" } },
  msv: { title: "MSV — DCS Inc", description: "Pigments, custom palettes and Dynamicast color hardener for manufactured stone veneer.", parent: { label: "Industries", to: "industries" } },
  "cast-stone": { title: "Cast Stone — DCS Inc", description: "The leading pigment supplier to the cast stone industry, for wet cast and dry tamp production.", parent: { label: "Industries", to: "industries" } },
  "building-supply": { title: "Building Supply — DCS Inc", description: "Pre-weighed, sealed small bags, sample displays and private label color programs for building supply yards.", parent: { label: "Industries", to: "industries" } },
  "color-guide": { title: "DCS Color Selection Guide — DCS Inc", description: "Explore DCS concrete colors shown on grey cement samples, and download the full Color Selection Guide." },
  projects: { title: "Projects — DCS Inc", description: "Architectural precast, cast stone and manufactured stone veneer projects colored with DCS pigment." },
  "resource-library": { title: "Resource Library — DCS Inc", description: "White papers, product flyers, case studies, the color selection guide and safety data sheets.", parent: { label: "Resources", to: "resource-library" } },
  "safety-data-sheets": { title: "Safety Data Sheets (SDS) — DCS Inc", description: "Safety Data Sheets for DCS concrete colors, iron oxides, color hardener, colored mortar and liquid color.", parent: { label: "Resources", to: "resource-library" } },
  "our-business": { title: "Our Business — DCS Inc", description: "A fourth-generation family business in Milwaukee. Founded in 1890 as Ricketson Mineral Color Works.", parent: { label: "Company", to: "our-business" } },
  "our-people": { title: "Our People — DCS Inc", description: "Meet the DCS team: hundreds of years of combined experience getting color right in concrete.", parent: { label: "Company", to: "our-business" } },
  careers: { title: "Employment Opportunities — DCS Inc", description: "Join DCS, a stable, growing family-owned business in Milwaukee.", parent: { label: "Company", to: "our-business" } },
  contact: { title: "Contact — DCS Inc", description: "Request samples, place orders or ask a technical question. Call (800) 657-0737 or email info@dynamiccolorsolutions.com." },
};

// Old folder URLs on the current site, mapped to their new homes.
export const ALIASES: Record<string, string> = {
  support: "laboratory-color-sample-services",
  about: "our-business",
  "precast-solutions": "precast",
  "msv-solutions": "msv",
  "cast-stone-solutions": "cast-stone",
  "building-supply-solutions": "building-supply",
};

export type NavLink = { to: string; label: string; note?: string };
export type NavGroup = { label: string; to: string; groups: { heading: string; links: NavLink[] }[]; feature?: { img: string; caption: string } };

export const NAV: NavGroup[] = [
  {
    label: "Products", to: "products",
    groups: [
      { heading: "Pigments", links: [
        { to: "dry-pigment", label: "Dry Pigment & Color Hardener", note: "50-lb bags, small bags, soluble bags, Dynamicast" },
        { to: "liquid-color", label: "Liquid Color", note: "Slurries and the five-pigment base system" },
        { to: "granular", label: "Granular", note: "Dry-powder results without the dust" },
      ] },
      { heading: "Systems & services", links: [
        { to: "automation", label: "Automated Dispensing", note: "Liquid and granular dispensers" },
        { to: "laboratory-color-sample-services", label: "Laboratory & Matching", note: "Custom matching, mix design, free samples" },
        { to: "products", label: "Compare all products", note: "Forms, packaging and dosing side by side" },
      ] },
    ],
    feature: { img: "granular-spill", caption: "Granular red, yellow, black and buff" },
  },
  {
    label: "Industries", to: "industries",
    groups: [
      { heading: "Who we serve", links: [
        { to: "precast", label: "Precast", note: "Architectural precast concrete" },
        { to: "msv", label: "Manufactured Stone Veneer", note: "Palettes and color hardener" },
        { to: "cast-stone", label: "Cast Stone", note: "Wet cast and dry tamp" },
        { to: "building-supply", label: "Building Supply", note: "Small bags and private label" },
      ] },
    ],
    feature: { img: "neiman-marcus", caption: "Neiman Marcus Fort Worth" },
  },
  { label: "Color Guide", to: "color-guide", groups: [] },
  { label: "Projects", to: "projects", groups: [] },
  {
    label: "Resources", to: "resource-library",
    groups: [
      { heading: "Technical library", links: [
        { to: "resource-library", label: "Resource Library", note: "White papers, flyers and case studies" },
        { to: "safety-data-sheets", label: "Safety Data Sheets", note: "Six SDS, revised 2023" },
        { to: "laboratory-color-sample-services", label: "Lab & Samples", note: "Ring sets, strip kits, quarts" },
      ] },
    ],
    feature: { img: "doc-wp1", caption: "White paper: Coloring Concrete Using Integral Pigments" },
  },
  {
    label: "Company", to: "our-business",
    groups: [
      { heading: "About DCS", links: [
        { to: "our-business", label: "Our Business", note: "Founded 1890, fourth-generation family business" },
        { to: "our-people", label: "Our People", note: "Team and company directory" },
        { to: "careers", label: "Careers", note: "Production, office, forklift, maintenance" },
      ] },
    ],
    feature: { img: "history-1", caption: "Ricketson Color Corp. (historic photo)" },
  },
];
