import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Activity, Star, ArrowLeft } from "lucide-react";

const Stories = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const { data, error } = await supabase
          .from("success_stories")
          .select("*")
          .order("is_featured", { ascending: false })
          .order("career_end_year", { ascending: false });

        if (error) throw error;
        setStories(data || []);
      } catch (error: any) {
        toast.error("Failed to load success stories");
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Next Play Mindset</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Success Stories</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real athletes who've transitioned from career-ending injuries to fulfilling new careers. 
            Their stories prove that your athletic identity can evolve into something equally meaningful.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading stories...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {stories.map((story) => (
              <Card 
                key={story.id} 
                className={`shadow-card hover:shadow-elevated transition-all ${
                  story.is_featured ? "border-2 border-secondary" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="text-2xl mb-1">{story.athlete_name}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline">{story.former_sport}</Badge>
                        <Badge variant="secondary">{story.career_end_year}</Badge>
                      </div>
                    </div>
                    {story.is_featured && (
                      <Star className="h-6 w-6 text-secondary fill-secondary" />
                    )}
                  </div>
                  <CardDescription className="text-lg font-semibold text-primary mt-3">
                    Now: {story.new_career_path}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground">{story.story_summary}</p>
                  <div className="p-4 bg-accent rounded-lg border-l-4 border-secondary">
                    <p className="text-sm font-medium text-accent-foreground italic">
                      "{story.key_lesson}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center p-8 bg-card rounded-lg shadow-card">
          <h2 className="text-2xl font-bold mb-3">Ready to Write Your Story?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            These athletes found their path forward. With the right support and mindset, you can too.
          </p>
          <Button size="lg" onClick={() => navigate("/auth?mode=signup")}>
            Start Your Transition Journey
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Stories;
