import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight, Home, LayoutGrid, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NovaMethodIcon from "@/components/NovaMethodIcon";

const SUGGESTIONS = [
  { to: "/", label: "Inicio", hint: "Webs, apps y marketing", icon: Home },
  { to: "/#servicios", label: "Servicios y precios", hint: "Lo que podemos hacer por ti", icon: LayoutGrid },
  { to: "/#contacto", label: "Contacto", hint: "Respuesta en 24 h", icon: MessageCircle },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // The host serves the SPA with HTTP 200 for any path, so tell crawlers not to index this page
  useEffect(() => {
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  return (
    <>
      <Navbar />
      <main id="contenido" className="relative overflow-hidden px-4 pb-24 pt-32 sm:px-6 md:pt-40">
        <div className="absolute inset-0 bg-grid opacity-70 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-2xl text-center">
          <NovaMethodIcon size={88} />
          <p className="mt-8 font-display text-7xl font-extrabold tracking-tight text-gradient md:text-8xl">404</p>
          <h1 className="mt-4 text-2xl font-bold text-foreground md:text-3xl">Esta página se ha perdido en el espacio</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Puede que el enlace esté mal escrito o que la página ya no exista. Te dejamos algunos sitios por donde seguir.
          </p>

          <div className="mt-10 grid gap-3 text-left sm:grid-cols-3">
            {SUGGESTIONS.map((item) => (
              <Link key={item.to} to={item.to} className="group glass-card hover-lift p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                  <item.icon className="h-5 w-5" />
                </span>
                <span className="mt-4 flex items-center gap-1 font-semibold text-foreground">
                  {item.label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{item.hint}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
