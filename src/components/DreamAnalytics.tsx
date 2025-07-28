import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Calendar, TrendingUp, Brain, Heart, Moon, Sparkles, Target } from "lucide-react";
import { format, startOfMonth, subMonths, isWithinInterval } from "date-fns";

interface Dream {
  id: string;
  title: string;
  description: string;
  date: string;
  mood: string;
  themes: string[];
  lucidity: string;
}

interface DreamAnalyticsProps {
  dreams: Dream[];
}

const DreamAnalytics = ({ dreams }: DreamAnalyticsProps) => {
  if (dreams.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-card/80 backdrop-blur-lg border-primary/20 shadow-mystical">
        <CardContent className="p-12 text-center">
          <TrendingUp className="h-16 w-16 mx-auto mb-4 text-primary/50" />
          <h3 className="text-xl font-semibold mb-2 text-moonlight">No Analytics Yet</h3>
          <p className="text-muted-foreground">
            Capture at least a few dreams to see insights and patterns in your dream journal.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Analytics calculations
  const totalDreams = dreams.length;
  const lucidDreams = dreams.filter(d => d.lucidity !== "not-lucid").length;
  const lucidityRate = Math.round((lucidDreams / totalDreams) * 100);

  // Most common themes
  const themeCount = dreams.reduce((acc, dream) => {
    dream.themes.forEach(theme => {
      acc[theme] = (acc[theme] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topThemes = Object.entries(themeCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([theme, count]) => ({ theme, count }));

  // Mood distribution
  const moodCount = dreams.reduce((acc, dream) => {
    acc[dream.mood] = (acc[dream.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const moodData = Object.entries(moodCount).map(([mood, count]) => ({
    mood: mood.charAt(0).toUpperCase() + mood.slice(1),
    count,
    percentage: Math.round((count / totalDreams) * 100)
  }));

  // Monthly dream frequency (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(new Date(), i));
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    
    const dreamsInMonth = dreams.filter(dream => 
      isWithinInterval(new Date(dream.date), { start: monthStart, end: monthEnd })
    ).length;

    monthlyData.push({
      month: format(monthStart, 'MMM'),
      dreams: dreamsInMonth
    });
  }

  // Color schemes for charts
  const MOOD_COLORS = {
    joyful: '#fbbf24',
    peaceful: '#6366f1',
    exciting: '#f97316',
    mysterious: '#8b5cf6',
    scary: '#ef4444',
    sad: '#3b82f6',
    confused: '#6b7280',
    neutral: '#64748b'
  };

  const CHART_COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#f97316', '#6366f1', '#ec4899'];

  const averageDreamsPerMonth = Math.round(dreams.length / 6);
  const mostCommonMood = moodData.reduce((prev, current) => (prev.count > current.count) ? prev : current);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/80 backdrop-blur-lg border-primary/20 shadow-mystical">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Dreams</p>
                <p className="text-2xl font-bold text-foreground">{totalDreams}</p>
              </div>
              <Moon className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-lg border-primary/20 shadow-mystical">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lucidity Rate</p>
                <p className="text-2xl font-bold text-foreground">{lucidityRate}%</p>
              </div>
              <Brain className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-lg border-primary/20 shadow-mystical">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Average</p>
                <p className="text-2xl font-bold text-foreground">{averageDreamsPerMonth}</p>
              </div>
              <Calendar className="h-8 w-8 text-ethereal-blue" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-lg border-primary/20 shadow-mystical">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Common Mood</p>
                <p className="text-2xl font-bold text-foreground">{mostCommonMood.mood}</p>
              </div>
              <Heart className="h-8 w-8 text-mystical-purple" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Frequency */}
        <Card className="bg-card/80 backdrop-blur-lg border-primary/20 shadow-mystical">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5 text-primary" />
              Dream Frequency (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="dreams" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mood Distribution */}
        <Card className="bg-card/80 backdrop-blur-lg border-primary/20 shadow-mystical">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Heart className="h-5 w-5 text-mystical-purple" />
              Mood Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={moodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {moodData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={MOOD_COLORS[entry.mood.toLowerCase() as keyof typeof MOOD_COLORS] || CHART_COLORS[index % CHART_COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {moodData.map((mood, index) => (
                <div key={mood.mood} className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: MOOD_COLORS[mood.mood.toLowerCase() as keyof typeof MOOD_COLORS] || CHART_COLORS[index % CHART_COLORS.length] }}
                  />
                  <span className="text-xs text-muted-foreground">{mood.mood} ({mood.percentage}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dream Themes */}
      <Card className="bg-card/80 backdrop-blur-lg border-primary/20 shadow-mystical">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Sparkles className="h-5 w-5 text-accent" />
            Most Common Dream Themes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topThemes.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topThemes} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="theme" type="category" stroke="#9ca3af" width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="flex flex-wrap gap-2">
                {topThemes.map((theme, index) => (
                  <Badge 
                    key={theme.theme} 
                    variant="outline" 
                    className="bg-primary/10 border-primary/30 text-foreground"
                  >
                    {theme.theme} ({theme.count})
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Add themes to your dreams to see pattern analysis here.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-card/80 backdrop-blur-lg border-primary/20 shadow-mystical">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Target className="h-5 w-5 text-primary" />
            Dream Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="font-semibold text-foreground mb-2">🧠 Lucidity Progress</h4>
              <p className="text-sm text-muted-foreground">
                {lucidityRate > 30 ? "Excellent" : lucidityRate > 15 ? "Good" : "Keep practicing"} lucidity rate of {lucidityRate}%. 
                {lucidityRate < 15 && " Try reality checks and dream journaling techniques to improve."}
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
              <h4 className="font-semibold text-foreground mb-2">🌙 Dream Frequency</h4>
              <p className="text-sm text-muted-foreground">
                You're averaging {averageDreamsPerMonth} dreams per month. 
                {averageDreamsPerMonth < 5 && " Consider keeping your journal closer to your bed for easier recording."}
                {averageDreamsPerMonth >= 10 && " Great job maintaining consistent dream recall!"}
              </p>
            </div>
            
            {topThemes[0] && (
              <div className="p-4 rounded-lg bg-mystical-purple/5 border border-mystical-purple/20">
                <h4 className="font-semibold text-foreground mb-2">✨ Recurring Themes</h4>
                <p className="text-sm text-muted-foreground">
                  "{topThemes[0].theme}" appears most frequently in your dreams ({topThemes[0].count} times). 
                  This might reflect current life situations or subconscious thoughts.
                </p>
              </div>
            )}
            
            <div className="p-4 rounded-lg bg-ethereal-blue/5 border border-ethereal-blue/20">
              <h4 className="font-semibold text-foreground mb-2">💫 Emotional Patterns</h4>
              <p className="text-sm text-muted-foreground">
                Your dreams are predominantly {mostCommonMood.mood.toLowerCase()}. 
                {mostCommonMood.mood === "Scary" && " Consider relaxation techniques before bed."}
                {mostCommonMood.mood === "Joyful" && " Your positive mindset shows in your dreams!"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DreamAnalytics;