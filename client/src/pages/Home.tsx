import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Target, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                  <SparklesIcon className="w-4 h-4" />
                  <span>AI-Powered Matching Engine</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-display font-extrabold leading-[1.1] tracking-tight mb-6">
                  Find the Scholarships <br />
                  <span className="ai-gradient-text">You Deserve.</span>
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
                  Stop searching blindly. Our advanced AI analyzes your profile against 10,000+ government and private scholarships to find exact matches with high success rates.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/eligibility" className="inline-block">
                    <Button size="lg" className="w-full sm:w-auto text-base rounded-xl px-8 h-14 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                      Check Eligibility Now <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/how-it-works" className="inline-block">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto text-base rounded-xl px-8 h-14 bg-background/50 backdrop-blur-sm border-2">
                      See How It Works
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground font-medium">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" className="w-full h-full" />
                      </div>
                    ))}
                  </div>
                  <p>Join 5,000+ students funded</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative lg:h-[600px] flex items-center justify-center"
              >
                {/* Abstract Data Visualization / UI Mockup */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-[3rem] transform rotate-3 scale-105 -z-10 border border-white/20 backdrop-blur-sm" />
                <div className="relative w-full max-w-md glass rounded-[2rem] p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">AI Match Score</p>
                      <h3 className="font-display font-bold text-3xl">94%</h3>
                    </div>
                    <div className="w-16 h-16 rounded-full border-[6px] border-emerald-500/20 flex items-center justify-center relative">
                      <svg className="absolute inset-0 transform -rotate-90 w-full h-full text-emerald-500" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="251" strokeDashoffset="15" strokeLinecap="round" />
                      </svg>
                      <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { name: "National Merit Tech Scholarship", amt: "₹50,000" },
                      { name: "State STEM Grant", amt: "₹25,000" },
                      { name: "Global Innovators Fund", amt: "₹1,00,000" }
                    ].map((item, i) => (
                      <div key={i} className="bg-background/80 rounded-xl p-4 flex items-center justify-between border border-border/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-emerald-500' : 'bg-primary'}`} />
                          <div>
                            <p className="font-semibold text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground font-medium">Matching criteria...</p>
                          </div>
                        </div>
                        <span className="font-bold text-sm text-primary">{item.amt}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                    <BrainCircuit className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-primary/80 leading-relaxed">
                      AI identified 3 missed opportunities in your profile based on your current course selection.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">Why choose ScholarAI?</h2>
              <p className="text-muted-foreground text-lg">We've automated the most tedious part of securing your education funding.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Target, title: "Precision Matching", desc: "Our engine reads between the lines of 100+ criteria to find scholarships you actually qualify for." },
                { icon: Zap, title: "Missed Opportunities", desc: "We calculate a unique score to show you money left on the table and how to claim it." },
                { icon: BrainCircuit, title: "Explainable AI", desc: "No black boxes. We tell you exactly why you matched and what documents you need to win." }
              ].map((feature, i) => (
                <div key={i} className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function SparklesIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
