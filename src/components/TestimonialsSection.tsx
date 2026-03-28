import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Interior Designer",
    content:
      "This tool has completely transformed my workflow. I can now show clients a 3D walkthrough of their space within minutes of receiving the floor plan.",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    role: "Real Estate Agent",
    content:
      "My property listings stand out now. The 3D models help buyers visualize spaces before visiting, saving everyone time and closing deals faster.",
    rating: 5,
  },
  {
    name: "Emily Chen",
    role: "Architect",
    content:
      "The accuracy of wall detection and room labeling is impressive. The export to GLB works seamlessly with my existing Blender pipeline.",
    rating: 4,
  },
  {
    name: "David Park",
    role: "Homeowner",
    content:
      "I uploaded my house plan and got a beautiful 3D model in seconds. The color themes made it easy to experiment with different styles for our renovation.",
    rating: 5,
  },
  {
    name: "Laura Kim",
    role: "Property Developer",
    content:
      "We use this for every new project now. The measurement labels and room type detection save hours of manual work. Highly recommended!",
    rating: 5,
  },
  {
    name: "Michael Brown",
    role: "Student — Architecture",
    content:
      "As a student, this is an incredible free resource. I can quickly prototype my designs and present them in 3D for class critiques.",
    rating: 4,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">Testimonials</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Loved by Designers & Builders
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See what professionals and hobbyists are saying about our floor plan
            to 3D model converter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Card
              key={i}
              className="border-border/50 bg-card hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6 flex flex-col gap-4">
                <Quote className="w-8 h-8 text-primary/30" />
                <p className="text-muted-foreground leading-relaxed flex-1">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s < t.rating
                          ? "text-primary fill-primary"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
