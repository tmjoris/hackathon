import { useState } from "react";
import { motion } from "framer-motion";
import { User as UserIcon, Medal, Linkedin, CheckCircle2, Copy, ExternalLink, CalendarDays } from "lucide-react";
import { format, parseISO } from "date-fns";
import { MainLayout } from "@/components/layout/main-layout";
import { useUser } from "@/hooks/use-app-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Profile() {
  const { data: user, isLoading } = useUser();
  const { toast } = useToast();
  
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<any>(null);

  if (isLoading || !user) {
    return (
      <MainLayout>
        <div className="p-8 max-w-5xl mx-auto space-y-8">
          <Skeleton className="h-48 w-full rounded-none bg-secondary border-2 border-border" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 rounded-none bg-secondary border-2 border-border" />
            <Skeleton className="h-32 rounded-none bg-secondary border-2 border-border" />
            <Skeleton className="h-32 rounded-none bg-secondary border-2 border-border" />
          </div>
        </div>
      </MainLayout>
    );
  }

  const openShareModal = (cert: any) => {
    setSelectedCert(cert);
    setShareModalOpen(true);
  };

  const getLinkedInTemplate = () => {
    if (!selectedCert) return "";
    return `Excited to share that I've completed the ${selectedCert.courseTitle} track on Fieldwork! 🚀\n\nOver ${selectedCert.sprintsCompleted} sprints, I tackled real-world work tickets simulating actual industry scenarios, moving past theory into practical execution.\n\n#ProofOfWork #Fieldwork #ContinuousLearning`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getLinkedInTemplate());
    toast({
      title: "Copied to clipboard",
      description: "You can now paste this into LinkedIn.",
    });
  };

  const handleOpenLinkedIn = () => {
    window.open("https://www.linkedin.com/feed/", "_blank", "noopener,noreferrer");
  };

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
        
        {/* Profile Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background rounded-none p-6 md:p-10 border-2 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start"
        >
          {/* Decorative Grid */}
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          <div className="w-32 h-32 bg-primary rounded-none border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] shrink-0 flex items-center justify-center text-primary-foreground relative z-10 transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
            <UserIcon className="w-14 h-14" />
          </div>
          
          <div className="relative z-10 text-center md:text-left flex-1">
            <h1 className="text-4xl font-display font-bold text-foreground tracking-tight underline decoration-primary decoration-4 underline-offset-8 mb-4">{user.name}</h1>
            <p className="text-xl text-muted-foreground font-bold">{user.degree}</p>
            <p className="text-foreground font-medium uppercase tracking-widest text-sm mt-2">{user.institution}</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8">
              <Badge variant="secondary" className="bg-background text-foreground border-2 border-border px-4 py-2 text-sm font-bold rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                🔥 {user.currentStreak} Day Streak
              </Badge>
              <Badge variant="outline" className="text-foreground border-2 border-border bg-secondary px-4 py-2 text-sm font-bold rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                <CalendarDays className="w-4 h-4 mr-2" /> Joined {user.joinDate}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          <Card className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] rounded-none bg-background hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] transition-all">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-primary text-primary-foreground border-2 border-foreground rounded-none flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                <CheckCircle2 className="w-7 h-7 stroke-[3]" />
              </div>
              <h3 className="text-4xl font-display font-bold text-foreground">{user.ticketsCompleted}</h3>
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-2">Tickets Completed</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] rounded-none bg-background hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] transition-all">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-success text-success-foreground border-2 border-foreground rounded-none flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                <Medal className="w-7 h-7 stroke-[3]" />
              </div>
              <h3 className="text-4xl font-display font-bold text-foreground">{user.certificates.length}</h3>
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-2">Certificates Earned</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] rounded-none bg-background hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] transition-all">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-purple-500 text-white border-2 border-foreground rounded-none flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                <CheckCircle2 className="w-7 h-7 stroke-[3]" />
              </div>
              <h3 className="text-4xl font-display font-bold text-foreground">1,450</h3>
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-2">Total XP</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Certificates & Proof of Work */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-display font-bold text-foreground mb-8">Proof of Work</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {user.certificates.map(cert => (
              <Card key={cert.id} className="border-2 border-border bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] rounded-none overflow-hidden flex flex-col h-full hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] hover:-translate-y-1 hover:-translate-x-1 transition-all">
                <div className="h-4 bg-success border-b-2 border-border w-full" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)' }} />
                <CardHeader className="pb-4 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-background border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] flex items-center justify-center relative">
                      <Medal className="w-6 h-6 text-success absolute" />
                    </div>
                    <span className="text-xs font-bold text-foreground bg-secondary px-2 py-1 border-2 border-border uppercase tracking-widest">
                      {format(parseISO(cert.dateEarned), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <CardTitle className="text-2xl font-display font-bold leading-tight text-foreground">{cert.courseTitle}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-3 font-bold uppercase tracking-wider">{cert.sprintsCompleted} Sprints Completed</p>
                </CardHeader>
                <CardContent className="pt-4 pb-6 bg-secondary border-t-2 border-border mt-auto">
                  <Button 
                    onClick={() => openShareModal(cert)}
                    className="w-full bg-[#0077b5] hover:bg-[#006097] text-white border-2 border-foreground rounded-none font-bold text-base h-12 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all"
                  >
                    <Linkedin className="w-5 h-5 mr-3" /> Share to LinkedIn
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* LinkedIn Share Modal */}
        <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
          <DialogContent className="sm:max-w-[500px] p-8 rounded-none border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-background">
            <DialogHeader className="mb-4">
              <DialogTitle className="flex items-center gap-3 text-2xl font-display font-bold text-foreground">
                <div className="w-10 h-10 bg-[#0077b5] flex items-center justify-center border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                  <Linkedin className="w-5 h-5 text-white" />
                </div>  
                Share Achievement
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground font-medium mt-2">
                Copy this template and share your real-world progress with your network.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="relative">
                <Textarea 
                  readOnly 
                  value={getLinkedInTemplate()}
                  className="min-h-[160px] bg-secondary border-2 border-border text-foreground font-medium text-sm leading-relaxed p-4 focus-visible:ring-0 focus-visible:border-primary rounded-none shadow-inner"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button variant="outline" className="flex-1 rounded-none border-2 border-border font-bold text-foreground bg-background hover:bg-secondary h-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" /> Copy Text
              </Button>
              <Button className="flex-1 bg-[#0077b5] hover:bg-[#006097] text-white rounded-none border-2 border-foreground font-bold h-12 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all" onClick={handleOpenLinkedIn}>
                Open LinkedIn <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </MainLayout>
  );
}
