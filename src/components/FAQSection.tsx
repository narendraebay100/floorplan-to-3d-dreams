import { HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What file formats are supported for floor plan uploads?",
    answer:
      "We support PNG, JPG, JPEG, and SVG image formats. For best results, upload a clear, high-resolution floor plan with well-defined walls and room boundaries.",
  },
  {
    question: "How accurate is the 3D model generation?",
    answer:
      "Our AI analyzes the floor plan to detect walls, rooms, and dimensions. While results are highly accurate for standard layouts, complex or hand-drawn plans may require minor adjustments.",
  },
  {
    question: "Can I export the 3D model for use in other software?",
    answer:
      "Yes! You can export your 3D model in GLB or OBJ format, which are compatible with most 3D modeling and visualization tools like Blender, SketchUp, and Unity.",
  },
  {
    question: "How do the room color themes work?",
    answer:
      "We offer preset color themes like Modern, Rustic, and Scandinavian that instantly style all rooms. You can also customize individual room colors for walls and floors to match your vision.",
  },
  {
    question: "Is there a file size limit for uploads?",
    answer:
      "Currently, we support files up to 10MB in size. If your file is larger, try reducing the resolution or compressing the image before uploading.",
  },
  {
    question: "Can I take a screenshot of my 3D model?",
    answer:
      "Absolutely! Use the snapshot button in the 3D viewer toolbar to capture the current view as a PNG image, which will be downloaded automatically to your device.",
  },
];

export const FAQSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-medium">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about our floor plan to 3D model converter.
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <AccordionItem
                value={`item-${index}`}
                className="border border-border/50 rounded-lg px-6 bg-card shadow-sm data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left text-foreground hover:no-underline hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
