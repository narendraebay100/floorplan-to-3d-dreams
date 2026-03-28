import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Eye, Layers3 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroImage from "@/assets/hero-architecture.jpg";

export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        <img 
          src={heroImage} 
          alt="3D House Visualization" 
          className="w-full h-[120%] object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-depth" />
      </motion.div>

      {/* Content */}
      <motion.div className="relative z-10 max-w-7xl mx-auto px-6 text-center" style={{ y: contentY, opacity }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Transform Your
            <span className="block bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
              Floor Plans to 3D
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Upload your 2D floor plans and watch them come to life in stunning 3D visualizations. 
            Perfect for architects, designers, and real estate professionals.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button variant="hero" size="lg" className="group" onClick={() => { const el = document.getElementById('upload'); if (el) { const top = el.getBoundingClientRect().top + window.scrollY - 16; window.scrollTo({ top, behavior: 'smooth' }); } }}>
              <Upload className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Upload Floor Plan
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="heroSecondary" size="lg" className="group" onClick={() => { const el = document.getElementById('viewer-3d'); if (el) { const top = el.getBoundingClientRect().top + window.scrollY - 16; window.scrollTo({ top, behavior: 'smooth' }); } }}>
              <Eye className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              View Demo
            </Button>
          </div>
        </motion.div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Upload, title: "Easy Upload", desc: "Support for PNG, JPG, PDF, and SVG formats with drag & drop interface." },
            { icon: Layers3, title: "3D Generation", desc: "Automatic conversion from 2D floor plans to interactive 3D models." },
            { icon: Eye, title: "Interactive View", desc: "Navigate, measure, and explore your 3D models with professional tools." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
              className="architectural-elevation rounded-2xl p-6 backdrop-blur-sm bg-white/10 border border-white/20"
            >
              <item.icon className="h-12 w-12 text-primary-glow mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-white/80">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};