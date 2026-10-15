// Page content. Copy is taken from dynamiccolorsolutions.com and lightly edited for clarity.
// Testimonials are verbatim.

export type Testimonial = { id: string; quote: string; name: string; company: string };

export const TESTIMONIALS: Record<string, Testimonial> = {
  berkhouse: { id: "berkhouse", name: "Gary Berkhouse", company: "High Concrete Group", quote: "Across the board, I'm very happy with DCS. We do architectural precast concrete, and color is critical. Their quality is superb, and they are a great, responsive partner. They've gone to a lot of trouble to get us color when we ran short." },
  everding: { id: "everding", name: "Matt Everding", company: "Wells Concrete", quote: "The use of DCS' liquid pigment system has given us full flexibility with our architectural mixes. With the use of nine different pumps, we have the ability to run the five base colors and also have four additional pumps for preblended colors. Not only has DCS provided us with the best liquid color in the industry, they have also helped tremendously in our batch plants - both upgrading existing and new construction. The seamless communication between their weigh vessels and the batch plant control system has made the process of weighing dye accurately a non-issue. The knowledge, dedication and customer service at DCS is the best you can find in the industry." },
  hoxter: { id: "hoxter", name: "Mike Hoxter", company: "Gage Brothers", quote: "Granular dye has been a gamechanger for Gage when it comes to color consistency and water-to-cement ratio control. We have had zero panel to panel color issues on site since the change." },
  bunkers: { id: "bunkers", name: "Joe Bunkers", company: "Gage Brothers Precast", quote: "DCS has been awesome to have as a partner. Their customer service is fantastic. They helped us design the system at our facility in Sioux Falls. If we need something, they're there. Their products are top quality, and their people really make the difference." },
  fox: { id: "fox", name: "JD Fox", company: "Quarry Ridge Stone", quote: "DCS has been fantastic to work with. Color is very important in manufactured stone veneer. They've worked with us to develop a special color palette for our new panelized Tru-Fit MSV system. Working with them is part of what gave us the confidence to go ahead with that system. Their colors are truly beautiful—especially deep, rich greys and deep blues. DCS color is helping our MSV system stand out." },
  edwards: { id: "edwards", name: "Bob Edwards", company: "Edwards Cast Stone", quote: "We've been working with DCS since the 1980s. They are a fantastic, reliable partner. In our business, you can find yourself in situations where you need pigment right away, and DCS has always come through for us. A couple of years back, I got to visit their plant, and I personally walked around and shook hands with all of the employees and thanked them for the great job they have been doing for us over the years. I wouldn't hesitate for a second to recommend them to any company involved with cast stone, concrete or construction that needs color." },
  wolf: { id: "wolf", name: "Matthew Wolf", company: "Henry Frerk Sons", quote: "I'd never have been able to launch this business without DCS. DCS provided us with a complete library of color samples, and the metal channels to make samples for our customers. They are a great partner, really one of our top suppliers. I wish all our vendors could be more like DCS." },
  stephens: { id: "stephens", name: "Josh Stephens", company: "Walters & Wolf Precast", quote: "We work really hard to keep our customers happy. We had a customer who had a vision of a slightly warmer color than what we had shown them. DCS figured it out! That's just one example of how they've helped us out. They're a great bunch of folks. I've dealt with a bunch of other pigment suppliers, but they are our go-to number one. We love working with them." },
};

export const TESTIMONIAL_ORDER = ["bunkers", "everding", "hoxter", "berkhouse", "stephens", "fox", "edwards", "wolf"];

// Featured colors from the DCS Color Selection Guide page. Each image is a DCS photo of a
// sample made with grey cement (file names read "@ 5% Grey"). Hex values are averages
// sampled from those photos for UI accents only; physical samples govern.
export type Swatch = { no: string; name: string; img: string; hex: string; family: "Reds" | "Yellows & buffs" | "Browns & taupes" | "Greys & black" };

export const SWATCHES: Swatch[] = [
  { no: "2", name: "Yellow", img: "sw-2", hex: "#d2c674", family: "Yellows & buffs" },
  { no: "9", name: "Red", img: "sw-9", hex: "#cf796e", family: "Reds" },
  { no: "20", name: "Earthtone Red", img: "sw-20", hex: "#c59485", family: "Reds" },
  { no: "25", name: "Dark Buff", img: "sw-25", hex: "#ab9a7c", family: "Yellows & buffs" },
  { no: "48", name: "Dark Orange Buff", img: "sw-48", hex: "#b79266", family: "Yellows & buffs" },
  { no: "51", name: "Sandy Buff", img: "sw-51", hex: "#dcbe8a", family: "Yellows & buffs" },
  { no: "52A", name: "Desert Buff", img: "sw-52a", hex: "#d3cbb8", family: "Yellows & buffs" },
  { no: "60", name: "Gold Buff", img: "sw-60", hex: "#cbb588", family: "Yellows & buffs" },
  { no: "71", name: "Autumn Leaves", img: "sw-71", hex: "#c8a562", family: "Yellows & buffs" },
  { no: "275", name: "Indian Brown", img: "sw-275", hex: "#a78965", family: "Browns & taupes" },
  { no: "600", name: "Taupe", img: "sw-600", hex: "#b3a78e", family: "Browns & taupes" },
  { no: "614", name: "Deep Grey", img: "sw-614", hex: "#8f9696", family: "Greys & black" },
  { no: "615", name: "Cave Grey", img: "sw-615", hex: "#b9bebc", family: "Greys & black" },
  { no: "620", name: "Charcoal", img: "sw-620", hex: "#696969", family: "Greys & black" },
  { no: "1077", name: "Dark Walnut", img: "sw-1077", hex: "#826a5c", family: "Browns & taupes" },
  { no: "2703", name: "Black", img: "sw-2703", hex: "#7b7f82", family: "Greys & black" },
];

export type Market = "precast" | "cast-stone" | "msv" | "featured";
export type Project = { img: string; name: string; market: Market; alt: string; credit?: string; label?: string };

// Project names come from the photo file names on the current site (see README: verify before launch).
export const PROJECTS: Project[] = [
  { img: "vanderbilt-144", name: "144 Vanderbilt", market: "featured", alt: "Stepped residential building clad in pink architectural concrete at a street corner" },
  { img: "neiman-marcus", name: "Neiman Marcus Fort Worth", market: "featured", alt: "Buff concrete panels with the Neiman Marcus script logo against a blue sky" },
  { img: "uw-eastpark-42", name: "UW Health Eastpark", market: "featured", alt: "Glass and light concrete medical building beside a landscaped courtyard" },
  { img: "acquilus", name: "Acquilus Tower", market: "featured", alt: "Yellow oceanfront residential tower at dusk" },
  { img: "nordstrom-8", name: "Nordstrom Woodlands", market: "featured", alt: "Long, horizontally ribbed light grey concrete facade at dusk" },
  { img: "drphillips", name: "Dr. Philips Nursing", market: "featured", alt: "White concrete and glass academic building under a blue sky" },
  { img: "uw-eastpark-31", name: "UW Health Eastpark", market: "featured", alt: "Buff precast clinic building across a prairie landscape" },
  { img: "nordstrom-12", name: "Nordstrom Woodlands", market: "featured", alt: "Light concrete department store facade with clerestory glazing" },
  { img: "valley-southwoods", name: "Valley Southwoods Freshman High School CTE Addition", market: "featured", alt: "Low white school addition with a long glass storefront" },
  { img: "featured-meyer", name: "Church entry", market: "featured", alt: "Red brick church with an arched entry and light stone trim", credit: "Nick Meyer" },
  // Precast, in the order of the live /precast gallery
  { img: "texas-health-frisco", name: "Texas Health Frisco", market: "precast", alt: "Hospital campus with buff precast facades at sunrise" },
  { img: "maple-river", name: "Maple River Schools", market: "precast", alt: "Dark precast wall with school lettering seen from below" },
  { img: "uih-west", name: "UIH West Entry", market: "precast", alt: "Precast and glass building entry with vertical fins" },
  { img: "ne-corner-345", name: "345, northeast corner", market: "precast", alt: "Charcoal precast office building with arched upper windows" },
  { img: "precast-1087", name: "Precast project", market: "precast", alt: "Parking structure with red and charcoal precast spandrel bands" },
  { img: "maple-river-006", name: "Maple River Schools", market: "precast", alt: "School entrance with green, white and charcoal precast panels and a wood-tone band" },
  { img: "our-redeemer", name: "Our Redeemer", market: "precast", alt: "Buff precast building with a dark metal band on a grassy site" },
  { img: "ibew-292", name: "IBEW 292, Brooklyn Park", market: "precast", alt: "Brick-red precast building with a glass entrance tower" },
  { img: "galen-66", name: "66 Galen Street", market: "precast", alt: "Curving office building with precast spandrels and a landscaped approach" },
  { img: "precast-1131", name: "Precast project", market: "precast", alt: "Long parking structure with red and charcoal precast bands above a prairie planting" },
  { img: "precast-dm5", name: "Precast project", market: "precast", alt: "Street plaza with round precast planters and benches on patterned pavers" },
  { img: "ryan-eleven", name: "Ryan Eleven", market: "precast", alt: "Residential tower above a river and downtown skyline at dusk" },
  { img: "tamiami", name: "Tamiami Hall", market: "precast", alt: "White residence hall reflected in a pond" },
  { img: "precast-picture14", name: "Precast project", market: "precast", alt: "Buff precast facade with a faceted, scale-like panel pattern" },
  // Cast stone
  { img: "after-main", name: "Cast stone project", market: "cast-stone", alt: "Gothic-style stone building facade", credit: "Joe Schmadel" },
  { img: "unt-frisco-05", name: "UNT Frisco", market: "cast-stone", alt: "Cast stone arcade and columns on a university building" },
  { img: "unt-frisco-01", name: "UNT Frisco", market: "cast-stone", alt: "University building with a cast stone base above a landscaped slope" },
  { img: "unt-frisco-24", name: "UNT Frisco", market: "cast-stone", alt: "Cast stone clock tower with an arched base" },
  { img: "unt-frisco-15", name: "UNT Frisco", market: "cast-stone", alt: "University of North Texas entry sign wall in cast stone" },
  { img: "unt-frisco-47", name: "UNT Frisco", market: "cast-stone", alt: "Cast stone monument sign with an eagle relief" },
  { img: "prosper-hs-12", name: "Prosper High School", market: "cast-stone", alt: "Tall cast stone arches and columns at a school entrance" },
  { img: "prosper-hs-01", name: "Prosper High School", market: "cast-stone", alt: "School front with a cast stone colonnade and flagpoles" },
  { img: "prosper-hs-11", name: "Prosper High School", market: "cast-stone", alt: "Arched cast stone passage with a vaulted ceiling" },
  { img: "prosper-hs-33", name: "Prosper High School", market: "cast-stone", alt: "Auditorium front with cast stone columns and a pediment" },
  { img: "prosper-hs-34", name: "Prosper High School", market: "cast-stone", alt: "Close view of the auditorium's cast stone columns and steps" },
  { img: "prosper-hs-37", name: "Prosper High School", market: "cast-stone", alt: "Cast stone columns and pediment above a ramp" },
  { img: "prosper-hs-48", name: "Prosper High School", market: "cast-stone", alt: "Cast stone fluted columns and an arched entry beneath an ARENA entablature" },
  { img: "dcc-east", name: "DCC East", market: "cast-stone", alt: "Tudor-style clubhouse with a cast stone base and terrace", credit: "Tim Michael" },
  { img: "dcc-east-1", name: "DCC East", market: "cast-stone", alt: "Tudor-style clubhouse with a cast stone base beyond a lawn", credit: "Tim Michael" },
  { img: "dcc-south", name: "DCC South", market: "cast-stone", alt: "Clubhouse terrace with a cast stone balustrade and pool", credit: "Tim Michael" },
  { img: "dcc-porch", name: "DCC Porch Lounge", market: "cast-stone", alt: "Clubhouse terrace with cast stone arches and stairs", credit: "Tim Michael" },
  { img: "cs-turkey", name: "Cast stone carving", market: "cast-stone", alt: "Cast stone relief panel of a turkey with a fanned tail", credit: "Joe Schmadel" },
  { img: "cs-7407", name: "Cast stone project", market: "cast-stone", alt: "Historic-style courthouse with cast stone detailing and a clock tower" },
  { img: "cs-7820", name: "Cast stone project", market: "cast-stone", alt: "Ornate cast stone portico with columns and brackets" },
  { img: "cs-picture3", name: "Cast stone project", market: "cast-stone", alt: "Medical office building with cast stone cladding and a green entrance canopy" },
  { img: "cs-picture12", name: "Cast stone project", market: "cast-stone", alt: "Church bell tower with cast stone trim at sunset" },
  { img: "cs-picture17", name: "Cast stone project", market: "cast-stone", alt: "Lobby wall of fluted cast stone beside a living green wall" },
  { img: "prosper-th", name: "Prosper Town Hall", market: "cast-stone", alt: "Civic building with cast stone details lit at night" },
  // Manufactured stone veneer
  { img: "quarry-msv", name: "Tru-Fit, Quarry Ridge Stone", market: "msv", alt: "Close view of dark grey and charcoal stacked manufactured stone panels" },
  { img: "msv-dsc0024", name: "Stone veneer project", market: "msv", alt: "Floor-to-ceiling stacked stone fireplace in a timber-framed room" },
  { img: "lakeside-dock", name: "Lakeside Dock & Lift", market: "msv", alt: "Storefront with a stone veneer tower and timber entry" },
  { img: "trufit-fireplace-angle", name: "Tru-Fit, Charcoal Gray", market: "msv", alt: "Charcoal grey stone panel feature wall around a TV and fireplace" },
  { img: "ledgestone-glacier", name: "Country Ledgestone, Glacier", market: "msv", alt: "Interior fireplace wall in light grey manufactured ledgestone" },
  { img: "trufit-cabinet", name: "Tru-Fit, Charcoal Gray", market: "msv", alt: "Charcoal grey stone panels above a white cabinet" },
  { img: "private-home", name: "Private home", market: "msv", alt: "Two-story house with stone veneer and brick facades" },
  { img: "stonegate", name: "Stonegate", market: "msv", alt: "Stone veneer entry monument for a residential community" },
  { img: "trufit-fireplace", name: "Tru-Fit, Charcoal Gray", market: "msv", alt: "Living room fireplace clad in charcoal grey stone panels" },
  { img: "canyon-norse", name: "Canyon Stack Stone, Norse", market: "msv", alt: "House with a manufactured stone veneer gable wall" },
];

export const MARKET_LABEL: Record<Market, string> = {
  precast: "Precast",
  "cast-stone": "Cast stone",
  msv: "Stone veneer",
  featured: "Featured project",
};

export type MarketInfo = { to: string; name: string; short: string; img: string };
export const MARKETS: MarketInfo[] = [
  { to: "precast", name: "Precast", short: "Blend your own color with the Base Color System or choose from 4,000 standard colors, then dose it by hand, by the bag or automatically.", img: "texas-health-frisco" },
  { to: "msv", name: "Manufactured stone veneer", short: "Custom palettes and Dynamicast color hardener for realistic, varied surface color that closely emulates nature.", img: "quarry-msv" },
  { to: "cast-stone", name: "Cast stone", short: "The leading pigment supplier to cast stone. Repeatable mix designs for wet cast and dry tamp production.", img: "prosper-hs-12" },
  { to: "building-supply", name: "Building supply", short: "Pre-weighed, sealed small bags, counter samples and private label programs that keep contractors coming back.", img: "smallbags-bldg" },
];

export type Person = { name: string; role: string; img: string; email: string; bio: string[] };
export const PEOPLE: Person[] = [
  { name: "Jimmy Crawford", role: "President & CEO", img: "p-jimmy", email: "jimmyc@dynamiccolorsolutions.com", bio: [
    "Jimmy Crawford joined DCS in April 2013. Since joining the team, Jimmy has held numerous positions throughout the company ranging from operations to accounting to sales and equipment specification.",
    "In January of 2024, after having been promoted to the role of President & CEO the prior year, Jimmy took over ownership of the business from Jim & Cathy. With his deep industry knowledge and exceptional leadership skills, Jimmy is well-equipped to lead the company into the future.",
  ] },
  { name: "Jim Crawford", role: "Chairman of the Board", img: "p-jim", email: "jimc@dynamiccolorsolutions.com", bio: [
    "Jim Crawford has been at DCS since 1976 and has been a major force in creating the long-term vision for the company. He designed and built the company's line of liquid color dispensing equipment, an area that he still focuses on today.",
    "Jim, who previously held the role of President, transitioned to Chairman of the Board. His experience and guidance continue to support DCS' strategic direction and long-term vision.",
  ] },
  { name: "Cindy Nowak", role: "Vice President of Operations", img: "p-cindy", email: "cindyn@dynamiccolorsolutions.com", bio: [
    "Cindy Nowak has been involved in virtually every facet of DCS' operations beginning in 1978, having held a wide range of administrative and management positions within the company. Cindy helped develop, install, and maintain the processes central to DCS' quality, lab, and administrative services. As Vice President of Operations, she oversees all facets of the manufacturing, quality control, and shipping of DCS' pigments.",
  ] },
  { name: "Tim Nowak", role: "Vice President of Manufacturing", img: "p-tim", email: "timn@dynamiccolorsolutions.com", bio: [
    "Tim has been with the company since 2005, beginning in production. Tim then managed the DCS laboratory and oversaw quality control for raw materials selection and production. In June 2021, Tim was promoted to Vice President of Manufacturing.",
    "Since then, Tim has been instrumental in updating and modernizing our facility and operations.",
  ] },
  { name: "Justin Gerhartz", role: "Director of Sales & Marketing", img: "p-justin", email: "justing@dynamiccolorsolutions.com", bio: [
    "Justin joined DCS in February 2023 as a Sales Representative. His territory includes the upper United States and Canada, basically everywhere that gets cold! In January 2026, Justin stepped into the role of Director of Sales & Marketing. He oversees all the sales and marketing efforts at DCS Inc.",
    "Justin previously worked in the fitness industry as a Personal Trainer, Member Services Representative and Fitness Manager. Justin has a Doctorate of Physical Therapy from Carroll University in Waukesha.",
  ] },
  { name: "Frank Bence", role: "Floor Supervisor", img: "p-frank", email: "frankb@dynamiccolorsolutions.com", bio: [
    "Frank Bence has worn many hats at DCS since 1992 (production positions, warehouse manager, and maintenance) and is currently our floor supervisor.",
  ] },
  { name: "Adam Peliska", role: "Dispenser Sales & Service", img: "p-adam", email: "adamp@dynamiccolorsolutions.com", bio: [
    "Adam joined DCS in February of 2024 and is in charge of building and maintaining our liquid and granular color systems. He is also involved in the specification and installation of all of our automation projects.",
  ] },
  { name: "Mary Nameth", role: "Production Scheduler", img: "p-mary", email: "maryn@dynamiccolorsolutions.com", bio: [
    "Mary joined DCS in December of 2022 in the newly created role of Production Scheduler. She maintains our production schedule and, as customer priorities change, updates the production queue and communicates those needs to our Production Team. Mary comes to DCS from the food industry, where she held many positions in production planning and purchasing.",
    "Mary holds two degrees in Business and Supply Chain Management, one from MATC and one from the University of Wisconsin, Milwaukee.",
  ] },
  { name: "Julie Katorski", role: "Accounts Receivable", img: "p-julie", email: "juliek@dynamiccolorsolutions.com", bio: [
    "Julie Katorski has worked in accounts receivable with DCS since 2008, in addition to helping in our call center and supporting order entry.",
  ] },
];

export const HISTORY: { year: string; text: string }[] = [
  { year: "1890", text: "Founded as Ricketson Mineral Color Works. Ricketson's iron oxide pigments were used mostly for barn paint and snow fence preservative." },
  { year: "1965", text: "Ricketson fell on hard times. Its largest customer, Delta Oil Products, purchased the company out of bankruptcy and renamed it Delta Color & Supply Co." },
  { year: "1976", text: "James F. Crawford Sr., one of the owners of Delta Oil Products, purchased the color division and named it DCS Color & Supply Co., Inc. His son Jim, already working in the plant while attending college, joined full time after graduation." },
  { year: "1984", text: "James Sr.'s daughter, Cathy Higgins, joined DCS in sales and marketing, later becoming vice president of sales and marketing." },
  { year: "1990", text: "Jim Crawford became president of the company." },
  { year: "1995", text: "Jim and Cathy renamed the company Dynamic Color Solutions, Inc." },
  { year: "2013", text: "Jim's son Jimmy joined as vice president of development, bringing the third generation of Crawfords into the company." },
  { year: "2023", text: "Jimmy stepped into the position of President & CEO." },
  { year: "2024", text: "Cathy retired from the business after 40 years of faithful service." },
  { year: "2025", text: "Jimmy bought out Cathy and Jim's interest in the business and renamed the company DCS, Inc." },
];

export const CAREERS: { role: string; text: string }[] = [
  { role: "General Production", text: "Responsible for mixing, blending and weighment of pigments in both dry and liquid forms. Must be able to lift 50 lbs. Forklift experience is preferred but not necessary." },
  { role: "Office", text: "Responsible for intra-office tasks, fielding phone calls and managing order throughput. Must be comfortable in a fast-paced, open office setting." },
  { role: "Forklift Operator", text: "Wears many hats throughout the day: filling stock sheets and loading and unloading trucks. During downtime, also keeps the building in order. Previous forklift experience mandatory." },
  { role: "Maintenance", text: "Comfortable working with electrical systems and able to work on large machinery. Uses stick and wire welding. Understands pneumatics." },
];

// Base pigments of the two automated systems. Colors are representative of raw iron oxide pigment, for illustration.
export const BASE_SYSTEMS = {
  liquid: {
    label: "Liquid",
    count: "Five",
    pigments: [
      { name: "Synthetic red iron oxide", color: "#8f2f22" },
      { name: "Synthetic yellow iron oxide", color: "#c99a2e" },
      { name: "Synthetic black iron oxide", color: "#24221f" },
      { name: "Natural red iron oxide", color: "#7b3b2c" },
      // TODO(DCS): web copy says ochre; the Base Color System flyer says buff. Confirm, then update Products.tsx LiquidColor too.
      { name: "Ochre", color: "#b88a3b" },
    ],
    flow: [
      { t: "Storage", d: "Liquid base colors are stored beside the system, for example in totes and drums." },
      { t: "Pump rack", d: "Moves material from storage to the weigh vessel." },
      { t: "Weigh vessel", d: "Weighs the proper amount of each color for the batch." },
      { t: "Gravity discharge", d: "Everything weighed drops into your mixer." },
      { t: "Clean water rinse", d: "The vessel is rinsed with clean water after each discharge." },
    ],
  },
  granular: {
    label: "Granular",
    count: "Four",
    pigments: [
      { name: "Synthetic red granules", color: "#8f2f22" },
      { name: "Synthetic yellow granules", color: "#c99a2e" },
      { name: "Synthetic black granules", color: "#24221f" },
      { name: "Natural buff granules", color: "#b99a6c" },
    ],
    flow: [
      { t: "Four supersacks", d: "Synthetic red, yellow and black plus natural buff, for the widest range of end colors on the market." },
      { t: "Weighing", d: "Highly accurate weighing equipment meters each color by recipe." },
      { t: "Saved recipes", d: "Hundreds of saved recipes are included in the standard control package." },
      { t: "Into the mix", d: "Granules break down in the mixer, leaving only dry powder pigment." },
    ],
  },
} as const;
