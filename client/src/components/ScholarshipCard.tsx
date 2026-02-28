import { motion } from "framer-motion";
import { Landmark, Building2, Calendar, IndianRupee, ChevronRight, FileText } from "lucide-react";
import { type ScholarshipMatch } from "@shared/schema";
import { ConfidenceRing } from "./ConfidenceRing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  match: ScholarshipMatch;
  index: number;
}

export function ScholarshipCard({ match, index }: Props) {
  const isGov = match.governmentType.toLowerCase() === "government";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-card rounded-2xl p-5 md:p-6 border border-border hover-card-elevate flex flex-col h-full relative overflow-hidden"
    >
      {/* Top Banner indicating match quality implicitly by subtle gradient glow */}
      {match.matchConfidence >= 90 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />
      )}
      
      <div className="flex justify-between items-start gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={isGov ? "default" : "secondary"} className="rounded-md font-medium text-xs">
              {isGov ? <Landmark className="w-3 h-3 mr-1" /> : <Building2 className="w-3 h-3 mr-1" />}
              {match.governmentType}
            </Badge>
          </div>
          <h3 className="font-display font-bold text-lg md:text-xl text-foreground leading-tight">
            {match.name}
          </h3>
        </div>
        <div className="shrink-0 flex flex-col items-center">
          <ConfidenceRing score={match.matchConfidence} size={56} strokeWidth={5} />
          <span className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-wider">Match</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-start gap-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <IndianRupee className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Amount</p>
            <p className="text-sm font-semibold">{match.benefitAmount}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="p-2 bg-accent/10 rounded-lg text-accent">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Deadline</p>
            <p className="text-sm font-semibold">{match.deadline}</p>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-border/50">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="explainability" className="border-none">
            <AccordionTrigger className="py-2 hover:no-underline [&[data-state=open]>div>span]:text-primary">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                <SparkleIcon className="w-4 h-4" />
                <span>Why did AI match this?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 text-sm text-muted-foreground leading-relaxed bg-muted/30 rounded-lg px-3 mt-1">
              {match.explainability}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex items-center justify-between mt-4 gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full rounded-xl border-dashed">
                <FileText className="w-4 h-4 mr-2" />
                Documents
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-display flex items-center gap-2 text-xl">
                  <FileText className="w-5 h-5 text-primary" />
                  Required Documents
                </DialogTitle>
                <DialogDescription>
                  Prepare these documents to apply for {match.name}.
                </DialogDescription>
              </DialogHeader>
              <ul className="space-y-3 mt-4">
                {match.requiredDocuments.map((doc, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                    <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-sm font-medium">{doc}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-end">
                <Button className="rounded-xl w-full sm:w-auto">Got it</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button size="sm" className="w-full rounded-xl bg-foreground hover:bg-foreground/90 text-background">
            Apply Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function SparkleIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
