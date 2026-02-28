import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile, useMatches, useGenerateMatches } from "@/hooks/use-profiles";
import { ScholarshipCard } from "@/components/ScholarshipCard";
import { Button } from "@/components/ui/button";
import { Loader2, BrainCircuit, AlertCircle, Search, Trophy, Filter } from "lucide-react";
import confetti from "canvas-confetti";

function AILoadingState() {
  const [step, setStep] = useState(0);
  const loadingTexts = [
    "Initializing AI engine...",
    "Scanning 10,000+ scholarships...",
    "Cross-referencing profile criteria...",
    "Calculating match confidence scores...",
    "Finalizing recommendations..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % loadingTexts.length);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-32 max-w-md mx-auto text-center">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping" />
        <div className="absolute inset-2 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <BrainCircuit className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
      </div>
      <h2 className="font-display font-bold text-2xl mb-4 ai-gradient-text">Analyzing Profile</h2>
      <p className="text-muted-foreground h-6 transition-all duration-300">
        {loadingTexts[step]}
      </p>
      
      {/* Scanner line visual */}
      <div className="w-full h-1 bg-muted rounded-full mt-8 relative overflow-hidden">
        <div className="absolute top-0 bottom-0 w-1/3 bg-primary rounded-full animate-[scan_2s_ease-in-out_infinite] rotate-90" 
             style={{ transformOrigin: 'left center' }} />
        <div className="absolute top-0 bottom-0 left-0 bg-primary/50 rounded-full w-full animate-pulse" />
      </div>
    </div>
  );
}

export default function Results() {
  const params = useParams();
  const profileId = params.id ? parseInt(params.id, 10) : null;
  
  const { data: profile, isLoading: isLoadingProfile } = useProfile(profileId);
  const { data: matches = [], isLoading: isLoadingMatches } = useMatches(profileId);
  const generateMatches = useGenerateMatches();

  const [filterGov, setFilterGov] = useState(false);
  const [filterHighConfidence, setFilterHighConfidence] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);

  // Trigger generation automatically if matches are empty and not already generated
  useEffect(() => {
    if (profileId && !isLoadingMatches && matches.length === 0 && !generateMatches.isPending && !hasScanned) {
      setHasScanned(true);
      generateMatches.mutate(profileId, {
        onSuccess: () => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3b82f6', '#10b981', '#6366f1']
          });
        }
      });
    }
  }, [profileId, matches.length, isLoadingMatches, generateMatches.isPending, hasScanned]);

  if (isLoadingProfile || isLoadingMatches) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="font-display font-bold text-2xl">Profile Not Found</h2>
        <p className="text-muted-foreground mt-2">We couldn't find the requested profile.</p>
      </div>
    );
  }

  if (generateMatches.isPending) {
    return <AILoadingState />;
  }

  // Filter Logic
  let filteredMatches = [...matches];
  if (filterGov) {
    filteredMatches = filteredMatches.filter(m => m.governmentType.toLowerCase() === "government");
  }
  if (filterHighConfidence) {
    filteredMatches = filteredMatches.filter(m => m.matchConfidence >= 80);
  }

  const avgMissedScore = matches.length > 0 
    ? Math.round(matches.reduce((acc, curr) => acc + curr.missedOpportunitiesScore, 0) / matches.length)
    : 0;

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      {/* Dashboard Header */}
      <div className="bg-background border-b border-border pt-8 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <h1 className="font-display font-extrabold text-3xl md:text-4xl mb-3">
                Your AI Match Results
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                We analyzed your profile ({profile.course}, {profile.state}) and found 
                <span className="font-bold text-foreground mx-1">{matches.length}</span> 
                highly relevant scholarships.
              </p>
            </div>
            
            {matches.length > 0 && (
              <div className="glass rounded-2xl p-4 flex items-center gap-4 shrink-0">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Missed Opportunities Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-bold text-3xl text-foreground leading-none">{avgMissedScore}</span>
                    <span className="text-sm font-medium text-muted-foreground">/ 100</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mt-8">
        {matches.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center max-w-2xl mx-auto shadow-sm">
            <Search className="w-16 h-16 text-muted-foreground/50 mx-auto mb-6" />
            <h3 className="font-display font-bold text-2xl mb-3">No matches found yet</h3>
            <p className="text-muted-foreground mb-8">
              We need to run the AI engine against your profile to find the best scholarships.
            </p>
            <Button 
              size="lg" 
              className="rounded-xl px-8"
              onClick={() => generateMatches.mutate(profileId!)}
            >
              <BrainCircuit className="w-5 h-5 mr-2" />
              Discover Matches
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Filters */}
            <div className="w-full lg:w-64 shrink-0">
              <div className="bg-card rounded-2xl p-5 border border-border sticky top-24 shadow-sm">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-display font-bold text-lg">Filters</h3>
                </div>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/50 cursor-pointer transition-colors">
                    <span className="text-sm font-medium">Gov. Only</span>
                    <div className="relative inline-flex items-center">
                      <input type="checkbox" className="sr-only peer" checked={filterGov} onChange={(e) => setFilterGov(e.target.checked)} />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                  </label>
                  
                  <label className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/50 cursor-pointer transition-colors">
                    <span className="text-sm font-medium">High Match (&gt;80%)</span>
                    <div className="relative inline-flex items-center">
                      <input type="checkbox" className="sr-only peer" checked={filterHighConfidence} onChange={(e) => setFilterHighConfidence(e.target.checked)} />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Showing <span className="text-foreground">{filteredMatches.length}</span> results
                </p>
              </div>
              
              <AnimatePresence mode="popLayout">
                {filteredMatches.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-center py-20 bg-card rounded-2xl border border-dashed"
                  >
                    <p className="text-muted-foreground">No matches fit the current filters.</p>
                    <Button variant="link" onClick={() => {setFilterGov(false); setFilterHighConfidence(false);}}>
                      Clear Filters
                    </Button>
                  </motion.div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {filteredMatches.map((match, idx) => (
                      <ScholarshipCard key={match.id} match={match} index={idx} />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
