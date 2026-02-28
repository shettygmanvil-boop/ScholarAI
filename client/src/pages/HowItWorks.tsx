import { motion } from "framer-motion";
import { UserCircle, Cpu, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  const steps = [
    {
      icon: UserCircle,
      title: "1. Build Your Profile",
      desc: "Fill out a simple 2-minute eligibility form. We ask about your course, income, and background to create a holistic profile."
    },
    {
      icon: Cpu,
      title: "2. AI Analysis",
      desc: "Our engine scans thousands of active scholarships, cross-referencing your unique data points to calculate exact match confidences."
    },
    {
      icon: CheckCircle2,
      title: "3. Claim Your Funds",
      desc: "Review your matches, see exactly why you qualify, gather the AI-curated document checklist, and apply with confidence."
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl mb-6 tracking-tight">
            How Scholar<span className="text-primary">AI</span> Works
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps between you and your education funding. No more guessing if you're eligible.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-1 bg-border -translate-x-1/2 rounded-full hidden md:block" />
          
          <div className="space-y-12 relative">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className={`flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center ${
                  i % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className={`flex-1 ${i % 2 === 1 ? 'md:text-right' : ''}`}>
                  <h3 className="font-display font-bold text-2xl mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{step.desc}</p>
                </div>
                
                <div className="shrink-0 relative z-10 w-14 h-14 bg-background border-4 border-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
          <Link href="/eligibility" className="inline-block">
            <Button size="lg" className="rounded-xl px-10 h-14 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-1 transition-all">
              Start Your Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
