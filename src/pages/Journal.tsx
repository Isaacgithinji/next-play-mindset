import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Activity, ArrowLeft, Calendar, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

interface JournalEntry {
  id: string;
  entry_date: string;
  mood_rating: number;
  gratitude_1: string;
  gratitude_2: string;
  gratitude_3: string;
  challenge_faced: string;
  small_win: string;
  tomorrow_goal: string;
  private_notes: string | null;
  created_at: string;
}

const Journal = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [entryDate, setEntryDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [moodRating, setMoodRating] = useState([7]);
  const [gratitude1, setGratitude1] = useState("");
  const [gratitude2, setGratitude2] = useState("");
  const [gratitude3, setGratitude3] = useState("");
  const [challengeFaced, setChallengeFaced] = useState("");
  const [smallWin, setSmallWin] = useState("");
  const [tomorrowGoal, setTomorrowGoal] = useState("");
  const [privateNotes, setPrivateNotes] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
      } else {
        setUser(user);
        await fetchEntries(user.id);
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    // Set up realtime subscription for journal entries
    const channel = supabase
      .channel('journal-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'journal_entries',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Journal entry change:', payload);
          fetchEntries(user.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchEntries = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", userId)
        .order("entry_date", { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error("Error fetching entries:", error);
      toast.error("Failed to load journal entries");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("journal_entries")
        .insert({
          user_id: user.id,
          entry_date: entryDate,
          mood_rating: moodRating[0],
          gratitude_1: gratitude1,
          gratitude_2: gratitude2,
          gratitude_3: gratitude3,
          challenge_faced: challengeFaced,
          small_win: smallWin,
          tomorrow_goal: tomorrowGoal,
          private_notes: privateNotes || null,
        });

      if (error) throw error;

      toast.success("Journal entry saved!");
      
      // Reset form
      setEntryDate(format(new Date(), "yyyy-MM-dd"));
      setMoodRating([7]);
      setGratitude1("");
      setGratitude2("");
      setGratitude3("");
      setChallengeFaced("");
      setSmallWin("");
      setTomorrowGoal("");
      setPrivateNotes("");
      
      await fetchEntries(user.id);
    } catch (error) {
      console.error("Error saving entry:", error);
      toast.error("Failed to save journal entry");
    } finally {
      setSubmitting(false);
    }
  };

  // Prepare chart data
  const chartData = entries
    .slice(0, 30)
    .reverse()
    .map(entry => ({
      date: format(new Date(entry.entry_date), "MMM dd"),
      mood: entry.mood_rating,
    }));

  const averageMood = entries.length > 0
    ? (entries.reduce((sum, entry) => sum + entry.mood_rating, 0) / entries.length).toFixed(1)
    : "0";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-pulse">Loading journal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero animate-fade-in">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Daily Mindset Journal</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* New Entry Form */}
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                New Journal Entry
              </CardTitle>
              <CardDescription>Reflect on your day and set intentions for tomorrow</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label>Today's Mood: {moodRating[0]}/10</Label>
                  <Slider
                    value={moodRating}
                    onValueChange={setMoodRating}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Struggling</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Three Things I'm Grateful For:</Label>
                  <Input
                    placeholder="1. What made you smile today?"
                    value={gratitude1}
                    onChange={(e) => setGratitude1(e.target.value)}
                    required
                  />
                  <Input
                    placeholder="2. Who or what supported you?"
                    value={gratitude2}
                    onChange={(e) => setGratitude2(e.target.value)}
                    required
                  />
                  <Input
                    placeholder="3. What opportunity are you thankful for?"
                    value={gratitude3}
                    onChange={(e) => setGratitude3(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challenge">Today's Challenge</Label>
                  <Textarea
                    id="challenge"
                    placeholder="What obstacle did you face and how did you handle it?"
                    value={challengeFaced}
                    onChange={(e) => setChallengeFaced(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="win">Today's Small Win</Label>
                  <Textarea
                    id="win"
                    placeholder="What progress did you make, no matter how small?"
                    value={smallWin}
                    onChange={(e) => setSmallWin(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Tomorrow's Goal</Label>
                  <Textarea
                    id="goal"
                    placeholder="What's one thing you want to accomplish tomorrow?"
                    value={tomorrowGoal}
                    onChange={(e) => setTomorrowGoal(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Private Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional thoughts or reflections..."
                    value={privateNotes}
                    onChange={(e) => setPrivateNotes(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Entry"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Mood Chart & Stats */}
          <div className="space-y-8">
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Mood Trends
                </CardTitle>
                <CardDescription>Your emotional journey over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis domain={[1, 10]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="mood"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-muted-foreground">Average Mood</p>
                      <p className="text-3xl font-bold text-primary">{averageMood}/10</p>
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    <p>Start journaling to see your mood trends!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Entries */}
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
                <CardDescription>Your journaling history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {entries.length > 0 ? (
                  entries.slice(0, 10).map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">{format(new Date(entry.entry_date), "MMMM d, yyyy")}</p>
                        <span className="text-sm font-bold text-primary">Mood: {entry.mood_rating}/10</span>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><strong>Win:</strong> {entry.small_win}</p>
                        <p><strong>Tomorrow:</strong> {entry.tomorrow_goal}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    <p>No journal entries yet. Create your first entry above!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Journal;
