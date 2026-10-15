import { Component, useEffect, useRef, type ReactNode } from "react";
import { ROUTES } from "@/data/site";
import { isKnownRoute, useRoute } from "@/lib/router";
import { useReveal } from "@/lib/reveal";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import ColorGuide from "@/pages/ColorGuide";
import { Automation, DryPigment, Granular, Lab, LiquidColor, ProductsOverview } from "@/pages/Products";
import { BuildingSupply, CastStone, IndustriesOverview, MSV, Precast } from "@/pages/Industries";
import { Projects, Resources, SDS } from "@/pages/Library";
import { Careers, Contact, NotFound, OurBusiness, People } from "@/pages/Company";

const PAGES: Record<string, (p: { route: string }) => ReactNode> = {
  "": () => <Home />,
  products: ProductsOverview,
  "dry-pigment": DryPigment,
  "liquid-color": LiquidColor,
  granular: Granular,
  automation: Automation,
  "laboratory-color-sample-services": Lab,
  industries: IndustriesOverview,
  precast: Precast,
  msv: MSV,
  "cast-stone": CastStone,
  "building-supply": BuildingSupply,
  "color-guide": ColorGuide,
  projects: Projects,
  "resource-library": Resources,
  "safety-data-sheets": SDS,
  "our-business": OurBusiness,
  "our-people": People,
  careers: Careers,
  contact: Contact,
};

/** Keeps a render error on one page from blanking the whole site. */
class PageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <NotFound /> : this.props.children;
  }
}

export default function App() {
  const { route, n } = useRoute();
  const lastNav = useRef(n);
  const Page = isKnownRoute(route) && Object.prototype.hasOwnProperty.call(PAGES, route) ? PAGES[route] : null;

  useEffect(() => {
    const meta = isKnownRoute(route) ? ROUTES[route] : { title: "Page not found — DCS Inc", description: "" };
    document.title = meta.title;
    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = "description";
      document.head.appendChild(tag);
    }
    tag.content = meta.description;
  }, [route]);

  useEffect(() => {
    // Skip the first render (and StrictMode's repeat of it); act on every later navigation.
    if (lastNav.current === n) return;
    lastNav.current = n;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    // Move focus to the new page's heading so screen reader and keyboard users land on it.
    document.getElementById("page-title")?.focus({ preventScroll: true });
  }, [n]);

  useReveal(route);

  return (
    <>
      <a
        className="skip-link"
        href="#page-title"
        onClick={(e) => {
          e.preventDefault();
          const h = document.getElementById("page-title");
          h?.focus({ preventScroll: true });
          h?.scrollIntoView({ block: "start" });
        }}
      >
        Skip to content
      </a>
      <Header route={route} nav={n} />
      <main id="main" key={route}>
        <PageBoundary key={route}>{Page ? <Page route={route} /> : <NotFound />}</PageBoundary>
      </main>
      <Footer />
    </>
  );
}
