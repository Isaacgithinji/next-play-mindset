import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Activity, TrendingUp, Users } from "lucide-react";
import heroImage from "@/assets/hero-athlete.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">The Next Play</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate("/auth?mode=login")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/auth?mode=signup")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src={heroImage} 
            alt="Athlete at dawn" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 to-background/70" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Your Career on the Field Has Ended,{" "}
              <span className="bg-gradient-dawn bg-clip-text text-transparent">
                But Your Winning Season is Just Beginning
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A compassionate support platform helping professional athletes navigate career-ending 
              injuries and discover their next purpose.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => navigate("/auth?mode=signup")}
              >
                Start Your Transition Journey
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8"
                onClick={() => navigate("/stories")}
              >
                See Success Stories
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center shadow-card hover:shadow-elevated transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                <Activity className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-4xl font-bold mb-2">87%</h3>
              <p className="text-muted-foreground">Feel lost after career ends</p>
            </Card>

            <Card className="p-8 text-center shadow-card hover:shadow-elevated transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-4xl font-bold mb-2">62%</h3>
              <p className="text-muted-foreground">Experience depression</p>
            </Card>

            <Card className="p-8 text-center shadow-card hover:shadow-elevated transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
                <Users className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-4xl font-bold mb-2">You Can</h3>
              <p className="text-muted-foreground">Find your next purpose</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your Support System for What's Next
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built by athletes, for athletes. Every tool designed to help you rebuild your identity beyond the game.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 shadow-card">
              <h3 className="text-2xl font-bold mb-3">AI Transition Coach</h3>
              <p className="text-muted-foreground mb-4">
                Talk through your feelings with a compassionate AI coach trained in athlete mental health. 
                Available 24/7 to listen, validate, and guide you forward.
              </p>
            </Card>

            <Card className="p-8 shadow-card">
              <h3 className="text-2xl font-bold mb-3">Daily Mindset Journal</h3>
              <p className="text-muted-foreground mb-4">
                Track your emotional journey with structured daily entries. Monitor your mood, 
                celebrate wins, and build momentum toward your new goals.
              </p>
            </Card>

            <Card className="p-8 shadow-card">
              <h3 className="text-2xl font-bold mb-3">Success Stories Library</h3>
              <p className="text-muted-foreground mb-4">
                Read inspiring stories of athletes who've successfully transitioned. 
                See yourself in their journey and learn from their paths.
              </p>
            </Card>

            <Card className="p-8 shadow-card">
              <h3 className="text-2xl font-bold mb-3">Career Exploration</h3>
              <p className="text-muted-foreground mb-4">
                Discover career paths that match your transferable skills. 
                Get AI-powered suggestions and track your exploration journey.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-dawn text-primary-foreground">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Write Your Next Chapter?
          </h2>
          <p className="text-xl opacity-90">
            Join athletes who are rebuilding their identity and finding purpose beyond the game.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 mt-6"
            onClick={() => navigate("/auth?mode=signup")}
          >
            Start Free Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>Crisis Support:</strong> If you're experiencing a mental health emergency, 
            please contact the National Suicide Prevention Lifeline: <strong>988</strong>
          </p>
          <p>&copy; 2025 The Next Play Mindset. Built with empathy for athletes.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
