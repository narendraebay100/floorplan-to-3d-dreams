import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Layers3, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Upload", href: "#upload" },
  { label: "3D Viewer", href: "#viewer-3d" },
];

const smoothScroll = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: "smooth" });
  }
};

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    smoothScroll(href.replace("#", ""));
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => handleNav("#hero")}
          className="flex items-center gap-2 group"
        >
          <Layers3
            className={`h-7 w-7 transition-colors ${
              scrolled ? "text-primary" : "text-white"
            }`}
          />
          <span
            className={`text-lg font-bold tracking-tight transition-colors ${
              scrolled ? "text-foreground" : "text-white"
            }`}
          >
            Floor3D
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              size="sm"
              onClick={() => handleNav(link.href)}
              className={`transition-colors ${
                scrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </Button>
          ))}

          <div className="ml-2 pl-2 border-l border-border/50">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className={scrolled ? "text-foreground" : "text-white"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border px-6 pb-4">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              className="w-full justify-start text-foreground"
              onClick={() => handleNav(link.href)}
            >
              {link.label}
            </Button>
          ))}
        </div>
      )}
    </nav>
  );
};
