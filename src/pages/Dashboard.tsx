import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Activity, BookOpen, MessageSquare, TrendingUp, LogOut } from "lucide-react";
import CareerSuggestions from "@/components/CareerSuggestions";
import mentalHealthBg from "@/assets/mental-health-athletes-bg.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    journalCount: 0,
    conversationCount: 0,
    averageMood: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async (userId: string) => {
    try {
      const { count: journalCount } = await supabase
        .from("journal_entries")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      const { count: conversationCount } = await supabase
        .from("conversations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      const { data: journalEntries } = await supabase
        .from("journal_entries")
        .select("mood_rating")
        .eq("user_id", userId);

      const avgMood = journalEntries && journalEntries.length > 0
        ? journalEntries.reduce((sum, entry) => sum + entry.mood_rating, 0) / journalEntries.length
        : 0;

      setStats({
        journalCount: journalCount || 0,
        conversationCount: conversationCount || 0,
        averageMood: Math.round(avgMood * 10) / 10,
      });
    } catch (error: any) {
      toast.error("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }

        setUser(user);

        // Load profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error loading profile:", profileError);
          toast.error("Failed to load profile data");
        } else if (profileData) {
          setProfile(profileData);
        }

        await fetchStats(user.id);
      } catch (error: any) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    // Set up realtime subscriptions for live stat updates
    const journalChannel = supabase
      .channel('dashboard-journal-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'journal_entries',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('Journal entry changed, updating stats');
          fetchStats(user.id);
        }
      )
      .subscribe();

    const conversationChannel = supabase
      .channel('dashboard-conversation-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversations',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('New conversation, updating stats');
          fetchStats(user.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(journalChannel);
      supabase.removeChannel(conversationChannel);
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Mental Health Symbols Background */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url(${mentalHealthBg})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 relative">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Next Play Mindset</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>Dashboard</Button>
            <Button variant="ghost" onClick={() => navigate("/coach")}>AI Coach</Button>
            <Button variant="ghost" onClick={() => navigate("/journal")}>Journal</Button>
            <Button variant="ghost" onClick={() => navigate("/stories")}>Stories</Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Welcome back, {profile?.full_name?.split(" ")[0] || "Athlete"}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Your journey continues. Every day is progress toward your next chapter.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl">{stats.journalCount}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Journal Entries
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl">{stats.conversationCount}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                AI Coach Sessions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl">
                {stats.averageMood > 0 ? stats.averageMood : "—"}/10
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Average Mood
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card 
              className="shadow-card hover:shadow-elevated transition-all cursor-pointer"
              onClick={() => navigate("/coach")}
            >
              <CardHeader>
                <MessageSquare className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Talk to Your Coach</CardTitle>
                <CardDescription>
                  Process your thoughts with our AI transition coach
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Start Session</Button>
              </CardContent>
            </Card>

            <Card 
              className="shadow-card hover:shadow-elevated transition-all cursor-pointer"
              onClick={() => navigate("/journal")}
            >
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Daily Journal</CardTitle>
                <CardDescription>
                  Reflect on today and set tomorrow's intentions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Write Entry</Button>
              </CardContent>
            </Card>

            <Card 
              className="shadow-card hover:shadow-elevated transition-all cursor-pointer"
              onClick={() => navigate("/stories")}
            >
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Success Stories</CardTitle>
                <CardDescription>
                  Read inspiring transitions from other athletes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Explore Stories</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Career Suggestions */}
        {profile && (
          <div className="mb-12">
            <CareerSuggestions
              formerSport={profile.former_sport}
              careerEndReason={profile.career_end_reason}
            />
          </div>
        )}

        {/* Profile Info */}
        {profile && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Former Sport:</strong> {profile.former_sport}</p>
              <p><strong>Career End Reason:</strong> {profile.career_end_reason}</p>
              <p><strong>Career End Date:</strong> {new Date(profile.career_end_date).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
