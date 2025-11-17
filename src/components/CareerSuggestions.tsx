import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lightbulb, Loader2, TrendingUp } from "lucide-react";

interface CareerSuggestion {
  career_field: string;
  reasoning: string;
  interest_level: number;
  next_steps: string;
}

interface CareerSuggestionsProps {
  formerSport: string;
  careerEndReason: string;
}

const CareerSuggestions = ({ formerSport, careerEndReason }: CareerSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<CareerSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("career-suggestions", {
        body: { formerSport, careerEndReason },
      });

      if (error) {
        if (error.message?.includes("429")) {
          toast.error("Rate limit exceeded. Please try again later.");
          return;
        }
        if (error.message?.includes("402")) {
          toast.error("AI service requires payment. Please contact support.");
          return;
        }
        throw error;
      }

      setSuggestions(data.suggestions);
      setHasLoaded(true);
      toast.success("Career suggestions generated!");
    } catch (error) {
      console.error("Error fetching career suggestions:", error);
      toast.error("Failed to generate career suggestions");
    } finally {
      setLoading(false);
    }
  };

  const saveToExploration = async (suggestion: CareerSuggestion) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("career_explorations").insert({
        user_id: user.id,
        career_field: suggestion.career_field,
        interest_level: suggestion.interest_level,
        notes: `${suggestion.reasoning}\n\nNext Steps:\n${suggestion.next_steps}`,
        status: "exploring",
      });

      if (error) throw error;
      toast.success(`${suggestion.career_field} saved to your career explorations!`);
    } catch (error) {
      console.error("Error saving exploration:", error);
      toast.error("Failed to save career exploration");
    }
  };

  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          AI Career Path Suggestions
        </CardTitle>
        <CardDescription>
          Get personalized career recommendations based on your athletic background
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasLoaded && (
          <Button onClick={fetchSuggestions} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Suggestions...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Get Career Suggestions
              </>
            )}
          </Button>
        )}

        {hasLoaded && suggestions.length > 0 && (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-lg space-y-3 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{suggestion.career_field}</h3>
                    <Badge variant="secondary" className="mt-1">
                      Interest Level: {suggestion.interest_level}/10
                    </Badge>
                  </div>
                  <Button size="sm" onClick={() => saveToExploration(suggestion)}>
                    Save
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
                <div className="pt-2 border-t border-border">
                  <p className="text-sm font-semibold mb-1">Next Steps:</p>
                  <p className="text-sm text-muted-foreground">{suggestion.next_steps}</p>
                </div>
              </div>
            ))}
            <Button onClick={fetchSuggestions} variant="outline" className="w-full">
              Generate New Suggestions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CareerSuggestions;
